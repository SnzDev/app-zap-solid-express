import { MessageMedia } from "whatsapp-web.js";
import { prisma } from "../../../../database/prisma";
import { logger } from "../../../../logger";
import { saveChatHistory } from "../../../../utils/save-chat-history";
import { InMemoryInstanceRepository } from "../../repositories/in-memory-instance-repository";

interface SendMessageUseCaseDTO {
  phone_number: string;
  message: string;
  file_url: string;
  access_key: string;
  id_message?: number;
  id_group?: number;
  id_section?: number;
  id_user?: number;
  is_startmessage?: boolean;
}

export class SendMessageUsecase {
  async execute({
    access_key,
    file_url,
    message,
    phone_number,
    id_message,
    id_group,
    id_section,
    id_user,
    is_startmessage,
  }: SendMessageUseCaseDTO) {
    if (!access_key) throw new Error("Stystem needs access_key");
    if (!message) throw new Error("System needs message");
    if (!phone_number) throw new Error("System needs phone_number");
    let body, options;
    console.log(message);

    const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();

    const existsCompany = inMemoryInstanceRepository.findOne({
      access_key,
    });
    const company = await prisma.company.findFirst({ where: { access_key } });

    if (!existsCompany || !company) throw new Error(`Instance does not exists`);

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
    const number = contact.user;

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

    await saveChatHistory({
      msg: sendMessage,
      access_key: existsCompany.access_key,
    });
    logger.info(
      `Line: ${company.name}, saveMessageHistory: ${sendMessage.from}`
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
        isStartMessage: is_startmessage,
        hour: new Date(),
        date: new Date(),
      },
    });

    if (!createMessage) throw new Error("Cannot register your message");

    return createMessage;
  }
}
