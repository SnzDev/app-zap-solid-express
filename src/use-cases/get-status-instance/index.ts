import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { GetStatusInstanceController } from "./get-status-instance-controller";
import { GetStatusInstanceUseCase } from "./get-status-instance-use-case";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaCompanyRepository = new PrismaCompanyRepository();

const getStatusInstanceUseCase = new GetStatusInstanceUseCase(
  inMemoryInstanceRepository,
  prismaCompanyRepository
);
const getStatusInstanceController = new GetStatusInstanceController(
  getStatusInstanceUseCase
);

export { getStatusInstanceController };
