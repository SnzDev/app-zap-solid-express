import { Router } from "express";
import { initializeAllCompanysController } from "./use-cases/initialize-all-companys";

const companyRoutes = Router();

companyRoutes.get("/", (request, response) =>
  initializeAllCompanysController.handle(request, response)
);

export { companyRoutes };
