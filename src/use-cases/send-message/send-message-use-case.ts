import { MessageMedia } from "whatsapp-web.js";
import { prisma } from "../../database/prisma";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";

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

    const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();

    const existsCompany = inMemoryInstanceRepository.findOne({
      access_key,
    });

    if (!existsCompany) throw new Error(`Instance does not exists`);

    const instanceStatus = await inMemoryInstanceRepository.status({
      client: existsCompany.client,
    });

    if (instanceStatus.status !== "CONNECTED")
      throw new Error(`Instance is not connected`);

    //VERIFY PHONE NUMBER
    const contact = await inMemoryInstanceRepository.existsNumber({
      client: existsCompany.client,
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
      client: existsCompany.client,
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
        message_body: options?.caption ?? message,
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
