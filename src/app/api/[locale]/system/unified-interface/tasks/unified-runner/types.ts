/**
 * Tasks Types Repository
 * Consolidated task type definitions
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import type { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPrivatePayloadType } from "../../../../user/auth/types";
import type {
  AiAgentThreadMode,
  CronStepType,
  CronTaskPriority,
  TaskCategory,
  TaskOutputMode,
} from "../enum";

/**
 * JSON-serializable scalar value
 */
export type TaskConfigValue =
  | string
  | number
  | boolean
  | null
  | TaskConfigValue[]
  | { [key: string]: TaskConfigValue };

/**
 * Task Configuration
 */
export interface TaskConfig {
  [key: string]: TaskConfigValue;
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

// ─── Cron Steps Types ─────────────────────────────────────────────────────────

/** A pre-seeded tool call for ai_agent steps */
export interface PreSeededToolCall {
  toolId: string;
  args: Record<string, TaskConfigValue>;
  /** Static value or "$step_N_result" template reference */
  result: TaskConfigValue;
}

/** A "call" step — invokes a route or task handler by routeId */
export interface CronCallStep {
  type: (typeof CronStepType)[keyof typeof CronStepType];
  /** Endpoint alias, full path, or task name — resolved via resolveRouteId() */
  routeId: string;
  args: Record<string, TaskConfigValue>;
  parallel?: boolean;
}

/** An "ai_agent" step — runs an AI agent with optional pre-seeded tool calls */
export interface CronAiAgentStep {
  type: (typeof CronStepType)[keyof typeof CronStepType];
  model: string;
  character: string;
  prompt: string;
  preSeededToolCalls?: PreSeededToolCall[];
  /** Optional whitelist of tool routeIds; defaults to all owner-accessible tools */
  availableTools?: string[];
  maxTurns?: number;
  threadMode: (typeof AiAgentThreadMode)[keyof typeof AiAgentThreadMode];
  /** For "append" mode — the thread to continue */
  threadId?: string;
  /** For "new" mode — folder to place the thread in */
  folderId?: string;
  /** After first run, stores threadId and switches to "append" mode */
  autoAppendAfterFirst?: boolean;
}

export type CronStep = CronCallStep | CronAiAgentStep;

/** Config for "cron-steps" routeId tasks */
export interface CronStepsConfig {
  steps: CronStep[];
}

/** Notification target for outputMode notifications */
export interface NotificationTarget {
  type: "email" | "sms" | "webhook";
  target: string;
}

/** Result of a single step execution */
export interface StepResult {
  stepIndex: number;
  stepType: string;
  success: boolean;
  result?: CronTaskRunResult | null;
  error?: string;
  durationMs?: number;
  threadId?: string;
  tokenCount?: number;
}

// ─── Route Resolution ─────────────────────────────────────────────────────────

export type ResolveRouteIdResult =
  | { kind: "endpoint"; path: string }
  | { kind: "steps" }
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

/**
 * Cron Task — scheduled task driven by the pulse runner.
 * Pure metadata object: the pulse runner dispatches execution to the route
 * identified by `routeId`, passing `defaultConfig` as the request data.
 */
export interface CronTask {
  type: "cron";
  /** Unique task identifier — stored in DB and used for scheduling */
  name: string;
  /** Route to invoke when this task fires. Resolved via resolveRouteId(). */
  routeId: string;
  description: string;
  schedule: string;
  category: (typeof TaskCategory)[keyof typeof TaskCategory];
  enabled: boolean;
  priority?: (typeof CronTaskPriority)[keyof typeof CronTaskPriority];
  timeout?: number;
  /** Output notification mode */
  outputMode?: (typeof TaskOutputMode)[keyof typeof TaskOutputMode];
  /** Default request data passed to the route handler on each execution */
  defaultConfig?: TaskConfig;
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
