import WAWebJS, { ContactId } from "whatsapp-web.js";
import { logger } from "../../logger";
import { ModelInstance } from "../../model/model-instance";
import { InstanceRepository } from "../instance-repository";
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
} from "../types/instance-dto";

export class InMemoryInstanceRepository implements InstanceRepository {
  private instanceRepository: InstanceModelDTO[];
  private static INSTANCE: InMemoryInstanceRepository;

  constructor() {
    this.instanceRepository = [];
  }
  removeInstance(access_key: string): void {
    const instanceExists = this.instanceRepository.find((value) => {
      value.access_key === access_key;
    });
    if (!instanceExists) return;

    const index = this.instanceRepository.indexOf(instanceExists);
    this.instanceRepository.splice(index, 1);
  }

  public static getInstance() {
    if (!InMemoryInstanceRepository.INSTANCE) {
      InMemoryInstanceRepository.INSTANCE = new InMemoryInstanceRepository();
    }
    return InMemoryInstanceRepository.INSTANCE;
  }

  async create({ access_key }: InstanceCreateDTO): Promise<InstanceModelDTO> {
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
    return await client.destroy();
  }

  async logout({ client }: InstanceLogoutDTO): Promise<void> {
    logger.info(`Logout`);
    return await client.logout();
  }

  async status({
    client,
  }: InstanceStatusDTO): Promise<InstanceStatusResponseDTO> {
    const response = await client
      .getState()
      .then((response) => response ?? "ON_RUNNING")
      .catch((error): "NOT_STARTED" => "NOT_STARTED");
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
