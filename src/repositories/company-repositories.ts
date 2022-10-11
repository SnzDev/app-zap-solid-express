import { company } from "@prisma/client";

export interface CompanyRepository {
  findAll(): Promise<company[] | null>;
  findById(id: number): Promise<company | null>;
}
