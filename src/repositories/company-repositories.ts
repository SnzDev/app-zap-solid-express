import { company } from "@prisma/client";
import { CompanyFindByAccessKeyDTO } from "./types/company-dto";

export interface CompanyRepository {
  findAll(): Promise<company[] | null>;
  findById(id: number): Promise<company | null>;
  findByAccessKey({
    access_key,
  }: CompanyFindByAccessKeyDTO): Promise<company | null>;
}
