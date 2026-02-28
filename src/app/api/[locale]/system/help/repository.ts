/**
 * Help Repository
 * One class, all platforms:
 *  - Tool discovery / search / detail (AI, MCP, CLI, Web)
 *  - CLI interactive terminal explorer (--interactive flag)
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { z } from "zod";

import {
  enrichJsonSchemaFromFields,
  zodSchemaToJsonSchema,
} from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/endpoint-to-metadata";
import type { InferJwtPayloadTypeFromRoles } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CliCompatiblePlatform } from "../unified-interface/cli/runtime/route-executor";
import { definitionsRegistry } from "../unified-interface/shared/endpoints/definitions/registry";
import { generateSchemaForUsage } from "../unified-interface/shared/field/utils";
import { FieldUsage } from "../unified-interface/shared/types/enums";
import { Platform } from "../unified-interface/shared/types/platform";
import {
  endpointToToolName,
  getPreferredToolName,
} from "../unified-interface/shared/utils/path";
import type { HelpGetRequestOutput, HelpGetResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

// ─── Types ─────────────────────────────────────────────────────────────────

type ToolItem = HelpGetResponseOutput["tools"][number];

// ─── Constants ──────────────────────────────────────────────────────────────

const ALL_SEARCH_LOCALES: CountryLanguage[] = [
  "en-US",
  "de-DE",
  "pl-PL",
] as const;
const COMPACT_DEFAULT_PAGE_SIZE = 25;
const HUMAN_DEFAULT_PAGE_SIZE = 500;
/** If a filtered result set is ≤ this many tools, auto-upgrade to full detail (params + examples) */
const COMPACT_FULL_DETAIL_THRESHOLD = 5;

// ─── Tool discovery helpers ─────────────────────────────────────────────────

function isCompactPlatform(platform: Platform): boolean {
  return platform === Platform.AI || platform === Platform.MCP;
}

function getParameterSchema(
  endpoint: ReturnType<typeof definitionsRegistry.getEndpointsForUser>[number],
  locale: CountryLanguage,
): ToolItem["parameters"] | null {
  if (!endpoint.fields) {
    return null;
  }
  try {
    const requestDataSchema = generateSchemaForUsage(
      endpoint.fields,
      FieldUsage.RequestData,
    ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;
    const urlPathParamsSchema = generateSchemaForUsage(
      endpoint.fields,
      FieldUsage.RequestUrlParams,
    ) as z.ZodObject<Record<string, z.ZodTypeAny>> | z.ZodNever;
    const combinedShape: Record<string, z.ZodTypeAny> = {};
    if (requestDataSchema instanceof z.ZodObject) {
      Object.assign(combinedShape, requestDataSchema.shape);
    }
    if (urlPathParamsSchema instanceof z.ZodObject) {
      Object.assign(combinedShape, urlPathParamsSchema.shape);
    }
    if (Object.keys(combinedShape).length === 0) {
      return null;
    }
    const schema = zodSchemaToJsonSchema(z.object(combinedShape));

    // Flatten the top-level request fields for fieldType enrichment + description resolution
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topLevelFields: Record<string, any> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldsObj = endpoint.fields as any;
    if (fieldsObj && typeof fieldsObj === "object" && "children" in fieldsObj) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const children = (fieldsObj as any).children;
      if (children && typeof children === "object") {
        Object.assign(topLevelFields, children);
      }
    }
    enrichJsonSchemaFromFields(schema, topLevelFields);

    // Add translated descriptions from field metadata to JSON schema properties
    if (
      locale &&
      schema &&
      typeof schema === "object" &&
      "properties" in schema
    ) {
      const props = (
        schema as {
          properties: Record<
            string,
            Record<string, string | number | boolean | null | string[]>
          >;
        }
      ).properties;
      const { t } = endpoint.scopedTranslation.scopedT(locale);
      for (const [key, prop] of Object.entries(props)) {
        if (prop && typeof prop === "object" && !prop.description) {
          const field = topLevelFields[key];
          if (
            field &&
            typeof field === "object" &&
            "description" in field &&
            typeof field.description === "string"
          ) {
            try {
              prop.description = t(field.description);
            } catch {
              /* missing translation — skip */
            }
          }
        }
      }
    }

    // Strip zod-internal ~standard field — not useful for AI consumers
    if (schema && "~standard" in schema) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { "~standard": _std, ...clean } = schema as Record<
        string,
        ToolItem["parameters"]
      >;
      return clean as ToolItem["parameters"];
    }
    return schema;
  } catch {
    return null;
  }
}

