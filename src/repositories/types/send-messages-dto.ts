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
  is_survey?: boolean;
  first_option?: string;
  first_answer?: string;
  second_option?: string;
  second_answer?: string;
}
