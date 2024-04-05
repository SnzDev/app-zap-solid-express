import { logger } from "../../../../logger";
import { prisma } from "../../../../database/prisma";
import { InMemoryInstanceRepository } from "../../repositories/in-memory-instance-repository";
import { SaveIfHaveFile } from "../../../../utils/save-file";
import { sanitizeString } from "../../../../utils/sanitize-string";
import { saveChatHistory } from "../../../../utils/save-chat-history";
import { SendMessageUsecase } from "../send-message/send-message-use-case";

export class InitializeListenerUseCase {
  async execute(access_key: string) {
    if (!access_key) throw new Error("System needs access_key");

    const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
    const existsCompany = inMemoryInstanceRepository.findOne({ access_key });
    if (!existsCompany) throw new Error("Instance does not exists");
    const company = await prisma.company.findFirstOrThrow({
      where: { access_key },
    });

    existsCompany.client.on("qr", (qr) => {
      prisma.company
        .update({
          where: { access_key: existsCompany.access_key },
          data: { qr: qr },
        })
        .then(() => logger.info(`Line: ${company.name}, qrcode update`))
        .catch((e: Error) =>
          logger.error(`Line: ${company.name}, qrUpdateError: ${e}`)
        );
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

      const [number] = msg.from.split("@");

      const [lastSend] = await prisma.shipping_history.findMany({
        where: { phone_number: number, isStartMessage: true },
        orderBy: { chatHistory: { timestamp: "desc" } },
        include: { chatHistory: true, messages: true },
      });

      if (!lastSend || !lastSend.messages) return;

      if (!lastSend.messages.is_survey && !lastSend.question_response) {
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
      if (lastSend.messages.is_survey && !lastSend.question_response) {
        if (
          sanitizeString(msg.body) ===
          sanitizeString(lastSend.messages.first_option)
        ) {
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
          await sendMessageUseCase.execute({
            access_key,
            message: lastSend.messages.first_answer ?? "Resposta registrada",
            phone_number: number,
            file_url: "",
          });
          return;
        }
        if (
          sanitizeString(msg.body) ===
          sanitizeString(lastSend.messages.second_option)
        ) {
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
          await sendMessageUseCase.execute({
            access_key,
            message: lastSend.messages.second_answer ?? "Resposta registrada",
            phone_number: number,
            file_url: "",
          });
          return;
        }

        await sendMessageUseCase.execute({
          access_key,
          message: `Responda apenas: ${lastSend.messages.first_option} ou ${lastSend.messages.second_option}`,
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
