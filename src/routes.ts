import { Router } from "express";
import { initializeAllCompanysController } from "./use-cases/initialize-all-companys";
import { getStatusInterfaceController } from "./use-cases/get-status-interface";

const companyRoutes = Router();

//INITIALIZE WHEN THE SYSTEM STARY
initializeAllCompanysController.handle();

companyRoutes.get("/status/:access_key", async (request, response) => {
  await getStatusInterfaceController.handle(request, response);
});

export { companyRoutes };
