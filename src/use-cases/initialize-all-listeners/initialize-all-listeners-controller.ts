import { InitializeAllListenersUseCase } from "./initialize-all-listeners-use-case";

export class InitializeAllListenersController {
  async handle() {
    const initializeAllListenersUseCase = new InitializeAllListenersUseCase();
    initializeAllListenersUseCase.execute();
  }
}
