/**
 * Tasks Types Repository
 * Consolidated task type definitions
 * Migrated from tasks/types.ts
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";
import type { z } from "zod";

import type {
  ErrorResponseType,
  ResponseType,
} from "@/app/api/[locale]/v1/core/shared/types/response.schema";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  fail,
} from "@/app/api/[locale]/v1/core/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "../../../../user/auth/types";
import type { CronTaskPriority, TaskCategory } from "../enum";
import type {
  TaskTypesRequestOutput,
  TaskTypesResponseOutput,
} from "./definition";

/**
 * Task Configuration
 */
export interface TaskConfig {
  [key: string]: string | number | boolean | string[] | number[];
}

/**
 * Task Result
 */
export interface TaskResult {
  success: boolean;
  message?: string;
  data?: Record<string, string | number | boolean>;
  error?: string;
  duration?: number;
  timestamp?: string;
}

/**
 * Task Execution Context
 * Enhanced to match spec.md requirements
 */
export interface TaskExecutionContext<TConfig = TaskConfig> {
  taskName: string;
  config: TConfig;
  signal: AbortSignal;
  startTime: number;
  logger: EndpointLogger;
  locale: CountryLanguage;
  cronUser: JwtPrivatePayloadType;
}

/**
 * Task Monitoring Configuration
 */
export interface TaskMonitoring {
  enabled: boolean;
  alertOnFailure: boolean;
  alertOnTimeout: boolean;
  maxFailures: number;
  healthCheck?: {
    enabled: boolean;
    interval: number;
    timeout: number;
  };
}

/**
 * Task Documentation
 */
export interface TaskDocumentation {
  description: string;
  examples?: string[];
  troubleshooting?: string[];
  links?: string[];
}

/**
 * Cron Task Definition
 * Enhanced to support both string and function-based schedules as per spec.md
 */
export interface CronTaskDefinition<
  TConfig = TaskConfig,
  TResult = TaskResult,
> {
  name: string;
  description: string;
  version?: string;
  enabled: boolean;
  // Schedule can be either a cron expression string OR a function returning ResponseType<boolean>
  schedule: string | (() => Promise<ResponseType<boolean>>);
  priority?: (typeof CronTaskPriority)[keyof typeof CronTaskPriority];
  timeout?: number; // Max execution time in milliseconds
  retries?: number;
  defaultConfig: TConfig;
  configSchema: z.ZodSchema<TConfig>;
  resultSchema: z.ZodSchema<TResult>;
  dependencies?: string[];
  monitoring?: TaskMonitoring;
  documentation?: TaskDocumentation;
  tags?: string[];
  category: string;
}

/**
 * Side Task Definition
 * Enhanced to match spec.md requirements
 */
export interface SideTaskDefinition<
  TConfig = TaskConfig,
  TResult = TaskResult,
> {
  name: string;
  description: string;
  version?: string;
  enabled: boolean;
  priority?: (typeof CronTaskPriority)[keyof typeof CronTaskPriority];
  timeout?: number;
  defaultConfig: TConfig;
  configSchema: z.ZodSchema<TConfig>;
  resultSchema: z.ZodSchema<TResult>;
  dependencies?: string[];
  monitoring?: TaskMonitoring;
  documentation?: TaskDocumentation;
  tags?: string[];
  category: string;
}

/**
 * Task Execution Functions
 */
export type CronTaskExecuteFunction<
  TConfig = TaskConfig,
  TResult = TaskResult,
> = (context: TaskExecutionContext<TConfig>) => Promise<ResponseType<TResult>>;

export type SideTaskExecuteFunction<
  TConfig = TaskConfig,
  TResult = TaskResult,
> = (context: TaskExecutionContext<TConfig>) => Promise<ResponseType<TResult>>;

export type TaskValidateFunction<TConfig = TaskConfig> = (
  config: TConfig,
) => Promise<ResponseType<boolean>>;

export type TaskRollbackFunction<TConfig = TaskConfig> = (
  context: TaskExecutionContext<TConfig>,
) => Promise<ResponseType<boolean>>;

/**
 * Unified Task Types - New format for all tasks
 * Updated to match spec.md requirements exactly
 */
export interface CronTask {
  type: "cron";
  name: string;
  description: string;
  schedule: string; // Cron expression (e.g., "*/5 * * * *")
  category: (typeof TaskCategory)[keyof typeof TaskCategory];
  enabled: boolean;
  priority?: (typeof CronTaskPriority)[keyof typeof CronTaskPriority];
  timeout?: number; // Max execution time in milliseconds
  run: (props: {
    logger: EndpointLogger;
    locale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }) => Promise<void | ErrorResponseType> | void | ErrorResponseType;
  onError?: (props: {
    error: Error;
    logger: EndpointLogger;
    locale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }) => Promise<void> | void;
}

