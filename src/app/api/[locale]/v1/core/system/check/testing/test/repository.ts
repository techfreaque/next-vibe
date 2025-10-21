/**
 * Run tests Repository
 * Handles run tests operations
 */

/* eslint-disable i18next/no-literal-string */
// CLI output messages don't need internationalization

import type { ResponseType as ApiResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import type { TestRequestOutput, TestResponseOutput } from "./definition";

/**
 * Run tests Repository Interface
 */
interface TestRepositoryInterface {
  execute(
    data: TestRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ApiResponseType<TestResponseOutput>>;
}

/**
 * Run tests Repository Implementation
 */
class TestRepositoryImpl implements TestRepositoryInterface {
  async execute(
    data: TestRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ApiResponseType<TestResponseOutput>> {
    logger.info("system.check.testing.test.execute.start");
    const startTime = Date.now();
    let output = "";

    try {
      // Ensure .tmp directory exists for caching
      const { mkdirSync, existsSync } = await import("fs");
      const tmpDir = "./.tmp";
      if (!existsSync(tmpDir)) {
        mkdirSync(tmpDir, { recursive: true });
      }

      // Build test command with optional path and flags
      let command = "npm test";

      // Add specific path if provided
      if (data.path) {
        command += ` -- ${data.path}`;
      }

      // Add watch flag if requested
      if (data.watch) {
        command += " --watch";
      }

      // Add verbose flag if requested
      if (data.verbose) {
        command += " --verbose";
      }

      if (data.verbose) {
        output += `Running command: ${command}\n\n`;
      }

      logger.info("system.check.testing.test.command.executing", { command });

      const { exec } = await import("child_process");
      const { promisify } = await import("util");
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
      return createSuccessResponse(response);
    } catch (error) {
      const duration = Date.now() - startTime;
      const parsedError = parseError(error);

      logger.error("system.check.testing.test.execute.error", error);

      return createErrorResponse(
        "app.api.v1.core.system.check.testing.test.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        {
          error: parsedError.message,
          output: output.trim(),
          duration,
        },
      );
    }
  }
}

/**
 * Default repository instance
 */
export const testRepository = new TestRepositoryImpl();
