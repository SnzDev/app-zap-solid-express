import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { DestroyInstanceController } from "./destroy-instance-controller";
import { DestroyInstanceUseCase } from "./destroy-instance-use-case";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaCompanyRepository = new PrismaCompanyRepository();

const destroyInstanceUseCase = new DestroyInstanceUseCase(
  inMemoryInstanceRepository,
  prismaCompanyRepository
);

const destroyInstanceController = new DestroyInstanceController(
  destroyInstanceUseCase
);

export { destroyInstanceController };
