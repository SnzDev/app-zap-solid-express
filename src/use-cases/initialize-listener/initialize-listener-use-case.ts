import { logger } from "../../logger";
import { prisma } from "../../database/prisma";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { SaveIfHaveFile } from "../../utils/save-file";
import { sanitizeString } from "../../utils/sanitize-string";

export class InitializeListenerUseCase {
  async execute(access_key: string) {
    if (!access_key) throw new Error("System needs access_key");

    const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();

    const existsCompany = inMemoryInstanceRepository.findOne({ access_key });
    if (!existsCompany) throw new Error("Instance does not exists");

    const company = await prisma.company.findFirst({
      where: { access_key: existsCompany.access_key },
    });

    existsCompany.client.on("qr", (qr) => {
      logger.info(`Line: ${company?.app}, qrcode update`);
      prisma.company.update({
        where: { access_key: existsCompany.access_key },
        data: { qr: qr },
      });
    });

    existsCompany.client.once("ready", () => {
      existsCompany.client.removeListener("qr", () => {});

      logger.info(`Line: ${company?.app}, ready to use`);
      prisma.company.update({
        where: { access_key: existsCompany.access_key },
        data: { qr: null },
      });
    });

    // instance.client.on("message_create", async (msg) => {
    //   const messageId = await PrismaSendMessagesRepository.findByIdMessage(
    //     msg.id.id
    //   );
    //   if (messageId || msg.isStatus) return;

    //   await PrismaSendMessagesRepository.create({
    //     access_key,
    //     message_body: msg.body,
    //     ack: msg.ack,
    //     destiny: msg.to,
    //     message_id: msg.id.id,
    //     sender: msg.from,
    //     timestamp: msg.timestamp,
    //   });

    //   logger.info(
    //     `access_key: ${instance.access_key}, Message outside startmessage!`
    //   );
    // });

    existsCompany.client.on("message", async (msg) => {
      //RETURN IF IT'S FROM STATUS
      //RETURN IF IT'S FROM GROUP
      if (msg.isStatus || msg.from.includes("@g.us")) return;
      const file_url = await SaveIfHaveFile(existsCompany.access_key, msg);

      if (file_url) logger.info(`Line: ${company?.app}, File: ${file_url}`);

      logger.info(`Line: ${company?.app}, message: ${msg.from}`);

      await prisma.receive_messages_api.create({
        data: {
          access_key,
          device_type: msg.deviceType,
          from: msg.from,
          has_media: msg.hasMedia,
          file_url,
          message_body: msg.body,
          message_id: msg.id.id,
          timestamp: msg.timestamp,
          to: msg.to,
        },
      });

      const [lastSend] = await prisma.send_messages_api.findMany({
        where: { destiny: msg.from },
        orderBy: { timestamp: "desc" },
      });
      if (!lastSend) return;

      if (!lastSend.is_survey && !lastSend.response) {
        await prisma.send_messages_api.update({
          data: {
            response: msg.body,
          },
          where: { id: lastSend.id },
        });
        await prisma.shipping_history.update({
          data: {
            question_response: msg.body,
          },
          where: { protocol: lastSend.id },
        });
      }
      if (lastSend.is_survey && !lastSend.response) {
        if (
          sanitizeString(msg.body) === sanitizeString(lastSend?.first_option)
        ) {
          await prisma.send_messages_api.update({
            data: {
              response: msg.body,
            },
            where: { id: lastSend.id },
          });
          await prisma.shipping_history.update({
            data: {
              question_response: msg.body,
            },
            where: { protocol: lastSend.id },
          });
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
          await prisma.send_messages_api.update({
            data: {
              response: msg.body,
            },
            where: { id: lastSend.id },
          });
          await prisma.shipping_history.update({
            data: {
              question_response: msg.body,
            },
            where: { protocol: lastSend.id },
          });
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
      logger.info(`Line: ${company?.app}, message_ack: ${msg.ack}`);
      const sendMessage = await prisma.send_messages_api.update({
        data: { ack: msg.ack },
        where: { message_id: msg.id.id },
      });
      if (!sendMessage) return;
      await prisma.shipping_history.update({
        data: { status: msg.ack },
        where: { protocol: sendMessage.id },
      });
    });

    existsCompany.client.on("disconnected", (disconnected) => {
      logger.info(`Line: ${company?.app}, disconnected: ${disconnected}`);
    });
  }
}
