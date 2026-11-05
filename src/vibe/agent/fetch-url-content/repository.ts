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

import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";
import TurndownService from "turndown";

import { createFixtureFetch } from "../ai-stream/testing/fetch-cache";
import { getStorageAdapter } from "../chat/storage/index";
import { agentEnv } from "../env";
import { PROVIDER_SETUP_INSTRUCTIONS } from "../env-availability";
import type { FetchUrlContentGetResponseOutput } from "./definition";
import type { FetchUrlContentT } from "./i18n";

interface TruncateResult {
  content: string;
  truncated: boolean;
  truncatedNote?: string;
}
interface FetchUrlResult {
  url: string;
  content: string;
  statusCode: number;
  timeElapsed: number;
  timestamp: number;
}
interface ScrappeyResponse {
  solution: { response: string; currentUrl: string; statusCode: number };
  timeElapsed: number;
}
type FetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; isTimeout?: boolean };

// ─── Constants ───────────────────────────────────────────────────────────────

/** Maximum chars to return. Middle section is shown when truncated. */
const MAX_CHARS = 12_000;

/** Cache TTL in milliseconds (5 minutes) */
const CACHE_TTL_MS = 5 * 60 * 1000;

/** Virtual threadId namespace for URL cache - never a real chat thread */
const CACHE_THREAD_ID = "url-fetch-cache";

// ─── Cache helpers ────────────────────────────────────────────────────────────

function cacheKey(url: string): string {
  return createHash("sha256").update(url).digest("hex").slice(0, 16);
}

function cacheFilename(url: string): string {
  return `${cacheKey(url)}.md`;
}

async function readFromCache(url: string): Promise<string | null> {
  try {
    const adapter = getStorageAdapter();
    const filename = cacheFilename(url);
    const freshSince = Date.now() - CACHE_TTL_MS;

    // The adapter stores files under a generated id - match on the original
    // filename and take the newest entry still inside the TTL.
    const files = await adapter.listFilesByThread(CACHE_THREAD_ID);
    const metadata = files
      .filter(
        (file) =>
          file.originalFilename === filename &&
          file.uploadedAt.getTime() > freshSince,
      )
      .toSorted((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())[0];
    if (!metadata) {
      return null;
    }

    const base64 = await adapter.readFileAsBase64(metadata.id, CACHE_THREAD_ID);
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
    const buffer = Buffer.from(content, "utf-8");
    await adapter.uploadFile(buffer, {
      filename: cacheFilename(url),
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
    regex = new RegExp(query.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
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

  async fetchUrl(
    url: string,
    fetchImpl: typeof globalThis.fetch,
  ): Promise<FetchResult<FetchUrlResult>> {
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

    const scrappeyResult = await this.fetchFromScrappey(
      url,
      controller.signal,
      fetchImpl,
    );
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
    fetchImpl: typeof globalThis.fetch,
  ): Promise<FetchResult<ScrappeyResponse>> {
    const apiUrl = `${this.SCRAPPEY_API_URL}?key=${agentEnv.SCRAPPEY_API_KEY}`;

    try {
      const response = await fetchImpl(apiUrl, {
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

  static async fetchUrl(
    url: string,
    query: string | undefined,
    logger: EndpointLogger,
    t: FetchUrlContentT,
    toolExecutionContext: ToolExecutionContext,
  ): Promise<ResponseType<FetchUrlContentGetResponseOutput>> {
    if (!agentEnv.SCRAPPEY_API_KEY) {
      const {
        envKey,
        url: setupUrl,
        label,
      } = PROVIDER_SETUP_INSTRUCTIONS.scrappey;
      return fail({
        message: t("get.errors.notConfigured.title", {
          label,
          envKey,
          url: setupUrl,
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    if (!url || typeof url !== "string" || url.trim() === "") {
      return fail({
        message: t("get.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    const fetchService = FetchUrlContentRepository.getFetchUrlService();
    const result = await fetchService.fetchUrl(
      url,
      createFixtureFetch(toolExecutionContext, logger),
    );

    if (!result.ok) {
      const logFn = result.isTimeout ? logger.warn : logger.error;
      logFn("Fetch URL error", {
        error: result.error,
        isTimeout: result.isTimeout ?? false,
        url,
      });

      if (result.isTimeout) {
        return fail({
          message: t("get.errors.timeout.detail", { url }),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }

      return fail({
        message: t("get.errors.internal.detail", { message: result.error }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
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
      message: t("get.success.detail", { url: fetchedUrl }),
      content: processed.content,
      fetchedUrl,
      statusCode,
      timeElapsed,
      truncated: processed.truncated,
      truncatedNote: processed.truncatedNote,
    });
  }
}
