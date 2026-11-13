/**
 * Stale Run Reaper Repository
 *
 * A thread is 'streaming' while some process owns its run claim
 * (chat_threads.streaming_run_id). When that process dies mid-answer (deploy
 * recreate, OOM, crash) nothing ever clears the claim: the thread spins
 * forever and new messages queue behind a run that no longer exists.
 *
 * Staleness (both HA nodes share the DB, so "dead" must be proven from data):
 *   - Local loop (loop_instance_id NULL): the owner stamps
 *     streaming_heartbeat_at every minute (run-heartbeat.ts). No beat for
 *     localThresholdMinutes = dead, on whichever node it ran. Rows claimed
 *     before heartbeats existed fall back to updated_at.
 *   - Remote loop (loop_instance_id set): no heartbeat here; the thread and its
 *     messages are updated by relayed events. Nothing for
 *     remoteThresholdMinutes = dead.
 *   - Either way, any non-queued message written inside the window vetoes the
 *     reap (belt and braces for a node still running pre-heartbeat code).
 *
 * Reaping a thread: compare-and-set the claim to a reaper run id (still stale,
 * same observed claim) so concurrent reapers and a revived owner never both
 * act; clear leftover isStreaming flags (the partial answer itself is already
 * in the DB through the throttled writes); append a STREAM_INTERRUPTED message
 * after the last message (shown as "stopped" with a retry); clear the state
 * owner-guarded; emit to every view; start the oldest queued message.
 */

import "server-only";

