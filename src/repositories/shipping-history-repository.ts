import { shipping_history } from "@prisma/client";
import {
  ShippingHistoryUpdateResponseDTO,
  ShippingHistoryUpdateAckDTO,
} from "./types/shipping-history-dto";

export interface ShippingHistoryRepository {
  findAll(): Promise<shipping_history[] | null>;
  findByProtocol(protocol: string): Promise<shipping_history | null>;
  updateAck(props: ShippingHistoryUpdateAckDTO): Promise<void>;
  updateResponse(props: ShippingHistoryUpdateResponseDTO): Promise<void>;
}
