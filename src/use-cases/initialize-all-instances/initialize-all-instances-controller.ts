import { InitializeAllInstancesUseCase } from "./initialize-all-instances-use-case";
import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { initializeAllListenerController } from "../initialize-all-listeners";

export class InitializeAllInstancesController {
  constructor(
    private initializeAllInstancesUseCase: InitializeAllInstancesUseCase
  ) {}

  async handle() {
    await this.initializeAllInstancesUseCase.execute();
    await initializeAllListenerController.handle();
  }
}
