import e from "express";
import { Message } from "whatsapp-web.js";
import { prisma } from "../database/prisma";
import { logger } from "../logger";
interface SaveChatHistoryDTO {
  msg: Message;
  access_key: string;
}
export async function saveChatHistory({ msg, access_key }: SaveChatHistoryDTO) {
  const {
    ack,
    author,
    body,
    deviceType,
    from,
    isForwarded,
    timestamp,
    to,
    type,
    vCards,
    fromMe,
    hasMedia,
    hasQuotedMsg,
    isEphemeral,
    isGif,
    links,
    mentionedIds,
    location,
  } = msg;

  const {
    hasReaction,
    isDynamicReplyButtonsMsg,
    quotedStanzaID,
    quotedParticipant,
    //@ts-ignore
  } = msg["_data"];

  console.log(
    hasReaction,
    isDynamicReplyButtonsMsg,
    quotedStanzaID,
    quotedParticipant
  );

  const messageId = msg.id.id;
  try {
    await prisma.chat_history.create({
      data: {
        access_key,
        ack,
        author,
        body,
        deviceType,
        from,
        isForwarded,
        timestamp,
        to,
        type,
        vCards,
        fromMe,
        hasMedia,
        hasQuotedMsg,
        isEphemeral,
        isGif,
        links,
        mentionedIds,
        messageId,
        hasReaction,
        isDynamicReplyButtonsMsg,
        quotedStanzaID,
        quotedParticipant,
        location: {
          latitude: location?.latitude,
          longitude: location?.longitude,
          description: location?.description,
        },
      },
    });
  } catch (err) {
    logger.error(`SaveChatError: ${err}`);
  }
}
