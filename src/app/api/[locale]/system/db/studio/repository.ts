/**
 * Open database studio Repository
 * Handles open database studio operations
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

import type { StudioRequestOutput, StudioResponseOutput } from "./definition";

/**
 * Open database studio Repository Interface
 */
export interface StudioRepositoryInterface {
  execute(
    data: StudioRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<StudioResponseOutput>>;
}

/**
 * Open database studio Repository Implementation
 */
export class StudioRepositoryImpl implements StudioRepositoryInterface {
  async execute(
    data: StudioRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<StudioResponseOutput>> {
    const startTime = Date.now();

    try {
      const port = data.port ? data.port : 5555;
      const url = `https://local.drizzle.studio/?port=${port}`;

      logger.info(`Starting Drizzle Studio on port ${port}...`);

      // Launch drizzle-kit studio
      const studioProcess = spawn(
        "bunx",
        ["drizzle-kit", "studio", "--port", port.toString()],
        {
          stdio: "inherit",
          env: { ...process.env },
          shell: true,
        },
      );

      // Wait a bit to ensure the process started successfully
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });

      // Open browser if requested
      if (data.openBrowser) {
        try {
          const openCommand =
            process.platform === "darwin"
              ? "open"
              : process.platform === "win32"
                ? "start"
                : "xdg-open";
          spawn(openCommand, [url], { shell: true });
          logger.info(`Opening browser at ${url}`);
        } catch (error) {
          logger.warn("Failed to open browser", {
            error: parseError(error).message,
          });
        }
      }

      logger.info(`Drizzle Studio started successfully at ${url}`);
      logger.info("Press Ctrl+C to stop the studio");

      // Block until the process exits
      const exitResult = await new Promise<{
        code: number | null;
        signal: NodeJS.Signals | null;
        error?: Error;
      }>((resolve) => {
        studioProcess.on("error", (error) => {
          logger.error("Failed to start Drizzle Studio", { error });
          resolve({ code: 1, signal: null, error });
        });

        studioProcess.on("exit", (code, signal) => {
          resolve({ code, signal });
        });

        // Handle SIGINT (Ctrl+C) to gracefully shutdown
        const handleShutdown = (): void => {
          logger.info("Shutting down Drizzle Studio...");
          studioProcess.kill("SIGTERM");
        };

        process.on("SIGINT", handleShutdown);
        process.on("SIGTERM", handleShutdown);
      });

      const duration = Date.now() - startTime;

      // Log the exit status
      if (exitResult.error) {
        return await Promise.resolve(
          fail({
            message: "app.api.system.db.studio.post.errors.server.title",
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: {
              error: exitResult.error.message,
              output: `Failed to start Drizzle Studio: ${exitResult.error.message}`,
              duration,
            },
          }),
        );
      } else if (exitResult.code !== null && exitResult.code !== 0) {
        logger.info(`Drizzle Studio exited with code ${exitResult.code}`);
      } else if (exitResult.signal === null) {
        logger.info("Drizzle Studio stopped");
      } else {
        logger.info(`Drizzle Studio terminated by signal ${exitResult.signal}`);
      }

      const response: StudioResponseOutput = {
        success: true,
        url,
        portUsed: port,
        output: `Drizzle Studio ran for ${(duration / 1000).toFixed(2)}s at ${url}`,
        duration,
      };

      return await Promise.resolve(success(response));
    } catch (error) {
      const duration = Date.now() - startTime;
      const parsedError = parseError(error);

      logger.error("Failed to start Drizzle Studio", { error: parsedError });

      return await Promise.resolve(
        fail({
          message: "app.api.system.db.studio.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: parsedError.message,
            output: `Failed to start Drizzle Studio: ${parsedError.message}`,
            duration,
          },
        }),
      );
    }
  }
}

/**
 * Default repository instance
 */
export const studioRepository = new StudioRepositoryImpl();
