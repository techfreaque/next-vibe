/**
 * E2E: newsletter subscribe — the tool form (multiselect preferences) and the
 * hand-built /story/newsletter page, which calls the same endpoint.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { describe, expect } from "vitest";

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
});
