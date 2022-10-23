import { NextFunction, Request, Response } from "express";
import { GetStatusInstanceUseCase } from "./get-status-instance-use-case";

export class GetStatusInstanceController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { access_key } = request.params;
    const getStatusInstanceUseCase = new GetStatusInstanceUseCase();
    try {
      const data = await getStatusInstanceUseCase.execute(access_key);
      return response.json(data);
    } catch (e) {
      next(e);
    }
  }
}
