/**
 * E2E: newsletter status — the /tools form, plus the real product trigger:
 * the unsubscribe page checks the typed address's status before acting.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { describe, expect } from "vitest";

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";

import { NewsletterSubscriptionStatus } from "../enum";
import subscribeEndpoints from "../subscribe/definition";
import unsubscribeEndpoints from "../unsubscribe/definition";
import statusEndpoints from "./definition";

const endpoint = statusEndpoints.GET;

async function subscribe(email: string): Promise<void> {
  const result = await sendTestRequest({
    endpoint: subscribeEndpoints.POST,
    data: { email },
    toolExecutionContext: undefined,
  });
  expect(result.success, JSON.stringify(result)).toBe(true);
}

async function unsubscribe(email: string): Promise<void> {
  await sendTestRequest({
    endpoint: unsubscribeEndpoints.POST,
    data: { email },
    toolExecutionContext: undefined,
  });
}

describe("E2E: newsletter status", () => {
  const e2e = useE2E("newsletter/status");

  e2e.it("reports a subscribed address as subscribed", async ({ open, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("nl-status");
    await subscribe(email);
    cleanup(() => unsubscribe(email));

    const form = await open(endpoint);
    await form.fill({ email });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    if (!result.response.success) return;
    expect(result.response.data).toEqual({
      subscribed: true,
      status: NewsletterSubscriptionStatus.SUBSCRIBED,
    });
  });

  e2e.it("reports an unknown address as not subscribed", async ({ open, uniqueEmail }) => {
    const form = await open(endpoint);
    await form.fill({ email: uniqueEmail("nl-status-unknown") });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    if (!result.response.success) return;
    expect(result.response.data.subscribed).toBe(false);
  });

  e2e.it("blocks a malformed email before sending", async ({ open }) => {
    const form = await open(endpoint);
    await form.fill({ email: "not-an-email" });
    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["email"]);
  });

  e2e.it("the unsubscribe page checks the status of the typed address", async ({ open, capture, uniqueEmail, cleanup }) => {
    const email = uniqueEmail("nl-status-page");
    await subscribe(email);
    cleanup(() => unsubscribe(email));

    const form = await open(unsubscribeEndpoints.POST, {
      path: "/story/newsletter/unsubscribe",
    });
    const call = await capture(endpoint, async () => {
      await form.fill({ email });
    });
    expect(call.requestBody).toMatchObject({ email });
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    if (!call.response.success) return;
    expect(call.response.data.subscribed).toBe(true);
  });
});
