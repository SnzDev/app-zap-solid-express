import { prisma } from "../../../../database/prisma";
import { logger } from "../../../../logger";
import { InMemoryInstanceRepository } from "../../repositories/in-memory-instance-repository";
import { InitializeListenerUseCase } from "../initialize-listener/initialize-listener-use-case";

export class InitializeInstanceUseCase {
  async execute(access_key: string) {
    if (!access_key) throw new Error("System needs access_key");

    const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();
    const initializeListenerUseCase = new InitializeListenerUseCase();
    let companyExists = inMemoryInstanceRepository.findOne({
      access_key,
    });
    const company = await prisma.company.findFirst({ where: { access_key } });

    if (!company) throw new Error("Instance does not exists");
    if (!companyExists)
      companyExists = inMemoryInstanceRepository.create({ access_key });

    if (!companyExists) throw new Error("Instance not created");

    const instanceStatus = await inMemoryInstanceRepository.status({
      client: companyExists.client,
    });

    if (instanceStatus.status !== "NOT_STARTED")
      throw new Error("Instance already started");

    // await inMemoryInstanceRepository.destroy({
    //   client: companyExists.client,
    // });

    companyExists.client
      .initialize()
      .then()
      .catch((error) => logger.error(`Line: ${company.name}, error: ${error}`));

    const promise = () =>
      new Promise((resolve) => {
        companyExists?.client.once("qr", (qr) => {
          prisma.company
            .update({
              where: { access_key: access_key },
              data: { qr: qr },
            })
            .then(() => logger.info(`Line: ${company.name}, qrcode update`))
            .catch((e) =>
              logger.error(`Line: ${company.name}, qrUpdateError: ${e}`)
            );
          resolve(qr);
        });

        companyExists?.client.once("ready", () => {
          logger.info(`Line: ${company.name}, ready to use`);
          const clientInfo = companyExists?.client.info;
          prisma.company
            .update({
              data: {
                app: clientInfo?.pushname ?? undefined,
                line: clientInfo?.wid.user,
                qr: "",
              },
              where: { access_key: companyExists?.access_key },
            })
            .then(() => logger.info(`Line: ${company.name}, qrcode removed`))

            .catch((e) =>
              logger.error(`Line: ${company.name}, updateClientInfo: ${e}`)
            );
          resolve(true);
        });
      });
    await promise();
    companyExists.client.removeAllListeners();
    await initializeListenerUseCase.execute(access_key);
  }
}
