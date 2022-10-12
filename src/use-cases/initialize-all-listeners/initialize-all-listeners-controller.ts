import { logger } from "../../logger";
import { InitializeAllListenersUseCase } from "./initialize-all-listeners-use-case";

export class InitializeAllListenersController {
  constructor(
    private initializeAllListenersUseCase: InitializeAllListenersUseCase
  ) {}

  async handle() {
    try {
      this.initializeAllListenersUseCase.execute();
    } catch (error: any) {
      logger.error(error);
    }
  }
}
