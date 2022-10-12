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

instance.get("/:access_key/init", async (request, response) => {
  await initializeInstanceController.handle(request, response);
});

instance.get("/:access_key/status", async (request, response) => {
  await getStatusInterfaceController.handle(request, response);
});

instance.get("/:access_key/destroy", async (request, response) => {
  await destroyInstanceController.handle(request, response);
});

instance.get("/:access_key/logout", async (request, response) => {
  await logoutInstanceController.handle(request, response);
});

instance.get(
  "/:access_key/check/contact/:phone_number",
  async (request, response) => {
    await logoutInstanceController.handle(request, response);
  }
);
export { instance };
