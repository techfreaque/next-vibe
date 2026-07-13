/**
 * Setup Install Repository
 * Business logic for CLI global installation
 * Following migration guide: Repository-only logic pattern
 */

import "server-only";

import { spawn } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { SetupInstallT } from "next-vibe/platforms/cli/setup/install/i18n";

import type { InstallRequestOutput, InstallResponseOutput } from "./definition";

/**
 * Setup Install Repository Implementation
 */
export class SetupInstallRepository {
  // eslint-disable-next-line i18next/no-literal-string
  private static readonly NPM_UNLINK_ARGS = ["unlink", "-g"] as const;
  private static readonly NPM_LINK_ARGS = ["link"] as const;
  private static readonly NPM_LINK_FORCE_ARGS = ["link", "--force"] as const;

  /**
   * Get the appropriate binary directory for the current platform
   */
  private static getBinaryDirectory(): string {
    const platform = /*turbopackIgnore: true*/ os.platform();
    const homeDir = /*turbopackIgnore: true*/ os.homedir();

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
  private static getBinaryFilename(): string {
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
  private static createBinaryContent(vibeRelativePath: string): string {
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
set "CANDIDATE=!CURRENT_DIR!\\!REL_PATH!"
if exist "!CANDIDATE!" (
  bun "!CANDIDATE!" %*
  exit /b !errorlevel!
)

REM Compute parent directory of CURRENT_DIR
for %%I in ("!CURRENT_DIR!") do set "PARENT_DIR=%%~dpI"
REM Strip trailing backslash if present
if "!PARENT_DIR:~-1!"=="\\" set "PARENT_DIR=!PARENT_DIR:~0,-1!"

REM Stop when we cannot ascend any further (drive root)
if /I "!PARENT_DIR!"=="!CURRENT_DIR!" goto not_found
if "!PARENT_DIR!"=="" goto not_found

set "CURRENT_DIR=!PARENT_DIR!"
goto find_vibe

:not_found
echo vibe: could not find vibe-runtime.ts ^(looked for !REL_PATH! upwards from %CD%^) 1>&2
exit /b 1
`;
    }

    return SetupInstallRepository.createUnixBinaryContent(vibeRelativePath);
  }

  /** Bash shim used on Linux/macOS and as a Git Bash companion on Windows. */
  private static createUnixBinaryContent(vibeRelativePath: string): string {
    // eslint-disable-next-line i18next/no-literal-string
    return `#!/bin/bash

# Vibe CLI Unix/Git Bash Binary
# Searches for vibe-runtime.ts from current directory upwards and executes with Bun

REL_PATH="${vibeRelativePath}"

current_dir="$(pwd)"
root="/"

# On Windows (Git Bash/MSYS2), bun.exe is a native Windows binary that does not
# understand POSIX paths like /c/Users/.... cygpath -m converts them to C:/Users/...
# which bun accepts. On Linux/macOS cygpath is absent so we pass the path unchanged.
_bun_path() {
  if command -v cygpath &>/dev/null; then
    cygpath -m "$1"
  else
    echo "$1"
  fi
}

while [ "$current_dir" != "$root" ]; do
  candidate="$current_dir/$REL_PATH"
  if [ -f "$candidate" ]; then
    PROC_NAME="vibe-\${1:-cli}"
    # Capture start time in ms before exec (EPOCHREALTIME is bash 5+; fall back to date)
    if [ -n "\${EPOCHREALTIME+x}" ]; then
      VIBE_START_TIME=$(( \${EPOCHREALTIME%.*}\${EPOCHREALTIME#*.} / 1000 ))
    else
      VIBE_START_TIME=$(date +%s%3N)
    fi
    export VIBE_START_TIME
    exec -a "$PROC_NAME" bun "$(_bun_path "$candidate")" "$@"
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
  private static async checkBunAvailable(): Promise<boolean> {
    try {
      await SetupInstallRepository.runCommand("bun", ["--version"], {
        verbose: false,
        ignoreErrors: true,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * All paths the dispatcher binary may have been written to on this platform.
   * Used to clear stale installs from every location before reinstalling.
   */
  private static candidateBinaryPaths(): string[] {
    const platform = /*turbopackIgnore: true*/ os.platform();
    const homeDir = /*turbopackIgnore: true*/ os.homedir();
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

  /**
   * Remove any existing dispatcher binary from every candidate location so the
   * subsequent write is a genuine clean install (formerly the `update` command).
   */
  private static async removeExistingBinaries(): Promise<void> {
    for (const candidate of SetupInstallRepository.candidateBinaryPaths()) {
      if (existsSync(candidate)) {
        try {
          const fs = await import("node:fs/promises");
          await fs.unlink(candidate);
        } catch {
          // Ignore removal errors
        }
      }
    }
  }

  static async installCli(
    data: InstallRequestOutput,
    user: JwtPayloadType,
    t: SetupInstallT,
  ): Promise<ResponseType<InstallResponseOutput>> {
    // Validate user permissions for CLI installation
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
      // Always perform a clean install (uninstall + reinstall). There is no
      // "already installed → skip" fast path: running install first removes any
      // existing binary from every candidate location, then re-writes the binary
      // and MCP config so it stays in sync with the current project.
      await SetupInstallRepository.removeExistingBinaries();

      // Check if Bun is available
      const bunAvailable = await SetupInstallRepository.checkBunAvailable();
      if (!bunAvailable) {
        return fail({
          message: t("post.errors.server.title"),
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
        "platforms",
        "cli",
        "vibe-runtime.ts",
      );
      const vibeTsAbsolutePath = path.join(
        /*turbopackIgnore: true*/ process.cwd(),
        vibeRelativePath,
      );
      /* eslint-enable i18next/no-literal-string */

      // Verify vibe-runtime.ts exists
      if (!existsSync(vibeTsAbsolutePath)) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            // eslint-disable-next-line i18next/no-literal-string
            error: `vibe-runtime.ts not found at ${vibeTsAbsolutePath}`,

            cwd: /*turbopackIgnore: true*/ process.cwd(),
          },
        });
      }

      // Get binary installation paths
      const binDir = SetupInstallRepository.getBinaryDirectory();
      const binaryFilename = SetupInstallRepository.getBinaryFilename();
      const targetPath = path.join(binDir, binaryFilename);

      // Always remove any existing binary before writing a fresh one
      if (existsSync(targetPath)) {
        try {
          const fs = await import("node:fs/promises");
          await fs.unlink(targetPath);
        } catch {
          // Ignore removal errors
        }
      }

      // On Windows, also remove the Git Bash shim before reinstalling
      const bashShimPath =
        os.platform() === "win32" ? path.join(binDir, "vibe") : null;
      if (bashShimPath && existsSync(bashShimPath)) {
        try {
          const fs = await import("node:fs/promises");
          await fs.unlink(bashShimPath);
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
          message: t("post.errors.server.title"),
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
      const binaryContent =
        SetupInstallRepository.createBinaryContent(vibeRelativePath);

      // Write binary file
      writeFileSync(targetPath, binaryContent, { mode: 0o755 });

      // Make executable on Unix systems
      if (os.platform() !== "win32") {
        chmodSync(targetPath, 0o755);
      }

      // On Windows, also write a bash shim (no extension) so Git Bash can invoke vibe.
      // Git Bash doesn't execute .cmd files; it needs a plain shell script in PATH.
      // The path separator must be POSIX-style for the bash script to work correctly.
      if (os.platform() === "win32" && bashShimPath) {
        const posixRelativePath = vibeRelativePath.replaceAll("\\", "/");
        const bashContent =
          SetupInstallRepository.createUnixBinaryContent(posixRelativePath);
        writeFileSync(bashShimPath, bashContent, { mode: 0o755 });
      }

      // Set up MCP config files (.mcp.json and mcp.json) from the example template
      await SetupInstallRepository.setupMcpFiles(
        /*turbopackIgnore: true*/ process.cwd(),
      );

      // eslint-disable-next-line i18next/no-literal-string
      let output = `Binary installed at ${targetPath}`;

      // Add to PATH on Windows if needed
      if (os.platform() === "win32") {
        const pathResult =
          await SetupInstallRepository.ensureWindowsUserPath(binDir);
        // eslint-disable-next-line i18next/no-literal-string
        output += `\n${pathResult}`;
        // eslint-disable-next-line i18next/no-literal-string
        output += `\nNote: open a new terminal so the updated PATH takes effect`;
      } else {
        // eslint-disable-next-line i18next/no-literal-string
        output += `\nNote: Make sure ${binDir} is in your PATH. Add this to your shell profile if needed:\nexport PATH="${binDir}:$PATH"`;
      }
      // eslint-disable-next-line i18next/no-literal-string
      output += `\nMCP config written to .mcp.json (Claude Code) and mcp.json (Cursor/Windsurf)`;

      // Verify installation
      const newStatus = await this.checkInstallationStatus();

      return success({
        success: newStatus.installed,
        installed: newStatus.installed,
        version: newStatus.version,
        path: newStatus.path,
        message: newStatus.installed
          ? t("post.success.description")
          : t("post.errors.server.description"),
        output: data.verbose ? output : undefined,
      });
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message: t("post.errors.server.title"),
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

  /**
   * Generate .mcp.json and mcp.json from .mcp.example.json by replacing
   * {{PROJECT_PATH}} with the actual project path (cwd). Both files are written
   * so they work for Claude Code (.mcp.json) and Cursor/Windsurf (mcp.json).
   *
   * Uses POSIX-style forward slashes so the embedded path is valid JSON on
   * Windows (where backslashes would otherwise need to be escaped).
   */
  private static async setupMcpFiles(projectPath: string): Promise<void> {
    // eslint-disable-next-line i18next/no-literal-string
    const examplePath = path.join(projectPath, ".mcp.example.json");
    if (!existsSync(examplePath)) {
      return;
    }
    const template = await readFile(examplePath, "utf8");
    const jsonSafePath = projectPath.replaceAll("\\", "/");
    const content = template.replaceAll("{{PROJECT_PATH}}", jsonSafePath);
    // eslint-disable-next-line i18next/no-literal-string
    await writeFile(path.join(projectPath, ".mcp.json"), content, "utf8");
    // eslint-disable-next-line i18next/no-literal-string
    await writeFile(path.join(projectPath, "mcp.json"), content, "utf8");
  }

  /**
   * Idempotently add `binDir` to the current user's PATH on Windows.
   *
   * Uses PowerShell's [Environment]::SetEnvironmentVariable with the "User"
   * scope so the change persists across sessions without requiring admin
   * rights. Existing shells need to be restarted to see the new PATH.
   */
  private static async ensureWindowsUserPath(binDir: string): Promise<string> {
    /* eslint-disable i18next/no-literal-string */
    const psScript = `
$ErrorActionPreference = 'Stop'
$binDir = ${SetupInstallRepository.toPowerShellLiteral(binDir)}
$current = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($null -eq $current) { $current = '' }
$parts = $current -split ';' | Where-Object { $_ -ne '' }
$already = $false
foreach ($p in $parts) {
  if ($p.TrimEnd('\\') -ieq $binDir.TrimEnd('\\')) { $already = $true; break }
}
if ($already) {
  Write-Output "PATH already contains $binDir"
} else {
  $newPath = if ($current) { "$current;$binDir" } else { $binDir }
  [Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
  Write-Output "Added $binDir to user PATH"
}
`.trim();
    try {
      const output = await SetupInstallRepository.runCommand(
        "powershell",
        ["-NoProfile", "-NonInteractive", "-Command", psScript],
        { verbose: false, ignoreErrors: false },
      );
      return output.trim() || `Updated user PATH to include ${binDir}`;
    } catch (error) {
      const parsedError = parseError(error);
      return `Could not auto-update PATH (${parsedError.message}). Add manually: ${binDir}`;
    }
    /* eslint-enable i18next/no-literal-string */
  }

  /**
   * Quote a string as a PowerShell single-quoted literal (escaping ').
   */
  private static toPowerShellLiteral(value: string): string {
    // eslint-disable-next-line i18next/no-literal-string
    return `'${value.replaceAll("'", "''")}'`;
  }

  private static async checkInstallationStatus(): Promise<{
    installed: boolean;
    version?: string;
    path?: string;
  }> {
    try {
      const platform = /*turbopackIgnore: true*/ os.platform();
      const homeDir = /*turbopackIgnore: true*/ os.homedir();

      let possiblePaths: string[];
      if (platform === "win32") {
        const windowsAppData =
          // eslint-disable-next-line i18next/no-literal-string
          process.env.APPDATA || path.join(homeDir, "AppData", "Roaming");
        const windowsLocalAppData =
          // eslint-disable-next-line i18next/no-literal-string
          process.env.LOCALAPPDATA || path.join(homeDir, "AppData", "Local");
        possiblePaths = [
          // eslint-disable-next-line i18next/no-literal-string
          path.join(windowsAppData, "vibe", "bin", "vibe.cmd"),
          // eslint-disable-next-line i18next/no-literal-string
          path.join(windowsLocalAppData, "vibe", "bin", "vibe.cmd"),
        ];
      } else {
        possiblePaths = [
          // eslint-disable-next-line i18next/no-literal-string
          path.join(homeDir, ".local", "bin", "vibe"),
          // eslint-disable-next-line i18next/no-literal-string
          path.join(homeDir, ".yarn", "bin", "vibe"),

          "/usr/local/bin/vibe",

          "/usr/bin/vibe",
        ];
      }

      for (const vibePath of possiblePaths) {
        if (existsSync(vibePath)) {
          // Get version
          let version: string | undefined;
          try {
            const packageJsonPath = path.join(
              /*turbopackIgnore: true*/ process.cwd(),
              "package.json",
            );
            if (existsSync(packageJsonPath)) {
              const packageJson = JSON.parse(
                await readFile(packageJsonPath, "utf8"),
              ) as {
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

  private static async runCommand(
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
        cwd: options.cwd || /*turbopackIgnore: true*/ process.cwd(),
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
