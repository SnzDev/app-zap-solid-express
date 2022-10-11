import Pino from "pino";

export const logger = Pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      mkdir: true,
      include: "level,time, ",
      timestampKey: "time",
      translateTime: true,
      messageKey: "msg",
    },
  },
});
