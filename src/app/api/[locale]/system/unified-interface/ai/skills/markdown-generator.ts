/**
 * AI Skill Markdown Generator
 * Converts endpoint definitions into rich, AI-ready markdown documentation.
 *
 * Generates two tier files (AGENT.md is a lean gateway document, not a tool list):
 *   - PUBLIC_USER_SKILL.md       → PUBLIC + CUSTOMER endpoints (default for all agents)
 *   - USER_WITH_ACCOUNT_SKILL.md → CUSTOMER-only endpoints (account required)
 *   - [character-id]-skill.md    → per-character skill files (dynamic route)
 *
 * Uses generated endpoints-meta for fast filtering (no registry load).
 * Schema rendering uses getEndpoint() per-tool (lazy). All endpoints are included
 * by default; add UserRole.SKILL_OFF to exclude an endpoint from skill files.
 */

import "server-only";

import { z } from "zod";

import { zodSchemaToJsonSchema } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/endpoint-to-metadata";
import { generateSchemaForUsage } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import { FieldUsage } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { JsonValue } from "@/app/api/[locale]/system/unified-interface/shared/utils/error-types";
import { pathSegmentsToToolName } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

// ============================================================================
// SKILL TIER DEFINITIONS
// ============================================================================

export type SkillTier = "public-user" | "user-with-account";

interface SkillTierConfig {
  tier: SkillTier;
  filename: string;
  title: string;
  subtitle: string;
  description: string;
  requiresAuthentication: boolean;
}

export const SKILL_TIERS: Record<SkillTier, SkillTierConfig> = {
  "public-user": {
    tier: "public-user",
    filename: "PUBLIC_USER_SKILL.md",
    title: "Agent Skill Manifest",
    subtitle: "All Available Tools (Public + Authenticated)",
    description:
      "All tools available to agents — both public endpoints (no auth needed) and " +
      "authenticated endpoints (requires Bearer token or session). " +
      "This is the default manifest to load. Start here.",
    requiresAuthentication: false,
  },
  "user-with-account": {
    tier: "user-with-account",
    filename: "USER_WITH_ACCOUNT_SKILL.md",
    title: "Account-Required Skill Manifest",
    subtitle: "Authenticated Tools Only",
    description:
      "Tools that strictly require an authenticated account (CUSTOMER role). " +
      "Anonymous access is not permitted for any tool in this manifest. " +
      "Use this for agents that only perform account-specific actions.",
    requiresAuthentication: true,
  },
};

// Role key constants (as stored in endpoints-meta allowedRoles)
const ROLE_SKILL_OFF = "enums.userRole.skillOff";
const ROLE_PUBLIC = "enums.userRole.public";
const ROLE_CUSTOMER = "enums.userRole.customer";

// ============================================================================
// PARAMETER SCHEMA RENDERER
// ============================================================================

interface JsonSchemaObject {
  type?: string | string[];
  properties?: Record<string, JsonSchemaObject>;
  required?: string[];
  items?: JsonSchemaObject;
  enum?: JsonValue[];
  anyOf?: JsonSchemaObject[];
  description?: string;
  default?: JsonValue;
}

/**
 * Returns true if a string looks like an i18n translation key (dotted path, no spaces).
 * Used to skip rendering raw translation key strings as default values.
 */
function isTranslationKey(value: JsonValue): boolean {
  return (
    typeof value === "string" &&
    value.includes(".") &&
    !value.includes(" ") &&
    /^[a-zA-Z0-9._-]+$/.test(value)
  );
}

function renderJsonSchemaAsMarkdown(
  schema: JsonSchemaObject,
  indent = 0,
): string {
  if (!schema || typeof schema !== "object") {
    return "";
  }

  const lines: string[] = [];
  const pad = "  ".repeat(indent);

  if (schema.type === "object" && schema.properties) {
    const required: string[] = Array.isArray(schema.required)
      ? schema.required
      : [];

    for (const [key, value] of Object.entries(schema.properties)) {
      const prop = value;
      const isRequired = required.includes(key);
      const typeStr = formatType(prop);
      const descStr = prop.description ? ` — ${prop.description}` : "";
      // Only show defaults that are meaningful (not i18n keys, not objects)
      const showDefault =
        prop.default !== undefined &&
        !isTranslationKey(prop.default) &&
        typeof prop.default !== "object";
      const defaultStr = showDefault
        ? ` (default: \`${JSON.stringify(prop.default)}\`)`
        : "";
      const reqStr = isRequired ? "" : " *(optional)*";

      lines.push(
        `${pad}- \`${key}\` \`${typeStr}\`${reqStr}${descStr}${defaultStr}`,
      );

      // Recurse into nested objects
      if (prop.type === "object" && prop.properties) {
        lines.push(renderJsonSchemaAsMarkdown(prop, indent + 1));
      }
    }
  }

  return lines.join("\n");
}

