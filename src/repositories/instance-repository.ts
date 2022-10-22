import WAWebJS, { ContactId } from "whatsapp-web.js";
import {
  InstanceCreateDTO,
  InstanceDestroyDTO,
  InstanceExistsNumberDTO,
  InstanceFindOneDTO,
  InstanceLogoutDTO,
  InstanceModelDTO,
  InstanceStatusDTO,
  InstanceStatusResponseDTO,
  SendMessageDTO,
} from "./types/instance-dto";

export interface InstanceRepository {
  create(props: InstanceCreateDTO): Promise<InstanceModelDTO | undefined>;
  findAll(): InstanceModelDTO[];
  findOne(props: InstanceFindOneDTO): InstanceModelDTO | undefined;
  destroy(props: InstanceDestroyDTO): Promise<void>;
  logout(props: InstanceLogoutDTO): void;
  status(props: InstanceStatusDTO): Promise<InstanceStatusResponseDTO>;
  existsNumber(props: InstanceExistsNumberDTO): Promise<ContactId | null>;
  sendMessage(props: SendMessageDTO): Promise<WAWebJS.Message | void>;
  removeInstance(access_key: string): void;
}
