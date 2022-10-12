import { Request, Response } from "express";
import { initializeListenerController } from "../initialize-listener";
import { InitializeInstanceUseCase } from "./initialize-instance-use-case";

export class InitializeInstanceController {
  constructor(private initializeInstanceUseCase: InitializeInstanceUseCase) {}
  async handle(request: Request, response: Response) {
    const { access_key } = request.params;

    try {
      await this.initializeInstanceUseCase.execute(access_key);
      await initializeListenerController.handle(request);

      return response.status(201).send();
    } catch (error: any) {
      return response
        .status(error.getStatusCode())
        .json({ msg: error.message });
    }
  }
}
