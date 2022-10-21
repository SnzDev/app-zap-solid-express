import { Request, Response } from "express";
import { DestroyInstanceUseCase } from "./destroy-instance-use-case";

export class DestroyInstanceController {
  async handle(request: Request, response: Response) {
    const { access_key } = request.params;

    const destroyInstanceUseCase = new DestroyInstanceUseCase();
    await destroyInstanceUseCase.execute(access_key);
    return response.status(200).send();
  }
}
