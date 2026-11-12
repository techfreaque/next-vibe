/**
 * Cancel of a thread whose stream process died.
 *
 * Regression for prod (thread 8c6f5547, 2026-11-11): a deploy restarted the
 * server mid-turn, the thread row stayed `streaming`, and the stop button
 * delivered a cancel to a stream that no longer existed. Nothing emitted
 * stream-finished, so the client sat in "aborting" until its 15s safety
 * timeout. The cancel path now reaps the orphaned state itself.
 */

import { eq } from "drizzle-orm";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { chatThreads } from "../../chat/db";
import { ThreadStreamingState } from "../../chat/enum";
import cancelEndpoints from "./definition";

const endpoint = cancelEndpoints.POST;

async function readState(
  threadId: string,
): Promise<{ state: string | null; runId: string | null }> {
  const [row] = await db
    .select({
      state: chatThreads.streamingState,
      runId: chatThreads.streamingRunId,
    })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId))
    .limit(1);
  return { state: row?.state ?? null, runId: row?.runId ?? null };
}

describe("POST /agent/ai-stream/cancel - orphaned stream", () => {
  let admin: JwtPrivatePayloadType;
  const threadId = crypto.randomUUID();

  beforeAll(async () => {
    admin = await resolveTestAdminUser();
    await db.insert(chatThreads).values({
      id: threadId,
      userId: admin.id,
      leadId: admin.leadId,
      title: "orphan-reap test",
      rootFolderId: DefaultFolderId.PRIVATE,
      // The DB says a stream is live, but no process owns it.
      streamingState: ThreadStreamingState.STREAMING,
      streamingRunId: `orphan-${threadId}`,
    });
  });

  afterAll(async () => {
    await db.delete(chatThreads).where(eq(chatThreads.id, threadId));
  });

  it("clears the streaming state when no live stream finalizes the cancel", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      user: admin,
      data: { threadId },
    });
    expect(res.success, JSON.stringify(res)).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.cancelled).toBe(true);
    expect((await readState(threadId)).state).toBe(
      ThreadStreamingState.ABORTING,
    );

    // Reaper fires after 8s; poll a little past that.
    const deadline = Date.now() + 12_000;
    let current = await readState(threadId);
    while (
      current.state === ThreadStreamingState.ABORTING &&
      Date.now() < deadline
    ) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      current = await readState(threadId);
    }
    expect(current.state).toBe(ThreadStreamingState.IDLE);
    expect(current.runId).toBeNull();
  }, 20_000);
});
