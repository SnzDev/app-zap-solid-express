import { CompanyRepository } from "../company-repository";
import { company } from "@prisma/client";
import { prisma } from "../../database/prisma";
import { logger } from "../../logger";
import { CompanyFindByAccessKeyDTO } from "../types/company-dto";

export class PrismaCompanyRepository implements CompanyRepository {
  async findByAccessKey({
    access_key,
  }: CompanyFindByAccessKeyDTO): Promise<company | null> {
    return await prisma.company
      .findFirst({
        where: {
          access_key,
        },
      })
      .then((response) => response)
      .catch((error) => {
        logger.error(`Company: ${error}`);
        return error;
      });
  }
  async findAll(): Promise<company[] | null> {
    return await prisma.company
      .findMany()
      .then((response) => response)
      .catch((error) => {
        logger.error(`Company: ${error}`);
        return error;
      });
  }
  async findById(id: number): Promise<company | null> {
    return await prisma.company
      .findFirst({
        where: {
          id,
        },
      })
      .then((response) => response)
      .catch((error) => {
        logger.error(`Company: ${error}`);
        return error;
      });
  }
}
