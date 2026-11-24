import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  renameSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";

import { parseError } from "../../../core/utils/parse-error";

type DevStartupLock =
  | { acquired: true; release: () => Error | undefined }
  | { acquired: false; ownerPid: number }
  | { acquired: false; error: Error };

/**
 * Publish an already populated directory atomically. Every live owner has a
 * unique marker, so stale cleanup cannot remove a newer owner's directory.
 * The lock covers the previous owner's shutdown and publication of the new PID.
 */
export function acquireDevStartupLock(pidFile: string): DevStartupLock {
  const lockPath = `${pidFile}.starting`;
  try {
    mkdirSync(dirname(lockPath), { recursive: true });
    const stagedPath = mkdtempSync(`${lockPath}-`);
    const marker = `${String(process.pid)}-${basename(stagedPath)}`;
    let published = false;
    try {
      writeFileSync(join(stagedPath, marker), "");
      while (!published) {
        try {
          renameSync(stagedPath, lockPath);
          published = true;
        } catch (error) {
          const renameError = parseError(error);
          if (
            !hasCode(renameError, "EEXIST", "ENOTEMPTY") &&
            !(
              process.platform === "win32" &&
              hasCode(renameError, "EPERM", "EACCES") &&
              existsSync(lockPath)
            )
          ) {
            return { acquired: false, error: renameError };
          }
          let entries: string[];
          try {
            entries = readdirSync(lockPath);
          } catch (readError) {
            const lockReadError = parseError(readError);
            if (hasCode(lockReadError, "ENOENT")) {
              continue;
            }
            return { acquired: false, error: lockReadError };
          }
          const existingMarker = entries[0];
          if (existingMarker !== undefined) {
            const ownerPid = Number(existingMarker.split("-", 1)[0]);
            if (
              entries.length !== 1 ||
              !Number.isSafeInteger(ownerPid) ||
              ownerPid <= 0
            ) {
              return {
                acquired: false,
                error: new Error("Invalid development startup lock"),
              };
            }
            if (isStartupOwnerRunning(ownerPid)) {
              return { acquired: false, ownerPid };
            }
          }
          const cleanupError = removeMarker(lockPath, existingMarker);
          if (cleanupError) {
            return { acquired: false, error: cleanupError };
          }
        }
      }
      return {
        acquired: true,
        release: () => removeMarker(lockPath, marker),
      };
    } finally {
      if (!published) {
        removeMarker(stagedPath, marker);
      }
    }
  } catch (error) {
    return { acquired: false, error: parseError(error) };
  }
}

function isStartupOwnerRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // A process outside our signal permissions can still own the lock.
    return hasCode(parseError(error), "EPERM");
  }
}

function hasCode(error: Error, ...codes: string[]): boolean {
  return (
    "code" in error &&
    typeof error.code === "string" &&
    codes.includes(error.code)
  );
}

function removeMarker(path: string, marker?: string): Error | undefined {
  if (marker !== undefined) {
    try {
      unlinkSync(join(path, marker));
    } catch (error) {
      const cleanupError = parseError(error);
      if (!hasCode(cleanupError, "ENOENT")) {
        return cleanupError;
      }
    }
  }
  try {
    rmdirSync(path);
  } catch (error) {
    const cleanupError = parseError(error);
    if (!hasCode(cleanupError, "ENOENT", "ENOTEMPTY", "EEXIST")) {
      return cleanupError;
    }
  }
  return undefined;
}
