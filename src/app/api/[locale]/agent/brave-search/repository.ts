/**
 * Brave Search Repository
 * Production-ready implementation with caching, rate limiting, and error handling
 */

import "server-only";

import { tool } from "ai";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { env } from "@/config/env";

import type { BraveSearchGetResponseOutput } from "./definition";

/**
 * Search error and success messages for AI tool responses
 * These are technical messages for AI, not user-facing translations
 */
export const SEARCH_MESSAGES = {
  QUERY_REQUIRED:
    "Error: Search query is required but was not provided by the model.",
  NO_RESULTS_PREFIX: "No results found for",
  UNKNOWN_ERROR: "Unknown error occurred",
  SEARCH_FAILED_PREFIX: "Search failed",
  FOUND_RESULTS_PREFIX: "Found",
  FOUND_RESULTS_SUFFIX: "results for",
} as const;

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
  description: string;
  age?: string;
  source?: string;
  thumbnail?: string;
}

/**
 * Search Response with metadata
 */
export interface SearchResponse {
  query: string;
  results: SearchResult[];
  timestamp: number;
  cached: boolean;
  source: "brave";
}

/**
 * Search Configuration
 */
interface SearchConfig {
  maxResults?: number;
  includeNews?: boolean;
  freshness?: "pd" | "pw" | "pm" | "py"; // day, week, month, year
  safesearch?: "off" | "moderate" | "strict";
  bypassCache?: boolean;
}

/**
 * Custom error for Brave Search operations
 */
export class BraveSearchError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error,
  ) {
    super(message);
    // eslint-disable-next-line i18next/no-literal-string
    this.name = "BraveSearchError";
  }
}

/**
 * Brave Search Service with caching and rate limiting
 */
class BraveSearchService {
  private cache: Map<string, { data: SearchResponse; expiresAt: number }>;
  private rateLimitQueue: number[] = [];
  private readonly MAX_REQUESTS_PER_SECOND = 5;
  private readonly CACHE_TTL = 3600000; // 1 hour
  private readonly TIMEOUT = 10000; // 10 seconds
  private readonly MAX_CACHE_SIZE = 100;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Search the web with rate limiting and caching
   */
  async search(
    query: string,
    config: SearchConfig = {},
  ): Promise<SearchResponse> {
    const normalizedQuery = query.trim().toLowerCase();

    // Validate query
    this.validateQuery(query);

    // Check cache first
    if (!config.bypassCache) {
      const cached = this.getFromCache(normalizedQuery);
      if (cached) {
        return { ...cached, cached: true };
      }
    }

    // Rate limiting
    await this.enforceRateLimit();

    const results = await this.fetchResults(query, config);
    const response: SearchResponse = {
      query,
      results,
      timestamp: Date.now(),
      cached: false,
      source: "brave",
    };

    // Cache the results
    this.setCache(normalizedQuery, response);

    return response;
  }

