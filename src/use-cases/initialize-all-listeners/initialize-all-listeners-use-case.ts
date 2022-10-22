import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { InitializeListenerUseCase } from "../initialize-listener/initialize-listener-use-case";

export class InitializeAllListenersUseCase {
  execute() {
    const inMemoryInstanceRepository = new InMemoryInstanceRepository();
    const intializeListenerUseCase = new InitializeListenerUseCase();

    const instances = inMemoryInstanceRepository.findAll();
    if (!instances) return;

    instances.map(async (instance) => {
      await intializeListenerUseCase.execute(instance.access_key);
    });
  }
}
