/**
 * CLI setup — installs and removes the global command shim.
 *
 * Self-contained on purpose: the shim, the PATH handling and the setup contract
 * all live in this file. Discovered by the `setup-index` generator and run by
 * the setup command in core/setup. See docs/patterns/setup.md.
 *
 * This is also why the CLI keeps its own setup rather than letting core/setup
 * own it: the shim points at `vibe-runtime.ts`, which sits right here, and the
 * path is derived from this module's own location so the depth the framework is
 * vendored at never has to be hardcoded. Move this file and the shim silently
 * retargets.
 */

import "server-only";

import { spawn } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import chalk from "chalk";
import type { SetupResult } from "next-vibe/core/setup/types";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { CLI_BINARY_NAME } from "next-vibe/platforms/cli/types/cli-target";

class CliBinary {
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

        return path.join(windowsPath, CLI_BINARY_NAME, "bin");
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
    return os.platform() === "win32"
      ? `${CLI_BINARY_NAME}.cmd`
      : CLI_BINARY_NAME;
  }

  /**
   * Create the binary content for the current platform
   *
   * The global binary acts as a small dispatcher that resolves the correct
   * vibe-runtime.ts **based on the current working directory** instead of a
   * single hard-coded project path.
   *
   * It walks up from the CWD until it finds the expected relative path and
   * then executes that file. This allows a single global binary to work with
   * multiple projects on the same machine.
   *
   * The runtime is chosen when the shim runs, not when it is written: bun if it
   * is on PATH, otherwise `npx tsx`. Deciding at run time means installing bun
   * later is picked up without reinstalling the shim. `npx` alone cannot run a
   * .ts file, hence tsx.
   */
  private static createBinaryContent(relativePath: string): string {
    const platform = os.platform();
    // cmd.exe wants backslashes; the path arrives using the host separator.
    const vibeRelativePath = relativePath.split(path.sep).join("\\");

    if (platform === "win32") {
      // Windows batch file
      // The script starts from %CD% and walks up the directory tree,
      // searching for the configured relative path.
      // eslint-disable-next-line i18next/no-literal-string
      return `@echo off
setlocal enabledelayedexpansion

REM ${CLI_BINARY_NAME} CLI Windows Binary
REM Searches for vibe-runtime.ts from current directory upwards and executes it
REM with bun when available, otherwise npx tsx.

set "REL_PATH=${vibeRelativePath}"
set "CURRENT_DIR=%CD%"

:find_vibe
set "CANDIDATE=!CURRENT_DIR!\\!REL_PATH!"
if exist "!CANDIDATE!" (
  where bun >nul 2>nul
  if !errorlevel! equ 0 (
    bun "!CANDIDATE!" %*
    exit /b !errorlevel!
  )
  where npx >nul 2>nul
  if !errorlevel! equ 0 (
    npx tsx "!CANDIDATE!" %*
    exit /b !errorlevel!
  )
  echo ${CLI_BINARY_NAME}: neither bun nor npx found on PATH 1>&2
  exit /b 1
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
echo ${CLI_BINARY_NAME}: could not find vibe-runtime.ts ^(looked for !REL_PATH! upwards from %CD%^) 1>&2
exit /b 1
`;
    }

    return CliBinary.createUnixBinaryContent(relativePath);
  }

  /**
   * PowerShell shim, written on Windows alongside the .cmd and the bash one.
   *
   * PowerShell *will* run the .cmd via PATHEXT, so this is not strictly needed
   * to make the name resolve. It is here because going through cmd.exe re-parses
   * every argument under cmd's quoting rules, which mangles anything containing
   * `&`, `^` or quotes before the CLI ever sees it. `@args` forwards them intact.
   * npm ships the same three shims for the same reason.
   */
  private static createPowerShellBinaryContent(relativePath: string): string {
    const vibeRelativePath = relativePath.split(path.sep).join("\\");
    // eslint-disable-next-line i18next/no-literal-string
    return `#!/usr/bin/env pwsh
# ${CLI_BINARY_NAME} CLI PowerShell shim
# Searches for vibe-runtime.ts from the current directory upwards and executes
# it with bun when available, otherwise npx tsx.

$rel = '${vibeRelativePath}'
$dir = (Get-Location).Path

while ($true) {
  $candidate = Join-Path $dir $rel
  if (Test-Path $candidate) {
    if (Get-Command bun -ErrorAction SilentlyContinue) {
      & bun $candidate @args
      exit $LASTEXITCODE
    }
    if (Get-Command npx -ErrorAction SilentlyContinue) {
      & npx tsx $candidate @args
      exit $LASTEXITCODE
    }
    [Console]::Error.WriteLine('${CLI_BINARY_NAME}: neither bun nor npx found on PATH')
    exit 1
  }

  $parent = Split-Path $dir -Parent
  # Split-Path returns '' at a drive root, and the same path if it cannot ascend.
  if (-not $parent -or $parent -eq $dir) { break }
  $dir = $parent
}

[Console]::Error.WriteLine("${CLI_BINARY_NAME}: could not find vibe-runtime.ts (looked for $rel upwards from $((Get-Location).Path))")
exit 1
`;
  }

  /** Bash shim used on Linux/macOS and as a Git Bash companion on Windows. */
  private static createUnixBinaryContent(relativePath: string): string {
    // bash builds "$current_dir/$REL_PATH", so this half always wants forward
    // slashes — including the Git Bash companion written on Windows.
    const vibeRelativePath = relativePath.split(path.sep).join("/");
    // eslint-disable-next-line i18next/no-literal-string
    return `#!/bin/bash

# ${CLI_BINARY_NAME} CLI Unix/Git Bash Binary
# Searches for vibe-runtime.ts from current directory upwards and executes it
# with bun when available, otherwise npx tsx.

REL_PATH="${vibeRelativePath}"

current_dir="$(pwd)"
root="/"

# On Windows (Git Bash/MSYS2), bun.exe and npx are native Windows binaries that
# do not understand POSIX paths like /c/Users/.... cygpath -m converts them to
# C:/Users/... which they accept. On Linux/macOS cygpath is absent so we pass the
# path unchanged.
_native_path() {
  if command -v cygpath &>/dev/null; then
    cygpath -m "$1"
  else
    echo "$1"
  fi
}

while [ "$current_dir" != "$root" ]; do
  candidate="$current_dir/$REL_PATH"
  if [ -f "$candidate" ]; then
    PROC_NAME="${CLI_BINARY_NAME}-\${1:-cli}"
    # Capture start time in ms before exec (EPOCHREALTIME is bash 5+; fall back to date)
    if [ -n "\${EPOCHREALTIME+x}" ]; then
      VIBE_START_TIME=$(( \${EPOCHREALTIME%.*}\${EPOCHREALTIME#*.} / 1000 ))
    else
      VIBE_START_TIME=$(date +%s%3N)
    fi
    export VIBE_START_TIME
    if command -v bun &>/dev/null; then
      exec -a "$PROC_NAME" bun "$(_native_path "$candidate")" "$@"
    fi
    if command -v npx &>/dev/null; then
      exec -a "$PROC_NAME" npx tsx "$(_native_path "$candidate")" "$@"
    fi
    echo "${CLI_BINARY_NAME}: neither bun nor npx found on PATH" 1>&2
    exit 1
  fi
  current_dir="$(dirname "$current_dir")"
done

echo "${CLI_BINARY_NAME}: could not find vibe-runtime.ts (looked for $REL_PATH upwards from $(pwd))" 1>&2
exit 1
`;
  }

  /**
   * Path of vibe-runtime.ts relative to the project root, as the shim will look
   * for it while walking up from the user's CWD.
   *
   * Derived from this module's own location rather than hardcoded, because the
   * framework is vendored at a different depth in each consuming repo — a
   * literal would be wrong in any fork that moves it. This file sits beside
   * vibe-runtime.ts, which is the reason the binary logic belongs to the CLI
   * platform and cannot move to core with the setup command.
   */
  private static vibeRuntimeRelativePath(): string {
    const runtimeAbsolute = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      // eslint-disable-next-line i18next/no-literal-string
      "vibe-runtime.ts",
    );
    return path.relative(process.cwd(), runtimeAbsolute);
  }

  /**
   * Check whether `command` resolves on PATH by asking it for its version.
   */
  private static async checkCommandAvailable(
    command: string,
  ): Promise<boolean> {
    try {
      await CliBinary.runCommand(command, ["--version"], {
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
      // Three files per location on Windows: the .cmd for cmd.exe, the .ps1 for
      // PowerShell, and an extensionless Git Bash companion. A shim missing from
      // this list survives uninstall as a stale command on PATH.
      // eslint-disable-next-line i18next/no-literal-string
      const binDirs = [
        path.join(windowsAppData, CLI_BINARY_NAME, "bin"),
        path.join(windowsLocalAppData, CLI_BINARY_NAME, "bin"),
      ];
      return binDirs.flatMap((dir) => [
        path.join(dir, `${CLI_BINARY_NAME}.cmd`),
        path.join(dir, `${CLI_BINARY_NAME}.ps1`),
        path.join(dir, CLI_BINARY_NAME),
      ]);
    }
    return [
      // eslint-disable-next-line i18next/no-literal-string
      path.join(homeDir, ".local", "bin", CLI_BINARY_NAME),
      // eslint-disable-next-line i18next/no-literal-string
      path.join(homeDir, ".yarn", "bin", CLI_BINARY_NAME),
      `/usr/local/bin/${CLI_BINARY_NAME}`,
      `/usr/bin/${CLI_BINARY_NAME}`,
    ];
  }

  /**
   * Remove any existing dispatcher binary from every candidate location so the
   * subsequent write is a genuine clean install (formerly the `update` command).
   */
  private static async removeExistingBinaries(): Promise<string[]> {
    const removed: string[] = [];
    for (const candidate of CliBinary.candidateBinaryPaths()) {
      if (existsSync(candidate)) {
        try {
          const fs = await import("node:fs/promises");
          await fs.unlink(candidate);
          removed.push(candidate);
        } catch {
          // Ignore removal errors
        }
      }
    }
    return removed;
  }

  /**
   * Drop the global shim from every candidate location. PATH is deliberately
   * left alone: the entry is harmless once empty, and a user may well have put
   * that directory there themselves for something else.
   */
  static async uninstallBinary(): Promise<SetupResult> {
    const removed = await CliBinary.removeExistingBinaries();
    return {
      changed: removed,
      summary:
        removed.length > 0
          ? // eslint-disable-next-line i18next/no-literal-string
            `removed ${removed.length} binary shim(s)`
          : // eslint-disable-next-line i18next/no-literal-string
            "no binary to remove",
    };
  }

  /**
   * Write the global shim and make sure its directory is on PATH.
   *
   * Throws rather than returning a ResponseType: this is a setup, and the setup
   * runner turns a throw into that entry's failure line. Endpoint-shaped errors
   * belong to core/setup/install, which is what calls the runner.
   *
   * `notes` carries anything the user must act on (a PATH that only a new shell
   * will see). It is returned rather than logged because presentation is
   * `setup.ts`'s job, and this module has no logger.
   */
  static async installBinary(): Promise<SetupResult & { notes: string[] }> {
    {
      // Always perform a clean install (uninstall + reinstall). There is no
      // "already installed → skip" fast path: running install first removes any
      // existing binary from every candidate location, then re-writes the binary
      // so it stays in sync with the current project.
      await CliBinary.removeExistingBinaries();

      // The shim prefers bun and falls back to `npx tsx`, so either one is
      // enough to install. Only refuse when neither runtime is reachable.
      const [bunAvailable, npxAvailable] = await Promise.all([
        CliBinary.checkCommandAvailable("bun"),
        CliBinary.checkCommandAvailable("npx"),
      ]);
      if (!bunAvailable && !npxAvailable) {
        return {
          changed: [],
          summary: "",
          notes: [],
          failed:
            "Neither bun nor npx is installed or in PATH. Install bun (curl -fsSL https://bun.sh/install | bash) or node, which ships npx.",
        };
      }

      // Get paths for the dispatcher installation

      /* eslint-disable i18next/no-literal-string */
      const vibeRelativePath = CliBinary.vibeRuntimeRelativePath();
      const vibeTsAbsolutePath = path.join(
        /*turbopackIgnore: true*/ process.cwd(),
        vibeRelativePath,
      );
      /* eslint-enable i18next/no-literal-string */

      // Verify vibe-runtime.ts exists
      if (!existsSync(vibeTsAbsolutePath)) {
        return {
          changed: [],
          summary: "",
          notes: [],
          failed: `vibe-runtime.ts not found at ${vibeTsAbsolutePath} (cwd ${process.cwd()})`,
        };
      }

      // Get binary installation paths
      const binDir = CliBinary.getBinaryDirectory();
      const binaryFilename = CliBinary.getBinaryFilename();
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
        os.platform() === "win32" ? path.join(binDir, CLI_BINARY_NAME) : null;
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
        return {
          changed: [],
          summary: "",
          notes: [],
          failed: `Failed to create directory ${binDir}: ${parseError(error).message}`,
        };
      }

      // Create binary content with the RELATIVE path so it can be found from any project
      const binaryContent = CliBinary.createBinaryContent(vibeRelativePath);

      // Write binary file
      writeFileSync(targetPath, binaryContent, { mode: 0o755 });

      // Make executable on Unix systems
      if (os.platform() !== "win32") {
        chmodSync(targetPath, 0o755);
      }

      // Windows has three shells and no single shim satisfies them: cmd.exe runs
      // the .cmd, Git Bash won't execute a .cmd and needs an extensionless shell
      // script, and PowerShell needs a .ps1 to forward arguments without cmd's
      // quoting rules rewriting them. Write all three so the command works
      // whichever terminal the developer happens to open.
      const companions: string[] = [];
      if (os.platform() === "win32") {
        const posixRelativePath = vibeRelativePath.replaceAll("\\", "/");

        if (bashShimPath) {
          writeFileSync(
            bashShimPath,
            CliBinary.createUnixBinaryContent(posixRelativePath),
            { mode: 0o755 },
          );
          companions.push(bashShimPath);
        }

        const powerShellShimPath = path.join(binDir, `${CLI_BINARY_NAME}.ps1`);
        writeFileSync(
          powerShellShimPath,
          CliBinary.createPowerShellBinaryContent(vibeRelativePath),
          { mode: 0o755 },
        );
        companions.push(powerShellShimPath);
      }

      const notes: string[] = [];

      // Persist PATH for future shells and be explicit that this one will not
      // see it — a child process cannot edit its parent's environment.
      if (os.platform() === "win32") {
        notes.push(await CliBinary.ensureWindowsUserPath(binDir));
        // eslint-disable-next-line i18next/no-literal-string
        notes.push("open a new terminal so the updated PATH takes effect");
      } else {
        // eslint-disable-next-line i18next/no-literal-string
        notes.push(
          `make sure ${binDir} is in your PATH — add to your shell profile: export PATH="${binDir}:$PATH"`,
        );
      }

      const status = await CliBinary.checkInstallationStatus();
      if (!status.installed) {
        return {
          changed: [],
          summary: "",
          notes: [],
          failed: `binary written to ${targetPath} but ${CLI_BINARY_NAME} does not resolve afterwards`,
        };
      }

      return {
        changed: [targetPath, ...companions],
        // eslint-disable-next-line i18next/no-literal-string
        summary: `binary installed at ${targetPath}`,
        notes,
      };
    }
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
$binDir = ${CliBinary.toPowerShellLiteral(binDir)}
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
      const output = await CliBinary.runCommand(
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
          path.join(
            windowsAppData,
            CLI_BINARY_NAME,
            "bin",
            `${CLI_BINARY_NAME}.cmd`,
          ),
          // eslint-disable-next-line i18next/no-literal-string
          path.join(
            windowsLocalAppData,
            CLI_BINARY_NAME,
            "bin",
            `${CLI_BINARY_NAME}.cmd`,
          ),
        ];
      } else {
        possiblePaths = [
          // eslint-disable-next-line i18next/no-literal-string
          path.join(homeDir, ".local", "bin", CLI_BINARY_NAME),
          // eslint-disable-next-line i18next/no-literal-string
          path.join(homeDir, ".yarn", "bin", CLI_BINARY_NAME),

          `/usr/local/bin/${CLI_BINARY_NAME}`,

          `/usr/bin/${CLI_BINARY_NAME}`,
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

// ── The setup contract ─────────────────────────────────────────────────────

/** A label, not a sentence — it is printed after a tick. */
export const description = `${CLI_BINARY_NAME} command`;

export async function install(logger: EndpointLogger): Promise<SetupResult> {
  const { changed, summary, notes, failed } = await CliBinary.installBinary();

  if (failed !== undefined) {
    return { changed, summary, failed };
  }

  logger.info(
    `${chalk.green("✓")} ${description}\n    ${chalk.cyan(changed[0])}`,
  );
  // PATH notes are the one thing here a user must act on, so they are warnings
  // rather than another tick in a list of successes.
  for (const note of notes) {
    logger.warn(`  ${chalk.yellow("!")} ${note}`);
  }

  return { changed, summary };
}

export async function uninstall(logger: EndpointLogger): Promise<SetupResult> {
  const result = await CliBinary.uninstallBinary();
  if (result.changed.length === 0) {
    logger.info(
      `${chalk.dim("·")} ${chalk.dim(`${description} — none found`)}`,
    );
    return result;
  }
  logger.info(
    `${chalk.yellow("−")} ${description}\n${result.changed
      .map((file) => `    ${chalk.dim(file)}`)
      .join("\n")}`,
  );
  return result;
}
