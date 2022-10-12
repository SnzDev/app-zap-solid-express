import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { InitializeListenerUseCase } from "./initialize-listener-use-case";
import { InitializeListenerController } from "./initialize-listener-controller";
import { PrismaSendMessageRepository } from "../../repositories/prisma/prisma-send-message-repository";
import { WebSocket } from "../../websocket";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaCompanyRepository = new PrismaCompanyRepository();
const prismaSendMessageRepository = new PrismaSendMessageRepository();
const webSocket = new WebSocket();

const initializeListenerUseCase = new InitializeListenerUseCase(
  inMemoryInstanceRepository,
  prismaCompanyRepository,
  prismaSendMessageRepository,
  webSocket
);
const initializeListenerController = new InitializeListenerController(
  initializeListenerUseCase
);

export { initializeListenerController };
