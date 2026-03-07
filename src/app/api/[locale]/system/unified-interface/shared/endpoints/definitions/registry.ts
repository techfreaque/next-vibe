import "server-only";

import type { CliRequestData } from "@/app/api/[locale]/system/unified-interface/cli/runtime/parsing";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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
    /** Merged request data + url path params — what the caller passes as flat args */
    inputs?: Record<string, CliRequestData>;
    responses?: Record<string, CliRequestData>;
  };
}

export interface IDefinitionsRegistry {
  getEndpointsForUser(
    platform: Platform,
    user: JwtPayloadType,
  ): Promise<CreateApiEndpointAny[]>;

  getEndpointCountByCategory(
    platform: Platform,
  ): Promise<Record<string, number>>;

  getSerializedToolsForUser(
    platform: Platform,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ): Promise<SerializableToolMetadata[]>;
}

const TOOLS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface ToolsCacheEntry {
  data: SerializableToolMetadata[];
  expiresAt: number;
}

/** All definitions loaded once at first call, then cached permanently. */
let allDefinitionsCache: CreateApiEndpointAny[] | null = null;

async function loadAllDefinitions(): Promise<CreateApiEndpointAny[]> {
  if (allDefinitionsCache !== null) {
    return allDefinitionsCache;
  }

  const { pathToAliasMap } =
    await import("@/app/api/[locale]/system/generated/alias-map");
  const { getEndpoint } =
    await import("@/app/api/[locale]/system/generated/endpoint");

  // Collect unique canonical paths (values in pathToAliasMap are canonical)
  const canonical = new Set(Object.values(pathToAliasMap));

  const results = await Promise.all(
    [...canonical].map((path) => getEndpoint(path)),
  );

  allDefinitionsCache = results.filter(
    (d): d is CreateApiEndpointAny => d !== null,
  );
  return allDefinitionsCache;
}

export type GetAllDefinitionsFn = () => Promise<CreateApiEndpointAny[]>;

export class DefinitionsRegistry implements IDefinitionsRegistry {
  private toolsCache = new Map<string, ToolsCacheEntry>();
  private readonly getAllDefinitions: GetAllDefinitionsFn;

  constructor(getAllDefinitions: GetAllDefinitionsFn = loadAllDefinitions) {
    this.getAllDefinitions = getAllDefinitions;
  }

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
  ): Promise<CreateApiEndpointAny[]> {
    const all = await this.getAllDefinitions();
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
  ): Promise<CreateApiEndpointAny[]> {
    const discovered = await this.getAllForPlatform(platform);
    return permissionsRegistry.filterEndpointsByPermissions(
      discovered,
      user,
      platform,
    );
  }

  async getEndpointCountByCategory(
    platform: Platform,
  ): Promise<Record<string, number>> {
    const allEndpoints = await this.getAllForPlatform(platform);
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
  ): Promise<SerializableToolMetadata[]> {
    const cacheKey = this.getToolsCacheKey(platform, user, locale);
    const cached = this.toolsCache.get(cacheKey);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    const filteredEndpoints = await this.getEndpointsForUser(platform, user);
    const result = this.serializeEndpoints(filteredEndpoints, locale);

    this.toolsCache.set(cacheKey, {
      data: result,
      expiresAt: now + TOOLS_CACHE_TTL_MS,
    });
    return result;
  }
}

export const definitionsRegistry = new DefinitionsRegistry();
