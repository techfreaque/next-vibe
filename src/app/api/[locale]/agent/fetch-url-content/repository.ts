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
import type { FetchUrlContentT } from "./i18n";

/**
 * Fetch URL Result
 */
interface FetchUrlResult {
  url: string;
  content: string; // Markdown content
  statusCode: number;
  timeElapsed: number;
  timestamp: number;
}

type FetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; isTimeout?: boolean };

interface ScrappeyResponse {
  solution: {
    response: string;
    currentUrl: string;
    statusCode: number;
  };
  timeElapsed: number;
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
  async fetchUrl(url: string): Promise<FetchResult<FetchUrlResult>> {
    // Validate URL
    const validateResult = this.validateUrl(url);
    if (!validateResult.ok) {
      return validateResult;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.TIMEOUT);

    const scrappeyResult = await this.fetchFromScrappey(url, controller.signal);
    clearTimeout(timeoutId);

    if (!scrappeyResult.ok) {
      return scrappeyResult;
    }

    const scrappeyResponse = scrappeyResult.data;

    // Convert HTML to Markdown
    const markdownResult = this.convertHtmlToMarkdown(
      scrappeyResponse.solution.response,
    );
    if (!markdownResult.ok) {
      return markdownResult;
    }

    return {
      ok: true,
      data: {
        url: scrappeyResponse.solution.currentUrl,
        content: markdownResult.data,
        statusCode: scrappeyResponse.solution.statusCode,
        timeElapsed: scrappeyResponse.timeElapsed,
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Fetch content from Scrappey API
   */
  private async fetchFromScrappey(
    url: string,
    signal: AbortSignal,
  ): Promise<FetchResult<ScrappeyResponse>> {
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
        return {
          ok: false,
          // eslint-disable-next-line i18next/no-literal-string
          error: `Scrappey API error: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as ScrappeyResponse;

      // Check if the fetch was successful
      if (!data.solution?.response) {
        return {
          ok: false,
          // eslint-disable-next-line i18next/no-literal-string
          error: "No content received from Scrappey API",
        };
      }

      return { ok: true, data };
    } catch (error) {
      const isTimeout = error instanceof Error && error.name === "AbortError";
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        ok: false,
        error: `Failed to fetch from Scrappey: ${errorMessage}`,
        isTimeout,
      };
    }
  }

  /**
   * Convert HTML to Markdown using Turndown
   */
  private convertHtmlToMarkdown(html: string): FetchResult<string> {
    try {
      // Clean up the HTML before conversion
      const cleanedHtml = this.cleanHtml(html);

      // Convert to markdown
      const markdown = this.turndownService.turndown(cleanedHtml);

      // Post-process markdown
      return { ok: true, data: this.cleanMarkdown(markdown) };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        ok: false,
        error: `Failed to convert HTML to Markdown: ${errorMessage}`,
      };
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
  private validateUrl(url: string): FetchResult<void> {
    if (!url || url.trim().length === 0) {
      return {
        ok: false,
        error: "URL cannot be empty",
      };
    }

    try {
      const urlObj = new URL(url);
      // Only allow http and https protocols
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        return {
          ok: false,
          error: "Only HTTP and HTTPS URLs are allowed",
        };
      }
      return { ok: true, data: undefined };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        ok: false,
        error: `Invalid URL format: ${errorMessage}`,
      };
    }
  }
}

/**
 * Fetch URL Content Repository Implementation
 */
export class FetchUrlContentRepository {
  private static fetchUrlInstance: FetchUrlService | null = null;

  static getFetchUrlService(): FetchUrlService {
    if (!FetchUrlContentRepository.fetchUrlInstance) {
      FetchUrlContentRepository.fetchUrlInstance = new FetchUrlService();
    }
    return FetchUrlContentRepository.fetchUrlInstance;
  }

  /**
   * AI SDK Tool for Fetch URL Content
   * Provides web scraping and content extraction capability to AI agents
   */
  static readonly fetchUrlTool = tool({
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
      // Validate that URL is provided
      if (!url || typeof url !== "string" || url.trim() === "") {
        return {
          success: false,
          message: "Error: URL is required but was not provided by the model.",
          url: url || "",
          content: "",
        };
      }

      const fetchService = FetchUrlContentRepository.getFetchUrlService();
      const result = await fetchService.fetchUrl(url);

      if (!result.ok) {
        return {
          success: false,
          message: `Failed to fetch URL: ${result.error}`,
          url,
          content: "",
          error: result.error,
        };
      }

      return {
        success: true,
        message: `Successfully fetched content from: ${result.data.url}`,
        fetchedUrl: result.data.url,
        content: result.data.content,
        statusCode: result.data.statusCode,
        timeElapsed: result.data.timeElapsed,
        timestamp: new Date(result.data.timestamp).toISOString(),
      };
    },
  });

  static async fetchUrl(
    url: string,
    logger: EndpointLogger,
    t: FetchUrlContentT,
  ): Promise<ResponseType<FetchUrlContentGetResponseOutput>> {
    const { fail, success, ErrorResponseTypes } =
      await import("next-vibe/shared/types/response.schema");

    if (!url || typeof url !== "string" || url.trim() === "") {
      return fail({
        message: t("get.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    const fetchService = FetchUrlContentRepository.getFetchUrlService();
    const result = await fetchService.fetchUrl(url);

    if (!result.ok) {
      logger.error("Fetch URL error", {
        error: result.error,
        url,
      });

      return fail({
        message: t("get.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { message: result.error },
      });
    }

    return success({
      success: true,
      message: `${t("get.success.title")}: ${result.data.url}`,
      content: result.data.content,
      fetchedUrl: result.data.url,
      statusCode: result.data.statusCode,
      timeElapsed: result.data.timeElapsed,
    });
  }
}
