/**
 * Character Card parser (Tavern / SillyTavern / Chub / RisuAI format).
 *
 * Reads V1 (flat JSON), V2 (`chara_card_v2`) and V3 (`chara_card_v3`) cards,
 * as raw JSON or embedded in a PNG (`chara` / `ccv3` tEXt or iTXt chunk,
 * base64 JSON). Pure functions: no network, no DB, nothing in the card is
 * executed. Card text only ever lands in a skill prompt.
 */

import { createHash } from "node:crypto";

import { z } from "zod";

import { SkillImportPlatform } from "../enum";
import type { ParsedCharacter } from "../parsers";
import { clean, parseJson } from "../parsers";
import {
  CARD_MAX_BASE64_CHARS,
  CARD_MAX_BYTES,
  CARD_MAX_INPUT_CHARS,
  CARD_MAX_JSON_BYTES,
} from "./limits";
import { isPng, readCardPng } from "./png";

const MAX_TAGS = 20;
const TAG_MAX = 40;

const optionalText = z.string().nullish().catch(null);

/** Card fields we read. Unknown keys (extensions, assets, books) are dropped. */
const cardDataSchema = z.object({
  name: optionalText,
  description: optionalText,
  personality: optionalText,
  scenario: optionalText,
  first_mes: optionalText,
  mes_example: optionalText,
  creator_notes: optionalText,
  system_prompt: optionalText,
  post_history_instructions: optionalText,
  creator: optionalText,
  nickname: optionalText,
  tags: z.array(z.string()).max(128).nullish().catch(null),
});

type CardData = z.infer<typeof cardDataSchema>;

/** One schema for every version: V2/V3 wrap the fields in `data`, V1 is flat. */
const cardFileSchema = cardDataSchema.extend({
  spec: optionalText,
  data: cardDataSchema.nullish().catch(null),
});

export type CardFormat = "json" | "png";

/** A decoded card plus the PNG bytes when it came from an image. */
export interface DecodedCard {
  format: CardFormat;
  data: CardData;
  /** Raster-only PNG, without the embedded card or other metadata. */
  image: NonNullable<ReturnType<typeof readCardPng>>["avatar"] | null;
}

export type DecodeCardResult =
  | { ok: true; card: DecodedCard }
  | {
      ok: false;
      /** tooLarge: over CARD_MAX_BYTES. noCard: PNG without card data.
       * invalid: not JSON/PNG, or JSON that is not a character card. */
      reason: "tooLarge" | "noCard" | "invalid";
    };

/** Parse card JSON text. Null when it is not a character card. */
export function parseCardJson(text: string): CardData | null {
  if (Buffer.byteLength(text, "utf8") > CARD_MAX_JSON_BYTES) {
    return null;
  }
  const withoutBom = text.codePointAt(0) === 0xfeff ? text.slice(1) : text;
  const parsed = parseJson(withoutBom, cardFileSchema);
  if (!parsed) {
    return null;
  }
  const { spec, data: wrapped, ...flat } = parsed;
  const data = spec?.startsWith("chara_card_v") && wrapped ? wrapped : flat;
  return clean(data.name) ? data : null;
}

function decodeBase64Json(value: string): CardData | null {
  if (value.length > Math.ceil(CARD_MAX_JSON_BYTES / 3) * 4) {
    return null;
  }
  return parseCardJson(Buffer.from(value, "base64").toString("utf8"));
}

/**
 * Decode a card from what the client sent: base64 file bytes (web upload),
 * or the card JSON pasted as text (CLI, MCP, AI).
 */
