import { PrismaReceiveMessagesRepository } from "../../repositories/prisma/prisma-receive-messages-repository";
import { logger } from "../../logger";
import { CreateDTO } from "../../repositories/types/receive-messages-dto";

export class ReceiveMessageUseCase {
  constructor(
    private prismaReceiveMessagesRepository: PrismaReceiveMessagesRepository
  ) {}

  async execute(props: CreateDTO) {
    try {
      return await this.prismaReceiveMessagesRepository.create({
        ...props,
      });
    } catch (e) {
      return logger.info(`ReceiveMessages: ${e}`);
    }
  }
}
