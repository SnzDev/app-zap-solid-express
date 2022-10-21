import { CheckNumberExistsUseCase } from "./check-number-exists-use-case";
import { Request, Response } from "express";

export class CheckNumberExistsController {
  async handle(request: Request, response: Response) {
    const { phone_number, access_key } = request.params;
    const checkNumberExistsUseCase = new CheckNumberExistsUseCase();

    return response.json(
      await checkNumberExistsUseCase.execute({
        access_key,
        phone_number,
      })
    );
  }
}
