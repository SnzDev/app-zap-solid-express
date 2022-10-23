import { CheckNumberExistsUseCase } from "./check-number-exists-use-case";
import { Request, Response, NextFunction } from "express";

export class CheckNumberExistsController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { phone_number, access_key } = request.params;
    const checkNumberExistsUseCase = new CheckNumberExistsUseCase();
    try {
      const data = await checkNumberExistsUseCase.execute({
        access_key,
        phone_number,
      });
      return response.json(data);
    } catch (e) {
      next(e);
    }
  }
}
