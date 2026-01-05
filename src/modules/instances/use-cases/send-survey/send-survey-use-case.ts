import { Buttons, MessageMedia } from "whatsapp-web.js";
import { prisma } from "../../../../database/prisma";
import { logger } from "../../../../logger";
import { saveChatHistory } from "../../../../utils/save-chat-history";
import { InMemoryInstanceRepository } from "../../repositories/in-memory-instance-repository";

interface SendSurveyUseCaseDTO {
  access_key: string;
  message: string;
  phone_number: string;
  first_option: string;
  first_answer: string;
  second_option: string;
  second_answer: string;
  file_url?: string;
  use_buttons?: boolean;
  id_message?: number;
  id_group?: number;
  id_section?: number;
  id_user?: number;
  id_survey?: number;
  is_startmessage?: boolean;
}

export class SendSurveyUseCase {
  async execute({
    access_key,
    first_answer,
    first_option,
    phone_number,
    message,
    second_answer,
    second_option,
    file_url,
    use_buttons,
    id_message,
    id_group,
    id_section,
    id_user,
    id_survey,
    is_startmessage,
  }: SendSurveyUseCaseDTO) {
    if (!access_key) throw new Error("System needs access_key");
    if (!phone_number) throw new Error("System needs phone_number");
    if (!first_option) throw new Error("System needs first_option");
    if (!first_answer) throw new Error("System needs first_answer");
    if (!second_option) throw new Error("System needs second_option");
    if (!second_answer) throw new Error("System needs second_answer");

    logger.info(
      `[SURVEY] Starting survey send - access_key: ${access_key}, phone: ${phone_number}, use_buttons: ${use_buttons ?? false}, id_survey: ${id_survey ?? "N/A"}`
    );

    let body, options;
    const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();

    const companyExists = inMemoryInstanceRepository.findOne({
      access_key,
    });
    const company = await prisma.company.findFirst({ where: { access_key } });

    if (!companyExists || !company) throw new Error(`Instance does not exists`);

    const instanceStatus = await inMemoryInstanceRepository.status({
      client: companyExists.client,
    });

    if (instanceStatus.status !== "CONNECTED")
      throw new Error(`Instance is not connected`);

    //VERIFY PHONE NUMBER
    const contact = await inMemoryInstanceRepository.existsNumber({
      client: companyExists.client,
      phone_number,
    });
    if (!contact) throw new Error("Phone number doesn't exists");
    const chatId = contact._serialized;
    const number = contact.user;

    //IF USE BUTTONS
    if (use_buttons) {
      logger.info(
        `[SURVEY] Survey with buttons - access_key: ${access_key}, phone: ${phone_number}, id_survey: ${id_survey ?? "N/A"}`
      );
      body = new Buttons(message, [
        { id: "first_option", body: first_option },
        { id: "second_option", body: second_option },
      ]);
    }

    //IF NOT USE BUTTONS AND ATTACH FILE
    if (!use_buttons && file_url) {
      logger.info(
        `[SURVEY_NO_BUTTONS] Survey without buttons with file - access_key: ${access_key}, phone: ${phone_number}, file_url: ${file_url}, id_survey: ${id_survey ?? "N/A"}`
      );
      body = await MessageMedia.fromUrl(file_url)
        .then((response) => response)
        .catch((error) =>
          logger.error(`[SURVEY] access_key: ${access_key}, error downloading file: ${error}`)
        );
      options = {
        caption: `${message}\n\nResponda apenas: '${first_option}' ou '${second_option}'`,
      };
    }
    //IF NOT USE BUTTONS AND FILE
    if (!use_buttons && !file_url) {
      logger.info(
        `[SURVEY_NO_BUTTONS] Survey without buttons text only - access_key: ${access_key}, phone: ${phone_number}, first_option: "${first_option}", second_option: "${second_option}", id_survey: ${id_survey ?? "N/A"}`
      );
      body = `${message}\n\nResponda apenas: '${first_option}' ou '${second_option}'`;
      message = body;
    }

    const surveyType = use_buttons
      ? "with buttons"
      : file_url
      ? "without buttons with file"
      : "without buttons text only";

    logger.info(
      `[SURVEY] Preparing to send message - access_key: ${access_key}, phone: ${phone_number}, type: ${surveyType}, id_survey: ${id_survey ?? "N/A"}`
    );

    const sendMessage = await inMemoryInstanceRepository.sendMessage({
      client: companyExists.client,
      body: body ?? message,
      options,
      chatId,
    });

    if (!sendMessage) throw new Error("Cannot send your message");

    logger.info(
      `[SURVEY] Message sent successfully - access_key: ${access_key}, phone: ${phone_number}, message_id: ${sendMessage.id.id}, id_survey: ${id_survey ?? "N/A"}`
    );

    await saveChatHistory({
      msg: sendMessage,
      access_key: companyExists.access_key,
    });

    logger.info(
      `[SURVEY] Chat history saved - Line: ${company.name}, saveSurveyHistory: ${sendMessage.from}, id_survey: ${id_survey ?? "N/A"}`
    );

    logger.info(
      `[SURVEY] Creating shipping_history - access_key: ${access_key}, phone: ${phone_number}, id_survey: ${id_survey ?? "N/A"}`
    );

    const createMessage = await prisma.shipping_history.create({
      data: {
        id_company: company.id,
        message,
        status: sendMessage.ack,
        protocol: sendMessage.id.id,
        phone_number: number,
        id_message,
        id_group,
        id_section,
        id_user,
        id_survey,
        isStartMessage: is_startmessage,
        hour: new Date(),
        date: new Date(),
      },
    });

    if (!createMessage) throw new Error("Cannot register your message");

    logger.info(
      `[SURVEY] Survey successfully registered - access_key: ${access_key}, phone: ${phone_number}, shipping_id: ${createMessage.id}, id_survey: ${id_survey ?? "N/A"}`
    );

    return createMessage;
  }
}
