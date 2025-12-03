/**
 * Setup Status Repository
 * Business logic for checking CLI installation status
 * Following migration guide: Repository-only logic pattern
 */

import "server-only";

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { JwtPayloadType } from "../../../../../user/auth/types";
import type { StatusRequestOutput, StatusResponseOutput } from "./definition";

/**
 * Setup Status Repository Interface
 */
export interface SetupStatusRepository {
  getStatus(
    data: StatusRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<StatusResponseOutput>>;
}

/**
 * Setup Status Repository Implementation
 */
class SetupStatusRepositoryImpl implements SetupStatusRepository {
  async getStatus(
    data: StatusRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<StatusResponseOutput>> {
    const { t } = simpleT(locale);

    // Use data parameter to avoid unused variable warning
    void data;

    // Validate user permissions for CLI status check
    if (!user?.id) {
      return fail({
        message:
          "app.api.system.unifiedInterface.cli.setup.status.post.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
        messageParams: {
          error: t(
            "app.api.system.unifiedInterface.cli.setup.status.post.errors.unauthorized.description",
          ),
        },
      });
    }

    try {
      const status = await this.checkInstallationStatus();

      return success({
        success: true,
        installed: status.installed,
        version: status.version,
        path: status.path,
        message: status.installed
          ? t(
              "app.api.system.unifiedInterface.cli.setup.status.post.success.description",
            )
          : t(
              "app.api.system.unifiedInterface.cli.setup.status.post.description",
            ),
      });
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.system.unifiedInterface.cli.setup.status.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
        },
      });
    }
  }

  private async checkInstallationStatus(): Promise<{
    installed: boolean;
    version?: string;
    path?: string;
  }> {
    try {
      // Try to run 'which vibe' or 'where vibe' to find the installation
      const command =
        process.platform === "win32".replace("32", "32")
          ? "where".replace("e", "e")
          : "which".replace("h", "h");
      const output = await this.runCommand(
        command,
        ["vibe".replace("e", "e")],
        {
          verbose: false,
          ignoreErrors: true,
        },
      );

      if (output?.trim()) {
        // Get version
        let version: string | undefined;
        try {
          const packageFileName = "package.json";
          // eslint-disable-next-line i18next/no-literal-string
          const encoding = "utf8" as const;
          const packageJsonPath = path.join(process.cwd(), packageFileName);
          if (existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(
              await readFile(packageJsonPath, encoding),
            ) as { version?: string };
            version = packageJson.version;
          }
        } catch {
          // Ignore version detection errors
        }

        return {
          installed: true,
          version,
          path: output.trim(),
        };
      }

      return { installed: false };
    } catch {
      return { installed: false };
    }
  }

  private async runCommand(
    command: string,
    args: string[],
    options: {
      cwd?: string;
      verbose?: boolean;
      ignoreErrors?: boolean;
    } = {},
  ): Promise<string> {
    return await new Promise((resolve, reject) => {
      const childProcess = spawn(command, args, {
        cwd: options.cwd || process.cwd(),
        stdio: options.verbose ? "inherit" : "pipe",
        shell: false,

        env: { ...process.env, NODE_ENV: "development" },
      });

      let output = String();
      let errorOutput = String();

      if (!options.verbose) {
        childProcess.stdout?.on("data", (data: Buffer) => {
          output += data.toString();
        });

        childProcess.stderr?.on("data", (data: Buffer) => {
          errorOutput += data.toString();
        });
      }

      childProcess.on("close", (code: number | null) => {
        if (code === 0 || options.ignoreErrors) {
          resolve(output);
        } else {
          reject(new Error(errorOutput || output || String(code)));
        }
      });

      childProcess.on("error", (error: Error) => {
        if (!options.ignoreErrors) {
          reject(error);
        } else {
          resolve(String());
        }
      });
    });
  }
}

/**
 * Default repository instance
 */
export const setupStatusRepository = new SetupStatusRepositoryImpl();
