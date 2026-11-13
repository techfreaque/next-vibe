/**
 * E2E: image generation tool page — real browser against the running server.
 * Paid provider call: recorded once into
 * src/generated/ai-fixtures/http-cache/e2e-vibe-agent-image-generation--<test>/,
 * replayed on every later run. Requires a server (Atlas dev): `vibe dev`.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import { STANDARD_MARKUP_PERCENTAGE } from "@/products/constants";

import { until } from "../ai-stream/testing/e2e-chat";
import { createE2ECreditUser } from "../ai-stream/testing/e2e-credit-user";
import { submitAndAwaitResponse } from "../ai-stream/testing/e2e-slow-submit";
import { cacheDir } from "../ai-stream/testing/fetch-cache";
import { scopedTranslation as consentScopedTranslation } from "../models/uncensored-consent/i18n";
import { UncensoredConsentRepository } from "../models/uncensored-consent/repository";
import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "./constants";
import imageGenerationEndpoints from "./definition";
import { scopedTranslation } from "./i18n";
import { getImageGenModelById, ImageGenModelId } from "./models";

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
 * The no-skill default image model. Pinned here on purpose: changing the
 * product default must be a deliberate test update, not a silent swap.
 */
const DEFAULT_IMAGE_MODEL = "chroma";
/** Fixture folder of the default-model test (slug of suite + test name, 60 chars). */
const DEFAULT_MODEL_FIXTURES =
  "e2e-vibe-agent-image-generation-resolves-the-default-image-m";

/** The part of a recorded provider request this suite reads. */
const recordedRequestSchema = z.object({
  body: z.object({ model: z.string() }),
});

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);

async function balanceOf(user: JwtPrivatePayloadType): Promise<number> {
  const balance = await CreditRepository.getCreditBalanceForUser(
    user,
    defaultLocale,
    logger,
    creditsScopedTranslation.scopedT(defaultLocale).t,
  );
  expect(balance.success, JSON.stringify(balance)).toBe(true);
  return balance.success ? balance.data.total : Number.NaN;
}

/**
 * Uncensored-tier models (Qwen Edit, Chroma) need the one-time 18+ consent;
 * without it the server refuses with consent_required before charging. These
 * tests exercise generation itself, so the buyer consents up front (the
 * consent gate has its own tests in models/uncensored-consent).
 */
async function consentToUncensored(user: JwtPrivatePayloadType): Promise<void> {
  const agreed = await UncensoredConsentRepository.agree(
    user,
    logger,
    consentScopedTranslation.scopedT(defaultLocale).t,
  );
  expect(agreed.success, JSON.stringify(agreed)).toBe(true);
}

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
    await consentToUncensored(buyer.user);
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

  e2e.it("resolves the default image model (Chroma) when none is passed and bills it", async ({ open, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("image-gen-default", 100);
    cleanup(buyer.remove);
    await consentToUncensored(buyer.user);
    await loginAs(buyer.user);
    const before = await balanceOf(buyer.user);

    // No model in the query: the server resolves the default via requestDefaults.
    const form = await open(endpoint, { query: {} });
    await form.fill({ prompt: PROMPT });

    const result = await submitAndAwaitResponse(form, 90_000);
    expect(result.requestBody).toMatchObject({ prompt: PROMPT });
    expect(result.response.success, JSON.stringify(result.response).slice(0, 500)).toBe(true);
    if (!result.response.success) return;
    expect(result.response.data.imageUrl.length).toBeGreaterThan(0);
    expectAbsoluteUrl(result.response.data.imageUrl);

    // The resolved model is not echoed in the response, but the provider call
    // is: fixture files are named after the outbound request's model and the
    // Nth call replays file N only when that model matches. Exactly one
    // provider call, and it went out as Chroma - a silent default swap would
    // record a second, differently-named file here and fail.
    const providerCalls = readdirSync(cacheDir(DEFAULT_MODEL_FIXTURES)).filter(
      (f) => f.endsWith("-req.json"),
    );
    expect(providerCalls).toEqual([`0001-atlas-${DEFAULT_IMAGE_MODEL}-req.json`]);
    const sent = recordedRequestSchema.parse(
      JSON.parse(
        readFileSync(
          join(cacheDir(DEFAULT_MODEL_FIXTURES), providerCalls[0] ?? ""),
          "utf-8",
        ),
      ),
    );
    expect(sent.body.model).toBe(DEFAULT_IMAGE_MODEL);

    // Billed exactly the default model's per-image price
    await until("image billed", async () => (await balanceOf(buyer.user)) < before);
    expect(DEFAULT_IMAGE_GEN_MODEL_SELECTION).toMatchObject({
      manualModelId: ImageGenModelId.CHROMA,
    });
    const chroma = getImageGenModelById(ImageGenModelId.CHROMA);
    expect(chroma).toBeDefined();
    // Provider price + standard markup, rounded to 0.1 credit (as billed)
    const billed =
      Math.round(
        (chroma?.creditCostPerImage ?? Number.NaN) *
          (1 + STANDARD_MARKUP_PERCENTAGE) *
          10,
      ) / 10;
    expect(before - (await balanceOf(buyer.user))).toBeCloseTo(billed, 5);
  }, 150_000);

  e2e.it("refuses a reference image on the default Chroma model before charging", async ({ open, loginAs, cleanup }) => {
    const buyer = await createE2ECreditUser("image-gen-chroma-ref", 10);
    cleanup(buyer.remove);
    await consentToUncensored(buyer.user);
    await loginAs(buyer.user);
    const before = await balanceOf(buyer.user);

    // Chroma is text-to-image only: a reference must be refused up front,
    // never sent to Venice (where it would be dropped and billed anyway).
    const form = await open(endpoint, {
      query: { model: ImageGenModelId.CHROMA, inputMediaUrl: REFERENCE_IMAGE_URL },
    });
    await form.fill({ prompt: PROMPT });

    const result = await submitAndAwaitResponse(form, 30_000);
    expect(result.requestBody).toMatchObject({
      model: ImageGenModelId.CHROMA,
      inputMediaUrl: REFERENCE_IMAGE_URL,
    });
    expect(result.response.success).toBe(false);
    if (result.response.success) return;
    expect(result.response.message).toBe(
      t("post.errors.modelNoReferenceImage", { model: ImageGenModelId.CHROMA }),
    );
    expect(await balanceOf(buyer.user)).toBe(before);
  }, 60_000);

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
