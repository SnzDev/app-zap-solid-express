import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { LogoutInstanceController } from "./logout-instance-controller";
import { LogoutInstanceUseCase } from "./logout-instance-use-case";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaCompanyRepository = new PrismaCompanyRepository();

const logoutInstanceUseCase = new LogoutInstanceUseCase(
  prismaCompanyRepository,
  inMemoryInstanceRepository
);

const logoutInstanceController = new LogoutInstanceController(
  logoutInstanceUseCase
);

export { logoutInstanceController };
