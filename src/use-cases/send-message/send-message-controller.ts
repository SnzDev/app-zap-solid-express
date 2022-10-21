import { Request, Response } from "express";
import { SendMessageUsecase } from "./send-message-use-case";

export class SendMessageController {
  constructor() {}

  async handle(request: Request, response: Response) {
    const { phone_number, message, file_url } = request.body;
    const { access_key } = request.params;

    const sendMessageUseCaseDTO = new SendMessageUsecase();

    const sendMessage = await sendMessageUseCaseDTO.execute({
      access_key,
      file_url,
      message,
      phone_number,
    });
    return response.json(sendMessage);
  }
}
