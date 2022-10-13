import { Buttons, MessageMedia } from "whatsapp-web.js";
import { Exception } from "../../error";
import { logger } from "../../logger";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaSendMessagesRepository } from "../../repositories/prisma/prisma-send-message-repository";

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
  constructor(
    private inMemoryInstanceRepository: InMemoryInstanceRepository,
    private prismaSendMessagesRepository: PrismaSendMessagesRepository
  ) {}

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
    let body, options;

    const instanceStatus = await this.inMemoryInstanceRepository.status({
      access_key,
    });
    const instance = await this.inMemoryInstanceRepository.findOne({
      access_key,
    });

    if (!instance || instanceStatus.status !== "CONNECTED")
      throw new Exception(
        400,
        `Instance not connected, status: ${instanceStatus.status}`
      );

    //VERIFY PHONE NUMBER
    const contact = await this.inMemoryInstanceRepository.existsNumber({
      access_key,
      phone_number,
    });
    if (!contact) throw new Exception(400, "Phone number doesn't exists");
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
        caption: `${message}\nResponda apenas: '${first_option}' ou '${second_option}'`,
      };
      message = options.caption;
    }
    //IF NOT USE BUTTONS AND FILE
    if (!use_buttons && !file_url) {
      body = `${message}\nResponda apenas: '${first_option}' ou '${second_option}'`;
      message = options.caption;
    }

    const sendMessage = await this.inMemoryInstanceRepository.sendOneMessage({
      client: instance.client,
      body,
      options,
      chatId,
    });

    if (!sendMessage) throw new Exception(400, "Cannot send your message");

    const createMessage = await this.prismaSendMessagesRepository.create({
      access_key,
      ack: sendMessage.ack,
      destiny: chatId,
      message_body: message,
      message_id: sendMessage.id.id,
      sender: sendMessage.from,
      timestamp: sendMessage.timestamp,
      file_url,
      is_survey: true,
      first_option,
      first_answer,
      second_option,
      second_answer,
    });
    if (!createMessage)
      throw new Exception(400, "Cannot register your message");

    return createMessage;
  }
}
