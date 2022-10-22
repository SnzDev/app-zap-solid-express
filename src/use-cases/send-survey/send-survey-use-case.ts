import { Buttons, MessageMedia } from "whatsapp-web.js";
import { prisma } from "../../database/prisma";
import { logger } from "../../logger";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";

interface SendSurveyUseCaseDTO {
  access_key: string;
  message: string;
  phone_number: string;
  first_option: string;
  first_answer: string;
  second_option: string;
  second_answer: string;
  file_url?: string;
  use_buttons?: boolean;
}

export class SendSurveyUseCase {
  async execute({
    access_key,
    first_answer,
    first_option,
    phone_number,
    message,
    second_answer,
    second_option,
    file_url,
    use_buttons,
  }: SendSurveyUseCaseDTO) {
    if (!access_key) throw new Error("System needs access_key");
    if (!phone_number) throw new Error("System needs phone_number");
    if (!first_option) throw new Error("System needs first_option");
    if (!first_answer) throw new Error("System needs first_answer");
    if (!second_option) throw new Error("System needs second_option");
    if (!second_answer) throw new Error("System needs second_answer");

    let body, options;
    const inMemoryInstanceRepository = new InMemoryInstanceRepository();

    const companyExists = inMemoryInstanceRepository.findOne({
      access_key,
    });

    if (!companyExists) throw new Error(`Instance does not exists`);

    const instanceStatus = await inMemoryInstanceRepository.status({
      client: companyExists.client,
    });

    if (instanceStatus.status !== "CONNECTED")
      throw new Error(`Instance is not connected`);

    //VERIFY PHONE NUMBER
    const contact = await inMemoryInstanceRepository.existsNumber({
      client: companyExists.client,
      phone_number,
    });
    if (!contact) throw new Error("Phone number doesn't exists");
    const chatId = contact._serialized;
    //IF USE BUTTONS
    if (use_buttons)
      body = new Buttons(message, [
        { id: "first_option", body: first_option },
        { id: "second_option", body: second_option },
      ]);

    //IF NOT USE BUTTONS AND ATTACH FILE
    if (!use_buttons && file_url) {
      body = await MessageMedia.fromUrl(file_url)
        .then((response) => response)
        .catch((error) =>
          logger.error(`access_key: ${access_key}, error: ${error}`)
        );
      options = {
        caption: `${message}\n\nResponda apenas: '${first_option}' ou '${second_option}'`,
      };
    }
    //IF NOT USE BUTTONS AND FILE
    if (!use_buttons && !file_url) {
      body = `${message}\n\nResponda apenas: '${first_option}' ou '${second_option}'`;
      message = body;
    }

    const sendMessage = await inMemoryInstanceRepository.sendMessage({
      client: companyExists.client,
      body: options?.caption ?? message,
      options,
      chatId,
    });

    if (!sendMessage) throw new Error("Cannot send your message");

    const createMessage = await prisma.send_messages_api.create({
      data: {
        access_key,
        ack: sendMessage.ack,
        destiny: chatId,
        message_body: options?.caption ?? message,
        message_id: sendMessage.id.id,
        sender: sendMessage.from,
        timestamp: sendMessage.timestamp,
        file_url,
        is_survey: true,
        first_option,
        first_answer,
        second_option,
        second_answer,
      },
    });
    if (!createMessage) throw new Error("Cannot register your message");

    return createMessage;
  }
}
