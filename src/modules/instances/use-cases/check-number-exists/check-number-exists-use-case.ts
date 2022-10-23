import { logger } from "../../../../logger";
import { InMemoryInstanceRepository } from "../../repositories/in-memory-instance-repository";

interface CheckNumberExistsUseCaseDTO {
  access_key: string;
  phone_number: string;
}

export class CheckNumberExistsUseCase {
  async execute({ access_key, phone_number }: CheckNumberExistsUseCaseDTO) {
    if (!access_key) throw new Error("System needs access_key");
    if (!phone_number) throw new Error("System needs phone_number");

    const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
    const existsCompany = inMemoryInstanceRepository.findOne({
      access_key,
    });

    if (!existsCompany) throw new Error("Doesn't exists this access_key");

    const instanceStatus = await inMemoryInstanceRepository.status({
      client: existsCompany.client,
    });

    if (instanceStatus.status !== "CONNECTED")
      throw new Error("Instance not connected");

    const response = await inMemoryInstanceRepository.existsNumber({
      client: existsCompany.client,
      phone_number,
    });
    return { exists: response ?? false };
  }
}
