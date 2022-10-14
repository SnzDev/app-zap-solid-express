import { send_messages_api } from "@prisma/client";
import { SendMessagesRepository } from "../send-messages-repository";
import {
  SendMessageCreateDTO,
  SendMessagesUpdateAckDTO,
  SendMessagesUpdateResponseDTO,
} from "../types/send-messages-dto";
import { prisma } from "../../prisma";
import { logger } from "../../logger";

export class PrismaSendMessagesRepository implements SendMessagesRepository {
  sendMessages = prisma.send_messages_api;

  async create(props: SendMessageCreateDTO): Promise<send_messages_api | void> {
    const response = await this.sendMessages
      .create({ data: { ...props } })
      .then((response) => response)
      .catch((error) => {
        logger.error(`SendMessageRepository: ${error}`);
      });

    return response;
  }

  async findByProtocol(protocol: string): Promise<send_messages_api | null> {
    return await this.sendMessages
      .findFirst({
        where: {
          id: protocol,
        },
      })
      .then((response) => response)
      .catch((error) => {
        logger.error(`SendMessageRepository: ${error}`);
        return null;
      });
  }

  async findByIdMessage(message_id: string): Promise<send_messages_api | null> {
    return await this.sendMessages
      .findFirst({
        where: {
          message_id,
        },
      })
      .then((response) => response)
      .catch((error) => {
        logger.error(`SendMessageRepository: ${error}`);
        return null;
      });
  }

  async updateAck({ ack, protocol }: SendMessagesUpdateAckDTO): Promise<void> {
    const message = await this.findByIdMessage(protocol);
    if (!message) return;

    return await this.sendMessages
      .update({
        where: {
          id: message.id,
        },
        data: {
          ack: ack,
        },
      })
      .then(() => {})
      .catch((error) =>
        logger.error(
          `ShippingHistory: don't have this message id on database, error: ${error}`
        )
      );
  }

  async updateResponse({
    protocol,
    response,
  }: SendMessagesUpdateResponseDTO): Promise<void> {
    const message = await this.findByProtocol(protocol);
    if (!message) return;

    return await this.sendMessages
      .update({
        where: {
          id: message.id,
        },
        data: {
          response,
        },
      })
      .then(() => {})
      .catch((error) => logger.error(`ShippingHistory: ${error}`));
  }
  async findLast(destiny: string): Promise<send_messages_api | void> {
    return await this.sendMessages
      .findMany({
        where: { destiny },
        orderBy: { timestamp: "desc" },
      })
      .then((response) => response[0])
      .catch((error) => logger.error(`ShippingHistory: ${error}`));
  }
}
