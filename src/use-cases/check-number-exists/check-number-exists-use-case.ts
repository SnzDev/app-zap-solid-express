import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { prisma } from "../../database/prisma";

interface CheckNumberExistsUseCaseDTO {
  access_key: string;
  phone_number: string;
}

export class CheckNumberExistsUseCase {
  async execute({ access_key, phone_number }: CheckNumberExistsUseCaseDTO) {
    if (!access_key) throw new Error("System needs access_key");
    if (!phone_number) throw new Error("System needs phone_number");

    const inMemoryInstanceRepository = new InMemoryInstanceRepository();
    const existsCompany = await prisma.company.findFirst({
      where: { access_key },
    });

    if (!existsCompany) throw new Error("Doesn't exists this access_key");

    const instanceStatus = await inMemoryInstanceRepository.status({
      access_key,
    });

    if (instanceStatus.status !== "CONNECTED")
      throw new Error("Instance not connected");

    return await inMemoryInstanceRepository.existsNumber({
      access_key,
      phone_number,
    });
  }
}
