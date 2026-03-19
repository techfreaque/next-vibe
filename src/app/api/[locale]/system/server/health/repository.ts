/**
 * Server Health Check Repository
 * Provides comprehensive health monitoring and status checks
 */

import { loadavg } from "node:os";
import { performance } from "node:perf_hooks";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as dbUtilsScopedTranslation } from "../../db/utils/i18n";
import { getCurrentEnvironmentInfo } from "../environment";
import type {
  HealthCheckRequestOutput,
  HealthCheckResponseOutput,
} from "./definition";
import type { ServerHealthT } from "./i18n";

/**
 * Health Check Repository
 */
export class HealthCheckRepository {
  private static startTime = Date.now();

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

      // Basic health check
      const basicCheck = await HealthCheckRepository.performBasicCheck();
      checks.push(basicCheck);

      // Database health check
      let databaseStatus;
      if (data.includeDatabase) {
        const dbCheck = await HealthCheckRepository.performDatabaseCheck(
          logger,
          locale,
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
        const taskCheck = await HealthCheckRepository.performTaskCheck();
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
        const sysCheck = await HealthCheckRepository.performSystemCheck();
        checks.push(sysCheck);
        systemStatus = {
          memory: HealthCheckRepository.getMemoryInfo(),
          cpu: HealthCheckRepository.getCpuInfo(),
          disk: HealthCheckRepository.getDiskInfo(),
        };
      }

      // Determine overall status
      const overallStatus =
        HealthCheckRepository.determineOverallStatus(checks);

      const response: HealthCheckResponseOutput = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: Date.now() - HealthCheckRepository.startTime,
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

      return fail({
        message: t("get.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Perform basic health check
   */
  private static performBasicCheck(): Promise<{
    name: string;
    status: "pass" | "fail" | "warn";
    message?: string;
    duration?: number;
  }> {
    const start = performance.now();

    try {
      // Basic checks: process is running, memory not exhausted, etc.
      const memoryUsage = process.memoryUsage();
      const memoryUsagePercent =
        (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

      if (memoryUsagePercent > 90) {
        return Promise.resolve({
          name: "basic",
          status: "warn",
          message: `High memory usage: ${memoryUsagePercent.toFixed(1)}%`, // eslint-disable-line i18next/no-literal-string
          duration: performance.now() - start,
        });
      }

      return Promise.resolve({
        name: "basic",
        status: "pass",
        message: "Server is running normally", // eslint-disable-line i18next/no-literal-string
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
  ): Promise<{
    name: string;
    status: "pass" | "fail" | "warn";
    message?: string;
    duration?: number;
  }> {
    const start = performance.now();

    try {
      // Import database utilities
      const { DbUtilsRepository } = await import("../../db/utils/repository");

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
          message: "Database connection successful", // eslint-disable-line i18next/no-literal-string
          duration: performance.now() - start,
        };
      }
      return {
        name: "database",
        status: "fail",
        message: "Database connection failed", // eslint-disable-line i18next/no-literal-string
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
  private static performTaskCheck(): Promise<{
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
          message: "Task runner disabled in current environment", // eslint-disable-line i18next/no-literal-string
          duration: performance.now() - start,
        });
      }

      return Promise.resolve({
        name: "tasks",
        status: "pass",
        message: "Task runner is available", // eslint-disable-line i18next/no-literal-string
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
  private static performSystemCheck(): Promise<{
    name: string;
    status: "pass" | "fail" | "warn";
    message?: string;
    duration?: number;
  }> {
    const start = performance.now();

    try {
      const memoryInfo = HealthCheckRepository.getMemoryInfo();

      if (memoryInfo.percentage > 90) {
        return Promise.resolve({
          name: "system",
          status: "warn",
          message: `High memory usage: ${memoryInfo.percentage.toFixed(1)}%`, // eslint-disable-line i18next/no-literal-string
          duration: performance.now() - start,
        });
      }

      return Promise.resolve({
        name: "system",
        status: "pass",
        message: "System resources are healthy", // eslint-disable-line i18next/no-literal-string
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
    const memoryUsage = process.memoryUsage();
    return {
      used: memoryUsage.heapUsed,
      total: memoryUsage.heapTotal,
      percentage: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
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
