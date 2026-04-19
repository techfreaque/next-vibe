/**
 * Search Provider Abstraction
 * Typesafe registry for web search providers with normalized response shape
 */

import "server-only";

import {
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";

import { FEATURE_COSTS } from "@/app/api/[locale]/products/repository-client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { agentEnvAvailability } from "../env-availability";
import { SearchProvider, type SearchProviderValue } from "./enum";

/**
 * Normalized search result — common shape across all providers
 */
export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  age?: string;
  source?: string;
}

/**
 * Unified response from any search provider
 */
export interface WebSearchResponse {
  usedProvider: SearchProviderValue;
  /** AI-generated answer (provider-specific, e.g. Kagi FastGPT) */
  output?: string;
  results: WebSearchResult[];
}

/**
 * Options passed from the unified endpoint to a provider adapter
 */
export interface WebSearchOptions {
  maxResults?: number;
  includeNews?: boolean;
  freshness?: "past_day" | "past_week" | "past_month" | "past_year";
}

/**
 * Provider adapter contract — each provider implements this
 */
export interface SearchProviderConfig {
  id: SearchProviderValue;
  isAvailable: () => boolean;
  creditCost: number;
  search: (
    query: string,
    options: WebSearchOptions,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ) => Promise<ResponseType<WebSearchResponse>>;
}

/**
 * Brave Search adapter
 */
const braveProvider: SearchProviderConfig = {
  id: SearchProvider.BRAVE,
  isAvailable: () => agentEnvAvailability.braveSearch,
  creditCost: FEATURE_COSTS.BRAVE_SEARCH,
  search: async (query, options, logger, locale) => {
    const { BraveSearchRepository } = await import("./brave/repository");
    const { scopedTranslation } = await import("./brave/i18n");
    const { t } = scopedTranslation.scopedT(locale);

    const result = await BraveSearchRepository.search(
      query,
      {
        maxResults: options.maxResults,
        includeNews: options.includeNews,
        freshness: options.freshness,
      },
      logger,
      t,
    );

    if (!result.success) {
      return result;
    }

    return success({
      usedProvider: SearchProvider.BRAVE,
      results: result.data.results,
    });
  },
};

/**
 * Kagi FastGPT adapter
 */
const kagiProvider: SearchProviderConfig = {
  id: SearchProvider.KAGI,
  isAvailable: () => agentEnvAvailability.kagiSearch,
  creditCost: FEATURE_COSTS.KAGI_SEARCH,
  search: async (query, options, logger, locale) => {
    void options; // Kagi doesn't support maxResults/freshness/includeNews
    const { KagiSearchRepository } = await import("./kagi/repository");
    const { scopedTranslation } = await import("./kagi/i18n");
    const { t } = scopedTranslation.scopedT(locale);

    const result = await KagiSearchRepository.search({ query }, logger, t);

    if (!result.success) {
      return result;
    }

    return success({
      usedProvider: SearchProvider.KAGI,
      output: result.data.output,
      results: result.data.references.map((ref) => ({
        title: ref.title,
        url: ref.url,
        snippet: ref.snippet ?? "",
      })),
    });
  },
};

/**
 * Provider registry — typesafe lookup by enum value
 * To add a new provider: add enum value, create adapter, add to registry.
 */
export const SEARCH_PROVIDER_REGISTRY: Record<
  SearchProviderValue,
  SearchProviderConfig
> = {
  [SearchProvider.BRAVE]: braveProvider,
  [SearchProvider.KAGI]: kagiProvider,
};

/**
 * Resolve which provider to use given an explicit choice or auto-detect.
 * Returns the provider config or null if none available.
 */
export function resolveSearchProvider(
  explicit?: SearchProviderValue | null,
): SearchProviderConfig | null {
  // Explicit choice
  if (explicit) {
    const provider = SEARCH_PROVIDER_REGISTRY[explicit];
    if (provider.isAvailable()) {
      return provider;
    }
    return null;
  }

  // Auto-detect: prefer Brave (cheaper)
  if (braveProvider.isAvailable()) {
    return braveProvider;
  }
  if (kagiProvider.isAvailable()) {
    return kagiProvider;
  }

  return null;
}
