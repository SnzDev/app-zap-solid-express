import { logger } from "../../logger";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { PrismaSendMessagesRepository } from "../../repositories/prisma/prisma-send-message-repository";
import { WebSocket } from "../../websocket";
import { InitializeListenerUseCase } from "../initialize-listener/initialize-listener-use-case";

export class InitializeAllListenersUseCase {
  constructor(
    private inMemoryInstanceRepository: InMemoryInstanceRepository,
    private intializeListenerUseCase: InitializeListenerUseCase
  ) {}

  execute() {
    const instances = this.inMemoryInstanceRepository.findAll();
    if (!instances) return;

    instances.map(async (instance) => {
      await this.intializeListenerUseCase.execute(instance.access_key);
    });
  }
}
