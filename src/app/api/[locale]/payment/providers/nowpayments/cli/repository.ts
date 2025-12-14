import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { RequestSchema, ResponseSchema } from "./definition";

interface NgrokTunnel {
  proto: string;
  public_url: string;
}

interface NgrokApiResponse {
  tunnels: NgrokTunnel[];
}

export interface CliNowpaymentsRepository {
  execute(
    params: RequestSchema,
    locale: string,
  ): Promise<ResponseType<ResponseSchema>>;
}

export class CliNowpaymentsRepositoryImpl implements CliNowpaymentsRepository {
  async execute(
    params: RequestSchema,
    locale: string,
  ): Promise<ResponseType<ResponseSchema>> {
    const { operation, port = 3000 } = params;

    switch (operation) {
      case "check":
        return this.checkNgrokInstallation();
      case "install":
        return this.getInstallInstructions();
      case "tunnel":
        return this.executeNgrokTunnelBlocking(port, locale);
      case "status":
        return this.checkTunnelStatus();
      default:
        return fail({
          message:
            "app.api.payment.providers.nowpayments.cli.post.errors.validationFailed.title" as const,
          errorType: ErrorResponseTypes.BAD_REQUEST,
          messageParams: { operation },
        });
    }
  }

  private async checkNgrokInstallation(): Promise<
    ResponseType<ResponseSchema>
  > {
    return new Promise((resolve) => {
      const ngrok = spawn("ngrok", ["version"]);
      let output = "";

      ngrok.stdout.on("data", (data) => {
        output += data.toString();
      });

      ngrok.on("close", (code) => {
        if (code === 0) {
          const version = output.trim().split(" ")[2] || output.trim();
          resolve(
            success({
              success: true,
              installed: true,
              version,
              status: "ngrok is installed and ready",
            }),
          );
        } else {
          resolve(
            success({
              success: false,
              installed: false,
              status: "ngrok is not installed",
            }),
          );
        }
      });

      ngrok.on("error", () => {
        resolve(
          success({
            success: false,
            installed: false,
            status: "ngrok is not installed",
          }),
        );
      });
    });
  }

  private async getInstallInstructions(): Promise<
    ResponseType<ResponseSchema>
  > {
    return success({
      success: true,
      instructions: `To install ngrok:

1. Visit https://ngrok.com/download
2. Download ngrok for your platform
3. Extract and move to your PATH
4. Run: ngrok authtoken YOUR_AUTH_TOKEN (get token from https://dashboard.ngrok.com/get-started/your-authtoken)

Or use package managers:
- macOS: brew install ngrok/ngrok/ngrok
- Linux: snap install ngrok
- Windows: choco install ngrok`,
    });
  }

  private async executeNgrokTunnelBlocking(
    port: number,
    locale: string,
  ): Promise<ResponseType<ResponseSchema>> {
    process.stdout.write(`\n🚀 Starting ngrok tunnel on port ${port}...\n\n`);

    spawn("ngrok", ["http", port.toString()], {
      stdio: "inherit",
    });

    // Wait for ngrok to start
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Query ngrok API to get tunnel URL
    const tunnelUrl = await this.getTunnelUrl();

    if (!tunnelUrl) {
      return fail({
        message:
          "app.api.payment.providers.nowpayments.cli.post.errors.serverError.title" as const,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: "Failed to get ngrok tunnel URL" },
      });
    }

    const webhookUrl = `${tunnelUrl}/api/${locale}/payment/providers/nowpayments/webhook`;

    // Update .env file
    this.updateTunnelUrl(tunnelUrl);

    process.stdout.write(`\n✅ ngrok tunnel started successfully!\n\n`);
    process.stdout.write(`📍 Tunnel URL: ${tunnelUrl}\n`);
    process.stdout.write(`🔗 Webhook URL: ${webhookUrl}\n\n`);
    process.stdout.write(`⚙️  Configuration:\n`);
    process.stdout.write(
      `   1. Go to https://nowpayments.io/app/settings/api\n`,
    );
    process.stdout.write(`   2. Set IPN Callback URL to: ${webhookUrl}\n`);
    process.stdout.write(`   3. Save your settings\n\n`);
    process.stdout.write(`🔄 Press Ctrl+C to stop the tunnel\n\n`);

    // Block forever - keep process running
    await new Promise<void>(() => {
      // This promise never resolves, keeping the tunnel alive
    });

    return success({
      success: true,
      tunnelUrl,
      webhookUrl,
      instructions: `Set this webhook URL in NOWPayments dashboard: ${webhookUrl}`,
    });
  }

  private async getTunnelUrl(): Promise<string | null> {
    try {
      const response = await fetch("http://localhost:4040/api/tunnels");
      const data = (await response.json()) as NgrokApiResponse;
      const tunnel = data.tunnels?.find((t) => t.proto === "https");
      return tunnel?.public_url || null;
    } catch {
      return null;
    }
  }

  private updateTunnelUrl(tunnelUrl: string): void {
    const envPath = join(process.cwd(), ".env");
    let envContent = readFileSync(envPath, "utf-8");

    // Update or add NEXT_PUBLIC_APP_URL
    if (envContent.includes("NEXT_PUBLIC_APP_URL=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_APP_URL=.*/,
        `NEXT_PUBLIC_APP_URL="${tunnelUrl}"`,
      );
    } else {
      envContent += `\nNEXT_PUBLIC_APP_URL="${tunnelUrl}"\n`;
    }

    writeFileSync(envPath, envContent);
    process.stdout.write(`✅ Updated .env file with tunnel URL\n`);
  }

  private async checkTunnelStatus(): Promise<ResponseType<ResponseSchema>> {
    try {
      const response = await fetch("http://localhost:4040/api/tunnels");
      const data = (await response.json()) as NgrokApiResponse;
      const tunnel = data.tunnels?.find((t) => t.proto === "https");

      if (tunnel) {
        return success({
          success: true,
          status: "Tunnel is running",
          tunnelUrl: tunnel.public_url,
        });
      } else {
        return success({
          success: false,
          status: "No tunnel found",
        });
      }
    } catch {
      return success({
        success: false,
        status: "ngrok is not running",
      });
    }
  }
}
