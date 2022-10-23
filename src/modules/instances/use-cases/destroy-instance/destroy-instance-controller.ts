import { Request, Response, NextFunction } from "express";
import { DestroyInstanceUseCase } from "./destroy-instance-use-case";

export class DestroyInstanceController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { access_key } = request.params;

    const destroyInstanceUseCase = new DestroyInstanceUseCase();
    try {
      await destroyInstanceUseCase.execute(access_key);
      return response.status(200).send();
    } catch (e) {
      next(e);
    }
  }
}
