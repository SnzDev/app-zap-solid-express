import { logger } from "./logger";
import express, { Request, Response, NextFunction } from "express";
import { instance } from "./routes";
import cors from "cors";
import "express-async-errors";

const app = express();
app.use(cors());
app.use(express.json());

app.use(instance);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
      logger.error(`status: 400: ${err}`);

      return response.status(400).json({
        status: 400,
        message: err.message,
      });
    }

    logger.error(`status: 500: ${err}`);
    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
);

app.listen(3330, () => logger.info("Server is running!"));
