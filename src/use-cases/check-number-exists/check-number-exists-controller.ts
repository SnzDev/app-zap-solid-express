import { CheckNumberExistsUseCase } from "./check-number-exists-use-case";
import { Request, Response } from "express";
export class CheckNumberExistsController {
  constructor(private checkNumberExistsUseCase: CheckNumberExistsUseCase) {}

  async handle(request: Request, response: Response) {
    const { phone_number, access_key } = request.params;
    try {
      const exists = await this.checkNumberExistsUseCase.execute({
        access_key,
        phone_number,
      });
      return response.json({ exists: exists ?? false });
    } catch (error: any) {
      return response
        .status(error.getStatusCode())
        .json({ msg: error.message });
    }
  }
}
