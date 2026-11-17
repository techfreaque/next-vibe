/**
 * One run per identical PAID tool call in a chat turn.
 *
 * Models (prompt-engineered tool calling especially: Venice, Uncensored LM)
 * repeat the exact same tool call, in parallel in one step or again in the
 * next step of the same turn. Every repeat used to run the tool again and
 * bill it again. Prod 2026-11-16 (and earlier): the same image twice, the
 * same search twice.
 *
 * Rule, for tools that cost credits (static `credits` or `dynamicCredits`):
 *   - an identical call (same thread, caller, tool, normalised args) that is
 *     still IN FLIGHT anywhere in the thread is joined, not re-run;
 *   - an identical call that already SUCCEEDED in the same stream run (turn)
 *     reuses that result.
 * The duplicate gets the same result, marked `duplicate` so the caller can
 * report it as free. Nothing is charged twice because the handler (which
 * owns billing) only runs once.
 *
 * Out of scope on purpose:
 *   - calls without a thread (tool page, CLI, MCP): explicit user actions;
 *   - free tools (writes, edits, renames) where a repeat may be intended;
 *   - a later turn: a new stream run re-runs ("search again" works);
 *   - a failed first call is not reused once settled, so a retry runs.
 *
 * Lives at RouteExecutionExecutor.executeGenericHandler, the point every
 * local execution converges on (inline WAIT, DETACH/WAKE_UP tasks, relay
 * receivers), so all callback modes behave the same.
 */

import "server-only";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";

import { getEndpoint } from "@/generated/endpoints/endpoint";

import { getFullPath } from "../../core/core-utils/path";
import type { WidgetData } from "../../core/utils/json";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";

interface Entry<T> {
  promise: Promise<T>;
  /** Stream run that started the call (undefined outside a stream). */
  runId: string | undefined;
  /** Set once the call settled; undefined while in flight. */
  settledAt: number | undefined;
  /** Settled result is reusable (a success). */
  reusable: boolean;
}

/** Settled entries older than this are dropped (a turn is far shorter). */
const SETTLED_TTL_MS = 30 * 60 * 1000;
/** Upper bound on remembered calls per process. */
const MAX_ENTRIES = 5000;

const paidByPath = new Map<string, boolean>();

/**
 * Canonical form of tool args: keys sorted, strings trimmed with inner
 * whitespace collapsed, null/undefined/"" dropped. `{q:" a  b "}` and
 * `{q:"a b", count:null}` are the same call.
 */
export function normalizeToolArgs(value: WidgetData): WidgetData {
  if (typeof value === "string") {
    return value.trim().replace(/\s+/g, " ");
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeToolArgs(item));
  }
  if (value !== null && typeof value === "object") {
    const out: { [key: string]: WidgetData } = {};
    for (const key of Object.keys(value).toSorted()) {
      const normalized = normalizeToolArgs(value[key]);
      if (
        normalized === null ||
        normalized === undefined ||
        normalized === ""
      ) {
        continue;
      }
      out[key] = normalized;
    }
    return out;
  }
  return value;
}

async function isPaidTool(path: string): Promise<boolean> {
  const cached = paidByPath.get(path);
  if (cached !== undefined) {
    return cached;
  }
  const endpoint = await getEndpoint(path);
  const paid =
    !!endpoint &&
    ((endpoint.credits ?? 0) > 0 || endpoint.dynamicCredits !== undefined);
  paidByPath.set(path, paid);
  return paid;
}

/**
 * Dedupe key for a call, or null when the call must always run (no thread,
 * free tool, unknown tool).
 */
export async function paidCallKey(params: {
  toolName: string;
  data: Record<string, WidgetData>;
  urlPathParams: Record<string, WidgetData>;
  user: JwtPayloadType;
  toolExecutionContext: ToolExecutionContext;
}): Promise<string | null> {
  const threadId = params.toolExecutionContext.threadId;
  if (!threadId) {
    return null;
  }
  const path = getFullPath(params.toolName) ?? params.toolName;
  if (!(await isPaidTool(path))) {
    return null;
  }
  return JSON.stringify([
    threadId,
    params.user.isPublic ? params.user.leadId : params.user.id,
    path,
    normalizeToolArgs(params.urlPathParams),
    normalizeToolArgs(params.data),
  ]);
}

/**
 * A dedupe table for one result type. A rejected call is never shared: the
 * joiner sees the same rejection, nothing is remembered.
 */
export function createPaidCallDedupe<T>(): {
  run: (params: {
    key: string | null;
    runId: string | undefined;
    execute: () => Promise<T>;
    /** Whether a settled result may be reused by a later identical call. */
    isReusable: (result: T) => boolean;
    logger: EndpointLogger;
    toolName: string;
  }) => Promise<{ result: T; duplicate: boolean }>;
  reset: () => void;
} {
  const calls = new Map<string, Entry<T>>();

  const prune = (now: number): void => {
    for (const [key, entry] of calls) {
      if (
        entry.settledAt !== undefined &&
        (now - entry.settledAt > SETTLED_TTL_MS || calls.size > MAX_ENTRIES)
      ) {
        calls.delete(key);
      }
    }
  };

  return {
    reset: (): void => {
      calls.clear();
    },
    run: async ({ key, runId, execute, isReusable, logger, toolName }) => {
      if (key === null) {
        return { result: await execute(), duplicate: false };
      }
      prune(Date.now());

      const existing = calls.get(key);
      if (existing) {
        const inFlight = existing.settledAt === undefined;
        const sameTurn =
          existing.reusable && runId !== undefined && existing.runId === runId;
        if (inFlight || sameTurn) {
          const result = await existing.promise;
          logger.info(
            inFlight
              ? "[RouteExecute] Joined an identical in-flight paid tool call (not billed)"
              : "[RouteExecute] Reused an identical paid tool call from this turn (not billed)",
            { toolName },
          );
          return { result, duplicate: true };
        }
      }

      const running = execute();
      const entry: Entry<T> = {
        promise: running,
        runId,
        settledAt: undefined,
        reusable: false,
      };
      calls.set(key, entry);
      try {
        const result = await running;
        entry.reusable = isReusable(result);
        return { result, duplicate: false };
      } finally {
        entry.settledAt = Date.now();
        if (!entry.reusable && calls.get(key) === entry) {
          calls.delete(key);
        }
      }
    },
  };
}

/** A duplicate is free: report a top-level `creditCost` as 0. */
export function withZeroCreditCost<T>(data: T): T {
  if (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "creditCost" in data &&
    typeof data.creditCost === "number"
  ) {
    return { ...data, creditCost: 0 };
  }
  return data;
}

/** Test hook: forget cached paid/free lookups. */
export function resetPaidToolLookup(): void {
  paidByPath.clear();
}
