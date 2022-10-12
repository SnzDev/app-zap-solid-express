import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { InitializeInstanceController } from "./initialize-instance-controller";
import { InitializeInstanceUseCase } from "./initialize-instance-use-case";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaCompanyRepository = new PrismaCompanyRepository();

const initializeInstanceUseCase = new InitializeInstanceUseCase(
  inMemoryInstanceRepository,
  prismaCompanyRepository
);

const initializeInstanceController = new InitializeInstanceController(
  initializeInstanceUseCase
);

export { initializeInstanceController };
