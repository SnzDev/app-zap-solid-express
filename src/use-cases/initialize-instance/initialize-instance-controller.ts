import { Request, Response } from "express";
import { InitializeListenerController } from "../initialize-listener/initialize-listener-controller";
import { InitializeInstanceUseCase } from "./initialize-instance-use-case";

export class InitializeInstanceController {
  async handle(request: Request, response: Response) {
    const { access_key } = request.params;

    const initializeListenerController = new InitializeListenerController();
    const initializeInstanceUseCase = new InitializeInstanceUseCase();

    await initializeInstanceUseCase.execute(access_key);
    initializeListenerController.handle(request);

    return response.status(201).send();
  }
}
