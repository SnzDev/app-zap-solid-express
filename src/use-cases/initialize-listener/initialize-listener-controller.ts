import { Request, Response } from "express";
import { InitializeListenerUseCase } from "./initialize-listener-use-case";

export class InitializeListenerController {
  constructor(private initializeListenerUseCase: InitializeListenerUseCase) {}

  async handle(request: Request, response: Response) {
    const { access_key } = request.params;
    this.initializeListenerUseCase.execute(access_key);
  }
}
