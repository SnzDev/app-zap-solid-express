import express from "express";
import { instance } from "./routes";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());
app.use(instance);
export { app };
