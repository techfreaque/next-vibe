/**
 * Brave Search Repository
 * Static implementation with Brave Search API support
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { PROVIDER_SETUP_INSTRUCTIONS } from "@/app/api/[locale]/agent/env-availability";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { BraveSearchGetResponseOutput } from "./definition";
import type { BraveT } from "./i18n";

/**
 * Normalized Search Result
 */
interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  age?: string;
  source?: string;
}

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
  private static readonly FRESHNESS_API_MAP: Record<string, string> = {
    past_day: "pd",
    past_week: "pw",
    past_month: "pm",
    past_year: "py",
  };

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
    t: BraveT,
  ): Promise<ResponseType<BraveSearchGetResponseOutput>> {
    // Guard: key not configured
    if (!agentEnv.BRAVE_SEARCH_API_KEY) {
      const { envKey, url, label } = PROVIDER_SETUP_INSTRUCTIONS.braveSearch;
      return fail({
        message: t("get.errors.notConfigured.title", { label, envKey, url }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    // Validate query
    if (!query || typeof query !== "string" || query.trim() === "") {
      return fail({
        message: t("get.errors.queryEmpty.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    if (query.length > this.MAX_QUERY_LENGTH) {
      return fail({
        message: t("get.errors.queryTooLong.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
        messageParams: { maxLength: this.MAX_QUERY_LENGTH },
      });
    }

    const config: SearchConfig = {
      maxResults: options.maxResults,
      includeNews: options.includeNews,
      freshness: options.freshness,
    };

    const fetchResult = await this.fetchResults(
      query,
      config,
      agentEnv.BRAVE_SEARCH_API_KEY,
      logger,
      t,
    );

    if (!fetchResult.success) {
      return fetchResult;
    }

    return success({
      results: fetchResult.data.results,
    });
  }

  /**
   * Fetch results from Brave Search API
   */
  private static async fetchResults(
    query: string,
    config: SearchConfig,
    apiKey: string,
    logger: EndpointLogger,
    t: BraveT,
  ): Promise<ResponseType<{ results: SearchResult[] }>> {
    const params = new URLSearchParams({
      q: query,
      count: String(config.maxResults ?? this.DEFAULT_MAX_RESULTS),
      safesearch: config.safesearch ?? "moderate",
    });

    if (config.freshness) {
      const apiCode =
        this.FRESHNESS_API_MAP[config.freshness] ?? config.freshness;
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
          "X-Subscription-Token": apiKey,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        logger.error("Brave Search API error", {
          status: response.status,
          statusText: response.statusText,
          query,
        });
        return fail({
          message: t("get.errors.searchFailed.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const data = (await response.json()) as BraveSearchApiResponse;
      return success({ results: this.parseResults(data, config.includeNews) });
    } catch (error) {
      clearTimeout(timeoutId);
      const isTimeout = error instanceof Error && error.name === "AbortError";
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Brave Search fetch error", { error: errorMessage });
      if (isTimeout) {
        return fail({
          message: t("get.errors.timeout.title"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      return fail({
        message: t("get.errors.searchFailed.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
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
