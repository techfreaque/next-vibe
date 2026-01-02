/**
 * Setup Install Repository
 * Business logic for CLI global installation
 * Following migration guide: Repository-only logic pattern
 */

import "server-only";

import { spawn } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { JwtPayloadType } from "../../../../../user/auth/types";
import type { InstallRequestOutput, InstallResponseOutput } from "./definition";

/**
 * Setup Install Repository Interface
 */
export interface SetupInstallRepository {
  installCli(
    data: InstallRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<InstallResponseOutput>>;
}

/**
 * Setup Install Repository Implementation
 */
class SetupInstallRepositoryImpl implements SetupInstallRepository {
  // eslint-disable-next-line i18next/no-literal-string
  private readonly NPM_UNLINK_ARGS = ["unlink", "-g"] as const;
  private readonly NPM_LINK_ARGS = ["link"] as const;
  private readonly NPM_LINK_FORCE_ARGS = ["link", "--force"] as const;

  /**
   * Get the appropriate binary directory for the current platform
   */
  private getBinaryDirectory(): string {
    const platform = os.platform();
    const homeDir = os.homedir();

    switch (platform) {
      case "win32": {
        // Windows: Use a directory in PATH or create one

        const windowsPath =
          // eslint-disable-next-line i18next/no-literal-string
          process.env.APPDATA || path.join(homeDir, "AppData", "Roaming");

        return path.join(windowsPath, "vibe", "bin");
      }

      case "darwin":
      case "linux":
        // macOS and Linux: Use ~/.local/bin (commonly in PATH)
        // eslint-disable-next-line i18next/no-literal-string
        return path.join(homeDir, ".local", "bin");

      default:
        // Return a fallback path for unsupported platforms
        // eslint-disable-next-line i18next/no-literal-string
        return path.join(homeDir, ".local", "bin");
    }
  }

  /**
   * Get the binary filename for the current platform
   */
  private getBinaryFilename(): string {
    return os.platform() === "win32" ? "vibe.cmd" : "vibe";
  }

  /**
   * Create the binary content for the current platform
   *
   * The global binary acts as a small dispatcher that resolves the correct
   * vibe-runtime.ts **based on the current working directory** instead of a
   * single hard-coded project path.
   *
   * It walks up from the CWD until it finds the expected relative path and
   * then executes that file with Bun. This allows a single global "vibe"
   * binary to work with multiple projects on the same machine.
   */
  private createBinaryContent(vibeRelativePath: string): string {
    const platform = os.platform();

    if (platform === "win32") {
      // Windows batch file
      // The script starts from %CD% and walks up the directory tree,
      // searching for the configured relative path.
      // eslint-disable-next-line i18next/no-literal-string
      return `@echo off
setlocal enabledelayedexpansion

REM Vibe CLI Windows Binary
REM Searches for vibe-runtime.ts from current directory upwards and executes with Bun

set "REL_PATH=${vibeRelativePath}"
set "CURRENT_DIR=%CD%"

:find_vibe
if exist "%CURRENT_DIR%%REL_PATH%" (
  bun "%CURRENT_DIR%%REL_PATH%" %*
  exit /b %errorlevel%
)

for %%I in ("%CURRENT_DIR%") do set "PARENT_DIR=%%~dpI"
REM If we reached the root (parent dir is same as current), stop searching
if /I "%PARENT_DIR:~0,-1%"=="%CURRENT_DIR%" goto not_found

set "CURRENT_DIR=%PARENT_DIR:~0,-1%"
goto find_vibe

:not_found
echo vibe: could not find vibe-runtime.ts starting from %CD% 1>&2
exit /b 1
`;
    }

    // Unix shell script (Linux/macOS)
    // The script starts from $(pwd) and walks up the directory tree,
    // searching for the configured relative path.
    // eslint-disable-next-line i18next/no-literal-string
    return `#!/bin/bash

# Vibe CLI Unix Binary
# Searches for vibe-runtime.ts from current directory upwards and executes with Bun

REL_PATH="${vibeRelativePath}"

current_dir="$(pwd)"
root="/"

while [ "$current_dir" != "$root" ]; do
  candidate="$current_dir/$REL_PATH"
  if [ -f "$candidate" ]; then
    exec bun "$candidate" "$@"
  fi
  current_dir="$(dirname "$current_dir")"
done

echo "vibe: could not find vibe-runtime.ts (looked for $REL_PATH upwards from $(pwd))" 1>&2
exit 1
`;
  }

