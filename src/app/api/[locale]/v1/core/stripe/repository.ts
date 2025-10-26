/**
 * CLI Stripe Repository
 * Consolidated Stripe CLI integration functionality
 * Migrated from cli/utils/stripe-utils.ts
 */

import "server-only";

import type { ChildProcess } from "node:child_process";
import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { JwtPayloadType } from "../user/auth/definition";
import type {
  CliStripeRequestOutput,
  CliStripeResponseOutput,
} from "./definition";

// ===== REPOSITORY INTERFACE =====

/**
 * CLI Stripe Repository Interface
 */
export interface CliStripeRepository {
  processStripe(
    data: CliStripeRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<CliStripeResponseOutput>;

  checkInstallation(logger: EndpointLogger): ResponseType<boolean>;
  startListener(
    webhookUrl: string | undefined,
    logger: EndpointLogger,
  ): ResponseType<string>;
  checkAuthentication(logger: EndpointLogger): ResponseType<boolean>;
}

/**
 * CLI Stripe Repository Implementation
 */
export class CliStripeRepositoryImpl implements CliStripeRepository {
  private activeListeners: Map<string, ChildProcess> = new Map();

  /**
   * Process Stripe CLI operations
   */
  processStripe(
    data: CliStripeRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<CliStripeResponseOutput> {
    const { t } = simpleT(locale);

    try {
      logger.debug("Processing Stripe CLI operation", {
        operation: data.operation,
        userId: user.id,
        port: data.port,
        events: data.events,
      });

      const response: CliStripeResponseOutput = {
        success: true,
      };

      switch (data.operation) {
        case "check": {
          const installed = this.isStripeCLIInstalled();
          response.installed = installed;
          if (installed) {
            response.version = this.getStripeVersion();
          } else {
            response.instructions = this.getStripeCLIInstallInstructions();
          }
          break;
        }
        case "install": {
          response.instructions = this.getStripeCLIInstallInstructions();
          response.success = false; // Cannot auto-install, only provide instructions
          break;
        }
        case "listen": {
          const webhookUrl =
            data.forwardTo ||
            "http://localhost:3000/api/en-GLOBAL/v1/payment/webhook/stripe";
          const listenerResult = this.startStripeListener(
            webhookUrl,
            data.events,
            data.skipSslVerify || false,
            logger,
          );
          response.success = listenerResult.success;
          if (listenerResult.success) {
            response.webhookEndpoint = webhookUrl;
            response.status = "listening";
          }
          break;
        }
        case "login": {
          logger.debug(t("app.api.v1.core.stripe.login.instructions"));
          response.instructions = t(
            "app.api.v1.core.stripe.login.instructions",
          );
          break;
        }
        case "status": {
          response.installed = this.isStripeCLIInstalled();
          if (response.installed) {
            response.version = this.getStripeVersion();
            const authenticated = this.checkStripeAuth(logger);
            response.status = authenticated
              ? t("app.api.v1.core.stripe.status.authenticated")
              : t("app.api.v1.core.stripe.status.not_authenticated");
          } else {
            response.status = t("app.api.v1.core.stripe.status.not_installed");
          }
          break;
        }
        default: {
          return createErrorResponse(
            "app.api.v1.core.stripe.errors.validation.title",
            ErrorResponseTypes.VALIDATION_ERROR,
            { operation: data.operation },
          );
        }
      }

      logger.debug("Stripe CLI operation completed successfully", {
        operation: data.operation,
        success: response.success,
        status: response.status,
      });

      logger.debug("🔌 Stripe CLI operation executed successfully!");

      return createSuccessResponse(response);
    } catch (error) {
      logger.error("Error processing Stripe CLI operation:", parseError(error));
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.stripe.errors.serverError.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        {
          operation: data.operation,
          error: parsedError.message,
          details: t("app.api.v1.core.stripe.errors.execution_failed"),
        },
      );
    }
  }

