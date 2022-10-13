import { Request, Response } from "express";
import { GetStatusInstanceUseCase } from "./get-status-instance-use-case";

export class GetStatusInstanceController {
  constructor(private getStatusInstanceUseCase: GetStatusInstanceUseCase) {}
  async handle(request: Request, response: Response) {
    const { access_key } = request.params;
    try {
      const status = await this.getStatusInstanceUseCase.execute(access_key);
      return response.json(status);
    } catch (error: any) {
      return response
        .status(error.getStatusCode())
        .json({ msg: error.message });
    }
  }
}
