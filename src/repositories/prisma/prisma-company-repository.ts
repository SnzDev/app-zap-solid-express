import { CompanyRepository } from "../company-repositories";
import { company } from "@prisma/client";
import { prisma } from "../../prisma";

export class PrismaCompanyRepository implements CompanyRepository {
  async findAll(): Promise<company[] | null> {
    return await prisma.company.findMany();
  }
  async findById(id: number): Promise<company | null> {
    return await prisma.company.findFirst({
      where: {
        id,
      },
    });
  }
}
