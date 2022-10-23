import { NextFunction, Request, Response } from "express";
import { InitializeInstanceUseCase } from "./initialize-instance-use-case";

export class InitializeInstanceController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { access_key } = request.params;

    const initializeInstanceUseCase = new InitializeInstanceUseCase();
    try {
      await initializeInstanceUseCase.execute(access_key);
      return response.status(201).send();
    } catch (e) {
      next(e);
    }
  }
}
