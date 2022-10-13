import WAWebJS, { ContactId } from "whatsapp-web.js";
import {
  InstanceCreateDTO,
  InstanceDestroyDTO,
  InstanceExistsNumberDTO,
  InstanceExistsNumberResponseDTO,
  InstanceFindOneDTO,
  InstanceLogoutDTO,
  InstanceModelDTO,
  InstanceSendMessageDTO,
  InstanceSendSurveyDTO,
  InstanceStatusDTO,
  InstanceStatusResponseDTO,
  SendOneMessageDTO,
} from "./types/instance-dto";

export interface InstanceRepository {
  create(props: InstanceCreateDTO): Promise<InstanceModelDTO | undefined>;
  findAll(): InstanceModelDTO[];
  findOne(props: InstanceFindOneDTO): InstanceModelDTO | undefined;
  destroy(props: InstanceDestroyDTO): Promise<void>;
  logout(props: InstanceLogoutDTO): void;
  status(props: InstanceStatusDTO): Promise<InstanceStatusResponseDTO>;
  existsNumber(props: InstanceExistsNumberDTO): Promise<ContactId | null>;
  sendMessage(props: InstanceSendMessageDTO): Promise<{
    message: WAWebJS.Message;
  }>;
  sendOneMessage(props: SendOneMessageDTO): Promise<WAWebJS.Message | void>;
}
