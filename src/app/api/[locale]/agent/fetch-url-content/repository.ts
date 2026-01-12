/**
 * Fetch URL Content Repository
 * Production-ready implementation with Scrappey API integration and HTML to Markdown conversion
 */

import "server-only";

import { tool } from "ai";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import TurndownService from "turndown";
import { z } from "zod";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { FetchUrlContentGetResponseOutput } from "./definition";

/**
 * Fetch URL error and success messages for AI tool responses
 * These are technical messages for AI, not user-facing translations
 */
export const FETCH_MESSAGES = {
  URL_REQUIRED: "Error: URL is required but was not provided by the model.",
  INVALID_URL: "Error: Invalid URL format provided.",
  FETCH_FAILED_PREFIX: "Failed to fetch URL",
  SUCCESS_PREFIX: "Successfully fetched content from",
  UNKNOWN_ERROR: "Unknown error occurred",
} as const;

/**
 * Scrappey API Response Types
 */
interface ScrappeyResponse {
  solution: {
    verified: boolean;
    currentUrl: string;
    statusCode: number;
    userAgent: string;
    response: string; // HTML content
    cookies: Array<{
      name: string;
      value: string;
      domain: string;
    }>;
    responseHeaders: Record<string, string>;
  };
  timeElapsed: number;
  data: string;
  session: string;
}

/**
 * Fetch URL Result
 */
export interface FetchUrlResult {
  url: string;
  content: string; // Markdown content
  statusCode: number;
  timeElapsed: number;
  timestamp: number;
}

/**
 * Custom error for Fetch URL operations
 */
export class FetchUrlError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error,
  ) {
    super(message);
    // eslint-disable-next-line i18next/no-literal-string
    this.name = "FetchUrlError";
  }
}

/**
 * Fetch URL Service with Scrappey API and HTML to Markdown conversion
 */
class FetchUrlService {
  private readonly TIMEOUT = 30000; // 30 seconds
  private readonly SCRAPPEY_API_URL = "https://publisher.scrappey.com/api/v1";
  private turndownService: TurndownService;

