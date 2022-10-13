import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { InitializeAllListenersUseCase } from "./initialize-all-listeners-use-case";
import { InitializeAllListenersController } from "./initialize-all-listeners-controller";
import { PrismaSendMessagesRepository } from "../../repositories/prisma/prisma-send-message-repository";
import { WebSocket } from "../../websocket";
import { InitializeListenerUseCase } from "../initialize-listener/initialize-listener-use-case";
import { PrismaShippingHistoryRepository } from "../../repositories/prisma/prisma-shipping-history-repository";
import { ReceiveMessageUseCase } from "../receive-message/receive-message-use-case";
import { PrismaReceiveMessagesRepository } from "../../repositories/prisma/prisma-receive-messages-repository";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaSendMessagesRepository = new PrismaSendMessagesRepository();
const webSocket = new WebSocket();
const prismaShippingHistoryRepository = new PrismaShippingHistoryRepository();

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

const initializeAllListenersUseCase = new InitializeAllListenersUseCase(
  inMemoryInstanceRepository,
  initializeListenerUseCase
);
const initializeAllListenerController = new InitializeAllListenersController(
  initializeAllListenersUseCase
);

export { initializeAllListenerController };
