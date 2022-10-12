import { InitializeAllInstancesUseCase } from "./initialize-all-instances-use-case";
import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { initializeAllListenerController } from "../initialize-all-listeners";
import { logger } from "../../logger";

export class InitializeAllInstancesController {
  constructor(
    private initializeAllInstancesUseCase: InitializeAllInstancesUseCase
  ) {}

  async handle() {
    try {
      await this.initializeAllInstancesUseCase.execute();
      await initializeAllListenerController.handle();
    } catch (error: any) {
      logger.error(error);
    }
  }
}
