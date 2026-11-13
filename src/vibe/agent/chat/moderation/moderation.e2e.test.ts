/**
 * E2E: report + moderation queue - real browser against the running server.
 * Requires a server (Atlas dev by default): `vibe dev`.
 *
 * A visitor sees the report button on a public thread and reports it through
 * the form; once enough people have, the thread leaves the feed; an admin
 * finds it in the queue and restores it.
 */

import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { describe, expect } from "vitest";

import { chatThreads } from "../db";
import { ThreadModerationStatus, ThreadReportReason } from "../enum";
import {
  chatReady,
  createE2EUser,
  deleteE2EUser,
  seedThread,
  suppressWelcomeTour,
} from "../testing/e2e-seed";
import reportEndpoints from "../threads/[threadId]/report/definition";
import { THREAD_AUTO_HIDE_REPORT_THRESHOLD } from "./constants";
import moderationEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

describe("E2E: report + moderation queue", () => {
  const e2e = useE2E("agent/chat/moderation");
  const { t } = scopedTranslation.scopedT(defaultLocale);

  e2e.it("a visitor reports a public thread; at the threshold it is hidden; an admin restores it", async (fixtures) => {
    const { page, context, open, capture, loginAs, uniqueEmail, cleanup } =
      fixtures;
    const author = await createE2EUser(uniqueEmail("mod-author"));
    cleanup(() => deleteE2EUser(author));
    const title = `E2E mod ${Date.now()} thread`;
    const threadId = await seedThread(author, {
      rootFolderId: DefaultFolderId.PUBLIC,
      title,
      published: true,
    });
    cleanup(async () => {
      await db.delete(chatThreads).where(eq(chatThreads.id, threadId));
    });

    // The report button shows on a public thread, for a guest
    await suppressWelcomeTour(context);
    await fixtures.gotoReady(`/threads/public/${threadId}`, chatReady(page));
    await page.getByTestId("report-thread-button").waitFor();

    // Report through the form
    const form = await open(reportEndpoints.POST, {
      query: { threadId },
    });
    await form.fill({ reason: ThreadReportReason.SPAM, note: "E2E spam" });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) {
      return;
    }
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);

    // Other visitors push it over the threshold
    for (let i = 1; i < THREAD_AUTO_HIDE_REPORT_THRESHOLD; i++) {
      const res = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: reportEndpoints.POST,
        urlPathParams: { threadId },
        data: { reason: ThreadReportReason.SPAM },
        user: {
          isPublic: true,
          leadId: randomUUID(),
          roles: [UserPermissionRole.PUBLIC],
        },
      });
      expect(res.success).toBe(true);
    }
    const [hidden] = await db
      .select({ status: chatThreads.moderationStatus })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId));
    expect(hidden?.status).toBe(ThreadModerationStatus.UNDER_REVIEW);

    // Admin: the queue lists it; dismiss restores it
    const admin = await resolveTestAdminUser();
    await loginAs(admin);
    const queue = await open(moderationEndpoints.GET, {
      ready: async (p) => {
        await p.getByTestId("chat-moderation").waitFor();
      },
    });
    await queue.page.getByText(title, { exact: true }).waitFor();
    const dismissed = await capture(moderationEndpoints.PATCH, () =>
      queue.page
        .getByTestId(`moderation-row-${threadId}`)
        .getByTestId("moderation-dismiss")
        .click(),
    );
    expect(
      dismissed.response.success,
      JSON.stringify(dismissed.response),
    ).toBe(true);
    const [restored] = await db
      .select({ status: chatThreads.moderationStatus })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId));
    expect(restored?.status).toBe(ThreadModerationStatus.VISIBLE);
    expect(t("get.action.dismiss")).toBeTruthy();
  });
});
