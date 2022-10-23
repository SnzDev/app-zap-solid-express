import { LogoutInstanceUseCase } from "./logout-instance-use-case";
import { NextFunction, Request, Response } from "express";

export class LogoutInstanceController {
  constructor() {}

  async handle(request: Request, response: Response, next: NextFunction) {
    const { access_key } = request.params;
    const logoutInstanceUseCase = new LogoutInstanceUseCase();
    try {
      await logoutInstanceUseCase.execute(access_key);
      return response.status(200).send();
    } catch (e) {
      next(e);
    }
  }
}
