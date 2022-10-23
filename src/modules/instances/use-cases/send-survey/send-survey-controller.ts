import { NextFunction, Request, Response } from "express";
import { SendSurveyUseCase } from "./send-survey-use-case";

export class SendSurveyController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const {
      phone_number,
      message,
      first_option,
      first_answer,
      second_option,
      second_answer,
      use_buttons,
      file_url,
      id_message,
      id_group,
      id_section,
      id_user,
      id_survey,
      is_startmessage,
    } = request.body;
    const { access_key } = request.params;

    const sendSurveyUseCase = new SendSurveyUseCase();
    try {
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
        id_message,
        id_group,
        id_section,
        id_user,
        id_survey,
        is_startmessage,
      });
      return response.json(data);
    } catch (e) {
      next(e);
    }
  }
}
