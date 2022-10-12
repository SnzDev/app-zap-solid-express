import { logger } from "../../logger";
import { InMemoryInstanceRepository } from "../../repositories/in-memory/in-memory-instance-repository";
import { PrismaCompanyRepository } from "../../repositories/prisma/prisma-company-repository";

export class InitializeInstanceUseCase {
  constructor(
    private inMemoryInstanceRepository: InMemoryInstanceRepository,
    private prismaCompanyRepository: PrismaCompanyRepository
  ) {}

  async execute(access_key: string) {
    const company = await this.prismaCompanyRepository.findByAccessKey(
      access_key
    );
    //IF DOESN'T HAVE A COMPANY WITH THE ACCESS KEY JUST RETURN VOID
    if (!company) return false;

    const instanceStatus = await this.inMemoryInstanceRepository.status({
      access_key,
    });

    //IF DOESN'T HAVE INSTANCE CREATED
    if (instanceStatus.status === "NOT_STARTED") {
      const instance = await this.inMemoryInstanceRepository.create({
        access_key,
      });

      if (!instance) return false;

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
            resolve(qr);
          });

          instance.client.once("ready", () => {
            logger.info(
              { access_key: instance.access_key, ready: true },
              `access_key: ${instance.access_key}, ready: ${true} `
            );

            resolve(true);
          });
        });
      await promise();
      instance.client.removeAllListeners();

      return true;
    }
  }
}