  /**
   * Check if Stripe CLI is installed
   */
  checkInstallation(logger: EndpointLogger): ResponseType<boolean> {
    try {
      logger.debug("Checking Stripe CLI installation");
      const installed = this.isStripeCLIInstalled();
      logger.debug(`Stripe CLI installation status: ${installed}`);
      return createSuccessResponse(installed);
    } catch (error) {
      logger.error("Error checking Stripe CLI installation:", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.stripe.errors.serverError.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Start Stripe webhook listener
   */
  startListener(
    webhookUrl: string | undefined,
    logger: EndpointLogger,
  ): ResponseType<string> {
    try {
      const url =
        webhookUrl ||
        "http://localhost:3000/api/en-GLOBAL/v1/payment/webhook/stripe";
      const result = this.startStripeListener(url, undefined, false, logger);

      if (result.success) {
        return createSuccessResponse(url);
      } else {
        return createErrorResponse(
          "app.api.v1.core.stripe.errors.serverError.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          { error: "stripe.errors.listener_failed" },
        );
      }
    } catch (error) {
      return createErrorResponse(
        "app.api.v1.core.stripe.errors.serverError.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Check Stripe CLI authentication
   */
  checkAuthentication(logger: EndpointLogger): ResponseType<boolean> {
    try {
      const authenticated = this.checkStripeAuth(logger);
      return createSuccessResponse(authenticated);
    } catch (error) {
      return createErrorResponse(
        "app.api.v1.core.stripe.errors.serverError.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  // ===== PRIVATE METHODS =====

  /**
   * Check if Stripe CLI is installed
   */
  private isStripeCLIInstalled(): boolean {
    try {
      // eslint-disable-next-line i18next/no-literal-string
      execSync("stripe --version", { stdio: "pipe" });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get Stripe CLI version
   */
  private getStripeVersion(): string {
    try {
      // eslint-disable-next-line i18next/no-literal-string
      const version = execSync("stripe --version", {
        encoding: "utf-8",
      }).trim();
      return version;
    } catch {
      return "unknown";
    }
  }

  /**
   * Get Stripe CLI installation instructions
   */
  /* eslint-disable i18next/no-literal-string */
  private getStripeCLIInstallInstructions(): string {
    // Hardcoded installation instructions
    const instructionsArray = [
      "Stripe CLI is not installed. Please install it following the official documentation:",
      "https://docs.stripe.com/stripe-cli",
      "",
      "Quick installation options:",
      "",
      "macOS (using Homebrew):",
      "  brew install stripe/stripe-cli/stripe",
      "",
      "Linux (using package manager):",
      "  # Debian/Ubuntu",
      "  curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg",
      '  echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list',
      "  sudo apt update",
      "  sudo apt install stripe",
      "",
      "  # CentOS/RHEL/Fedora",
      "  sudo rpm --import https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public",
      '  echo -e "[stripe]\\nname=stripe\\nbaseurl=https://packages.stripe.dev/stripe-cli-rpm-local/\\nenabled=1\\ngpgcheck=1" | sudo tee -a /etc/yum.repos.d/stripe.repo',
      "  sudo yum install stripe",
      "",
      "Windows:",
      "  # Using Scoop",
      "  scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git",
      "  scoop install stripe",
      "",
      "  # Or download directly from GitHub releases:",
      "  # https://github.com/stripe/stripe-cli/releases",
      "",
      "After installation, authenticate with:",
      "  stripe login",
    ];

    return instructionsArray.join("\\n");
  }
  /* eslint-enable i18next/no-literal-string */

  /**
   * Start Stripe webhook listener
   */
  private startStripeListener(
    webhookUrl: string,
    events: string[] | undefined,
    skipSslVerify: boolean,
    logger: EndpointLogger,
  ): { success: boolean; process?: ChildProcess } {
    if (!this.isStripeCLIInstalled()) {
      logger.error("Stripe CLI is not installed");
      logger.debug(this.getStripeCLIInstallInstructions());
      return { success: false };
    }

    try {
      logger.debug("🎧 Starting Stripe webhook listener...");
      logger.debug(`Forwarding webhooks to: ${webhookUrl}`);

      // Build command arguments
      const args = ["listen", "--forward-to", webhookUrl];

      if (events && events.length > 0) {
        args.push("--events", events.join(","));
      }

      if (skipSslVerify) {
        args.push("--skip-verify");
      }

      // Start the Stripe listener in the background
      const stripeProcess = spawn("stripe", args, {
        stdio: ["pipe", "pipe", "pipe"],
      });

      stripeProcess.stdout?.on("data", (data) =>
        this.handleStripeOutput(data as Buffer, logger),
      );
      stripeProcess.stderr?.on("data", (data) =>
        this.handleStripeOutput(data as Buffer, logger),
      );

      // Handle process exit
      stripeProcess.on("close", (code: number | null) => {
        if (code === 0) {
          logger.debug("🎧 Stripe webhook listener stopped gracefully");
        } else {
          logger.debug(`🎧 Stripe webhook listener exited with code ${code}`);
        }
        this.activeListeners.delete(webhookUrl);
      });

      // Handle process errors
      stripeProcess.on("error", (error: Error) => {
        logger.error(
          "Failed to start Stripe webhook listener:",
          parseError(error),
        );
        this.activeListeners.delete(webhookUrl);
      });

      // Store the process for later management
      this.activeListeners.set(webhookUrl, stripeProcess);

      return { success: true, process: stripeProcess };
    } catch (error) {
      logger.error(
        "Failed to start Stripe webhook listener:",
        parseError(error),
      );
      return { success: false };
    }
  }

  /**
   * Stop Stripe webhook listener
   */
  private stopStripeListener(
    stripeProcess: ChildProcess,
    logger: EndpointLogger,
  ): void {
    logger.debug("🛑 Stopping Stripe webhook listener...");
    stripeProcess.kill("SIGTERM");

    // Give it a moment to shut down gracefully
    setTimeout(() => {
      if (!stripeProcess.killed) {
        logger.debug("Force killing Stripe webhook listener...");
        stripeProcess.kill("SIGKILL");
      }
    }, 3000);
  }

  /**
   * Check Stripe CLI authentication status
   */
  private checkStripeAuth(logger: EndpointLogger): boolean {
    if (!this.isStripeCLIInstalled()) {
      return false;
    }

    try {
      // eslint-disable-next-line i18next/no-literal-string
      execSync("stripe config --list", { stdio: "pipe" });
      return true;
    } catch {
      logger.debug(
        "Stripe CLI is not authenticated. Run 'stripe login' to authenticate.",
      );
      return false;
    }
  }

  /**
   * Handle Stripe CLI output
   */
  private handleStripeOutput(data: Buffer, logger: EndpointLogger): void {
    const output = data.toString().trim();
    if (output) {
      // Show all Stripe output as debug logs so they're visible
      logger.debug(`[Stripe] ${output}`);

      // Look for the webhook signing secret
      // eslint-disable-next-line i18next/no-literal-string
      const whsecPattern = "whsec_";
      if (output.includes(whsecPattern)) {
        const secretMatch = output.match(/whsec_[a-zA-Z0-9]+/);
        if (secretMatch) {
          const webhookSecret = secretMatch[0];
          logger.debug(`🔑 Webhook signing secret: ${webhookSecret}`);

          // Update the .env file automatically
          const updated = this.updateWebhookSecret(webhookSecret, logger);
          if (updated) {
            logger.debug(
              "✅ Updated STRIPE_WEBHOOK_SECRET in .env file automatically",
            );
          } else {
            logger.debug(
              "Add this to your .env file manually as STRIPE_WEBHOOK_SECRET",
            );
          }
        }
      }

      // Look for ready message
      // eslint-disable-next-line i18next/no-literal-string
      const readyPattern = "Ready!";

      const listeningPattern = "listening";
      if (output.includes(readyPattern) || output.includes(listeningPattern)) {
        logger.debug("🎧 Stripe webhook listener is ready!");
      }
    }
  }

  /**
   * Update the webhook secret in the .env file
   */
  private updateWebhookSecret(secret: string, logger: EndpointLogger): boolean {
    try {
      // Determine the base directory for the project
      const projectRoot = process.cwd();
      // eslint-disable-next-line i18next/no-literal-string
      const envFilename = ".env";
      const envPath = path.join(projectRoot, envFilename);

      // Check if .env file exists
      if (!fs.existsSync(envPath)) {
        logger.error(`Could not find .env file at ${envPath}`);
        return false;
      }

      // Read the file
      let envContent = fs.readFileSync(envPath, "utf-8");

      // Look for the STRIPE_WEBHOOK_SECRET line and replace it
      const regex = /STRIPE_WEBHOOK_SECRET="[^"]*"/;
      if (regex.test(envContent)) {
        // Replace existing webhook secret
        // eslint-disable-next-line i18next/no-literal-string
        const replacementText = `STRIPE_WEBHOOK_SECRET="${secret}"`;
        envContent = envContent.replace(regex, replacementText);
      } else {
        // Add new webhook secret at the end of the file
        // eslint-disable-next-line i18next/no-literal-string
        const additionalContent = `\\nSTRIPE_WEBHOOK_SECRET="${secret}"\\n`;
        envContent += additionalContent;
      }

      // Write the updated content back to the file
      fs.writeFileSync(envPath, envContent, "utf-8");
      logger.debug("Updated STRIPE_WEBHOOK_SECRET in .env file");
      return true;
    } catch (error) {
      logger.error("Failed to update .env file:", parseError(error));
      return false;
    }
  }
}

export const cliStripeRepository = new CliStripeRepositoryImpl();

// Export individual functions for backward compatibility
export const isStripeCLIInstalled = (
  logger: EndpointLogger,
): ResponseType<boolean> => {
  return new CliStripeRepositoryImpl().checkInstallation(logger);
};

export const getStripeCLIInstallInstructions = (): string => {
  return new CliStripeRepositoryImpl()["getStripeCLIInstallInstructions"]();
};

export const startStripeListener = (
  logger: EndpointLogger,
  webhookUrl?: string,
): ResponseType<string> => {
  return new CliStripeRepositoryImpl().startListener(webhookUrl, logger);
};

export const checkStripeAuth = (
  logger: EndpointLogger,
): ResponseType<boolean> => {
  return new CliStripeRepositoryImpl().checkAuthentication(logger);
};
