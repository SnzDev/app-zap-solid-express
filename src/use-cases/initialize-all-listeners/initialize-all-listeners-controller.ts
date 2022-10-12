import { InitializeAllListenersUseCase } from "./initialize-all-listeners-use-case";

export class InitializeAllListenerController {
  constructor(
    private initializeAllListenersUseCase: InitializeAllListenersUseCase
  ) {}

  async handle() {
    this.initializeAllListenersUseCase.execute();
  }
}
