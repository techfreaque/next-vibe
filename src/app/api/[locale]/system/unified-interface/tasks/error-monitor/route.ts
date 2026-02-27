/**
 * Error Monitor Route Handler
 * Scans error_logs (backend errors) and chat_messages (chat errors) for patterns.
 * Called by cron every 3 hours.
 *
 * Privacy-first: never reads message content or thread titles.
 * Truncation: max 5000 log rows queried, top 20 patterns, 10 thread IDs per pattern.
 */

import "server-only";

import {
  and,
  count,
  countDistinct,
  eq,
  gt,
  isNotNull,
  or,
  sql,
} from "drizzle-orm";
import { success } from "next-vibe/shared/types/response.schema";

import {
  chatMessages,
  type MessageMetadata,
} from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { db } from "@/app/api/[locale]/system/db";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { errorLogs } from "./db";
import definitions from "./definition";

/** 3 hours in milliseconds */
const SCAN_WINDOW_MS = 3 * 60 * 60 * 1000;

/** Max rows to fetch from each source */
const MAX_ROWS = 5000;

/** Max patterns to return */
const MAX_PATTERNS = 20;

/** Max thread IDs per pattern */
const MAX_THREAD_IDS = 10;

interface PatternAccumulator {
  count: number;
  threadIds: Set<string>;
  model: string | null;
  tool: string | null;
  firstSeen: Date;
  lastSeen: Date;
}

interface ErrorPattern {
  type: string;
  count: number;
  threadIds: string[];
  model: string | null;
  tool: string | null;
  firstSeen: string;
  lastSeen: string;
}

/**
 * Classify a chat error message into a pattern key.
 * Privacy-safe: only uses role, errorType, errorCode, model, and metadata.toolCall.toolName.
 */
function classifyChatError(msg: {
  role: string;
  errorType: string | null;
  errorCode: string | null;
  model: string | null;
  metadata: MessageMetadata | null;
}): { type: string; tool: string | null; model: string | null } {
  const metadata = msg.metadata;

  // 1. Tool failure: metadata has toolCall with error
  if (metadata?.toolCall?.error) {
    const toolName = metadata.toolCall.toolName ?? "unknown";
    return { type: `tool_failure:${toolName}`, tool: toolName, model: null };
  }

  // 2. HTTP error code
  if (msg.errorCode) {
    return { type: `api_error_${msg.errorCode}`, tool: null, model: msg.model };
  }

  // 3. Model error (error role + model set)
  if (msg.role === ChatMessageRole.ERROR && msg.model) {
    return { type: `model_error:${msg.model}`, tool: null, model: msg.model };
  }

  // 4. Typed error
  if (msg.errorType) {
    return { type: `error:${msg.errorType}`, tool: null, model: msg.model };
  }

  // 5. Generic error role
  if (msg.role === ChatMessageRole.ERROR) {
    return { type: "unknown_error", tool: null, model: msg.model };
  }

  return { type: "unknown_error", tool: null, model: null };
}

