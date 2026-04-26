/**
 * Support System Test Suite
 *
 * Part A: Auto-generated endpoint tests (schema, auth, examples).
 * Part B: Integration tests for the escalate → join → message → close flow.
 */

import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { db } from "@/app/api/[locale]/system/db";
import { testEndpoint } from "@/app/api/[locale]/system/check/testing/testing-suite";
import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";
import { env } from "@/config/env";
import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";

import { supportSessions } from "./db";
import sessionsEndpoint from "./sessions/definition";
import escalateEndpoint from "./escalate/definition";
import notifyEndpoint from "./notify/definition";
import joinEndpoint from "./join/definition";
import sessionJoinedEndpoint from "./session-joined/definition";
import messageEndpoint from "./message/definition";
import closeEndpoint from "./close/definition";

// ── Part A: Auto-generated endpoint tests ────────────────────────────────────

testEndpoint(sessionsEndpoint.GET);
testEndpoint(escalateEndpoint.POST);
testEndpoint(notifyEndpoint.POST);
testEndpoint(joinEndpoint.POST);
testEndpoint(sessionJoinedEndpoint.POST);
testEndpoint(messageEndpoint.POST);
testEndpoint(closeEndpoint.POST);

// ── Part B: Integration Tests ────────────────────────────────────────────────

const TEST_TIMEOUT = 60_000;

async function resolveUser(
  email: string,
): Promise<JwtPrivatePayloadType | null> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const result = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  if (!result.success || !result.data) {
    return null;
  }
  const user = result.data;

  const [link, roleRows] = await Promise.all([
    db.query.userLeadLinks.findFirst({
      where: (ul, { eq: eql }) => eql(ul.userId, user.id),
    }),
    db.select().from(userRoles).where(eq(userRoles.userId, user.id)),
  ]);

  if (!link) {
    return null;
  }

  const roles = roleRows
    .map((r) => r.role)
    .filter((r): r is (typeof UserRoleDB)[number] =>
      UserRoleDB.includes(r as (typeof UserRoleDB)[number]),
    );

  return {
    isPublic: false,
    id: user.id,
    leadId: link.leadId,
    roles,
  };
}

describe("Support System Integration", () => {
  let adminUser: JwtPrivatePayloadType;
  let testThreadId: string;
  let testSessionId: string;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    expect(
      resolved,
      `${env.VIBE_ADMIN_USER_EMAIL} not found - run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) {
      return;
    }
    adminUser = resolved;

    // Create a test thread for the support session
    const [thread] = await db
      .insert(chatThreads)
      .values({
        userId: adminUser.id,
        title: "Support Test Thread",
        rootFolderId: DefaultFolderId.PRIVATE,
      })
      .returning({ id: chatThreads.id });
    expect(thread, "Failed to create test thread").toBeTruthy();
    testThreadId = thread.id;
  }, TEST_TIMEOUT);

  afterAll(async () => {
    // Clean up test data
    if (testSessionId) {
      await db
        .delete(supportSessions)
        .where(eq(supportSessions.id, testSessionId));
    }
    if (testThreadId) {
      await db.delete(chatThreads).where(eq(chatThreads.id, testThreadId));
    }
  });

  let suiteFailed = false;
  function fit(name: string, fn: () => Promise<void>, timeout?: number): void {
    it(
      name,
      async () => {
        if (suiteFailed) {
          return;
        }
        try {
          await fn();
        } catch (err) {
          suiteFailed = true;
          // oxlint-disable-next-line restricted-syntax
          throw err;
        }
      },
      timeout ?? TEST_TIMEOUT,
    );
  }

  // ── S1: Escalate — create support session ─────────────────────────────────
  fit("S1: escalate creates a pending support session", async () => {
    const response = await sendTestRequest({
      endpoint: escalateEndpoint.POST,
      data: { threadId: testThreadId },
      user: adminUser,
    });

    expect(response.success, `Escalate failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.sessionId).toBeTruthy();
    testSessionId = response.data.sessionId;

    // Verify thread is now in "waiting" state
    const [thread] = await db
      .select({ streamingState: chatThreads.streamingState })
      .from(chatThreads)
      .where(eq(chatThreads.id, testThreadId));
    expect(thread.streamingState).toBe("waiting");
  });

  // ── S2: Duplicate escalation returns conflict ─────────────────────────────
  fit("S2: duplicate escalation returns conflict", async () => {
    const response = await sendTestRequest({
      endpoint: escalateEndpoint.POST,
      data: { threadId: testThreadId },
      user: adminUser,
    });

    expect(response.success).toBe(false);
  });

  // ── S3: List sessions shows pending session ───────────────────────────────
  fit("S3: list sessions includes the pending session", async () => {
    const response = await sendTestRequest({
      endpoint: sessionsEndpoint.GET,
      data: {},
      user: adminUser,
    });

    expect(response.success, `List failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    const found = response.data.sessions.find(
      (s: { id: string }) => s.id === testSessionId,
    );
    expect(found, "Session not found in list").toBeTruthy();
    expect(found?.status).toBe("pending");
  });

  // ── S4: Join session ──────────────────────────────────────────────────────
  fit("S4: join session activates it", async () => {
    // First manually update session to have customerInstanceId for the join to work
    await db
      .update(supportSessions)
      .set({ customerInstanceId: "test-instance" })
      .where(eq(supportSessions.id, testSessionId));

    const response = await sendTestRequest({
      endpoint: joinEndpoint.POST,
      data: { sessionId: testSessionId },
      user: adminUser,
    });

    expect(response.success, `Join failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }

    // Verify session is now active
    const [session] = await db
      .select({ status: supportSessions.status })
      .from(supportSessions)
      .where(eq(supportSessions.id, testSessionId));
    expect(session.status).toBe("active");
  });

  // ── S5: Send message ──────────────────────────────────────────────────────
  fit("S5: send message through support session", async () => {
    const response = await sendTestRequest({
      endpoint: messageEndpoint.POST,
      data: {
        sessionId: testSessionId,
        content: "Test support message",
      },
      user: adminUser,
    });

    expect(response.success, `Message failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.sent).toBe(true);
  });

  // ── S6: Close session ─────────────────────────────────────────────────────
  fit("S6: close session marks it as closed", async () => {
    const response = await sendTestRequest({
      endpoint: closeEndpoint.POST,
      data: { sessionId: testSessionId },
      user: adminUser,
    });

    expect(response.success, `Close failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.closed).toBe(true);

    // Verify session is now closed
    const [session] = await db
      .select({ status: supportSessions.status })
      .from(supportSessions)
      .where(eq(supportSessions.id, testSessionId));
    expect(session.status).toBe("closed");
  });

  // ── S7: List sessions no longer shows closed session ──────────────────────
  fit("S7: list sessions excludes closed session", async () => {
    const response = await sendTestRequest({
      endpoint: sessionsEndpoint.GET,
      data: {},
      user: adminUser,
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      return;
    }

    const found = response.data.sessions.find(
      (s: { id: string }) => s.id === testSessionId,
    );
    expect(found, "Closed session should not appear in list").toBeFalsy();
  });
});
