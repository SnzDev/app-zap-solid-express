import { send_messages_api } from "@prisma/client";
import {
  SendMessagesUpdateAckDTO,
  SendMessagesUpdateResponseDTO,
} from "./types/send-messages-dto";

export interface SendMessagesRepository {
  // create(props: SendMessageCreateDTO): Promise<send_messages_api>;
  findByProtocol(protocol: string): Promise<send_messages_api | null>;
  findByIdMessage(id: string): Promise<send_messages_api | null>;
  updateAck(props: SendMessagesUpdateAckDTO): Promise<void>;
  updateResponse(props: SendMessagesUpdateResponseDTO): Promise<void>;
}
