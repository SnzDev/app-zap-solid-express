import { MessageMedia } from "whatsapp-web.js";
import { logger } from "../../logger";
import { ModelInstance } from "../../model/model-instance";
import { InstanceRepository } from "../instance-repository";
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
} from "../types/instance-dto";

export class InMemoryInstanceRepository implements InstanceRepository {
  private instanceRepository: InstanceModelDTO[];
  private static INSTANCE: InMemoryInstanceRepository;

  constructor() {
    this.instanceRepository = [];
  }
  init(props: InstanceInitDTO): void {
    throw new Error("Method not implemented.");
  }
  public static getInstance() {
    if (!InMemoryInstanceRepository.INSTANCE) {
      InMemoryInstanceRepository.INSTANCE = new InMemoryInstanceRepository();
    }

    return InMemoryInstanceRepository.INSTANCE;
  }
  create({ access_key }: InstanceCreateDTO): void {
    this.instanceRepository.push({
      access_key,
      client: ModelInstance(access_key),
    });
  }

  findAll(): InstanceModelDTO[] {
    return this.instanceRepository;
  }

  findOne({ access_key }: InstanceFindOneDTO): InstanceModelDTO | undefined {
    return this.instanceRepository.find(
      (repository) => repository.access_key === access_key
    );
  }

  async destroy({ access_key }: InstanceDestroyDTO): Promise<void> {
    const instance = this.findOne({ access_key });
    if (!instance) return;
    await instance.client
      .destroy()
      .then()
      .catch((error) =>
        logger.info(`access_key: ${access_key}, error: ${error}`)
      );
  }

  async logout({ access_key }: InstanceLogoutDTO): Promise<void> {
    const instance = this.findOne({ access_key });
    if (!instance) return;
    await instance.client
      .logout()
      .then()
      .catch((error) =>
        logger.info(`access_key: ${access_key}, error: ${error}`)
      );
  }

  async status({
    access_key,
  }: InstanceStatusDTO): Promise<InstanceStatusResponseDTO> {
    const instance = this.findOne({ access_key });

    if (!instance) return { status: "NOT_FOUND" };
    const response = await instance.client
      .getState()
      .then((response) => response)
      .catch((error) =>
        logger.info(`access_key: ${access_key}, error: ${error}`)
      );

    if (!response) return { status: "NOT_STARTED" };

    return { status: response };
  }

  async sendMessage({
    access_key,
    phoneNumber,
    message,
    imageUrl,
  }: InstanceSendMessageDTO): Promise<InstanceSendMessageResponseDTO> {
    const instance = await this.findOne({ access_key });
    if (!instance) return { status: "NOT_SEND" };

    if (!imageUrl) {
      const sendMessage = await instance.client
        .sendMessage(phoneNumber, message)
        .then((response) => response)
        .catch((error) =>
          logger.info(`access_key: ${access_key}, error: ${error}`)
        );

      return { status: !!sendMessage, message: sendMessage };
    }

    const media = await MessageMedia.fromUrl(imageUrl)
      .then((response) => response)
      .catch((error) =>
        logger.error(`access_key: ${access_key}, error: ${error}`)
      );

    if (!media) return { status: false, message: null };
    const sendMessage = await instance.client.sendMessage(phoneNumber, media, {
      caption: message,
    });

    return { status: !!sendMessage, message: sendMessage };
  }
}
