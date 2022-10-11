import { logger } from "../../logger";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";

class InitializeAllCompanysUseCase {
  constructor(
    private prismaCompanyRepository?: PrismaCompanyRepository,
    private inMemoryInstanceRepository?: InMemoryInstanceRepository
  ) {}

  async execute() {
    const companys = await this.prismaCompanyRepository?.findAll();
    companys?.forEach((company) => {
      this.inMemoryInstanceRepository?.create({
        access_key: company.access_key,
      });
    });
    this.inMemoryInstanceRepository?.findAll().forEach(async (instance) => {
      try {
        instance.client.initialize();
        logger.info(instance.access_key);
      } catch (e) {
        logger.error(instance.access_key);
      }
    });
  }
}

export { InitializeAllCompanysUseCase };
