import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";

import type { RequestSchema } from "./definition";
import type { NowpaymentsCliT } from "./i18n";

interface NgrokTunnel {
  proto: string;
  public_url: string;
}

interface NgrokApiResponse {
  tunnels: NgrokTunnel[];
}

export class CliNowpaymentsRepositoryImpl {
  static async execute(
    params: RequestSchema,
    locale: string,
    t: NowpaymentsCliT,
  ): Promise<ResponseType<never>> {
    const { port = 3000 } = params;

    const installed = await CliNowpaymentsRepositoryImpl.isNgrokInstalled();
    if (!installed) {
      return fail({
        message: t("post.errors.notInstalled.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: {
          instructions: CliNowpaymentsRepositoryImpl.getInstallInstructions(),
        },
      });
    }

    return CliNowpaymentsRepositoryImpl.runTunnel(port, locale, t);
  }

  private static isNgrokInstalled(): Promise<boolean> {
    return new Promise((resolve) => {
      const ngrok = spawn("ngrok", ["version"]);
      ngrok.on("close", (code) => resolve(code === 0));
      ngrok.on("error", () => resolve(false));
    });
  }

  private static getInstallInstructions(): string {
    return `To install ngrok:

1. Visit https://ngrok.com/download
2. Download ngrok for your platform
3. Extract and move to your PATH
4. Run: ngrok authtoken YOUR_AUTH_TOKEN (get token from https://dashboard.ngrok.com/get-started/your-authtoken)

Or use package managers:
- macOS: brew install ngrok/ngrok/ngrok
- Linux: snap install ngrok
- Windows: choco install ngrok`;
  }

  private static async runTunnel(
    port: number,
    locale: string,
    t: NowpaymentsCliT,
  ): Promise<ResponseType<never>> {
    process.stdout.write(`\n🚀 Starting ngrok tunnel on port ${port}...\n\n`);

    spawn("ngrok", ["http", port.toString()], { stdio: "inherit" });

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    const tunnelUrl = await CliNowpaymentsRepositoryImpl.getTunnelUrl();

    if (!tunnelUrl) {
      return fail({
        message: t("post.errors.serverError.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: "Failed to get ngrok tunnel URL" },
      });
    }

    const webhookUrl = `${tunnelUrl}/api/${locale}/payment/providers/nowpayments/webhook`;

    CliNowpaymentsRepositoryImpl.updateTunnelUrl(tunnelUrl);

    process.stdout.write(`\n✅ Tunnel started!\n`);
    process.stdout.write(`📍 ${tunnelUrl}\n`);
    process.stdout.write(`🔗 Webhook: ${webhookUrl}\n\n`);
    process.stdout.write(
      `Set IPN Callback URL in NOWPayments dashboard:\n  ${webhookUrl}\n\n`,
    );
    process.stdout.write(`Press Ctrl+C to stop.\n\n`);

    // Remove env var on exit
    process.on("SIGINT", () => {
      CliNowpaymentsRepositoryImpl.removeTunnelUrl();
      process.exit(0);
    });
    process.on("SIGTERM", () => {
      CliNowpaymentsRepositoryImpl.removeTunnelUrl();
      process.exit(0);
    });

    // Block forever — keep process running until Ctrl+C
    await new Promise<void>(() => {
      // intentionally never resolves
    });

    return success();
  }

  private static async getTunnelUrl(): Promise<string | null> {
    try {
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
      const response = await fetch("http://localhost:4040/api/tunnels");
      const data = (await response.json()) as NgrokApiResponse;
      const tunnel = data.tunnels?.find((t) => t.proto === "https");
      return tunnel?.public_url ?? null;
    } catch {
      return null;
    }
  }

  private static updateTunnelUrl(tunnelUrl: string): void {
    const envPath = join(process.cwd(), ".env");
    let envContent = readFileSync(envPath, "utf-8");

    if (envContent.includes("NOWPAYMENTS_CALLBACK_DOMAIN=")) {
      envContent = envContent.replace(
        /NOWPAYMENTS_CALLBACK_DOMAIN=.*/,
        `NOWPAYMENTS_CALLBACK_DOMAIN="${tunnelUrl}"`,
      );
    } else {
      envContent += `\nNOWPAYMENTS_CALLBACK_DOMAIN="${tunnelUrl}"\n`;
    }

    writeFileSync(envPath, envContent);
    process.stdout.write(`✅ Updated .env NOWPAYMENTS_CALLBACK_DOMAIN\n`);
  }

  static removeTunnelUrl(): void {
    const envPath = join(process.cwd(), ".env");
    let envContent = readFileSync(envPath, "utf-8");
    envContent = envContent.replace(
      /\nNOWPAYMENTS_CALLBACK_DOMAIN=.*\n?/,
      "\n",
    );
    writeFileSync(envPath, envContent);
    process.stdout.write(`✅ Removed NOWPAYMENTS_CALLBACK_DOMAIN from .env\n`);
  }
}
