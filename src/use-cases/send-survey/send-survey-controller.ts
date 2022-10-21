import { Request, Response } from "express";
import { SendSurveyUseCase } from "./send-survey-use-case";

export class SendSurveyController {
  async handle(request: Request, response: Response) {
    const {
      phone_number,
      message,
      first_option,
      first_answer,
      second_option,
      second_answer,
      use_buttons,
      file_url,
    } = request.body;
    const { access_key } = request.params;

    const sendSurveyUseCase = new SendSurveyUseCase();
    const data = await sendSurveyUseCase.execute({
      access_key,
      first_answer,
      first_option,
      message,
      phone_number,
      second_answer,
      second_option,
      file_url,
      use_buttons,
    });
    return response.json(data);
  }
}
