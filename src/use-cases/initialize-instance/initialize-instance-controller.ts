import { Request, Response } from "express";
import { initializeListenerController } from "../initialize-listener";
import { InitializeInstanceUseCase } from "./initialize-instance-use-case";

export class InitializeInstanceController {
  constructor(private initializeInstanceUseCase: InitializeInstanceUseCase) {}
  async handle(request: Request, response: Response) {
    const { access_key } = request.params;
    const createInstance = await this.initializeInstanceUseCase.execute(
      access_key
    );
    if (createInstance)
      await initializeListenerController.handle(request, response);

    return response.status(201).json();
  }
}
