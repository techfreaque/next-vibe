/**
 * E2E: lead engagement tracking.
 *  - POST (record-engagement): every page visit fires it via LeadTrackingProvider;
 *    the /tools form records a chosen engagement type.
 *  - GET (track-click): the /track page an email link lands on records the click
 *    and redirects; the /tools form runs the same query.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { eq } from "drizzle-orm";
import { leadEngagements } from "next-vibe/identity/lead/db";
import { EngagementTypes } from "next-vibe/identity/lead/enum";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { db } from "../../vibe/database";
import trackingEndpoints from "./definition";
import { signRedirectUrl } from "./redirect-signature";

async function removeEngagement(id: string): Promise<void> {
  await db.delete(leadEngagements).where(eq(leadEngagements.id, id));
}

describe("E2E: lead engagement tracking", () => {
  const e2e = useE2E("leads/tracking");

  e2e.it("a page visit records a website-visit engagement", async ({ goto, capture, cleanup }) => {
    const call = await capture(trackingEndpoints.POST, () => goto("/story/newsletter"), 60_000);
    expect(call.requestBody).toMatchObject({
      engagementType: EngagementTypes.WEBSITE_VISIT,
    });
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    if (!call.response.success) return;
    const { id } = call.response.data;
    cleanup(() => removeEngagement(id));
    expect(call.response.data.responseEngagementType).toBe(
      EngagementTypes.WEBSITE_VISIT,
    );
  });

  e2e.it("records an engagement picked in the form", async ({ open, page, cleanup }) => {
    const form = await open(trackingEndpoints.POST);
    // The layout's visit beacon shares this endpoint — let it land first so
    // submit() resolves with the form's own call
    const visit = await form.firstCall();
    if (visit.response.success) {
      const visitId = visit.response.data.id;
      cleanup(() => removeEngagement(visitId));
    }

    await form.fill({ engagementType: EngagementTypes.FORM_SUBMIT });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    if (!result.response.success) return;
    const { id } = result.response.data;
    cleanup(() => removeEngagement(id));

    // The widget swaps the form for the recorded engagement
    await page.getByText(id).waitFor({ state: "visible" });
  });

  e2e.it("blocks a submit without an engagement type", async ({ open, cleanup }) => {
    const form = await open(trackingEndpoints.POST);
    // The layout's visit beacon shares this endpoint — a late one would pass
    // for a sent submit, so let it land first
    const visit = await form.firstCall();
    if (visit.response.success) {
      const visitId = visit.response.data.id;
      cleanup(() => removeEngagement(visitId));
    }
    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toContain("engagementType");
  });

  e2e.it("an email link landing on /track records the click and redirects", async ({ goto, page, capture }) => {
    const destination = "/en-GLOBAL/story/newsletter";
    const call = await capture(trackingEndpoints.GET, () => goto(`/track?url=${encodeURIComponent(destination)}`), 60_000);
    expect(call.requestBody).toMatchObject({ url: destination });
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    if (!call.response.success) return;
    expect(call.response.data.redirectUrl).toBe(destination);
    await page.waitForURL((url) => url.pathname === destination);
  });

  e2e.it("never forwards to an unsigned external URL (open redirect)", async ({ goto, page, capture }) => {
    const destination = "https://evil.example.com/phish";
    const call = await capture(trackingEndpoints.GET, async () => {
      await page.route("https://evil.example.com/**", (route) => route.abort());
      await goto(`/track?url=${encodeURIComponent(destination)}`);
    }, 60_000);
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    if (!call.response.success) return;
    expect(call.response.data.redirectUrl).toBe(`/${E2E_LOCALE}`);
  });

  e2e.it("forwards to an external URL our own link signed", async ({ goto, page, capture }) => {
    const destination = "https://example.com/partner";
    // Don't leave the sandbox: the redirect itself is what's asserted
    await page.route("https://example.com/**", (route) =>
      route.fulfill({ status: 200, body: "ok" }),
    );
    const call = await capture(trackingEndpoints.GET, async () => {
      await goto(
        `/track?url=${encodeURIComponent(destination)}&sig=${signRedirectUrl(destination)}`,
      );
    }, 60_000);
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    if (!call.response.success) return;
    expect(call.response.data.redirectUrl).toBe(destination);
    await page.waitForURL(destination);
  });

  e2e.it("runs a click-tracking query from the form", async ({ open }) => {
    const form = await open(trackingEndpoints.GET);
    // The query runs once on mount with its defaults; the form query comes next
    await form.firstCall();
    const destination = "/en-GLOBAL/story";
    await form.fill({ url: destination });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    if (!result.response.success) return;
    expect(result.response.data.redirectUrl).toBe(destination);
    expect(result.response.data.engagementRecorded).toBe(false);
  });
});
