import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { InitializeListenerUseCase } from "./initialize-listener-use-case";
import { InitializeListenerController } from "./initialize-listener-controller";
import { PrismaSendMessagesRepository } from "../../repositories/prisma/prisma-send-message-repository";
import { WebSocket } from "../../websocket";
import { PrismaShippingHistoryRepository } from "../../repositories/prisma/prisma-shipping-history-repository";
import { ReceiveMessageUseCase } from "../receive-message/receive-message-use-case";
import { PrismaReceiveMessagesRepository } from "../../repositories/prisma/prisma-receive-messages-repository";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaShippingHistoryRepository = new PrismaShippingHistoryRepository();
const prismaSendMessagesRepository = new PrismaSendMessagesRepository();
const webSocket = new WebSocket();

const prismaReceiveMessagesRepository = new PrismaReceiveMessagesRepository();

const receiveMessageUseCase = new ReceiveMessageUseCase(
  prismaReceiveMessagesRepository
);

const initializeListenerUseCase = new InitializeListenerUseCase(
  inMemoryInstanceRepository,
  prismaSendMessagesRepository,
  prismaShippingHistoryRepository,
  receiveMessageUseCase,
  webSocket
);
const initializeListenerController = new InitializeListenerController(
  initializeListenerUseCase
);

export { initializeListenerController };
