export interface SendMessagesUpdateAckDTO {
  protocol: string;
  ack: number;
}

export interface SendMessagesUpdateResponseDTO {
  protocol: string;
  response: string;
}

export interface SendMessageCreateDTO {
  access_key: string;
  file_url?: string;
  ack: number;
  message_id: string;
  message_body: string;
  sender: string;
  destiny: string;
  timestamp: number;
}
