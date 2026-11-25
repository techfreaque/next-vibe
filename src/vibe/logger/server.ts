/**
 * Server-side Logger
 * Wraps logger-core and injects file logging + DB persistence.
 * Import this in all server code: repositories, route handlers, cron tasks, etc.
 */

import "server-only";

import { hostname } from "node:os";

import type { CountryLanguage } from "../core/i18n/core/config";
import { createLogger } from "./create-logger";
import { persistErrorLog } from "./db-persist";
import { serverFileLog } from "./file";
import { resolveLogTarget } from "./log-target";
import type { EndpointLogger } from "./types";

/** Per-request context stamped on every persisted/file log row. */
export interface ServerLogContext {
  /** Correlation id from the client's x-request-id header (or minted here). */
  requestId: string;
}

/**
 * Per-request metadata keys that must not split one recurring server error
 * into one error_logs row per request (the row still stores the latest).
 */
export const SERVER_LOG_FINGERPRINT_IGNORE_KEYS: ReadonlySet<string> = new Set([
  "requestId",
  "remoteRequestId",
  "node",
  // Per-occurrence measurements and snapshots. Each value is unique, so in
  // the fingerprint they turned every "[EventLoop] Elevated lag" and every
  // boot-time "[Proxy] Server not ready" into its own row (2026-11-15: ~45 of
  // 103 active rows). The row keeps the latest values; occurrences count up.
  "uptime",
  "maxMs",
  "meanMs",
  "stallMs",
  "stallStartedAt",
  "stallEndedAt",
  "stallTaskOverlaps",
  "tickerSamples",
  "maxTickerDelayMs",
  "tickerCaptureThresholdMs",
  "lagWindowStartedAt",
  "lagWindowEndedAt",
  "stallThreadCpuMs",
  "schedulerSampleIntervalMs",
  "windowCpuPressure",
  "stallRunQueueMs",
  "heapMb",
  "heapUsedMb",
  "prevHeapMb",
  "rssMb",
  "recentRequests",
  "taskTimings",
  "wsActivity",
  "recent",
  "elapsedMs",
  "durationMs",
  "lastUpstreamOkMsAgo",
  // "[WS] Closed idle socket" / "Socket dropped": per-socket measurements.
  "connectedForMs",
  "sinceLastInboundMs",
  "pongCount",
  "lastPongAgeMs",
  "lastInboundFrame",
  "idleTimeoutMs",
  "channelCount",
  "cpuUserMs",
  "cpuSystemMs",
  "loadAvg1m",
  // Per-request usage figures ("[AI Stream] Upstream cost missing for cut-off
  // step"): one row per model + abort reason, not one per stopped message.
  "messageId",
  "promptTokens",
  "completionTokens",
  "imageOutputTokens",
  "modelCreditCost",
  // 2026-11-18 triage: more per-occurrence values that split one class into
  // hundreds of rows (event-loop profiler snapshots, per-call tool args and
  // token counts, supervisor restart counters).
  "hotStacks",
  "hotFrames",
  "hotNative",
  "gcSamples",
  "totalSamples",
  "windowSampleCount",
  "sampledSpanMs",
  "proxyElapsedMs",
  "deadlineFired",
  "timeoutProgress",
  "promptToolHistory",
  "initialPromptToolHistory",
  "promptStep",
  "streamFailureEvidence",
  "markupBoundary",
  "mediaSource",
  "visionAttempt",
  "fallbackToolOffer",
  "markupBodyKind",
  "hasJsonNameField",
  "hasJsonArgumentsField",
  "earliestStreakStartMs",
  "latestStreakEndMs",
  "profiledHotFrames",
  "profileWindowStartedAt",
  "profileWindowEndedAt",
  "pgResultDecodes",
  "largePgDispatches",
  "poolCheckouts",
  "poolWaiting",
  "bridgeInputSize",
  "phases",
  "streakMs",
  "fsReads",
  "fsWrites",
  "majorFaults",
  "minorFaults",
  "involuntarySwitches",
  "runningTasks",
  "args",
  "totalTokens",
  "inputTokens",
  "budgetNextInputTokens",
  "budgetCutStage",
  "outputTokens",
  "reasoningTokens",
  "cachedInputTokens",
  "partialOutputChars",
  "providerNativeFinishReason",
  "providerErrorPartReceived",
  "fallbackUsd",
  "creditCost",
  "creditCostBeforeMarkupWaiver",
  "accountAgeDays",
  "restartCount",
  "nextDownForS",
  // "[WS] Subscribe denied" / lead cookie rows: per-visitor identities
  "socketUid",
  "requestedUid",
  "invalidLeadId",
  // Additional evidence for existing error fingerprints.
  "originRelation",
  "hasCsrfHeader",
  "toolNameWasNormalized",
  "capabilitySnapshot",
  "parentLookup",
  "repairedLength",
  "parserStage",
  "parserFailureKind",
  "upstreamResponseKind",
  "imageTransportCounts",
  "upstreamCostEvidence",
  "dispatchedArgsShape",
  "balanceEvidence",
  "providerStepEvidence",
  "nanoGptCostEvidence",
  "maxSchedulerSampleMs",
  "windowCpuThrottle",
  "previousUpstreamResponseAgeMs",
  "retryAfterSeconds",
  "budgetOverrunMs",
  "poolTotal",
  "poolIdle",
]);

/**
 * Which box/container wrote the row. Two app nodes (S1, S2) share one
 * error_logs table; without this a row could not be attributed to the node
 * that served the request (2026-11-13: a burst of stream 400s with no
 * server-side trace). Outside the fingerprint, so both nodes share one row.
 */
const SERVER_NODE = ((): string => {
  try {
    return hostname();
  } catch {
    return "unknown";
  }
})();

export function createEndpointLogger(
  debugEnabled = false,
  locale: CountryLanguage,
  context?: ServerLogContext,
): EndpointLogger {
  // Read at call time so loadEnvironment() has already set VIBE_LOG_TARGET.
  // Never raw process.env: it stays unset in a process that has not loaded
  // logger/env.ts yet, which silently disabled DB persistence (log-target.ts).
  const persistToDb = resolveLogTarget() === "db";
  const requestId = context?.requestId;
  return createLogger(
    debugEnabled,
    locale,
    persistToDb
      ? (level, message, error, metadata, loc) => {
          persistErrorLog(
            level,
            message,
            error,
            requestId
              ? [...metadata, { requestId, node: SERVER_NODE }]
              : [...metadata, { node: SERVER_NODE }],
            loc,
            { fingerprintIgnoreKeys: SERVER_LOG_FINGERPRINT_IGNORE_KEYS },
          );
        }
      : undefined,
    requestId
      ? (message, data): void =>
          serverFileLog(message, data ? { ...data, requestId } : { requestId })
      : serverFileLog,
  );
}
