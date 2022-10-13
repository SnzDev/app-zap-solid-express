import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { InitializeListenerUseCase } from "./initialize-listener-use-case";
import { InitializeListenerController } from "./initialize-listener-controller";
import { PrismaSendMessageRepository } from "../../repositories/prisma/prisma-send-message-repository";
import { WebSocket } from "../../websocket";
import { PrismaShippingHistoryRepository } from "../../repositories/prisma/prisma-shipping-history-repository";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaShippingHistoryRepository = new PrismaShippingHistoryRepository();
const prismaSendMessageRepository = new PrismaSendMessageRepository();
const webSocket = new WebSocket();

const initializeListenerUseCase = new InitializeListenerUseCase(
  inMemoryInstanceRepository,
  prismaSendMessageRepository,
  prismaShippingHistoryRepository,
  webSocket
);
const initializeListenerController = new InitializeListenerController(
  initializeListenerUseCase
);

export { initializeListenerController };
