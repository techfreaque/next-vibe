/**
 * Hook Runner Service
 * Execute release hooks at various stages
 */

import { execSync } from "node:child_process";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";

import type { ReleaseHook } from "../definition";
import { MESSAGES } from "./constants";
import type { HookContext } from "./types";

// ============================================================================
// Interface
// ============================================================================

export interface IHookRunner {
  /**
   * Run a release hook
   */
  runHook(
    hook: ReleaseHook,
    cwd: string,
    logger: EndpointLogger,
    dryRun: boolean,
    context: HookContext,
  ): ResponseType<void>;
}

// ============================================================================
// Implementation
// ============================================================================

export class HookRunner implements IHookRunner {
  runHook(
    hook: ReleaseHook,
    cwd: string,
    logger: EndpointLogger,
    dryRun: boolean,
    context: HookContext,
  ): ResponseType<void> {
    const hookCwd = hook.cwd ? join(cwd, hook.cwd) : cwd;

    // Replace placeholders in command
    const command = hook.command
      .replace(/\$\{packageManager\}/g, context.packageManager)
      .replace(/\$\{PM\}/g, context.packageManager)
      .replace(/\$\{version\}/g, context.version ?? "")
      .replace(/\$\{name\}/g, context.packageName ?? "")
      .replace(/\$\{directory\}/g, context.directory ?? "");

    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: command });
      return success(undefined);
    }

    logger.info(MESSAGES.HOOK_RUNNING, { command });

    try {
      execSync(command, {
        stdio: "inherit",
        cwd: hookCwd,
        env: { ...process.env, ...hook.env },
        timeout: hook.timeout,
      });
      logger.info(MESSAGES.HOOK_SUCCESS);
      return success(undefined);
    } catch (error) {
      logger.error(MESSAGES.HOOK_FAILED, parseError(error));
      if (hook.continueOnError) {
        logger.warn("Hook failed but continuing due to continueOnError");
        return success(undefined);
      }
      return fail({
        message: "app.api.system.releaseTool.hooks.failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { command, error: String(error) },
      });
    }
  }
}

// Singleton instance
export const hookRunner = new HookRunner();
