import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { InitializeInstanceUseCase } from "../initialize-instance/initialize-instance-use-case";
import { InitializeAllInstancesController } from "./initialize-all-instances-controller";
import { InitializeAllInstancesUseCase } from "./initialize-all-instances-use-case";

const prismaCompanyRepository = new PrismaCompanyRepository();
const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const initializeInstanceUseCase = new InitializeInstanceUseCase(
  inMemoryInstanceRepository,
  prismaCompanyRepository
);

const initializeAllInstancesUseCase = new InitializeAllInstancesUseCase(
  prismaCompanyRepository,
  initializeInstanceUseCase
);

const initializeAllInstancesController = new InitializeAllInstancesController(
  initializeAllInstancesUseCase
);

export { initializeAllInstancesController };
