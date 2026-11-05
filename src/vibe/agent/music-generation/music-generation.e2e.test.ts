/**
 * E2E: music generation tool page — real browser against the running server.
 * Paid provider call: recorded once into
 * src/generated/ai-fixtures/http-cache/e2e-vibe-agent-music-generation-<test>/,
 * replayed on every later run. Requires a server (Atlas dev): `vibe dev`.
 */

import { describe, expect } from "vitest";

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { createE2ECreditUser } from "../ai-stream/testing/e2e-credit-user";
import { submitAndAwaitResponse } from "../ai-stream/testing/e2e-slow-submit";
import musicGenerationEndpoints from "./definition";
import { MusicGenModelId } from "./models";

const endpoint = musicGenerationEndpoints.POST;
/** Cheapest OpenRouter music model (Lyria clip, flat ~4 credits). */
const CHEAP_MODEL = MusicGenModelId.LYRIA_3_CLIP_PREVIEW;
const PROMPT = "Short calm piano melody";

describe("E2E: music generation", () => {
  const e2e = useE2E("vibe/agent/music-generation", { fixtures: true });

  e2e.it("generates a music clip from a prompt and plays it", async ({ open, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("music-gen", 100);
    cleanup(buyer.remove);
    await loginAs(buyer.user);

    const form = await open(endpoint, { query: { model: CHEAP_MODEL } });
    await form.fill({ prompt: PROMPT });

    const result = await submitAndAwaitResponse(form, 120_000);
    expect(result.requestBody).toMatchObject({ prompt: PROMPT, model: CHEAP_MODEL });
    expect(result.response.success, JSON.stringify(result.response).slice(0, 500)).toBe(true);
    if (!result.response.success) return;
    expect(result.response.data.audioUrl.length).toBeGreaterThan(0);

    // The clip lands in a playable <audio> element
    const audio = form.root.locator("audio[src]").first();
    await audio.waitFor({ state: "attached" });
    expect((await audio.getAttribute("src"))?.length).toBeGreaterThan(0);
  }, 180_000);

  e2e.it("blocks an empty prompt client-side and flags the prompt field", async ({ open, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("music-gen-empty", 10);
    cleanup(buyer.remove);
    await loginAs(buyer.user);

    const form = await open(endpoint, { query: { model: CHEAP_MODEL } });
    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toContain("prompt");
  });
});
