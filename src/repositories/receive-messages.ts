import { receive_messages_api } from "@prisma/client";
import { CreateDTO } from "./types/receive-messages-dto";

export interface ReceiveMessagesRepository {
  create(props: CreateDTO): Promise<receive_messages_api | void>;
  findFrom(phone_number: string): Promise<receive_messages_api | null>;
  findTo(phone_number: string): Promise<receive_messages_api | null>;
  findAccessKey(access_key: string): Promise<receive_messages_api | null>;
}