import {
  and,
  asc,
  desc,
  eq,
  gt,
  inArray,
  isNotNull,
  isNull,
  lt,
  notExists,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { resolveTaskOwnerUser } from "next-vibe/tasks/cron/resolve-task-user";

import type { DefaultFolderId } from "../../../core/execution-context";
import { chatMessages, chatThreads } from "../../chat/db";
import { ChatMessageRole, ThreadStreamingState } from "../../chat/enum";
import { createMessagesEmitter } from "../../chat/threads/[threadId]/messages/emitter";
import { MessagesRepository } from "../../chat/threads/[threadId]/messages/repository";
import { StreamErrorType } from "../repository/core/constants";
import { buildSseMessageRow } from "../repository/core/db-writer/sse-row";
import { clearStreamingState } from "../repository/core/stream";
import { scopedTranslation as aiStreamScopedTranslation } from "../stream/i18n";
import {
  STALE_RUN_QUEUED_MAX_AGE_MS,
  STALE_RUN_REAPER_RUN_PREFIX,
} from "./constants";
import type {
  StaleRunReaperPostRequestOutput,
  StaleRunReaperPostResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

const MINUTE_MS = 60_000;

/** States a dead owner can leave behind. 'waiting' belongs to tasks, not runs. */
const REAPABLE_STATES = [
  ThreadStreamingState.STREAMING,
  ThreadStreamingState.ABORTING,
];

export interface StaleRunCandidate {
  id: string;
  streamingState: ThreadStreamingState;
  streamingRunId: string | null;
  loopInstanceId: string | null;
  userId: string | null;
  leadId: string | null;
  rootFolderId: DefaultFolderId;
}

export type ReapOutcome = "reaped" | "lost" | "failed";

/** Starts the oldest queued message of a freed thread (processNextQueuedMessage). */
export type ProcessQueuedFn = (params: {
  threadId: string;
  rootFolderId: DefaultFolderId;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
}) => Promise<boolean>;

interface StaleCutoffs {
  local: Date;
  remote: Date;
}

const defaultProcessQueued: ProcessQueuedFn = async ({
  threadId,
  rootFolderId,
  user,
  locale,
  logger,
}) => {
  const { processNextQueuedMessage } =
    await import("../repository/intake/queue");
  const { t: aiStreamT } = aiStreamScopedTranslation.scopedT(locale);
  return processNextQueuedMessage(
    threadId,
    logger,
    user,
    locale,
    aiStreamT,
    rootFolderId,
    0,
  );
};

export class StaleRunReaperRepository {
  static async reap(
    data: StaleRunReaperPostRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
    processQueued: ProcessQueuedFn = defaultProcessQueued,
  ): Promise<ResponseType<StaleRunReaperPostResponseOutput>> {
    const startTime = Date.now();
    try {
      const cutoffs: StaleCutoffs = {
        local: new Date(startTime - data.localThresholdMinutes * MINUTE_MS),
        remote: new Date(startTime - data.remoteThresholdMinutes * MINUTE_MS),
      };
      const candidates = await StaleRunReaperRepository.findCandidates(
        cutoffs,
        data.batchSize,
      );

      let reaped = 0;
      let lost = 0;
      let failed = 0;
      let queuedStarted = 0;
      const threadIds: string[] = [];

      if (data.dryRun) {
        threadIds.push(...candidates.map((c) => c.id));
      } else {
        for (const candidate of candidates) {
          const result = await StaleRunReaperRepository.reapThread(
            candidate,
            cutoffs,
            locale,
            logger,
            processQueued,
          );
          if (result.outcome === "reaped") {
            reaped++;
            threadIds.push(candidate.id);
            if (result.queuedStarted) {
              queuedStarted++;
            }
          } else if (result.outcome === "lost") {
            lost++;
          } else {
            failed++;
          }
        }
      }

      if (candidates.length > 0) {
        logger.warn("[StaleRuns] Stuck streaming threads found", {
          dryRun: data.dryRun,
          candidates: candidates.length,
          reaped,
          lost,
          failed,
          queuedStarted,
          threadIds: candidates.map((c) => c.id).join(","),
        });
      }

      return success({
        candidates: candidates.length,
        reaped,
        lost,
        failed,
        queuedStarted,
        executionTimeMs: Date.now() - startTime,
        threadIds: threadIds.join(", "),
      });
    } catch (error) {
      logger.error("[StaleRuns] Sweep failed", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.failed", { error: parseError(error).message }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * The staleness predicate, shared by the candidate scan and the claim CAS so
   * a run that beat (or wrote) in between is never taken over.
   */
  private static stalePredicate(cutoffs: StaleCutoffs): SQL | undefined {
    const noRecentMessage = StaleRunReaperRepository.noRecentMessage;
    const localStale = and(
      isNull(chatThreads.loopInstanceId),
      or(
        lt(chatThreads.streamingHeartbeatAt, cutoffs.local),
        and(
          isNull(chatThreads.streamingHeartbeatAt),
          lt(chatThreads.updatedAt, cutoffs.local),
        ),
      ),
      noRecentMessage(cutoffs.local),
    );
    const remoteStale = and(
      isNotNull(chatThreads.loopInstanceId),
      lt(chatThreads.updatedAt, cutoffs.remote),
      or(
        isNull(chatThreads.streamingHeartbeatAt),
        lt(chatThreads.streamingHeartbeatAt, cutoffs.remote),
      ),
      noRecentMessage(cutoffs.remote),
    );
    return and(
      inArray(chatThreads.streamingState, REAPABLE_STATES),
      or(localStale, remoteStale),
    );
  }

  /** No run activity (any non-queued message write) in the thread since `cutoff`. */
  private static noRecentMessage(cutoff: Date): SQL {
    return notExists(
      db
        .select({ one: sql`1` })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, chatThreads.id),
            gt(chatMessages.updatedAt, cutoff),
            // A user queueing behind the dead run is not run activity.
            sql`${chatMessages.metadata}->>'isQueued' IS DISTINCT FROM 'true'`,
          ),
        ),
    );
  }

  static async findCandidates(
    cutoffs: StaleCutoffs,
    limit: number,
  ): Promise<StaleRunCandidate[]> {
    return db
      .select({
        id: chatThreads.id,
        streamingState: chatThreads.streamingState,
        streamingRunId: chatThreads.streamingRunId,
        loopInstanceId: chatThreads.loopInstanceId,
        userId: chatThreads.userId,
        leadId: chatThreads.leadId,
        rootFolderId: chatThreads.rootFolderId,
      })
      .from(chatThreads)
      .where(StaleRunReaperRepository.stalePredicate(cutoffs))
      .orderBy(asc(chatThreads.updatedAt))
      .limit(limit);
  }

  /** The user queued a message recently enough to still want it answered. */
  private static async hasFreshQueuedMessage(
    threadId: string,
  ): Promise<boolean> {
    const [fresh] = await db
      .select({ id: chatMessages.id })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.threadId, threadId),
          eq(chatMessages.role, ChatMessageRole.USER),
          sql`${chatMessages.metadata}->>'isQueued' = 'true'`,
          gt(
            chatMessages.createdAt,
            new Date(Date.now() - STALE_RUN_QUEUED_MAX_AGE_MS),
          ),
        ),
      )
      .limit(1);
    return fresh !== undefined;
  }

  /** Resolve who the thread's events and queued turn run as. */
  private static async resolveThreadUser(
    candidate: StaleRunCandidate,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<{
    user: JwtPayloadType;
    locale: CountryLanguage;
    canRun: boolean;
  } | null> {
    if (candidate.userId) {
      const resolved = await resolveTaskOwnerUser(
        { type: "user", userId: candidate.userId },
        locale,
        logger,
      );
      if (resolved) {
        return { user: resolved.user, locale: resolved.locale, canRun: true };
      }
      // Roles unresolvable: still free the thread (emit-only identity), but
      // never start a turn on guessed permissions.
      return {
        user: {
          id: candidate.userId,
          leadId: candidate.leadId ?? candidate.userId,
          isPublic: false,
          roles: [],
        },
        locale,
        canRun: false,
      };
    }
    if (candidate.leadId) {
      return {
        user: {
          isPublic: true,
          leadId: candidate.leadId,
          roles: [UserPermissionRole.PUBLIC],
        },
        locale,
        canRun: true,
      };
    }
    return null;
  }

  /** Take over one stale claim and finalize it. Never throws. */
  static async reapThread(
    candidate: StaleRunCandidate,
    cutoffs: StaleCutoffs,
    locale: CountryLanguage,
    logger: EndpointLogger,
    processQueued: ProcessQueuedFn = defaultProcessQueued,
  ): Promise<{ outcome: ReapOutcome; queuedStarted: boolean }> {
    const threadId = candidate.id;
    const reaperRunId = `${STALE_RUN_REAPER_RUN_PREFIX}${crypto.randomUUID()}`;
    try {
      // 1. Compare-and-set: same observed claim, still stale. Exactly one
      //    reaper wins; an owner that beat in between keeps its run. The
      //    state stays as is, so new messages keep queueing until step 5.
      const [claimed] = await db
        .update(chatThreads)
        .set({
          streamingRunId: reaperRunId,
          streamingHeartbeatAt: new Date(),
        })
        .where(
          and(
            eq(chatThreads.id, threadId),
            eq(chatThreads.streamingState, candidate.streamingState),
            candidate.streamingRunId === null
              ? isNull(chatThreads.streamingRunId)
              : eq(chatThreads.streamingRunId, candidate.streamingRunId),
            StaleRunReaperRepository.stalePredicate(cutoffs),
          ),
        )
        .returning({ id: chatThreads.id });
      if (!claimed) {
        logger.info("[StaleRuns] Claim lost - thread is live or reaped", {
          threadId,
        });
        return { outcome: "lost", queuedStarted: false };
      }

      const identity = await StaleRunReaperRepository.resolveThreadUser(
        candidate,
        locale,
        logger,
      );
      if (!identity) {
        // Ownerless row: nobody can watch it, just free it.
        await db
          .update(chatThreads)
          .set({
            streamingState: ThreadStreamingState.IDLE,
            streamingRunId: null,
          })
          .where(
            and(
              eq(chatThreads.id, threadId),
              eq(chatThreads.streamingRunId, reaperRunId),
            ),
          );
        return { outcome: "reaped", queuedStarted: false };
      }
      const { user } = identity;

      // 2. Partial answer: content is already persisted by the throttled
      //    writes; only the live-streaming flags are left over.
      await db
        .update(chatMessages)
        .set({
          metadata: sql`${chatMessages.metadata} || '{"isStreaming":false}'::jsonb`,
        })
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            sql`${chatMessages.metadata}->>'isStreaming' = 'true'`,
          ),
        );

      // 3. Mark the turn interrupted after its last message (skip when the
      //    dying process already wrote an error there).
      const [leaf] = await db
        .select({
          id: chatMessages.id,
          role: chatMessages.role,
          sequenceId: chatMessages.sequenceId,
        })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.threadId, threadId),
            sql`${chatMessages.metadata}->>'isQueued' IS DISTINCT FROM 'true'`,
          ),
        )
        .orderBy(desc(chatMessages.createdAt))
        .limit(1);
      let interruptionRow: ReturnType<typeof buildSseMessageRow> | null = null;
      if (leaf && leaf.role !== ChatMessageRole.ERROR) {
        const { t } = scopedTranslation.scopedT(identity.locale);
        const content = t("interrupted.content");
        const messageId = crypto.randomUUID();
        const createdAt = new Date();
        await MessagesRepository.createErrorMessage({
          messageId,
          threadId,
          content,
          errorType: StreamErrorType.STREAM_INTERRUPTED,
          parentId: leaf.id,
          sequenceId: leaf.sequenceId,
          user,
          logger,
        });
        interruptionRow = buildSseMessageRow({
          id: messageId,
          threadId,
          role: ChatMessageRole.ERROR,
          content,
          parentId: leaf.id,
          sequenceId: leaf.sequenceId,
          authorId: user.id ?? null,
          errorType: StreamErrorType.STREAM_INTERRUPTED,
          createdAt,
          updatedAt: createdAt,
        });
      }

      // 4. Release the claim (owner-guarded: a stream that started meanwhile
      //    keeps its state) and fan the change out on every view.
      const cleared = await clearStreamingState(
        threadId,
        logger,
        user,
        reaperRunId,
      );
      const emit = createMessagesEmitter(logger, user, {
        threadId,
        rootFolderId: candidate.rootFolderId,
      });
      if (interruptionRow) {
        emit("message-created", {
          responseData: {
            streamingState: cleared.state,
            messages: [interruptionRow],
          },
        });
      }
      if (cleared.superseded) {
        logger.info("[StaleRuns] A new stream took over while reaping", {
          threadId,
        });
        return { outcome: "reaped", queuedStarted: false };
      }
      emit("stream-finished", {
        responseData: { streamingState: cleared.state },
      });

      logger.warn("[StaleRuns] Reaped stale streaming run", {
        threadId,
        previousState: candidate.streamingState,
        previousRunId: candidate.streamingRunId,
        loopInstanceId: candidate.loopInstanceId,
        finalState: cleared.state,
        interrupted: interruptionRow !== null,
      });

      // 5. Messages queued behind the dead run start now.
      let queuedStarted = false;
      if (
        cleared.state === ThreadStreamingState.IDLE &&
        identity.canRun &&
        (await StaleRunReaperRepository.hasFreshQueuedMessage(threadId))
      ) {
        queuedStarted = await processQueued({
          threadId,
          rootFolderId: candidate.rootFolderId,
          user,
          locale: identity.locale,
          logger,
        }).catch((error: Error) => {
          logger.error("[StaleRuns] Failed to start queued message", {
            threadId,
            error: parseError(error).message,
          });
          return false;
        });
      }
      return { outcome: "reaped", queuedStarted };
    } catch (error) {
      logger.error("[StaleRuns] Reaping thread failed", {
        threadId,
        error: parseError(error).message,
      });
      return { outcome: "failed", queuedStarted: false };
    }
  }
}
