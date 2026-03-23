import "server-only";

import type { CliRequestData } from "@/app/api/[locale]/system/unified-interface/cli/runtime/cli-request-data";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { parseError } from "@/app/api/[locale]/shared/utils";
import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import { pathToAliasMap } from "../../../../generated/alias-map";
import type { EndpointLogger } from "../../logger/endpoint";
import type { CreateApiEndpointAny } from "../../types/endpoint-base";
import type { Methods } from "../../types/enums";
import type { Platform } from "../../types/platform";
import { endpointToToolName } from "../../utils/path";
import { permissionsRegistry } from "../permissions/registry";

export interface SerializableToolMetadata {
  name: string;
  method: Methods;
  title: string;
  description: string;
  category: string;
  tags: string[];
  toolName: string;
  allowedRoles: UserRoleValue[];
  aliases?: string[];
  requiresConfirmation?: boolean;
  /** Credit cost for this endpoint (only present when > 0) */
  credits?: number;
  /** Raw examples from the endpoint definition (requests + urlPathParams merged, responses keyed by example name) */
  examples?: {
    /** Merged request data + url path params - what the caller passes as flat args */
    inputs?: Record<string, CliRequestData>;
    responses?: Record<string, CliRequestData>;
  };
}

export interface IDefinitionsRegistry {
  getEndpointsForUser(
    platform: Platform,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<CreateApiEndpointAny[]>;

  getEndpointCountByCategory(
    platform: Platform,
    logger: EndpointLogger,
  ): Promise<Record<string, number>>;

  getSerializedToolsForUser(
    platform: Platform,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<SerializableToolMetadata[]>;
}

const TOOLS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface ToolsCacheEntry {
  data: SerializableToolMetadata[];
  expiresAt: number;
}

/** All definitions loaded once at first call, then cached permanently. */
let allDefinitionsCache: CreateApiEndpointAny[] | null = null;

async function loadAllDefinitions(
  logger: EndpointLogger,
): Promise<CreateApiEndpointAny[]> {
  if (allDefinitionsCache !== null) {
    return allDefinitionsCache;
  }

  // Collect unique canonical paths (values in pathToAliasMap are canonical)
  const canonical = new Set(Object.values(pathToAliasMap));

  const results = await Promise.all(
    [...canonical].map((path) => getEndpointWithRetry(path, logger)),
  );

  allDefinitionsCache = results.filter(
    (d): d is CreateApiEndpointAny => d !== null,
  );
  return allDefinitionsCache;
}

// Bun TDZ race: dynamic imports may throw "Cannot access 'X' before initialization"
// on first load. Retry once with a short yield to let the module settle.
async function getEndpointWithRetry(
  path: string,
  logger: EndpointLogger,
): Promise<CreateApiEndpointAny | null> {
  try {
    return await getEndpoint(path);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("before initialization")) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 10);
      });
      return getEndpoint(path);
    }
    logger.error("[registry] Failed to load endpoint", parseError(error), path);
    return null;
  }
}

export type GetAllDefinitionsFn = (
  logger: EndpointLogger,
) => Promise<CreateApiEndpointAny[]>;

export class DefinitionsRegistry implements IDefinitionsRegistry {
  private toolsCache = new Map<string, ToolsCacheEntry>();

  private getToolsCacheKey(
    platform: Platform,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ): string {
    const roles = user.isPublic ? "public" : user.roles.toSorted().join(",");
    return `${platform}:${locale}:${roles}`;
  }

  private async getAllForPlatform(
    platform: Platform,
    logger: EndpointLogger,
  ): Promise<CreateApiEndpointAny[]> {
    const all = await loadAllDefinitions(logger);
    return all.filter((definition) => {
      if (!definition.allowedRoles) {
        return true;
      }
      return permissionsRegistry.checkPlatformAccess(
        definition.allowedRoles,
        platform,
      ).allowed;
    });
  }

  async getEndpointsForUser(
    platform: Platform,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<CreateApiEndpointAny[]> {
    const discovered = await this.getAllForPlatform(platform, logger);
    return permissionsRegistry.filterEndpointsByPermissions(
      discovered,
      user,
      platform,
    );
  }

  async getEndpointCountByCategory(
    platform: Platform,
    logger: EndpointLogger,
  ): Promise<Record<string, number>> {
    const allEndpoints = await this.getAllForPlatform(platform, logger);
    const counts: Record<string, number> = {};
    for (const endpoint of allEndpoints) {
      const category = endpoint.category;
      counts[category] = (counts[category] ?? 0) + 1;
    }
    return counts;
  }

  private static mergeExampleInputs(
    requests: Record<string, CliRequestData> | undefined,
    urlPathParams: Record<string, CliRequestData> | undefined,
  ): Record<string, CliRequestData> | undefined {
    if (!requests && !urlPathParams) {
      return undefined;
    }
    const keys = new Set([
      ...Object.keys(requests ?? {}),
      ...Object.keys(urlPathParams ?? {}),
    ]);
    const merged: Record<string, CliRequestData> = {};
    for (const key of keys) {
      merged[key] = {
        ...(requests?.[key] ?? {}),
        ...(urlPathParams?.[key] ?? {}),
      };
    }
    return merged;
  }

  private serializeEndpoints(
    endpoints: CreateApiEndpointAny[],
    locale: CountryLanguage,
  ): SerializableToolMetadata[] {
    return endpoints.map((definition) => {
      const { t } = definition.scopedTranslation.scopedT(locale);
      const { t: globalT } = simpleT(locale);
      const method = definition.method;
      const toolName = endpointToToolName(definition);

      return {
        name: toolName,
        method,
        title: t(definition.title),
        description: t(definition.description),
        category: globalT(definition.category),
        tags: definition.tags.map((tag) => t(tag)),
        toolName,
        allowedRoles: definition.allowedRoles
          ? [...definition.allowedRoles]
          : [],
        aliases: definition.aliases ? [...definition.aliases] : undefined,
        requiresConfirmation: definition.requiresConfirmation,
        ...(definition.credits && definition.credits > 0
          ? { credits: definition.credits }
          : {}),
        examples: definition.examples
          ? {
              inputs: DefinitionsRegistry.mergeExampleInputs(
                definition.examples.requests as
                  | Record<string, CliRequestData>
                  | undefined,
                definition.examples.urlPathParams as
                  | Record<string, CliRequestData>
                  | undefined,
              ),
              responses: definition.examples.responses as
                | Record<string, CliRequestData>
                | undefined,
            }
          : undefined,
      };
    });
  }

  async getSerializedToolsForUser(
    platform: Platform,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<SerializableToolMetadata[]> {
    const cacheKey = this.getToolsCacheKey(platform, user, locale);
    const cached = this.toolsCache.get(cacheKey);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    // Evict all expired entries before writing a new one
    for (const [key, entry] of this.toolsCache) {
      if (entry.expiresAt <= now) {
        this.toolsCache.delete(key);
      }
    }

    const filteredEndpoints = await this.getEndpointsForUser(
      platform,
      user,
      logger,
    );
    const result = this.serializeEndpoints(filteredEndpoints, locale);

    this.toolsCache.set(cacheKey, {
      data: result,
      expiresAt: now + TOOLS_CACHE_TTL_MS,
    });
    return result;
  }
}

export const definitionsRegistry = new DefinitionsRegistry();
