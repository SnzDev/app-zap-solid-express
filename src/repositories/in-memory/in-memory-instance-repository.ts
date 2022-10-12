import { ContactId, MessageMedia } from "whatsapp-web.js";
import { logger } from "../../logger";
import { ModelInstance } from "../../model/model-instance";
import { Exception } from "../../error";
import { InstanceRepository } from "../instance-repository";
import {
  InstanceCreateDTO,
  InstanceDestroyDTO,
  InstanceExistsNumberDTO,
  InstanceExistsNumberResponseDTO,
  InstanceFindOneDTO,
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

  public static getInstance() {
    if (!InMemoryInstanceRepository.INSTANCE) {
      InMemoryInstanceRepository.INSTANCE = new InMemoryInstanceRepository();
    }

    return InMemoryInstanceRepository.INSTANCE;
  }
  async create({
    access_key,
  }: InstanceCreateDTO): Promise<InstanceModelDTO | undefined> {
    const instanceExists = this.findOne({ access_key });
    //IF EXISTS INSTANCE, DESTROY IT
    if (instanceExists) {
      await this.destroy({ access_key });
      const index = this.instanceRepository.indexOf(instanceExists);
      return (this.instanceRepository[index] = {
        access_key,
        client: ModelInstance(access_key),
      });
    }
    //IF NOT EXISTS INSTANCE PUSH A NEW
    this.instanceRepository.push({
      access_key,
      client: ModelInstance(access_key),
    });
    return this.findOne({ access_key });
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
      .then(() => logger.info(`access_key: ${access_key}, destroyed session`))
      .catch((error) =>
        logger.info(`access_key: ${access_key}, error: ${error}`)
      );
  }

  async logout({ access_key }: InstanceLogoutDTO): Promise<void> {
    const instance = this.findOne({ access_key });
    if (!instance) return;
    await instance.client
      .logout()
      .then(() => logger.info(`access_key: ${access_key}, logout session`))
      .catch((error) =>
        logger.info(`access_key: ${access_key}, error: ${error}`)
      );
  }

  async status({
    access_key,
  }: InstanceStatusDTO): Promise<InstanceStatusResponseDTO> {
    const instance = this.findOne({ access_key });

    //IF DOESN'T HAVE INSTANCE CREATED RETURN NOT_STARTED
    if (!instance) return { status: "NOT_STARTED" };

    const response = await instance.client
      .getState()
      .then((response) => response ?? "ON_RUNNING")
      .catch((error): "NOT_STARTED" => "NOT_STARTED");

    logger.info(`access_key: ${access_key}, status: ${response}`);

    return { status: response };
  }
  async existsNumber({
    access_key,
    phone_number,
  }: InstanceExistsNumberDTO): Promise<ContactId | null> {
    const instance = this.findOne({ access_key });
    if (!instance) throw new Exception(400, "Instance not started");

    return await instance.client.getNumberId(phone_number);
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
