import { Client } from "whatsapp-web.js";

export interface CreateNewLineDTO {
  access_key: string;
}

export interface InstanceModelDTO {
  access_key: string;
  client: Client;
}

export interface InstanceRepository {
  create(props: CreateNewLineDTO): void;
  findAll(): InstanceModelDTO[];
  finOne({ access_key }: CreateNewLineDTO): InstanceModelDTO | undefined;
  destroy({ access_key }): Promise<void>;
  logout({ access_key }): void;
}
