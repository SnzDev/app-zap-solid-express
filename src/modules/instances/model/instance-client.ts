import { Client, LocalAuth } from "whatsapp-web.js";

const version = process.env.WA_VERSION ?? "2.2412.54";
export const ModelInstance = (access_key: string) =>
  new Client({
    webVersionCache: {
      type: "remote",
      remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${version}.html`,
    },
    webVersion: version,

    puppeteer: {
      devtools: false,
      executablePath: process.env.CHROME_PATH ?? undefined,
      headless: process.env.HEADLESS == "true" ?? false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process", // <- this one doesn"t works in Windows
        "--disable-gpu",
        "--log-level=3", // fatal only
        "--no-default-browser-check",
        "--disable-infobars",
        "--disable-web-security",
        "--disable-site-isolation-trials",
        "--no-experiments",
        "--ignore-gpu-blacklist",
        "--ignore-certificate-errors",
        "--ignore-certificate-errors-spki-list",
        "--disable-extensions",
        "--disable-default-apps",
        "--enable-features=NetworkService",
      ],
    },
    authStrategy: new LocalAuth({
      clientId: access_key,
      dataPath: "./whatsapp_auth",
    }),
  });
