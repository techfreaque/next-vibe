/**
 * Dependency Checker Implementation
 * Validates system dependencies with full type safety
 */

/// <reference types="bun-types" />

import "server-only";

import type {
  CommandResult,
  DependencyChecker as IDependencyChecker,
} from "../types";
import { DependencyError } from "../types";

/**
 * Execute which/where command to locate executable
 * @param cmd - Command to locate
 * @returns Path to command or null if not found
 */
async function which(cmd: string): Promise<string | null> {
  const exe = process.platform === "win32" ? "where" : "which";

  try {
    const proc = Bun.spawn([exe, cmd], {
      stdout: "pipe",
      stderr: "ignore",
    });

    const exitCode = await proc.exited;
    if (exitCode !== 0) {
      return null;
    }

    const output = await new Response(proc.stdout).text();
    const lines = output.split(/\r?\n/).filter((line) => line.trim() !== "");

    return lines.length > 0 ? lines[0].trim() : null;
  } catch {
    return null;
  }
}

/**
 * Dependency checker implementation
 */
class DependencyCheckerImpl implements IDependencyChecker {
  /**
   * Check if a command exists in PATH
   */
  which(command: string): Promise<string | null> {
    return which(command);
  }

  /**
   * Ensure a command exists, throw if not found
   */
  async ensure(command: string, friendlyName: string): Promise<void> {
    const path = await this.which(command);
    if (!path) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Dependency check error
      throw new DependencyError(
        `${friendlyName} not found. Please install "${command}" and ensure it's in PATH.`,
        command,
        friendlyName,
      );
    }
  }

  /**
   * Check multiple dependencies at once
   */
  async checkMultiple(
    dependencies: Record<string, string>,
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    await Promise.all(
      Object.entries(dependencies).map(async ([command]) => {
        const path = await this.which(command);
        results[command] = path !== null;
      }),
    );

    return results;
  }
}

/**
 * Singleton instance
 */
export const dependencyChecker: IDependencyChecker =
  new DependencyCheckerImpl();

/**
 * Execute shell command and capture output
 */
export async function executeCommand(
  command: string,
  args: readonly string[],
  options?: {
    readonly cwd?: string;
    readonly env?: Record<string, string>;
    readonly timeout?: number;
  },
): Promise<CommandResult> {
  const proc = Bun.spawn([command, ...args], {
    cwd: options?.cwd,
    env: options?.env,
    stdout: "pipe",
    stderr: "pipe",
  });

  // Handle timeout if specified
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = options?.timeout
    ? // eslint-disable-next-line no-unused-vars -- Timeout promise only rejects, never resolves
      new Promise<never>((_resolve, reject) => {
        timeoutId = setTimeout(() => {
          proc.kill();
          reject(new Error(`Command timeout after ${options.timeout}ms`));
        }, options.timeout);
      })
    : null;

  try {
    const exitCode = await (timeoutPromise
      ? Promise.race([proc.exited, timeoutPromise])
      : proc.exited);

    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();

    return {
      exitCode,
      stdout,
      stderr,
    };
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Escape shell string for safe command execution
 */
export function escapeShellString(str: string): string {
  // Escape special characters for shell
  return str.replaceAll(/(["$`\\])/g, "\\$1");
}

/**
 * Get platform-specific temp directory
 */
export function getTempDirectory(): string {
  if (process.platform === "win32") {
    return process.env.TEMP || process.env.TMP || "C:\\Windows\\Temp";
  }
  return process.env.TMPDIR || "/tmp";
}

/**
 * Generate unique temporary file path
 */
export function generateTempFilePath(
  prefix: string,
  extension: string,
  tmpDir?: string,
): string {
  const dir = tmpDir || getTempDirectory();
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 15);
  const filename = `${prefix}_${timestamp}_${random}.${extension}`;

  if (process.platform === "win32") {
    return `${dir}\\${filename}`;
  }
  return `${dir}/${filename}`;
}

/**
 * Check if file exists
 */
export async function fileExists(path: string): Promise<boolean> {
  try {
    const file = Bun.file(path);
    return await file.exists();
  } catch {
    return false;
  }
}

/**
 * Delete file safely
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    await Bun.spawn(["rm", "-f", path]).exited;
  } catch {
    // Ignore errors during cleanup
  }
}

/**
 * Get file size in bytes
 */
export function getFileSize(path: string): Promise<number> {
  try {
    const file = Bun.file(path);
    return Promise.resolve(file.size);
  } catch {
    return Promise.resolve(0);
  }
}

/**
 * Validate audio file format
 */
export async function validateAudioFile(path: string): Promise<boolean> {
  if (!(await fileExists(path))) {
    return false;
  }

  const size = await getFileSize(path);
  // Minimum size check (44 bytes for WAV header)
  return size >= 44;
}

/**
 * Create directory if it doesn't exist
 */
export async function ensureDirectory(dir: string): Promise<void> {
  try {
    await Bun.spawn(["mkdir", "-p", dir]).exited;
  } catch (error) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Directory creation error
    throw new Error(`Failed to create directory ${dir}: ${String(error)}`, {
      cause: error,
    });
  }
}
