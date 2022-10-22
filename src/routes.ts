import { Router } from "express";
import { initializeAllInstancesController } from "./use-cases/initialize-all-instances";
import { GetStatusInstanceController } from "./use-cases/get-status-instance/get-status-instance-controller";
import { InitializeInstanceController } from "./use-cases/initialize-instance/initialize-instance-controller";
import { DestroyInstanceController } from "./use-cases/destroy-instance/destroy-instance-controller";
import { LogoutInstanceController } from "./use-cases/logout-instance/logout-instance-controller";
import { CheckNumberExistsController } from "./use-cases/check-number-exists/check-number-exists-controller";
import { SendMessageController } from "./use-cases/send-message/send-message-controller";
import { SendSurveyController } from "./use-cases/send-survey/send-survey-controller";

const checkNumberExistsController = new CheckNumberExistsController();
const sendMessageController = new SendMessageController();
const sendSurveyController = new SendSurveyController();
const getStatusInstanceController = new GetStatusInstanceController();
const destroyInstanceController = new DestroyInstanceController();
const logoutInstanceController = new LogoutInstanceController();
const initializeInstanceController = new InitializeInstanceController();

const instance = Router();

//INITIALIZE WHEN THE SYSTEM START
const init = async () => {
  await initializeAllInstancesController.handle();
};
init();

instance.post("/:access_key/init", initializeInstanceController.handle);

instance.get("/:access_key/status", getStatusInstanceController.handle);

instance.post("/:access_key/destroy", destroyInstanceController.handle);

instance.post("/:access_key/logout", logoutInstanceController.handle);

instance.get(
  "/:access_key/check/contact/:phone_number",
  checkNumberExistsController.handle
);

instance.post("/:access_key/send/message", sendMessageController.handle);

instance.post("/:access_key/send/survey", sendSurveyController.handle);

export { instance };
