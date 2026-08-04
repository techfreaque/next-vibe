/**
 * Remote-instance tool discovery.
 *
 * Proxies enumeration to another instance over remote-connection: reads the
 * capability snapshot, and for small result sets asks the remote's own help
 * endpoint for full schemas. Split out of repository.ts because it is the one
 * part of help that needs a second instance to exist at all — a local-only build
 * declines this whole module rather than editing around it inline.
 */

import "server-only";

import type { CountryLanguage } from "../../core/i18n/core/config";
import type { InferJwtPayloadTypeFromRoles } from "../../core/route/handler-roles";
import { type ResponseType, success } from "../../core/route/response.schema";
import type { UserRoleValue } from "../../identity/roles/enum";
import type { EndpointLogger } from "../../logger/types";
import type { Platform } from "../../platforms/platforms";
import type {
  HelpGetRequestOutput,
  HelpGetResponseOutput,
  HelpToolMetadataSerialized,
  HelpToolParameters,
} from "../definition";
import { scopedTranslation } from "../i18n";
import {
  COMPACT_DEFAULT_PAGE_SIZE,
  COMPACT_FULL_DETAIL_THRESHOLD,
  HUMAN_DEFAULT_PAGE_SIZE,
} from "./paging";
import { filterExamplesToSchema } from "./serialize";

/**
 * Extract a simple JSON-Schema-like parameters object from a capability's
 * serialized `fields.children`. Used as a fast path to show parameter
 * descriptions without a remote HTTP call when the snapshot is fresh.
 * Returns null if the fields structure is missing or unreadable.
 *
 * The `any` here is load-bearing: this walks a snapshot serialized by ANOTHER
 * instance, possibly on a different framework version, so the shape is genuinely
 * unknown at compile time and every read is already guarded at runtime.
 */
export function extractParametersFromCapabilityFields(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Record<string, any> | null | undefined,
): HelpToolParameters | null {
  if (!fields || typeof fields !== "object") {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: Record<string, any> =
    typeof fields.children === "object" && fields.children
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fields.children as Record<string, any>)
      : {};
  const properties: Record<
    string,
    { type?: string; description?: string; format?: string }
  > = {};
  const required: string[] = [];

  for (const [key, field] of Object.entries(children)) {
    if (!field || typeof field !== "object") {
      continue;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const f = field as Record<string, any>;
    // Skip response-only and non-form fields
    if (f.usage && !f.usage.request) {
      continue;
    }
    if (f.type && f.type !== "form_field") {
      continue;
    }

    const description =
      typeof f.description === "string" ? f.description : undefined;
    // Map fieldType → JSON schema type
    const fieldType: string =
      typeof f.fieldType === "string" ? f.fieldType : "";
    let type = "string";
    if (
      fieldType === "number" ||
      fieldType === "integer" ||
      fieldType === "float"
    ) {
      type = fieldType === "float" ? "number" : fieldType;
    } else if (fieldType === "boolean" || fieldType === "toggle") {
      type = "boolean";
    } else if (fieldType === "array" || fieldType === "multi_select") {
      type = "array";
    } else if (fieldType === "json" || fieldType === "object") {
      type = "object";
    }

    properties[key] = { type, ...(description ? { description } : {}) };

    // Check if required: schema has no optional/default wrapper
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema = f.schema as Record<string, any> | undefined;
    if (schema) {
      const outerType: string =
        typeof schema.type === "string" ? schema.type : "";
      if (outerType !== "optional" && outerType !== "pipe") {
        // Non-optional, non-piped (transform) → treat as required
        required.push(key);
      }
      // Pipe: check the inner type
      if (outerType === "pipe") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inner = schema.in as Record<string, any> | undefined;
        const innerType: string =
          inner && typeof inner.type === "string" ? inner.type : "";
        if (innerType !== "optional") {
          required.push(key);
        }
      }
    }
  }

  if (Object.keys(properties).length === 0) {
    return null;
  }
  return {
    type: "object",
    properties,
    ...(required.length > 0 ? { required } : {}),
  };
}

/**
 * Fetch full tool schemas from the remote help endpoint for a small set of tools.
 * Falls back to the capability snapshot's fields if the remote is unreachable.
 */
async function fetchRemoteToolSchemas(params: {
  instanceId: string;
  user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>;
  toolNames: string[];
  locale: CountryLanguage;
  logger: EndpointLogger;
  platform: Platform;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  capabilitiesByName: Map<string, any>;
}): Promise<Map<string, HelpToolParameters | undefined>> {
  const {
    instanceId,
    user,
    toolNames,
    locale,
    logger,
    platform,
    capabilitiesByName,
  } = params;
  const result = new Map<string, HelpToolParameters | undefined>();

  const { RouteExecuteRepository } =
    await import("../../execute-tool/repository");
  const helpDef = (await import("../definition")).default;

  for (const toolName of toolNames) {
    // Ask the remote's own help endpoint for full detail, routed by instanceId
    // through the unified typed path (no raw cross-instance HTTP here).
    const remote = await RouteExecuteRepository.runInProcessTyped({
      definition: helpDef.GET,
      input: { toolName, page: 1, pageSize: 1 },
      instanceId,
      user,
      locale,
      logger,
      platform,
    });
    if (remote.success && remote.data?.tools?.[0]?.parameters) {
      result.set(toolName, remote.data.tools[0].parameters);
      continue;
    }
    // Fallback: extract from capability snapshot fields
    const cap = capabilitiesByName.get(toolName);
    if (cap?.fields) {
      const extracted = extractParametersFromCapabilityFields(cap.fields);
      result.set(toolName, extracted ?? undefined);
    }
  }

  return result;
}