function formatType(prop: JsonSchemaObject): string {
  if (Array.isArray(prop.type)) {
    // Deduplicate types (e.g. "string | string | null" → "string | null")
    return [...new Set(prop.type)].join(" | ");
  }
  if (prop.type === "array") {
    const items = prop.items;
    if (items?.type) {
      return `${Array.isArray(items.type) ? [...new Set(items.type)].join("|") : items.type}[]`;
    }
    return "array";
  }
  if (prop.enum) {
    const enumVals = prop.enum;
    // Show up to 8 enum values inline (using shortened display names); beyond that summarise
    if (enumVals.length <= 8) {
      return enumVals.map((v) => `"${v}"`).join(" | ");
    }
    return `enum(${enumVals.length} values)`;
  }
  if (prop.anyOf) {
    // Deduplicate resolved types
    const parts = [
      ...new Set(prop.anyOf.map((s) => formatType(s)).filter(Boolean)),
    ];
    return parts.join(" | ");
  }
  // Empty schema {} from transforms/pipelines — show as "string" (most common)
  if (!prop.type && !prop.enum && !prop.anyOf) {
    return "string";
  }
  return String(prop.type ?? "any");
}

// ============================================================================
// SCHEMA RENDERING (via lazy getEndpoint per tool)
// ============================================================================

