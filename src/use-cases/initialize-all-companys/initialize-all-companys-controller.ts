import { InitializeAllCompanysUseCase } from "./initialize-all-companys-use-case";
import { Request, Response } from "express";
import { prisma } from "../../prisma";

export class InitializeAllCompanysController {
  constructor(
    private initializeAllCompanysUseCase: InitializeAllCompanysUseCase
  ) {}

  async handle() {
    await this.initializeAllCompanysUseCase.execute();
  }
}
