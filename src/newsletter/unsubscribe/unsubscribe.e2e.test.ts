/**
 * E2E: newsletter unsubscribe — the customer pages /story/newsletter/unsubscribe
 * (typed address) and /story/newsletter/unsubscribe/[email] (email deep link).
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { eq } from "drizzle-orm";
import { describe, expect } from "vitest";

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";

import { db } from "../../vibe/database";
import { newsletterSubscriptions } from "../db";
import { NewsletterSubscriptionStatus } from "../enum";
import subscribeEndpoints from "../subscribe/definition";
import unsubscribeEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = unsubscribeEndpoints.POST;
const PAGE = "/story/newsletter/unsubscribe";
const { t } = scopedTranslation.scopedT("en-GLOBAL");

async function subscribe(email: string): Promise<void> {
  const result = await sendTestRequest({
    endpoint: subscribeEndpoints.POST,
    data: { email },
    toolExecutionContext: undefined,
  });
  expect(result.success, JSON.stringify(result)).toBe(true);
}

async function statusOf(email: string): Promise<string | undefined> {
  const [row] = await db
    .select({ status: newsletterSubscriptions.status })
    .from(newsletterSubscriptions)
    .where(eq(newsletterSubscriptions.email, email))
    .limit(1);
  return row?.status;
}

async function removeSubscription(email: string): Promise<void> {
  await db
    .delete(newsletterSubscriptions)
    .where(eq(newsletterSubscriptions.email, email));
}

describe("E2E: newsletter unsubscribe", () => {
  const e2e = useE2E("newsletter/unsubscribe");

  e2e.it("unsubscribes a typed address and confirms it on the page", async ({ open, page, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("nl-unsub");
    await subscribe(email);
    cleanup(() => removeSubscription(email));

    const form = await open(endpoint, { path: PAGE });
    await form.fill({ email });
    // The page tells the visitor the address is on the list before they act
    await page
      .getByText(t("unsubscribe.page.status.subscribed"))
      .waitFor({ state: "visible" });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);

    await page
      .getByText(t("subscription.unsubscribe.success"))
      .waitFor({ state: "visible" });
    expect(await statusOf(email)).toBe(NewsletterSubscriptionStatus.UNSUBSCRIBED);
  });

  e2e.it("the email deep link arrives prefilled and unsubscribes in one click", async ({ open, page, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("nl-unsub-link");
    await subscribe(email);
    cleanup(() => removeSubscription(email));

    const form = await open(endpoint, {
      path: `${PAGE}/${encodeURIComponent(email)}`,
    });
    // The deep link's address is seeded into the field — no typing needed
    await page.waitForFunction(
      (value) =>
        document.querySelector<HTMLInputElement>(
          '[data-hydrated] [data-field="email"] input',
        )?.value === value,
      email,
    );

    const result = await form.submit({ assertRequestBody: false });
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.requestBody).toMatchObject({ email });
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);

    await page
      .getByText(t("subscription.unsubscribe.success"))
      .waitFor({ state: "visible" });
    expect(await statusOf(email)).toBe(NewsletterSubscriptionStatus.UNSUBSCRIBED);
  });

  e2e.it("records an opt-out for an address that never subscribed", async ({ open, page, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("nl-unsub-optout");
    cleanup(() => removeSubscription(email));

    const form = await open(endpoint, { path: PAGE });
    await form.fill({ email });
    await page
      .getByText(t("unsubscribe.page.status.notSubscribed"))
      .waitFor({ state: "visible" });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    expect(await statusOf(email)).toBe(NewsletterSubscriptionStatus.UNSUBSCRIBED);
  });

  e2e.it("blocks a malformed email before sending", async ({ open }) => {
    const form = await open(endpoint, { path: PAGE });
    await form.fill({ email: "not-an-email" });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["email"]);
  });

  e2e.it("blocks an empty submit", async ({ open }) => {
    const form = await open(endpoint, { path: PAGE });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["email"]);
  });
});
