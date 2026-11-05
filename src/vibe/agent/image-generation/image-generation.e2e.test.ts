/**
 * E2E: image generation tool page — real browser against the running server.
 * Paid provider call: recorded once into
 * src/generated/ai-fixtures/http-cache/e2e-vibe-agent-image-generation--<test>/,
 * replayed on every later run. Requires a server (Atlas dev): `vibe dev`.
 */

import { describe, expect } from "vitest";

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { createE2ECreditUser } from "../ai-stream/testing/e2e-credit-user";
import { submitAndAwaitResponse } from "../ai-stream/testing/e2e-slow-submit";
import imageGenerationEndpoints from "./definition";
import { ImageGenModelId } from "./models";

const endpoint = imageGenerationEndpoints.POST;
/** Cheapest OpenRouter image model (~1.4 credits). */
const CHEAP_MODEL = ImageGenModelId.FLUX_2_KLEIN_4B;
const PROMPT = "A small red circle on a white background";

describe("E2E: image generation", () => {
  const e2e = useE2E("vibe/agent/image-generation", { fixtures: true });

  e2e.it("generates an image from a prompt and shows it", async ({ open, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("image-gen", 100);
    cleanup(buyer.remove);
    await loginAs(buyer.user);

    const form = await open(endpoint, { query: { model: CHEAP_MODEL } });
    await form.fill({ prompt: PROMPT });

    const result = await submitAndAwaitResponse(form, 90_000);
    expect(result.requestBody).toMatchObject({ prompt: PROMPT });
    expect(result.response.success, JSON.stringify(result.response).slice(0, 500)).toBe(true);
    if (!result.response.success) return;
    expect(result.requestBody).toMatchObject({ model: CHEAP_MODEL });
    expect(result.response.data.imageUrl.length).toBeGreaterThan(0);

    // The generated image is rendered in the result panel
    const image = form.root.locator("img[src]").first();
    await image.waitFor({ state: "visible" });
    expect((await image.getAttribute("src"))?.length).toBeGreaterThan(0);
  }, 150_000);

  e2e.it("blocks an empty prompt client-side and flags the prompt field", async ({ open, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("image-gen-empty", 10);
    cleanup(buyer.remove);
    await loginAs(buyer.user);

    const form = await open(endpoint, { query: { model: CHEAP_MODEL } });
    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toContain("prompt");
  });
});
