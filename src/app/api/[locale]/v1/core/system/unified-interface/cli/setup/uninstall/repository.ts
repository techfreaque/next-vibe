/**
 * Setup Uninstall Repository
 * Business logic for CLI global uninstallation
 * Following migration guide: Repository-only logic pattern
 */

import "server-only";

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { JwtPayloadType } from "../../../../../user/auth/types";
import type {
  UninstallRequestOutput,
  UninstallResponseOutput,
} from "./definition";

/**
 * Setup Uninstall Repository Interface
 */
export interface SetupUninstallRepository {
  uninstallCli(
    data: UninstallRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<UninstallResponseOutput>>;
}

/**
 * Setup Uninstall Repository Implementation
 */
class SetupUninstallRepositoryImpl implements SetupUninstallRepository {
  async uninstallCli(
    data: UninstallRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<UninstallResponseOutput>> {
    const { t } = simpleT(locale);

    // Validate user permissions for CLI uninstallation
    if (!user?.id) {
      return fail({
        message:
          "app.api.v1.core.system.unifiedUi.cli.setup.uninstall.post.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
        messageParams: {
          error: t(
            "app.api.v1.core.system.unifiedUi.cli.setup.uninstall.post.errors.unauthorized.description",
          ),
        },
      });
    }

    try {
      // Check current status
      const status = await this.checkInstallationStatus();

      if (!status.installed) {
        return createSuccessResponse({
          success: true,
          installed: false,
          message: t(
            "app.api.v1.core.system.unifiedUi.cli.setup.uninstall.post.description",
          ),
        });
      }

      // Uninstall using npm unlink
      // eslint-disable-next-line i18next/no-literal-string
      const output = await this.runCommand("npm", ["unlink", "-g"], {
        cwd: process.cwd(),
        verbose: data.verbose,
      });

      // Verify uninstallation
      const newStatus = await this.checkInstallationStatus();

      return createSuccessResponse({
        success: !newStatus.installed,
        installed: newStatus.installed,
        message: !newStatus.installed
          ? t(
              "app.api.v1.core.system.unifiedUi.cli.setup.uninstall.post.success.description",
            )
          : t(
              "app.api.v1.core.system.unifiedUi.cli.setup.uninstall.post.errors.server.description",
            ),
        output: data.verbose ? output : undefined,
      });
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.v1.core.system.unifiedUi.cli.setup.uninstall.post.errors.server.title",
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
      const command = process.platform === "win32" ? "where" : "which";
      const output = await this.runCommand(command, ["vibe"], {
        verbose: false,
        ignoreErrors: true,
      });

      if (output) {
        // Get version
        let version: string | undefined;
        try {
          const packageJsonPath = path.join(process.cwd(), "package.json");
          if (existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(
              await readFile(packageJsonPath, "utf8"),
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
        env: { NODE_ENV: "development" },
      });

      let output = "";
      let errorOutput = "";

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
export const setupUninstallRepository = new SetupUninstallRepositoryImpl();