  /**
   * Check if bun is available
   */
  private async checkBunAvailable(): Promise<boolean> {
    try {
      await this.runCommand("bun", ["--version"], {
        verbose: false,
        ignoreErrors: true,
      });
      return true;
    } catch {
      return false;
    }
  }
  async installCli(
    data: InstallRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<InstallResponseOutput>> {
    const { t } = simpleT(locale);

    // Validate user permissions for CLI installation
    if (!user?.id) {
      return fail({
        message: "app.api.system.unifiedInterface.cli.setup.install.post.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
        messageParams: {
          error: t(
            "app.api.system.unifiedInterface.cli.setup.install.post.errors.unauthorized.description",
          ),
        },
      });
    }

    try {
      // Check if already installed
      const status = await this.checkInstallationStatus();

      if (status.installed && !data.force) {
        return success({
          success: true,
          installed: true,
          version: status.version,
          path: status.path,
          message: status.path
            ? t("app.api.system.unifiedInterface.cli.setup.install.post.success.description")
            : t("app.api.system.unifiedInterface.cli.setup.install.post.success.description"),
        });
      }

      // Check if Bun is available
      const bunAvailable = await this.checkBunAvailable();
      if (!bunAvailable) {
        return fail({
          message: "app.api.system.unifiedInterface.cli.setup.install.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error:
              // eslint-disable-next-line i18next/no-literal-string
              "Bun is not installed or not in PATH. Please install Bun first: curl -fsSL https://bun.sh/install | bash",
            // eslint-disable-next-line i18next/no-literal-string
            command: "bun --version",
          },
        });
      }

      // Get paths for Bun-based installation

      /* eslint-disable i18next/no-literal-string */
      const vibeRelativePath = path.join(
        "src",
        "app",
        "api",
        "[locale]",
        "system",
        "unified-interface",
        "cli",
        "vibe-runtime.ts",
      );
      const vibeTsAbsolutePath = path.join(process.cwd(), vibeRelativePath);
      /* eslint-enable i18next/no-literal-string */

      // Verify vibe-runtime.ts exists
      if (!existsSync(vibeTsAbsolutePath)) {
        return fail({
          message: "app.api.system.unifiedInterface.cli.setup.install.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            // eslint-disable-next-line i18next/no-literal-string
            error: `vibe-runtime.ts not found at ${vibeTsAbsolutePath}`,

            cwd: process.cwd(),
          },
        });
      }

      // Get binary installation paths
      const binDir = this.getBinaryDirectory();
      const binaryFilename = this.getBinaryFilename();
      const targetPath = path.join(binDir, binaryFilename);

      // Remove existing binary if force is enabled
      if (data.force && existsSync(targetPath)) {
        try {
          const fs = await import("node:fs/promises");
          await fs.unlink(targetPath);
        } catch {
          // Ignore removal errors
        }
      }

      // Ensure binary directory exists
      try {
        mkdirSync(binDir, { recursive: true });
      } catch (error) {
        const parsedError = parseError(error);
        return fail({
          message: "app.api.system.unifiedInterface.cli.setup.install.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            // eslint-disable-next-line i18next/no-literal-string
            error: `Failed to create directory`,

            directory: binDir,

            reason: parsedError.message,
          },
        });
      }

      // Create binary content with the RELATIVE path so it can be found from any project
      const binaryContent = this.createBinaryContent(vibeRelativePath);

      // Write binary file
      writeFileSync(targetPath, binaryContent, { mode: 0o755 });

      // Make executable on Unix systems
      if (os.platform() !== "win32") {
        chmodSync(targetPath, 0o755);
      }

      // eslint-disable-next-line i18next/no-literal-string
      let output = `Binary installed at ${targetPath}`;

      // Add to PATH on Windows if needed
      if (os.platform() === "win32") {
        // eslint-disable-next-line i18next/no-literal-string
        output += `\nNote: You may need to add ${binDir} to your PATH manually or restart your terminal`;
      } else {
        // eslint-disable-next-line i18next/no-literal-string
        output += `\nNote: Make sure ${binDir} is in your PATH. Add this to your shell profile if needed:\nexport PATH="${binDir}:$PATH"`;
      }

      // Verify installation
      const newStatus = await this.checkInstallationStatus();

      return success({
        success: newStatus.installed,
        installed: newStatus.installed,
        version: newStatus.version,
        path: newStatus.path,
        message: newStatus.installed
          ? t("app.api.system.unifiedInterface.cli.setup.install.post.success.description")
          : t("app.api.system.unifiedInterface.cli.setup.install.post.errors.server.description"),
        output: data.verbose ? output : undefined,
      });
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message: "app.api.system.unifiedInterface.cli.setup.install.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          // eslint-disable-next-line i18next/no-literal-string
          error: "CLI installation failed",

          reason: parsedError.message,
          // eslint-disable-next-line i18next/no-literal-string
          stack: parsedError.stack || "No stack trace available",
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
      // Check common installation paths directly instead of using which/where
      const possiblePaths = [
        // eslint-disable-next-line i18next/no-literal-string
        path.join(process.env.HOME || "/tmp", ".local", "bin", "vibe"),
        // eslint-disable-next-line i18next/no-literal-string
        path.join(process.env.HOME || "/tmp", ".yarn", "bin", "vibe"),

        "/usr/local/bin/vibe",

        "/usr/bin/vibe",
      ];

      for (const vibePath of possiblePaths) {
        if (existsSync(vibePath)) {
          // Get version
          let version: string | undefined;
          try {
            const packageJsonPath = path.join(process.cwd(), "package.json");
            if (existsSync(packageJsonPath)) {
              const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
                version?: string;
              };
              version = packageJson.version;
            }
          } catch {
            // Ignore version detection errors
          }

          return {
            installed: true,
            version,
            path: vibePath,
          };
        }
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
        shell: false, // Disable shell to avoid security warnings

        env: { ...process.env, NODE_ENV: "development" },
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
          const errorMessage =
            // eslint-disable-next-line i18next/no-literal-string
            errorOutput || output || `Command failed with code ${code}`;
          reject(new Error(errorMessage));
        }
      });

      childProcess.on("error", (error: Error) => {
        if (!options.ignoreErrors) {
          reject(error);
        } else {
          resolve("");
        }
      });
    });
  }
}

/**
 * Default repository instance
 */
export const setupInstallRepository = new SetupInstallRepositoryImpl();
