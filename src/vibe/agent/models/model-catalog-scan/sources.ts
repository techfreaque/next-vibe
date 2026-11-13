/**
 * Model Catalog Scan - upstream model listings.
 * Fetches the full public model lists of the providers that publish one
 * (OpenRouter chat/image/video, Venice, NanoGPT) so the diff can spot ids we
 * do not serve yet and ids that vanished. Price drift for every provider comes
 * from the existing price fetchers instead (see repository.ts).
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { agentEnv } from "../../env";
import { ApiProvider } from "../models";
import {
  NANO_GPT_UNCENSORED_CATEGORIES,
  SOURCE_TIMEOUT_MS,
  UNCENSORED_HINT_PATTERN,
} from "./constants";
import type { CatalogModelKind } from "./schema";

export interface UpstreamModel {
  id: string;
  name: string;
  kind: CatalogModelKind;
  createdAt: Date | null;
  inputUsdPer1M: number | null;
  outputUsdPer1M: number | null;
  contextWindow: number | null;
  /** Provider-announced shutdown date, if any */
  expiresAt: string | null;
  uncensored: boolean;
}

export interface UpstreamListing {
  source: string;
  apiProvider: ApiProvider;
  ok: boolean;
  error: string | null;
  models: UpstreamModel[];
}

const PER_TOKEN_TO_PER_MILLION = 1_000_000;

function fromUnixSeconds(value: number | null | undefined): Date | null {
  return typeof value === "number" && value > 0 ? new Date(value * 1000) : null;
}

function hintsUncensored(...texts: (string | null | undefined)[]): boolean {
  return texts.some(
    (text) => typeof text === "string" && UNCENSORED_HINT_PATTERN.test(text),
  );
}

function perTokenToPerMillion(value: string | undefined): number | null {
  if (value === undefined) {
    return null;
  }
  const parsed = Number.parseFloat(value);
  // OpenRouter uses -1 for routers with variable pricing.
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return Math.round(parsed * PER_TOKEN_TO_PER_MILLION * 100_000) / 100_000;
}

function kindFromOutputs(outputs: readonly string[]): CatalogModelKind {
  if (outputs.includes("video")) {
    return "video";
  }
  if (outputs.includes("text")) {
    return "chat";
  }
  if (outputs.includes("image")) {
    return "image";
  }
  if (
    outputs.includes("audio") ||
    outputs.includes("speech") ||
    outputs.includes("transcription")
  ) {
    return "audio";
  }
  // embeddings, routing "decisions" and the like: not catalog material
  return "other";
}

async function fetchJson(
  url: string,
  headers: Record<string, string>,
): Promise<{ ok: true; json: string } | { ok: false; error: string }> {
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch -- external API
    const response = await fetch(url, {
      headers: { Accept: "application/json", ...headers },
      signal: AbortSignal.timeout(SOURCE_TIMEOUT_MS),
    });
    if (!response.ok) {
      return { ok: false, error: `${url} responded with ${response.status}` };
    }
    return { ok: true, json: await response.text() };
  } catch (error) {
    return { ok: false, error: `${url}: ${parseError(error).message}` };
  }
}

const jsonValueSchema = z.json();

function parseListing<TSchema extends z.ZodType>(
  json: string,
  schema: TSchema,
): { ok: true; data: z.infer<TSchema> } | { ok: false; error: string } {
  let raw: z.infer<typeof jsonValueSchema>;
  try {
    raw = jsonValueSchema.parse(JSON.parse(json));
  } catch (error) {
    return { ok: false, error: parseError(error).message };
  }
  const parsed = schema.safeParse(raw);
  return parsed.success
    ? { ok: true, data: parsed.data }
    : { ok: false, error: parsed.error.message };
}

function bearer(key: string | undefined): Record<string, string> {
  return key ? { Authorization: `Bearer ${key}` } : {};
}

// ── OpenRouter ──────────────────────────────────────────────────────────────

const openRouterModelSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  created: z.number().nullish(),
  context_length: z.number().nullish(),
  expiration_date: z.string().nullish(),
  pricing: z
    .object({
      prompt: z.string().optional(),
      completion: z.string().optional(),
    })
    .nullish(),
  architecture: z
    .object({ output_modalities: z.array(z.string()).nullish() })
    .nullish(),
});
const openRouterListSchema = z.object({ data: z.array(openRouterModelSchema) });

/** Router aliases and batch tiers we never serve. */
function isServableOpenRouterId(id: string): boolean {
  return (
    !id.startsWith("~") &&
    !id.startsWith("openrouter/") &&
    !id.endsWith(":batch")
  );
}

async function fetchOpenRouter(
  source: string,
  url: string,
  fallbackKind: CatalogModelKind,
): Promise<UpstreamListing> {
  const base = { source, apiProvider: ApiProvider.OPENROUTER };
  const response = await fetchJson(url, bearer(agentEnv.OPENROUTER_API_KEY));
  if (!response.ok) {
    return { ...base, ok: false, error: response.error, models: [] };
  }
  const parsed = parseListing(response.json, openRouterListSchema);
  if (!parsed.ok) {
    return { ...base, ok: false, error: parsed.error, models: [] };
  }
  const models = parsed.data.data
    .filter((m) => isServableOpenRouterId(m.id))
    .map((m): UpstreamModel => {
      const outputs = m.architecture?.output_modalities ?? [];
      return {
        id: m.id,
        name: m.name ?? m.id,
        kind: outputs.length > 0 ? kindFromOutputs(outputs) : fallbackKind,
        createdAt: fromUnixSeconds(m.created),
        inputUsdPer1M: perTokenToPerMillion(m.pricing?.prompt),
        outputUsdPer1M: perTokenToPerMillion(m.pricing?.completion),
        contextWindow: m.context_length ?? null,
        expiresAt: m.expiration_date ?? null,
        uncensored: hintsUncensored(m.id, m.name),
      };
    });
  return { ...base, ok: true, error: null, models };
}

