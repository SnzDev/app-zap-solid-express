import { ModelInstance } from "../../model/model-instance";
import {
  CreateNewLineDTO,
  InstanceModelDTO,
  InstanceRepository,
} from "../instance-repository";

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
  create({ access_key }: CreateNewLineDTO): void {
    this.instanceRepository.push({
      access_key,
      client: ModelInstance(access_key),
    });
  }

  findAll(): InstanceModelDTO[] {
    return this.instanceRepository;
  }

  finOne({ access_key }: CreateNewLineDTO): InstanceModelDTO | undefined {
    return this.instanceRepository.find(
      (repository) => repository.access_key === access_key
    );
  }

  async destroy({ access_key }: { access_key: any }): Promise<void> {
    const response = this.finOne({ access_key });
    if (response) await response.client.destroy();
  }

  async logout({ access_key }: { access_key: any }): Promise<void> {
    const response = this.finOne({ access_key });
    if (response) await response.client.logout();
  }
}
