import { prisma } from "../../../../database/prisma";
import { InitializeInstanceUseCase } from "../initialize-instance/initialize-instance-use-case";

class InitializeAllInstancesUseCase {
  async execute() {
    const initializeInstanceUseCase = new InitializeInstanceUseCase();

    const companys = await prisma.company.findMany();
    if (!companys) return;

    for (const company of companys) {
      await initializeInstanceUseCase.execute(company.access_key);
    }
  }
}

export { InitializeAllInstancesUseCase };
