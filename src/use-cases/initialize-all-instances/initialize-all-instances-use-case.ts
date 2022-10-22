import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { InitializeInstanceUseCase } from "../initialize-instance/initialize-instance-use-case";

class InitializeAllInstancesUseCase {
  async execute() {
    const prismaCompanyRepository = new PrismaCompanyRepository();
    const initializeInstanceUseCase = new InitializeInstanceUseCase();

    const companys = await prismaCompanyRepository.findAll();
    if (!companys) return;

    for (const company of companys) {
      await initializeInstanceUseCase.execute(company.access_key);
    }
  }
}

export { InitializeAllInstancesUseCase };
