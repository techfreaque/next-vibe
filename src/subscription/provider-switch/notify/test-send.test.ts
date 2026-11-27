/**
 * Plan move notice: the admin testRecipient send goes through the real
 * platform mailer composition (subject, From, inline cid logo), ignores the
 * provider-live gate and never writes a subscription_switch_notices row.
 */

import { describe, expect, it } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import { sql } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  createMailSinkTransport,
  MAIL_SINK_DIR,
} from "../../../messenger/providers/email/mail-sink";
import { EMAIL_LOGO_CID } from "../../../messenger/providers/email/smtp-client/email-logo";
import { subscriptionSwitchNotices } from "../db";
import { getActiveSwitchTarget } from "../targets";
import { planMoveNoticeIntroKey, planMoveNoticeSubjectKey } from "./email";
import { scopedTranslation } from "./i18n";
import { PlanMoveNoticeRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT("en-US");

async function noticeCount(): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(subscriptionSwitchNotices);
  return row?.count ?? 0;
}

async function findSinkedMail(recipient: string): Promise<string> {
  const files = await readdir(MAIL_SINK_DIR);
  const match = files.find((file) => file.includes(recipient));
  if (!match) {
    return "";
  }
  return readFile(join(MAIL_SINK_DIR, match), "utf8");
}

describe("plan move notice subject + intro variants", () => {
  it("leads with action + deadline, and never leaves an empty date", () => {
    expect(planMoveNoticeSubjectKey({ pastDue: false, deadline: "x" })).toBe(
      "email.subject",
    );
    expect(planMoveNoticeSubjectKey({ pastDue: true, deadline: "x" })).toBe(
      "email.subjectPastDue",
    );
    expect(planMoveNoticeSubjectKey({ pastDue: false, deadline: "" })).toBe(
      "email.subjectNoDate",
    );
    expect(planMoveNoticeIntroKey({ pastDue: false, deadline: "" })).toBe(
      "email.introNoDate",
    );
  });
});

describe("plan move notice testRecipient", () => {
  it("sends the real mail to one address, ignores the gate, writes no notice row", async () => {
    // The switch provider is not live in tests: a real run would be refused.
    expect(getActiveSwitchTarget()).toBeNull();
    const before = await noticeCount();
    const recipient = `switch-test-${Date.now()}@example.com`;

    const result = await PlanMoveNoticeRepository.sendTest(
      { testRecipient: recipient, locale: "en-US" },
      logger,
      t,
      {
        name: "test capture",
        fromEmail: "hi@unbottled.ai",
        fromName: "Unbottled.ai",
        transport: createMailSinkTransport(logger),
      },
    );

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data.testSentTo).toBe(recipient);
    expect(result.data.sent).toBe(1);
    expect(result.data.previewSubject).toContain("Move your plan by");
    expect(await noticeCount()).toBe(before);

    const raw = await findSinkedMail(recipient);
    expect(raw).toContain("From: \"Unbottled.ai\" <hi@unbottled.ai>");
    expect(raw).toContain("multipart/related");
    expect(raw).toContain(`Content-ID: <${EMAIL_LOGO_CID}>`);
    expect(raw).toContain("Content-Type: image/png");
    expect(raw).toContain("Content-Disposition: inline");
    expect(raw).not.toMatch(/src=3D"https?:/);
  });
});
