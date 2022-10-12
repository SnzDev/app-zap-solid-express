import { Router } from "express";
import { initializeAllCompanysController } from "./use-cases/initialize-all-companys";
import { getStatusInterfaceController } from "./use-cases/get-status-interface";
import { initializeAllListenerController } from "./use-cases/initialize-all-listeners";

const companyRoutes = Router();

//INITIALIZE WHEN THE SYSTEM START
const init = async () => {
  await initializeAllCompanysController.handle();
  await initializeAllListenerController.handle();
};
init();

companyRoutes.get("/status/:access_key", async (request, response) => {
  await getStatusInterfaceController.handle(request, response);
});

export { companyRoutes };
