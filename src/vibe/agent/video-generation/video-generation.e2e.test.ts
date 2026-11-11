/**
 * E2E: video generation tool page — real browser against the running server.
 * Paid provider call: recorded once into
 * src/generated/ai-fixtures/http-cache/e2e-vibe-agent-video-generation-<test>/,
 * replayed on every later run. Requires a server (Atlas dev): `vibe dev`.
 */

import { describe, expect } from "vitest";

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { createE2ECreditUser } from "../ai-stream/testing/e2e-credit-user";
import { submitAndAwaitResponse } from "../ai-stream/testing/e2e-slow-submit";
import videoGenerationEndpoints from "./definition";
import { VideoGenModelId } from "./models";

const endpoint = videoGenerationEndpoints.POST;
/**
 * Cheapest OpenRouter video per clip: Wan 2.7 at its 2s minimum
 * (10 credits/s → ~20 credits). Others bottom out at 3–4s.
 */
const CHEAP_MODEL = VideoGenModelId.WAN_2_7_T2V;
const SHORTEST_SECONDS = 2;
const PROMPT = "A red ball rolling across a white floor";

describe("E2E: video generation", () => {
  const e2e = useE2E("vibe/agent/video-generation", { fixtures: true });

  e2e.it("generates a short video from a prompt and plays it", async ({ open, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("video-gen", 200);
    cleanup(buyer.remove);
    await loginAs(buyer.user);

    const form = await open(endpoint, { query: { model: CHEAP_MODEL } });
    await form.fill({ prompt: PROMPT });
    // Duration presets are model-driven; the shortest is labelled "~2s"
    await form.root
      .getByRole("button")
      .filter({ hasText: `~${String(SHORTEST_SECONDS)}s` })
      .first()
      .click();

    // Video jobs submit + poll for minutes while recording; replays are instant
    const result = await submitAndAwaitResponse(form, 420_000);
    expect(result.requestBody).toMatchObject({
      prompt: PROMPT,
      model: CHEAP_MODEL,
      duration: SHORTEST_SECONDS,
    });
    expect(result.response.success, JSON.stringify(result.response).slice(0, 500)).toBe(true);
    if (!result.response.success) return;
    expect(result.response.data.videoUrl.length).toBeGreaterThan(0);
    // The returned URL must never be a bare relative "/path" — storage URLs are
    // built from runtime NEXT_PUBLIC_APP_URL and come back absolute (http...),
    // guarding the localhost/relative-URL regression. Standalone tool runs may
    // return the provider URL directly (http or inline data:), which is fine.
    expect(
      result.response.data.videoUrl.startsWith("http") ||
        result.response.data.videoUrl.startsWith("data:"),
      `expected an absolute http(s) url or data: uri, got ${result.response.data.videoUrl.slice(0, 80)}`,
    ).toBe(true);
    expect(
      result.response.data.videoUrl.startsWith("/"),
      `generated video url is relative (lost NEXT_PUBLIC_APP_URL prefix): ${result.response.data.videoUrl.slice(0, 80)}`,
    ).toBe(false);

    // The clip lands in a playable <video> element
    const video = form.root.locator("video[src], video source[src]").first();
    await video.waitFor({ state: "attached" });
    expect((await video.getAttribute("src"))?.length).toBeGreaterThan(0);
  }, 480_000);

  e2e.it("blocks an empty prompt client-side and flags the prompt field", async ({ open, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("video-gen-empty", 10);
    cleanup(buyer.remove);
    await loginAs(buyer.user);

    const form = await open(endpoint, { query: { model: CHEAP_MODEL } });
    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toContain("prompt");
  });
});