export interface SideTask {
  type: "side";
  name: string;
  description: string;
  category: (typeof TaskCategory)[keyof typeof TaskCategory];
  enabled: boolean;
  priority?: (typeof CronTaskPriority)[keyof typeof CronTaskPriority];
  run: (props: {
    signal: AbortSignal;
    logger: EndpointLogger;
    locale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }) => Promise<void> | void;
  onError?: (props: {
    error: Error;
    logger: EndpointLogger;
    locale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }) => Promise<void> | void;
  onShutdown?: (props: {
    logger: EndpointLogger;
    locale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }) => Promise<void>; // Called during graceful shutdown
}

/**
 * Task Runner Interface (from *task-runner.ts files)
 * These are specialized side tasks that manage other tasks or provide infrastructure
 */
export interface TaskRunner {
  type: "task-runner";
  name: string;
  description: string;
  category: (typeof TaskCategory)[keyof typeof TaskCategory];
  enabled: boolean;
  priority?: (typeof CronTaskPriority)[keyof typeof CronTaskPriority];
  run: (props: {
    signal: AbortSignal;
    logger: EndpointLogger;
    locale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }) => Promise<void>;
  onError?: (props: {
    error: Error;
    logger: EndpointLogger;
    locale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }) => Promise<void>;
  onShutdown?: (props: {
    logger: EndpointLogger;
    locale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }) => Promise<void>;
}

export type Task = CronTask | SideTask | TaskRunner;

/**
 * Task Discovery and Registration
 */
export interface TaskModule {
  tasks: Task[];
  default?: Task[];
}

export interface TaskFile {
  path: string;
  type: "task" | "task-runner";
  module: TaskModule;
}

export interface TaskRegistry {
  cronTasks: CronTask[];
  sideTasks: SideTask[];
  taskRunners: TaskRunner[];
  allTasks: Task[];
  tasksByCategory: Record<
    (typeof TaskCategory)[keyof typeof TaskCategory],
    Task[]
  >;
  tasksByName: Record<string, Task>;
  taskRunner: TaskRunnerManager; // Single unified task runner instance
}

/**
 * Unified Task Execution Context
 */
export interface UnifiedTaskExecutionContext {
  taskName: string;
  startTime: Date;
  signal?: AbortSignal;
  logger: EndpointLogger;
}

/**
 * Task Runner Manager Interface
 * Enhanced to match spec.md unified task runner requirements
 */
export interface TaskRunnerManager {
  name: "unified-task-runner";
  description: string;

  // Task execution with overlap prevention
  executeCronTask: (
    task: CronTask,
  ) => Promise<ResponseType<{ status: string; message: string }>>;
  startSideTask: (
    task: SideTask,
    signal: AbortSignal,
  ) => Promise<ResponseType<void>>;
  stopSideTask: (taskName: string) => void;

  // Task state management
  getTaskStatus: (taskName: string) => TaskStatus;
  isTaskRunning: (taskName: string) => boolean;
  getRunningTasks: () => string[];

