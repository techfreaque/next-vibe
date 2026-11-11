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
/** Cheapest OpenRouter image model (~1.4 credits). Text-to-image only. */
const CHEAP_MODEL = ImageGenModelId.FLUX_2_KLEIN_4B;
/**
 * Image-to-image model: Venice Qwen Edit (inputs include "image", ~4 credits).
 * Venice has a dedicated /image/edit path for image-to-image, so a reference
 * image actually drives the edit. OpenRouter image models also support
 * image-to-image via POST /api/v1/images (input_references); we exercise the
 * Venice path here since it is a cheaper, uncensored edit model.
 */
const CHEAP_IMAGE_TO_IMAGE_MODEL = ImageGenModelId.QWEN_EDIT;
const PROMPT = "A small red circle on a white background";
/**
 * Small, stable, deterministic public reference image (320x320 PNG). Fetched
 * once during recording (by our server for Venice /image/edit, or by the
 * provider for other paths); replays never hit the network. Must be >=256x256:
 * Venice rejects images under 65536 pixels as "too small".
 */
const REFERENCE_IMAGE_URL =
  "https://dummyimage.com/320x320/4287f5/ffffff.png";

/**
 * A generated media URL must never be a bare relative "/path": storage URLs are
 * built from runtime NEXT_PUBLIC_APP_URL and must come back absolute (http...),
 * which guards the localhost/relative-URL regression. Standalone tool runs that
 * are not inside a chat thread skip the storage re-upload and return the
 * provider URL directly, which may be an inline data: URI — that is not the
 * regression, so it is allowed. Only a leading "/" (lost app-URL prefix) fails.
 */
function expectAbsoluteUrl(url: string): void {
  expect(
    url.startsWith("http") || url.startsWith("data:"),
    `expected an absolute http(s) url or data: uri, got ${url.slice(0, 80)}`,
  ).toBe(true);
  expect(
    url.startsWith("/"),
    `generated media url is relative (lost NEXT_PUBLIC_APP_URL prefix): ${url.slice(0, 80)}`,
  ).toBe(false);
}

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
    // The returned URL is absolute (built from runtime NEXT_PUBLIC_APP_URL) —
    // guards the localhost/relative-URL regression.
    expectAbsoluteUrl(result.response.data.imageUrl);

    // The generated image is rendered in the result panel
    const image = form.root.locator("img[src]").first();
    await image.waitFor({ state: "visible" });
    expect((await image.getAttribute("src"))?.length).toBeGreaterThan(0);
  }, 150_000);

  e2e.it("edits a reference image on an image-to-image model", async ({ open, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("image-gen-i2i", 100);
    cleanup(buyer.remove);
    await loginAs(buyer.user);

    // inputMediaUrl has no visible web control (the widget renders only the
    // prompt) — seed it via the query, which prefills request fields.
    const form = await open(endpoint, {
      query: {
        model: CHEAP_IMAGE_TO_IMAGE_MODEL,
        inputMediaUrl: REFERENCE_IMAGE_URL,
      },
    });
    await form.fill({ prompt: PROMPT });

    const result = await submitAndAwaitResponse(form, 90_000);
    expect(result.requestBody).toMatchObject({
      prompt: PROMPT,
      model: CHEAP_IMAGE_TO_IMAGE_MODEL,
      inputMediaUrl: REFERENCE_IMAGE_URL,
    });
    expect(result.response.success, JSON.stringify(result.response).slice(0, 500)).toBe(true);
    if (!result.response.success) return;
    expect(result.response.data.imageUrl.length).toBeGreaterThan(0);
    expectAbsoluteUrl(result.response.data.imageUrl);
  }, 150_000);

  e2e.it("rejects a reference image on a text-only model with a reference-image error", async ({ open, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("image-gen-guard", 10);
    cleanup(buyer.remove);
    await loginAs(buyer.user);

    // CHEAP_MODEL is text-to-image only (inputs: ["text"]). Passing a reference
    // image must fail BEFORE any paid provider call — so this test needs no
    // fixture. inputMediaUrl is seeded via the query (no visible web control).
    const form = await open(endpoint, {
      query: { model: CHEAP_MODEL, inputMediaUrl: REFERENCE_IMAGE_URL },
    });
    await form.fill({ prompt: PROMPT });

    const result = await submitAndAwaitResponse(form, 30_000);
    expect(result.requestBody).toMatchObject({
      model: CHEAP_MODEL,
      inputMediaUrl: REFERENCE_IMAGE_URL,
    });
    expect(result.response.success).toBe(false);
    if (result.response.success) return;
    // Matches post.errors.modelNoReferenceImage copy.
    expect(result.response.message.toLowerCase()).toContain("reference image");
  }, 60_000);

  e2e.it("resolves the default image model when none is passed", async ({ open, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("image-gen-default", 100);
    cleanup(buyer.remove);
    await loginAs(buyer.user);

    // No model in the query: the server resolves the default via requestDefaults
    // (Lustify V8 → Venice). The resolved id is not echoed in the response, so we
    // assert the default path produces a working, absolute-URL generation.
    const form = await open(endpoint, { query: {} });
    await form.fill({ prompt: PROMPT });

    const result = await submitAndAwaitResponse(form, 90_000);
    expect(result.requestBody).toMatchObject({ prompt: PROMPT });
    expect(result.response.success, JSON.stringify(result.response).slice(0, 500)).toBe(true);
    if (!result.response.success) return;
    expect(result.response.data.imageUrl.length).toBeGreaterThan(0);
    expectAbsoluteUrl(result.response.data.imageUrl);
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