export async function getToolsFromRemoteInstance(
  instanceId: string,
  data: HelpGetRequestOutput,
  user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
  locale: CountryLanguage,
  platform: Platform,
  logger: EndpointLogger,
  isCompact: boolean,
): Promise<ResponseType<HelpGetResponseOutput>> {
  const query = data.query;
  const currentPage = data.page ?? 1;
  const { t } = scopedTranslation.scopedT(locale);
  const { RemoteConnectionRepository } =
    await import("../../remote-connection/repository");

  // Try user-scoped lookup first, fall back to any-user lookup for CLI/system users
  // whose userId doesn't own the connection.
  const conn = user.isPublic
    ? await RemoteConnectionRepository.getConnectionAnyUser(instanceId)
    : ((await RemoteConnectionRepository.getConnectionForInstance(
        user.id,
        instanceId,
      )) ??
      (await RemoteConnectionRepository.getConnectionAnyUser(instanceId)));

  const capabilities = conn?.capabilities ?? null;

  if (!capabilities) {
    logger.error("Failed to get tools from remote", {
      instanceId,
      userId: user.id,
    });
    return success({
      tools: [],
      totalCount: 0,
      matchedCount: 0,
      hint: t("get.hints.noCapabilitySnapshot", { instanceId }),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const capabilitiesByName = new Map<string, any>(
    capabilities.map((cap) => [cap.toolName, cap]),
  );

  const allTools: HelpToolMetadataSerialized[] = capabilities.map((cap) => {
    const prefixedId = `${instanceId}__${cap.toolName}`;
    return {
      name: prefixedId,
      title: cap.title,
      titleShort: cap.titleShort ?? cap.title,
      id: prefixedId,
      description: cap.description,
      category: cap.category ?? t("category"),
      tags: cap.tags ?? [],
      // Keep aliases bare (no prefix) - CLI calls them with the prefix anyway
      aliases: cap.aliases,
      executionMode: "via-execute-route" as const,
      instanceId,
    };
  });

  // Apply query filter if provided - also match bare tool name (without instanceId prefix)
  const lowerQuery = query?.toLowerCase();
  const filtered = lowerQuery
    ? allTools.filter((tool) => {
        if (
          tool.name.toLowerCase().includes(lowerQuery) ||
          tool.title?.toLowerCase().includes(lowerQuery) ||
          tool.description.toLowerCase().includes(lowerQuery) ||
          tool.category?.toLowerCase().includes(lowerQuery) ||
          tool.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
          tool.aliases?.some((a) => a.toLowerCase().includes(lowerQuery))
        ) {
          return true;
        }
        // Also match bare name without instanceId prefix
        const bareName = tool.name.slice(instanceId.length + 2);
        return bareName.toLowerCase().includes(lowerQuery);
      })
    : allTools;

  const matchedCount = filtered.length;
  const totalCount = allTools.length;

  const effectivePageSize =
    data.pageSize ??
    (isCompact ? COMPACT_DEFAULT_PAGE_SIZE : HUMAN_DEFAULT_PAGE_SIZE);
  const totalPages = Math.ceil(matchedCount / effectivePageSize);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const offset = (safePage - 1) * effectivePageSize;
  const pageSlice = filtered.slice(offset, offset + effectivePageSize);

  // Auto-upgrade to full detail for small result sets (same threshold as local tools)
  if (matchedCount > 0 && matchedCount <= COMPACT_FULL_DETAIL_THRESHOLD) {
    const schemaMap =
      conn?.token && conn.remoteUrl
        ? await fetchRemoteToolSchemas({
            instanceId,
            user,
            toolNames: pageSlice.map((tool) =>
              tool.name.slice(instanceId.length + 2),
            ),
            locale,
            logger,
            platform,
            capabilitiesByName,
          })
        : new Map<string, HelpToolParameters | undefined>();

    const tools: HelpToolMetadataSerialized[] = pageSlice.map((tool) => {
      const bareName = tool.name.slice(instanceId.length + 2);
      const cap = capabilitiesByName.get(bareName);
      const parameters =
        schemaMap.get(bareName) ??
        (cap?.fields
          ? (extractParametersFromCapabilityFields(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cap.fields as Record<string, any>,
            ) ?? undefined)
          : undefined);
      return {
        ...tool,
        parameters,
        // Same schema/example consistency as the local path: strip example
        // input keys the (platform-filtered) parameters schema doesn't advertise.
        examples: filterExamplesToSchema(cap?.examples, parameters),
      };
    });

    return success({
      tools,
      totalCount,
      matchedCount,
      hint: t("get.hints.remoteFullSchema", {
        count: matchedCount,
        instanceId,
      }),
    });
  }

  const paginationHint =
    totalPages > 1
      ? t("get.hints.pagination", {
          page: safePage,
          total: totalPages,
          next: safePage + 1,
        })
      : "";
  return success({
    tools: pageSlice,
    totalCount,
    matchedCount,
    hint: t("get.hints.remoteList", {
      matched: matchedCount,
      total: totalCount,
      instanceId,
      detailThreshold: COMPACT_FULL_DETAIL_THRESHOLD,
      pagination: paginationHint,
    }),
  });
}
