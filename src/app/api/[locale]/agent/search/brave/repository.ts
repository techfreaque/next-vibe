/**
 * Brave Search Repository
 * Static implementation with Brave Search API support
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { buildMissingKeyMessage } from "@/app/api/[locale]/agent/env-availability";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { BraveSearchGetResponseOutput } from "./definition";

/**
 * Map readable freshness values to Brave API codes
 */
const FRESHNESS_API_MAP: Record<string, string> = {
  past_day: "pd",
  past_week: "pw",
  past_month: "pm",
  past_year: "py",
};

/**
 * Brave Search API Response Types
 */
interface BraveWebResult {
  title: string;
  url: string;
  description: string;
  age?: string;
  page_age?: string;
  thumbnail?: {
    src: string;
  };
}

interface BraveNewsResult {
  title: string;
  url: string;
  description: string;
  age: string;
  source: string;
}

interface BraveSearchApiResponse {
  web?: {
    results: BraveWebResult[];
  };
  news?: {
    results: BraveNewsResult[];
  };
  query: {
    original: string;
  };
}

/**
 * Normalized Search Result
 */
export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  age?: string;
  source?: string;
}

/**
 * Search Configuration
 */
interface SearchConfig {
  maxResults?: number;
  includeNews?: boolean;
  freshness?: "past_day" | "past_week" | "past_month" | "past_year";
  safesearch?: "off" | "moderate" | "strict";
}

/**
 * Brave Search Repository Implementation
 */
export class BraveSearchRepository {
  private static readonly TIMEOUT = 10000; // 10 seconds
  private static readonly MAX_QUERY_LENGTH = 400;
  private static readonly DEFAULT_MAX_RESULTS = 5;
  private static readonly DEFAULT_SAFESEARCH = "moderate";

  /**
   * Search the web with Brave Search API
   */
  static async search(
    query: string,
    options: {
      maxResults?: number;
      includeNews?: boolean;
      freshness?: "past_day" | "past_week" | "past_month" | "past_year";
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<BraveSearchGetResponseOutput>> {
    const { fail, success, ErrorResponseTypes } =
      await import("next-vibe/shared/types/response.schema");

    // Guard: key not configured
    if (!agentEnv.BRAVE_SEARCH_API_KEY) {
      logger.warn("Brave Search API key not configured");
      return fail({
        message: buildMissingKeyMessage("braveSearch"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    try {
      // Validate query
      if (!query || typeof query !== "string" || query.trim() === "") {
        return fail({
          message:
            "app.api.agent.search.brave.get.errors.queryEmpty.title" as const,
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      if (query.length > this.MAX_QUERY_LENGTH) {
        return fail({
          message:
            "app.api.agent.search.brave.get.errors.queryTooLong.title" as const,
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: { maxLength: this.MAX_QUERY_LENGTH },
        });
      }

      const config: SearchConfig = {
        maxResults: options.maxResults,
        includeNews: options.includeNews,
        freshness: options.freshness,
      };

      const results = await this.fetchResults(query, config);

      return success({
        results,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      logger.error("Brave Search error", {
        error: errorMessage,
        query,
      });

      if (error instanceof Error && error.name === "AbortError") {
        return fail({
          message:
            "app.api.agent.search.brave.get.errors.timeout.title" as const,
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }

      return fail({
        message:
          "app.api.agent.search.brave.get.errors.searchFailed.title" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Fetch results from Brave Search API
   */
  private static async fetchResults(
    query: string,
    config: SearchConfig,
  ): Promise<SearchResult[]> {
    const params = new URLSearchParams({
      q: query,
      count: String(config.maxResults ?? this.DEFAULT_MAX_RESULTS),
      safesearch: config.safesearch ?? this.DEFAULT_SAFESEARCH,
    });

    if (config.freshness) {
      const apiCode = FRESHNESS_API_MAP[config.freshness] ?? config.freshness;
      params.append("freshness", apiCode);
    }

    const url = `https://api.search.brave.com/res/v1/web/search?${params}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.TIMEOUT);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": agentEnv.BRAVE_SEARCH_API_KEY,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Internal helper throws, caught by caller
        throw new Error(`Brave Search API error: ${response.statusText}`);
      }

      const data = (await response.json()) as BraveSearchApiResponse;
      return this.parseResults(data, config.includeNews);
    } catch (error) {
      clearTimeout(timeoutId);
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Re-throw to propagate error to caller
      throw error;
    }
  }

  /**
   * Parse and normalize API results
   */
  private static parseResults(
    data: BraveSearchApiResponse,
    includeNews = false,
  ): SearchResult[] {
    const results: SearchResult[] = [];

    // Add web results
    if (data.web?.results) {
      results.push(
        ...data.web.results.map((result) => ({
          title: this.sanitizeText(result.title),
          url: result.url,
          snippet: this.sanitizeText(result.description),
          age: result.age ?? result.page_age,
        })),
      );
    }

    // Add news results if requested
    if (includeNews && data.news?.results) {
      results.push(
        ...data.news.results.map((result) => ({
          title: this.sanitizeText(result.title),
          url: result.url,
          snippet: this.sanitizeText(result.description),
          age: result.age,
          source: result.source,
        })),
      );
    }

    return results;
  }

  /**
   * Sanitize text by removing HTML tags and normalizing whitespace
   */
  private static sanitizeText(text: string): string {
    return text
      .replaceAll(/<[^>]*>/g, "")
      .replaceAll(/\s+/g, " ")
      .trim();
  }
}