async function renderInputSchemaBlock(toolName: string): Promise<string> {
  try {
    const { getEndpoint } =
      await import("@/app/api/[locale]/system/generated/endpoint");
    const endpoint = await getEndpoint(toolName);
    if (!endpoint?.fields) {
      return "";
    }

    const requestDataSchema = generateSchemaForUsage(
      endpoint.fields,
      FieldUsage.RequestData,
    ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;

    const urlParamsSchema = generateSchemaForUsage(
      endpoint.fields,
      FieldUsage.RequestUrlParams,
    ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;

    const combinedShape: Record<string, z.ZodTypeAny> = {};
    if (requestDataSchema instanceof z.ZodObject) {
      Object.assign(combinedShape, requestDataSchema.shape);
    }
    if (urlParamsSchema instanceof z.ZodObject) {
      Object.assign(combinedShape, urlParamsSchema.shape);
    }

    if (Object.keys(combinedShape).length === 0) {
      return "";
    }

    const combinedSchema = z.object(combinedShape);
    const jsonSchemaObj = zodSchemaToJsonSchema(
      combinedSchema,
    ) as JsonSchemaObject;
    const rendered = renderJsonSchemaAsMarkdown(jsonSchemaObj);
    return rendered ? `\n**Parameters:**\n${rendered}` : "";
  } catch {
    return "";
  }
}

// ============================================================================
// META-BASED ENDPOINT INFO TYPE
// ============================================================================

interface SkillEndpointInfo {
  toolName: string;
  method: string;
  path: string[];
  allowedRoles: string[];
  aliases: string[];
  title: string;
  description: string;
  category: string;
  tags: string[];
  credits?: number;
  requiresConfirmation?: boolean;
}

// ============================================================================
// SINGLE ENDPOINT RENDERER (using meta + lazy schema)
// ============================================================================

async function renderEndpointFromMeta(
  ep: SkillEndpointInfo,
  index: number,
): Promise<string> {
  const toolName = ep.toolName;
  const fullToolName = pathSegmentsToToolName(ep.path, ep.method);

  const inputSchemaBlock = await renderInputSchemaBlock(toolName);

  // Confirm/credits info
  const extras: string[] = [];
  if (ep.requiresConfirmation) {
    extras.push("⚠️ *Requires user confirmation before execution*");
  }
  if (ep.credits && ep.credits > 0) {
    extras.push(`💳 *Costs ${ep.credits} credit(s)*`);
  }

  // Authentication requirement
  const requiresAuth = !ep.allowedRoles.includes(ROLE_PUBLIC);
  const authNote = requiresAuth
    ? "🔒 *Requires authentication (Bearer token)*"
    : "🌐 *Public — no authentication required*";

  // Aliases (all aliases from meta + any remaining)
  const allAliases = ep.aliases;
  const aliasBlock =
    allAliases.length > 0
      ? `\n**Aliases:** ${allAliases.map((a) => `\`${a}\``).join(", ")}`
      : "";

  const categoryStr = ep.category ? `\n**Category:** ${ep.category}` : "";
  const tagsStr =
    ep.tags.length > 0
      ? `\n**Tags:** ${ep.tags.map((tag) => `\`${tag}\``).join(", ")}`
      : "";
  const extrasStr = extras.length > 0 ? `\n${extras.join(" · ")}` : "";

  return [
    `### ${index}. \`${toolName}\``,
    "",
    `**${ep.title}**`,
    "",
    ep.description,
    "",
    `**Method:** \`${ep.method}\` · **Tool name:** \`${toolName}\``,
    fullToolName !== toolName ? `**Full path:** \`${fullToolName}\`` : null,
    authNote,
    categoryStr || null,
    tagsStr || null,
    aliasBlock || null,
    extrasStr || null,
    inputSchemaBlock || null,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

// ============================================================================
// TIER FILTER (using meta allowedRoles strings)
// ============================================================================

function filterForTier(
  endpoints: SkillEndpointInfo[],
  tier: SkillTier,
): SkillEndpointInfo[] {
  return endpoints.filter((ep) => {
    const roles = ep.allowedRoles;
    switch (tier) {
      case "public-user":
        return roles.includes(ROLE_CUSTOMER) || roles.includes(ROLE_PUBLIC);
      case "user-with-account":
        return roles.includes(ROLE_CUSTOMER) && !roles.includes(ROLE_PUBLIC);
      default: {
        const _exhaustiveCheck: never = tier;
        return _exhaustiveCheck;
      }
    }
  });
}

// ============================================================================
// LOCALE → META FILE MAPPING
// ============================================================================

async function loadMetaForLocale(
  locale: CountryLanguage,
): Promise<SkillEndpointInfo[]> {
  // Map locale to generated file
  const localeFileMap: Partial<Record<CountryLanguage, string>> = {
    "en-US": "en",
    "de-DE": "de",
    "pl-PL": "pl",
  };
  const file = localeFileMap[locale] ?? "en";

  const mod = (await import(
    `@/app/api/[locale]/system/generated/endpoints-meta/${file}`
  )) as {
    endpointsMeta: SkillEndpointInfo[];
  };

  return mod.endpointsMeta.filter(
    (ep) => !ep.allowedRoles.includes(ROLE_SKILL_OFF),
  );
}

// ============================================================================
// CATEGORY GROUPING
// ============================================================================

function groupByCategory(
  endpoints: SkillEndpointInfo[],
): Map<string, SkillEndpointInfo[]> {
  const groups = new Map<string, SkillEndpointInfo[]>();
  for (const ep of endpoints) {
    const existing = groups.get(ep.category) ?? [];
    existing.push(ep);
    groups.set(ep.category, existing);
  }
  return groups;
}

// ============================================================================
// AI RUN SHARED BLOCKS
// ============================================================================

const AI_RUN_PARAMS_TABLE = `
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| \`prompt\` | \`string\` | ✅ | Your task or question for the character |
| \`character\` | \`string\` | — | Character ID. Omit to use the default assistant |
| \`model\` | \`string\` | — | Model ID (e.g. \`claude-sonnet-4-6\`). Character may have a preferred model |
| \`instructions\` | \`string\` | — | Extra system-level instructions appended after the character's system prompt |
| \`allowedTools\` | \`array\` | — | Restrict which tools the AI may call. Omit to use the character's full tool set |
| \`maxTurns\` | \`number\` | — | Max agentic turns before stopping. Omit for no limit |
| \`preCalls\` | \`array\` | — | Endpoints to call before the prompt — results are injected as context |
| \`rootFolderId\` | \`string\` | — | Where to store the thread: \`"cron"\` (persisted), \`"incognito"\` (no persistence), \`"private"\`, \`"public"\` |
| \`appendThreadId\` | \`string\` | — | UUID of an existing thread to continue |
| \`excludeMemories\` | \`boolean\` | — | Set \`true\` to skip injecting the character's stored memories |
`.trim();

const AI_RUN_RESPONSE_TABLE = `
| Field | Type | Description |
|-------|------|-------------|
| \`text\` | \`string \\| null\` | Final AI response text |
| \`threadId\` | \`string \\| null\` | UUID of the created thread (null for incognito) |
| \`lastAiMessageId\` | \`string \\| null\` | UUID of the last AI message |
| \`threadTitle\` | \`string \\| null\` | Auto-generated thread title |
| \`promptTokens\` | \`number \\| null\` | Input tokens consumed |
| \`completionTokens\` | \`number \\| null\` | Output tokens generated |
| \`preCallResults\` | \`array\` | Status of each pre-call: \`{ routeId, success, error }\` |
`.trim();

/**
 * Renders a compact "Use via AI Run" section embedded into skill files.
 * Self-contained — agents can act immediately without loading a separate guide.
 */
function renderInlineAiRunSection(opts: {
  runUrl: string;
  characterId?: string;
  exampleModel: string;
  exampleFolder: "cron" | "incognito";
  exampleMaxTurns: number;
  requiresAuth: boolean;
}): string {
  const {
    runUrl,
    characterId,
    exampleModel,
    exampleFolder,
    exampleMaxTurns,
    requiresAuth,
  } = opts;

  const authLine = requiresAuth
    ? "\nAuthorization: Bearer <YOUR_JWT_TOKEN>"
    : "";
  const characterLine = characterId ? `\n  "character": "${characterId}",` : "";
  const folderNote =
    exampleFolder === "incognito"
      ? "> 💡 `incognito` — no thread stored, context-saving for stateless queries."
      : "> 💡 `cron` — thread persisted for auditing agentic tool calls.";

  const delegateTarget = characterId ? "this character" : "an AI character";

  return [
    "---",
    "",
    "## Use via AI Run",
    "",
    `Delegate a task to ${delegateTarget} with a single \`POST ${runUrl}\` call.`,
    "The AI reasons, calls tools if needed across multiple turns, and returns the final text.",
    "",
    "```http",
    `POST ${runUrl}`,
    `Content-Type: application/json${authLine}`,
    "```",
    "```json",
    `{${characterLine}`,
    `  "prompt": "Your task here",`,
    `  "model": "${exampleModel}",`,
    `  "rootFolderId": "${exampleFolder}",`,
    `  "maxTurns": ${exampleMaxTurns}`,
    "}",
    "```",
    "",
    folderNote,
    "",
    "<details>",
    "<summary>All AI Run parameters</summary>",
    "",
    AI_RUN_PARAMS_TABLE,
    "",
    "</details>",
    "",
    "<details>",
    "<summary>Response fields</summary>",
    "",
    AI_RUN_RESPONSE_TABLE,
    "",
    "</details>",
    "",
  ].join("\n");
}

// ============================================================================
// TIER AI RUN GENERATOR (lean pointer — skill file is self-contained)
// ============================================================================

export async function generateTierAiRunMarkdown(
  tier: SkillTier,
  locale: CountryLanguage,
): Promise<string> {
  const config = SKILL_TIERS[tier];
  const now = new Date().toISOString();
  const baseUrl = env.NEXT_PUBLIC_APP_URL ?? "https://your-app.com";
  const apiBase = `${baseUrl}/api/${locale}`;
  const runUrl = `${apiBase}/agent/ai-stream/run`;
  const skillUrl = `${baseUrl}/api/${locale}/system/unified-interface/ai/skills/${config.filename}`;
  const agentUrl = `${baseUrl}/api/${locale}/system/unified-interface/ai/skills/AGENT.md`;

  const authLine = config.requiresAuthentication
    ? "\nAuthorization: Bearer <YOUR_JWT_TOKEN>"
    : "";

  return [
    `# AI Run Quick Reference — ${config.title}`,
    "",
    `> The **[${config.filename}](${skillUrl})** skill file is self-contained — it includes tool schemas and this AI Run section inline.`,
    `> Load that file for the full reference. This file is a quick standalone guide for \`POST ${runUrl}\`.`,
    "",
    "---",
    "",
    "## Quick Example",
    "",
    "```http",
    `POST ${runUrl}`,
    `Content-Type: application/json${authLine}`,
    "```",
    "```json",
    "{",
    `  "prompt": "Summarise the top 3 threads in the public folder",`,
    `  "model": "claude-haiku-4-5-20251001",`,
    `  "rootFolderId": "incognito",`,
    `  "maxTurns": 1`,
    "}",
    "```",
    "",
    "> 💡 `incognito` — no thread stored, ideal for stateless one-shot queries.",
    "",
    "## With a Specific Character",
    "",
    "```json",
    "{",
    `  "character": "research-agent",`,
    `  "prompt": "Find the latest news on AI regulation and summarise key points",`,
    `  "model": "claude-sonnet-4-6",`,
    `  "rootFolderId": "cron",`,
    `  "maxTurns": 5`,
    "}",
    "```",
    "",
    `> See [AGENT.md](${agentUrl}) for all available characters and their skill files.`,
    "",
    "---",
    "",
    "## Parameters",
    "",
    AI_RUN_PARAMS_TABLE,
    "",
    "---",
    "",
    "## Response",
    "",
    AI_RUN_RESPONSE_TABLE,
    "",
    "---",
    "",
    `*Generated: \`${now}\` · Tier: \`${tier}\` · Locale: \`${locale}\`*`,
    "",
  ].join("\n");
}

// ============================================================================
// CHARACTER AI RUN GENERATOR
// ============================================================================

/**
 * Derive the best example model string from a character's modelSelection.
 * Uses the max intelligence range to pick the most capable allowed model.
 */
function pickExampleModel(
  modelSelection:
    | { selectionType: string; intelligenceRange?: { max?: string } }
    | null
    | undefined,
): string {
  if (!modelSelection) {
    return "claude-haiku-4-5-20251001";
  }
  const maxIntelligence = modelSelection.intelligenceRange?.max;
  if (maxIntelligence === "enums.intelligence.brilliant") {
    return "claude-sonnet-4-6";
  }
  return "claude-haiku-4-5-20251001";
}

export async function generateCharacterAiRunMarkdown(
  characterId: string,
  locale: CountryLanguage,
): Promise<string | null> {
  const charInfo = await getCharacterSkillInfo(characterId, locale);
  if (!charInfo) {
    return null;
  }

  const { DEFAULT_CHARACTERS } =
    await import("@/app/api/[locale]/agent/chat/characters/config");
  const defaultChar = DEFAULT_CHARACTERS.find((c) => c.id === characterId);
  const modelSelection = defaultChar?.modelSelection ?? null;

  const now = new Date().toISOString();
  const baseUrl = env.NEXT_PUBLIC_APP_URL ?? "https://your-app.com";
  const apiBase = `${baseUrl}/api/${locale}`;
  const runUrl = `${apiBase}/agent/ai-stream/run`;
  const skillUrl = `${baseUrl}/api/${locale}/system/unified-interface/ai/skills/${characterId}-skill.md`;

  const hasTools =
    charInfo.activeTools !== null && charInfo.activeTools.length > 0;
  const exampleModel = pickExampleModel(
    modelSelection as Parameters<typeof pickExampleModel>[0],
  );
  const exampleFolder = hasTools ? "cron" : "incognito";
  const exampleMaxTurns = hasTools ? 5 : 1;
  const authLine = charInfo.requiresAuth
    ? "\nAuthorization: Bearer <YOUR_JWT_TOKEN>"
    : "";

  return [
    `# ${charInfo.name} — AI Run Quick Reference`,
    `## ${charInfo.tagline}`,
    "",
    `> The **[${characterId}-skill.md](${skillUrl})** skill file is self-contained — it includes the tool listing and this AI Run section inline.`,
    `> Load that file for the full reference. This file is a quick standalone guide for \`POST ${runUrl}\`.`,
    "",
    "---",
    "",
    "## Quick Example",
    "",
    "```http",
    `POST ${runUrl}`,
    `Content-Type: application/json${authLine}`,
    "```",
    "```json",
    "{",
    `  "character": "${characterId}",`,
    `  "prompt": "Your task here",`,
    `  "model": "${exampleModel}",`,
    `  "rootFolderId": "${exampleFolder}",`,
    `  "maxTurns": ${exampleMaxTurns}`,
    "}",
    "```",
    "",
    exampleFolder === "incognito"
      ? "> 💡 `incognito` — no thread stored, context-saving for stateless queries."
      : "> 💡 `cron` — thread persisted for auditing agentic tool calls.",
    ...(hasTools && charInfo.activeTools
      ? [
          "",
          "## Tools this character uses",
          "",
          ...charInfo.activeTools.map((t) => {
            const confirmNote = t.requiresConfirmation
              ? " *(requires confirmation)*"
              : "";
            return `- \`${t.toolId}\`${confirmNote}`;
          }),
        ]
      : []),
    "",
    "---",
    "",
    "## Parameters",
    "",
    AI_RUN_PARAMS_TABLE,
    "",
    "---",
    "",
    "## Response",
    "",
    AI_RUN_RESPONSE_TABLE,
    "",
    "---",
    "",
    `*Generated: \`${now}\` · Character: \`${characterId}\` · Locale: \`${locale}\`*`,
    "",
  ].join("\n");
}

// ============================================================================
// MAIN MARKDOWN GENERATOR
// ============================================================================

export async function generateSkillMarkdown(
  tier: SkillTier,
  locale: CountryLanguage,
): Promise<string> {
  const config = SKILL_TIERS[tier];

  // Load REMOTE_SKILL endpoints from static meta (no registry, no dynamic loading of all definitions)
  const allRemoteSkill = await loadMetaForLocale(locale);

  // Filter for this tier
  const tierEndpoints = filterForTier(allRemoteSkill, tier);

  if (tierEndpoints.length === 0) {
    return buildEmptyManifest(config);
  }

  // Group by category
  const grouped = groupByCategory(tierEndpoints);

  const now = new Date().toISOString();
  const baseUrl = env.NEXT_PUBLIC_APP_URL ?? "https://your-app.com";
  const apiBase = `${baseUrl}/api/${locale}`;
  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────────
  lines.push(`# ${config.title}`);
  lines.push(`## ${config.subtitle}`);
  lines.push("");
  lines.push(`> ${config.description}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // ── Meta ────────────────────────────────────────────────────────────────────
  lines.push("## Overview");
  lines.push("");
  lines.push(`| Field | Value |`);
  lines.push(`|-------|-------|`);
  lines.push(`| **Tier** | \`${tier}\` |`);
  lines.push(`| **Total tools** | ${tierEndpoints.length} |`);
  lines.push(`| **Categories** | ${grouped.size} |`);
  lines.push(
    `| **Authentication** | ${config.requiresAuthentication ? "Required (Bearer JWT)" : "Optional — some tools public, some require Bearer JWT"} |`,
  );
  lines.push(`| **Base URL** | \`${apiBase}\` |`);
  lines.push(`| **Generated** | \`${now}\` |`);
  lines.push(`| **Locale** | \`${locale}\` |`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // ── Usage instructions ───────────────────────────────────────────────────────
  lines.push("## How to Use");
  lines.push("");
  lines.push(`**Base URL:** \`${apiBase}\``);
  lines.push("");
  lines.push(
    "Append the endpoint path to the base URL. For example, to call `user_public_login_POST`:",
  );
  lines.push("");
  lines.push("```http");
  lines.push(`POST ${apiBase}/user/public/login`);
  lines.push("Content-Type: application/json");
  lines.push("");
  lines.push('{ "email": "agent@example.com", "password": "..." }');
  lines.push("```");
  lines.push("");

  if (config.requiresAuthentication) {
    lines.push(
      "All tools in this manifest require a **Bearer JWT token** in the `Authorization` header:",
    );
    lines.push("");
    lines.push("```http");
    lines.push("Authorization: Bearer <your-jwt-token>");
    lines.push("```");
    lines.push("");
    lines.push(
      "Obtain a token by calling `user_public_login_POST` first. The response includes a `token` field.",
    );
  } else {
    lines.push(
      "Tools in this manifest are **publicly accessible** — no authentication required.",
    );
    lines.push("");
    lines.push(
      "Some tools may return richer results if you include a Bearer token, but it is not mandatory.",
    );
  }

  lines.push("");
  lines.push(
    "Each tool name maps to a path: replace `_` with `/` and strip the method suffix. " +
      "Example: `agent_chat_threads_GET` → `GET /agent/chat/threads`.",
  );
  lines.push("");

  // ── AI Run inline section ─────────────────────────────────────────────────────
  lines.push(
    renderInlineAiRunSection({
      runUrl: `${apiBase}/agent/ai-stream/run`,
      exampleModel: "claude-haiku-4-5-20251001",
      exampleFolder: "incognito",
      exampleMaxTurns: 1,
      requiresAuth: config.requiresAuthentication,
    }),
  );

  // ── Table of Contents ────────────────────────────────────────────────────────
  lines.push("## Table of Contents");
  lines.push("");
  let tocIndex = 1;
  for (const [category, catEndpoints] of grouped) {
    const anchor = category
      .toLowerCase()
      .replaceAll(/\s+/g, "-")
      .replaceAll(/[^a-z0-9-]/g, "");
    lines.push(
      `- [${category}](#${anchor}) (${catEndpoints.length} tool${catEndpoints.length !== 1 ? "s" : ""})`,
    );
    for (const ep of catEndpoints) {
      const toolAnchor = ep.toolName
        .toLowerCase()
        .replaceAll(/[^a-z0-9-]/g, "-");
      lines.push(
        `  - [${tocIndex}. \`${ep.toolName}\`](#${tocIndex}-${toolAnchor})`,
      );
      tocIndex++;
    }
  }
  lines.push("");
  lines.push("---");
  lines.push("");

  // ── Tool Sections ────────────────────────────────────────────────────────────
  lines.push("## Tools");
  lines.push("");

  let globalIndex = 1;
  for (const [category, catEndpoints] of grouped) {
    lines.push(`---`);
    lines.push("");
    lines.push(`### 📂 ${category}`);
    lines.push("");

    for (const ep of catEndpoints) {
      lines.push(await renderEndpointFromMeta(ep, globalIndex++));
      lines.push("");
    }
  }

  // ── Footer ───────────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push("");
  lines.push(
    `*This manifest was auto-generated from live endpoint definitions on ${now}. ` +
      `Do not edit manually — it will be regenerated on the next request.*`,
  );
  lines.push("");

  return lines.join("\n");
}

function buildEmptyManifest(config: SkillTierConfig): string {
  return [
    `# ${config.title}`,
    `## ${config.subtitle}`,
    "",
    `> ${config.description}`,
    "",
    "---",
    "",
    "## No tools available",
    "",
    "No endpoints are available for this tier.",
    "",
    "All endpoints appear in skill files by default. To exclude an endpoint, add `UserRole.SKILL_OFF` to its `allowedRoles` array.",
    "",
  ].join("\n");
}

// ============================================================================
// CHARACTER SKILL GENERATOR
// ============================================================================

/**
 * Describes a character's tool set and metadata for skill generation.
 * Covers both default (system) characters and custom (DB) characters.
 */
export interface CharacterSkillInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  /** null = inherits all tools (generic character) */
  activeTools: Array<{ toolId: string; requiresConfirmation: boolean }> | null;
  /** true if character requires CUSTOMER role */
  requiresAuth: boolean;
}

/**
 * Look up a character for skill generation.
 * Handles default (system) characters and public custom (DB) characters.
 * Returns null if the character doesn't exist, is admin-only, or is a private custom character.
 */
export async function getCharacterSkillInfo(
  characterId: string,
  locale: CountryLanguage,
): Promise<CharacterSkillInfo | null> {
  const { DEFAULT_CHARACTERS } =
    await import("@/app/api/[locale]/agent/chat/characters/config");

  // Check default/system characters first
  const defaultChar = DEFAULT_CHARACTERS.find((c) => c.id === characterId);
  if (defaultChar) {
    const { UserPermissionRole } =
      await import("@/app/api/[locale]/user/user-roles/enum");

    const roles = defaultChar.userRole ?? [
      UserPermissionRole.CUSTOMER,
      UserPermissionRole.ADMIN,
    ];

    // Exclude admin-only characters (only ADMIN role, no CUSTOMER or PUBLIC)
    const hasCustomer = roles.includes(UserPermissionRole.CUSTOMER);
    const hasPublic = roles.includes(UserPermissionRole.PUBLIC);
    const hasAdmin = roles.includes(UserPermissionRole.ADMIN);
    if (hasAdmin && !hasCustomer && !hasPublic) {
      return null;
    }

    // Also exclude instance-filtered characters (hermes-only)
    if (defaultChar.instanceFilter && defaultChar.instanceFilter.length > 0) {
      return null;
    }

    const { scopedTranslation: charTranslation } =
      await import("@/app/api/[locale]/agent/chat/characters/i18n");
    const { t } = charTranslation.scopedT(locale);

    return {
      id: defaultChar.id,
      name: t(defaultChar.name),
      tagline: t(defaultChar.tagline),
      description: t(defaultChar.description),
      category: defaultChar.category,
      activeTools: defaultChar.activeTools
        ? defaultChar.activeTools.map((tool) => ({
            toolId: tool.toolId,
            requiresConfirmation: tool.requiresConfirmation ?? false,
          }))
        : null,
      requiresAuth: !hasPublic,
    };
  }

  // Fall back to DB — only PUBLIC custom characters are accessible without auth
  const { db } = await import("@/app/api/[locale]/system/db");
  const { customCharacters } =
    await import("@/app/api/[locale]/agent/chat/characters/db");
  const { CharacterOwnershipType } =
    await import("@/app/api/[locale]/agent/chat/characters/enum");
  const { eq, and } = await import("drizzle-orm");

  const [row] = await db
    .select()
    .from(customCharacters)
    .where(
      and(
        eq(customCharacters.id, characterId),
        eq(customCharacters.ownershipType, CharacterOwnershipType.PUBLIC),
      ),
    )
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    category: row.category,
    activeTools: row.activeTools
      ? row.activeTools.map(
          (t: { toolId: string; requiresConfirmation?: boolean }) => ({
            toolId: t.toolId,
            requiresConfirmation: t.requiresConfirmation ?? false,
          }),
        )
      : null,
    requiresAuth: true, // custom characters always require auth
  };
}

