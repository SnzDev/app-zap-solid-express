import { logger } from "../../logger";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";

export class InitializeInstanceUseCase {
  async execute(access_key: string) {
    const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
    const companyExists = await inMemoryInstanceRepository.findOne({
      access_key,
    });
    if (!companyExists) throw new Error("Instance does not exists");

    const instanceStatus = await inMemoryInstanceRepository.status({
      client: companyExists.client,
    });

    if (instanceStatus.status !== "NOT_STARTED")
      throw new Error("Instance already started");

    await inMemoryInstanceRepository.destroy({ client: companyExists.client });
    inMemoryInstanceRepository.removeInstance(access_key);

    const instance = await inMemoryInstanceRepository.create({
      access_key,
    });

    if (!instance) throw new Error("Not created!");

    instance.client
      .initialize()
      .then()
      .catch((error) =>
        logger.error(
          { access_key: instance.access_key, error },
          `${instance.access_key}, error: ${error}`
        )
      );
    const promise = () =>
      new Promise((resolve) => {
        instance.client.once("qr", (qr) => {
          logger.info(
            { access_key: instance.access_key, qr: qr },
            `First open: ${instance.access_key}, qr: ${qr} `
          );
          resolve(qr);
        });

        instance.client.once("ready", () => {
          logger.info(
            { access_key: instance.access_key, ready: true },
            `First open: ${instance.access_key}, ready: ${true} `
          );

          resolve(true);
        });
      });
    await promise();
    instance.client.removeAllListeners();
  }
}