/** Add an error to the pattern accumulator */
function addToPatternMap(
  patternMap: Map<string, PatternAccumulator>,
  type: string,
  threadId: string | null,
  model: string | null,
  tool: string | null,
  date: Date,
): void {
  const existing = patternMap.get(type);
  if (existing) {
    existing.count++;
    if (threadId) {
      existing.threadIds.add(threadId);
    }
    if (date < existing.firstSeen) {
      existing.firstSeen = date;
    }
    if (date > existing.lastSeen) {
      existing.lastSeen = date;
    }
  } else {
    patternMap.set(type, {
      count: 1,
      threadIds: new Set(threadId ? [threadId] : []),
      model,
      tool,
      firstSeen: date,
      lastSeen: date,
    });
  }
}

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ logger }) => {
      const scanTo = new Date();
      const scanFrom = new Date(scanTo.getTime() - SCAN_WINDOW_MS);

      logger.debug(
        `Scanning for errors from ${scanFrom.toISOString()} to ${scanTo.toISOString()}`,
      );

      // ── 1. Count threads in scan window (for stats) ──────────────────
      const [threadCountResult] = await db
        .select({ count: countDistinct(chatMessages.threadId) })
        .from(chatMessages)
        .where(gt(chatMessages.createdAt, scanFrom));

      const threadsScanned = threadCountResult?.count ?? 0;

      // ── 2. Query error_logs table (backend errors) ───────────────────
      const backendErrors = await db
        .select({
          source: errorLogs.source,
          errorType: errorLogs.errorType,
          errorCode: errorLogs.errorCode,
          endpoint: errorLogs.endpoint,
          metadata: errorLogs.metadata,
          createdAt: errorLogs.createdAt,
        })
        .from(errorLogs)
        .where(gt(errorLogs.createdAt, scanFrom))
        .limit(MAX_ROWS);

      // ── 3. Query chat_messages for chat-specific errors ──────────────
      const chatErrors = await db
        .select({
          threadId: chatMessages.threadId,
          role: chatMessages.role,
          errorType: chatMessages.errorType,
          errorCode: chatMessages.errorCode,
          model: chatMessages.model,
          metadata: chatMessages.metadata,
          createdAt: chatMessages.createdAt,
        })
        .from(chatMessages)
        .where(
          and(
            gt(chatMessages.createdAt, scanFrom),
            or(
              eq(chatMessages.role, ChatMessageRole.ERROR),
              isNotNull(chatMessages.errorType),
              isNotNull(chatMessages.errorCode),
              sql`${chatMessages.metadata}::jsonb -> 'toolCall' -> 'error' IS NOT NULL`,
            ),
          ),
        )
        .limit(MAX_ROWS);

      logger.debug(
        `Found ${backendErrors.length} backend errors, ${chatErrors.length} chat errors`,
      );

      // ── 4. Aggregate into patterns ───────────────────────────────────
      const patternMap = new Map<string, PatternAccumulator>();

      // Process backend errors from error_logs
      for (const err of backendErrors) {
        const type = err.errorType
          ? `backend:${err.errorType}`
          : err.errorCode
            ? `backend:api_error_${err.errorCode}`
            : `backend:${err.endpoint ?? "unknown"}`;

        const meta = err.metadata as Record<
          string,
          string | number | boolean | undefined
        > | null;
        addToPatternMap(
          patternMap,
          type,
          (meta?.["threadId"] as string) ?? null,
          (meta?.["model"] as string) ?? null,
          (meta?.["tool"] as string) ?? null,
          err.createdAt,
        );
      }

      // Process chat errors from chat_messages
      for (const msg of chatErrors) {
        const classification = classifyChatError({
          role: msg.role,
          errorType: msg.errorType,
          errorCode: msg.errorCode,
          model: msg.model,
          metadata: msg.metadata as MessageMetadata | null,
        });

        addToPatternMap(
          patternMap,
          classification.type,
          msg.threadId,
          classification.model,
          classification.tool,
          msg.createdAt,
        );
      }

      // ── 5. Convert to output (truncated) ─────────────────────────────
      const patterns: ErrorPattern[] = [...patternMap.entries()]
        .map(([type, data]) => ({
          type,
          count: data.count,
          threadIds: [...data.threadIds].slice(0, MAX_THREAD_IDS),
          model: data.model,
          tool: data.tool,
          firstSeen: data.firstSeen.toISOString(),
          lastSeen: data.lastSeen.toISOString(),
        }))
        .toSorted((a, b) => b.count - a.count)
        .slice(0, MAX_PATTERNS);

      const errorsFound = backendErrors.length + chatErrors.length;

      // ── 6. Count total error_logs for stats ──────────────────────────
      const [totalLogsResult] = await db
        .select({ count: count() })
        .from(errorLogs);
      const totalErrorLogs = totalLogsResult?.count ?? 0;

      if (errorsFound > 0) {
        logger.warn(
          `Error monitor: ${errorsFound} errors found across ${patterns.length} patterns (${totalErrorLogs} total logs in DB)`,
        );
      } else {
        logger.debug(
          `Error monitor: all clear (${totalErrorLogs} total logs in DB)`,
        );
      }

      return success({
        errorsFound,
        threadsScanned,
        scanWindowFrom: scanFrom.toISOString(),
        scanWindowTo: scanTo.toISOString(),
        patterns,
      });
    },
  },
});
