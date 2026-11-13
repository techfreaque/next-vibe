/**
 * Stale-run reaper.
 *
 * Regression for prod (11 threads stuck 'streaming' 2026-07-08..2026-11-12):
 * a deploy recreated the app mid-answer, the dead process kept its claim, the
 * thread spun forever and every new message queued behind a run that no longer
 * existed. The reaper must free exactly those threads and never a live one,
 * including a live run on the other HA node (shared DB, heartbeat).
 */

import { and, eq, inArray } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { chatMessages, chatThreads } from "../../chat/db";
import { ChatMessageRole, ThreadStreamingState } from "../../chat/enum";
import { StreamErrorType } from "../repository/core/constants";
import {
  beatOwnedRuns,
  registerOwnedRun,
  releaseOwnedRun,
} from "../repository/core/run-heartbeat";
import {
  type ProcessQueuedFn,
  type StaleRunCandidate,
  StaleRunReaperRepository,
} from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const MIN = 60_000;
const ago = (minutes: number): Date => new Date(Date.now() - minutes * MIN);

const LOCAL_MIN = 10;
const REMOTE_MIN = 30;
const cutoffs = (): { local: Date; remote: Date } => ({
  local: ago(LOCAL_MIN),
  remote: ago(REMOTE_MIN),
});

interface ThreadSpec {
  heartbeatAt: Date | null;
  updatedAt: Date;
  loopInstanceId?: string;
  state?: ThreadStreamingState;
  /** Last message write (assistant partial answer). */
  lastMessageAt: Date;
  /** Minutes ago the user queued a message behind the run. */
  queuedMinutesAgo?: number;
}

