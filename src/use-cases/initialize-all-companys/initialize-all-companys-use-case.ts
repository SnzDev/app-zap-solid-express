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
          instance.client.on("qr", (qr) => {
            logger.info(
              { access_key: instance.access_key, qr: qr },
              `access_key: ${instance.access_key}, qr: ${qr} `
            );
            resolve(qr);
          });

          instance.client.on("ready", () => {
            logger.info(
              { access_key: instance.access_key, ready: true },
              `access_key: ${instance.access_key}, ready: ${true} `
            );

            resolve(true);
          });
        });
      await promise();
      instance.client.removeAllListeners();
    }
  }
}

export { InitializeAllCompanysUseCase };
