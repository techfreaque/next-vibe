/**
 * Tasks Types Repository
 * Consolidated task type definitions
 */

import "server-only";

import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import type { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPrivatePayloadType } from "../../../../user/auth/types";
import type { CronTaskPriority, TaskCategory } from "../enum";

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
 * Cron Task Definition (advanced module format)
 */
export interface CronTaskDefinition<
  TConfig = TaskConfig,
  TResult = TaskResult,
> {
  name: string;
  description: string;
  version?: string;
  enabled: boolean;
  schedule: string | (() => Promise<ResponseType<boolean>>);
  priority?: (typeof CronTaskPriority)[keyof typeof CronTaskPriority];
  timeout?: number;
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
 * Task Execution Functions
 */
export type CronTaskExecuteFunction<
  TConfig = TaskConfig,
  TResult = TaskResult,
> = (context: TaskExecutionContext<TConfig>) => Promise<ResponseType<TResult>>;

export type TaskValidateFunction<TConfig = TaskConfig> = (
  config: TConfig,
) => Promise<ResponseType<boolean>>;

export type TaskRollbackFunction<TConfig = TaskConfig> = (
  context: TaskExecutionContext<TConfig>,
) => Promise<ResponseType<boolean>>;

/** Structured result data returned by a cron task's run() function */
export interface CronTaskRunResult {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | Date
    | CronTaskRunResult
    | Array<string | number | boolean | null | Date | CronTaskRunResult>;
}

/**
 * Cron Task — scheduled task driven by the pulse runner
 */
export interface CronTask {
  type: "cron";
  name: string;
  description: string;
  schedule: string;
  category: (typeof TaskCategory)[keyof typeof TaskCategory];
  enabled: boolean;
  priority?: (typeof CronTaskPriority)[keyof typeof CronTaskPriority];
  timeout?: number;
  run: (props: {
    logger: EndpointLogger;
    locale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }) =>
    | Promise<void | ErrorResponseType | ResponseType<CronTaskRunResult>>
    | void
    | ErrorResponseType
    | ResponseType<CronTaskRunResult>;
  onError?: (props: {
    error: Error;
    logger: EndpointLogger;
    locale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }) => Promise<void> | void;
}

/**
 * Task Runner — long-running background process with graceful shutdown support.
 * Used for infrastructure runners (pulse, dev-watcher, db-health) and any persistent background work.
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
  }) => Promise<void>;
}

export type Task = CronTask | TaskRunner;

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
  taskRunners: TaskRunner[];
  allTasks: Task[];
  tasksByCategory: Record<
    (typeof TaskCategory)[keyof typeof TaskCategory],
    Task[]
  >;
  tasksByName: Record<string, Task>;
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
 * Advanced Cron Task Module format
 */
export interface CronTaskModule<TConfig = TaskConfig, TResult = TaskResult> {
  taskDefinition: CronTaskDefinition<TConfig, TResult>;
  execute: CronTaskExecuteFunction<TConfig, TResult>;
  validate?: TaskValidateFunction<TConfig>;
  rollback?: TaskRollbackFunction<TConfig>;
}

/**
 * Task Status
 */
export interface TaskStatus {
  name: string;
  type: "cron" | "task-runner";
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
