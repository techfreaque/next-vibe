/**
 * Tasks Types Repository
 * Consolidated task type definitions
 */

import "server-only";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type {
  GenericHandlerBase,
  GenericHandlerReturnType,
} from "next-vibe/core/route/handler";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type {
  CronTaskPriority,
  TaskCategory,
  TaskOutputMode,
} from "next-vibe/tasks/enum";

/**
 * Derives the taskInput type for a cron task from its endpoint types.
 * When both RequestOutput and UrlVariablesOutput are never (no-input endpoints),
 * taskInput accepts undefined. Otherwise it accepts partial merged args.
 */
type CronTaskInput<T extends CreateApiEndpointAny> = [
  T["types"]["RequestOutput"],
] extends [never]
  ? [T["types"]["UrlVariablesOutput"]] extends [never]
    ? undefined
    : T["types"]["UrlVariablesOutput"]
  : [T["types"]["UrlVariablesOutput"]] extends [never]
    ? T["types"]["RequestOutput"] extends never
      ? undefined
      : T["types"]["RequestOutput"]
    : T["types"]["RequestOutput"] & T["types"]["UrlVariablesOutput"];

/** Notification target for outputMode notifications */
export interface NotificationTarget {
  type: "email" | "sms" | "webhook";
  target: string;
}

// ─── Core Task Types ─────────────────────────────────────────────────────────

/**
 * Type-erased CronTask for heterogeneous collections (registries, arrays).
 * Uses GenericHandlerBase so tasks with different endpoint types can coexist.
 */
export interface CronTaskAny {
  type: "cron";
  /** Stable human-readable task identity (e.g. "db-health"). Distinct from routeId (the endpoint to call). */
  id: string;
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
  taskInput?: Record<string, WidgetData>;
  /** When true, task disables itself after first execution (success or failure) */
  runOnce?: boolean;
  /** Minimum interval (ms) between successful history records. null/undefined = log every run. Always logs errors. */
  historyInterval?: number;
  /** When true, task is hidden from AI system prompt and default task list views (boring system maintenance) */
  hidden?: boolean;
}

/**
 * Task Runner - long-running background process with graceful shutdown support.
 */
export interface TaskRunner<TScopedTranslationKey extends string> {
  type: "task-runner";
  name: TScopedTranslationKey;
  description: TScopedTranslationKey;
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
    skipTanstack: boolean;
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
export type Task = CronTaskAny | TaskRunner<string>;

// ─── Factory Functions ───────────────────────────────────────────────────────

/**
 * Create a type-safe cron task - types are fully inferred from definition + route.
 * Returns Task (erased) for collection compatibility.
 *
 * Usage: `createCronTask(definitions.POST, tools.POST, { name: "...", ... })`
 */
export function createCronTask<const T extends CreateApiEndpointAny>(
  definition: T,
  route: GenericHandlerReturnType<T>,
  config: {
    /** Stable human-readable task identity (e.g. "db-health"). Must be unique across all tasks. */
    id: string;
    name: T["types"]["ScopedTranslationKey"];
    description: T["types"]["ScopedTranslationKey"];
    schedule: string;
    category: (typeof TaskCategory)[keyof typeof TaskCategory];
    enabled: boolean;
    priority?: (typeof CronTaskPriority)[keyof typeof CronTaskPriority];
    timeout?: number;
    outputMode?: (typeof TaskOutputMode)[keyof typeof TaskOutputMode];
    /**
     * Flat merged default args - body fields + URL path params in one object.
     * Types are fully inferred from the endpoint definition.
     * splitTaskArgs() splits them by schema at execution time.
     */
    // required - type inferred from endpoint; undefined for no-input endpoints
    taskInput: CronTaskInput<T>;
    /** When true, task disables itself after first execution (success or failure) */
    runOnce?: boolean;
    /** Minimum interval (ms) between successful history records. null/undefined = log every run. Always logs errors. */
    historyInterval?: number;
    /** When true, task is hidden from AI system prompt and default task list views (boring system maintenance) */
    hidden?: boolean;
  },
): CronTaskAny {
  return {
    type: "cron" as const,
    definition,
    route: route as GenericHandlerBase,
    ...config,
    taskInput: config.taskInput,
  };
}

// ─── Registry & Discovery ────────────────────────────────────────────────────

export interface TaskRegistry {
  cronTasks: CronTaskAny[];
  taskRunners: TaskRunner<string>[];
  allTasks: Task[];
  tasksByCategory: Record<
    (typeof TaskCategory)[keyof typeof TaskCategory],
    Task[]
  >;
  tasksByName: Record<string, Task>;
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
