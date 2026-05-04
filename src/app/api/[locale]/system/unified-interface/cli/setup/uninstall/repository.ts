/**
 * Setup Uninstall Repository
 * Business logic for CLI global uninstallation
 * Following migration guide: Repository-only logic pattern
 */

import "server-only";

import { existsSync } from "node:fs";
import { readFile, unlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { JwtPayloadType } from "../../../../../user/auth/types";
import type {
  UninstallRequestOutput,
  UninstallResponseOutput,
} from "./definition";
import type { SetupUninstallT } from "./i18n";

/**
 * Setup Uninstall Repository Implementation
 */
export class SetupUninstallRepository {
  static async uninstallCli(
    data: UninstallRequestOutput,
    user: JwtPayloadType,
    t: SetupUninstallT,
  ): Promise<ResponseType<UninstallResponseOutput>> {
    // Validate user permissions for CLI uninstallation
    if (!user?.id) {
      return fail({
        message: t("post.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
        messageParams: {
          error: t("post.errors.unauthorized.description"),
        },
      });
    }

    try {
      // Check current status
      const status = await SetupUninstallRepository.checkInstallationStatus();

      if (!status.installed) {
        return success({
          success: true,
          installed: false,
          message: t("post.description"),
        });
      }

      // Delete the binary file written by the install step (works on all
      // platforms — npm unlink is unrelated to our Bun-based dispatcher).
      const removed: string[] = [];
      const failures: string[] = [];
      for (const candidate of SetupUninstallRepository.candidatePaths()) {
        if (existsSync(candidate)) {
          try {
            await unlink(candidate);
            removed.push(candidate);
          } catch (error) {
            const parsed = parseError(error);
            // eslint-disable-next-line i18next/no-literal-string
            failures.push(`${candidate}: ${parsed.message}`);
          }
        }
      }
      const output =
        // eslint-disable-next-line i18next/no-literal-string
        [
          // eslint-disable-next-line i18next/no-literal-string
          removed.length ? `Removed: ${removed.join(", ")}` : "",
          // eslint-disable-next-line i18next/no-literal-string
          failures.length ? `Failed: ${failures.join("; ")}` : "",
        ]
          .filter(Boolean)
          .join("\n");

      // Verify uninstallation
      const newStatus =
        await SetupUninstallRepository.checkInstallationStatus();

      return success({
        success: !newStatus.installed,
        installed: newStatus.installed,
        message: newStatus.installed
          ? t("post.errors.server.description")
          : t("post.success.description"),
        output: data.verbose ? output : undefined,
      });
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
        },
      });
    }
  }

  /**
   * Paths the install step may have written the dispatcher binary to,
   * for each supported platform.
   */
  private static candidatePaths(): string[] {
    const platform = os.platform();
    const homeDir = os.homedir();
    if (platform === "win32") {
      const windowsAppData =
        // eslint-disable-next-line i18next/no-literal-string
        process.env.APPDATA || path.join(homeDir, "AppData", "Roaming");
      const windowsLocalAppData =
        // eslint-disable-next-line i18next/no-literal-string
        process.env.LOCALAPPDATA || path.join(homeDir, "AppData", "Local");
      return [
        // eslint-disable-next-line i18next/no-literal-string
        path.join(windowsAppData, "vibe", "bin", "vibe.cmd"),
        // eslint-disable-next-line i18next/no-literal-string
        path.join(windowsLocalAppData, "vibe", "bin", "vibe.cmd"),
      ];
    }
    return [
      // eslint-disable-next-line i18next/no-literal-string
      path.join(homeDir, ".local", "bin", "vibe"),
      // eslint-disable-next-line i18next/no-literal-string
      path.join(homeDir, ".yarn", "bin", "vibe"),
      "/usr/local/bin/vibe",
      "/usr/bin/vibe",
    ];
  }

  private static async checkInstallationStatus(): Promise<{
    installed: boolean;
    version?: string;
    path?: string;
  }> {
    try {
      for (const candidate of SetupUninstallRepository.candidatePaths()) {
        if (existsSync(candidate)) {
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
          return { installed: true, version, path: candidate };
        }
      }
      return { installed: false };
    } catch {
      return { installed: false };
    }
  }
}
