/**
 * Run tests Repository
 * Handles run tests operations
 */

// CLI output messages don't need internationalization

import type { ResponseType as ApiResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { TestRequestOutput, TestResponseOutput } from "./definition";
import type { TestingTestT } from "./i18n";

/**
 * Run tests Repository
 */
export class TestRepository {
  static async execute(
    data: TestRequestOutput,
    logger: EndpointLogger,
    t: TestingTestT,
  ): Promise<ApiResponseType<TestResponseOutput>> {
    logger.info("system.check.testing.test.execute.start");
    const startTime = Date.now();
    let output = "";

    try {
      // Ensure .tmp directory exists for caching
      const { mkdirSync, existsSync } = await import("node:fs");
      const tmpDir = "./.tmp";
      if (!existsSync(tmpDir)) {
        mkdirSync(tmpDir, { recursive: true });
      }

      // Build test command with optional path and flags
      let command = "bun test";

      // Add specific path if provided
      if (data.path) {
        command += ` ${data.path}`;
      }

      // Add watch flag if requested
      if (data.watch) {
        command += " --watch";
      }

      if (data.verbose) {
        output += `Running command: ${command}\n\n`;
      }

      logger.info("system.check.testing.test.command.executing", { command });

      const { exec } = await import("node:child_process");
      const { promisify } = await import("node:util");
      const execAsync = promisify(exec);

      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        timeout: 300000, // 5 minutes timeout
      });

      const fullOutput = stdout + (stderr ? `\nErrors:\n${stderr}` : "");
      output += fullOutput;

      const duration = Date.now() - startTime;

      const response: TestResponseOutput = {
        success: true,
        output: output.trim(),
        duration,
      };

      logger.info("system.check.testing.test.execute.success", { duration });
      return success(response);
    } catch (error) {
      const duration = Date.now() - startTime;

      // exec throws on non-zero exit code - this is normal for failing tests
      const execError = error as {
        stdout?: string;
        stderr?: string;
        code?: number;
      };
      const hasTestOutput = execError.stdout || execError.stderr;

      if (hasTestOutput) {
        // Test failures: return as valid response with success=false
        const fullOutput = (execError.stdout ?? "") + (execError.stderr ?? "");
        output += fullOutput;

        logger.info("system.check.testing.test.execute.error", {
          output: fullOutput.slice(0, 200),
        });

        const response: TestResponseOutput = {
          success: false,
          output: output.trim(),
          duration,
        };

        return success(response);
      }

      // Actual infrastructure errors (command not found, timeout, etc.)
      const parsedError = parseError(error);
      logger.error(
        "system.check.testing.test.execute.error",
        parseError(error),
      );

      return fail({
        message: t("errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
          output: output.trim(),
          duration,
        },
      });
    }
  }
}
