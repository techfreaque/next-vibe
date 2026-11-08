/**
 * Chat Moderation Test Suite - report -> auto-hide -> admin queue.
 *
 * Covers the PUBLIC feed and SHARED link read paths, the report rate limit,
 * and admin-only authorization on the moderation queue.
 */

import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { db } from "next-vibe/database";
import type { JwtPublicPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { testEndpoint } from "next-vibe/tooling/testing/testing-suite/test-endpoint";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";

import { chatThreads, threadReports, threadShareLinks } from "../db";
import {
  ThreadModerationAction,
  ThreadModerationStatus,
  ThreadReportReason,
} from "../enum";
import publicFeedEndpoints from "../public-feed/definition";
import {
  createE2EUser,
  deleteE2EUser,
  type E2EAccount,
  seedThread,
} from "../testing/e2e-seed";
import { scopedTranslation as shareLinksTranslation } from "../threads/[threadId]/share-links/i18n";
import { ShareLinksRepository } from "../threads/[threadId]/share-links/repository";
import reportEndpoints from "../threads/[threadId]/report/definition";
import {
  THREAD_AUTO_HIDE_REPORT_THRESHOLD,
  THREAD_AUTO_HIDE_SEVERE_THRESHOLD,
  THREAD_REPORT_MAX_PER_LEAD,
} from "./constants";
import moderationEndpoints from "./definition";

testEndpoint(reportEndpoints.POST);
testEndpoint(moderationEndpoints.GET);
testEndpoint(moderationEndpoints.PATCH);

function guest(): JwtPublicPayloadType {
  return {
    isPublic: true,
    leadId: randomUUID(),
    roles: [UserPermissionRole.PUBLIC],
  };
}

describe("Chat moderation", () => {
  let author: E2EAccount;
  let bystander: E2EAccount;
  let admin: Awaited<ReturnType<typeof resolveTestAdminUser>>;
  const createdThreads: string[] = [];
  const stamp = `mod${Date.now()}`;

  async function newThread(
    rootFolderId: DefaultFolderId,
    label: string,
  ): Promise<string> {
    const id = await seedThread(author, {
      rootFolderId,
      title: `${stamp} ${label}`,
      published: true,
      // Shared folders grant nothing by default; the owner opens it up
      rolesView: [UserPermissionRole.PUBLIC, UserPermissionRole.CUSTOMER],
    });
    createdThreads.push(id);
    return id;
  }

  async function report(
    threadId: string,
    reason: (typeof ThreadReportReason)[keyof typeof ThreadReportReason],
    who: JwtPublicPayloadType = guest(),
  ): ReturnType<
    typeof sendTestRequest<(typeof reportEndpoints)["POST"]>
  > {
    return sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: reportEndpoints.POST,
      urlPathParams: { threadId },
      data: { reason },
      user: who,
    });
  }

  async function feedHas(threadId: string): Promise<boolean> {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: publicFeedEndpoints.GET,
      data: { sortMode: "sortMode.new", page: 1, limit: 100, search: stamp },
      user: guest(),
    });
    if (!res.success) {
      throw new Error(`feed failed: ${res.message}`);
    }
    return res.data.items.some((i) => i.id === threadId);
  }

  async function statusOf(
    threadId: string,
  ): Promise<{ status: string; count: number }> {
    const [row] = await db
      .select({
        status: chatThreads.moderationStatus,
        count: chatThreads.reportCount,
      })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId));
    return { status: row?.status ?? "missing", count: row?.count ?? -1 };
  }

  beforeAll(async () => {
    author = await createE2EUser(`e2e-${randomUUID()}@example.test`);
    bystander = await createE2EUser(`e2e-${randomUUID()}@example.test`);
    admin = await resolveTestAdminUser();
  }, 60_000);

  afterAll(async () => {
    for (const id of createdThreads) {
      await db.delete(chatThreads).where(eq(chatThreads.id, id));
    }
    await deleteE2EUser(author);
    await deleteE2EUser(bystander);
  }, 60_000);

  it("reporting increments the count and keeps the item visible below the threshold", async () => {
    const id = await newThread(DefaultFolderId.PUBLIC, "below");
    const res = await report(id, ReportReasonSpam());
    expect(res.success).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.reportCount).toBe(1);
    expect(res.data.hidden).toBe(false);
    expect(await statusOf(id)).toEqual({
      status: ThreadModerationStatus.VISIBLE,
      count: 1,
    });
    expect(await feedHas(id)).toBe(true);
  });

  it("is idempotent per reporter", async () => {
    const id = await newThread(DefaultFolderId.PUBLIC, "dupe");
    const who = guest();
    expect((await report(id, ReportReasonSpam(), who)).success).toBe(true);
    const second = await report(id, ReportReasonSpam(), who);
    expect(second.success).toBe(false);
    expect((await statusOf(id)).count).toBe(1);
  });

  it("the author cannot report their own thread", async () => {
    const id = await newThread(DefaultFolderId.PUBLIC, "own");
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: reportEndpoints.POST,
      urlPathParams: { threadId: id },
      data: { reason: ThreadReportReason.SPAM },
      user: author.user,
    });
    expect(res.success).toBe(false);
  });

  it("crossing the threshold hides the item from the feed, then dismiss restores it", async () => {
    const id = await newThread(DefaultFolderId.PUBLIC, "threshold");
    for (let i = 0; i < THREAD_AUTO_HIDE_REPORT_THRESHOLD; i++) {
      const res = await report(id, ThreadReportReason.ABUSE);
      expect(res.success).toBe(true);
    }
    expect(await statusOf(id)).toEqual({
      status: ThreadModerationStatus.UNDER_REVIEW,
      count: THREAD_AUTO_HIDE_REPORT_THRESHOLD,
    });
    expect(await feedHas(id)).toBe(false);

    // Admin queue lists it
    const queue = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: moderationEndpoints.GET,
      data: { minReports: 1, limit: 200 },
      user: admin,
    });
    expect(queue.success).toBe(true);
    if (!queue.success) {
      return;
    }
    const row = queue.data.threads.find((t) => t.id === id);
    expect(row?.moderationStatus).toBe(ThreadModerationStatus.UNDER_REVIEW);
    expect(row?.reasons).toContain(ThreadReportReason.ABUSE);

    // Dismiss restores
    const dismissed = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: moderationEndpoints.PATCH,
      data: { id, action: ThreadModerationAction.DISMISS },
      user: admin,
    });
    expect(dismissed.success).toBe(true);
    expect(await statusOf(id)).toEqual({
      status: ThreadModerationStatus.VISIBLE,
      count: 0,
    });
    expect(await feedHas(id)).toBe(true);
  });

  it("severe reports (child safety) hide faster", async () => {
    const id = await newThread(DefaultFolderId.PUBLIC, "severe");
    for (let i = 0; i < THREAD_AUTO_HIDE_SEVERE_THRESHOLD; i++) {
      await report(id, ThreadReportReason.CSAM_FLAG);
    }
    expect((await statusOf(id)).status).toBe(
      ThreadModerationStatus.UNDER_REVIEW,
    );
    expect(await feedHas(id)).toBe(false);
  });

  it("shared links go dark once the thread is hidden", async () => {
    const id = await newThread(DefaultFolderId.SHARED, "shared");
    const token = `tok${randomUUID().replaceAll("-", "")}`;
    await db.insert(threadShareLinks).values({
      threadId: id,
      createdBy: author.user.id,
      token,
    });
    const logger = createEndpointLogger(false, defaultLocale);
    const { t } = shareLinksTranslation.scopedT(defaultLocale);

    const before = await ShareLinksRepository.getByToken(token, t, logger);
    expect(before.success).toBe(true);

    for (let i = 0; i < THREAD_AUTO_HIDE_REPORT_THRESHOLD; i++) {
      await report(id, ThreadReportReason.SPAM);
    }
    const after = await ShareLinksRepository.getByToken(token, t, logger);
    expect(after.success).toBe(false);

    // Admin removal keeps it dark; dismiss brings it back
    const removed = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: moderationEndpoints.PATCH,
      data: { id, action: ThreadModerationAction.REMOVE },
      user: admin,
    });
    expect(removed.success).toBe(true);
    expect((await statusOf(id)).status).toBe(ThreadModerationStatus.REMOVED);
    expect((await ShareLinksRepository.getByToken(token, t, logger)).success).toBe(false);

    await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: moderationEndpoints.PATCH,
      data: { id, action: ThreadModerationAction.DISMISS },
      user: admin,
    });
    expect((await ShareLinksRepository.getByToken(token, t, logger)).success).toBe(true);
  });

  it("remove hides a feed item and ban-author bans the account", async () => {
    const id = await newThread(DefaultFolderId.PUBLIC, "ban");
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: moderationEndpoints.PATCH,
      data: { id, action: ThreadModerationAction.BAN_AUTHOR },
      user: admin,
    });
    expect(res.success).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.patchStatus).toBe(ThreadModerationStatus.REMOVED);
    expect(res.data.authorBanned).toBe(true);
    expect(await feedHas(id)).toBe(false);
    const [row] = await db
      .select({ banned: users.isBanned })
      .from(users)
      .where(eq(users.id, author.user.id));
    expect(row?.banned).toBe(true);
  });

  it("rate-limits reports per lead", async () => {
    const who = guest();
    for (let i = 0; i < THREAD_REPORT_MAX_PER_LEAD; i++) {
      const id = await newThread(DefaultFolderId.PUBLIC, `rate${i}`);
      expect((await report(id, ThreadReportReason.SPAM, who)).success).toBe(true);
    }
    const extra = await newThread(DefaultFolderId.PUBLIC, "rate-extra");
    const blocked = await report(extra, ThreadReportReason.SPAM, who);
    expect(blocked.success).toBe(false);
    expect((await statusOf(extra)).count).toBe(0);
    const rows = await db
      .select({ id: threadReports.id })
      .from(threadReports)
      .where(eq(threadReports.threadId, extra));
    expect(rows).toHaveLength(0);
  }, 60_000);

  it("only admins can use the moderation queue", async () => {
    const id = await newThread(DefaultFolderId.PUBLIC, "authz");
    const list = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: moderationEndpoints.GET,
      data: {},
      user: bystander.user,
    });
    expect(list.success).toBe(false);
    const patch = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: moderationEndpoints.PATCH,
      data: { id, action: ThreadModerationAction.REMOVE },
      user: bystander.user,
    });
    expect(patch.success).toBe(false);
    expect((await statusOf(id)).status).toBe(ThreadModerationStatus.VISIBLE);
    const anon = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: moderationEndpoints.PATCH,
      data: { id, action: ThreadModerationAction.REMOVE },
      user: guest(),
    });
    expect(anon.success).toBe(false);
  });
});

function ReportReasonSpam(): typeof ThreadReportReason.SPAM {
  return ThreadReportReason.SPAM;
}
