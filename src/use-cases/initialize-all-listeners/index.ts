import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { InitializeAllListenersUseCase } from "./initialize-all-listeners-use-case";
import { InitializeAllListenerController } from "./initialize-all-listeners-controller";
import { PrismaSendMessageRepository } from "../../repositories/prisma/prisma-send-message-repository";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaCompanyRepository = new PrismaCompanyRepository();
const prismaSendMessageRepository = new PrismaSendMessageRepository();

const initializeAllListenersUseCase = new InitializeAllListenersUseCase(
  inMemoryInstanceRepository,
  prismaCompanyRepository,
  prismaSendMessageRepository
);
const initializeAllListenerController = new InitializeAllListenerController(
  initializeAllListenersUseCase
);

export { initializeAllListenerController };
