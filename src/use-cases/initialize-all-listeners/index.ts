import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { InitializeAllListenersUseCase } from "./initialize-all-listeners-use-case";
import { InitializeAllListenersController } from "./initialize-all-listeners-controller";
import { PrismaSendMessageRepository } from "../../repositories/prisma/prisma-send-message-repository";
import { WebSocket } from "../../websocket";
import { InitializeListenerUseCase } from "../initialize-listener/initialize-listener-use-case";
import { PrismaShippingHistoryRepository } from "../../repositories/prisma/prisma-shipping-history-repository";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaSendMessageRepository = new PrismaSendMessageRepository();
const webSocket = new WebSocket();
const prismaShippingHistoryRepository = new PrismaShippingHistoryRepository();
const initializeListenerUseCase = new InitializeListenerUseCase(
  inMemoryInstanceRepository,
  prismaSendMessageRepository,
  prismaShippingHistoryRepository,
  webSocket
);

const initializeAllListenersUseCase = new InitializeAllListenersUseCase(
  inMemoryInstanceRepository,
  initializeListenerUseCase
);
const initializeAllListenerController = new InitializeAllListenersController(
  initializeAllListenersUseCase
);

export { initializeAllListenerController };
