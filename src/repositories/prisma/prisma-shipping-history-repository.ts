import { shipping_history } from "@prisma/client";
import { ShippingHistoryRepository } from "../shipping-history-repository";
import {
  ShippingHistoryUpdateAckDTO,
  ShippingHistoryUpdateResponseDTO,
} from "../types/shipping-history-dto";
import { prisma } from "../../database/prisma";
import { logger } from "../../logger";

export class PrismaShippingHistoryRepository
  implements ShippingHistoryRepository
{
  shippingHistory = prisma.shipping_history;

  async findAll(): Promise<shipping_history[] | null> {
    return await this.shippingHistory
      .findMany()
      .then((response) => response)
      .catch((error) => {
        logger.error(` ShippingHistory: ${error}`);
        return null;
      });
  }

  async findByProtocol(protocol: string): Promise<shipping_history | null> {
    return await this.shippingHistory
      .findFirst({
        where: { protocol },
      })
      .then((response) => response)
      .catch((error) => {
        logger.error(` ShippingHistory: ${error}`);
        return null;
      });
  }

  async updateAck({
    ack,
    protocol,
  }: ShippingHistoryUpdateAckDTO): Promise<void> {
    return await this.shippingHistory
      .update({
        data: {
          status: ack,
        },
        where: { protocol },
      })
      .then(() => {})
      .catch((error) => logger.error(`ShippingHistory: ${error}`));
  }

  async updateResponse({
    protocol,
    response,
  }: ShippingHistoryUpdateResponseDTO): Promise<void> {
    const existsMessage = await this.findByProtocol(protocol);
    if (!existsMessage) return;

    return await this.shippingHistory
      .update({
        data: {
          question_response: response,
        },
        where: { protocol },
      })
      .then(() => {})
      .catch((error) => logger.error(`ShippingHistory: ${error}`));
  }
}
