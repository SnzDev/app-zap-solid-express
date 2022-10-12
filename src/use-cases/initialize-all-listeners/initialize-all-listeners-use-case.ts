import { logger } from "../../logger";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { PrismaSendMessageRepository } from "../../repositories/prisma/prisma-send-message-repository";

export class InitializeAllListenersUseCase {
  constructor(
    private inMemoryInstanceRepository: InMemoryInstanceRepository,
    private prismaCompanyRepository: PrismaCompanyRepository,
    private prismaSendMessageRepository: PrismaSendMessageRepository
  ) {}

  execute() {
    const instances = this.inMemoryInstanceRepository.findAll();
    if (!instances) return;

    instances.map((instance) => {
      instance.client.on("qr", (qr) => {
        logger.info(`access_key: ${instance.access_key}, qr: ${qr}`);
      });

      instance.client.once("authenticated", () => {
        logger.info(
          `access_key: ${instance.access_key}, authenticated: ${true}`
        );
        instance.client.removeListener("qr", () => {});
      });

      instance.client.once("ready", () => {
        logger.info(`access_key: ${instance.access_key}, ready: ${true}`);
      });

      instance.client.on("message", (msg) => {
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
