/**
 * System Health Check Route Handler
 * Called by cron every minute. Checks DB, memory, and disk.
 * Logs only when thresholds are breached - silent when healthy.
 */

import "server-only";

import { execSync } from "node:child_process";

import { success } from "next-vibe/shared/types/response.schema";

import { rawPool } from "@/app/api/[locale]/system/db";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { formatDatabase } from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";
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
    const raw = execSync(
      "df /app --output=pcent 2>/dev/null || df / --output=pcent",
      {
        encoding: "utf-8",
      },
    );
    const match = /(\d+)%/.exec(raw);
    return match ? parseInt(match[1], 10) : null;
  } catch {
    return null;
  }
}

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ logger }) => {
      const warnings: string[] = [];
      let status: "ok" | "warning" | "critical" = "ok";

      // --- DB check ---
      const dbStart = Date.now();
      await rawPool.query("SELECT 1");
      const dbResponseMs = Date.now() - dbStart;

      if (dbResponseMs >= THRESHOLDS.dbCriticalMs) {
        status = "critical";
        warnings.push(`DB response critical: ${dbResponseMs}ms`);
        logger.error(
          formatDatabase(`DB response critical: ${dbResponseMs}ms`, "🗄️ "),
          { dbResponseMs },
        );
      } else if (dbResponseMs >= THRESHOLDS.dbWarnMs) {
        status = "warning";
        warnings.push(`DB response slow: ${dbResponseMs}ms`);
        logger.warn(
          formatDatabase(`DB response slow: ${dbResponseMs}ms`, "🗄️ "),
          { dbResponseMs },
        );
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
        logger.error(`[Health] Memory critical: ${memoryUsedPct}%`, {
          memoryUsedPct,
          heapUsedMb,
          rssMb,
        });
      } else if (memoryUsedPct >= THRESHOLDS.memWarnPct) {
        if (status === "ok") {
          status = "warning";
        }
        warnings.push(`Memory high: ${memoryUsedPct}%`);
        logger.warn(`[Health] Memory high: ${memoryUsedPct}%`, {
          memoryUsedPct,
          heapUsedMb,
          rssMb,
        });
      }

      // --- Disk check ---
      const diskUsedPct = readDiskUsedPct();

      if (diskUsedPct !== null) {
        if (diskUsedPct >= THRESHOLDS.diskCriticalPct) {
          status = "critical";
          warnings.push(`Disk critical: ${diskUsedPct}%`);
          logger.error(`[Health] Disk critical: ${diskUsedPct}%`, {
            diskUsedPct,
          });
        } else if (diskUsedPct >= THRESHOLDS.diskWarnPct) {
          if (status === "ok") {
            status = "warning";
          }
          warnings.push(`Disk high: ${diskUsedPct}%`);
          logger.warn(`[Health] Disk high: ${diskUsedPct}%`, { diskUsedPct });
        }
      }

      const uptimeHours = Math.round(process.uptime() / 3600);

      // Only log when healthy - debug level so it doesn't pollute prod logs
      if (status === "ok") {
        logger.debug(formatDatabase("System health check - OK", "🗄️ "), {
          dbResponseMs,
          memoryUsedPct,
          diskUsedPct,
        });
      }

      return success({
        healthy: status !== "critical",
        status,
        dbResponseMs,
        memoryUsedPct,
        heapUsedMb,
        rssMb,
        diskUsedPct,
        uptimeHours,
        warnings,
      });
    },
  },
});
