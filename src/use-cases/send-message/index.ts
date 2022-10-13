import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaSendMessagesRepository } from "../../repositories/prisma/prisma-send-message-repository";
import { SendMessageController } from "./send-message-controller";
import { SendMessageUsecase } from "./send-message-use-case";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaSendMessagesRepository = new PrismaSendMessagesRepository();

const sendMessageUsecase = new SendMessageUsecase(
  inMemoryInstanceRepository,
  prismaSendMessagesRepository
);
const sendMessageController = new SendMessageController(sendMessageUsecase);

export { sendMessageController };
