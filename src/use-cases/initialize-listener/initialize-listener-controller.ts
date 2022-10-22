import { Request, Response } from "express";
import { InitializeListenerUseCase } from "./initialize-listener-use-case";

export class InitializeListenerController {

  async handle(request: Request) {
    const { access_key } = request.params;
    const initializeListenerUseCase = new InitializeListenerUseCase();
    await initializeListenerUseCase.execute(access_key);
  }
}
