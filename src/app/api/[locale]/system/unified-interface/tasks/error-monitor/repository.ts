/**
 * Error Monitor Repository
 * Scans error_logs (backend) and chat_messages (chat) for error patterns.
 * Called by the error monitor cron every 3 hours.
 *
 * Privacy-first: never reads message content or thread titles.
 * Truncation: top 20 patterns, 10 thread IDs per pattern.
 */

import "server-only";

import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  gt,
  isNotNull,
  or,
  sql,
} from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  chatMessages,
  type MessageMetadata,
} from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { errorLogs } from "./db";
import type { ErrorMonitorPostResponseOutput } from "./definition";

export class ErrorMonitorRepository {
  /** 3 hours in milliseconds */
  private static readonly SCAN_WINDOW_MS = 3 * 60 * 60 * 1000;
  /** Max rows to fetch from each source */
  private static readonly MAX_ROWS = 5000;
  /** Max patterns to return */
  private static readonly MAX_PATTERNS = 20;
  /** Max thread IDs per pattern */
  private static readonly MAX_THREAD_IDS = 10;

  /**
   * Classify a chat error message into a pattern key.
   * Privacy-safe: only uses role, errorType, errorCode, model, and metadata.toolCall.toolName.
   */
  private static classifyChatError(msg: {
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
      return {
        type: `api_error_${msg.errorCode}`,
        tool: null,
        model: msg.model,
      };
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
  private static addToPatternMap(
    patternMap: Map<
      string,
      {
        count: number;
        threadIds: Set<string>;
        model: string | null;
        tool: string | null;
        firstSeen: Date;
        lastSeen: Date;
      }
    >,
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
  static async scanForPatterns(
    logger: EndpointLogger,
  ): Promise<ResponseType<ErrorMonitorPostResponseOutput>> {
    const scanTo = new Date();
    const scanFrom = new Date(
      scanTo.getTime() - ErrorMonitorRepository.SCAN_WINDOW_MS,
    );

    logger.debug(
      `Scanning for errors from ${scanFrom.toISOString()} to ${scanTo.toISOString()}`,
    );

    // ── 1. Count threads in scan window (for stats) ──────────────────
    const [threadCountResult] = await db
      .select({ count: countDistinct(chatMessages.threadId) })
      .from(chatMessages)
      .where(gt(chatMessages.createdAt, scanFrom));

    const threadsScanned = threadCountResult?.count ?? 0;

    // ── 2. Query chat_messages for chat-specific errors ──────────────
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
      .limit(ErrorMonitorRepository.MAX_ROWS);

    // ── 3. Aggregate into patterns ───────────────────────────────────
    const patternMap = new Map<
      string,
      {
        count: number;
        threadIds: Set<string>;
        model: string | null;
        tool: string | null;
        firstSeen: Date;
        lastSeen: Date;
      }
    >();

    // Process backend errors — one row per fingerprint (dedup on write)
    const backendPatterns = await db
      .select({
        fingerprint: errorLogs.fingerprint,
        occurrences: errorLogs.occurrences,
        errorType: errorLogs.errorType,
        createdAt: errorLogs.createdAt,
      })
      .from(errorLogs)
      .where(
        and(
          gt(errorLogs.createdAt, scanFrom),
          sql`${errorLogs.fingerprint} != ''`,
        ),
      )
      .orderBy(desc(errorLogs.occurrences))
      .limit(ErrorMonitorRepository.MAX_PATTERNS);

    for (const bp of backendPatterns) {
      const type = bp.errorType
        ? `backend:${bp.errorType}`
        : `backend:${bp.fingerprint}`;
      patternMap.set(type, {
        count: bp.occurrences,
        threadIds: new Set(),
        model: null,
        tool: null,
        firstSeen: bp.createdAt,
        lastSeen: bp.createdAt,
      });
    }

    const backendErrorCount = backendPatterns.reduce(
      (sum, bp) => sum + bp.occurrences,
      0,
    );

    logger.debug(
      `Found ${backendErrorCount} backend errors (${backendPatterns.length} patterns), ${chatErrors.length} chat errors`,
    );

    // Process chat errors from chat_messages
    for (const msg of chatErrors) {
      const classification = ErrorMonitorRepository.classifyChatError({
        role: msg.role,
        errorType: msg.errorType,
        errorCode: msg.errorCode,
        model: msg.model,
        metadata: msg.metadata as MessageMetadata | null,
      });

      ErrorMonitorRepository.addToPatternMap(
        patternMap,
        classification.type,
        msg.threadId,
        classification.model,
        classification.tool,
        msg.createdAt,
      );
    }

    // ── 4. Convert to output (truncated) ─────────────────────────────
    const patterns: ErrorMonitorPostResponseOutput["patterns"] = [
      ...patternMap.entries(),
    ]
      .map(([type, data]) => ({
        type,
        count: data.count,
        threadIds: [...data.threadIds].slice(
          0,
          ErrorMonitorRepository.MAX_THREAD_IDS,
        ),
        model: data.model,
        tool: data.tool,
        firstSeen: data.firstSeen.toISOString(),
        lastSeen: data.lastSeen.toISOString(),
      }))
      .toSorted((a, b) => b.count - a.count)
      .slice(0, ErrorMonitorRepository.MAX_PATTERNS);

    const errorsFound = backendErrorCount + chatErrors.length;

    // ── 5. Count total error_logs for stats ──────────────────────────
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
  }
}
