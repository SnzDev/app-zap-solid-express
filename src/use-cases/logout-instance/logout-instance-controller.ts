import { LogoutInstanceUseCase } from "./logout-instance-use-case";
import { Request, Response } from "express";

export class LogoutInstanceController {
  constructor(private logoutInstanceUseCase: LogoutInstanceUseCase) {}

  async handle(request: Request, response: Response) {
    const { access_key } = request.params;
    try {
      await this.logoutInstanceUseCase.execute(access_key);
      return response.status(200).send();
    } catch (error: any) {
      return response
        .status(error.getStatusCode())
        .json({ msg: error.message });
    }
  }
}
