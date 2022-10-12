import { logger } from "../../logger";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { InitializeInstanceUseCase } from "../initialize-instance/initialize-instance-use-case";

class InitializeAllInstancesUseCase {
  constructor(
    private prismaCompanyRepository: PrismaCompanyRepository,
    private initializeInstanceUseCase: InitializeInstanceUseCase
  ) {}

  async execute() {
    const companys = await this.prismaCompanyRepository?.findAll();
    if (!companys) return;

    for (const company of companys) {
      await this.initializeInstanceUseCase.execute(company.access_key);
    }
  }
}

export { InitializeAllInstancesUseCase };
