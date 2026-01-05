import { logger } from "../../../../logger";
import { prisma } from "../../../../database/prisma";
import { InMemoryInstanceRepository } from "../../repositories/in-memory-instance-repository";
import { SaveIfHaveFile } from "../../../../utils/save-file";
import { sanitizeString } from "../../../../utils/sanitize-string";
import { saveChatHistory } from "../../../../utils/save-chat-history";
import { SendMessageUsecase } from "../send-message/send-message-use-case";

export class InitializeListenerUseCase {
  async execute(access_key: string) {
    let qrCounter = 0;
    if (!access_key) throw new Error("System needs access_key");

    const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
    const existsCompany = inMemoryInstanceRepository.findOne({ access_key });
    if (!existsCompany) throw new Error("Instance does not exists");
    const company = await prisma.company.findFirstOrThrow({
      where: { access_key },
    });

    existsCompany.client.on("qr", (qr) => {
      qrCounter++;
      prisma.company
        .update({
          where: { access_key: existsCompany.access_key },
          data: { qr: qr },
        })
        .then(() =>
          logger.info(`Line: ${company.name}, qrcode update nº: ${qrCounter}`)
        )
        .catch((e: Error) =>
          logger.error(`Line: ${company.name}, qrUpdateError: ${e}`)
        );

      if (qrCounter > 1) {
        existsCompany.client.destroy();
        return logger.info(
          `Line: ${company.name}, qrcode destroyed automatically`
        );
      }
    });

    existsCompany.client.once("ready", () => {
      existsCompany.client.removeListener("qr", () => {});
      const clientInfo = existsCompany.client.info;
      prisma.company
        .update({
          data: {
            app: clientInfo.pushname ?? undefined,
            line: clientInfo.wid.user,
            qr: "",
          },
          where: { access_key: existsCompany.access_key },
        })
        .then(() => logger.info(`Line: ${company.name}, qrcode removed`))
        .catch((e: Error) =>
          logger.error(`Line: ${company.name}, updateClientInfo: ${e}`)
        );

      logger.info(`Line: ${company.name}, ready to use`);
    });

    existsCompany.client.on("message_create", async (msg) => {
      //RETURN IF IT'S FROM STATUS
      //RETURN IF IT'S FROM GROUP
      if (msg.isStatus || msg.from.includes("@g.us")) return;

      // const file_url = await SaveIfHaveFile(existsCompany.access_key, msg);
      // if (file_url) logger.info(`Line: ${company.name}, File: ${file_url}`);

      if (msg.fromMe) {
        return logger.info(`Line: ${company.name}, msgSend`);
      }
      await saveChatHistory({ msg, access_key: existsCompany.access_key });
      logger.info(`Line: ${company.name}, saveMessageHistory: ${msg.from}`);
      logger.info(`Line: ${company.name}, msgReceive`);
      const sendMessageUseCase = new SendMessageUsecase();

      // Extract phone number, handling LID users
      let number: string;
      const [fromId] = msg.from.split("@");
      
      // Check if it's a LID user (format: 275011101319237@lid)
      const isLidUser = msg.from.includes("@lid");
      
      if (isLidUser) {
        try {
          const contactInfo = await existsCompany.client.getContactLidAndPhone([msg.from]);
          if (contactInfo && contactInfo.length > 0 && contactInfo[0].pn) {
            // Extract phone number from format: 558699135090@c.us
            const [phoneNumber] = contactInfo[0].pn.split("@");
            number = phoneNumber;
            logger.info(
              `[SURVEY] LID user detected - Line: ${company.name}, from: ${msg.from}, phone: ${number}`
            );
          } else {
            // Fallback to original extraction if getContactLidAndPhone doesn't return phone
            number = fromId;
            logger.info(
              `[SURVEY] LID user but no phone found - Line: ${company.name}, from: ${msg.from}, using: ${number}`
            );
          }
        } catch (error) {
          // Fallback to original extraction on error
          number = fromId;
          logger.error(
            `[SURVEY] Error getting LID phone - Line: ${company.name}, from: ${msg.from}, error: ${error}, using: ${number}`
          );
        }
      } else {
        // Regular phone number
        number = fromId;
      }
      
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      twoDaysAgo.setHours(0, 0, 0, 0);

      logger.info(
        `[SURVEY] Searching for survey - Line: ${company.name}, phone: ${number}, date_limit: ${twoDaysAgo.toISOString()}`
      );

      const [lastSend] = await prisma.shipping_history.findMany({
        where: {
          phone_number: number,
          isStartMessage: true,
          date: { gte: twoDaysAgo },
        },
        orderBy: [
          { date: "desc" },
          { hour: "desc" },
        ],
        include: { chatHistory: true, messages: true },
      });

      if (!lastSend) {
        logger.info(
          `[SURVEY] No survey found or expired - Line: ${company.name}, phone: ${number}, date_limit: ${twoDaysAgo.toISOString()}`
        );
        return;
      }

      // Log detailed information about the found record
      logger.info(
        `[SURVEY] Found shipping_history - Line: ${company.name}, phone: ${number}, id: ${lastSend.id}, id_message: ${lastSend.id_message ?? "N/A"}, id_survey: ${lastSend.id_survey ?? "N/A"}, has_messages: ${!!lastSend.messages}, has_chatHistory: ${!!lastSend.chatHistory}, date: ${lastSend.date?.toISOString() ?? "N/A"}`
      );

      // If messages relation is missing, try to fetch it directly
      let messagesData = lastSend.messages;
      if (!messagesData && lastSend.id_message) {
        logger.info(
          `[SURVEY] Messages relation missing, fetching directly - Line: ${company.name}, id_message: ${lastSend.id_message}`
        );
        messagesData = await prisma.messages.findUnique({
          where: { id: lastSend.id_message },
        });
        if (messagesData) {
          logger.info(
            `[SURVEY] Messages fetched successfully - Line: ${company.name}, is_survey: ${messagesData.is_survey}`
          );
        } else {
          logger.warn(
            `[SURVEY] Messages not found in database - Line: ${company.name}, id_message: ${lastSend.id_message}`
          );
        }
      }

      if (!messagesData) {
        logger.info(
          `[SURVEY] No messages data available - Line: ${company.name}, phone: ${number}, id_message: ${lastSend.id_message ?? "N/A"}`
        );
        return;
      }

      if (!lastSend.chatHistory) {
        logger.info(
          `[SURVEY] Missing chatHistory - Line: ${company.name}, phone: ${number}, protocol: ${lastSend.protocol}`
        );
        return;
      }

      if (!messagesData.is_survey && !lastSend.question_response) {
        logger.info(
          `[SURVEY] Not a survey but has pending response - Line: ${company.name}, phone: ${number}, id_survey: ${lastSend.id_survey ?? "N/A"}`
        );
        return prisma.shipping_history
          .update({
            data: {
              question_response: msg.body,
            },
            where: { id: lastSend.id },
          })
          .then(() => logger.info(`Line: ${company.name}, updateResponse`))
          .catch((e: Error) =>
            logger.error(
              `Line: ${company.name}, updateResponseStartmessage: ${e}`
            )
          );
      }
      if (messagesData.is_survey && !lastSend.question_response) {
        const surveyDate = lastSend.date ? new Date(lastSend.date) : null;
        const daysDifference = surveyDate
          ? Math.floor(
              (new Date().getTime() - surveyDate.getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : null;

        logger.info(
          `[SURVEY] Processing survey response - Line: ${company.name}, phone: ${number}, survey_date: ${surveyDate?.toISOString() ?? "N/A"}, date_limit: ${twoDaysAgo.toISOString()}, days_diff: ${daysDifference ?? "N/A"}, id_survey: ${lastSend.id_survey ?? "N/A"}`
        );

        const receivedBodyOriginal = msg.body;
        const receivedBodySanitized = sanitizeString(msg.body);
        const firstOptionOriginal = messagesData.first_option ?? "";
        const firstOptionSanitized = sanitizeString(
          messagesData.first_option
        );

        logger.info(
          `[SURVEY] Comparing with first_option - Line: ${company.name}, phone: ${number}, received_original: "${receivedBodyOriginal}", received_sanitized: "${receivedBodySanitized}", first_option_original: "${firstOptionOriginal}", first_option_sanitized: "${firstOptionSanitized}", match: ${receivedBodySanitized === firstOptionSanitized}, id_survey: ${lastSend.id_survey ?? "N/A"}`
        );

        if (receivedBodySanitized === firstOptionSanitized) {
          logger.info(
            `[SURVEY] Response matches first_option - Line: ${company.name}, phone: ${number}, response: "${receivedBodyOriginal}", sending first_answer, id_survey: ${lastSend.id_survey ?? "N/A"}`
          );

          await prisma.shipping_history
            .update({
              data: {
                question_response: msg.body,
                question_answer_correct: true,
                question_response_date: new Date(),
              },
              where: { id: lastSend.id },
            })
            .catch((e: Error) =>
              logger.error(
                `Line: ${company.name}, updateResponseStartMessage: ${e}`
              )
            );

          const firstAnswer =
            messagesData.first_answer ?? "Resposta registrada";
          logger.info(
            `[SURVEY] Sending first_answer - Line: ${company.name}, phone: ${number}, answer: "${firstAnswer}", id_survey: ${lastSend.id_survey ?? "N/A"}`
          );

          await sendMessageUseCase.execute({
            access_key,
            message: firstAnswer,
            phone_number: number,
            file_url: "",
          });
          return;
        }

        const secondOptionOriginal = messagesData.second_option ?? "";
        const secondOptionSanitized = sanitizeString(
          messagesData.second_option
        );

        logger.info(
          `[SURVEY] Comparing with second_option - Line: ${company.name}, phone: ${number}, received_original: "${receivedBodyOriginal}", received_sanitized: "${receivedBodySanitized}", second_option_original: "${secondOptionOriginal}", second_option_sanitized: "${secondOptionSanitized}", match: ${receivedBodySanitized === secondOptionSanitized}, id_survey: ${lastSend.id_survey ?? "N/A"}`
        );

        if (receivedBodySanitized === secondOptionSanitized) {
          logger.info(
            `[SURVEY] Response matches second_option - Line: ${company.name}, phone: ${number}, response: "${receivedBodyOriginal}", sending second_answer, id_survey: ${lastSend.id_survey ?? "N/A"}`
          );

          await prisma.shipping_history
            .update({
              data: {
                question_response: msg.body,
                question_answer_correct: true,
                question_response_date: new Date(),
              },
              where: { id: lastSend.id },
            })
            .catch((e: Error) =>
              logger.error(
                `Line: ${company.name}, updateResponseStartMessage: ${e}`
              )
            );

          const secondAnswer =
            messagesData.second_answer ?? "Resposta registrada";
          logger.info(
            `[SURVEY] Sending second_answer - Line: ${company.name}, phone: ${number}, answer: "${secondAnswer}", id_survey: ${lastSend.id_survey ?? "N/A"}`
          );

          await sendMessageUseCase.execute({
            access_key,
            message: secondAnswer,
            phone_number: number,
            file_url: "",
          });
          return;
        }

        logger.info(
          `[SURVEY] Response does not match any option - Line: ${company.name}, phone: ${number}, received: "${receivedBodyOriginal}", expected: "${firstOptionOriginal}" or "${secondOptionOriginal}", id_survey: ${lastSend.id_survey ?? "N/A"}`
        );

        const errorMessage = `Responda apenas: ${messagesData.first_option} ou ${messagesData.second_option}`;
        logger.info(
          `[SURVEY] Sending error message - Line: ${company.name}, phone: ${number}, message: "${errorMessage}", id_survey: ${lastSend.id_survey ?? "N/A"}`
        );

        await sendMessageUseCase.execute({
          access_key,
          message: errorMessage,
          phone_number: number,
          file_url: "",
        });
      }
    });

    existsCompany.client.on("message_ack", async (msg) => {
      if (msg.to.includes("@g.us")) return;
      logger.info(`Line: ${company.name}, message_ack: ${msg.ack}`);
      const isSended = await prisma.chat_history.findFirst({
        where: { messageId: msg.id.id },
      });
      if (!isSended) return;

      const updateAckApi = await prisma.chat_history
        .update({
          data: { ack: msg.ack },
          where: { id: isSended.id },
        })
        .catch((e: Error) =>
          logger.error(`Line: ${company.name}, updateAckApi: ${e}`)
        );
      if (!updateAckApi) return;

      const existsShipping = await prisma.shipping_history.findFirst({
        where: { protocol: isSended.messageId },
      });
      if (!existsShipping) return;
      await prisma.shipping_history
        .update({
          data: { status: msg.ack },
          where: { protocol: isSended.messageId },
        })
        .catch((e: Error) =>
          logger.error(`Line: ${company.name}, updateAckStartMessage: ${e}`)
        );
    });

    existsCompany.client.on("disconnected", (disconnected) => {
      logger.info(`Line: ${company.name}, disconnected: ${disconnected}`);
    });
  }
}
