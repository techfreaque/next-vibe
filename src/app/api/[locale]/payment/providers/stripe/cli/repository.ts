import "server-only";

import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { paymentEnv } from "../../../env";
import type { StripeT } from "../i18n";
import type { CliStripeRequestOutput } from "./definition";

export class CliStripeRepository {
  static async processStripe(
    data: CliStripeRequestOutput,
    user: JwtPayloadType,
    t: StripeT,
    logger: EndpointLogger,
  ): Promise<ResponseType<never>> {
    logger.debug("Starting Stripe CLI listener", { userId: user.id });

    if (!CliStripeRepository.isStripeCLIInstalled()) {
      return fail({
        message: t("status.not_installed"),
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: {
          instructions: CliStripeRepository.getStripeCLIInstallInstructions(),
        },
      });
    }

    const port = data.port ?? 3000;
    const webhookUrl = `http://localhost:${port}/api/en-GLOBAL/payment/providers/stripe/webhook`;

    try {
      const listenResult = await CliStripeRepository.runListener(
        webhookUrl,
        logger,
        t,
      );
      if (!listenResult.success) {
        return listenResult;
      }
      return success();
    } catch (error) {
      logger.error("Error running Stripe CLI listener:", parseError(error));
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  private static isStripeCLIInstalled(): boolean {
    try {
      // eslint-disable-next-line i18next/no-literal-string
      execSync("stripe --version", { stdio: "pipe" });
      return true;
    } catch {
      return false;
    }
  }

  /* eslint-disable i18next/no-literal-string */
  private static getStripeCLIInstallInstructions(): string {
    return [
      "Stripe CLI is not installed. Install it from: https://docs.stripe.com/stripe-cli",
      "",
      "macOS:  brew install stripe/stripe-cli/stripe",
      "Linux:  see https://docs.stripe.com/stripe-cli#install",
      "Windows: scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git && scoop install stripe",
      "",
      "After installation, run: stripe login",
    ].join("\n");
  }
  /* eslint-enable i18next/no-literal-string */

  private static async runListener(
    webhookUrl: string,
    logger: EndpointLogger,
    t: StripeT,
  ): Promise<ResponseType<void>> {
    logger.debug("Forwarding webhooks to", { webhookUrl });

    // Listen on the same Stripe account the server uses — the CLI's
    // logged-in account can differ, in which case no app events would
    // ever reach the listener.
    if (!paymentEnv.STRIPE_SECRET_KEY) {
      return fail({
        message: t("errors.notConfigured.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const stripeProcess = spawn(
      "stripe",
      [
        "listen",
        "--forward-to",
        webhookUrl,
        "--api-key",
        paymentEnv.STRIPE_SECRET_KEY,
      ],
      {
        stdio: ["pipe", "pipe", "pipe"],
      },
    );

    stripeProcess.stdout?.on("data", (data: Buffer) => {
      process.stdout.write(data.toString());
      CliStripeRepository.handleOutput(data, logger);
    });

    stripeProcess.stderr?.on("data", (data: Buffer) => {
      process.stderr.write(data.toString());
      CliStripeRepository.handleOutput(data, logger);
    });

    try {
      await new Promise<void>((resolve, reject) => {
        stripeProcess.on("close", (code: number | null) => {
          if (code === 0 || code === null) {
            resolve();
          } else {
            reject(new Error(`Stripe listener exited with code ${code}`));
          }
        });
        stripeProcess.on("error", reject);
      });
    } catch (error) {
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }

    return success(undefined);
  }

  private static handleOutput(data: Buffer, logger: EndpointLogger): void {
    const output = data.toString().trim();
    if (!output) {
      return;
    }

    logger.debug(`[Stripe] ${output}`);

    // eslint-disable-next-line i18next/no-literal-string
    if (
      output.includes("api_key_expired") ||
      output.includes("Expired API Key provided")
    ) {
      logger.error(
        "Stripe API key expired. Rotate at https://dashboard.stripe.com/test/apikeys then run: stripe login",
      );
    }

    // eslint-disable-next-line i18next/no-literal-string
    const secretMatch = output.match(/whsec_[a-zA-Z0-9]+/);
    if (secretMatch) {
      logger.debug(`Webhook signing secret: ${secretMatch[0]}`);
      CliStripeRepository.updateWebhookSecret(secretMatch[0], logger);
    }
  }

  private static updateWebhookSecret(
    secret: string,
    logger: EndpointLogger,
  ): void {
    try {
      // eslint-disable-next-line i18next/no-literal-string
      const envPath = path.join(process.cwd(), ".env");
      if (!fs.existsSync(envPath)) {
        return;
      }

      let envContent = fs.readFileSync(envPath, "utf-8");
      // eslint-disable-next-line i18next/no-literal-string
      const replacement = `STRIPE_WEBHOOK_SECRET="${secret}"`;
      envContent = /^STRIPE_WEBHOOK_SECRET=.*$/m.test(envContent)
        ? envContent.replace(/^STRIPE_WEBHOOK_SECRET=.*$/gm, replacement)
        : `${envContent}\n${replacement}\n`;
      fs.writeFileSync(envPath, envContent, "utf-8");
      logger.debug("Updated STRIPE_WEBHOOK_SECRET in .env");
    } catch (error) {
      logger.error("Failed to update .env:", parseError(error));
    }
  }
}
