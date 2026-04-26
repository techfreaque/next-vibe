/**
 * System Health Check Route Handler
 * Called by cron every minute. Checks DB, memory, and disk.
 * Logs only when thresholds are breached - silent when healthy.
 */

import "server-only";

import { execSync } from "node:child_process";

import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { rawPool } from "@/app/api/[locale]/system/db";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";

/** Thresholds tuned for a 16 GB server */
const THRESHOLDS = {
  memWarnPct: 75,
  memCriticalPct: 90,
  diskWarnPct: 80,
  diskCriticalPct: 95,
  dbWarnMs: 500,
  dbCriticalMs: 2000,
} as const;

/** Read /proc/meminfo - works on Linux (Docker). Returns null on other platforms. */
function readProcMeminfo(): { totalKb: number; availableKb: number } | null {
  try {
    const raw = execSync("cat /proc/meminfo", { encoding: "utf-8" });
    const total = parseInt(/MemTotal:\s+(\d+)/.exec(raw)?.[1] ?? "", 10);
    const available = parseInt(
      /MemAvailable:\s+(\d+)/.exec(raw)?.[1] ?? "",
      10,
    );
    if (isNaN(total) || isNaN(available)) {
      return null;
    }
    return { totalKb: total, availableKb: available };
  } catch {
    return null;
  }
}

/** Read disk usage for /app (or /). Returns null if df unavailable. */
function readDiskUsedPct(): number | null {
  try {
    // Use -P (POSIX format) - compatible with BusyBox df and GNU df.
    // POSIX output: "Filesystem 1024-blocks Used Available Capacity% Mounted"
    const raw = execSync("df -P /app 2>/dev/null || df -P /", {
      encoding: "utf-8",
    });
    // Pick the last data line's 5th column (e.g. "72%")
    const lines = raw.trim().split("\n");
    const dataLine = lines[lines.length - 1];
    const match = /\s(\d+)%\s/.exec(dataLine ?? "");
    return match ? parseInt(match[1], 10) : null;
  } catch {
    return null;
  }
}

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ t }) => {
      const warnings: string[] = [];
      let status: "ok" | "warning" | "critical" = "ok";

      // --- DB check ---
      const dbStart = Date.now();
      await rawPool.query("SELECT 1");
      const dbResponseMs = Date.now() - dbStart;

      if (dbResponseMs >= THRESHOLDS.dbCriticalMs) {
        status = "critical";
        warnings.push(`DB response critical: ${dbResponseMs}ms`);
      } else if (dbResponseMs >= THRESHOLDS.dbWarnMs) {
        status = "warning";
        warnings.push(`DB response slow: ${dbResponseMs}ms`);
      }

      // --- Memory check ---
      const nodeMem = process.memoryUsage();
      const heapUsedMb = Math.round(nodeMem.heapUsed / 1024 / 1024);
      const rssMb = Math.round(nodeMem.rss / 1024 / 1024);

      const procMem = readProcMeminfo();
      const memoryUsedPct = procMem
        ? Math.round(
            ((procMem.totalKb - procMem.availableKb) / procMem.totalKb) * 100,
          )
        : Math.round((nodeMem.heapUsed / nodeMem.heapTotal) * 100);

      if (memoryUsedPct >= THRESHOLDS.memCriticalPct) {
        status = "critical";
        warnings.push(`Memory critical: ${memoryUsedPct}%`);
      } else if (memoryUsedPct >= THRESHOLDS.memWarnPct) {
        if (status === "ok") {
          status = "warning";
        }
        warnings.push(`Memory high: ${memoryUsedPct}%`);
      }

      // --- Disk check ---
      const diskUsedPct = readDiskUsedPct();

      if (diskUsedPct !== null) {
        if (diskUsedPct >= THRESHOLDS.diskCriticalPct) {
          status = "critical";
          warnings.push(`Disk critical: ${diskUsedPct}%`);
        } else if (diskUsedPct >= THRESHOLDS.diskWarnPct) {
          if (status === "ok") {
            status = "warning";
          }
          warnings.push(`Disk high: ${diskUsedPct}%`);
        }
      }

      const uptimeHours = Math.round(process.uptime() / 3600);

      const result = {
        healthy: status === "ok",
        status,
        dbResponseMs,
        memoryUsedPct,
        heapUsedMb,
        rssMb,
        diskUsedPct,
        uptimeHours,
        warnings,
      };

      // Fail the task so the runner records it as FAILED in history.
      // Only non-ok status causes a failure - the task history shows the warnings.
      if (status !== "ok") {
        return fail({
          message: t("dbHealth.post.errors.systemAlert", {
            status,
            warnings: warnings.join("; "),
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success(result);
    },
  },
});
