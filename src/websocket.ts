import { logger } from "./logger";
import { io } from "./server";
import {
  WebsocketSendConnectedDTO,
  WebsocketSendQrCodeDTO,
} from "./types/websocket-dto";

export class WebSocket {
  constructor() {
    // io.on("connection", (socket) => {
    //   logger.info(`WEBSOCKET: ${socket.id} connected`);
    // });
  }

  async sendQrCode({ access_key, qr }: WebsocketSendQrCodeDTO) {
    io.emit(`qr-${access_key}`, { access_key, qr });
  }
  async sendConnected({ access_key }: WebsocketSendConnectedDTO) {
    io.emit(`connected-${access_key}`, { access_key });
  }
}
