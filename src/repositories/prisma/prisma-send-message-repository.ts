import { send_messages_api } from "@prisma/client";
import { SendMessagesRepository } from "../send-messages-repository";
import {
  SendMessageCreateDTO,
  SendMessagesUpdateAckDTO,
  SendMessagesUpdateResponseDTO,
} from "../types/send-messages-dto";
import { prisma } from "../../prisma";
import { logger } from "../../logger";

export class PrismaSendMessageRepository implements SendMessagesRepository {
  sendMessage = prisma.send_messages_api;

  //   create(props: SendMessageCreateDTO): Promise<send_messages_api> {

  //   }

  async findByProtocol(protocol: string): Promise<send_messages_api | null> {
    return await this.sendMessage
      .findFirst({
        where: {
          id: protocol,
        },
      })
      .then((response) => response)
      .catch((error) => {
        logger.error(` SendMessageRepository: ${error}`);
        return null;
      });
  }

  async findByIdMessage(message_id: string): Promise<send_messages_api | null> {
    return await this.sendMessage
      .findFirst({
        where: {
          message_id,
        },
      })
      .then((response) => response)
      .catch((error) => {
        logger.error(` SendMessageRepository: ${error}`);
        return null;
      });
  }

  async updateAck({ ack, protocol }: SendMessagesUpdateAckDTO): Promise<void> {
    const message = await this.findByIdMessage(protocol);
    if (!message) return;

    return await this.sendMessage
      .update({
        where: {
          id: message.id,
        },
        data: {
          ack: ack,
        },
      })
      .then(() => {})
      .catch((error) => logger.error(` ShippingHistory: ${error}`));
  }

  async updateResponse({
    protocol,
    response,
  }: SendMessagesUpdateResponseDTO): Promise<void> {
    const message = await this.findByIdMessage(protocol);
    if (!message) return;

    return await this.sendMessage
      .update({
        where: {
          id: message.id,
        },
        data: {
          response,
        },
      })
      .then(() => {})
      .catch((error) => logger.error(` ShippingHistory: ${error}`));
  }
}
