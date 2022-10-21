import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";

export class LogoutInstanceUseCase {
  async execute(access_key: string) {
    if (!access_key) throw new Error("System needs access_key");
    const inMemoryInstanceRepository = new InMemoryInstanceRepository();

    const existsCompany = await inMemoryInstanceRepository.findOne({
      access_key,
    });
    if (!existsCompany) throw new Error(`Instance does not exists`);

    const instanceStatus = await inMemoryInstanceRepository.status({
      client: existsCompany.client,
    });

    if (instanceStatus.status === "NOT_STARTED")
      throw new Error("Instance already destroyed");

    await inMemoryInstanceRepository.logout({ client: existsCompany.client });
  }
}
