import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaSendMessagesRepository } from "../../repositories/prisma/prisma-send-message-repository";
import { SendSurveyUseCase } from "./send-survey-use-case";
import { SendSurveyController } from "./send-survey-controller";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaSendMessagesRepository = new PrismaSendMessagesRepository();

const sendSurveyUseCase = new SendSurveyUseCase(
  inMemoryInstanceRepository,
  prismaSendMessagesRepository
);
const sendSurveyController = new SendSurveyController(sendSurveyUseCase);

export { sendSurveyController };
