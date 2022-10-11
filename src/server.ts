import { app } from ".";
import { logger } from "./logger";

app.listen(3333, () => logger.info("Server is running!"));
