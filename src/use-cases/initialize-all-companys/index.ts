import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { InitializeAllCompanysController } from "./initialize-all-companys-controller";
import { InitializeAllCompanysUseCase } from "./initialize-all-companys-use-case";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaCompanyRepository = new PrismaCompanyRepository();

const initializeAllCompanysUseCase = new InitializeAllCompanysUseCase(
  prismaCompanyRepository,
  inMemoryInstanceRepository
);

const initializeAllCompanysController = new InitializeAllCompanysController(
  initializeAllCompanysUseCase
);

export { initializeAllCompanysController };