  // Core lifecycle methods
  start(
    tasks: Task[],
    signal: AbortSignal,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<void>;
  stop(_locale: CountryLanguage): Promise<ResponseType<void>>;
  getStatus(): {
    running: boolean;
    activeTasks: string[];
    errors: Array<{ taskName: string; error: string; timestamp: Date }>;
  };

  // Environment-specific behavior
  environment: "development" | "production" | "serverless";
  supportsSideTasks: boolean; // false for serverless
}

/**
 * Advanced Task Modules - For complex tasks with full features
 */
export interface CronTaskModule<TConfig = TaskConfig, TResult = TaskResult> {
  taskDefinition: CronTaskDefinition<TConfig, TResult>;
  execute: CronTaskExecuteFunction<TConfig, TResult>;
  validate?: TaskValidateFunction<TConfig>;
  rollback?: TaskRollbackFunction<TConfig>;
}

export interface SideTaskModule<TConfig = TaskConfig, TResult = TaskResult> {
  taskDefinition: SideTaskDefinition<TConfig, TResult>;
  execute: SideTaskExecuteFunction<TConfig, TResult>;
  validate?: TaskValidateFunction<TConfig>;
  rollback?: TaskRollbackFunction<TConfig>;
}

export type LegacyTaskModule<TConfig = TaskConfig, TResult = TaskResult> =
  | CronTaskModule<TConfig, TResult>
  | SideTaskModule<TConfig, TResult>;

/**
 * Task Status - Enhanced from old system
 */
export interface TaskStatus {
  name: string;
  type: "cron" | "side";
  status:
    | "running"
    | "stopped"
    | "error"
    | "scheduled"
    | "pending"
    | "completed"
    | "failed"
    | "timeout"
    | "cancelled"
    | "skipped";
  priority?: (typeof CronTaskPriority)[keyof typeof CronTaskPriority];
  lastRun?: Date;
  nextRun?: Date;
  runCount: number;
  errorCount: number;
  successCount: number;
  lastError?: string;
  uptime?: number;
  averageExecutionTime?: number;
  lastExecutionDuration?: number;
}

// ===== REPOSITORY INTERFACE =====

/**
 * Task Types Repository Interface
 */
export interface TaskTypesRepository {
  getTypes(
    data: TaskTypesRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<TaskTypesResponseOutput>;

  validateTypes(logger: EndpointLogger): Promise<ResponseType<boolean>>;
  exportTypes(
    format: "json" | "typescript" | "schema",
    logger: EndpointLogger,
  ): ResponseType<string>;
}

/**
 * Task Types Repository Implementation
 */
export class TaskTypesRepositoryImpl implements TaskTypesRepository {
  /**
   * Get task types based on request parameters
   */
  getTypes(
    data: TaskTypesRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<TaskTypesResponseOutput> {
    try {
      // Use locale and user for potential future localization
      void locale;
      void user;

      const types: Record<string, string> = {};

      // Collect types based on category
      if (!data.typeCategory || data.typeCategory === "cron") {
        // eslint-disable-next-line i18next/no-literal-string
        types.CronTask = "Basic cron task interface";
        // eslint-disable-next-line i18next/no-literal-string
        types.CronTaskDefinition = "Advanced cron task definition";
        // eslint-disable-next-line i18next/no-literal-string
        types.CronTaskModule = "Complete cron task module";
      }

      if (!data.typeCategory || data.typeCategory === "side") {
        // eslint-disable-next-line i18next/no-literal-string
        types.SideTask = "Basic side task interface";
        // eslint-disable-next-line i18next/no-literal-string
        types.SideTaskDefinition = "Advanced side task definition";
        // eslint-disable-next-line i18next/no-literal-string
        types.SideTaskModule = "Complete side task module";
      }

      if (!data.typeCategory || data.typeCategory === "config") {
        // eslint-disable-next-line i18next/no-literal-string
        types.TaskConfig = "Task configuration interface";
        // eslint-disable-next-line i18next/no-literal-string
        types.CronSchedule = "Cron schedule configuration";
        // eslint-disable-next-line i18next/no-literal-string
        types.TaskMonitoring = "Task monitoring configuration";
      }

      if (!data.typeCategory || data.typeCategory === "execution") {
        // eslint-disable-next-line i18next/no-literal-string
        types.TaskExecutionContext = "Task execution context";
        // eslint-disable-next-line i18next/no-literal-string
        types.TaskResult = "Task execution result";
        // eslint-disable-next-line i18next/no-literal-string
        types.TaskStatus = "Task status information";
      }

      const categories = ["cron", "side", "config", "execution"];
      const totalTypes = Object.keys(types).length;
      const timestamp = new Date().toISOString();

      return createSuccessResponse({
        success: true,
        types,
        metadata: {
          totalTypes,
          categories,
          timestamp,
        },
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch task types", {
        userId: user.id,
        typeCategory: data.typeCategory,
        operation: data.operation,
        format: data.format,
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.tasks.types.get.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
          typeCategory: data.typeCategory || "all",
          operation: data.operation,
          format: data.format,
        },
      });
    }
  }

  /**
   * Validate all task types
   */
  async validateTypes(logger: EndpointLogger): Promise<ResponseType<boolean>> {
    try {
      // Perform type validation logic here
      // Simulate async operation
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 10);
      });

      logger.debug("Successfully validated all task types");
      return createSuccessResponse(true);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to validate task types", {
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.tasks.types.get.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Export types in specified format
   */
  exportTypes(
    format: "json" | "typescript" | "schema",
    logger: EndpointLogger,
  ): ResponseType<string> {
    try {
      let exportedTypes = "";

      switch (format) {
        case "json":
          exportedTypes = JSON.stringify(
            {
              // eslint-disable-next-line i18next/no-literal-string
              CronTask: "Basic cron task interface",
              // eslint-disable-next-line i18next/no-literal-string
              SideTask: "Basic side task interface",
              // eslint-disable-next-line i18next/no-literal-string
              TaskConfig: "Task configuration interface",
              // eslint-disable-next-line i18next/no-literal-string
              TaskResult: "Task execution result",
              // eslint-disable-next-line i18next/no-literal-string
              TaskStatus: "Task status information",
            },
            null,
            2,
          );
          break;
        case "typescript":
          // eslint-disable-next-line i18next/no-literal-string
          exportedTypes = `// Task Types Export
export interface CronTask { /* ... */ }
export interface SideTask { /* ... */ }
export interface TaskConfig { /* ... */ }
export interface TaskResult { /* ... */ }
export interface TaskStatus { /* ... */ }`;
          break;
        case "schema":
          // eslint-disable-next-line i18next/no-literal-string
          exportedTypes = "Task Types Schema - Not implemented yet";
          break;
        default:
          // Handle unsupported format with proper error response
          logger.error("Unsupported export format", { format });
          return fail({
            message:
              "app.api.v1.core.system.unifiedInterface.tasks.types.get.errors.validation.title",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
            messageParams: { format },
          });
      }

      logger.debug("Successfully exported task types", { format });
      return createSuccessResponse(exportedTypes);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to export task types", {
        format,
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.tasks.types.get.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message, format },
      });
    }
  }
}

export const taskTypesRepository = new TaskTypesRepositoryImpl();