/**
 * Generate a character-scoped skill markdown file.
 * - If character has activeTools: only those tool aliases appear
 * - If character has no activeTools: falls back to full public-user tier
 * - Returns null if character not found or is admin-only
 */
export async function generateCharacterSkillMarkdown(
  characterId: string,
  locale: CountryLanguage,
): Promise<string | null> {
  const charInfo = await getCharacterSkillInfo(characterId, locale);
  if (!charInfo) {
    return null;
  }

  const allRemoteSkill = await loadMetaForLocale(locale);

  let endpoints: SkillEndpointInfo[];

  if (charInfo.activeTools && charInfo.activeTools.length > 0) {
    // Build a set of alias IDs this character uses
    const toolIdSet = new Set(charInfo.activeTools.map((t) => t.toolId));

    // Map alias → requiresConfirmation for rendering
    const confirmationMap = new Map(
      charInfo.activeTools.map((t) => [t.toolId, t.requiresConfirmation]),
    );

    // Filter REMOTE_SKILL endpoints to only those whose toolName or aliases match
    endpoints = allRemoteSkill
      .filter(
        (ep) =>
          toolIdSet.has(ep.toolName) ||
          ep.aliases.some((alias) => toolIdSet.has(alias)),
      )
      .map((ep) => {
        // Apply character-level requiresConfirmation override
        const alias = ep.aliases.find((a) => toolIdSet.has(a));
        const toolId = toolIdSet.has(ep.toolName) ? ep.toolName : alias;
        const charConfirm = toolId ? confirmationMap.get(toolId) : undefined;
        return charConfirm !== undefined
          ? { ...ep, requiresConfirmation: charConfirm }
          : ep;
      });
  } else {
    // No activeTools — generic character, use full public-user tier
    endpoints = filterForTier(allRemoteSkill, "public-user");
  }

  // Fetch model selection for accurate AI Run example
  const { DEFAULT_CHARACTERS } =
    await import("@/app/api/[locale]/agent/chat/characters/config");
  const defaultChar = DEFAULT_CHARACTERS.find((c) => c.id === characterId);
  const modelSelection = defaultChar?.modelSelection ?? null;

  const now = new Date().toISOString();
  const baseUrl = env.NEXT_PUBLIC_APP_URL ?? "https://your-app.com";
  const apiBase = `${baseUrl}/api/${locale}`;
  const hasTools =
    charInfo.activeTools !== null && charInfo.activeTools.length > 0;
  const exampleModel = pickExampleModel(
    modelSelection as Parameters<typeof pickExampleModel>[0],
  );
  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────────
  lines.push(`# ${charInfo.name} — Skill Manifest`);
  lines.push(`## ${charInfo.tagline}`);
  lines.push("");
  lines.push(`> ${charInfo.description}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // ── Auth section ─────────────────────────────────────────────────────────────
  if (charInfo.requiresAuth) {
    lines.push("## Authentication Required");
    lines.push("");
    lines.push(
      "This character requires a signed-in account. Include your JWT token on every request:",
    );
    lines.push("");
    lines.push("```http");
    lines.push("Authorization: Bearer <YOUR_JWT_TOKEN>");
    lines.push("```");
    lines.push("");
    lines.push(
      `To obtain a token: \`POST ${apiBase}/user/public/login\` with your credentials. The response includes a \`token\` field.`,
    );
  } else {
    lines.push("## Authentication");
    lines.push("");
    lines.push(
      "🌐 This character's tools are publicly accessible — no authentication required.",
    );
    lines.push("");
    lines.push(
      "Some tools may return richer results if you include a Bearer token, but it is not mandatory.",
    );
  }
  lines.push("");
  lines.push("---");
  lines.push("");

  // ── Meta ─────────────────────────────────────────────────────────────────────
  lines.push("## Overview");
  lines.push("");
  lines.push("| Field | Value |");
  lines.push("|-------|-------|");
  lines.push(`| **Character** | ${charInfo.name} |`);
  lines.push(`| **Category** | ${charInfo.category} |`);
  lines.push(
    `| **Tool scope** | ${charInfo.activeTools ? `${endpoints.length} character-specific tools` : "All available tools (generic character)"} |`,
  );
  lines.push(
    `| **Authentication** | ${charInfo.requiresAuth ? "Required (Bearer JWT)" : "Optional"} |`,
  );
  lines.push(`| **Base URL** | \`${apiBase}\` |`);
  lines.push(`| **Generated** | \`${now}\` |`);
  lines.push(`| **Locale** | \`${locale}\` |`);
  lines.push("");
  lines.push("---");
  lines.push("");

  if (endpoints.length === 0) {
    lines.push("## No tools available");
    lines.push("");
    lines.push(
      "No tools are available for this character. All tools are included by default — add `UserRole.SKILL_OFF` to exclude an endpoint.",
    );
    return lines.join("\n");
  }

  // ── AI Run inline section ─────────────────────────────────────────────────────
  lines.push(
    renderInlineAiRunSection({
      runUrl: `${apiBase}/agent/ai-stream/run`,
      characterId,
      exampleModel,
      exampleFolder: hasTools ? "cron" : "incognito",
      exampleMaxTurns: hasTools ? 5 : 1,
      requiresAuth: charInfo.requiresAuth,
    }),
  );

  // ── Table of Contents ─────────────────────────────────────────────────────────
  const grouped = groupByCategory(endpoints);

  lines.push("## Table of Contents");
  lines.push("");
  let tocIndex = 1;
  for (const [category, catEndpoints] of grouped) {
    const anchor = category
      .toLowerCase()
      .replaceAll(/\s+/g, "-")
      .replaceAll(/[^a-z0-9-]/g, "");
    lines.push(
      `- [${category}](#${anchor}) (${catEndpoints.length} tool${catEndpoints.length !== 1 ? "s" : ""})`,
    );
    for (const ep of catEndpoints) {
      const toolAnchor = ep.toolName
        .toLowerCase()
        .replaceAll(/[^a-z0-9-]/g, "-");
      lines.push(
        `  - [${tocIndex}. \`${ep.toolName}\`](#${tocIndex}-${toolAnchor})`,
      );
      tocIndex++;
    }
  }
  lines.push("");
  lines.push("---");
  lines.push("");

  // ── Tool Sections ─────────────────────────────────────────────────────────────
  lines.push("## Tools");
  lines.push("");

  let globalIndex = 1;
  for (const [category, catEndpoints] of grouped) {
    lines.push("---");
    lines.push("");
    lines.push(`### 📂 ${category}`);
    lines.push("");

    for (const ep of catEndpoints) {
      lines.push(await renderEndpointFromMeta(ep, globalIndex++));
      lines.push("");
    }
  }

  // ── Footer ────────────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push("");
  lines.push(
    `*This manifest was auto-generated for character **${charInfo.name}** on ${now}. ` +
      `Do not edit manually — it will be regenerated on the next request.*`,
  );
  lines.push("");

  return lines.join("\n");
}

