import { Router } from "express";
import { initializeAllCompanysController } from "./use-cases/initialize-all-companys";

const companyRoutes = Router();

//INITIALIZE WHEN THE SYSTEM STARY
initializeAllCompanysController.handle();

export { companyRoutes };
