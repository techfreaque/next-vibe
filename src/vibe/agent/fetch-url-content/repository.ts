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
import { z } from "zod";

import { createFixtureFetch } from "../ai-stream/testing/fetch-cache";
import { getStorageAdapter } from "../chat/storage/index";
import { agentEnv } from "../env";
import { PROVIDER_SETUP_INSTRUCTIONS } from "../env-availability";
import type { FetchUrlContentGetResponseOutput } from "./definition";
import { htmlToMarkdown } from "./html-to-markdown";
import type { FetchUrlContentT } from "./i18n";
import { stripInlineImageData } from "./inline-image-data";

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
// Extract status evidence even when the HTTP status and body disagree.
const proxyStatusSchema = z.object({
  status: z
    .enum(["success", "error", "failed", "failure"])
    .optional()
    .catch(undefined),
  solution: z
    .object({
      statusCode: z.number().int().min(100).max(599).optional(),
      verified: z.boolean().optional(),
    })
    .optional(),
});
/** Scrappey render mode: a full browser (default) or a plain HTTP request. */
type ScrapeMode = "browser" | "request";

/** One scraper call inside a fetch, kept for the log row of its outcome. */
export interface ScrapeAttempt {
  mode: ScrapeMode;
  ok: boolean;
  elapsedMs: number;
  deadlineMs: number;
  deadlineFired: boolean;
  failureStage?: "proxy-headers" | "proxy-body" | "proxy-status";
  upstreamStatus?: number;
  targetStatusCode?: number;
  error?: string;
}

type FetchResult<T> =
  | { ok: true; data: T; scraperAttempts?: ScrapeAttempt[] }
  | {
      ok: false;
      /** Every scraper call this fetch made, in order. */
      scraperAttempts?: ScrapeAttempt[];
      error: string;
      isTimeout?: boolean;
      upstreamStatus?: number;
      proxyElapsedMs?: number;
      proxyBodyStatus?: string;
      proxyBodyRead?: "complete" | "deadline" | "stream-error";
      targetStatusCode?: number;
      solutionVerified?: boolean;
      deadlineFired?: boolean;
      failureStage?: "proxy-headers" | "proxy-body" | "proxy-status";
      /** The caller's input was unfetchable (bad URL, scraper answered 4xx). */
      isCallerError?: boolean;
    };

/**
 * Loopback / private-network hosts. The fetch runs on a REMOTE scraper, so
 * these can never resolve to anything the caller means (models try to fetch
 * the app's own `http://localhost:3000/api/...` routes).
 */
function isPrivateHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host === "0.0.0.0" ||
    host === "::" ||
    host === "::1"
  ) {
    return true;
  }
  // IPv6 unique-local (fc00::/7), link-local (fe80::/10), IPv4-mapped (::ffff:)
  if (host.includes(":")) {
    if (/^f[cd][0-9a-f]{0,2}:/.test(host) || /^fe[89ab][0-9a-f]?:/.test(host)) {
      return true;
    }
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(host);
    if (mapped?.[1]) {
      return isPrivateHost(mapped[1]);
    }
    // WHATWG URL normalizes ::ffff:127.0.0.1 to ::ffff:7f00:1
    const mappedHex = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/.exec(host);
    if (mappedHex?.[1] && mappedHex[2]) {
      const hi = Number.parseInt(mappedHex[1], 16);
      const lo = Number.parseInt(mappedHex[2], 16);
      return isPrivateHost(`${hi >> 8}.${hi & 0xff}.${lo >> 8}.${lo & 0xff}`);
    }
    return false;
  }
  const octets = host.split(".").map(Number);
  if (octets.length !== 4 || octets.some((o) => !Number.isInteger(o))) {
    return false;
  }
  const a = octets[0] ?? -1;
  const b = octets[1] ?? -1;
  return (
    a === 127 ||
    a === 10 ||
    (a === 192 && b === 168) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 169 && b === 254) ||
    (a === 100 && b >= 64 && b <= 127) ||
    a === 0
  );
}

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

/**
 * True when a failed browser-mode scrape can be fixed by Scrappey's
 * plain-request mode. Exported for tests.
 */
