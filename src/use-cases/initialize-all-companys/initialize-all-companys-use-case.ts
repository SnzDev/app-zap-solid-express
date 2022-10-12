import { logger } from "../../logger";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";

class InitializeAllCompanysUseCase {
  constructor(
    private prismaCompanyRepository?: PrismaCompanyRepository,
    private inMemoryInstanceRepository?: InMemoryInstanceRepository
  ) {}

  async execute() {
    const companys = await this.prismaCompanyRepository?.findAll();
    companys?.forEach((company) => {
      this.inMemoryInstanceRepository?.create({
        access_key: company.access_key,
      });
    });

    const instances = this.inMemoryInstanceRepository?.findAll();
    if (!instances) return;

    for (const instance of instances) {
      instance.client
        .initialize()
        .then()
        .catch((error) =>
          logger.error(
            { access_key: instance.access_key, error },
            `access_key: ${instance.access_key}, error: ${error}`
          )
        );
      const promise = () =>
        new Promise((resolve) => {
          instance.client.once("qr", (qr) => {
            logger.info(
              { access_key: instance.access_key, qr: qr },
              `access_key: ${instance.access_key}, qr: ${qr} `
            );
            instance.client.removeListener("ready", () => {});
            resolve(qr);
          });

          instance.client.once("ready", () => {
            logger.info(
              { access_key: instance.access_key, ready: true },
              `access_key: ${instance.access_key}, ready: ${true} `
            );
            instance.client.removeListener("qr", () => {});

            resolve(true);
          });
        });
      await promise();
    }
  }
}

export { InitializeAllCompanysUseCase };
