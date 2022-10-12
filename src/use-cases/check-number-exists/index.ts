import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { CheckNumberExistsController } from "./check-number-exists-controller";
import { CheckNumberExistsUseCase } from "./check-number-exists-use-case";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaCompanyRepository = new PrismaCompanyRepository();

const checkNumberExistsUseCase = new CheckNumberExistsUseCase(
  inMemoryInstanceRepository,
  prismaCompanyRepository
);

const checkNumberExistsController = new CheckNumberExistsController(
  checkNumberExistsUseCase
);

export { checkNumberExistsController };
