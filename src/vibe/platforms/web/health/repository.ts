/**
 * Server Health Check Repository
 * Provides comprehensive health monitoring and status checks
 */

import { readFile } from "node:fs/promises";
import { freemem, loadavg, totalmem } from "node:os";
import { performance } from "node:perf_hooks";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import { toIntlLocale } from "../../../core/i18n/core/language-utils";
import type { ResponseType } from "../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../core/route/response.schema";
import { parseError } from "../../../core/utils/parse-error";
import { readProcMeminfo } from "../../../database/health/repository";
import { scopedTranslation as dbUtilsScopedTranslation } from "../../../database/utils/i18n";
import type { EndpointLogger } from "../../../logger/types";
import { getCurrentEnvironmentInfo } from "../environment";
import { healthRevisionSchema } from "./constants";
import type {
  HealthCheckRequestOutput,
  HealthCheckResponseOutput,
} from "./definition";
import type { ServerHealthT } from "./i18n";

/**
 * Health Check Repository
 */
export class HealthCheckRepository {
  static async checkHealth(
    data: HealthCheckRequestOutput,
    logger: EndpointLogger,
    t: ServerHealthT,
    locale: CountryLanguage,
  ): Promise<ResponseType<HealthCheckResponseOutput>> {
    const checkStart = performance.now();
    const checks: Array<{
      name: string;
      status: "pass" | "fail" | "warn";
      message?: string;
      duration?: number;
    }> = [];

    try {
      logger.info("Performing health check", {
        detailed: data.detailed,
        includeDatabase: data.includeDatabase,
        includeTasks: data.includeTasks,
        includeSystem: data.includeSystem,
      });

      // Get environment information
      const envInfo = getCurrentEnvironmentInfo();
      const memoryInfo = HealthCheckRepository.getMemoryInfo();
      const formatPercent = new Intl.NumberFormat(toIntlLocale(locale), {
        style: "percent",
        maximumFractionDigits: 1,
      });
      const memoryUsage = formatPercent.format(memoryInfo.percentage / 100);

      // Graceful-shutdown drain: once SIGTERM has started draining in-flight AI
      // streams, report the node UNHEALTHY so a health-checking load balancer
      // (Caddy reverse_proxy health_uri) stops routing NEW requests here while
      // existing streams finish. This is the belt-and-suspenders signal that
      // complements the rolling-deploy script's explicit LB deregistration.
      const drainCheck = await HealthCheckRepository.performDrainCheck(t);
      checks.push(drainCheck);

      // Basic health check
      const basicCheck = await HealthCheckRepository.performBasicCheck(
        t,
        memoryInfo.percentage > 90,
        memoryUsage,
      );
      checks.push(basicCheck);

      // Database health check
      let databaseStatus;
      if (data.includeDatabase) {
        const dbCheck = await HealthCheckRepository.performDatabaseCheck(
          logger,
          locale,
          t,
        );
        checks.push(dbCheck);
        databaseStatus = {
          status:
            dbCheck.status === "pass"
              ? ("connected" as const)
              : dbCheck.status === "warn"
                ? ("unknown" as const)
                : ("error" as const),
          responseTime: dbCheck.duration,
          error: dbCheck.status === "fail" ? dbCheck.message : undefined,
        };
      }

      // Task runner health check
      let tasksStatus;
      if (data.includeTasks) {
        const taskCheck = await HealthCheckRepository.performTaskCheck(t);
        checks.push(taskCheck);
        tasksStatus = {
          runnerStatus:
            taskCheck.status === "pass"
              ? ("running" as const)
              : taskCheck.status === "warn"
                ? ("unknown" as const)
                : ("error" as const),
          activeTasks: 0, // Would be populated from actual task runner
          totalTasks: 0, // Would be populated from task registry
          errors: 0, // Would be populated from task runner
          lastError:
            taskCheck.status === "fail" ? taskCheck.message : undefined,
        };
      }

      // System health check
      let systemStatus;
      if (data.includeSystem) {
        const sysCheck = await HealthCheckRepository.performSystemCheck(
          t,
          memoryInfo.percentage > 90,
          memoryUsage,
        );
        checks.push(sysCheck);
        systemStatus = {
          memory: memoryInfo,
          cpu: HealthCheckRepository.getCpuInfo(),
          disk: HealthCheckRepository.getDiskInfo(),
        };
      }

      // Determine overall status
      const overallStatus =
        HealthCheckRepository.determineOverallStatus(checks);

      const imageRevision = await readFile(
        ".vibe-image-revision",
        "utf8",
      ).catch(() => undefined);
      const revision = healthRevisionSchema.safeParse(
        imageRevision?.trim(),
      ).data;
      const response: HealthCheckResponseOutput = {
        status: overallStatus,
        timestamp: new Date(),
        uptime: process.uptime() * 1000,
        revision,
        environment: {
          name: envInfo.environment,
          nodeEnv: envInfo.nodeEnv,
          platform: envInfo.platform.name,
          supportsTaskRunners: envInfo.config.supportsTaskRunners,
        },
        database: databaseStatus || {
          status: "unknown" as const,
          responseTime: undefined,
          error: undefined,
        },
        tasks: tasksStatus || {
          runnerStatus: "unknown" as const,
          activeTasks: 0,
          totalTasks: 0,
          errors: 0,
          lastError: undefined,
        },
        system: systemStatus || {
          memory: { used: 0, total: 0, percentage: 0 },
          cpu: { usage: 0, loadAverage: [0, 0, 0] },
          disk: { available: 0, total: 0, percentage: 0 },
        },
        checks,
      };

      const duration = performance.now() - checkStart;
      logger.info("Health check completed", {
        status: overallStatus,
        duration: `${duration.toFixed(2)}ms`,
        checksPerformed: checks.length,
      });

      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Health check failed", { error: parsedError.message });

      // `get.errors.server.title` is the definition's declared SERVER_ERROR
      // label and renders param-free there, so the cause gets its own key.
      return fail({
        message: t("get.errors.server.checkFailed", {
          error: parsedError.message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Drain check — fails (status "fail" ⇒ overall "critical") once the process
   * has begun graceful shutdown, so a health-checking LB deregisters this node.
   * Also reports the in-flight AI-stream count for observability.
   */
  private static async performDrainCheck(t: ServerHealthT): Promise<{
    name: string;
    status: "pass" | "fail" | "warn";
    message?: string;
    duration?: number;
  }> {
    const start = performance.now();
    try {
      const { isDraining, activeLoopCount } =
        await import("../../../agent/ai-stream/repository/loop/active-loops");
      if (isDraining()) {
        return {
          name: "drain",
          status: "fail",
          message: t("get.widget.messages.draining", {
            count: activeLoopCount(),
          }),
          duration: performance.now() - start,
        };
      }
      return {
        name: "drain",
        status: "pass",
        message: t("get.widget.messages.accepting", {
          count: activeLoopCount(),
        }),
        duration: performance.now() - start,
      };
    } catch (error) {
      // Never fail health over an inability to read the drain flag.
      return {
        name: "drain",
        status: "pass",
        message: parseError(error).message,
        duration: performance.now() - start,
      };
    }
  }

  /**
   * Perform basic health check
   */
  private static performBasicCheck(
    t: ServerHealthT,
    memoryPressure: boolean,
    memoryUsage: string,
  ): Promise<{
    name: string;
    status: "pass" | "fail" | "warn";
    message?: string;
    duration?: number;
  }> {
    const start = performance.now();

    try {
      if (memoryPressure) {
        return Promise.resolve({
          name: "basic",
          status: "warn",
          message: t("get.widget.messages.memory", { usage: memoryUsage }),
          duration: performance.now() - start,
        });
      }

      return Promise.resolve({
        name: "basic",
        status: "pass",
        message: t("get.widget.messages.processOk"),
        duration: performance.now() - start,
      });
    } catch (error) {
      return Promise.resolve({
        name: "basic",
        status: "fail",
        message: parseError(error).message,
        duration: performance.now() - start,
      });
    }
  }

  /**
   * Perform database health check
   */
  private static async performDatabaseCheck(
    logger: EndpointLogger,
    locale: CountryLanguage,
    t: ServerHealthT,
  ): Promise<{
    name: string;
    status: "pass" | "fail" | "warn";
    message?: string;
    duration?: number;
  }> {
    const start = performance.now();

    try {
      // Import database utilities
      const { DbUtilsRepository } =
        await import("../../../database/utils/repository");

      // Test database connection
      const { t: dbUtilsT } = dbUtilsScopedTranslation.scopedT(locale);
      const connectionResult = await DbUtilsRepository.testConnection(
        dbUtilsT,
        logger,
      );

      if (connectionResult.success && connectionResult.data) {
        return {
          name: "database",
          status: "pass",
          message: t("get.widget.messages.databaseOk"),
          duration: performance.now() - start,
        };
      }
      return {
        name: "database",
        status: "fail",
        message: t("get.widget.messages.databaseFailed"),
        duration: performance.now() - start,
      };
    } catch (error) {
      return {
        name: "database",
        status: "fail",
        message: parseError(error).message,
        duration: performance.now() - start,
      };
    }
  }

  /**
   * Perform task runner health check
   */
  private static performTaskCheck(t: ServerHealthT): Promise<{
    name: string;
    status: "pass" | "fail" | "warn";
    message?: string;
    duration?: number;
  }> {
    const start = performance.now();

    try {
      // Check if task runner is available and running
      // This would integrate with the actual task runner status
      const envInfo = getCurrentEnvironmentInfo();

      if (!envInfo.config.enableTaskRunner) {
        return Promise.resolve({
          name: "tasks",
          status: "warn",
          message: t("get.widget.messages.tasksDisabled"),
          duration: performance.now() - start,
        });
      }

      return Promise.resolve({
        name: "tasks",
        status: "pass",
        message: t("get.widget.messages.tasksOk"),
        duration: performance.now() - start,
      });
    } catch (error) {
      return Promise.resolve({
        name: "tasks",
        status: "fail",
        message: parseError(error).message,
        duration: performance.now() - start,
      });
    }
  }

  /**
   * Perform system health check
   */
  private static performSystemCheck(
    t: ServerHealthT,
    memoryPressure: boolean,
    memoryUsage: string,
  ): Promise<{
    name: string;
    status: "pass" | "fail" | "warn";
    message?: string;
    duration?: number;
  }> {
    const start = performance.now();

    try {
      if (memoryPressure) {
        return Promise.resolve({
          name: "system",
          status: "warn",
          message: t("get.widget.messages.memory", { usage: memoryUsage }),
          duration: performance.now() - start,
        });
      }

      return Promise.resolve({
        name: "system",
        status: "pass",
        message: t("get.widget.messages.systemOk"),
        duration: performance.now() - start,
      });
    } catch (error) {
      return Promise.resolve({
        name: "system",
        status: "fail",
        message: parseError(error).message,
        duration: performance.now() - start,
      });
    }
  }

  /**
   * Get memory information
   */
  private static getMemoryInfo(): {
    used: number;
    total: number;
    percentage: number;
  } {
    const procMem = readProcMeminfo();
    const total = procMem ? procMem.totalKb * 1024 : totalmem();
    const available = procMem ? procMem.availableKb * 1024 : freemem();
    const used = Math.max(0, total - available);
    return {
      used,
      total,
      percentage: total > 0 ? (used / total) * 100 : 0,
    };
  }

  /**
   * Get CPU information
   */
  private static getCpuInfo(): { usage: number; loadAverage: number[] } {
    const loadAverageValues =
      process.platform === "win32" ? [0, 0, 0] : loadavg();
    return {
      usage: 0, // Would require additional implementation to get actual CPU usage
      loadAverage: loadAverageValues,
    };
  }

  /**
   * Get disk information
   */
  private static getDiskInfo(): {
    available: number;
    total: number;
    percentage: number;
  } {
    // This is a simplified implementation
    // In a real scenario, you'd use fs.statSync or similar to get actual disk usage
    const mockTotal = 1000000000000; // 1TB
    const mockUsed = 500000000000; // 500GB
    const mockAvailable = mockTotal - mockUsed;

    return {
      available: mockAvailable,
      total: mockTotal,
      percentage: (mockUsed / mockTotal) * 100,
    };
  }

  /**
   * Determine overall status from individual checks
   */
  private static determineOverallStatus(
    checks: Array<{ status: "pass" | "fail" | "warn" }>,
  ): "healthy" | "warning" | "critical" | "unknown" {
    const hasFailures = checks.some((check) => check.status === "fail");
    const hasWarnings = checks.some((check) => check.status === "warn");

    if (hasFailures) {
      return "critical";
    } else if (hasWarnings) {
      return "warning";
    } else if (checks.length > 0) {
      return "healthy";
    }
    return "unknown";
  }
}
