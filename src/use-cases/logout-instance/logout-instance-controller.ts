import { LogoutInstanceUseCase } from "./logout-instance-use-case";
import { Request, Response } from "express";

export class LogoutInstanceController {
  constructor() {}

  async handle(request: Request, response: Response) {
    const { access_key } = request.params;
    const logoutInstanceUseCase = new LogoutInstanceUseCase();
    await logoutInstanceUseCase.execute(access_key);
    return response.status(200).send();
  }
}