// ── Venice ──────────────────────────────────────────────────────────────────

const veniceUsdSchema = z.object({ usd: z.number().optional() }).nullish();
const veniceModelSchema = z.object({
  id: z.string(),
  type: z.string(),
  created: z.number().nullish(),
  model_spec: z
    .object({
      name: z.string().nullish(),
      availableContextTokens: z.number().nullish(),
      pricing: z
        .object({ input: veniceUsdSchema, output: veniceUsdSchema })
        .nullish(),
    })
    .nullish(),
});
const veniceListSchema = z.object({ data: z.array(veniceModelSchema) });

function veniceKind(type: string): CatalogModelKind {
  switch (type) {
    case "text":
      return "chat";
    case "image":
    case "inpaint":
      // inpaint = image edit models (we serve some as image-gen models)
      return "image";
    case "video":
      return "video";
    case "music":
    case "tts":
    case "asr":
      return "audio";
    default:
      // embedding, upscale, decision: kept for the missing-id check, never
      // reported as new (findNewModels skips "other")
      return "other";
  }
}

async function fetchVenice(): Promise<UpstreamListing> {
  const base = { source: "venice", apiProvider: ApiProvider.VENICE_AI };
  const response = await fetchJson(
    "https://api.venice.ai/api/v1/models?type=all",
    bearer(agentEnv.VENICE_AI_API_KEY),
  );
  if (!response.ok) {
    return { ...base, ok: false, error: response.error, models: [] };
  }
  const parsed = parseListing(response.json, veniceListSchema);
  if (!parsed.ok) {
    return { ...base, ok: false, error: parsed.error, models: [] };
  }
  const models: UpstreamModel[] = [];
  for (const m of parsed.data.data) {
    const kind = veniceKind(m.type);
    const name = m.model_spec?.name ?? m.id;
    models.push({
      id: m.id,
      name,
      kind,
      createdAt: fromUnixSeconds(m.created),
      inputUsdPer1M: m.model_spec?.pricing?.input?.usd ?? null,
      outputUsdPer1M: m.model_spec?.pricing?.output?.usd ?? null,
      contextWindow: m.model_spec?.availableContextTokens ?? null,
      expiresAt: null,
      uncensored: hintsUncensored(m.id, name),
    });
  }
  return { ...base, ok: true, error: null, models };
}

// ── NanoGPT ─────────────────────────────────────────────────────────────────

const nanoGptModelSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  created: z.number().nullish(),
  // Usually a string; anything else is ignored rather than failing the list.
  category: z.string().nullish().catch(null),
  context_length: z.number().nullish(),
  pricing: z
    .object({
      prompt: z.number().optional(),
      completion: z.number().optional(),
      unit: z.string().optional(),
    })
    .nullish(),
  architecture: z
    .object({ output_modalities: z.array(z.string()).nullish() })
    .nullish(),
});
const nanoGptListSchema = z.object({ data: z.array(nanoGptModelSchema) });

async function fetchNanoGpt(): Promise<UpstreamListing> {
  const base = { source: "nano-gpt", apiProvider: ApiProvider.NANO_GPT };
  const response = await fetchJson(
    "https://nano-gpt.com/api/v1/models?detailed=true",
    {},
  );
  if (!response.ok) {
    return { ...base, ok: false, error: response.error, models: [] };
  }
  const parsed = parseListing(response.json, nanoGptListSchema);
  if (!parsed.ok) {
    return { ...base, ok: false, error: parsed.error, models: [] };
  }
  const models = parsed.data.data.map((m): UpstreamModel => {
    const perMillion = m.pricing?.unit === "per_million_tokens";
    const category = m.category ?? null;
    const outputs = m.architecture?.output_modalities ?? ["text"];
    const name = m.name ?? m.id;
    return {
      id: m.id,
      name,
      kind: kindFromOutputs(outputs),
      createdAt: fromUnixSeconds(m.created),
      inputUsdPer1M: perMillion ? (m.pricing?.prompt ?? null) : null,
      outputUsdPer1M: perMillion ? (m.pricing?.completion ?? null) : null,
      contextWindow: m.context_length ?? null,
      expiresAt: null,
      uncensored:
        (category !== null &&
          NANO_GPT_UNCENSORED_CATEGORIES.includes(category)) ||
        hintsUncensored(m.id, name),
    };
  });
  return { ...base, ok: true, error: null, models };
}

/** All listings, fetched in parallel. A failed source never fails the scan. */
export async function fetchUpstreamListings(
  logger: EndpointLogger,
): Promise<UpstreamListing[]> {
  const listings = await Promise.all([
    fetchOpenRouter(
      "openrouter",
      "https://openrouter.ai/api/v1/models?output_modalities=all",
      "chat",
    ),
    fetchOpenRouter(
      "openrouter-images",
      "https://openrouter.ai/api/v1/images/models",
      "image",
    ),
    fetchOpenRouter(
      "openrouter-videos",
      "https://openrouter.ai/api/v1/videos/models",
      "video",
    ),
    fetchVenice(),
    fetchNanoGpt(),
  ]);
  for (const listing of listings) {
    if (listing.ok) {
      logger.debug("Model catalog source fetched", {
        source: listing.source,
        count: listing.models.length,
      });
    } else {
      logger.warn("Model catalog source failed", {
        source: listing.source,
        error: listing.error ?? "",
      });
    }
  }
  return listings;
}
