import { logger } from "../../../../logger";
import { prisma } from "../../../../database/prisma";
import { InMemoryInstanceRepository } from "../../repositories/in-memory-instance-repository";
import { SaveIfHaveFile } from "../../../../utils/save-file";
import { sanitizeString } from "../../../../utils/sanitize-string";
import { saveChatHistory } from "../../../../utils/save-chat-history";

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
        .catch((e) =>
          logger.error(`Line: ${company.name}, qrUpdateError: ${e}`)
        );
    });

    existsCompany.client.once("ready", async () => {
      existsCompany.client.removeListener("qr", () => {});
      const clientInfo = existsCompany.client.info;
      await prisma.company
        .update({
          data: { app: clientInfo.pushname, line: clientInfo.wid.user },
          where: { access_key: existsCompany.access_key },
        })
        .catch((e) =>
          logger.error(`Line: ${company.name}, updateClientInfo: ${e}`)
        );

      logger.info(`Line: ${company.name}, ready to use`);
      prisma.company
        .update({
          where: { access_key: access_key },
          data: { qr: "" },
        })
        .then(() => logger.info(`Line: ${company.name}, qrcode removed`))
        .catch((e) =>
          logger.error(`Line: ${company.name}, qrUpdateError: ${e}`)
        );
    });

    existsCompany.client.on("message_create", async (msg) => {
      //RETURN IF IT'S FROM STATUS
      //RETURN IF IT'S FROM GROUP
      if (msg.isStatus || msg.from.includes("@g.us")) return;
      logger.info(`Line: ${company.name}, messageCreated: ${msg.from}`);

      await saveChatHistory({ msg, access_key: existsCompany.access_key });

      const file_url = await SaveIfHaveFile(existsCompany.access_key, msg);

      if (file_url) logger.info(`Line: ${company.name}, File: ${file_url}`);
    });

    existsCompany.client.on("message", async (msg) => {
      //RETURN IF IT'S FROM STATUS
      //RETURN IF IT'S FROM GROUP
      if (msg.isStatus || msg.from.includes("@g.us")) return;
      logger.info(`Line: ${company.name}, recieveMessage: ${msg.from}`);

      const file_url = await SaveIfHaveFile(existsCompany.access_key, msg);

      if (file_url) logger.info(`Line: ${company.name}, File: ${file_url}`);

      await saveChatHistory({ msg, access_key: existsCompany.access_key });

      const [lastSend] = await prisma.send_messages_api.findMany({
        where: { destiny: msg.from },
        orderBy: { timestamp: "desc" },
      });
      if (!lastSend) return;

      if (!lastSend.is_survey && !lastSend.response) {
        await prisma.send_messages_api
          .update({
            data: {
              response: msg.body,
            },
            where: { id: lastSend.id },
          })
          .catch((e) =>
            logger.error(`Line: ${company.name}, updateResponseApi: ${e}`)
          );
        await prisma.shipping_history
          .update({
            data: {
              question_response: msg.body,
            },
            where: { protocol: lastSend.id },
          })
          .catch((e) =>
            logger.error(
              `Line: ${company.name}, updateResponseStartMessage: ${e}`
            )
          );
      }
      if (lastSend.is_survey && !lastSend.response) {
        if (
          sanitizeString(msg.body) === sanitizeString(lastSend?.first_option)
        ) {
          await prisma.send_messages_api
            .update({
              data: {
                response: msg.body,
              },
              where: { id: lastSend.id },
            })
            .catch((e) =>
              logger.error(`Line: ${company.name}, updateResponseApi: ${e}`)
            );
          await prisma.shipping_history
            .update({
              data: {
                question_response: msg.body,
              },
              where: { protocol: lastSend.id },
            })
            .catch((e) =>
              logger.error(
                `Line: ${company.name}, updateResponseStartMessage: ${e}`
              )
            );
          await inMemoryInstanceRepository.sendMessage({
            body: lastSend.first_answer ?? "Resposta registrada",
            chatId: msg.from,
            client: existsCompany.client,
            options: undefined,
          });
          return;
        }
        if (
          sanitizeString(msg.body) === sanitizeString(lastSend.second_option)
        ) {
          await prisma.send_messages_api
            .update({
              data: {
                response: msg.body,
              },
              where: { id: lastSend.id },
            })
            .catch((e) =>
              logger.error(`Line: ${company.name}, updateResponseApi: ${e}`)
            );
          await prisma.shipping_history
            .update({
              data: {
                question_response: msg.body,
              },
              where: { protocol: lastSend.id },
            })
            .catch((e) =>
              logger.error(
                `Line: ${company.name}, updateResponseStartMessage: ${e}`
              )
            );
          await inMemoryInstanceRepository.sendMessage({
            body: lastSend.second_answer ?? "Resposta registrada",
            chatId: msg.from,
            client: existsCompany.client,
            options: undefined,
          });
          return;
        }

        await inMemoryInstanceRepository.sendMessage({
          body: `Responda apenas: ${lastSend.first_option} ou ${lastSend.second_option}`,
          chatId: msg.from,
          client: existsCompany.client,
          options: undefined,
        });
      }
    });

    existsCompany.client.on("message_ack", async (msg) => {
      if (msg.to.includes("@g.us")) return;
      logger.info(`Line: ${company.name}, message_ack: ${msg.ack}`);
      const sendMessage = await prisma.send_messages_api
        .update({
          data: { ack: msg.ack },
          where: { message_id: msg.id.id },
        })
        .catch((e) =>
          logger.error(`Line: ${company.name}, updateAckApi: ${e}`)
        );
      if (!sendMessage) return;
      await prisma.shipping_history
        .update({
          data: { status: msg.ack },
          where: { protocol: sendMessage.id },
        })
        .catch((e) =>
          logger.error(`Line: ${company.name}, updateAckStartMessage: ${e}`)
        );
    });

    existsCompany.client.on("disconnected", (disconnected) => {
      logger.info(`Line: ${company.name}, disconnected: ${disconnected}`);
    });
  }
}
