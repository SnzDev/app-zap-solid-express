import { Request, Response } from "express";
import { logger } from "../../logger";
import { InitializeListenerUseCase } from "./initialize-listener-use-case";

export class InitializeListenerController {
  constructor(private initializeListenerUseCase: InitializeListenerUseCase) {}

  async handle(request: Request) {
    const { access_key } = request.params;

    try {
      this.initializeListenerUseCase.execute(access_key);
    } catch (error: any) {
      logger.error(error);
    }
  }
}
