import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";

class GetStatusInstanceUseCase {
  constructor() {}

  async execute(access_key: string) {
    if (!access_key) throw new Error("System needs access_key");

    const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();

    const existsCompany = await inMemoryInstanceRepository.findOne({
      access_key,
    });
    if (!existsCompany) throw new Error("Instance does not exists");

    return await inMemoryInstanceRepository.status({
      client: existsCompany.client,
    });
  }
}

export { GetStatusInstanceUseCase };
