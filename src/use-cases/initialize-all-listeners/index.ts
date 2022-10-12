import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { InitializeAllListenersUseCase } from "./initialize-all-listeners-use-case";
import { InitializeAllListenersController } from "./initialize-all-listeners-controller";
import { PrismaSendMessageRepository } from "../../repositories/prisma/prisma-send-message-repository";
import { WebSocket } from "../../websocket";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaCompanyRepository = new PrismaCompanyRepository();
const prismaSendMessageRepository = new PrismaSendMessageRepository();
const webSocket = new WebSocket();

const initializeAllListenersUseCase = new InitializeAllListenersUseCase(
  inMemoryInstanceRepository,
  prismaCompanyRepository,
  prismaSendMessageRepository,
  webSocket
);
const initializeAllListenerController = new InitializeAllListenersController(
  initializeAllListenersUseCase
);

export { initializeAllListenerController };
