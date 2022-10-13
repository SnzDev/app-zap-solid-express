import { Exception } from "../../error";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaSendMessagesRepository } from "../../repositories/prisma/prisma-send-message-repository";

interface SendMessageUseCaseDTO {
  phone_number: string;
  message: string;
  file_url: string;
  access_key: string;
}

export class SendMessageUsecase {
  constructor(
    private inMemoryInstanceRepository: InMemoryInstanceRepository,
    private PrismaSendMessagesRepository: PrismaSendMessagesRepository
  ) {}

  async execute({
    access_key,
    file_url,
    message,
    phone_number,
  }: SendMessageUseCaseDTO) {
    const existsNumber = await this.inMemoryInstanceRepository.existsNumber({
      access_key,
      phone_number,
    });
    if (!existsNumber) throw new Exception(400, "This number not exists!");

    const sendMessage = await this.inMemoryInstanceRepository.sendMessage({
      access_key,
      message,
      phone_number: existsNumber._serialized,
      file_url,
    });

    const response = await this.PrismaSendMessagesRepository.create({
      access_key,
      file_url,
      message_body: sendMessage.message.body,
      ack: sendMessage.message.ack,
      destiny: sendMessage.message.to,
      message_id: sendMessage.message.id.id,
      sender: sendMessage.message.from,
    });
    if (!response) throw new Exception(400, "Cannot register on database");
    return response;
  }
}
