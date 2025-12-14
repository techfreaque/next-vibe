/**
 * Publisher Service
 * Publish packages to npm, JSR, and run CI release commands
 */

import { execSync } from "node:child_process";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";

import type { CIEnvironment, PackageJson, ReleaseOptions } from "../definition";
import { MESSAGES } from "./constants";

// ============================================================================
// Interface
// ============================================================================

export interface IPublisher {
  /**
   * Run CI release command
   */
  runCiReleaseCommand(
    releaseConfig: ReleaseOptions,
    packageName: string,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void>;

  /**
   * Publish to npm registry
   */
  publishToNpm(
    cwd: string,
    packageJson: PackageJson,
    releaseConfig: ReleaseOptions,
    logger: EndpointLogger,
    dryRun: boolean,
    ciEnv: CIEnvironment,
  ): ResponseType<void>;

  /**
   * Publish to JSR registry
   */
  publishToJsr(
    cwd: string,
    packageJson: PackageJson,
    releaseConfig: ReleaseOptions,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void>;
}

// ============================================================================
// Implementation
// ============================================================================

export class Publisher implements IPublisher {
  runCiReleaseCommand(
    releaseConfig: ReleaseOptions,
    packageName: string,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void> {
    if (!releaseConfig.ciReleaseCommand) {
      return success(undefined);
    }

    const { command, env: envMapping } = releaseConfig.ciReleaseCommand;
    const commandStr = command.join(" ");

    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: commandStr });
      return success(undefined);
    }

    logger.info(MESSAGES.CI_COMMAND_RUNNING, {
      package: packageName,
      command: commandStr,
    });

    const ciEnv: Record<string, string> = {};
    for (const key in process.env) {
      const value = process.env[key];
      if (value !== undefined) {
        ciEnv[key] = value;
      }
    }

    if (envMapping) {
      for (const [key, value] of Object.entries(envMapping)) {
        const envValue = process.env[value];
        if (!envValue) {
          logger.error(`Required environment variable ${value} is not set`);
          return fail({
            message: "app.api.system.releaseTool.ci.envVarMissing",
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: { variable: value, package: packageName },
          });
        }
        ciEnv[key] = envValue;
      }
    }

    try {
      execSync(commandStr, {
        stdio: "inherit",
        env: ciEnv as NodeJS.ProcessEnv,
      });
      logger.info(MESSAGES.CI_COMMAND_SUCCESS, { package: packageName });
      return success(undefined);
    } catch (error) {
      logger.error(MESSAGES.CI_COMMAND_FAILED, parseError(error));
      return fail({
        message: "app.api.system.releaseTool.ci.commandFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { package: packageName, error: String(error) },
      });
    }
  }

  publishToNpm(
    cwd: string,
    packageJson: PackageJson,
    releaseConfig: ReleaseOptions,
    logger: EndpointLogger,
    dryRun: boolean,
    ciEnv: CIEnvironment,
  ): ResponseType<void> {
    // Skip private packages
    if (packageJson.private) {
      logger.info(MESSAGES.NPM_PUBLISH_SKIPPED, { package: packageJson.name });
      return success(undefined);
    }

    const npmConfig = releaseConfig.npm;
    if (npmConfig && npmConfig.enabled === false) {
      return success(undefined);
    }

    const tag = npmConfig?.tag ?? packageJson.publishConfig?.tag ?? "latest";
    const access =
      npmConfig?.access ?? packageJson.publishConfig?.access ?? "public";
    const registry = npmConfig?.registry ?? packageJson.publishConfig?.registry;

    const commandParts = [
      "npm",
      "publish",
      `--tag ${tag}`,
      `--access ${access}`,
    ];

    if (registry) {
      commandParts.push(`--registry ${registry}`);
    }

    // Add provenance for supported CI environments
    if (npmConfig?.provenance && ciEnv.isCI) {
      if (ciEnv.provider === "github" || ciEnv.provider === "gitlab") {
        commandParts.push("--provenance");
        logger.info("NPM provenance enabled");
      } else {
        logger.warn(
          `NPM provenance not supported for CI provider: ${ciEnv.provider}`,
        );
      }
    }

    // Ignore npm scripts during publish
    if (npmConfig?.ignoreScripts) {
      commandParts.push("--ignore-scripts");
    }

    if (dryRun || npmConfig?.dryRun) {
      commandParts.push("--dry-run");
    }

    if (npmConfig?.otpEnvVar) {
      const otp = process.env[npmConfig.otpEnvVar];
      if (otp) {
        commandParts.push(`--otp ${otp}`);
      }
    }

    const command = commandParts.join(" ");
    logger.info(MESSAGES.NPM_PUBLISHING, { package: packageJson.name });

    try {
      execSync(command, { stdio: "inherit", cwd });
      logger.info(MESSAGES.NPM_PUBLISH_SUCCESS, { package: packageJson.name });
      return success(undefined);
    } catch (error) {
      logger.error(MESSAGES.NPM_PUBLISH_FAILED, parseError(error));
      return fail({
        message: "app.api.system.releaseTool.npm.publishFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { package: packageJson.name, error: String(error) },
      });
    }
  }

  publishToJsr(
    cwd: string,
    packageJson: PackageJson,
    releaseConfig: ReleaseOptions,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void> {
    const jsrConfig = releaseConfig.jsr;
    if (!jsrConfig || jsrConfig.enabled === false) {
      return success(undefined);
    }

    logger.info(MESSAGES.JSR_PUBLISHING, { package: packageJson.name });

    const commandParts = ["deno", "publish"];

    if (jsrConfig.allowSlowTypes) {
      commandParts.push("--allow-slow-types");
    }

    if (jsrConfig.allowDirty) {
      commandParts.push("--allow-dirty");
    }

    if (dryRun || jsrConfig.dryRun) {
      commandParts.push("--dry-run");
    }

    const command = commandParts.join(" ");

    try {
      execSync(command, { stdio: "inherit", cwd });
      logger.info(MESSAGES.JSR_PUBLISH_SUCCESS, { package: packageJson.name });
      return success(undefined);
    } catch (error) {
      logger.error(MESSAGES.JSR_PUBLISH_FAILED, parseError(error));
      return fail({
        message: "app.api.system.releaseTool.npm.publishFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { package: packageJson.name, error: String(error) },
      });
    }
  }
}

// Singleton instance
export const publisher = new Publisher();
