import { app } from ".";
import { logger } from "./logger";
import { Server } from "socket.io";
import http from "http";

const serverHttp = http.createServer(app);

serverHttp.listen(3330, () => logger.info("Server is running!"));
export const io = new Server(serverHttp);

io.on("connection", (socket) => {
  logger.info(`WEBSOCKET: ${socket.id} - listen to qrcode`);

  socket.on("waiting", (data) => {
    logger.info(`WEBSOCKET: ${socket.id} - ${data} waiting qrcode`);
  });

  socket.on("connected", (data) => {
    logger.info(`WEBSOCKET: ${socket.id} - ${data}`);
  });
});

io.on("close", (socket) => {
  logger.info(`WEBSOCKET: ${socket.id} - disconnected socket`);
});
