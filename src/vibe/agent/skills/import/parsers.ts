/**
 * Character link import: URL detection and page parsers (pure, no I/O).
 *
 * Both supported platforms are Next.js sites that embed the public character
 * data in the server-rendered `__NEXT_DATA__` script. We read only that public
 * page data: no API calls, no login, nothing a logged-out visitor cannot see.
 */

import { z } from "zod";

import type { SkillImportPlatformValue } from "./enum";
import { SkillImportPlatform } from "./enum";

// ─── Limits (match the skill create/update schemas) ─────────────────────────

const NAME_MAX = 100;
const TAGLINE_MAX = 500;
const DESCRIPTION_MAX = 500;
const PROMPT_SECTION_MAX = 12_000;
const MAX_TAGS = 12;

// ─── Types ──────────────────────────────────────────────────────────────────

/** A link we know how to fetch, before the page is loaded. */
export interface DetectedCharacterLink {
  platform: typeof SkillImportPlatformValue;
  /** Canonical public page URL to fetch (no query string, robots-friendly). */
  fetchUrl: string;
  /** Source id when the link carries it (dedupe before fetching). */
  sourceIdHint: string | null;
}

/** Public character data read from a source page. */
export interface ParsedCharacter {
  platform: typeof SkillImportPlatformValue;
  /** Stable id on the source platform (dedupe key). */
  sourceId: string;
  /** Canonical link back to the character page. */
  sourceUrl: string;
  name: string;
  title: string | null;
  greeting: string | null;
  description: string | null;
  /** Long-form definition/persona, only when the source shows it publicly. */
  definition: string | null;
  tags: string[];
  /** Original image URL on the source CDN (downloaded, never hotlinked). */
  avatarSourceUrl: string | null;
  creatorName: string | null;
  creatorUrl: string | null;
}

// ─── URL detection ──────────────────────────────────────────────────────────

const CHARACTER_AI_HOSTS = new Set([
  "character.ai",
  "www.character.ai",
  "beta.character.ai",
  "old.character.ai",
  "plus.character.ai",
  "c.ai",
  "www.c.ai",
]);

const TALKIE_HOSTS = new Set(["talkie-ai.com", "www.talkie-ai.com"]);

/** Character.AI external ids and short hashes: url-safe base64 alphabet. */
const CAI_ID = /^[A-Za-z0-9_-]{6,64}$/;

/** Talkie character slugs end in a long numeric id: `adrian-248871183229041`. */
const TALKIE_SLUG = /^(?:[^/]*-)?(\d{6,24})$/;

/** Talkie locale prefixes (`/es/chat/...`, `/zh-Hant/chat/...`). */
const TALKIE_LOCALE = /^[a-z]{2,3}(?:-[A-Za-z]{2,4})?$/;

