import { Exception } from "../../error";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";

interface CheckNumberExistsUseCaseDTO {
  access_key: string;
  phone_number: string;
}

export class CheckNumberExistsUseCase {
  constructor(
    private inMemoryInstanceRepository: InMemoryInstanceRepository,
    private prismaCompanyRepository: PrismaCompanyRepository
  ) {}

  async execute({ access_key, phone_number }: CheckNumberExistsUseCaseDTO) {
    // if (phone_number.length !== 12)
    //   throw new Exception(400, "Phone numer needs lenght 12");

    const existsCompany = await this.prismaCompanyRepository.findByAccessKey({
      access_key,
    });

    if (!existsCompany)
      throw new Exception(400, "Doesn't exists this access_key");
    const instanceStatus = await this.inMemoryInstanceRepository.status({
      access_key,
    });

    if (instanceStatus.status !== "CONNECTED")
      throw new Exception(400, "Instance not connected");

    return await this.inMemoryInstanceRepository.existsNumber({
      access_key,
      phone_number,
    });
  }
}
