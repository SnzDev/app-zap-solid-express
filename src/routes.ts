import { Router } from "express";
import { instances } from "./routes/instances.routes";

const routes = Router();
routes.use(instances);

export { routes };
