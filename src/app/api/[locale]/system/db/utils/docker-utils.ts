import { spawn } from "node:child_process";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

/**
 * Docker log patterns to hide in development mode
 */
const HIDDEN_DOCKER_LOG_PATTERNS = [
  // Match raw Docker output: Container dev-postgres {action}
  /^\s*Container\s+dev-postgres\s+(Stopping|Stopped|Removing|Removed|Creating|Created|Starting|Started)\s*$/,
  // Match raw Docker output: Network website_default {action}
  /^\s*Network\s+website_default\s+(Removing|Removed|Creating|Created)\s*$/,
];

/**
 * Check if a log line should be hidden
 */
function shouldHideLogLine(line: string): boolean {
  return HIDDEN_DOCKER_LOG_PATTERNS.some((pattern) =>
    pattern.test(line.trim()),
  );
}

/**
 * Execute a Docker command with timeout and log filtering
 */
export function executeDockerCommand(
  command: string,
  options: {
    timeout?: number; // timeout in milliseconds
    hideStandardLogs?: boolean; // whether to hide standard Docker logs
    description?: string;
    locale: CountryLanguage;
  },
): Promise<{ success: boolean; output: string; error?: string }> {
  const {
    timeout = 30000, // 30 seconds default timeout
    hideStandardLogs = true,
    description,
    locale,
  } = options;

  const { t } = simpleT(locale);

  return new Promise((resolve) => {
    const logger = createEndpointLogger(false, Date.now(), locale);

    if (description) {
      logger.debug(description);
    } else {
      logger.debug(
        t("app.api.system.db.utils.docker.executing_command", {
          command,
        }),
      );
    }

    const args = command.split(" ");
    const child = spawn(args[0], args.slice(1), {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let output = "";
    let error = "";
    let resolved = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    // Set up timeout
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- resolve intentionally unused, only reject is needed for timeout
    const timeoutPromise = new Promise<void>((_resolve, reject) => {
      timeoutId = setTimeout(() => {
        if (resolved) {
          return;
        }
        resolved = true;
        child.kill("SIGTERM");
        reject(
          new Error(
            t("app.api.system.db.utils.docker.command_timeout", {
              timeout,
              command,
            }),
          ),
        );
      }, timeout);
    });

    // Handle stdout
    child.stdout?.on("data", (data: Buffer) => {
      const lines = data.toString().split("\n");
      for (const line of lines) {
        if (line.trim()) {
          if (hideStandardLogs && shouldHideLogLine(line)) {
            // Hide this log line but still capture it in output
            // eslint-disable-next-line i18next/no-literal-string
            output = `${output}${line}\n`;
          } else {
            // Show this log line and capture it
            logger.debug(line);
            // eslint-disable-next-line i18next/no-literal-string
            output = `${output}${line}\n`;
          }
        }
      }
    });

    // Handle stderr
    child.stderr?.on("data", (data: Buffer) => {
      const lines = data.toString().split("\n");
      for (const line of lines) {
        if (line.trim()) {
          if (hideStandardLogs && shouldHideLogLine(line)) {
            // Hide this error line but still capture it
            // eslint-disable-next-line i18next/no-literal-string
            error = `${error}${line}\n`;
          } else {
            // Show this error line and capture it
            logger.error(line);
            // eslint-disable-next-line i18next/no-literal-string
            error = `${error}${line}\n`;
          }
        }
      }
    });

    // Handle process completion
    child.on("close", (code: number | null) => {
      if (resolved) {
        return;
      }
      resolved = true;
      clearTimeout(timeoutId);
      const success = code === 0;

      if (!success && error) {
        logger.error(
          t("app.api.system.db.utils.docker.command_failed", {
            code: code ?? 0,
            command,
          }),
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-floating-promises, eslint-plugin-promise/no-multiple-resolved
      resolve({
        success,
        output: output.trim(),
        error: error.trim() || undefined,
      });
    });

    // Handle process errors
    child.on("error", (err: Error) => {
      if (resolved) {
        return;
      }
      resolved = true;
      clearTimeout(timeoutId);
      logger.error(
        t("app.api.system.db.utils.docker.execution_failed", {
          command,
        }),
        err,
      );
      // eslint-disable-next-line @typescript-eslint/no-floating-promises, eslint-plugin-promise/no-multiple-resolved
      resolve({
        success: false,
        output: output.trim(),
        error: err.message,
      });
    });

    // Race between completion and timeout
    Promise.race([
      new Promise<void>((resolve) => {
        child.on("close", () => {
          resolve();
        });
      }),
      timeoutPromise,
    ]).catch((err: Error) => {
      logger.error(
        t("app.api.system.db.utils.docker.command_error", {
          error: err.message,
        }),
      );
      resolve({
        success: false,
        output: output.trim(),
        error: err.message,
      });
    });
  });
}

/**
 * Execute Docker Compose down with timeout and log filtering
 */
export async function dockerComposeDown(
  composeFile = "docker-compose-dev.yml",
  timeout = 30000,
  locale: CountryLanguage,
): Promise<boolean> {
  const { t } = simpleT(locale);
  const result = await executeDockerCommand(
    // eslint-disable-next-line i18next/no-literal-string
    `docker compose -f ${composeFile} down`,
    {
      timeout,
      hideStandardLogs: true,
      description: t("app.api.system.db.utils.docker.stopping_containers"),
      locale,
    },
  );

  return result.success;
}

/**
 * Execute Docker Compose up with timeout and log filtering
 */
export async function dockerComposeUp(
  composeFile = "docker-compose-dev.yml",
  timeout = 60000,
  locale: CountryLanguage,
): Promise<boolean> {
  const { t } = simpleT(locale);
  const result = await executeDockerCommand(
    // eslint-disable-next-line i18next/no-literal-string
    `docker compose -f ${composeFile} up -d`,
    {
      timeout,
      hideStandardLogs: true,
      description: t("app.api.system.db.utils.docker.starting_containers"),
      locale,
    },
  );

  return result.success;
}
