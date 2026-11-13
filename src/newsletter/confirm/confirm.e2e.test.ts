/**
 * E2E: newsletter double opt-in page /story/newsletter/confirm/[token] — the
 * welcome email's link lands here with the token seeded; one click confirms and
 * the page says the free-credit bonus is live.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { eq } from "drizzle-orm";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { describe, expect } from "vitest";

import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import { db } from "../../vibe/database";
import { newsletterSubscriptions } from "../db";
import subscribeEndpoints from "../subscribe/definition";
import confirmEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = confirmEndpoints.POST;
const { t } = scopedTranslation.scopedT("en-GLOBAL");
const bonusCredits = FREE_CREDIT_ALLOWANCE.newsletterBonus;

async function subscribeAndGetToken(email: string): Promise<string | null> {
  const result = await sendTestRequest({
    endpoint: subscribeEndpoints.POST,
    data: { email },
    toolExecutionContext: undefined,
  });
  expect(result.success, JSON.stringify(result)).toBe(true);
  const [row] = await db
    .select({ token: newsletterSubscriptions.confirmationToken })
    .from(newsletterSubscriptions)
    .where(eq(newsletterSubscriptions.email, email))
    .limit(1);
  return row?.token ?? null;
}

async function confirmedAtOf(email: string): Promise<Date | null> {
  const [row] = await db
    .select({ confirmedAt: newsletterSubscriptions.confirmedAt })
    .from(newsletterSubscriptions)
    .where(eq(newsletterSubscriptions.email, email))
    .limit(1);
  return row?.confirmedAt ?? null;
}

async function removeSubscription(email: string): Promise<void> {
  await db
    .delete(newsletterSubscriptions)
    .where(eq(newsletterSubscriptions.email, email));
}

describe("E2E: newsletter confirm", () => {
  const e2e = useE2E("newsletter/confirm");

  e2e.it("the email link confirms in one click and shows the bonus", async ({ open, page, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("nl-confirm");
    cleanup(() => removeSubscription(email));
    const token = await subscribeAndGetToken(email);
    expect(token).toBeTruthy();
    if (!token) return;

    // SSR paints the button before React owns it - wait for the hydrated form
    const confirmButton = page
      .locator("[data-hydrated]")
      .getByRole("button", { name: t("widget.confirmButton") });
    const form = await open(endpoint, {
      path: `/story/newsletter/confirm/${encodeURIComponent(token)}`,
      ready: async () => {
        await confirmButton.waitFor({ state: "visible" });
      },
    });
    // Landing does not confirm by itself - mail scanners must not unlock it
    expect(await confirmedAtOf(email)).toBeNull();

    const result = await form.submit({ assertRequestBody: false });
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.requestBody).toMatchObject({ token });
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);

    await page
      .getByText(t("widget.confirmedTitle", { bonusCredits }))
      .waitFor({ state: "visible" });
    expect(await confirmedAtOf(email)).not.toBeNull();
  });

  e2e.it("a dead link shows the error instead of a fake success", async ({ open, page }) => {
    const form = await open(endpoint, {
      path: "/story/newsletter/confirm/no-such-token-000000000000",
      ready: async () => {
        await page
          .locator("[data-hydrated]")
          .getByRole("button", { name: t("widget.confirmButton") })
          .waitFor({ state: "visible" });
      },
    });
    const result = await form.submit({ assertRequestBody: false });
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success).toBe(false);
    // The form alert explains the dead link; the success view never renders
    await form.alert.waitFor({ state: "visible" });
    expect(await form.alert.innerText()).toContain(
      t("post.errors.notFound.description"),
    );
    expect(
      await page
        .getByText(t("widget.confirmedTitle", { bonusCredits }))
        .count(),
    ).toBe(0);
  });
});
