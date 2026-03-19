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
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { StripeT } from "../i18n";
import type {
  CliStripeRequestOutput,
  CliStripeResponseOutput,
} from "./definition";

/**
 * CLI Stripe Repository
 */
export class CliStripeRepository {
  private static activeListeners: Map<string, ChildProcess> = new Map();

  /**
   * Process Stripe CLI operations
   */
  static async processStripe(
    data: CliStripeRequestOutput,
    user: JwtPayloadType,
    t: StripeT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CliStripeResponseOutput>> {
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
          const installed = CliStripeRepository.isStripeCLIInstalled();
          response.installed = installed;
          if (installed) {
            response.version = CliStripeRepository.getStripeVersion();
          } else {
            response.instructions =
              CliStripeRepository.getStripeCLIInstallInstructions();
          }
          break;
        }
        case "install": {
          response.instructions =
            CliStripeRepository.getStripeCLIInstallInstructions();
          response.success = false; // Cannot auto-install, only provide instructions
          break;
        }
        case "listen": {
          const webhookUrl =
            data.forwardTo ||
            "http://localhost:3000/api/en-GLOBAL/payment/providers/stripe/webhook";

          // Execute stripe listen synchronously and block forever
          const listenResult =
            await CliStripeRepository.executeStripeListenBlocking(
              webhookUrl,
              data.events,
              data.skipSslVerify || false,
              logger,
              t,
            );
          if (!listenResult.success) {
            return listenResult;
          }

          // This will never be reached unless Ctrl+C is pressed
          response.success = true;
          response.webhookEndpoint = webhookUrl;
          response.status = "stopped";
          break;
        }
        case "login": {
          logger.debug(t("login.instructions"));
          response.instructions = t("login.instructions");
          break;
        }
        case "status": {
          response.installed = CliStripeRepository.isStripeCLIInstalled();
          if (response.installed) {
            response.version = CliStripeRepository.getStripeVersion();
            const authenticated = CliStripeRepository.checkStripeAuth(logger);
            response.status = authenticated
              ? t("status.authenticated")
              : t("status.not_authenticated");
          } else {
            response.status = t("status.not_installed");
          }
          break;
        }
        default: {
          return fail({
            message: t("errors.validation.title"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
            messageParams: { operation: data.operation },
          });
        }
      }

      logger.debug("Stripe CLI operation completed successfully", {
        operation: data.operation,
        success: response.success,
        status: response.status,
      });

      logger.debug("🔌 Stripe CLI operation executed successfully!");

      return success(response);
    } catch (error) {
      logger.error("Error processing Stripe CLI operation:", parseError(error));
      const parsedError = parseError(error);
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          operation: data.operation,
          error: parsedError.message,
          details: t("errors.execution_failed"),
        },
      });
    }
  }

  /**
   * Check if Stripe CLI is installed
   */
  static checkInstallation(
    logger: EndpointLogger,
    t: StripeT,
  ): ResponseType<boolean> {
    try {
      logger.debug("Checking Stripe CLI installation");
      const installed = CliStripeRepository.isStripeCLIInstalled();
      logger.debug(`Stripe CLI installation status: ${installed}`);
      return success(installed);
    } catch (error) {
      logger.error(
        "Error checking Stripe CLI installation:",
        parseError(error),
      );
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Start Stripe webhook listener
   */
  static startListener(
    webhookUrl: string | undefined,
    logger: EndpointLogger,
    t: StripeT,
  ): ResponseType<string> {
    try {
      const url =
        webhookUrl ||
        "http://localhost:3000/api/en-GLOBAL/v1/payment/webhook/stripe";
      const result = CliStripeRepository.startStripeListener(
        url,
        undefined,
        false,
        logger,
        t,
      );

      if (result.success) {
        return success(url);
      }
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: "stripe.errors.listener_failed" },
      });
    } catch (error) {
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Check Stripe CLI authentication
   */
  static checkAuthentication(
    logger: EndpointLogger,
    t: StripeT,
  ): ResponseType<boolean> {
    try {
      const authenticated = CliStripeRepository.checkStripeAuth(logger);
      return success(authenticated);
    } catch (error) {
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  // ===== PRIVATE METHODS =====

  /**
   * Check if Stripe CLI is installed
   */
  private static isStripeCLIInstalled(): boolean {
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
  private static getStripeVersion(): string {
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
  private static getStripeCLIInstallInstructions(): string {
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
   * Execute Stripe listen command synchronously and block forever
   */
  private static async executeStripeListenBlocking(
    webhookUrl: string,
    events: string[] | undefined,
    skipSslVerify: boolean,
    logger: EndpointLogger,
    t: StripeT,
  ): Promise<ResponseType<void>> {
    if (!CliStripeRepository.isStripeCLIInstalled()) {
      logger.error("Stripe CLI is not installed");
      logger.debug(CliStripeRepository.getStripeCLIInstallInstructions());
      return fail({
        message: t("status.not_installed"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

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

    logger.debug(
      "🎧 Stripe webhook listener is running. Press Ctrl+C to stop.",
    );

    // Execute stripe listen and block forever
    // We need to capture output to extract webhook secret, but also display it
    const stripeProcess = spawn("stripe", args, {
      stdio: ["pipe", "pipe", "pipe"],
    });

    // Capture and display output, and extract webhook secret
    stripeProcess.stdout?.on("data", (data: Buffer) => {
      const output = data.toString();
      // Display output directly to console
      process.stdout.write(output);
      // Also handle it to extract webhook secret
      CliStripeRepository.handleStripeOutput(data, logger);
    });

    stripeProcess.stderr?.on("data", (data: Buffer) => {
      const output = data.toString();
      // Display output directly to console
      process.stderr.write(output);
      // Also handle it to extract webhook secret
      CliStripeRepository.handleStripeOutput(data, logger);
    });

    // Wait for the process to exit (only happens on Ctrl+C or error)
    try {
      await new Promise<void>((resolve, reject) => {
        stripeProcess.on("close", (code: number | null) => {
          if (code === 0 || code === null) {
            logger.debug("🛑 Stripe webhook listener stopped gracefully");
            resolve();
          } else {
            logger.debug(`🛑 Stripe webhook listener exited with code ${code}`);
            reject(new Error(`Stripe listener exited with code ${code}`));
          }
        });

        stripeProcess.on("error", (error: Error) => {
          logger.error(
            "Failed to start Stripe webhook listener:",
            parseError(error),
          );
          reject(error);
        });
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

  /**
   * Start Stripe webhook listener
   */
  private static startStripeListener(
    webhookUrl: string,
    events: string[] | undefined,
    skipSslVerify: boolean,
    logger: EndpointLogger,
    t: StripeT,
  ): ResponseType<{ process: ChildProcess }> {
    if (!CliStripeRepository.isStripeCLIInstalled()) {
      logger.error("Stripe CLI is not installed");
      logger.debug(CliStripeRepository.getStripeCLIInstallInstructions());
      return fail({
        message: t("errors.stripeCliNotInstalled"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
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
        CliStripeRepository.handleStripeOutput(data as Buffer, logger),
      );
      stripeProcess.stderr?.on("data", (data) =>
        CliStripeRepository.handleStripeOutput(data as Buffer, logger),
      );

      // Handle process exit
      stripeProcess.on("close", (code: number | null) => {
        if (code === 0) {
          logger.debug("🎧 Stripe webhook listener stopped gracefully");
        } else {
          logger.debug(`🎧 Stripe webhook listener exited with code ${code}`);
        }
        CliStripeRepository.activeListeners.delete(webhookUrl);
      });

      // Handle process errors
      stripeProcess.on("error", (error: Error) => {
        logger.error(
          "Failed to start Stripe webhook listener:",
          parseError(error),
        );
        CliStripeRepository.activeListeners.delete(webhookUrl);
      });

      // Store the process for later management
      CliStripeRepository.activeListeners.set(webhookUrl, stripeProcess);

      return success({ process: stripeProcess });
    } catch (error) {
      logger.error(
        "Failed to start Stripe webhook listener:",
        parseError(error),
      );
      return fail({
        message: t("errors.listenerFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Stop Stripe webhook listener
   */
  private static stopStripeListener(
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
  private static checkStripeAuth(logger: EndpointLogger): boolean {
    if (!CliStripeRepository.isStripeCLIInstalled()) {
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
  private static handleStripeOutput(
    data: Buffer,
    logger: EndpointLogger,
  ): void {
    const output = data.toString().trim();
    if (output) {
      // Show all Stripe output as debug logs so they're visible
      logger.debug(`[Stripe] ${output}`);

      // Check for expired API key error
      // eslint-disable-next-line i18next/no-literal-string
      if (
        output.includes("api_key_expired") ||
        output.includes("Expired API Key provided")
      ) {
        logger.error("❌ Stripe API key has expired!");
        logger.error("");
        logger.error("Your Stripe CLI is using an expired API key.");
        logger.error("");
        logger.error("To fix this issue:");
        logger.error("  1. Go to Stripe Dashboard → Developers → API keys");
        logger.error("     https://dashboard.stripe.com/test/apikeys");
        logger.error("");
        logger.error("  2. Rotate your keys if you haven't already:");
        logger.error(
          "     - Click the three dots (...) next to your Secret key",
        );
        logger.error("     - Select 'Roll key' to generate new keys");
        logger.error("");
        logger.error("  3. Update your .env file with the new keys:");
        logger.error(
          '     STRIPE_SECRET_KEY="sk_test_..." (your new secret key)',
        );
        logger.error(
          '     STRIPE_PUBLISHABLE_KEY="pk_test_..." (your new publishable key)',
        );
        logger.error("");
        logger.error("  4. Re-authenticate the Stripe CLI:");
        logger.error("     Run: stripe login");
        logger.error(
          "     This will open your browser and update ~/.config/stripe/config.toml",
        );
        logger.error("");
      }

      // Look for the webhook signing secret
      // eslint-disable-next-line i18next/no-literal-string
      const whsecPattern = "whsec_";
      if (output.includes(whsecPattern)) {
        const secretMatch = output.match(/whsec_[a-zA-Z0-9]+/);
        if (secretMatch) {
          const webhookSecret = secretMatch[0];
          logger.debug(`🔑 Webhook signing secret: ${webhookSecret}`);

          // Update the .env file automatically
          const updated = CliStripeRepository.updateWebhookSecret(
            webhookSecret,
            logger,
          );
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
  private static updateWebhookSecret(
    secret: string,
    logger: EndpointLogger,
  ): boolean {
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

      // Look for the STRIPE_WEBHOOK_SECRET line and replace it (all occurrences, any quoting)
      const regex = /^STRIPE_WEBHOOK_SECRET=.*$/m;
      if (regex.test(envContent)) {
        // Replace existing webhook secret (all occurrences to avoid duplicates)
        // eslint-disable-next-line i18next/no-literal-string
        const replacementText = `STRIPE_WEBHOOK_SECRET="${secret}"`;
        envContent = envContent.replace(
          /^STRIPE_WEBHOOK_SECRET=.*$/gm,
          replacementText,
        );
      } else {
        // Add new webhook secret at the end of the file
        // eslint-disable-next-line i18next/no-literal-string
        const additionalContent = `\nSTRIPE_WEBHOOK_SECRET="${secret}"\n`;
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
