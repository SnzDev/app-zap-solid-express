import { prisma } from "../../../../database/prisma";
import { InMemoryInstanceRepository } from "../../repositories/in-memory-instance-repository";
import { InstanceStatusResponseDTO } from "../../repositories/types/instance-dto";

class GetStatusInstanceUseCase {
  constructor() {}

  async execute(access_key: string) {
    if (!access_key) throw new Error("System needs access_key");
    let response: { status: any; qrcode: string | null } = {
      qrcode: "",
      status: "",
    };
    const inMemoryInstanceRepository = InMemoryInstanceRepository.getInstance();

    const existsCompany = inMemoryInstanceRepository.findOne({
      access_key,
    });
    if (!existsCompany) throw new Error("Instance does not exists");
    const instanceStatus = await inMemoryInstanceRepository.status({
      client: existsCompany.client,
    });
    response.status = instanceStatus.status;
    if (instanceStatus.status === "ON_RUNNING") {
      const data = await prisma.company.findFirst({ where: { access_key } });
      if (data) response.qrcode = data.qr ?? null;
    }
    return response;
  }
}

export { GetStatusInstanceUseCase };