function serializeTool(
  tool: ReturnType<
    typeof definitionsRegistry.getSerializedToolsForUser
  >[number],
  parameters?: ToolItem["parameters"],
  includeExamples = false,
): ToolItem {
  const callName =
    tool.aliases && tool.aliases.length > 0 ? tool.aliases[0] : tool.toolName;
  return {
    name: callName,
    title: tool.title,
    id: tool.toolName,
    tags: tool.tags,
    method: tool.method,
    description: tool.description,
    category: tool.category,
    aliases: tool.aliases,
    requiresConfirmation: tool.requiresConfirmation,
    credits: tool.credits,
    parameters,
    examples: includeExamples ? tool.examples : undefined,
  };
}

/** Ultra-compact: just name + description for overview/list. One line per tool. */
function serializeToolMinimal(
  tool: ReturnType<
    typeof definitionsRegistry.getSerializedToolsForUser
  >[number],
): ToolItem {
  const callName =
    tool.aliases && tool.aliases.length > 0 ? tool.aliases[0] : tool.toolName;
  return {
    name: callName,
    title: tool.title,
    id: tool.toolName,
    tags: tool.tags,
    description: tool.description,
    category: tool.category,
    aliases: tool.aliases,
    credits: tool.credits,
  };
}

function buildToolSearchIndex(
  endpoint: ReturnType<typeof definitionsRegistry.getEndpointsForUser>[number],
): string {
  const parts: string[] = [];
  if (endpoint.title) {
    parts.push(String(endpoint.title));
  }
  if (endpoint.description) {
    parts.push(String(endpoint.description));
  }
  if (endpoint.category) {
    parts.push(String(endpoint.category));
  }
  for (const tag of endpoint.tags ?? []) {
    parts.push(String(tag));
  }
  for (const alias of endpoint.aliases ?? []) {
    parts.push(alias);
  }

  for (const locale of ALL_SEARCH_LOCALES) {
    try {
      const { scopedT } = endpoint.scopedTranslation;
      const { t } = scopedT(locale);
      const tryPush = (key: string): void => {
        try {
          parts.push(t(key));
        } catch {
          /* missing translation — skip */
        }
      };
      if (endpoint.description) {
        tryPush(endpoint.description);
      }
      if (endpoint.title) {
        tryPush(endpoint.title);
      }
      if (endpoint.category) {
        tryPush(endpoint.category);
      }
      for (const tag of endpoint.tags ?? []) {
        tryPush(tag);
      }
    } catch {
      /* locale not supported — skip */
    }
  }

  return parts.join(" ").toLowerCase();
}
export class HelpRepository {
  /**
   * Start interactive CLI session — Ink-based route navigator.
   * Called directly from vibe-runtime.ts when -i/--interactive is set.
   * Renders with real Ink (reactive terminal UI, not static output).
   */
  static async startInteractive(
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]> | undefined,
    locale: CountryLanguage,
    platform: CliCompatiblePlatform,
  ): Promise<ResponseType<{ started: boolean }>> {
    if (!user) {
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("interactive.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    const { startInteractiveHelp } = await import("./interactive.cli");
    await startInteractiveHelp(user, locale, platform);
    return success({ started: true });
  }

  static async getTools(
    data: HelpGetRequestOutput,
    user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
    locale: CountryLanguage,
    platform: Platform,
  ): Promise<ResponseType<HelpGetResponseOutput>> {
    const isCompact = isCompactPlatform(platform);
    const effectivePageSize =
      data.pageSize ??
      (isCompact ? COMPACT_DEFAULT_PAGE_SIZE : HUMAN_DEFAULT_PAGE_SIZE);
    const currentPage = data.page ?? 1;

    // Discovery platform: MCP callers see only MCP_VISIBLE tools (opt-in discovery).
    // All other platforms (CLI, AI, web) use Platform.CLI to see the full tool set.
    const discoveryPlatform =
      platform === Platform.MCP ? Platform.MCP : Platform.CLI;

    const allTools = definitionsRegistry.getSerializedToolsForUser(
      discoveryPlatform,
      user,
      locale,
    );
    const totalCount = allTools.length;

    const categoryMap = new Map<string, number>();
    for (const tool of allTools) {
      categoryMap.set(tool.category, (categoryMap.get(tool.category) ?? 0) + 1);
    }
    const categories = [...categoryMap.entries()]
      .toSorted((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    // Detail mode — single tool with full parameter schema
    if (data.toolName) {
      const needle = data.toolName.toLowerCase().trim();
      const matchedTool = allTools.find(
        (t) =>
          t.toolName.toLowerCase() === needle ||
          t.name.toLowerCase() === needle ||
          t.aliases?.some((a) => a.toLowerCase() === needle),
      );
      if (!matchedTool) {
        return success({
          tools: [] satisfies ToolItem[],
          totalCount,
          matchedCount: 0,
          categories,
          hint: `Tool "${data.toolName}" not found. Use query to search by keyword.`,
        });
      }
      const allEndpoints = definitionsRegistry.getEndpointsForUser(
        discoveryPlatform,
        user,
      );
      const endpoint = allEndpoints.find((e) => {
        const preferred = getPreferredToolName(e);
        const internal = endpointToToolName(e);
        return (
          preferred.toLowerCase() === needle ||
          internal.toLowerCase() === needle ||
          e.aliases?.some((a) => a.toLowerCase() === needle)
        );
      });
      const parameters = endpoint
        ? (getParameterSchema(endpoint, locale) ?? undefined)
        : undefined;
      const aliases = matchedTool.aliases?.length
        ? matchedTool.aliases
        : undefined;
      const callAs = aliases?.[0] ?? matchedTool.toolName;
      return success({
        tools: [serializeTool(matchedTool, parameters, true)],
        totalCount,
        matchedCount: 1,
        hint: `Call as: execute-tool toolName="${callAs}"${aliases && aliases.length > 1 ? ` (aliases: ${aliases.join(", ")})` : ""}. CLI: vibe ${callAs} [--field=value].`,
      });
    }

    const query = data.query?.toLowerCase().trim();
    const category = data.category?.toLowerCase().trim();

    // Auto-upgrade to detail mode when query exactly matches a tool name or alias
    // This makes `vibe help web-search` show full detail instead of a search result
    if (query && !category) {
      const exactMatch = allTools.find(
        (t) =>
          t.toolName.toLowerCase() === query ||
          t.name.toLowerCase() === query ||
          t.aliases?.some((a) => a.toLowerCase() === query),
      );
      if (exactMatch) {
        const allEndpoints = definitionsRegistry.getEndpointsForUser(
          discoveryPlatform,
          user,
        );
        const needle = exactMatch.toolName.toLowerCase();
        const endpoint = allEndpoints.find(
          (e) =>
            endpointToToolName(e).toLowerCase() === needle ||
            e.aliases?.some((a) => a.toLowerCase() === needle),
        );
        const parameters = endpoint
          ? (getParameterSchema(endpoint, locale) ?? undefined)
          : undefined;
        const aliases = exactMatch.aliases?.length
          ? exactMatch.aliases
          : undefined;
        const callAs = aliases?.[0] ?? exactMatch.toolName;
        return success({
          tools: [serializeTool(exactMatch, parameters, true)],
          totalCount,
          matchedCount: 1,
          hint: `Call as: execute-tool toolName="${callAs}"${aliases && aliases.length > 1 ? ` (aliases: ${aliases.join(", ")})` : ""}. CLI: vibe ${callAs} [--field=value].`,
        });
      }
    }

    // AI/MCP overview — no params → return paginated first page with categories
    // (Previously returned tools:[] which was confusing — callers had no way to discover tools without knowing params)

    let filtered = allTools;

    if (query) {
      const allEndpoints = definitionsRegistry.getEndpointsForUser(
        discoveryPlatform,
        user,
      );
      const searchIndexMap = new Map<string, string>();
      for (const ep of allEndpoints) {
        searchIndexMap.set(endpointToToolName(ep), buildToolSearchIndex(ep));
      }
      filtered = filtered.filter((tool) => {
        if (
          tool.name.toLowerCase().includes(query) ||
          tool.toolName.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.aliases?.some((a) => a.toLowerCase().includes(query)) ||
          tool.tags.some((t) => t.toLowerCase().includes(query))
        ) {
          return true;
        }
        return searchIndexMap.get(tool.toolName)?.includes(query) ?? false;
      });
    }

    if (category) {
      filtered = filtered.filter((t) =>
        t.category?.toLowerCase().includes(category),
      );
    }

    const matchedCount = filtered.length;
    const totalPages = Math.ceil(matchedCount / effectivePageSize);
    const safePage = Math.min(currentPage, Math.max(1, totalPages));
    const offset = (safePage - 1) * effectivePageSize;
    const pageSlice = filtered.slice(offset, offset + effectivePageSize);

    if (isCompact) {
      // ≤ threshold → auto-upgrade to full detail (params + examples)
      if (matchedCount <= COMPACT_FULL_DETAIL_THRESHOLD) {
        const allEndpoints = definitionsRegistry.getEndpointsForUser(
          discoveryPlatform,
          user,
        );
        const tools: ToolItem[] = pageSlice.map((tool) => {
          const needle = tool.toolName.toLowerCase();
          const endpoint = allEndpoints.find(
            (e) =>
              endpointToToolName(e).toLowerCase() === needle ||
              e.aliases?.some((a) => a.toLowerCase() === needle),
          );
          const parameters = endpoint
            ? (getParameterSchema(endpoint, locale) ?? undefined)
            : undefined;
          return serializeTool(tool, parameters, true);
        });
        return success({
          tools,
          totalCount,
          matchedCount,
          hint:
            matchedCount === 0
              ? `No tools matched. Try a broader query or call without params to see all categories.`
              : `Showing full detail for ${matchedCount} tool${matchedCount === 1 ? "" : "s"}. To call a tool: execute-tool toolName="<name>" (use the name field). CLI: vibe <name> [--field=value].`,
        });
      }
      // > threshold → minimal list to preserve context
      const paginationHint =
        totalPages > 1
          ? ` Page ${safePage}/${totalPages} — use page= to navigate.`
          : "";
      return success({
        tools: pageSlice.map(serializeToolMinimal),
        totalCount,
        matchedCount,
        categories,
        hint: `${matchedCount} tools matched. Use toolName="<name>" for full schema + examples (name is the preferred call name). To call: execute-tool toolName="<name>".${paginationHint}`,
        currentPage: safePage,
        effectivePageSize,
        totalPages,
      });
    }

    return success({
      tools: pageSlice.map((t) => serializeTool(t)),
      totalCount,
      matchedCount,
      categories,
      hint:
        totalPages > 1
          ? `Page ${safePage}/${totalPages} — ${matchedCount} tools match.`
          : undefined,
      currentPage: safePage,
      effectivePageSize,
      totalPages,
    });
  }
}
