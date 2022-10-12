import express from "express";
import { companyRoutes } from "./routes";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());
app.use(companyRoutes);
export { app };
