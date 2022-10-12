import { Exception } from "../../error";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";

export class DestroyInstanceUseCase {
  constructor(
    private inMemoryInstanceRepository: InMemoryInstanceRepository,
    private prismaCompanyRepository: PrismaCompanyRepository
  ) {}

  async execute(access_key: string) {
    const existsCompany = await this.prismaCompanyRepository.findByAccessKey(
      access_key
    );
    if (!existsCompany)
      throw new Exception(400, "Doesn't exists this access_key");

    const instanceStatus = await this.inMemoryInstanceRepository.status({
      access_key,
    });

    if (instanceStatus.status === "NOT_STARTED")
      throw new Exception(400, "Instance already destroyed");

    await this.inMemoryInstanceRepository.destroy({ access_key });
  }
}