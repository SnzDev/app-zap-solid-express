import { Request, Response } from "express";
import { GetStatusInterfaceUseCase } from "./get-status-interface-use-case";

export class GetStatusInterfaceController {
  constructor(private getStatusInterfaceUseCase: GetStatusInterfaceUseCase) {}
  async handle(request: Request, response: Response) {
    const { access_key } = request.params;
    try {
      const status = await this.getStatusInterfaceUseCase.execute(access_key);
      return response.json(status);
    } catch (error: any) {
      return response
        .status(error.getStatusCode())
        .json({ msg: error.message });
    }
  }
}
