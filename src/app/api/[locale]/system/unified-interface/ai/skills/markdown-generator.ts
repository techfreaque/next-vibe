/**
 * AI Skill Markdown Generator
 * Converts endpoint definitions into rich, AI-ready markdown documentation.
 *
 * Generates two tier files (AGENT.md is a lean gateway document, not a tool list):
 *   - PUBLIC_USER_SKILL.md       → PUBLIC + CUSTOMER endpoints (default for all agents)
 *   - USER_WITH_ACCOUNT_SKILL.md → CUSTOMER-only endpoints (account required)
 *
 * Uses generated endpoints-meta for fast filtering (no registry load).
 * Schema rendering uses getEndpoint() per-tool (lazy, only REMOTE_SKILL endpoints).
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
const ROLE_REMOTE_SKILL = "enums.userRole.remoteSkill";
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
  )) as { endpointsMeta: SkillEndpointInfo[] };

  return mod.endpointsMeta.filter((ep) =>
    ep.allowedRoles.includes(ROLE_REMOTE_SKILL),
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
  lines.push("---");
  lines.push("");

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
    "No endpoints with the `REMOTE_SKILL` marker are available for this tier.",
    "",
    "To add tools, add `UserRole.REMOTE_SKILL` to the `allowedRoles` array in the endpoint definition.",
    "",
  ].join("\n");
}
