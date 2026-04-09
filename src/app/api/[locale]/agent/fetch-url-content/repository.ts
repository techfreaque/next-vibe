/**
 * Fetch URL Content Repository
 * Production-ready implementation with Scrappey API integration and HTML to Markdown conversion.
 * Includes:
 *   - 5-minute file cache via StorageAdapter (S3 or filesystem depending on config)
 *   - Middle-anchored truncation at MAX_CHARS with hint to re-query
 *   - Regex-based query filtering to extract matching paragraphs
 */

import "server-only";

import { createHash } from "node:crypto";

import { tool } from "ai";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import TurndownService from "turndown";
import { z } from "zod";

import { getStorageAdapter } from "@/app/api/[locale]/agent/chat/storage";
import { agentEnv } from "@/app/api/[locale]/agent/env";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { FetchUrlContentGetResponseOutput } from "./definition";
import type { FetchUrlContentT } from "./i18n";

// ─── Constants ───────────────────────────────────────────────────────────────

/** Maximum chars to return. Middle section is shown when truncated. */
const MAX_CHARS = 12_000;

/** Cache TTL in milliseconds (5 minutes) */
const CACHE_TTL_MS = 5 * 60 * 1000;

/** Virtual threadId namespace for URL cache - never a real chat thread */
const CACHE_THREAD_ID = "url-fetch-cache";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FetchUrlResult {
  url: string;
  content: string;
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

interface TruncateResult {
  content: string;
  truncated: boolean;
  truncatedNote?: string;
}

// ─── Cache helpers ────────────────────────────────────────────────────────────

function cacheKey(url: string): string {
  return createHash("sha256").update(url).digest("hex").slice(0, 16);
}

async function readFromCache(url: string): Promise<string | null> {
  try {
    const adapter = getStorageAdapter();
    const key = cacheKey(url);

    const metadata = await adapter.getFileMetadata(key);
    if (!metadata) {
      return null;
    }

    // Check TTL using uploadedAt
    const age = Date.now() - metadata.uploadedAt.getTime();
    if (age > CACHE_TTL_MS) {
      return null;
    }

    const base64 = await adapter.readFileAsBase64(key, CACHE_THREAD_ID);
    if (!base64) {
      return null;
    }

    return Buffer.from(base64, "base64").toString("utf-8");
  } catch {
    return null;
  }
}

async function writeToCache(url: string, content: string): Promise<void> {
  try {
    const adapter = getStorageAdapter();
    const key = cacheKey(url);
    const buffer = Buffer.from(content, "utf-8");
    await adapter.uploadFile(buffer, {
      filename: `${key}.md`,
      mimeType: "text/markdown",
      threadId: CACHE_THREAD_ID,
    });
  } catch {
    // Cache write failures are non-fatal
  }
}

// ─── Content processing ───────────────────────────────────────────────────────

/**
 * Filter content paragraphs by regex query, returning top matches up to MAX_CHARS.
 */
function filterByQuery(content: string, query: string): TruncateResult {
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  let regex: RegExp;
  try {
    regex = new RegExp(query, "i");
  } catch {
    // Invalid regex - fall back to literal substring
    regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  }

  // Score paragraphs by number of regex matches
  const scored = paragraphs
    .map((p) => {
      const matches = p.match(
        new RegExp(regex.source, `g${regex.flags.replace("g", "")}`),
      );
      return { p, score: matches?.length ?? 0 };
    })
    .filter(({ score }) => score > 0)
    .toSorted((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      content,
      truncated: false,
      truncatedNote: `No sections matched query "${query}". Returning full content.`,
    };
  }

  // Collect top paragraphs up to MAX_CHARS
  let result = "";
  for (const { p } of scored) {
    if (result.length + p.length + 2 > MAX_CHARS) {
      break;
    }
    result += (result ? "\n\n" : "") + p;
  }

  const truncated = result.length < content.length;
  return {
    content: result,
    truncated,
    truncatedNote: truncated
      ? `Showing ${scored.length} matching sections (${result.length} of ${content.length} chars). Use a more specific query to narrow further.`
      : undefined,
  };
}

/**
 * Middle-anchor truncation: skip equal amounts from start and end.
 */
function truncateMiddle(content: string): TruncateResult {
  if (content.length <= MAX_CHARS) {
    return { content, truncated: false };
  }

  const skip = Math.floor((content.length - MAX_CHARS) / 2);
  const middle = content.slice(skip, skip + MAX_CHARS);

  return {
    content: middle,
    truncated: true,
    truncatedNote: `Content truncated (${MAX_CHARS.toLocaleString()} of ${content.length.toLocaleString()} chars shown, middle section). Re-fetch with query= to filter to relevant sections. Syntax: regex, e.g. query=authentication or query=(login|signup)`,
  };
}

// ─── FetchUrlService ──────────────────────────────────────────────────────────

class FetchUrlService {
  private readonly TIMEOUT = 30000;
  private readonly SCRAPPEY_API_URL = "https://publisher.scrappey.com/api/v1";
  private turndownService: TurndownService;

  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
      emDelimiter: "*",
      strongDelimiter: "**",
    });

    this.turndownService.addRule("strikethrough", {
      filter: ["del", "s"],
      replacement: (content) => `~~${content}~~`,
    });

    this.turndownService.remove(["script", "style", "noscript"]);
  }

  async fetchUrl(url: string): Promise<FetchResult<FetchUrlResult>> {
    const validateResult = this.validateUrl(url);
    if (!validateResult.ok) {
      return validateResult;
    }

    // Check cache first
    const cached = await readFromCache(url);
    if (cached !== null) {
      return {
        ok: true,
        data: {
          url,
          content: cached,
          statusCode: 200,
          timeElapsed: 0,
          timestamp: Date.now(),
        },
      };
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

    const markdownResult = this.convertHtmlToMarkdown(
      scrappeyResponse.solution.response,
    );
    if (!markdownResult.ok) {
      return markdownResult;
    }

    const content = markdownResult.data;

    // Write to cache (non-blocking, fire-and-forget)
    void writeToCache(url, content);

    return {
      ok: true,
      data: {
        url: scrappeyResponse.solution.currentUrl,
        content,
        statusCode: scrappeyResponse.solution.statusCode,
        timeElapsed: scrappeyResponse.timeElapsed,
        timestamp: Date.now(),
      },
    };
  }

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

  private convertHtmlToMarkdown(html: string): FetchResult<string> {
    try {
      const cleanedHtml = this.cleanHtml(html);
      const markdown = this.turndownService.turndown(cleanedHtml);
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

  private cleanHtml(html: string): string {
    let cleaned = html;
    cleaned = cleaned.replaceAll(/<!--[\s\S]*?-->/g, "");
    cleaned = cleaned.replaceAll(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, "");
    cleaned = cleaned.replaceAll(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, "");
    cleaned = cleaned.replaceAll(/<header\b[^>]*>[\s\S]*?<\/header>/gi, "");
    cleaned = cleaned.replaceAll(
      /<div\b[^>]*(?:class|id)=["'][^"']*(?:nav|menu|navigation|sidebar|header-menu|top-menu)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,
      "",
    );
    cleaned = cleaned.replaceAll(
      /<div\b[^>]*(?:class|id)=["'][^"']*(?:footer|copyright|site-footer)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,
      "",
    );
    cleaned = cleaned.replaceAll(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, "");
    return cleaned;
  }

  private cleanMarkdown(markdown: string): string {
    return markdown
      .replaceAll(/\n{3,}/g, "\n\n")
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      .trim();
  }

  private validateUrl(url: string): FetchResult<void> {
    if (!url || url.trim().length === 0) {
      return { ok: false, error: "URL cannot be empty" };
    }

    try {
      const urlObj = new URL(url);
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        return { ok: false, error: "Only HTTP and HTTPS URLs are allowed" };
      }
      return { ok: true, data: undefined };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { ok: false, error: `Invalid URL format: ${errorMessage}` };
    }
  }
}

// ─── Repository ───────────────────────────────────────────────────────────────

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
   */
  static readonly fetchUrlTool = tool({
    // eslint-disable-next-line i18next/no-literal-string
    description: `Fetch web page content as markdown (max ${MAX_CHARS.toLocaleString()} chars, middle section shown when truncated).
- Omit query for full page content. Only add query= when you know what section you need.
- query= is a JS regex applied to paragraphs: matching paragraphs are returned ranked by match count.
  Examples: "authentication"  |  "(login|signup)"  |  "class\\s+\\w+"  |  invalid regex → literal match
- If truncated: note in truncatedNote tells you how many chars were cut and suggests a query.
- Cache: same URL within 5 min returns cached content at no extra cost.`,
    inputSchema: z.object({
      url: z.string().url().describe(
        // eslint-disable-next-line i18next/no-literal-string
        "The complete URL to fetch (must include http:// or https://)",
      ),
      query: z.string().optional().describe(
        // eslint-disable-next-line i18next/no-literal-string
        "JS regex to filter content. Paragraphs matching the pattern are returned ranked by match count. Omit unless you need a specific section. Examples: 'authentication', '(login|signup)', 'class\\s+\\w+'. Invalid regex falls back to literal match.",
      ),
    }),
    execute: async ({ url, query }: { url: string; query?: string }) => {
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

      const {
        content: rawContent,
        url: fetchedUrl,
        statusCode,
        timeElapsed,
        timestamp,
      } = result.data;

      const processed = query
        ? filterByQuery(rawContent, query)
        : truncateMiddle(rawContent);

      return {
        success: true,
        message: `Successfully fetched content from: ${fetchedUrl}`,
        fetchedUrl,
        content: processed.content,
        truncated: processed.truncated,
        truncatedNote: processed.truncatedNote,
        statusCode,
        timeElapsed,
        timestamp: new Date(timestamp).toISOString(),
      };
    },
  });

  static async fetchUrl(
    url: string,
    query: string | undefined,
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

    const {
      content: rawContent,
      url: fetchedUrl,
      statusCode,
      timeElapsed,
    } = result.data;

    const processed = query
      ? filterByQuery(rawContent, query)
      : truncateMiddle(rawContent);

    return success({
      success: true,
      message: `${t("get.success.title")}: ${fetchedUrl}`,
      content: processed.content,
      fetchedUrl,
      statusCode,
      timeElapsed,
      truncated: processed.truncated,
      truncatedNote: processed.truncatedNote,
    });
  }
}
