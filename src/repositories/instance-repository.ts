import {
  InstanceCreateDTO,
  InstanceDestroyDTO,
  InstanceFindOneDTO,
  InstanceInitDTO,
  InstanceLogoutDTO,
  InstanceModelDTO,
  InstanceSendMessageDTO,
  InstanceSendMessageResponseDTO,
  InstanceSendSurveyDTO,
  InstanceStatusDTO,
  InstanceStatusResponseDTO,
} from "./types/instance-dto";

export interface InstanceRepository {
  create(props: InstanceCreateDTO): void;
  init(props: InstanceInitDTO): void;
  findAll(): InstanceModelDTO[];
  findOne(props: InstanceFindOneDTO): InstanceModelDTO | undefined;
  destroy(props: InstanceDestroyDTO): Promise<void>;
  logout(props: InstanceLogoutDTO): void;
  status(props: InstanceStatusDTO): Promise<InstanceStatusResponseDTO>;
  sendMessage(
    props: InstanceSendMessageDTO
  ): Promise<InstanceSendMessageResponseDTO>;
  // sendSurvey(
  //   props: InstanceSendSurveyDTO
  // ): Promise<InstanceSendSurveyResponseDTO>;
}
