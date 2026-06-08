import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Impede que o Next.js tente bundlizar módulos nativos do Puppeteer/Chromium.
  // Sem isso, o build quebra em produção ao tentar processar binários nativos.
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium-min"],
};

export default nextConfig;
