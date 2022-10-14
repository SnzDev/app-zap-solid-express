import { Exception } from "../../error";
import { logger } from "../../logger";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { PrismaShippingHistoryRepository } from "../../repositories/prisma/prisma-shipping-history-repository";
import { PrismaSendMessagesRepository } from "../../repositories/prisma/prisma-send-message-repository";
import { WebSocket } from "../../websocket";
import { ReceiveMessageUseCase } from "../receive-message/receive-message-use-case";
import fs from "fs";
import mime from "mime-types";

export class InitializeListenerUseCase {
  constructor(
    private inMemoryInstanceRepository: InMemoryInstanceRepository,
    private PrismaSendMessagesRepository: PrismaSendMessagesRepository,
    private PrismaShippingHistoryRepository: PrismaShippingHistoryRepository,
    private receiveMessageUseCase: ReceiveMessageUseCase,
    private webSocket: WebSocket
  ) {}

  execute(access_key: string) {
    const instance = this.inMemoryInstanceRepository.findOne({ access_key });
    if (!instance)
      throw new Exception(
        400,
        "Not initialized listener because instance not started"
      );

    instance.client.on("qr", (qr) => {
      logger.info(`access_key: ${instance.access_key}, qr: ${qr}`);

      this.webSocket.sendQrCode({ access_key: instance.access_key, qr });
    });

    instance.client.once("authenticated", () => {
      logger.info(`access_key: ${instance.access_key}, authenticated: ${true}`);
      instance.client.removeListener("qr", () => {});
    });

    instance.client.once("ready", () => {
      logger.info(`access_key: ${instance.access_key}, ready: ${true}`);
      this.webSocket.sendConnected({ access_key: instance.access_key });
    });

    // instance.client.on("message_create", async (msg) => {
    //   const messageId = await this.PrismaSendMessagesRepository.findByIdMessage(
    //     msg.id.id
    //   );
    //   if (messageId || msg.isStatus) return;

    //   await this.PrismaSendMessagesRepository.create({
    //     access_key,
    //     message_body: msg.body,
    //     ack: msg.ack,
    //     destiny: msg.to,
    //     message_id: msg.id.id,
    //     sender: msg.from,
    //     timestamp: msg.timestamp,
    //   });

    //   logger.info(
    //     `access_key: ${instance.access_key}, Message outside startmessage!`
    //   );
    // });

    instance.client.on("message", async (msg) => {
      let file_url;

      //RETURN IF IT'S FROM STATUS
      //RETURN IF IT'S FROM GROUP
      if (msg.isStatus || msg.from.includes("@g.us")) return;

      if (msg.hasMedia) {
        const media = await msg.downloadMedia();
        if (media) {
          const format = mime.extension(media.mimetype);
          try {
            fs.writeFileSync(
              `./public/${access_key}/${msg.timestamp}-${msg.id.id}.${format}`,
              media.data,
              { encoding: "base64" }
            );
            file_url = `./public/${access_key}/${msg.timestamp}-${msg.id.id}.${format}`;
          } catch (e) {
            logger.error(`DownloadMedia: ${e}`);
          }
        }
      }

      logger.info(`access_key: ${instance.access_key}, message: ${msg.from}`);
      const receiveMessage = await this.receiveMessageUseCase.execute({
        access_key,
        device_type: msg.deviceType,
        from: msg.from,
        has_media: msg.hasMedia,
        file_url,
        message_body: msg.body,
        message_id: msg.id.id,
        timestamp: msg.timestamp,
        to: msg.to,
      });

      const lastSend = await this.PrismaSendMessagesRepository.findLast(
        msg.from
      );
      if (!lastSend) return;

      if (!lastSend.is_survey && !lastSend.response) {
        await this.PrismaSendMessagesRepository.updateResponse({
          protocol: lastSend.id,
          response: msg.body,
        });
        await this.PrismaShippingHistoryRepository.updateResponse({
          protocol: lastSend.id,
          response: msg.body,
        });
      }
      if (lastSend.is_survey && !lastSend.response) {
        if (msg.body === lastSend.first_option) {
          await this.PrismaSendMessagesRepository.updateResponse({
            protocol: lastSend.id,
            response: msg.body,
          });
          await this.PrismaShippingHistoryRepository.updateResponse({
            protocol: lastSend.id,
            response: msg.body,
          });
          await this.inMemoryInstanceRepository.sendOneMessage({
            body: lastSend.first_answer ?? "Resposta registrada",
            chatId: msg.from,
            client: instance.client,
            options: undefined,
          });
          return;
        }
        if (msg.body === lastSend.second_option) {
          await this.PrismaSendMessagesRepository.updateResponse({
            protocol: lastSend.id,
            response: msg.body,
          });
          await this.PrismaShippingHistoryRepository.updateResponse({
            protocol: lastSend.id,
            response: msg.body,
          });
          await this.inMemoryInstanceRepository.sendOneMessage({
            body: lastSend.first_answer ?? "Resposta registrada",
            chatId: msg.from,
            client: instance.client,
            options: undefined,
          });
          return;
        }
        await this.inMemoryInstanceRepository.sendOneMessage({
          body: `Responda apenas: ${lastSend.first_option} ou ${lastSend.second_option}`,
          chatId: msg.from,
          client: instance.client,
          options: undefined,
        });
      }
    });

    instance.client.on("message_ack", async (msg) => {
      if (msg.to.includes("@g.us")) return;
      logger.info(
        `access_key: ${instance.access_key}, message_ack: ${msg.ack}`
      );
      await this.PrismaSendMessagesRepository.updateAck({
        ack: msg.ack,
        protocol: msg.id.id,
      });
      const sendMessage =
        await this.PrismaSendMessagesRepository.findByIdMessage(msg.id.id);
      if (!sendMessage) return;

      const isStartmessage =
        await this.PrismaShippingHistoryRepository.findByProtocol(
          sendMessage.id
        );

      if (!isStartmessage) return;

      await this.PrismaShippingHistoryRepository.updateAck({
        ack: msg.ack,
        protocol: sendMessage?.id,
      });
    });

    instance.client.on("disconnected", (disconnected) => {
      logger.info(
        `access_key: ${instance.access_key}, disconnected: ${disconnected}`
      );
    });
  }
}
