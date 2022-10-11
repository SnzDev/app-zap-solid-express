import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";

class GetStatusInterfaceUseCase {
  constructor(
    private inMemoryInstanceRepository: InMemoryInstanceRepository,
    private prismaCompanyRepository: PrismaCompanyRepository
  ) {}

  async execute(access_key: string) {
    const company = await this.prismaCompanyRepository.findByAccessKey(
      access_key
    );
    if (!company) return;

    return await this.inMemoryInstanceRepository.status({ access_key });
  }
}

export { GetStatusInterfaceUseCase };