describe("stale-run reaper", () => {
  let admin: JwtPrivatePayloadType;
  const ids = {
    stale: crypto.randomUUID(),
    liveLocal: crypto.randomUUID(),
    livePeerOldCode: crypto.randomUUID(),
    remoteLive: crypto.randomUUID(),
    remoteStale: crypto.randomUUID(),
    concurrent: crypto.randomUUID(),
    queued: crypto.randomUUID(),
    queuedLongAgo: crypto.randomUUID(),
    beating: crypto.randomUUID(),
  };
  const allIds = Object.values(ids);
  const runIdOf = (threadId: string): string => `run-${threadId}`;
  const assistantIdOf = new Map<string, string>();

  async function seedThread(threadId: string, spec: ThreadSpec): Promise<void> {
    await db.insert(chatThreads).values({
      id: threadId,
      userId: admin.id,
      leadId: admin.leadId,
      title: "stale-run reaper test",
      rootFolderId: DefaultFolderId.PRIVATE,
      streamingState: spec.state ?? ThreadStreamingState.STREAMING,
      streamingRunId: spec.loopInstanceId ? null : runIdOf(threadId),
      streamingHeartbeatAt: spec.heartbeatAt,
      loopInstanceId: spec.loopInstanceId ?? null,
      createdAt: spec.updatedAt,
      updatedAt: spec.updatedAt,
    });
    const userMessageId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();
    assistantIdOf.set(threadId, assistantId);
    await db.insert(chatMessages).values([
      {
        id: userMessageId,
        threadId,
        role: ChatMessageRole.USER,
        content: "question",
        authorId: admin.id,
        createdAt: spec.updatedAt,
        updatedAt: spec.updatedAt,
      },
      {
        id: assistantId,
        threadId,
        role: ChatMessageRole.ASSISTANT,
        content: "partial answer that was being writ",
        parentId: userMessageId,
        isAI: true,
        metadata: { isStreaming: true },
        createdAt: new Date(spec.updatedAt.getTime() + 1000),
        updatedAt: spec.lastMessageAt,
      },
    ]);
    if (spec.queuedMinutesAgo !== undefined) {
      // A user waiting on the dead run is not run activity.
      const queuedAt = ago(spec.queuedMinutesAgo);
      await db.insert(chatMessages).values({
        id: crypto.randomUUID(),
        threadId,
        role: ChatMessageRole.USER,
        content: "anyone there?",
        authorId: admin.id,
        metadata: { isQueued: true },
        createdAt: queuedAt,
        updatedAt: queuedAt,
      });
    }
  }

  async function candidateFor(
    threadId: string,
  ): Promise<StaleRunCandidate | undefined> {
    const all = await StaleRunReaperRepository.findCandidates(cutoffs(), 1000);
    return all.find((c) => c.id === threadId);
  }

  async function threadRow(threadId: string): Promise<{
    state: ThreadStreamingState;
    runId: string | null;
  }> {
    const [row] = await db
      .select({
        state: chatThreads.streamingState,
        runId: chatThreads.streamingRunId,
      })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId));
    if (!row) {
      return { state: ThreadStreamingState.IDLE, runId: "missing" };
    }
    return row;
  }

  async function interruptions(threadId: string): Promise<
    Array<{
      parentId: string | null;
      errorType: string | null;
    }>
  > {
    return db
      .select({
        parentId: chatMessages.parentId,
        errorType: chatMessages.errorType,
      })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.threadId, threadId),
          eq(chatMessages.role, ChatMessageRole.ERROR),
        ),
      );
  }

  const noQueue: ProcessQueuedFn = () => Promise.resolve(false);

  beforeAll(async () => {
    admin = await resolveTestAdminUser();
    // Owner died 20 min ago: no beat since.
    await seedThread(ids.stale, {
      heartbeatAt: ago(20),
      updatedAt: ago(25),
      lastMessageAt: ago(20),
    });
    // Live on this or the peer node: beat a minute ago (long silent answer).
    await seedThread(ids.liveLocal, {
      heartbeatAt: ago(1),
      updatedAt: ago(14),
      lastMessageAt: ago(14),
    });
    // Peer node still on pre-heartbeat code: no beat, but writing right now.
    await seedThread(ids.livePeerOldCode, {
      heartbeatAt: null,
      updatedAt: ago(12),
      lastMessageAt: ago(0.2),
    });
    // Loop on another instance, relayed activity 5 min ago.
    await seedThread(ids.remoteLive, {
      heartbeatAt: null,
      updatedAt: ago(5),
      lastMessageAt: ago(5),
      loopInstanceId: "test-peer",
    });
    // Loop on another instance, nothing relayed for 2 hours.
    await seedThread(ids.remoteStale, {
      heartbeatAt: null,
      updatedAt: ago(120),
      lastMessageAt: ago(120),
      loopInstanceId: "test-peer",
    });
    await seedThread(ids.concurrent, {
      heartbeatAt: ago(30),
      updatedAt: ago(31),
      lastMessageAt: ago(30),
      state: ThreadStreamingState.ABORTING,
    });
    await seedThread(ids.queued, {
      heartbeatAt: ago(15),
      updatedAt: ago(16),
      lastMessageAt: ago(15),
      queuedMinutesAgo: 0,
    });
    // Queue abandoned three days ago: freed, but not replayed.
    await seedThread(ids.queuedLongAgo, {
      heartbeatAt: ago(4400),
      updatedAt: ago(4400),
      lastMessageAt: ago(4400),
      queuedMinutesAgo: 4320,
    });
    await seedThread(ids.beating, {
      heartbeatAt: ago(40),
      updatedAt: ago(41),
      lastMessageAt: ago(40),
    });
  });

  afterAll(async () => {
    releaseOwnedRun(runIdOf(ids.beating));
    await db.delete(chatMessages).where(inArray(chatMessages.threadId, allIds));
    await db.delete(chatThreads).where(inArray(chatThreads.id, allIds));
  });

  it("selects only the dead runs (dry run changes nothing)", async () => {
    const res = await StaleRunReaperRepository.reap(
      {
        localThresholdMinutes: LOCAL_MIN,
        remoteThresholdMinutes: REMOTE_MIN,
        batchSize: 1000,
        dryRun: true,
      },
      logger,
      defaultLocale,
      noQueue,
    );
    expect(res.success, JSON.stringify(res)).toBe(true);
    if (!res.success) {
      return;
    }
    const listed = new Set(res.data.threadIds.split(", "));
    expect(listed.has(ids.stale)).toBe(true);
    expect(listed.has(ids.remoteStale)).toBe(true);
    expect(listed.has(ids.concurrent)).toBe(true);
    expect(listed.has(ids.queued)).toBe(true);
    expect(listed.has(ids.liveLocal)).toBe(false);
    expect(listed.has(ids.livePeerOldCode)).toBe(false);
    expect(listed.has(ids.remoteLive)).toBe(false);
    expect((await threadRow(ids.stale)).state).toBe(
      ThreadStreamingState.STREAMING,
    );
  });

  it("reaps a dead local run: keeps the partial answer, marks it interrupted", async () => {
    const candidate = await candidateFor(ids.stale);
    expect(candidate).toBeDefined();
    if (!candidate) {
      return;
    }
    const result = await StaleRunReaperRepository.reapThread(
      candidate,
      cutoffs(),
      defaultLocale,
      logger,
      noQueue,
    );
    expect(result.outcome).toBe("reaped");

    const row = await threadRow(ids.stale);
    expect(row.state).toBe(ThreadStreamingState.IDLE);
    expect(row.runId).toBeNull();

    const [assistant] = await db
      .select({
        content: chatMessages.content,
        metadata: chatMessages.metadata,
      })
      .from(chatMessages)
      .where(eq(chatMessages.id, assistantIdOf.get(ids.stale) ?? ""));
    expect(assistant?.content).toBe("partial answer that was being writ");
    expect(assistant?.metadata?.isStreaming).toBe(false);

    const errors = await interruptions(ids.stale);
    expect(errors).toHaveLength(1);
    expect(errors[0]?.parentId).toBe(assistantIdOf.get(ids.stale));
    // The column is what a reload renders from.
    expect(errors[0]?.errorType).toBe(StreamErrorType.STREAM_INTERRUPTED);

    // Swept again: nothing left to do.
    expect(await candidateFor(ids.stale)).toBeUndefined();
  });

  it("never touches a live run (recent heartbeat or recent writes)", async () => {
    for (const threadId of [
      ids.liveLocal,
      ids.livePeerOldCode,
      ids.remoteLive,
    ]) {
      expect(await candidateFor(threadId)).toBeUndefined();
      // Even a forged candidate loses the CAS: staleness is re-checked there.
      const forged: StaleRunCandidate = {
        id: threadId,
        streamingState: ThreadStreamingState.STREAMING,
        streamingRunId: threadId === ids.remoteLive ? null : runIdOf(threadId),
        loopInstanceId: threadId === ids.remoteLive ? "test-peer" : null,
        userId: admin.id,
        leadId: admin.leadId,
        rootFolderId: DefaultFolderId.PRIVATE,
      };
      const result = await StaleRunReaperRepository.reapThread(
        forged,
        cutoffs(),
        defaultLocale,
        logger,
        noQueue,
      );
      expect(result.outcome).toBe("lost");
      const row = await threadRow(threadId);
      expect(row.state).toBe(ThreadStreamingState.STREAMING);
      expect(await interruptions(threadId)).toHaveLength(0);
    }
  });

  it("reaps a remote loop that went silent", async () => {
    const candidate = await candidateFor(ids.remoteStale);
    expect(candidate).toBeDefined();
    if (!candidate) {
      return;
    }
    const result = await StaleRunReaperRepository.reapThread(
      candidate,
      cutoffs(),
      defaultLocale,
      logger,
      noQueue,
    );
    expect(result.outcome).toBe("reaped");
    expect((await threadRow(ids.remoteStale)).state).toBe(
      ThreadStreamingState.IDLE,
    );
  });

  it("concurrent reapers reap once", async () => {
    const candidate = await candidateFor(ids.concurrent);
    expect(candidate).toBeDefined();
    if (!candidate) {
      return;
    }
    const results = await Promise.all(
      [0, 1, 2].map(() =>
        StaleRunReaperRepository.reapThread(
          candidate,
          cutoffs(),
          defaultLocale,
          logger,
          noQueue,
        ),
      ),
    );
    const outcomes = results.map((r) => r.outcome).toSorted();
    expect(outcomes).toEqual(["lost", "lost", "reaped"]);
    expect(await interruptions(ids.concurrent)).toHaveLength(1);
    expect((await threadRow(ids.concurrent)).state).toBe(
      ThreadStreamingState.IDLE,
    );
  });

  it("starts the queued message once the thread is free", async () => {
    const candidate = await candidateFor(ids.queued);
    expect(candidate).toBeDefined();
    if (!candidate) {
      return;
    }
    const started: Array<{ threadId: string; stateAtStart: string }> = [];
    const processQueued: ProcessQueuedFn = async ({ threadId }) => {
      // The real processor starts a normal stream: it must find the thread
      // idle (not queue again behind the dead run).
      started.push({
        threadId,
        stateAtStart: (await threadRow(threadId)).state,
      });
      return true;
    };
    const result = await StaleRunReaperRepository.reapThread(
      candidate,
      cutoffs(),
      defaultLocale,
      logger,
      processQueued,
    );
    expect(result).toEqual({ outcome: "reaped", queuedStarted: true });
    expect(started).toEqual([
      { threadId: ids.queued, stateAtStart: ThreadStreamingState.IDLE },
    ]);
    // The interruption goes after the dead turn, not after the queued message.
    const errors = await interruptions(ids.queued);
    expect(errors).toHaveLength(1);
    expect(errors[0]?.parentId).toBe(assistantIdOf.get(ids.queued));
  });

  it("does not replay a queue abandoned long ago", async () => {
    const candidate = await candidateFor(ids.queuedLongAgo);
    expect(candidate).toBeDefined();
    if (!candidate) {
      return;
    }
    let calls = 0;
    const result = await StaleRunReaperRepository.reapThread(
      candidate,
      cutoffs(),
      defaultLocale,
      logger,
      () => {
        calls++;
        return Promise.resolve(true);
      },
    );
    expect(result).toEqual({ outcome: "reaped", queuedStarted: false });
    expect(calls).toBe(0);
    expect((await threadRow(ids.queuedLongAgo)).state).toBe(
      ThreadStreamingState.IDLE,
    );
  });

  it("a run whose owner keeps beating is never a candidate", async () => {
    expect(await candidateFor(ids.beating)).toBeDefined();
    registerOwnedRun(runIdOf(ids.beating), ids.beating, logger);
    await beatOwnedRuns();
    expect(await candidateFor(ids.beating)).toBeUndefined();
  });
});
