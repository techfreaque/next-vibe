/**
 * Docker Operations Repository
 * Business logic for Docker command execution
 * Migrated from docker-utils.ts following repository-only pattern
 */

import { spawn } from "node:child_process";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { formatDuration } from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type {
  DockerOperationRequestOutput,
  DockerOperationResponseOutput,
} from "./definition";

/**
 * Docker command constants
 */
const DOCKER_CMD_FLAG_FILE = "-f";
const DOCKER_CMD_FLAG_DETACH = "-d";

/**
 * Docker log patterns to hide in development mode
 */
const HIDDEN_DOCKER_LOG_PATTERNS = [
  // Match raw Docker output: Container {name} {action}
  /^\s*Container\s+[\w-]+\s+(Stopping|Stopped|Removing|Removed|Creating|Created|Starting|Started|Running)\s*$/,
  // Match raw Docker output: Network {any}_default {action}
  /^\s*Network\s+[a-zA-Z0-9_-]+_default\s+(Removing|Removed|Creating|Created)\s*$/,
  // Match raw Docker output: Volume {any} {action}
  /^\s*Volume\s+[a-zA-Z0-9_-]+\s+(Removing|Removed|Creating|Created)\s*$/,
  // Container name already in use — not a real error, container is already running
  /already in use by container/,
  /You have to remove \(or rename\) that container/,
  /Error response from daemon: Conflict/,
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
 * Docker Operations Repository Interface
 */
export interface DockerOperationsRepository {
  executeCommand(
    data: DockerOperationRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<DockerOperationResponseOutput>>;

  dockerComposeUp(
    logger: EndpointLogger,
    locale: CountryLanguage,
    composeFile?: string,
    timeout?: number,
    projectName?: string,
  ): Promise<ResponseType<boolean>>;

  dockerComposeDown(
    logger: EndpointLogger,
    locale: CountryLanguage,
    composeFile?: string,
    timeout?: number,
    projectName?: string,
  ): Promise<ResponseType<boolean>>;
}

/**
 * Docker Operations Repository Implementation
 */
export class DockerOperationsRepositoryImpl implements DockerOperationsRepository {
  /**
   * Execute a Docker command with timeout and log filtering
   */
  async executeCommand(
    data: DockerOperationRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<DockerOperationResponseOutput>> {
    try {
      logger.info("Starting Docker command execution", {
        command: data.command,
      });

      const { command, options = {} } = data;
      const {
        timeout = 30000, // 30 seconds default timeout
        hideStandardLogs = true,
        description,
      } = options;

      const result = await this.executeDockerCommandInternal(command, {
        timeout,
        hideStandardLogs,
        description,
        locale,
        logger,
      });

      logger.info("🗄️  Docker command execution completed", {
        success: result.success,
      });

      return success({
        success: result.success,
        output: result.output,
        error: result.error,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("🗄️  Docker command execution failed", parsedError);

      return fail({
        message:
          "app.api.system.db.utils.dockerOperations.errors.executionFailed.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Execute Docker Compose down with timeout and log filtering
   */
  async dockerComposeDown(
    logger: EndpointLogger,
    locale: CountryLanguage,
    composeFile = "docker-compose-dev.yml",
    timeout = 30000,
    projectName?: string,
  ): Promise<ResponseType<boolean>> {
    try {
      const startTime = Date.now();
      const { t } = simpleT(locale);
      const commandParts = [];
      commandParts.push("docker");
      commandParts.push("compose");
      if (projectName) {
        commandParts.push("--project-name");
        commandParts.push(projectName);
      }
      commandParts.push(DOCKER_CMD_FLAG_FILE);
      commandParts.push(composeFile);
      commandParts.push("down");
      const command = commandParts.join(" ");
      const result = await this.executeDockerCommandInternal(command, {
        timeout,
        hideStandardLogs: true,
        description: t("app.api.system.db.utils.docker.stopping_containers"),
        locale,
        logger,
      });

      const duration = Date.now() - startTime;
      logger.info(
        `🗄️  Docker Compose down completed in ${formatDuration(duration)}`,
      );

      return success(result.success);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("🗄️ Docker Compose down failed", parsedError);

      return fail({
        message:
          "app.api.system.db.utils.dockerOperations.errors.composeDownFailed.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Execute Docker Compose up with timeout and log filtering
   */
  async dockerComposeUp(
    logger: EndpointLogger,
    locale: CountryLanguage,
    composeFile = "docker-compose-dev.yml",
    timeout = 60000,
    projectName?: string,
  ): Promise<ResponseType<boolean>> {
    try {
      const startTime = Date.now();
      const { t } = simpleT(locale);
      const commandParts = [];
      commandParts.push("docker");
      commandParts.push("compose");
      if (projectName) {
        commandParts.push("--project-name");
        commandParts.push(projectName);
      }
      commandParts.push(DOCKER_CMD_FLAG_FILE);
      commandParts.push(composeFile);
      commandParts.push("up");
      commandParts.push(DOCKER_CMD_FLAG_DETACH);
      const command = commandParts.join(" ");
      const result = await this.executeDockerCommandInternal(command, {
        timeout,
        hideStandardLogs: true,
        description: t("app.api.system.db.utils.docker.starting_containers"),
        locale,
        logger,
      });

      const duration = Date.now() - startTime;
      logger.debug(
        `Docker Compose up completed in ${formatDuration(duration)}`,
      );

      return success(result.success);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("🗄️  Docker Compose up failed", parsedError);

      return fail({
        message:
          "app.api.system.db.utils.dockerOperations.errors.composeUpFailed.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Internal method to execute Docker command with proper logging
   */
  private async executeDockerCommandInternal(
    command: string,
    options: {
      timeout?: number;
      hideStandardLogs?: boolean;
      description?: string;
      locale: CountryLanguage;
      logger: EndpointLogger;
    },
  ): Promise<{ success: boolean; output: string; error?: string }> {
    const {
      timeout = 30000,
      hideStandardLogs = true,
      description,
      locale,
      logger,
    } = options;

    const { t } = simpleT(locale);

    return await new Promise((resolve) => {
      if (description) {
        logger.debug(description);
      } else {
        logger.debug(
          t(
            "app.api.system.db.utils.dockerOperations.messages.executingCommand",
            { command },
          ),
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
          const errorMessage = t(
            "app.api.system.db.utils.dockerOperations.messages.timeoutError",
            {
              timeout,
              command,
            },
          );
          reject(new Error(errorMessage));
        }, timeout);
      });

      // Handle stdout
      child.stdout?.on("data", (data: Buffer) => {
        const lines = data.toString().split("\n");
        for (const line of lines) {
          if (line.trim()) {
            if (hideStandardLogs && shouldHideLogLine(line)) {
              // Hide this log line but still capture it in output
              output += line;
              output += "\n";
            } else {
              // Show this log line and capture it
              logger.debug(line);
              output += line;
              output += "\n";
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
              error += line;
              error += "\n";
            } else {
              // Show this error line and capture it
              process.stderr.write(line);
              error += line;
              error += "\n";
            }
          }
        }
      });

      // Handle process completion
      child.on("close", (code) => {
        if (resolved) {
          return;
        }
        resolved = true;
        clearTimeout(timeoutId);

        // Container "already in use" is not a real failure — the container is already running
        const isContainerAlreadyRunning =
          error.includes("already in use") && error.includes("container name");
        const success = code === 0 || isContainerAlreadyRunning;

        if (!success && error) {
          logger.error(
            t(
              "app.api.system.db.utils.dockerOperations.messages.commandFailed",
              {
                code: String(code),
                command,
              },
            ),
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
          t(
            "app.api.system.db.utils.dockerOperations.messages.executionFailed",
            { command },
          ),
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
          t("app.api.system.db.utils.dockerOperations.messages.commandError", {
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
}

/**
 * Docker Operations Repository Instance
 */
export const dockerOperationsRepository = new DockerOperationsRepositoryImpl();
