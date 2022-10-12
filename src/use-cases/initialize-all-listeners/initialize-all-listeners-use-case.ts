import { logger } from "../../logger";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { PrismaSendMessageRepository } from "../../repositories/prisma/prisma-send-message-repository";
import { WebSocket } from "../../websocket";

export class InitializeAllListenersUseCase {
  constructor(
    private inMemoryInstanceRepository: InMemoryInstanceRepository,
    private prismaCompanyRepository: PrismaCompanyRepository,
    private prismaSendMessageRepository: PrismaSendMessageRepository,
    private webSocket: WebSocket
  ) {}

  execute() {
    const instances = this.inMemoryInstanceRepository.findAll();
    if (!instances) return;

    instances.map((instance) => {
      instance.client.on("qr", (qr) => {
        logger.info(`access_key: ${instance.access_key}, qr: ${qr}`);

        this.webSocket.sendQrCode({ access_key: instance.access_key, qr });
      });

      instance.client.once("authenticated", () => {
        logger.info(
          `access_key: ${instance.access_key}, authenticated: ${true}`
        );
        instance.client.removeListener("qr", () => {});
      });

      instance.client.once("ready", () => {
        logger.info(`access_key: ${instance.access_key}, ready: ${true}`);
        this.webSocket.sendConnected({ access_key: instance.access_key });
      });

      instance.client.on("message", (msg) => {
        if (msg.isStatus) return;
        logger.info(`access_key: ${instance.access_key}, message: ${msg.body}`);
      });

      instance.client.on("message_ack", async (msg) => {
        logger.info(
          `access_key: ${instance.access_key}, message_ack: ${msg.ack}`
        );
        await this.prismaSendMessageRepository.updateAck({
          ack: msg.ack,
          protocol: msg.id.id,
        });
      });

      instance.client.on("disconnected", (disconnected) => {
        logger.info(
          `access_key: ${instance.access_key}, disconnected: ${disconnected}`
        );
      });
    });
  }
}
