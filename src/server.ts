import { logger } from "./logger";
import express, { Request, Response, NextFunction } from "express";
import { routes } from "./routes";
import cors from "cors";
import "express-async-errors";

const port = process.env.PORT ?? 3333;
const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);

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
app.listen(port, () => logger.info(`Server is running on localPort: ${port}!`));
