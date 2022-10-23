import { Router } from "express";
import { CheckNumberExistsController } from "../modules/instances/use-cases/check-number-exists/check-number-exists-controller";
import { DestroyInstanceController } from "../modules/instances/use-cases/destroy-instance/destroy-instance-controller";
import { GetStatusInstanceController } from "../modules/instances/use-cases/get-status-instance/get-status-instance-controller";
import { InitializeAllInstancesController } from "../modules/instances/use-cases/initialize-all-instances/initialize-all-instances-controller";
import { InitializeInstanceController } from "../modules/instances/use-cases/initialize-instance/initialize-instance-controller";
import { LogoutInstanceController } from "../modules/instances/use-cases/logout-instance/logout-instance-controller";
import { SendMessageController } from "../modules/instances/use-cases/send-message/send-message-controller";
import { SendSurveyController } from "../modules/instances/use-cases/send-survey/send-survey-controller";

const checkNumberExistsController = new CheckNumberExistsController();
const sendMessageController = new SendMessageController();
const sendSurveyController = new SendSurveyController();
const getStatusInstanceController = new GetStatusInstanceController();
const destroyInstanceController = new DestroyInstanceController();
const logoutInstanceController = new LogoutInstanceController();
const initializeInstanceController = new InitializeInstanceController();
const initializeAllInstancesController = new InitializeAllInstancesController();
const instances = Router();

//INITIALIZE WHEN THE SYSTEM START
(async () => {
  await initializeAllInstancesController.handle();
})();

instances.post("/:access_key/init", initializeInstanceController.handle);

instances.get("/:access_key/status", getStatusInstanceController.handle);

instances.post("/:access_key/destroy", destroyInstanceController.handle);

instances.post("/:access_key/logout", logoutInstanceController.handle);

instances.get(
  "/:access_key/check/contact/:phone_number",
  checkNumberExistsController.handle
);

instances.post("/:access_key/send/message", sendMessageController.handle);

instances.post("/:access_key/send/survey", sendSurveyController.handle);

export { instances };