function parseHttpUrl(raw: string): URL | null {
  const trimmed = raw.trim();
  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

function detectCharacterAi(url: URL): DetectedCharacterLink | null {
  const segments = url.pathname.split("/").filter(Boolean);
  const [first, second] = segments;

  // character.ai/character/<shortHash>[/<slug>]
  if (first === "character" && second && CAI_ID.test(second)) {
    return {
      platform: SkillImportPlatform.CHARACTER_AI,
      fetchUrl: `https://character.ai/character/${second}`,
      sourceIdHint: null,
    };
  }
  // character.ai/chat/<externalId>, c.ai/c/<externalId>
  if ((first === "chat" || first === "c") && second && CAI_ID.test(second)) {
    return {
      platform: SkillImportPlatform.CHARACTER_AI,
      fetchUrl: `https://character.ai/chat/${second}`,
      sourceIdHint: second,
    };
  }
  // Legacy beta links: /chat?char=<externalId>, /chat2?char=<externalId>
  const charParam = url.searchParams.get("char");
  if (charParam && CAI_ID.test(charParam)) {
    return {
      platform: SkillImportPlatform.CHARACTER_AI,
      fetchUrl: `https://character.ai/chat/${charParam}`,
      sourceIdHint: charParam,
    };
  }
  return null;
}

function detectTalkie(url: URL): DetectedCharacterLink | null {
  const segments = url.pathname.split("/").filter(Boolean);
  // Drop a locale prefix: /es/chat/<slug>
  const path =
    segments.length > 2 && TALKIE_LOCALE.test(segments[0] ?? "")
      ? segments.slice(1)
      : segments;
  const [first, second, third] = path;
  // /chat/<slug-id> and /chat/profile/<slug-id>
  const slug = first === "chat" && second === "profile" ? third : second;
  if (first !== "chat" || !slug) {
    return null;
  }
  const match = TALKIE_SLUG.exec(safeDecode(slug));
  if (!match?.[1]) {
    return null;
  }
  return {
    platform: SkillImportPlatform.TALKIE,
    fetchUrl: `https://www.talkie-ai.com/chat/${slug}`,
    sourceIdHint: match[1],
  };
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Recognize a public character link. Returns null for anything that is not a
 * Character.AI or Talkie character page (including look-alike hosts).
 */
export function detectCharacterLink(raw: string): DetectedCharacterLink | null {
  const url = parseHttpUrl(raw);
  if (!url) {
    return null;
  }
  const host = url.hostname.toLowerCase();
  if (CHARACTER_AI_HOSTS.has(host)) {
    return detectCharacterAi(url);
  }
  if (TALKIE_HOSTS.has(host)) {
    return detectTalkie(url);
  }
  return null;
}

// ─── __NEXT_DATA__ extraction ───────────────────────────────────────────────

const NEXT_DATA_RE =
  /<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i;

function extractNextDataJson(html: string): string | null {
  const match = NEXT_DATA_RE.exec(html);
  return match?.[1]?.trim() || null;
}

function parseJson<T>(raw: string, schema: z.ZodType<T>): T | null {
  try {
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

// ─── Text helpers ───────────────────────────────────────────────────────────

/** Trim, normalize newlines, drop empty strings. */
function clean(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const text = value
    .replaceAll("\r\n", "\n")
    .replaceAll(/[ \t]+\n/g, "\n")
    .replaceAll(/\n{3,}/g, "\n\n")
    .trim();
  return text.length > 0 ? text : null;
}

/** Cut at a word boundary and mark the cut. */
export function truncateText(text: string, max: number): string {
  if (text.length <= max) {
    return text;
  }
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}…`;
}

function uniqueTags(tags: (string | null)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of tags) {
    const value = clean(tag);
    if (!value) {
      continue;
    }
    const key = value.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(truncateText(value, 40));
    }
  }
  return out.slice(0, MAX_TAGS);
}

// ─── Character.AI ───────────────────────────────────────────────────────────

const caiCharacterSchema = z.object({
  external_id: z.string().min(1),
  name: z.string(),
  title: z.string().nullish(),
  greeting: z.string().nullish(),
  description: z.string().nullish(),
  definition: z.string().nullish(),
  avatar_file_name: z.string().nullish(),
  user__username: z.string().nullish(),
  short_hash: z.string().nullish(),
});

const caiCategorySchema = z.union([
  z.string(),
  z.object({ name: z.string() }),
  z.object({ label: z.string() }),
]);

const caiQueryDataSchema = z.object({
  character: caiCharacterSchema.optional().catch(undefined),
  about_character: z
    .object({ description: z.string().nullish() })
    .optional()
    .catch(undefined),
  categories: z.array(caiCategorySchema).optional().catch(undefined),
});

const caiNextDataSchema = z.object({
  props: z.object({
    pageProps: z.object({
      prefetchedCharacterInfo: caiCharacterSchema.nullish().catch(null),
      dehydratedState: z
        .object({
          json: z.object({
            queries: z.array(
              z.object({
                state: z.object({
                  data: caiQueryDataSchema.nullish().catch(null),
                }),
              }),
            ),
          }),
        })
        .nullish()
        .catch(null),
    }),
  }),
});

const CAI_AVATAR_BASE = "https://characterai.io/i/400/static/avatars/";

function categoryName(item: z.output<typeof caiCategorySchema>): string {
  if (typeof item === "string") {
    return item;
  }
  return "name" in item ? item.name : item.label;
}

/** Parse a Character.AI character page (`/character/<hash>` or `/chat/<id>`). */
export function parseCharacterAiPage(html: string): ParsedCharacter | null {
  const raw = extractNextDataJson(html);
  if (!raw) {
    return null;
  }
  const data = parseJson(raw, caiNextDataSchema);
  if (!data) {
    return null;
  }
  const pageProps = data.props.pageProps;
  const queryData = (pageProps.dehydratedState?.json.queries ?? []).flatMap(
    (query) => (query.state.data ? [query.state.data] : []),
  );
  const character =
    pageProps.prefetchedCharacterInfo ??
    queryData.find((entry) => entry.character)?.character ??
    null;
  const name = clean(character?.name);
  if (!character || !name) {
    return null;
  }
  const about = queryData.find((entry) => entry.about_character)
    ?.about_character?.description;
  const categories =
    queryData.find((entry) => entry.categories)?.categories ?? [];
  const username = clean(character.user__username);
  const avatarFile = clean(character.avatar_file_name);
  const shortHash = clean(character.short_hash);

  return {
    platform: SkillImportPlatform.CHARACTER_AI,
    sourceId: character.external_id,
    sourceUrl: shortHash
      ? `https://character.ai/character/${shortHash}`
      : `https://character.ai/chat/${character.external_id}`,
    name,
    title: clean(character.title),
    greeting: clean(character.greeting),
    description: clean(character.description) ?? clean(about),
    definition: clean(character.definition),
    tags: uniqueTags(categories.map(categoryName)),
    avatarSourceUrl: avatarFile
      ? `${CAI_AVATAR_BASE}${avatarFile.replace(/^\/+/, "")}`
      : null,
    creatorName: username,
    creatorUrl: username
      ? `https://character.ai/profile/${encodeURIComponent(username)}`
      : null,
  };
}

// ─── Talkie ─────────────────────────────────────────────────────────────────

const talkieTagSchema = z.union([
  z.string(),
  z.object({ tagName: z.string() }),
  z.object({ tag_name: z.string() }),
  z.object({ name: z.string() }),
]);

const talkieNpcSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  desc: z.string().nullish(),
  prologue: z.string().nullish(),
  avatarUrl: z.string().nullish(),
  authorUserName: z.string().nullish(),
  tagName: z.string().nullish(),
  npcTagList: z.array(talkieTagSchema).nullish().catch(null),
});

