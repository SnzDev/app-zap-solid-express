import { CompanyRepository } from "../company-repositories";
import { company } from "@prisma/client";
import { prisma } from "../../prisma";
import { logger } from "../../logger";

export class PrismaCompanyRepository implements CompanyRepository {
  async findAll(): Promise<company[] | null> {
    return await prisma.company
      .findMany()
      .then((response) => response)
      .catch((error) => {
        logger.error(error);
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
        logger.error(error);
        return error;
      });
  }
}