// ============================================================================
// AGENT.MD CHARACTER LISTING HELPER
// ============================================================================

/**
 * Returns all non-admin, non-instance-filtered default characters
 * suitable for listing in AGENT.md.
 */
export async function getListableCharacters(locale: CountryLanguage): Promise<
  Array<{
    id: string;
    name: string;
    tagline: string;
    category: string;
    requiresAuth: boolean;
  }>
> {
  const { DEFAULT_CHARACTERS } =
    await import("@/app/api/[locale]/agent/chat/characters/config");
  const { UserPermissionRole } =
    await import("@/app/api/[locale]/user/user-roles/enum");
  const { scopedTranslation: charTranslation } =
    await import("@/app/api/[locale]/agent/chat/characters/i18n");
  const { t } = charTranslation.scopedT(locale);

  return DEFAULT_CHARACTERS.filter((char) => {
    // Exclude instance-filtered characters
    if (char.instanceFilter && char.instanceFilter.length > 0) {
      return false;
    }
    const roles = char.userRole ?? [
      UserPermissionRole.CUSTOMER,
      UserPermissionRole.ADMIN,
    ];
    const hasCustomer = roles.includes(UserPermissionRole.CUSTOMER);
    const hasPublic = roles.includes(UserPermissionRole.PUBLIC);
    const hasAdmin = roles.includes(UserPermissionRole.ADMIN);
    // Exclude admin-only
    if (hasAdmin && !hasCustomer && !hasPublic) {
      return false;
    }
    return true;
  }).map((char) => {
    const roles = char.userRole ?? [
      UserPermissionRole.CUSTOMER,
      UserPermissionRole.ADMIN,
    ];
    const hasPublic = roles.includes(UserPermissionRole.PUBLIC);
    return {
      id: char.id,
      name: t(char.name),
      tagline: t(char.tagline),
      category: char.category,
      requiresAuth: !hasPublic,
    };
  });
}
