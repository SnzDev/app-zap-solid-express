import { InitializeAllInstancesUseCase } from "./initialize-all-instances-use-case";

export class InitializeAllInstancesController {
  constructor() {}

  async handle() {
    const initializeAllInstancesUseCase = new InitializeAllInstancesUseCase();
    await initializeAllInstancesUseCase.execute();
  }
}
