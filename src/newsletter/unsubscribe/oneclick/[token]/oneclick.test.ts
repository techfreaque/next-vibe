/**
 * RFC 8058 one-click unsubscribe: token round-trip, suppression + journey exit,
 * idempotency, tamper rejection, and header policy (marketing vs transactional).
 * Requires the dev DB. Uses *.invalid addresses only; no mail is sent.
 */

import { eq } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";

import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";

import { lifecycleEnrollments } from "@/leads/lifecycle/db";
import {
  LifecycleEnrollmentStatus,
  LifecycleExitReason,
  LifecycleJourney,
} from "@/leads/lifecycle/enum";
import { buildListUnsubscribeHeaders } from "@/messenger/providers/email/list-unsubscribe";
import { newsletterSubscriptions } from "@/newsletter/db";
import { NewsletterSubscriptionStatus } from "@/newsletter/enum";

import definitions from "./definition";
import { signUnsubscribeToken, verifyUnsubscribeToken } from "../token";

const RUN = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const email = `oneclick-${RUN}@example-test.invalid`;
const publicUser = {
  isPublic: true as const,
  leadId: "00000000-0000-0000-0000-000000000002",
  roles: [UserPermissionRole.PUBLIC],
};

async function post(token: string): ReturnType<typeof sendTestRequest> {
  return await sendTestRequest({
    toolExecutionContext: undefined,
    endpoint: definitions.POST,
    urlPathParams: { token },
    user: publicUser,
  });
}

afterAll(async () => {
  await db.delete(lifecycleEnrollments).where(eq(lifecycleEnrollments.email, email));
  await db.delete(newsletterSubscriptions).where(eq(newsletterSubscriptions.email, email));
});

describe("one-click unsubscribe token", () => {
  it("round-trips and rejects tampering", () => {
    const token = signUnsubscribeToken(email);
    expect(verifyUnsubscribeToken(token)).toBe(email);
    const [payload, sig] = token.split(".");
    const other = Buffer.from("victim@example-test.invalid").toString("base64url");
    expect(payload).not.toBe(other);
    expect(verifyUnsubscribeToken(`${other}.${sig}`)).toBeNull();
    expect(verifyUnsubscribeToken(`${payload}.${"0".repeat(sig.length)}`)).toBeNull();
    expect(verifyUnsubscribeToken("garbage")).toBeNull();
    expect(verifyUnsubscribeToken("")).toBeNull();
  });
});

describe("POST newsletter/unsubscribe/oneclick/[token]", () => {
  it("rejects an invalid token and unsubscribes nobody", async () => {
    const res = await post(`${Buffer.from(email).toString("base64url")}.deadbeef`);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errorType.errorCode).toBe(ErrorResponseTypes.UNAUTHORIZED.errorCode);
    }
    const rows = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, email));
    expect(rows).toHaveLength(0);
  });

  it("valid token suppresses the address and exits journeys; repeat is idempotent", async () => {
    await db.insert(lifecycleEnrollments).values({
      email,
      journey: LifecycleJourney.NEWSLETTER_INVITE,
      locale: "en-GLOBAL",
      nextDueAt: new Date(Date.now() + 3_600_000),
    });
    const token = signUnsubscribeToken(email);

    const first = await post(token);
    expect(first.success, JSON.stringify(first)).toBe(true);

    const [sub] = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, email));
    expect(sub.status).toBe(NewsletterSubscriptionStatus.UNSUBSCRIBED);
    expect(sub.marketingConsent).toBe(false);

    const [enrollment] = await db
      .select()
      .from(lifecycleEnrollments)
      .where(eq(lifecycleEnrollments.email, email));
    expect(enrollment.status).toBe(LifecycleEnrollmentStatus.EXITED);
    expect(enrollment.exitReason).toBe(LifecycleExitReason.UNSUBSCRIBED);

    const second = await post(token);
    expect(second.success).toBe(true);
    const rows = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, email));
    expect(rows).toHaveLength(1);
  });
});

describe("List-Unsubscribe header policy", () => {
  it("marketing mail gets a POST-able one-click URL plus the Post header", () => {
    const headers = buildListUnsubscribeHeaders(
      email,
      "https://example.test/en-GLOBAL/story/newsletter/unsubscribe/x",
    );
    expect(headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    const match = /^<(https?:\/\/[^>]+\/api\/[^/]+\/newsletter\/unsubscribe\/oneclick\/([^>]+))>$/.exec(
      headers["List-Unsubscribe"],
    );
    expect(match).not.toBeNull();
    expect(verifyUnsubscribeToken(match?.[2] ?? "")).toBe(email);
    expect(headers["List-Unsubscribe"]).not.toContain("/story/");
  });

  it("transactional mail (no unsubscribeUrl) gets no unsubscribe headers", () => {
    expect(buildListUnsubscribeHeaders(email, undefined)).toEqual({});
  });
});
