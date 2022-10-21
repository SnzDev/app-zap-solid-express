import { Router } from "express";
import { initializeAllInstancesController } from "./use-cases/initialize-all-instances";
import { getStatusInstanceController } from "./use-cases/get-status-instance";
import { initializeInstanceController } from "./use-cases/initialize-instance";
import { destroyInstanceController } from "./use-cases/destroy-instance";
import { logoutInstanceController } from "./use-cases/logout-instance";
import { CheckNumberExistsController } from "./use-cases/check-number-exists/check-number-exists-controller";
import { SendMessageController } from "./use-cases/send-message/send-message-controller";
import { SendSurveyController } from "./use-cases/send-survey/send-survey-controller";

const checkNumberExistsController = new CheckNumberExistsController();
const sendMessageController = new SendMessageController();
const sendSurveyController = new SendSurveyController();

const instance = Router();

//INITIALIZE WHEN THE SYSTEM START
const init = async () => {
  await initializeAllInstancesController.handle();
};
init();

instance.post("/:access_key/init", async (request, response) => {
  await initializeInstanceController.handle(request, response);
});

instance.get("/:access_key/status", async (request, response) => {
  await getStatusInstanceController.handle(request, response);
});

instance.post("/:access_key/destroy", async (request, response) => {
  await destroyInstanceController.handle(request, response);
});

instance.post("/:access_key/logout", async (request, response) => {
  await logoutInstanceController.handle(request, response);
});

instance.get(
  "/:access_key/check/contact/:phone_number",
  checkNumberExistsController.handle
);

instance.post("/:access_key/send/message", sendMessageController.handle);

instance.post("/:access_key/send/survey", sendSurveyController.handle);

export { instance };
