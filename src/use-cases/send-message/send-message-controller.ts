import { Request, Response } from "express";
import { SendMessageUsecase } from "./send-message-use-case";

export class SendMessageController {
  constructor(private sendMessageUseCaseDTO: SendMessageUsecase) {}

  async handle(request: Request, response: Response) {
    const { phone_number, message, file_url } = request.body;
    const { access_key } = request.params;
    try {
      const sendMessage = await this.sendMessageUseCaseDTO.execute({
        access_key,
        file_url,
        message,
        phone_number,
      });
      return response.json(sendMessage);
    } catch (error: any) {
      return response
        .status(error.getStatusCode())
        .json({ msg: error.message });
    }
  }
}
