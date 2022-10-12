import { Router } from "express";
import { initializeAllInstancesController } from "./use-cases/initialize-all-instances";
import { getStatusInterfaceController } from "./use-cases/get-status-interface";
import { initializeInstanceController } from "./use-cases/initialize-instance";
import { destroyInstanceController } from "./use-cases/destroy-instance";

const companyRoutes = Router();

//INITIALIZE WHEN THE SYSTEM START
const init = async () => {
  await initializeAllInstancesController.handle();
};
init();

companyRoutes.get("/status/:access_key", async (request, response) => {
  await getStatusInterfaceController.handle(request, response);
});

companyRoutes.get("/init/:access_key", async (request, response) => {
  await initializeInstanceController.handle(request, response);
});

companyRoutes.get("/destroy/:access_key", async (request, response) => {
  await destroyInstanceController.handle(request, response);
});

export { companyRoutes };
