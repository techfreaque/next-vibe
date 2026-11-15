/**
 * E2E: newsletter subscribe — the tool form (multiselect preferences) and the
 * hand-built /story/newsletter page, which calls the same endpoint.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { randomUUID } from "node:crypto";

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { describe, expect } from "vitest";

import { LEAD_ID_COOKIE_NAME } from "@/env/constants";

import { NewsletterPreference } from "../enum";
import unsubscribeEndpoints from "../unsubscribe/definition";
import subscribeEndpoints from "./definition";

const endpoint = subscribeEndpoints.POST;

async function unsubscribe(email: string): Promise<void> {
  await sendTestRequest({
    endpoint: unsubscribeEndpoints.POST,
    data: { email },
    toolExecutionContext: undefined,
  });
}

describe("E2E: newsletter subscribe", () => {
  const e2e = useE2E("newsletter/subscribe");

  e2e.it("subscribes with topic preferences picked in the multiselect", async ({ open, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("newsletter");
    cleanup(() => unsubscribe(email));

    const form = await open(endpoint);
    await form.fill({
      email,
      name: "E2E Newsletter",
      preferences: [NewsletterPreference.PRODUCT_NEWS, NewsletterPreference.EVENTS],
    });

    // submit() also asserts the request body carries exactly the picked preferences
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
  });

  e2e.it("blocks a malformed email before sending", async ({ open }) => {
    const form = await open(endpoint);
    await form.fill({ email: "not-an-email" });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["email"]);
  });

  e2e.it("subscribes from the newsletter landing page", async ({ goto, page, capture, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("newsletter-page");
    cleanup(() => unsubscribe(email));

    await goto("/story/newsletter");
    // Typing into SSR markup is wiped by hydration — wait for <Form> to own it
    const input = page.locator("[data-hydrated] #newsletter-email-page");
    await input.fill(email);

    const call = await capture(endpoint, async () => {
      await input.press("Enter");
    });
    expect(call.requestBody).toMatchObject({ email });
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
  });

  e2e.it("subscribes when the lead cookie points at a lead that no longer exists", async ({ goto, page, capture, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("newsletter-stale-lead");
    cleanup(() => unsubscribe(email));

    await goto("/story/newsletter");
    const input = page.locator("[data-hydrated] #newsletter-email-page");
    await input.waitFor();
    // A well-formed id no lead row has (DB reset / deleted lead), set after
    // the page load so only the API call carries it.
    const pageCookies = await page.context().cookies(page.url());
    expect(pageCookies.map((c) => c.name)).toContain(LEAD_ID_COOKIE_NAME);
    const staleLeadId = randomUUID();
    // Same host + path "/" as the real cookie, so it replaces it
    await page.context().addCookies([
      {
        name: LEAD_ID_COOKIE_NAME,
        value: staleLeadId,
        domain: new URL(page.url()).hostname,
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
      },
    ]);
    await input.fill(email);

    const call = await capture(endpoint, async () => {
      await input.press("Enter");
    });
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    // The server minted a live lead and rewrote the cookie
    const after = await page.context().cookies(page.url());
    const leadCookies = after.filter((c) => c.name === LEAD_ID_COOKIE_NAME);
    expect(leadCookies).toHaveLength(1);
    expect(leadCookies[0]?.value).toBeTruthy();
    expect(leadCookies[0]?.value).not.toBe(staleLeadId);
    if (call.response.success) {
      expect(call.response.data.leadId).toBe(leadCookies[0]?.value);
    }
  });
});
