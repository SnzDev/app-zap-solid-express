import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaSendMessageRepository } from "../../repositories/prisma/prisma-send-message-repository";
import { SendMessageController } from "./send-message-controller";
import { SendMessageUsecase } from "./send-message-use-case";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaSendMessageRepository = new PrismaSendMessageRepository();

const sendMessageUsecase = new SendMessageUsecase(
  inMemoryInstanceRepository,
  prismaSendMessageRepository
);
const sendMessageController = new SendMessageController(sendMessageUsecase);

export { sendMessageController };
