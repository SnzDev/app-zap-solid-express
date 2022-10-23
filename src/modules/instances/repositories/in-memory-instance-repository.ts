import WAWebJS, { ContactId } from "whatsapp-web.js";
import { logger } from "../../../logger";
import { ModelInstance } from "../model/instance-client";
import { InstanceRepository } from "../model/instance-repository";
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

export class InMemoryInstanceRepository implements InstanceRepository {
  private instanceRepository: InstanceModelDTO[];
  private static INSTANCE: InMemoryInstanceRepository;

  constructor() {
    this.instanceRepository = [];
  }

  public static getInstance() {
    if (!InMemoryInstanceRepository.INSTANCE) {
      InMemoryInstanceRepository.INSTANCE = new InMemoryInstanceRepository();
    }
    return InMemoryInstanceRepository.INSTANCE;
  }

  create({ access_key }: InstanceCreateDTO): InstanceModelDTO {
    const data = {
      access_key,
      client: ModelInstance(access_key),
    };
    this.instanceRepository.push(data);
    return data;
  }

  findAll(): InstanceModelDTO[] {
    return this.instanceRepository;
  }

  findOne({ access_key }: InstanceFindOneDTO): InstanceModelDTO | undefined {
    return this.instanceRepository.find(
      (repository) => repository.access_key === access_key
    );
  }

  async destroy({ client }: InstanceDestroyDTO): Promise<void> {
    logger.info(`Destroy`);
    await client.destroy();
    await client.removeAllListeners();
  }

  async logout({ client }: InstanceLogoutDTO): Promise<void> {
    logger.info(`Logout`);
    await client.logout();
    await client.removeAllListeners();
  }

  async status({
    client,
  }: InstanceStatusDTO): Promise<InstanceStatusResponseDTO> {
    const response = await client
      .getState()
      .then((response) => response ?? "ON_RUNNING")
      .catch((error): "NOT_STARTED" => {
        return "NOT_STARTED";
      });
    return { status: response };
  }
  async existsNumber({
    client,
    phone_number,
  }: InstanceExistsNumberDTO): Promise<ContactId | null> {
    return await client.getNumberId(phone_number);
  }
  async sendMessage({
    body,
    client,
    options,
    chatId,
  }: SendMessageDTO): Promise<WAWebJS.Message | void> {
    logger.info(`SendMessage: ${chatId}`);
    return await client.sendMessage(chatId, body, options);
  }
}
