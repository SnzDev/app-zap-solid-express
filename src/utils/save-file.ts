import mime from "mime-types";
import { Message } from "whatsapp-web.js";
import fs from "fs";
import { logger } from "../logger";

export async function SaveIfHaveFile(access_key: string, msg: Message) {
  if (msg.hasMedia) {
    const media = await msg.downloadMedia();
    if (media) {
      const format = mime.extension(media.mimetype);
      try {
        fs.writeFileSync(
          `./public/${access_key}/${msg.timestamp}-${msg.id.id}.${format}`,
          media.data,
          { encoding: "base64" }
        );
        return `./public/${access_key}/${msg.timestamp}-${msg.id.id}.${format}`;
      } catch (e) {
        logger.error(`DownloadMedia: ${e}`);
      }
    }
  }
}
