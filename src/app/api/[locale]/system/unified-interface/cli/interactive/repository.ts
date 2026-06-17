/**
 * Interactive CLI Session Repository
 *
 * File-based IPC for agent control of running `vibe <alias> -i` sessions.
 * Frame files and keys files live in .tmp/ keyed by PID.
 * PID auto-detected from `.vibe-interactive.pid` when not provided.
 */

import "server-only";

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { InteractiveT } from "./i18n";

const TMP_DIR = resolve(process.cwd(), ".tmp");
const PID_FILE = resolve(TMP_DIR, ".vibe-interactive.pid");
const FRAME_SEPARATOR = "\n--- LOGS ---\n";
const DEFAULT_WAIT_MS = 500;
const MAX_WAIT_MS = 30_000;

interface FrameData {
  content: string;
  logs: string;
  sessionPid: number;
}

function isProcessRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read active session PID from `.tmp/.vibe-interactive.pid`.
 * Returns null if no PID file exists or the process is dead.
 */
function getActivePid(): number | null {
  if (!existsSync(PID_FILE)) {
    return null;
  }
  const raw = readFileSync(PID_FILE, "utf-8").trim();
  const pid = parseInt(raw, 10);
  if (isNaN(pid) || !isProcessRunning(pid)) {
    return null;
  }
  return pid;
}

/**
 * Resolve PID: use provided value or auto-detect from PID file.
 */
function resolvePid(
  t: InteractiveT,
  pidInput: number | null | undefined,
  errorPrefix: "capture" | "sendKeys",
): { pid: number } | ResponseType<never> {
  const pid = pidInput ?? getActivePid();
  if (pid === null || pid === undefined) {
    return fail({
      message: t(`${errorPrefix}.errors.notFound.title`),
      errorType: ErrorResponseTypes.NOT_FOUND,
      messageParams: {
        error:
          "No active interactive session. Start one with: vibe <alias> -i --agent-control",
      },
    });
  }
  if (!isProcessRunning(pid)) {
    return fail({
      message: t(`${errorPrefix}.errors.notFound.title`),
      errorType: ErrorResponseTypes.NOT_FOUND,
      messageParams: {
        error: `Session PID ${pid} is not running`,
      },
    });
  }
  return { pid };
}

/**
 * Expand `type:` prefix into individual character lines.
 * "type:hello" → "h\ne\nl\nl\no"
 * Lines without `type:` prefix pass through unchanged.
 */
function expandKeys(keys: string): string {
  const lines = keys.split("\n");
  const expanded: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("type:")) {
      const text = trimmed.slice(5);
      for (const char of text) {
        // Space must be sent as keyword "Space" — the keys poller trims
        // lines, so a bare " " would be discarded as empty.
        expanded.push(char === " " ? "Space" : char);
      }
    } else if (trimmed) {
      expanded.push(trimmed);
    }
  }
  return expanded.join("\n");
}

export class InteractiveRepository {
  /**
   * Read the current frame and logs from a running interactive session.
   * PID is auto-detected from `.vibe-interactive.pid` when not provided.
   */
  static capture(
    t: InteractiveT,
    pidInput: number | null | undefined,
  ): ResponseType<FrameData> {
    const resolved = resolvePid(t, pidInput, "capture");
    if ("success" in resolved) {
      return resolved;
    }
    const { pid } = resolved;

    const framePath = resolve(TMP_DIR, `.vibe-interactive-${pid}.frame`);
    if (!existsSync(framePath)) {
      return fail({
        message: t("capture.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: {
          error: `Frame file not found for PID ${pid}. Session may not have rendered yet.`,
        },
      });
    }

    const raw = readFileSync(framePath, "utf-8");
    const separatorIdx = raw.indexOf(FRAME_SEPARATOR);
    const content = separatorIdx >= 0 ? raw.slice(0, separatorIdx) : raw;
    const logs =
      separatorIdx >= 0 ? raw.slice(separatorIdx + FRAME_SEPARATOR.length) : "";

    return success({ content, logs, sessionPid: pid });
  }

  /**
   * Send keystrokes to a running interactive session and return the updated frame.
   * PID is auto-detected when not provided.
   * Supports `type:text` prefix for typing strings character-by-character.
   * waitMs controls the delay before reading the frame (default 500ms).
   */
  static async sendKeys(
    t: InteractiveT,
    keys: string,
    pidInput: number | null | undefined,
    waitMs?: number | null,
  ): Promise<ResponseType<FrameData>> {
    const resolved = resolvePid(t, pidInput, "sendKeys");
    if ("success" in resolved) {
      return resolved;
    }
    const { pid } = resolved;

    const keysPath = resolve(TMP_DIR, `.vibe-interactive-${pid}.keys`);
    if (!existsSync(keysPath)) {
      return fail({
        message: t("sendKeys.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: {
          error: `Keys file not found for PID ${pid}. Session may not be ready.`,
        },
      });
    }

    // Expand type: prefixes into individual character lines
    const expandedKeys = expandKeys(keys);
    const keyCount = expandedKeys.split("\n").filter((l) => l.trim()).length;

    // Write keys (one per line) — overwrites, the running session polls this file
    writeFileSync(keysPath, expandedKeys);

    // Wait for the session to process keys and re-render.
    // Each key drains at ~50ms intervals + 100ms poll + 1s frame throttle.
    // Auto-calculate minimum wait if none specified.
    const autoWait = 100 + keyCount * 50 + 1100;
    const delay = Math.min(
      Math.max(waitMs ?? Math.max(DEFAULT_WAIT_MS, autoWait), 0),
      MAX_WAIT_MS,
    );
    await Bun.sleep(delay);

    // Return the updated frame
    return InteractiveRepository.capture(t, pid);
  }
}
