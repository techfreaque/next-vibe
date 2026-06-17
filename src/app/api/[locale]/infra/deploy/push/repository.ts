import "server-only";

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { InfraT } from "../../i18n";
import type {
  DeployPushRequestOutput,
  DeployPushResponseOutput,
} from "./definition";

/**
 * Deploy infrastructure changes via Pulumi.
 * Runs `pulumi up` in the infra/shared/pulumi directory using local state backend.
 * Falls back to a meaningful message if Pulumi is not installed.
 */
export class DeployPushRepository {
  static async push(
    data: DeployPushRequestOutput,
    logger: EndpointLogger,
    t: InfraT,
  ): Promise<ResponseType<DeployPushResponseOutput>> {
    const start = Date.now();

    try {
      const pulumiBin =
        process.env["PULUMI_BIN"] ??
        `${process.env["HOME"] ?? "/root"}/.pulumi/bin/pulumi`;

      if (!existsSync(pulumiBin)) {
        return fail({
          message: t("errors.pulumiNotInstalled"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const stack = data.stack ?? "prod";
      const statePath = `${process.cwd()}/.pulumi`;
      const pulumiDir = `${process.cwd()}/src/app/api/[locale]/infra/shared/pulumi`;

      logger.info("deploy-push: running pulumi up", { stack });

      const args = [
        "up",
        "--stack",
        stack,
        "--yes",
        "--non-interactive",
        "--logtostderr",
      ];

      const env: NodeJS.ProcessEnv = {
        ...process.env,
        PULUMI_BACKEND_URL: `file://${statePath}`,
        PULUMI_CONFIG_PASSPHRASE: process.env["PULUMI_PASSPHRASE"] ?? "",
      };

      const result = spawnSync(pulumiBin, args, {
        cwd: pulumiDir,
        env,
        encoding: "utf-8",
        timeout: 600000, // 10 min
      });

      const duration = Date.now() - start;
      const stdout = result.stdout ?? "";
      const stderr = result.stderr ?? "";
      const exitCode = result.status ?? 1;

      if (exitCode !== 0) {
        logger.error("deploy-push: pulumi up failed", {
          exitCode,
          stderr: stderr.slice(0, 500),
        });
        return fail({
          message: t("errors.k3sInstallFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Parse changes from output (lines starting with + - ~)
      const changes = stdout
        .split("\n")
        .filter((line) => /^\s*[+~-]\s/.test(line))
        .map((line) => line.trim())
        .slice(0, 20);

      logger.info("deploy-push: complete", {
        duration,
        changes: changes.length,
      });

      return success({
        success: true,
        message: `pulumi up complete in ${Math.round(duration / 1000)}s`,
        changes,
        duration,
      });
    } catch (error) {
      logger.error("deploy-push: failed", parseError(error));
      return fail({
        message: t("errors.k3sInstallFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
