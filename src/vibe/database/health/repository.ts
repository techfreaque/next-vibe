/**
 * DB Health Check Repository
 * All system health check logic - DB, memory, disk.
 */

import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { statfs } from "node:fs/promises";
import { freemem, totalmem } from "node:os";

import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import type { EndpointLogger } from "../../logger/types";
import type { TasksT } from "../../tasks/i18n";
import { rawPool } from "..";
import { DB_HEALTH_THRESHOLDS as THRESHOLDS } from "./constants";

/**
 * Read /proc/meminfo - works on Linux (Docker). Returns null on other platforms.
 * A direct procfs read (kernel-generated, microseconds), never a child process:
 * the health snapshot calls this every minute on the event loop, and a sync
 * spawn there blocks every WS stream of the process for the spawn's duration.
 */
export function readProcMeminfo(): {
  totalKb: number;
  availableKb: number;
} | null {
  try {
    const raw = readFileSync("/proc/meminfo", "utf-8");
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

/**
 * Disk usage of /app (or /) in percent, same formula as `df -P`
 * (used / (used + available to non-root), rounded up). Async statfs, no
 * `df` child process blocking the event loop. Null if statfs is unavailable.
 */
async function readDiskUsedPct(): Promise<number | null> {
  try {
    const stats = await statfs(existsSync("/app") ? "/app" : "/");
    const used = stats.blocks - stats.bfree;
    const total = used + stats.bavail;
    return total > 0 ? Math.ceil((used / total) * 100) : null;
  } catch {
    return null;
  }
}

export class DbHealthRepository {
  static async check(
    t: TasksT,
    logger: EndpointLogger,
    probe: () => Promise<void> = async () => {
      await rawPool.query("SELECT 1");
    },
  ): Promise<
    ResponseType<{
      healthy: boolean;
      status: "ok" | "warning" | "critical";
      dbResponseMs: number;
      memoryUsedPct: number;
      heapUsedMb: number;
      rssMb: number;
      diskUsedPct: number | null;
      uptimeHours: number;
      warnings: string[];
    }>
  > {
    const warnings: string[] = [];
    let status: "ok" | "warning" | "critical" = "ok";

    // --- DB check ---
    const dbStart = Date.now();
    try {
      await probe();
    } catch (error) {
      // Unreachable DB is a genuine failure (distinct from merely slow).
      return fail({
        message: t("dbHealth.post.errors.systemAlert", {
          status: "critical",
          warnings: `DB unreachable: ${error instanceof Error ? error.message : String(error)}`,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
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
      : ((): number => {
          const total = totalmem();
          const free = freemem();
          return total > 0 ? Math.round(((total - free) / total) * 100) : 0;
        })();

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
    const diskUsedPct = await readDiskUsedPct();

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
      healthy: status !== "critical",
      status,
      dbResponseMs,
      memoryUsedPct,
      heapUsedMb,
      rssMb,
      diskUsedPct,
      uptimeHours,
      warnings,
    };

    // Only "critical" fails the task. "warning" (slow-but-alive DB, high
    // memory/disk) is a degraded-but-healthy result: success with warnings.
    if (status === "critical") {
      return fail({
        message: t("dbHealth.post.errors.systemAlert", {
          status,
          warnings: warnings.join("; "),
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    if (warnings.length > 0) {
      logger.warn(`[DbHealth] ${status}: ${warnings.join("; ")}`);
    }

    return success(result);
  }
}
