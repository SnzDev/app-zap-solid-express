import { Request, Response } from "express";
import { DestroyInstanceUseCase } from "./destroy-instance-use-case";

export class DestroyInstanceController {
  constructor(private destroyInstanceUseCase: DestroyInstanceUseCase) {}

  async handle(request: Request, response: Response) {
    const { access_key } = request.params;
    try {
      await this.destroyInstanceUseCase.execute(access_key);
      return response.status(200).send();
    } catch (error: any) {
      return response
        .status(error.getStatusCode())
        .json({ msg: error.message });
    }
  }
}