  constructor() {
    // Initialize Turndown service with custom options
    this.turndownService = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
      emDelimiter: "*",
      strongDelimiter: "**",
    });

    // Add custom rules for better markdown conversion
    this.turndownService.addRule("strikethrough", {
      filter: ["del", "s"],
      replacement: (content) => `~~${content}~~`,
    });

    // Remove script and style tags
    this.turndownService.remove(["script", "style", "noscript"]);
  }

  /**
   * Fetch URL content and convert to markdown
   */
  async fetchUrl(url: string): Promise<FetchUrlResult> {
    // Validate URL
    this.validateUrl(url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.TIMEOUT);

    try {
      const scrappeyResponse = await this.fetchFromScrappey(
        url,
        controller.signal,
      );

      clearTimeout(timeoutId);

      // Convert HTML to Markdown
      const markdown = this.convertHtmlToMarkdown(
        scrappeyResponse.solution.response,
      );

      return {
        url: scrappeyResponse.solution.currentUrl,
        content: markdown,
        statusCode: scrappeyResponse.solution.statusCode,
        timeElapsed: scrappeyResponse.timeElapsed,
        timestamp: Date.now(),
      };
    } catch (error) {
      clearTimeout(timeoutId);
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Re-throw to propagate error to caller
      throw error;
    }
  }

  /**
   * Fetch content from Scrappey API
   */
  private async fetchFromScrappey(
    url: string,
    signal: AbortSignal,
  ): Promise<ScrappeyResponse> {
    const apiUrl = `${this.SCRAPPEY_API_URL}?key=${agentEnv.SCRAPPEY_API_KEY}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cmd: "request.get",
          url: url,
        }),
        signal,
      });

      if (!response.ok) {
        // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Internal helper throws, caught by caller
        throw new FetchUrlError(
          // eslint-disable-next-line i18next/no-literal-string
          `Scrappey API error: ${response.statusText}`,
          response.status,
        );
      }

      const data = (await response.json()) as ScrappeyResponse;

      // Check if the fetch was successful
      if (!data.solution?.response) {
        // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Internal helper throws, caught by caller
        throw new FetchUrlError(
          // eslint-disable-next-line i18next/no-literal-string
          "No content received from Scrappey API",
          data.solution?.statusCode,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof FetchUrlError) {
        // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Re-throw to propagate error to caller
        throw error;
      }
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Re-throw to propagate error to caller
      throw new FetchUrlError(
        // eslint-disable-next-line i18next/no-literal-string
        `Failed to fetch from Scrappey: ${error instanceof Error ? error.message : "Unknown error"}`,
        undefined,
        error instanceof Error ? error : undefined,
      );
    }
  }

  /**
   * Convert HTML to Markdown using Turndown
   */
  private convertHtmlToMarkdown(html: string): string {
    try {
      // Clean up the HTML before conversion
      const cleanedHtml = this.cleanHtml(html);

      // Convert to markdown
      const markdown = this.turndownService.turndown(cleanedHtml);

      // Post-process markdown
      return this.cleanMarkdown(markdown);
    } catch (error) {
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Internal helper throws, caught by caller
      throw new FetchUrlError(
        // eslint-disable-next-line i18next/no-literal-string
        `Failed to convert HTML to Markdown: ${error instanceof Error ? error.message : "Unknown error"}`,
        undefined,
        error instanceof Error ? error : undefined,
      );
    }
  }

  /**
   * Clean HTML before conversion
   * Removes navigation, footer, and other non-content elements
   */
  private cleanHtml(html: string): string {
    let cleaned = html;

    // Remove comments
    cleaned = cleaned.replaceAll(/<!--[\s\S]*?-->/g, "");

    // Remove <nav> elements and their content
    cleaned = cleaned.replaceAll(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, "");

    // Remove <footer> elements and their content
    cleaned = cleaned.replaceAll(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, "");

    // Remove <header> elements (often contain navigation)
    cleaned = cleaned.replaceAll(/<header\b[^>]*>[\s\S]*?<\/header>/gi, "");

    // Remove common navigation patterns by class/id
    // Navigation patterns
    cleaned = cleaned.replaceAll(
      /<div\b[^>]*(?:class|id)=["'][^"']*(?:nav|menu|navigation|sidebar|header-menu|top-menu)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,
      "",
    );

    // Footer patterns
    cleaned = cleaned.replaceAll(
      /<div\b[^>]*(?:class|id)=["'][^"']*(?:footer|copyright|site-footer)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,
      "",
    );

    // Remove <aside> elements (usually sidebars)
    cleaned = cleaned.replaceAll(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, "");

    return cleaned;
  }

  /**
   * Clean markdown after conversion
   */
  private cleanMarkdown(markdown: string): string {
    return (
      markdown
        // Remove excessive blank lines (more than 2 consecutive)
        .replaceAll(/\n{3,}/g, "\n\n")
        // Trim whitespace from each line
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
        .trim()
    );
  }

  /**
   * Validate URL
   */
  private validateUrl(url: string): void {
    if (!url || url.trim().length === 0) {
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Validation helper throws, caught by caller
      throw new FetchUrlError("URL cannot be empty");
    }

    try {
      const urlObj = new URL(url);
      // Only allow http and https protocols
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Validation helper throws, caught by caller
        throw new FetchUrlError("Only HTTP and HTTPS URLs are allowed");
      }
    } catch (error) {
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Re-throw to propagate error to caller
      throw new FetchUrlError(
        // eslint-disable-next-line i18next/no-literal-string
        `Invalid URL format: ${error instanceof Error ? error.message : "Unknown error"}`,
        undefined,
        error instanceof Error ? error : undefined,
      );
    }
  }

  /**
   * Handle and normalize errors
   */
  handleError(error: Error | FetchUrlError): FetchUrlError {
    if (error instanceof FetchUrlError) {
      return error;
    }

    if (error.name === "AbortError") {
      // eslint-disable-next-line i18next/no-literal-string
      return new FetchUrlError("Request timed out", 408, error);
    }

    return new FetchUrlError(
      // eslint-disable-next-line i18next/no-literal-string
      `Fetch failed: ${error.message}`,
      undefined,
      error,
    );
  }
}

/**
 * Singleton instance
 */
let fetchUrlInstance: FetchUrlService | null = null;

/**
 * Get or create Fetch URL service instance
 */
function getFetchUrlService(): FetchUrlService {
  if (!fetchUrlInstance) {
    fetchUrlInstance = new FetchUrlService();
  }
  return fetchUrlInstance;
}

/**
 * AI SDK Tool for Fetch URL Content
 * Provides web scraping and content extraction capability to AI agents
 */
export const fetchUrlContent = tool({
  // eslint-disable-next-line i18next/no-literal-string
  description: `Fetch and extract content from any URL, converting it to readable markdown format.
Use this when:
- User asks to fetch content from a specific URL
- You need to read or analyze web page content
- User wants to extract information from a website
- You need to get the current state of a web page`,
  inputSchema: z.object({
    url: z.string().url().describe(
      // eslint-disable-next-line i18next/no-literal-string
      "The complete URL to fetch (must include http:// or https://)",
    ),
  }),
  execute: async ({ url }: { url: string }) => {
    try {
      // Validate that URL is provided
      if (!url || typeof url !== "string" || url.trim() === "") {
        return {
          success: false,
          message: FETCH_MESSAGES.URL_REQUIRED,
          url: url || "",
          content: "",
        };
      }

      const fetchService = getFetchUrlService();
      const result = await fetchService.fetchUrl(url);

      const successResult = {
        success: true,
        message: `${FETCH_MESSAGES.SUCCESS_PREFIX}: ${result.url}`,
        fetchedUrl: result.url,
        content: result.content,
        statusCode: result.statusCode,
        timeElapsed: result.timeElapsed,
        timestamp: new Date(result.timestamp).toISOString(),
      };
      return successResult;
    } catch (error) {
      const fetchService = getFetchUrlService();
      const fetchError =
        error instanceof Error
          ? fetchService.handleError(error)
          : new FetchUrlError(FETCH_MESSAGES.UNKNOWN_ERROR);

      const errorResult = {
        success: false,
        message: `${FETCH_MESSAGES.FETCH_FAILED_PREFIX}: ${fetchError.message}`,
        url,
        content: "",
        error: fetchError.message,
      };
      return errorResult;
    }
  },
});

/**
 * Fetch URL Content Repository Implementation
 */
export class FetchUrlContentRepository {
  static async fetchUrl(
    url: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<FetchUrlContentGetResponseOutput>> {
    const { fail, success, ErrorResponseTypes } =
      await import("next-vibe/shared/types/response.schema");

    try {
      if (!url || typeof url !== "string" || url.trim() === "") {
        return fail({
          message:
            "app.api.agent.chat.tools.fetchUrl.get.errors.validation.title" as const,
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: { message: FETCH_MESSAGES.URL_REQUIRED },
        });
      }

      const fetchService = getFetchUrlService();
      const result = await fetchService.fetchUrl(url);

      return success({
        success: true,
        message: `${FETCH_MESSAGES.SUCCESS_PREFIX}: ${result.url}`,
        content: result.content,
        fetchedUrl: result.url,
        statusCode: result.statusCode,
        timeElapsed: result.timeElapsed,
      });
    } catch (error) {
      const fetchService = getFetchUrlService();
      const fetchError =
        error instanceof Error
          ? fetchService.handleError(error)
          : new Error(FETCH_MESSAGES.UNKNOWN_ERROR);

      logger.error("Fetch URL error", {
        error: fetchError.message,
        url,
      });

      return fail({
        message:
          "app.api.agent.chat.tools.fetchUrl.get.errors.internal.title" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { message: fetchError.message },
      });
    }
  }
}