export function decodeCard(input: string): DecodeCardResult {
  if (input.length > CARD_MAX_INPUT_CHARS) {
    return { ok: false, reason: "tooLarge" };
  }
  const trimmed = input.trim();
  if (trimmed.startsWith("{")) {
    if (Buffer.byteLength(trimmed, "utf8") > CARD_MAX_JSON_BYTES) {
      return { ok: false, reason: "tooLarge" };
    }
    const data = parseCardJson(trimmed);
    return data
      ? { ok: true, card: { format: "json", data, image: null } }
      : { ok: false, reason: "invalid" };
  }

  // Data URL prefix from some clients: "data:image/png;base64,...."
  const base64 = trimmed.replace(/^data:[a-z0-9./+;-]{0,48};base64,/i, "");
  if (base64.length > CARD_MAX_BASE64_CHARS) {
    return { ok: false, reason: "tooLarge" };
  }
  const bytes = Buffer.from(base64, "base64");
  if (bytes.length > CARD_MAX_BYTES) {
    return { ok: false, reason: "tooLarge" };
  }
  if (bytes.length === 0) {
    return { ok: false, reason: "invalid" };
  }

  if (isPng(bytes)) {
    const png = readCardPng(bytes);
    if (!png) {
      return { ok: false, reason: "invalid" };
    }
    const { cards: chunks, avatar } = png;
    const encoded = chunks.get("ccv3") ?? chunks.get("chara");
    if (!encoded) {
      return { ok: false, reason: "noCard" };
    }
    // Prefer V3, fall back to V2 when the V3 chunk does not parse.
    const data =
      decodeBase64Json(encoded) ??
      (chunks.has("chara")
        ? decodeBase64Json(chunks.get("chara") ?? "")
        : null);
    return data
      ? { ok: true, card: { format: "png", data, image: avatar } }
      : { ok: false, reason: "invalid" };
  }

  if (bytes.length > CARD_MAX_JSON_BYTES) {
    return { ok: false, reason: "tooLarge" };
  }
  const data = parseCardJson(bytes.toString("utf8"));
  return data
    ? { ok: true, card: { format: "json", data, image: null } }
    : { ok: false, reason: "invalid" };
}

// ─── Mapping ─────────────────────────────────────────────────────────────────

/** `{{original}}` is a SillyTavern macro for "the app's own main prompt". */
function stripMacros(text: string | null): string | null {
  return clean(text?.replaceAll(/\{\{\s*original\s*\}\}/gi, "") ?? null);
}

function cleanTags(tags: string[] | null | undefined): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of tags ?? []) {
    const value = clean(tag)?.slice(0, TAG_MAX);
    if (value && !seen.has(value.toLowerCase())) {
      seen.add(value.toLowerCase());
      result.push(value);
    }
    if (result.length >= MAX_TAGS) {
      break;
    }
  }
  return result;
}

/** Stable dedupe id: the same card imported twice maps to one skill. */
export function cardSourceId(data: CardData): string {
  const fingerprint = [
    data.name,
    data.description,
    data.personality,
    data.scenario,
    data.first_mes,
    data.mes_example,
    data.system_prompt,
  ]
    .map((part) => clean(part) ?? "")
    .join("\u0000");
  return createHash("sha256").update(fingerprint).digest("hex").slice(0, 32);
}

/**
 * Map a card onto the shared import shape. Personality, scenario, example
 * dialogue and card instructions become labeled parts of the definition.
 */
export function cardToCharacter(data: CardData): ParsedCharacter | null {
  const name = clean(data.name);
  if (!name) {
    return null;
  }
  const parts: string[] = [];
  const personality = clean(data.personality);
  if (personality) {
    parts.push(`Personality:\n${personality}`);
  }
  const scenario = clean(data.scenario);
  if (scenario) {
    parts.push(`Scenario:\n${scenario}`);
  }
  const examples = clean(data.mes_example);
  if (examples) {
    parts.push(
      `Example dialogue (style reference, not part of this chat):\n${examples}`,
    );
  }
  const instructions = stripMacros(data.system_prompt ?? null);
  if (instructions) {
    parts.push(`Card instructions:\n${instructions}`);
  }
  const postHistory = stripMacros(data.post_history_instructions ?? null);
  if (postHistory) {
    parts.push(`Reply guidelines:\n${postHistory}`);
  }

  return {
    platform: SkillImportPlatform.CHARACTER_CARD,
    sourceId: cardSourceId(data),
    sourceUrl: "",
    name,
    title: null,
    greeting: clean(data.first_mes),
    description: clean(data.description),
    definition: parts.length > 0 ? parts.join("\n\n") : null,
    tags: cleanTags(data.tags),
    avatarSourceUrl: null,
    creatorName: clean(data.creator)?.slice(0, 120) ?? null,
    creatorUrl: null,
  };
}
