import express from "express";
import { companyRoutes } from "./routes";

const app = express();

app.use(express.json());
app.use(companyRoutes);

export { app };
