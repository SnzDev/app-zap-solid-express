import { receive_messages_api } from "@prisma/client";
import { ReceiveMessagesRepository } from "../receive-messages";
import { CreateDTO } from "../types/receive-messages-dto";
import { prisma } from "../../database/prisma";
import { logger } from "../../logger";

export class PrismaReceiveMessagesRepository
  implements ReceiveMessagesRepository
{
  receiveMessages = prisma.receive_messages_api;

  async create(props: CreateDTO): Promise<void | receive_messages_api> {
    return await this.receiveMessages
      .create({
        data: { ...props },
      })
      .then((response) => response)
      .catch((error) => logger.error(`ReceiveMessage: ${error}`));
  }
  async findFrom(from: string): Promise<null | receive_messages_api> {
    return await this.receiveMessages
      .findFirst({
        where: { from },
      })
      .then((response) => response)
      .catch((error) => {
        logger.error(`ReceiveMessage: ${error}`);
        return null;
      });
  }
  async findTo(to: string): Promise<null | receive_messages_api> {
    return await this.receiveMessages
      .findFirst({
        where: { to },
      })
      .then((response) => response)
      .catch((error) => {
        logger.error(`ReceiveMessage: ${error}`);
        return null;
      });
  }
  async findAccessKey(
    access_key: string
  ): Promise<null | receive_messages_api> {
    return await this.receiveMessages
      .findFirst({
        where: { access_key },
      })
      .then((response) => response)
      .catch((error) => {
        logger.error(`ReceiveMessage: ${error}`);
        return null;
      });
  }
}
