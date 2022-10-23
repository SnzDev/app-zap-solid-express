import { Buttons, MessageMedia } from "whatsapp-web.js";
import { prisma } from "../../../../database/prisma";
import { logger } from "../../../../logger";
import { saveChatHistory } from "../../../../utils/save-chat-history";
import { InMemoryInstanceRepository } from "../../repositories/in-memory-instance-repository";

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
  id_message?: number;
  id_group?: number;
  id_section?: number;
  id_user?: number;
  id_survey?: number;
  is_startmessage?: boolean;
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
    id_message,
    id_group,
    id_section,
    id_user,
    id_survey,
    is_startmessage,
  }: SendSurveyUseCaseDTO) {
    if (!access_key) throw new Error("System needs access_key");
    if (!phone_number) throw new Error("System needs phone_number");
    if (!first_option) throw new Error("System needs first_option");
    if (!first_answer) throw new Error("System needs first_answer");
    if (!second_option) throw new Error("System needs second_option");
    if (!second_answer) throw new Error("System needs second_answer");

    let body, options;
    const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();

    const companyExists = inMemoryInstanceRepository.findOne({
      access_key,
    });
    const company = await prisma.company.findFirst({ where: { access_key } });

    if (!companyExists || !company) throw new Error(`Instance does not exists`);

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
    const number = contact.user;

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
      body: body ?? message,
      options,
      chatId,
    });

    if (!sendMessage) throw new Error("Cannot send your message");
    await saveChatHistory({
      msg: sendMessage,
      access_key: companyExists.access_key,
    });
    logger.info(
      `Line: ${company.name}, saveSurveyHistory: ${sendMessage.from}`
    );
    const createMessage = await prisma.shipping_history.create({
      data: {
        id_company: company.id,
        message,
        status: sendMessage.ack,
        protocol: sendMessage.id.id,
        phone_number: number,
        id_message,
        id_group,
        id_section,
        id_user,
        id_survey,
        isStartMessage: is_startmessage,
        hour: new Date(),
        date: new Date(),
      },
    });
    if (!createMessage) throw new Error("Cannot register your message");

    return createMessage;
  }
}
