/**
 * EndpointMeta → wire shape.
 *
 * Pure like meta-filter.ts: the only surface knowledge that reaches here is the
 * `compact` boolean the caller already decided. No locale, no database, no agent
 * context — a fork with a different set of surfaces still serializes a tool the
 * same way, so this half is shared verbatim.
 */

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { EndpointMeta } from "../../core/definition/endpoints-meta";
import type { WidgetData } from "../../core/utils/json";
import type { Platform } from "../../platforms/platforms";
import type {
  HelpToolMetadataSerialized,
  HelpToolParameters,
} from "../definition";

function normLabel(s: string): string {
  return s.toLowerCase().replaceAll(/[\s_-]+/g, "");
}

/** Case/space-insensitive equality — used to drop name fields that just echo. */
function sameLabel(a: string, b: string): boolean {
  return normLabel(a) === normLabel(b);
}

/**
 * Compact name fields. AI/MCP need ONE call name plus a human label —
 * not name + title + titleShort + alias all saying the same thing.
 *   - title: dropped when it just echoes the call name
 *   - titleShort: dropped entirely — `title` already labels the tool; the
 *     short variant is pure UI decoration an agent never needs
 *   - aliases: first alias only, dropped when it echoes name/title
 * Web/CLI keep every field (humans skim labels; full alias list aids discovery).
 */
function nameFields(
  tool: EndpointMeta,
  compact: boolean,
): Pick<
  HelpToolMetadataSerialized,
  "name" | "title" | "titleShort" | "aliases"
> {
  const name = tool.toolName;
  if (!compact) {
    return {
      name,
      title: tool.title,
      titleShort: tool.titleShort,
      aliases: tool.aliases.length > 0 ? tool.aliases : undefined,
    };
  }
  const includeTitle = !sameLabel(tool.title, name);
  const firstAlias = tool.aliases[0];
  const includeAlias =
    firstAlias !== undefined &&
    !sameLabel(firstAlias, name) &&
    !sameLabel(firstAlias, tool.title);
  return {
    name,
    ...(includeTitle && { title: tool.title }),
    ...(includeAlias && { aliases: [firstAlias] }),
  };
}

/**
 * Keep only the example INPUT keys that exist in the (already platform-
 * filtered) parameters schema, so the AI-facing example never references a
 * field the AI-facing schema hid. Responses are left untouched (output shape).
 */
export function filterExamplesToSchema(
  examples: EndpointMeta["examples"],
  parameters: HelpToolParameters | undefined,
): EndpointMeta["examples"] {
  if (!examples?.inputs || !parameters) {
    return examples;
  }
  // `parameters` is a JSON schema object (Record<string, WidgetData>); its
  // `properties` sub-object lists the AI-visible field names.
  const propsValue = parameters["properties"];
  if (
    propsValue === null ||
    typeof propsValue !== "object" ||
    Array.isArray(propsValue)
  ) {
    return examples;
  }
  const allowed = new Set(Object.keys(propsValue));
  const filteredInputs: Record<string, Record<string, WidgetData>> = {};
  for (const [name, input] of Object.entries(examples.inputs)) {
    const kept: Record<string, WidgetData> = {};
    for (const [key, value] of Object.entries(input)) {
      if (allowed.has(key)) {
        kept[key] = value;
      }
    }
    filteredInputs[name] = kept;
  }
  return { ...examples, inputs: filteredInputs };
}

export function serializeMeta(
  tool: EndpointMeta,
  parameters?: HelpToolParameters,
  includeExamples = false,
  platforms?: Platform[],
  compact = false,
  omitCategory = false,
): HelpToolMetadataSerialized {
  return {
    ...nameFields(tool, compact),
    // id is redundant with name - omit for compact platforms (AI/MCP) to save tokens
    ...(!compact && { id: tool.toolName }),
    // tags are low-signal for AI tool selection - omit for compact platforms
    ...(!compact && { tags: tool.tags }),
    // method is irrelevant for AI (calls via execute-tool) - omit for compact platforms
    ...(!compact && { method: tool.method }),
    description: tool.description,
    // category: omit on compact when every returned tool shares it (the caller
    // filtered by category, so repeating it per-tool is constant noise).
    ...(omitCategory ? {} : { category: tool.category }),
    // subCategory/icon are display-only — an AI/MCP caller can't render an icon
    // and groups by category already. Web/CLI keep them for the UI.
    ...(!compact && tool.subCategory && { subCategory: tool.subCategory }),
    ...(!compact && tool.icon && { icon: tool.icon }),
    // requiresConfirmation/credits: only emit when they actually carry signal
    // (true / >0). On web/CLI the widget reads them regardless, so keep the
    // explicit value there.
    ...(compact
      ? tool.requiresConfirmation
        ? { requiresConfirmation: true }
        : {}
      : { requiresConfirmation: tool.requiresConfirmation }),
    ...(compact
      ? tool.credits && tool.credits > 0
        ? { credits: tool.credits }
        : {}
      : { credits: tool.credits }),
    platforms,
    parameters,
    // Examples must AGREE with the schema the caller sees. On compact
    // platforms (AI/MCP) `parameters` has AI-hidden fields (e.g. media-gen
    // model/size/quality) stripped, so raw examples that still show those
    // fields make the model report a bogus "schema is missing X" mismatch.
    // Filter each example's inputs to the keys the AI-facing schema advertises.
    examples: includeExamples
      ? compact
        ? filterExamplesToSchema(tool.examples, parameters)
        : tool.examples
      : undefined,
  };
}

export function serializeMetaMinimal(
  tool: EndpointMeta,
  platforms?: Platform[],
  compact = false,
  omitCategory = false,
): HelpToolMetadataSerialized {
  return {
    ...nameFields(tool, compact),
    // id is redundant with name - omit for compact platforms
    ...(!compact && { id: tool.toolName }),
    // tags are low-signal for AI tool selection - omit for compact platforms
    ...(!compact && { tags: tool.tags }),
    description: tool.description,
    // category: omit on compact when every returned tool shares it.
    ...(omitCategory ? {} : { category: tool.category }),
    // subCategory/icon are display-only — omit for compact (AI/MCP) consumers.
    ...(!compact && tool.subCategory && { subCategory: tool.subCategory }),
    ...(!compact && tool.icon && { icon: tool.icon }),
    ...(compact
      ? tool.credits && tool.credits > 0
        ? { credits: tool.credits }
        : {}
      : { credits: tool.credits }),
    platforms,
  };
}

/** Lazy-load the full endpoint definition for parameter schema (detail view only) */
export async function loadEndpointForMeta(
  tool: EndpointMeta,
): Promise<CreateApiEndpointAny | null> {
  const { getEndpoint } = await import("@/generated/endpoints/endpoint");
  const endpoint = await getEndpoint(tool.toolName);
  if (endpoint) {
    return endpoint;
  }
  // PRODUCTION_OFF endpoints are excluded from endpoint.ts — fall back to the
  // dev registry which includes all endpoints so their parameters still render.
  const { getEndpoint: getEndpointDev } =
    await import("@/generated/endpoints/endpoint-dev");
  return getEndpointDev(tool.toolName);
}
