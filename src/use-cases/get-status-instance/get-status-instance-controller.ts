import { Request, Response } from "express";
import { GetStatusInstanceUseCase } from "./get-status-instance-use-case";

export class GetStatusInstanceController {
  async handle(request: Request, response: Response) {
    const { access_key } = request.params;
    const getStatusInstanceUseCase = new GetStatusInstanceUseCase();

    return response.json(await getStatusInstanceUseCase.execute(access_key));
  }
}
