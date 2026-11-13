/**
 * E2E: view-image tool page — real browser against the running server.
 * The external image fetch records once into src/generated/ai-fixtures/http-cache/e2e-vibe-agent-view-image-<test>/
 * and replays on every later run (delete the folder to re-record).
 */

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import viewImageEndpoints from "./definition";

const endpoint = viewImageEndpoints.POST;
const IMAGE_URL =
  "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";

describe("E2E: view image", () => {
  const e2e = useE2E("vibe/agent/view-image", { fixtures: true });

  e2e.it("fetches an image by URL and shows it", async ({ open, page }) => {
    const form = await open(endpoint);
    await form.fill({ url: IMAGE_URL });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response).slice(0, 500)).toBe(true);

    // The fetched image is rendered inline from the returned bytes
    const img = page.locator('img[src^="data:image/png;base64,"]').first();
    await img.waitFor({ state: "visible" });
  });

  e2e.it("reports a missing image instead of rendering nothing", async ({ open }) => {
    const form = await open(endpoint);
    await form.fill({ url: "https://www.google.com/images/e2e-does-not-exist.png" });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success).toBe(false);
    await form.alert.waitFor({ state: "visible" });
  });

  e2e.it("blocks a value that is not a URL before sending", async ({ open }) => {
    const form = await open(endpoint);
    await form.fill({ url: "not a url" });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["url"]);
  });
});
