import { MessageMedia } from "whatsapp-web.js";
import { prisma } from "../../database/prisma";
import { logger } from "../../logger";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaSendMessagesRepository } from "../../repositories/prisma/prisma-send-message-repository";

interface SendMessageUseCaseDTO {
  phone_number: string;
  message: string;
  file_url: string;
  access_key: string;
}

export class SendMessageUsecase {
  async execute({
    access_key,
    file_url,
    message,
    phone_number,
  }: SendMessageUseCaseDTO) {
    if (!access_key) throw new Error("Stystem needs access_key");
    if (!message) throw new Error("System needs message");
    if (!phone_number) throw new Error("System needs phone_number");
    let body, options;

    const inMemoryInstanceRepository = new InMemoryInstanceRepository();

    const instance = await inMemoryInstanceRepository.findOne({
      access_key,
    });
    const instanceStatus = await inMemoryInstanceRepository.status({
      access_key,
    });

    if (!instance || instanceStatus.status !== "CONNECTED")
      throw new Error(
        `Instance not connected, status: ${instanceStatus.status}`
      );

    //VERIFY PHONE NUMBER
    const contact = await inMemoryInstanceRepository.existsNumber({
      access_key,
      phone_number,
    });
    if (!contact) throw new Error("This phone_number doesn't exists");
    const chatId = contact._serialized;

    //IF ATTACH FILE
    if (file_url) {
      body = await MessageMedia.fromUrl(file_url);
      options = {
        caption: `${message}`,
      };
    }

    const sendMessage = await inMemoryInstanceRepository.sendMessage({
      client: instance.client,
      body: body ?? message,
      options,
      chatId,
    });

    if (!sendMessage) throw new Error("Cannot send your message");

    const createMessage = await prisma.send_messages_api.create({
      data: {
        access_key,
        ack: sendMessage.ack,
        destiny: chatId,
        message_body: message,
        message_id: sendMessage.id.id,
        sender: sendMessage.from,
        timestamp: sendMessage.timestamp,
        file_url,
      },
    });

    if (!createMessage) throw new Error("Cannot register your message");

    return createMessage;
  }
}
