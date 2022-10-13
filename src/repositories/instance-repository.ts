import { ContactId } from "whatsapp-web.js";
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
} from "./types/instance-dto";

export interface InstanceRepository {
  create(props: InstanceCreateDTO): Promise<InstanceModelDTO | undefined>;
  findAll(): InstanceModelDTO[];
  findOne(props: InstanceFindOneDTO): InstanceModelDTO | undefined;
  destroy(props: InstanceDestroyDTO): Promise<void>;
  logout(props: InstanceLogoutDTO): void;
  status(props: InstanceStatusDTO): Promise<InstanceStatusResponseDTO>;
  existsNumber(props: InstanceExistsNumberDTO): Promise<ContactId | null>;
  // sendMessage(
  //   props: InstanceSendMessageDTO
  // ): Promise<InstanceSendMessageResponseDTO>;
  // sendSurvey(
  //   props: InstanceSendSurveyDTO
  // ): Promise<InstanceSendSurveyResponseDTO>;
}
