/**
 * E2E: describe-video tool page — real browser against the running server.
 * Vision calls record once into src/generated/ai-fixtures/http-cache/e2e-vibe-agent-describe-video-<test>/
 * and replay on every later run (delete the folder to re-record).
 */

import { describe, expect } from "vitest";

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { createE2ECreditUser } from "../ai-stream/testing/e2e-credit-user";
import describeVideoEndpoints from "./definition";

const endpoint = describeVideoEndpoints.POST;
/**
 * 30KB silent 1s clip (Chromium media test data). OpenRouter can't take video
 * by URL, so the server downloads it — through the fixture chain.
 */
const VIDEO_URL =
  "https://raw.githubusercontent.com/chromium/chromium/main/media/test/data/bear_silent.mp4";

describe("E2E: describe video", () => {
  const e2e = useE2E("vibe/agent/describe-video", { fixtures: true });

  e2e.it("describes a video by URL and shows the description", async ({ open, page, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("describe-video", 50);
    cleanup(buyer.remove);
    await loginAs(buyer.user);

    const form = await open(endpoint);
    await form.fill({
      fileUrl: VIDEO_URL,
      context: "Answer in one short sentence.",
    });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    if (!result.response.success) return;
    const description = result.response.data.text;
    expect(description.length).toBeGreaterThan(0);

    // The widget renders the returned description
    await page.getByText(description.slice(0, 30), { exact: false }).first().waitFor({ state: "visible" });
  });

  e2e.it("blocks a value that is not a URL before sending", async ({ open }) => {
    const form = await open(endpoint);
    await form.fill({ fileUrl: "not a url" });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["fileUrl"]);
  });
});
