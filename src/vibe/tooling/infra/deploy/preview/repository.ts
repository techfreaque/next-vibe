import "server-only";

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { getSrcDir } from "@/env/paths";

import type { ResponseType } from "../../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../../core/route/response.schema";
import { parseError } from "../../../../core/utils/parse-error";
import type { EndpointLogger } from "../../../../logger/types";
import { infraEnv } from "../../env";
import type { InfraT } from "../../i18n";
import type {
  DeployPreviewRequestOutput,
  DeployPreviewResponseOutput,
} from "./definition";

export class DeployPreviewRepository {
  static async preview(
    data: DeployPreviewRequestOutput,
    logger: EndpointLogger,
    t: InfraT,
  ): Promise<ResponseType<DeployPreviewResponseOutput>> {
    const start = Date.now();

    try {
      const pulumiBin =
        infraEnv.PULUMI_BIN ??
        `${process.env["HOME"] ?? "/root"}/.pulumi/bin/pulumi`;

      if (!existsSync(pulumiBin)) {
        return fail({
          message: t("errors.pulumiNotInstalled"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const stack = data.stack ?? "prod";
      const statePath = `${process.cwd()}/.pulumi`;
      const pulumiDir = join(getSrcDir(), "vibe/tooling/infra/shared/pulumi");

      logger.info("deploy-preview: running pulumi preview", { stack });

      const args = [
        "preview",
        "--stack",
        stack,
        "--non-interactive",
        "--logtostderr",
      ];

      const env: NodeJS.ProcessEnv = {
        ...process.env,
        PULUMI_BACKEND_URL: `file://${statePath}`,
        PULUMI_CONFIG_PASSPHRASE: infraEnv.PULUMI_PASSPHRASE ?? "",
      };

      const result = spawnSync(pulumiBin, args, {
        cwd: pulumiDir,
        env,
        encoding: "utf-8",
        timeout: 120000,
      });

      const duration = Date.now() - start;
      const stdout = result.stdout ?? "";
      const stderr = result.stderr ?? "";
      const exitCode = result.status ?? 1;

      if (exitCode !== 0) {
        logger.error("deploy-preview: pulumi preview failed", {
          exitCode,
          stderr: stderr.slice(0, 500),
        });
        return fail({
          message: t("errors.k3sInstallFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const preview = stdout.trim() || "No changes detected.";
      logger.info("deploy-preview: complete", { duration });

      return success({
        success: true,
        message: `Preview generated in ${Math.round(duration / 1000)}s`,
        preview,
        duration,
      });
    } catch (error) {
      logger.error("deploy-preview: failed", parseError(error));
      return fail({
        message: t("errors.k3sInstallFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
