import { Request, Response } from "express";
import { GetStatusInterfaceUseCase } from "./get-status-interface-use-case";

export class GetStatusInterfaceController {
  constructor(private getStatusInterfaceUseCase: GetStatusInterfaceUseCase) {}
  async handle(request: Request, response: Response) {
    const { access_key } = request.params;
    if (!access_key)
      return response
        .status(400)
        .json({ status: 400, message: "access key required" });

    const status = await this.getStatusInterfaceUseCase.execute(access_key);
    if (!status)
      return response
        .status(404)
        .json({ status: 400, message: "access key not found" });

    return response.json(status);
  }
}
