import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";
import { GetStatusInterfaceController } from "./get-status-interface-controller";
import { GetStatusInterfaceUseCase } from "./get-status-interface-use-case";

const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
const prismaCompanyRepository = new PrismaCompanyRepository();

const getStatusInterfaceUseCase = new GetStatusInterfaceUseCase(
  inMemoryInstanceRepository,
  prismaCompanyRepository
);
const getStatusInterfaceController = new GetStatusInterfaceController(
  getStatusInterfaceUseCase
);

export { getStatusInterfaceController };