const talkieNextDataSchema = z.object({
  props: z.object({
    pageProps: z.object({
      seo: z
        .object({
          canonical: z.string().nullish(),
          jsonLd: z
            .object({
              "@graph": z.array(
                z.object({
                  creator: z
                    .object({
                      name: z.string().nullish(),
                      url: z.string().nullish(),
                    })
                    .nullish()
                    .catch(null),
                }),
              ),
            })
            .nullish()
            .catch(null),
        })
        .nullish()
        .catch(null),
      serverState: z.object({
        chat: z.object({
          npcInfo: talkieNpcSchema.nullish().catch(null),
        }),
      }),
    }),
  }),
});

function talkieTagName(item: z.output<typeof talkieTagSchema>): string {
  if (typeof item === "string") {
    return item;
  }
  if ("tagName" in item) {
    return item.tagName;
  }
  return "tag_name" in item ? item.tag_name : item.name;
}

function httpsUrlOrNull(value: string | null | undefined): string | null {
  const url = value ? parseHttpUrl(value) : null;
  return url?.protocol === "https:" ? url.toString() : null;
}

/** Parse a Talkie character page (`/chat/<slug>-<id>`). */
export function parseTalkiePage(html: string): ParsedCharacter | null {
  const raw = extractNextDataJson(html);
  if (!raw) {
    return null;
  }
  const data = parseJson(raw, talkieNextDataSchema);
  const npc = data?.props.pageProps.serverState.chat.npcInfo;
  const name = clean(npc?.name);
  if (!data || !npc || !name) {
    return null;
  }
  const sourceId = String(npc.id);
  if (!/^\d+$/.test(sourceId) || sourceId === "0") {
    return null;
  }
  const seo = data.props.pageProps.seo;
  const creator =
    seo?.jsonLd?.["@graph"].find((node) => node.creator)?.creator ?? null;
  const canonical = httpsUrlOrNull(seo?.canonical);

  return {
    platform: SkillImportPlatform.TALKIE,
    sourceId,
    sourceUrl:
      canonical && detectCharacterLink(canonical)
        ? canonical
        : `https://www.talkie-ai.com/chat/${sourceId}`,
    name,
    title: null,
    greeting: clean(npc.prologue),
    description: clean(npc.desc),
    // Talkie keeps the persona prompt private (hiddenDesc); never imported.
    definition: null,
    tags: uniqueTags([
      npc.tagName ?? null,
      ...(npc.npcTagList ?? []).map(talkieTagName),
    ]),
    avatarSourceUrl: httpsUrlOrNull(npc.avatarUrl),
    creatorName: clean(npc.authorUserName) ?? clean(creator?.name),
    creatorUrl: httpsUrlOrNull(creator?.url),
  };
}

