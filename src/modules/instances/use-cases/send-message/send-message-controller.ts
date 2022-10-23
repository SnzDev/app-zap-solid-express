import { NextFunction, Request, Response } from "express";
import { SendMessageUsecase } from "./send-message-use-case";

export class SendMessageController {
  constructor() {}

  async handle(request: Request, response: Response, next: NextFunction) {
    const {
      phone_number,
      message,
      file_url,
      id_message,
      id_group,
      id_section,
      id_user,
    } = request.body;
    const { access_key } = request.params;

    const sendMessageUseCaseDTO = new SendMessageUsecase();
    try {
      const sendMessage = await sendMessageUseCaseDTO.execute({
        access_key,
        file_url,
        message,
        phone_number,
        id_group,
        id_message,
        id_section,
        id_user,
      });
      return response.json(sendMessage);
    } catch (e) {
      next(e);
    }
  }
}
