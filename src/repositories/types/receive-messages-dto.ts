export interface CreateDTO {
  access_key: string;
  from: string;
  to: string;
  message_id: string;
  message_body: string;
  device_type: string;
  file_url?: string;
  has_media: boolean;
  timestamp: number;
}
