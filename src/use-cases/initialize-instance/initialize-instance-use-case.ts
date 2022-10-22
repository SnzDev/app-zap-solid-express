import { prisma } from "../../database/prisma";
import { logger } from "../../logger";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";

export class InitializeInstanceUseCase {
  async execute(access_key: string) {
    if (!access_key) throw new Error("System needs access_key");

    const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
    const companyExists = inMemoryInstanceRepository.findOne({
      access_key,
    });
    if (!companyExists) throw new Error("Instance does not exists");

    const company = await prisma.company.findFirst({ where: { access_key } });

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
      .catch((error) => logger.error(`Line: ${company?.app}, error: ${error}`));
    const promise = () =>
      new Promise((resolve) => {
        instance.client.once("qr", (qr) => {
          logger.info(`Line: ${company?.app}, qr: ${qr}`);
          resolve(qr);
        });

        instance.client.once("ready", () => {
          logger.info(`Line: ${company?.app}, ready: ${true}`);
          resolve(true);
        });
      });
    await promise();
    instance.client.removeAllListeners();
  }
}
