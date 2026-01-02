/**
 * Hook Runner Service
 * Execute release hooks at various stages
 */

import { execSync } from "node:child_process";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type { HookContext, ReleaseHook } from "../definition";
import { MESSAGES } from "./constants";

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
    // Skip if no command is defined (hook config exists but is empty)
    if (!hook.command) {
      logger.debug("Hook skipped - no command defined");
      return success();
    }

    const hookCwd = hook.cwd ? join(cwd, hook.cwd) : cwd;

    // Replace placeholders in command
    /* eslint-disable no-template-curly-in-string -- Intentional placeholder syntax for command templates */
    const command = hook.command
      .replaceAll("${packageManager}", context.packageManager)
      .replaceAll("${PM}", context.packageManager)
      .replaceAll("${version}", context.version ?? "")
      .replaceAll("${name}", context.packageName ?? "")
      .replaceAll("${directory}", context.directory ?? "");
    /* eslint-enable no-template-curly-in-string */

    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: command });
      return success();
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
      return success();
    } catch (error) {
      logger.error(MESSAGES.HOOK_FAILED, parseError(error));
      if (hook.continueOnError) {
        logger.warn("Hook failed but continuing due to continueOnError");
        return success();
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
