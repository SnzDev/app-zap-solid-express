import { Router } from "express";
import { initializeAllInstancesController } from "./use-cases/initialize-all-instances";
import { getStatusInterfaceController } from "./use-cases/get-status-interface";
import { initializeInstanceController } from "./use-cases/initialize-instance";
import { destroyInstanceController } from "./use-cases/destroy-instance";
import { logoutInstanceController } from "./use-cases/logout-instance";

const instance = Router();

//INITIALIZE WHEN THE SYSTEM START
const init = async () => {
  await initializeAllInstancesController.handle();
};
init();

instance.get("/init/:access_key", async (request, response) => {
  await initializeInstanceController.handle(request, response);
});

instance.get("/status/:access_key", async (request, response) => {
  await getStatusInterfaceController.handle(request, response);
});

instance.get("/destroy/:access_key", async (request, response) => {
  await destroyInstanceController.handle(request, response);
});

instance.get("/logout/:access_key", async (request, response) => {
  await logoutInstanceController.handle(request, response);
});

export { instance };
