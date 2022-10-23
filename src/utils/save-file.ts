import mime from "mime-types";
import { Message } from "whatsapp-web.js";
import fs from "fs";
import { logger } from "../logger";

export async function SaveIfHaveFile(access_key: string, msg: Message) {
  if (msg.hasMedia) {
    let folder = `./public/${access_key}`;
    if (!fs.existsSync(folder)) {
      try {
        fs.mkdirSync(folder);
      } catch (e) {
        logger.error(`DownloadMedia: ${e}`);
      }
    }
    const media = await msg.downloadMedia();
    if (media) {
      const format = mime.extension(media.mimetype);

      try {
        fs.writeFileSync(`${folder}/${msg.id.id}.${format}`, media.data, {
          encoding: "base64",
        });
        return `${folder}/${msg.id.id}.${format}`;
      } catch (e) {
        logger.error(`DownloadMedia: ${e}`);
      }
    }
  }
}
