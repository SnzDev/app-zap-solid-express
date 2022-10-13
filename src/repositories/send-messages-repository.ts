import { send_messages_api } from "@prisma/client";
import {
  SendMessageCreateDTO,
  SendMessagesUpdateAckDTO,
  SendMessagesUpdateResponseDTO,
} from "./types/send-messages-dto";

export interface SendMessagesRepository {
  create(props: SendMessageCreateDTO): Promise<send_messages_api | void>;
  findByProtocol(protocol: string): Promise<send_messages_api | null>;
  findByIdMessage(id: string): Promise<send_messages_api | null>;
  updateAck(props: SendMessagesUpdateAckDTO): Promise<void>;
  updateResponse(props: SendMessagesUpdateResponseDTO): Promise<void>;
}
