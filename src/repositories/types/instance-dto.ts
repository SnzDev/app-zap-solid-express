import WAWebJS, { Client, WAState } from "whatsapp-web.js";

export interface InstanceCreateDTO {
  access_key: string;
}

export interface InstanceModelDTO {
  access_key: string;
  client: Client;
}

export interface InstanceFindOneDTO {
  access_key: string;
}

export interface InstanceDestroyDTO {
  access_key: string;
}

export interface InstanceLogoutDTO {
  access_key: string;
}

export interface InstanceFindOneDTO {
  access_key: string;
}

export interface InstanceStatusDTO {
  access_key: string;
}
export interface InstanceStatusResponseDTO {
  status: "DISCONNECTED" | "ON_RUNNING" | "NOT_STARTED" | "NOT_FOUND" | WAState;
}

export interface InstanceStatusDTO {
  access_key: string;
}

export interface InstanceSendMessageDTO {
  access_key: string;
  phoneNumber: string;
  message: string;
  imageUrl?: string;
}
export interface InstanceSendMessageResponse {
  message: WAWebJS.Message;
}

export interface InstanceSendSurveyDTO {
  access_key: string;
  phoneNumber: string;
  message: string;
  firstOption: string;
  firstAnswer: string;
  secondOption: string;
  secondAnswer: string;
  useButtons: boolean;
}
export interface InstanceSendMessageResponseDTO {}