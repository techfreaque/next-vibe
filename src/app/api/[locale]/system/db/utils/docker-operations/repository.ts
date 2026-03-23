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

import type {
  DockerOperationRequestOutput,
  DockerOperationResponseOutput,
} from "./definition";
import type { DockerOperationsT } from "./i18n";

/**
 * Docker Operations Repository
 */
export class DockerOperationsRepository {
  private static readonly DOCKER_CMD_FLAG_FILE = "-f";
  private static readonly DOCKER_CMD_FLAG_DETACH = "-d";
  private static readonly HIDDEN_DOCKER_LOG_PATTERNS = [
    // Match raw Docker output: Container {name} {action}
    /^\s*Container\s+[\w-]+\s+(Stopping|Stopped|Removing|Removed|Creating|Created|Starting|Started|Running)\s*$/,
    // Match raw Docker output: Network {any}_default {action}
    /^\s*Network\s+[a-zA-Z0-9_-]+_default\s+(Removing|Removed|Creating|Created)\s*$/,
    // Match raw Docker output: Volume {any} {action}
    /^\s*Volume\s+[a-zA-Z0-9_-]+\s+(Removing|Removed|Creating|Created)\s*$/,
    // Container name already in use - not a real error, container is already running
    /already in use by container/,
    /You have to remove \(or rename\) that container/,
    /Error response from daemon: Conflict/,
  ];
  /**
   * Check if a log line should be hidden
   */
  private static shouldHideLogLine(line: string): boolean {
    return DockerOperationsRepository.HIDDEN_DOCKER_LOG_PATTERNS.some(
      (pattern) => pattern.test(line.trim()),
    );
  }

  /**
   * Execute a Docker command with timeout and log filtering
   */
  static async executeCommand(
    data: DockerOperationRequestOutput,
    t: DockerOperationsT,
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

      const result =
        await DockerOperationsRepository.executeDockerCommandInternal(command, {
          timeout,
          hideStandardLogs,
          description,
          t,
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
        message: t("errors.executionFailed.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Execute Docker Compose down with timeout and log filtering
   */
  static async dockerComposeDown(
    logger: EndpointLogger,
    t: DockerOperationsT,
    composeFile = "docker-compose-dev.yml",
    timeout = 30000,
    projectName?: string,
  ): Promise<ResponseType<boolean>> {
    try {
      const startTime = Date.now();
      const commandParts = [];
      commandParts.push("docker");
      commandParts.push("compose");
      if (projectName) {
        commandParts.push("--project-name");
        commandParts.push(projectName);
      }
      commandParts.push(DockerOperationsRepository.DOCKER_CMD_FLAG_FILE);
      commandParts.push(composeFile);
      commandParts.push("down");
      const command = commandParts.join(" ");
      const result =
        await DockerOperationsRepository.executeDockerCommandInternal(command, {
          timeout,
          hideStandardLogs: true,
          description: "Stopping Docker containers...",
          t,
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
        message: t("errors.composeDownFailed.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Execute Docker Compose up with timeout and log filtering
   */
  static async dockerComposeUp(
    logger: EndpointLogger,
    t: DockerOperationsT,
    composeFile = "docker-compose-dev.yml",
    timeout = 60000,
    projectName?: string,
  ): Promise<ResponseType<boolean>> {
    try {
      const startTime = Date.now();
      const commandParts = [];
      commandParts.push("docker");
      commandParts.push("compose");
      if (projectName) {
        commandParts.push("--project-name");
        commandParts.push(projectName);
      }
      commandParts.push(DockerOperationsRepository.DOCKER_CMD_FLAG_FILE);
      commandParts.push(composeFile);
      commandParts.push("up");
      commandParts.push(DockerOperationsRepository.DOCKER_CMD_FLAG_DETACH);
      const command = commandParts.join(" ");
      const result =
        await DockerOperationsRepository.executeDockerCommandInternal(command, {
          timeout,
          hideStandardLogs: true,
          description: "Starting Docker containers...",
          t,
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
        message: t("errors.composeUpFailed.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Internal method to execute Docker command with proper logging
   */
  private static async executeDockerCommandInternal(
    command: string,
    options: {
      timeout?: number;
      hideStandardLogs?: boolean;
      description?: string;
      t: DockerOperationsT;
      logger: EndpointLogger;
    },
  ): Promise<{ success: boolean; output: string; error?: string }> {
    const {
      timeout = 30000,
      hideStandardLogs = true,
      description,
      t,
      logger,
    } = options;

    return await new Promise((resolve) => {
      if (description) {
        logger.debug(description);
      } else {
        logger.debug(t("messages.executingCommand", { command }));
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
          const errorMessage = t("messages.timeoutError", {
            timeout,
            command,
          });
          reject(new Error(errorMessage));
        }, timeout);
      });

      // Handle stdout
      child.stdout?.on("data", (data: Buffer) => {
        const lines = data.toString().split("\n");
        for (const line of lines) {
          if (line.trim()) {
            if (
              hideStandardLogs &&
              DockerOperationsRepository.shouldHideLogLine(line)
            ) {
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
            if (
              hideStandardLogs &&
              DockerOperationsRepository.shouldHideLogLine(line)
            ) {
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

        // Container "already in use" is not a real failure - the container is already running
        const isContainerAlreadyRunning =
          error.includes("already in use") && error.includes("container name");
        const commandSuccess = code === 0 || isContainerAlreadyRunning;

        if (!commandSuccess && error) {
          logger.error(
            t("messages.commandFailed", {
              code: String(code),
              command,
            }),
          );
        }

        // eslint-disable-next-line @typescript-eslint/no-floating-promises, eslint-plugin-promise/no-multiple-resolved
        resolve({
          success: commandSuccess,
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
        logger.error(t("messages.executionFailed", { command }), err);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises, eslint-plugin-promise/no-multiple-resolved
        resolve({
          success: false,
          output: output.trim(),
          error: err.message,
        });
      });

      // Race between completion and timeout
      Promise.race([
        new Promise<void>((_resolve) => {
          child.on("close", () => {
            _resolve();
          });
        }),
        timeoutPromise,
      ]).catch((err: Error) => {
        logger.error(
          t("messages.commandError", {
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
