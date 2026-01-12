/* eslint-disable i18next/no-literal-string */
/**
 * CLI Entry Point System
 * Core CLI execution functionality that executes routes from generated index
 * Integrates with schema-driven handlers for enhanced CLI experience
 */

import { parseError } from "next-vibe/shared/utils";

import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { INTERACTIVE_MODE_ALIAS } from "../../../help/interactive/definition";
import type { InferJwtPayloadTypeFromRoles } from "../../shared/endpoints/route/handler";
import type { EndpointLogger } from "../../shared/logger/endpoint";
import type { CliObject } from "./parsing";
import type {
  CliCompatiblePlatform,
  CliRequestData,
  RouteExecutionContext,
  RouteExecutionResult,
} from "./route-executor";
import { routeDelegationHandler } from "./route-executor";

interface CliExecutionOptions {
  data?: CliRequestData;
  urlPathParams?: Record<string, string | number | boolean | null | undefined>;
  cliArgs?: {
    positionalArgs: string[];
    namedArgs: CliObject;
  };
  user?: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>;
  locale: CountryLanguage;
  /** Platform identifier (CLI or CLI_PACKAGE) */
  platform: CliCompatiblePlatform;
  dryRun?: boolean;
  interactive?: boolean;
  verbose?: boolean;
  output?: "json" | "table" | "pretty";
  userType?: string;
  category?: string;
  format?: string;
  examples?: boolean;
  parameters?: boolean;
}

/**
 * CLI Entry Point Class
 * Executes routes using the generated endpoint index
 */
class CliEntryPoint {
  /**
   * Execute a command using the generated endpoint system
   */
  async executeCommand(
    command: string,
    options: CliExecutionOptions,
    logger: EndpointLogger,
    t: TFunction,
    locale: CountryLanguage,
  ): Promise<RouteExecutionResult> {
    // Default to interactive mode if no command provided
    const resolvedCommand = command || INTERACTIVE_MODE_ALIAS;

    // Get CLI user for authentication if not provided
    let cliUser = options.user;

    if (!cliUser) {
      const { getCliUser } = await import("../auth/cli-user");
      const cliUserResult = await getCliUser(logger, options.locale);

      if (cliUserResult.success) {
        cliUser = cliUserResult.data;
      }
    }

    const dataForContext: CliRequestData = options.data || {};

    const context: RouteExecutionContext = {
      toolName: resolvedCommand,
      data: dataForContext,
      urlPathParams: options.urlPathParams,
      cliArgs: options.cliArgs,
      user: cliUser,
      locale: options.locale,
      logger: logger,
      platform: options.platform,
      timestamp: Date.now(),
      options: {
        dryRun: options.dryRun,
        interactive: options.interactive,
        output: options.output,
      },
    };

    try {
      // Execute using route delegation handler
      const result = await routeDelegationHandler.executeRoute(
        resolvedCommand,
        context,
        logger,
        locale,
      );

      return result;
    } catch (error) {
      process.stderr.write(
        t("app.api.system.unifiedInterface.cli.vibe.errors.executionFailed", {
          error: parseError(error).message,
        }),
      );
      logger.error("Command execution failed", {
        command: resolvedCommand,
        error: parseError(error),
      });
      return {
        success: false,
        error:
          "app.api.system.unifiedInterface.cli.vibe.errors.executionFailed",
        errorParams: {
          error: parseError(error).message,
        },
      };
    }
  }
}

export const cliEntryPoint = new CliEntryPoint();
