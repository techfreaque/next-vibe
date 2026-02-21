/**
 * Tasks Types Repository
 * Consolidated task type definitions
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import type { z } from "zod";

import type {
  GenericHandlerBase,
  GenericHandlerReturnType,
} from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPrivatePayloadType } from "../../../../user/auth/types";
import type { CronTaskPriority, TaskCategory, TaskOutputMode } from "../enum";

/** JSON-serializable value */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

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
export interface TaskExecutionContext<TConfig> {
  taskName: string;
  config: TConfig;
  signal: AbortSignal;
  startTime: number;
  logger: EndpointLogger;
  /** Fallback locale for the task runner process (e.g. "en-GLOBAL") */
  systemLocale: CountryLanguage;
  /** The locale of the user who owns this task; falls back to systemLocale when no real user */
  userLocale: CountryLanguage;
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
export interface CronTaskDefinition<TConfig, TResult> {
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
export type CronTaskExecuteFunction<TConfig, TResult> = (
  context: TaskExecutionContext<TConfig>,
) => Promise<ResponseType<TResult>>;

export type TaskValidateFunction<TConfig> = (
  config: TConfig,
) => Promise<ResponseType<boolean>>;

export type TaskRollbackFunction<TConfig> = (
  context: TaskExecutionContext<TConfig>,
) => Promise<ResponseType<boolean>>;

/** Notification target for outputMode notifications */
export interface NotificationTarget {
  type: "email" | "sms" | "webhook";
  target: string;
}

// ─── Route Resolution ─────────────────────────────────────────────────────────

export type ResolveRouteIdResult =
  | { kind: "endpoint"; path: string }
  | { kind: "unknown" };

/** Structured result data returned by a cron task run */
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

// ─── Core Task Types ─────────────────────────────────────────────────────────

/**
 * Cron Task — fully generic, inferred from endpoint definition.
 * Not used directly — use `createCronTask()` factory instead.
 *
 * `taskInput` is a flat merge of all default inputs (body + urlPathParams).
 * At execution time, `splitTaskArgs()` splits them by schema into
 * `{ data, urlPathParams }` — no need to track them separately at type level.
 */
export interface CronTask<TEndpointDefinition extends CreateApiEndpointAny> {
  type: "cron";
  name: string;
  definition: TEndpointDefinition;
  route: GenericHandlerReturnType<
    TEndpointDefinition["types"]["RequestOutput"],
    TEndpointDefinition["types"]["ResponseOutput"],
    TEndpointDefinition["types"]["UrlVariablesOutput"],
    TEndpointDefinition["allowedRoles"]
  >;
  description: string;
  schedule: string;
  category: (typeof TaskCategory)[keyof typeof TaskCategory];
  enabled: boolean;
  priority?: (typeof CronTaskPriority)[keyof typeof CronTaskPriority];
  timeout?: number;
  outputMode?: (typeof TaskOutputMode)[keyof typeof TaskOutputMode];
  /**
   * Flat merged default args (body data + urlPathParams combined).
   * splitTaskArgs() splits these by schema at execution time.
   */
  taskInput?: Partial<TEndpointDefinition["types"]["RequestOutput"]> &
    Partial<TEndpointDefinition["types"]["UrlVariablesOutput"]>;
  /** When true, task disables itself after first execution (success or failure) */
  runOnce?: boolean;
}

/**
 * Type-erased CronTask for heterogeneous collections (registries, arrays).
 * Uses GenericHandlerBase so tasks with different endpoint types can coexist.
 */
export interface CronTaskAny {
  type: "cron";
  name: string;
  definition: CreateApiEndpointAny;
  route: GenericHandlerBase;
  description: string;
  schedule: string;
  category: (typeof TaskCategory)[keyof typeof TaskCategory];
  enabled: boolean;
  priority?: (typeof CronTaskPriority)[keyof typeof CronTaskPriority];
  timeout?: number;
  outputMode?: (typeof TaskOutputMode)[keyof typeof TaskOutputMode];
  /**
   * Flat merged default args (body data + urlPathParams combined).
   * splitTaskArgs() splits these by schema at execution time.
   */
  taskInput?: Record<string, JsonValue>;
  /** When true, task disables itself after first execution (success or failure) */
  runOnce?: boolean;
}

/**
 * Task Runner — long-running background process with graceful shutdown support.
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
    /** Fallback locale for the task runner process */
    systemLocale: CountryLanguage;
    /** The locale of the user who owns this runner; equals systemLocale for system runners */
    userLocale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }) => Promise<void> | void;
  onError?: (props: {
    error: Error;
    logger: EndpointLogger;
    systemLocale: CountryLanguage;
    userLocale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }) => Promise<void> | void;
  onShutdown?: (props: {
    logger: EndpointLogger;
    systemLocale: CountryLanguage;
    userLocale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }) => Promise<void>;
}

/** Union type for heterogeneous task collections */
export type Task = CronTaskAny | TaskRunner;

// ─── Factory Functions ───────────────────────────────────────────────────────

/**
 * Create a type-safe cron task — types are fully inferred from definition + route.
 * Returns Task (erased) for collection compatibility.
 *
 * Usage: `createCronTask(definitions.POST, tools.POST, { name: "...", ... })`
 */
export function createCronTask<T extends CreateApiEndpointAny>(
  definition: T,
  route: GenericHandlerReturnType<
    T["types"]["RequestOutput"],
    T["types"]["ResponseOutput"],
    T["types"]["UrlVariablesOutput"],
    T["allowedRoles"]
  >,
  config: {
    name: string;
    description: string;
    schedule: string;
    category: (typeof TaskCategory)[keyof typeof TaskCategory];
    enabled: boolean;
    priority?: (typeof CronTaskPriority)[keyof typeof CronTaskPriority];
    timeout?: number;
    outputMode?: (typeof TaskOutputMode)[keyof typeof TaskOutputMode];
    /**
     * Flat merged default args — body fields + URL path params in one object.
     * Types are fully inferred from the endpoint definition.
     * splitTaskArgs() splits them by schema at execution time.
     */
    taskInput?: Partial<T["types"]["RequestOutput"]> &
      Partial<T["types"]["UrlVariablesOutput"]>;
    /** When true, task disables itself after first execution (success or failure) */
    runOnce?: boolean;
  },
): CronTaskAny {
  return {
    type: "cron" as const,
    definition,
    route: route as GenericHandlerBase,
    ...config,
    taskInput: config.taskInput as Record<string, JsonValue> | undefined,
  };
}

/**
 * Create a task runner — long-running background process.
 *
 * Usage: `createTaskRunner({ name: "pulse", run: async ({ signal }) => { ... } })`
 */
export function createTaskRunner(config: Omit<TaskRunner, "type">): TaskRunner {
  return {
    type: "task-runner",
    ...config,
  };
}

// ─── Registry & Discovery ────────────────────────────────────────────────────

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
  cronTasks: CronTaskAny[];
  taskRunners: TaskRunner[];
  allTasks: Task[];
  tasksByCategory: Record<
    (typeof TaskCategory)[keyof typeof TaskCategory],
    Task[]
  >;
  tasksByName: Record<string, Task>;
}

export interface UnifiedTaskExecutionContext {
  taskName: string;
  startTime: Date;
  signal?: AbortSignal;
  logger: EndpointLogger;
}

/**
 * Advanced Cron Task Module format
 */
export interface CronTaskModule<TConfig, TResult> {
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