  /**
   * Fetch results from Brave Search API
   */
  private async fetchResults(
    query: string,
    config: SearchConfig,
  ): Promise<SearchResult[]> {
    const params = new URLSearchParams({
      q: query,
      count: String(config.maxResults ?? 5),
      safesearch: config.safesearch ?? "moderate",
    });

    if (config.freshness) {
      params.append("freshness", config.freshness);
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
          "X-Subscription-Token": env.BRAVE_SEARCH_API_KEY,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Internal helper throws, caught by caller
        throw new BraveSearchError(
          // eslint-disable-next-line i18next/no-literal-string
          `Brave Search API error: ${response.statusText}`,
          response.status,
        );
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
  private parseResults(
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
          description: this.sanitizeText(result.description),
          age: result.age ?? result.page_age,
          thumbnail: result.thumbnail?.src,
        })),
      );
    }

    // Add news results if requested
    if (includeNews && data.news?.results) {
      results.push(
        ...data.news.results.map((result) => ({
          title: this.sanitizeText(result.title),
          url: result.url,
          description: this.sanitizeText(result.description),
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
  private sanitizeText(text: string): string {
    return text
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();
  }

  /**
   * Validate search query
   */
  private validateQuery(query: string): void {
    if (!query || query.trim().length === 0) {
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Validation helper throws, caught by caller
      throw new BraveSearchError("Search query cannot be empty");
    }

    if (query.length > 400) {
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Validation helper throws, caught by caller
      throw new BraveSearchError(
        // eslint-disable-next-line i18next/no-literal-string
        "Search query is too long (max 400 characters)",
      );
    }
  }

  /**
   * Rate limiting: max 5 requests per second
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    this.rateLimitQueue = this.rateLimitQueue.filter(
      (timestamp) => now - timestamp < 1000,
    );

    if (this.rateLimitQueue.length >= this.MAX_REQUESTS_PER_SECOND) {
      const oldestRequest = this.rateLimitQueue[0];
      if (oldestRequest) {
        const waitTime = 1000 - (now - oldestRequest) + 100; // Add 100ms buffer
        await new Promise<void>((resolve) => {
          setTimeout(resolve, waitTime);
        });
      }
    }

    this.rateLimitQueue.push(Date.now());
  }

  /**
   * Get cached results
   */
  private getFromCache(query: string): SearchResponse | null {
    const cached = this.cache.get(query);
    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(query);
      return null;
    }

    return cached.data;
  }

  /**
   * Set cache with automatic cleanup
   */
  private setCache(query: string, data: SearchResponse): void {
    this.cache.set(query, {
      data,
      expiresAt: Date.now() + this.CACHE_TTL,
    });

    // Clean up old cache entries
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value as string;
      this.cache.delete(firstKey);
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: [...this.cache.keys()],
    };
  }

  /**
   * Handle and normalize errors
   */
  handleError(error: Error | BraveSearchError): BraveSearchError {
    if (error instanceof BraveSearchError) {
      return error;
    }

    if (error.name === "AbortError") {
      // eslint-disable-next-line i18next/no-literal-string
      return new BraveSearchError("Search request timed out", 408, error);
    }

    return new BraveSearchError(
      // eslint-disable-next-line i18next/no-literal-string
      `Search failed: ${error.message}`,
      undefined,
      error,
    );
  }
}

/**
 * Singleton instance
 */
let braveSearchInstance: BraveSearchService | null = null;

/**
 * Get or create Brave Search service instance
 */
function getBraveSearchService(): BraveSearchService {
  if (!braveSearchInstance) {
    braveSearchInstance = new BraveSearchService();
  }
  return braveSearchInstance;
}

/**
 * Freshness options for Brave Search
 */
const FRESHNESS_OPTIONS = ["pd", "pw", "pm", "py"] as const;

/**
 * AI SDK Tool for Brave Search
 * Provides web search capability to AI agents
 */
export const braveSearch = tool({
  // eslint-disable-next-line i18next/no-literal-string
  description: `Search the internet for current information, news, facts, or recent events.
Use this when:
- User asks about current events or news
- Information might have changed recently
- You need to verify facts or get up-to-date data
- User explicitly asks you to search`,
  inputSchema: z.object({
    query: z.string().min(1).max(400).describe(
      // eslint-disable-next-line i18next/no-literal-string
      "Clear and specific search query. Use keywords rather than questions.",
    ),
    maxResults: z
      .number()
      .min(1)
      .max(10)
      .optional()
      // eslint-disable-next-line i18next/no-literal-string
      .describe("Number of results to return (default: 5)"),
    includeNews: z
      .boolean()
      .optional()
      // eslint-disable-next-line i18next/no-literal-string
      .describe("Include news results for current events (default: false)"),
    freshness: z.enum(FRESHNESS_OPTIONS).optional().describe(
      // eslint-disable-next-line i18next/no-literal-string
      "Filter by freshness: pd (day), pw (week), pm (month), py (year)",
    ),
  }),
  execute: async ({
    query,
    maxResults,
    includeNews,
    freshness,
  }: {
    query: string;
    maxResults?: number;
    includeNews?: boolean;
    freshness?: "pd" | "pw" | "pm" | "py";
  }) => {
    try {
      // Validate that query is provided
      if (!query || typeof query !== "string" || query.trim() === "") {
        return {
          success: false,
          message: SEARCH_MESSAGES.QUERY_REQUIRED,
          query: query || "",
          results: [],
        };
      }

      const searchService = getBraveSearchService();
      const searchResults = await searchService.search(query, {
        maxResults,
        includeNews,
        freshness,
      });

      if (searchResults.results.length === 0) {
        return {
          success: false,
          message: `${SEARCH_MESSAGES.NO_RESULTS_PREFIX}: ${query}`,
          query,
          results: [],
        };
      }

      const successResult = {
        success: true,
        message: `${SEARCH_MESSAGES.FOUND_RESULTS_PREFIX} ${searchResults.results.length} ${SEARCH_MESSAGES.FOUND_RESULTS_SUFFIX}: ${query}`,
        query: searchResults.query,
        results: searchResults.results.map((result) => ({
          title: result.title,
          url: result.url,
          snippet: result.description,
          age: result.age,
          source: result.source,
        })),
        cached: searchResults.cached,
        timestamp: new Date(searchResults.timestamp).toISOString(),
      };
      return successResult;
    } catch (error) {
      const searchService = getBraveSearchService();
      const braveError =
        error instanceof Error
          ? searchService.handleError(error)
          : new BraveSearchError(SEARCH_MESSAGES.UNKNOWN_ERROR);

      const errorResult = {
        success: false,
        message: `${SEARCH_MESSAGES.SEARCH_FAILED_PREFIX}: ${braveError.message}`,
        query,
        results: [],
      };
      return errorResult;
    }
  },
});

/**
 * Export search service for use in other parts of the application
 */
export { getBraveSearchService };

/**
 * Brave Search Repository Interface
 */
export interface IBraveSearchRepository {
  search(
    query: string,
    options: {
      maxResults?: number;
      includeNews?: boolean;
      freshness?: "pd" | "pw" | "pm" | "py";
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<BraveSearchGetResponseOutput>>;
}

/**
 * Brave Search Repository Implementation
 */
class BraveSearchRepository implements IBraveSearchRepository {
  async search(
    query: string,
    options: {
      maxResults?: number;
      includeNews?: boolean;
      freshness?: "pd" | "pw" | "pm" | "py";
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<BraveSearchGetResponseOutput>> {
    const { fail, success, ErrorResponseTypes } =
      await import("next-vibe/shared/types/response.schema");

    try {
      if (!query || typeof query !== "string" || query.trim() === "") {
        return fail({
          message:
            "app.api.agent.chat.tools.braveSearch.get.errors.validation.title" as const,
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: { message: SEARCH_MESSAGES.QUERY_REQUIRED },
        });
      }

      const searchService = getBraveSearchService();
      const searchResults = await searchService.search(query, options);

      if (searchResults.results.length === 0) {
        return success({
          success: false,
          message: `${SEARCH_MESSAGES.NO_RESULTS_PREFIX}: ${query}`,
          results: [],
        });
      }

      return success({
        success: true,
        message: `${SEARCH_MESSAGES.FOUND_RESULTS_PREFIX} ${searchResults.results.length} ${SEARCH_MESSAGES.FOUND_RESULTS_SUFFIX}: ${query}`,
        results: searchResults.results.map((result) => ({
          title: result.title,
          url: result.url,
          snippet: result.description,
          age: result.age,
          source: result.source,
        })),
        cached: searchResults.cached,
        timestamp: new Date(searchResults.timestamp).toISOString(),
      });
    } catch (error) {
      const searchService = getBraveSearchService();
      const braveError =
        error instanceof Error
          ? searchService.handleError(error)
          : new Error(SEARCH_MESSAGES.UNKNOWN_ERROR);

      logger.error("Brave Search error", {
        error: braveError.message,
        query,
      });

      return fail({
        message:
          "app.api.agent.chat.tools.braveSearch.get.errors.internal.title" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { message: braveError.message },
      });
    }
  }
}

export const braveSearchRepository = new BraveSearchRepository();