/** Dispatch to the parser for the detected platform. */
export function parseCharacterPage(
  platform: typeof SkillImportPlatformValue,
  html: string,
): ParsedCharacter | null {
  return platform === SkillImportPlatform.TALKIE
    ? parseTalkiePage(html)
    : parseCharacterAiPage(html);
}

/**
 * Anti-bot interstitials (Cloudflare, Akamai) instead of the real page.
 * Only meaningful when the page did not parse.
 */
export function isBlockedPage(status: number, html: string): boolean {
  if (status === 403 || status === 429 || status === 503) {
    return true;
  }
  const head = html.slice(0, 4000).toLowerCase();
  return (
    head.includes("attention required! | cloudflare") ||
    head.includes("just a moment...") ||
    head.includes("cf-chl-") ||
    head.includes("<title>access denied</title>")
  );
}

// ─── Load strategy ──────────────────────────────────────────────────────────

/** A fetched page (null = network failure or refused URL). */
export interface FetchedPage {
  status: number;
  html: string;
}

export type PageFetcher = (url: string) => Promise<FetchedPage | null>;

export type LoadCharacterResult =
  | { ok: true; character: ParsedCharacter }
  | {
      ok: false;
      /** blocked: anti-bot wall. notFound: page has no public data.
       * notConfigured: blocked and no anti-bot fetcher on this server. */
      reason: "blocked" | "notFound" | "notConfigured" | "network";
    };

/**
 * Fetch and parse a character page: direct request first (cheap), then the
 * anti-bot fetcher when the direct page is blocked or carries no data.
 */
export async function loadCharacter(
  link: DetectedCharacterLink,
  direct: PageFetcher,
  antiBot: PageFetcher | null,
): Promise<LoadCharacterResult> {
  let sawBlock = false;
  let sawPage = false;

  const attempt = async (
    fetcher: PageFetcher,
  ): Promise<ParsedCharacter | null> => {
    const page = await fetcher(link.fetchUrl);
    if (!page) {
      return null;
    }
    const parsed =
      page.status >= 200 && page.status < 300
        ? parseCharacterPage(link.platform, page.html)
        : null;
    if (parsed) {
      return parsed;
    }
    if (isBlockedPage(page.status, page.html)) {
      sawBlock = true;
    } else {
      sawPage = true;
    }
    return null;
  };

  const directResult = await attempt(direct);
  if (directResult) {
    return { ok: true, character: directResult };
  }
  // A clean 404 / empty page is final: the anti-bot fetcher would see the same.
  if (!sawBlock && sawPage) {
    return { ok: false, reason: "notFound" };
  }
  if (!antiBot) {
    return { ok: false, reason: sawBlock ? "notConfigured" : "network" };
  }
  const antiBotResult = await attempt(antiBot);
  if (antiBotResult) {
    return { ok: true, character: antiBotResult };
  }
  if (sawPage) {
    return { ok: false, reason: "notFound" };
  }
  return { ok: false, reason: sawBlock ? "blocked" : "network" };
}