export function shouldRetryInRequestMode(failure: {
  isCallerError?: boolean;
  upstreamStatus?: number;
  targetStatusCode?: number;
}): boolean {
  if (failure.isCallerError) {
    return false;
  }
  const target = failure.targetStatusCode;
  // The target page itself refused (404, 403, 429...): another mode gets the
  // same answer. 407 is the scraper's own proxy asking for auth, not the site.
  if (target !== undefined && target >= 400 && target < 500 && target !== 407) {
    return false;
  }
  const status = failure.upstreamStatus;
  // No headers / dropped body / empty 2xx solution, or a scraper 5xx.
  return status === undefined || status < 300 || status >= 500;
}

class FetchUrlService {
  /**
   * Scrappey solves anti-bot pages in a real browser; ordinary pages (Google
   * Books, Open Library, fandom wikis, AliExpress) regularly passed 30 s, and
   * every such run came back as a timeout (prod error log, Aug-Nov 2026).
   * The browser run gets 50 s, the plain-request fallback 25 s: both together
   * stay under the 90 s default tool timeout (transport/direct.ts).
   */
  readonly BROWSER_DEADLINE_MS = 50_000;
  /** Plain-request fallback: no rendering, so a page answers in seconds. */
  readonly REQUEST_MODE_DEADLINE_MS = 25_000;
  /** Worst case of both attempts, still under the 90 s tool timeout. */
  readonly TIMEOUT = this.BROWSER_DEADLINE_MS + this.REQUEST_MODE_DEADLINE_MS;
  private readonly SCRAPPEY_API_URL = "https://publisher.scrappey.com/api/v1";

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
          // Entries cached before inline images were stripped.
          content: stripInlineImageData(cached),
          statusCode: 200,
          timeElapsed: 0,
          timestamp: Date.now(),
        },
      };
    }

    const scrappeyResult = await this.fetchFromScrappey(url, fetchImpl);

    if (!scrappeyResult.ok) {
      return scrappeyResult;
    }

    const scrappeyResponse = scrappeyResult.data;

    const markdownResult = this.convertHtmlToMarkdown(
      scrappeyResponse.solution.response,
      scrappeyResponse.solution.currentUrl,
    );
    if (!markdownResult.ok) {
      return {
        ...markdownResult,
        scraperAttempts: scrappeyResult.scraperAttempts,
      };
    }

    const content = markdownResult.data;

    // Write to cache (non-blocking, fire-and-forget)
    void writeToCache(url, content);

    return {
      ok: true,
      scraperAttempts: scrappeyResult.scraperAttempts,
      data: {
        url: scrappeyResponse.solution.currentUrl,
        content,
        statusCode: scrappeyResponse.solution.statusCode,
        timeElapsed: scrappeyResponse.timeElapsed,
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Fetch a page's raw HTML through Scrappey (no cache, no Markdown). For
   * callers that parse page data themselves (embedded JSON on anti-bot sites).
   */
  async fetchRawHtml(
    url: string,
    fetchImpl: typeof globalThis.fetch,
  ): Promise<
    FetchResult<{ html: string; statusCode: number; currentUrl: string }>
  > {
    const validateResult = this.validateUrl(url);
    if (!validateResult.ok) {
      return validateResult;
    }
    const result = await this.fetchFromScrappey(url, fetchImpl);
    if (!result.ok) {
      return result;
    }
    return {
      ok: true,
      scraperAttempts: result.scraperAttempts,
      data: {
        html: result.data.solution.response,
        statusCode: result.data.solution.statusCode,
        currentUrl: result.data.solution.currentUrl,
      },
    };
  }

  /**
   * Browser mode first; ONE fallback in Scrappey's plain-request mode when the
   * browser run gave no page for a reason another mode can fix: no response
   * headers before the deadline (prod 11-25..27: github.com, mcreference.com,
   * soulsmodding.com, labvolt.com, kink.com, two CORS proxies, all at 60 s),
   * a proxy 5xx (unverified solution, target 307 redirect or 407 proxy auth),
   * or an empty solution. Our key/balance/quota (401/402/403/429), a rejected
   * URL and a real target refusal (target 4xx) are passed back unchanged.
   */
  private async fetchFromScrappey(
    url: string,
    fetchImpl: typeof globalThis.fetch,
  ): Promise<FetchResult<ScrappeyResponse>> {
    const attempts: ScrapeAttempt[] = [];
    const first = await this.timedScrappeyAttempt(
      url,
      "browser",
      this.BROWSER_DEADLINE_MS,
      fetchImpl,
      attempts,
    );
    if (first.ok || !shouldRetryInRequestMode(first)) {
      return { ...first, scraperAttempts: attempts };
    }
    const second = await this.timedScrappeyAttempt(
      url,
      "request",
      this.REQUEST_MODE_DEADLINE_MS,
      fetchImpl,
      attempts,
    );
    return { ...second, scraperAttempts: attempts };
  }

  private async timedScrappeyAttempt(
    url: string,
    mode: ScrapeMode,
    deadlineMs: number,
    fetchImpl: typeof globalThis.fetch,
    attempts: ScrapeAttempt[],
  ): Promise<FetchResult<ScrappeyResponse>> {
    const startedAt = performance.now();
    const signal = AbortSignal.timeout(deadlineMs);
    const result = await this.requestScrappey(url, signal, fetchImpl, mode);
    attempts.push(
      result.ok
        ? {
            mode,
            ok: true,
            elapsedMs: Math.round(performance.now() - startedAt),
            deadlineMs,
            deadlineFired: false,
            targetStatusCode: result.data.solution.statusCode,
          }
        : {
            mode,
            ok: false,
            elapsedMs: Math.round(performance.now() - startedAt),
            deadlineMs,
            deadlineFired: result.deadlineFired ?? signal.aborted,
            failureStage: result.failureStage,
            upstreamStatus: result.upstreamStatus,
            targetStatusCode: result.targetStatusCode,
            error: result.error,
          },
    );
    return result;
  }

  private async requestScrappey(
    url: string,
    signal: AbortSignal,
    fetchImpl: typeof globalThis.fetch,
    mode: ScrapeMode,
  ): Promise<FetchResult<ScrappeyResponse>> {
    const apiUrl = `${this.SCRAPPEY_API_URL}?key=${agentEnv.SCRAPPEY_API_KEY}`;
    const proxyStartedAt = performance.now();
    let upstreamStatus: number | undefined;

    try {
      const response = await fetchImpl(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cmd: "request.get",
          url: url,
          // "browser" is Scrappey's default; only the fallback names a mode.
          ...(mode === "request" ? { requestType: "request" } : {}),
        }),
        signal,
      });
      upstreamStatus = response.status;

      if (!response.ok) {
        // Error bodies can contain the proxy IP and location or the scraped
        // page itself. Only report validated outcome fields.
        let proxyBodyRead: "complete" | "deadline" | "stream-error" =
          "complete";
        const raw = await response.text().catch(() => {
          proxyBodyRead = signal.aborted ? "deadline" : "stream-error";
          return "";
        });
        let statusEvidence: z.infer<typeof proxyStatusSchema> | undefined;
        if (raw.length <= 64_000 && raw.trimStart().startsWith("{")) {
          try {
            statusEvidence = proxyStatusSchema.safeParse(JSON.parse(raw)).data;
          } catch {
            // The upstream can return malformed JSON or truncate its error page.
          }
        }
        const targetStatus = statusEvidence?.solution?.statusCode;
        const target = targetStatus
          ? `Target HTTP ${targetStatus}.`
          : "No target HTTP status reported.";
        const verification =
          statusEvidence?.solution?.verified === false
            ? " Scraper solution unverified."
            : "";
        return {
          ok: false,
          // eslint-disable-next-line i18next/no-literal-string
          error: `Scrappey HTTP ${response.status}. ${target}${verification}`,
          upstreamStatus: response.status,
          proxyElapsedMs: Math.round(performance.now() - proxyStartedAt),
          deadlineFired: signal.aborted,
          proxyBodyStatus: statusEvidence?.status,
          proxyBodyRead,
          targetStatusCode: statusEvidence?.solution?.statusCode,
          solutionVerified: statusEvidence?.solution?.verified,
          failureStage: "proxy-status",
          // Scrappey's status is about OUR API call, not the target page (a
          // page 404 comes back as 200 + solution.statusCode). Only a rejected
          // URL (400/422) is the caller's; 401/402/403/429 mean our key,
          // balance or quota broke - those must stay errors.
          isCallerError: response.status === 400 || response.status === 422,
        };
      }

      const data = (await response.json()) as ScrappeyResponse;

      if (!data.solution?.response) {
        return {
          ok: false,
          // eslint-disable-next-line i18next/no-literal-string
          error: "No content received from Scrappey API",
          upstreamStatus,
          targetStatusCode: data.solution?.statusCode,
          proxyElapsedMs: Math.round(performance.now() - proxyStartedAt),
          deadlineFired: signal.aborted,
          failureStage: "proxy-body",
        };
      }

      return { ok: true, data };
    } catch (error) {
      // AbortSignal.timeout rejects with TimeoutError, a plain abort with
      // AbortError: both mean this attempt's deadline fired.
      const isTimeout =
        error instanceof Error &&
        (error.name === "AbortError" || error.name === "TimeoutError");
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        ok: false,
        error: `Failed to fetch from Scrappey: ${errorMessage}`,
        proxyElapsedMs: Math.round(performance.now() - proxyStartedAt),
        deadlineFired: signal.aborted,
        isTimeout,
        upstreamStatus,
        failureStage:
          upstreamStatus === undefined ? "proxy-headers" : "proxy-body",
      };
    }
  }

  private convertHtmlToMarkdown(
    html: string,
    sourceUrl: string,
  ): FetchResult<string> {
    try {
      const cleanedHtml = this.cleanHtml(html);
      const markdown = htmlToMarkdown(cleanedHtml, sourceUrl);
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
        return {
          ok: false,
          error: "Only HTTP and HTTPS URLs are allowed",
          isCallerError: true,
        };
      }
      if (isPrivateHost(urlObj.hostname)) {
        return {
          ok: false,
          // eslint-disable-next-line i18next/no-literal-string
          error: `${urlObj.hostname} is a local/private address - the page is fetched from the public internet, so only public URLs work`,
          isCallerError: true,
        };
      }
      return { ok: true, data: undefined };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        ok: false,
        error: `Invalid URL format: ${errorMessage}`,
        isCallerError: true,
      };
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
    const startedAt = Date.now();
    const result = await fetchService.fetchUrl(
      url,
      createFixtureFetch(toolExecutionContext, logger),
    );
    const targetHost = URL.canParse(url) ? new URL(url).hostname : null;
    const phases =
      result.scraperAttempts?.map((attempt) => ({ ...attempt })) ?? [];

    if (!result.ok) {
      // ONE row per failed tool call, after the fallback mode ran: the top
      // level is the final attempt, `phases` lists every scraper call (mode,
      // stage, status, elapsed, deadline). Deadline and caller-input failures
      // stay warn, scraper failures (5xx, empty solution, conversion) error.
      const isWarn = result.isTimeout === true || result.isCallerError;
      (isWarn ? logger.warn : logger.error).bind(logger)("Fetch URL error", {
        provider: "scrappey",
        scraperMode: result.scraperAttempts?.at(-1)?.mode ?? null,
        attemptCount: result.scraperAttempts?.length ?? 0,
        phases,
        error: result.error,
        isTimeout: result.isTimeout ?? false,
        isCallerError: result.isCallerError ?? false,
        timeoutMs: fetchService.TIMEOUT,
        proxyElapsedMs: result.proxyElapsedMs,
        proxyBodyStatus: result.proxyBodyStatus,
        proxyBodyRead: result.proxyBodyRead,
        targetStatusCode: result.targetStatusCode,
        solutionVerified: result.solutionVerified,
        deadlineFired: result.deadlineFired,
        elapsedMs: Date.now() - startedAt,
        upstreamStatus: result.upstreamStatus,
        failureStage: result.failureStage,
        targetHost,
      });

      if (result.isCallerError) {
        return fail({
          message: t("get.errors.internal.detail", { message: result.error }),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

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

    const recoveredFrom = result.scraperAttempts?.find((a) => !a.ok);
    if (recoveredFrom) {
      // The page arrived, but only through the fallback mode: the browser run
      // still cost the user its full wait. One row per host keeps the
      // evidence of which sites hang Scrappey's browser.
      logger.warn("Fetch URL recovered via scraper request mode", {
        provider: "scrappey",
        targetHost,
        browserFailureStage: recoveredFrom.failureStage ?? null,
        browserUpstreamStatus: recoveredFrom.upstreamStatus ?? null,
        browserTargetStatus: recoveredFrom.targetStatusCode ?? null,
        phases,
        elapsedMs: Date.now() - startedAt,
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