/** Dedupe key stored on the skill row: one import per source per user. */
export function importSourceKey(
  platform: typeof SkillImportPlatformValue,
  sourceId: string,
): string {
  const prefix = platform === SkillImportPlatform.TALKIE ? "talkie" : "cai";
  return `${prefix}:${sourceId}`;
}

// ─── Skill content ──────────────────────────────────────────────────────────

/** Replace the `{{char}}` / `{{user}}` placeholders both platforms use. */
function fillPlaceholders(text: string, name: string): string {
  return text
    .replaceAll(/\{\{\s*char\s*\}\}|<\s*BOT\s*>/gi, name)
    .replaceAll(/\{\{\s*user\s*\}\}|<\s*USER\s*>/gi, "the user");
}

/** The skill fields built from a parsed character. */
export interface ImportedSkillContent {
  name: string;
  tagline: string;
  description: string;
  systemPrompt: string;
  /** Which source fields made it into the skill. */
  importedFields: ImportedField[];
}

export type ImportedField =
  | "name"
  | "avatar"
  | "greeting"
  | "description"
  | "definition"
  | "tags";

function firstLine(text: string | null): string | null {
  return text?.split("\n").find((line) => line.trim().length > 0) ?? null;
}

/**
 * Build skill fields. `fallbackTagline` is the localized "Imported from X"
 * line, used when the source has no title or description.
 */
export function buildSkillContent(
  character: ParsedCharacter,
  fallbackTagline: string,
): ImportedSkillContent {
  const name = truncateText(
    character.name.length >= 2
      ? character.name
      : `${character.name} ${fallbackTagline}`,
    NAME_MAX,
  );
  const description = character.description
    ? fillPlaceholders(character.description, name)
    : null;
  const greeting = character.greeting
    ? fillPlaceholders(character.greeting, name)
    : null;
  const definition = character.definition
    ? fillPlaceholders(character.definition, name)
    : null;

  const tagline = truncateText(
    character.title ?? firstLine(description) ?? fallbackTagline,
    TAGLINE_MAX,
  );
  const descriptionText = truncateText(
    description ?? greeting ?? character.title ?? fallbackTagline,
    DESCRIPTION_MAX,
  );

  const sections: string[] = [
    `You are ${name}. Stay in character for the whole conversation: speak, think and act as ${name} would.`,
  ];
  if (character.title) {
    sections.push(fillPlaceholders(character.title, name));
  }
  if (description) {
    sections.push(
      `## About ${name}\n${truncateText(description, PROMPT_SECTION_MAX)}`,
    );
  }
  if (definition) {
    sections.push(
      `## Character definition\n${truncateText(definition, PROMPT_SECTION_MAX)}`,
    );
  }
  if (character.tags.length > 0) {
    sections.push(`## Tags\n${character.tags.join(", ")}`);
  }
  if (greeting) {
    sections.push(
      `## Opening message\nIf you speak first, open with this message (word for word):\n${truncateText(greeting, PROMPT_SECTION_MAX)}`,
    );
  }

  const importedFields: ImportedField[] = ["name"];
  if (character.avatarSourceUrl) {
    importedFields.push("avatar");
  }
  if (greeting) {
    importedFields.push("greeting");
  }
  if (description) {
    importedFields.push("description");
  }
  if (definition) {
    importedFields.push("definition");
  }
  if (character.tags.length > 0) {
    importedFields.push("tags");
  }

  return {
    name,
    tagline: tagline.length >= 2 ? tagline : fallbackTagline,
    description:
      descriptionText.length >= 10 ? descriptionText : fallbackTagline,
    systemPrompt: sections.join("\n\n"),
    importedFields,
  };
}
