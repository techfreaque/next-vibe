/**
 * Explain a failed generation whose input was a third-party link.
 *
 * Providers fetch public reference URLs themselves and report a broken one in
 * their own words: Seedream "the image format is not supported" for a
 * DeviantArt PAGE link, Veo "Received 404 status code when fetching image from
 * URL" for a made-up example.com path (prod 2026-11-27). Neither tells the
 * user what to change. After such a failure we load the link once ourselves
 * (SSRF-guarded, fixture-aware fetch) and, when it is not a loadable media
 * file, return the concrete reason instead of the provider's text.
 *
 * Only runs on the failure path, so successful generations make no extra
 * request (and recorded fixtures keep their ordinals).
 */

import "server-only";

import { fetchPublicUrl } from "next-vibe/core/utils/ssrf-guard";
import type { EndpointLogger } from "next-vibe/logger/types";

export type ReferenceProbeResult =
  | { usable: true }
  | {
      usable: false;
      reason: "notMedia" | "unreachable";
      host: string;
      status: number | null;
      contentType: string | null;
    };

const PROBE_TIMEOUT_MS = 8000;

function hostOf(url: string): string {
  return URL.canParse(url) ? new URL(url).host : "other";
}

/**
 * Load one public reference link and judge it. data: URIs and own storage
 * files (already inlined by resolveMediaReference) are always usable here.
 */
export async function probeReferenceUrl(params: {
  url: string;
  fetchImpl: typeof globalThis.fetch;
}): Promise<ReferenceProbeResult> {
  const { url, fetchImpl } = params;
  if (!/^https?:\/\//i.test(url)) {
    return { usable: true };
  }
  const host = hostOf(url);
  let response: Response | null;
  try {
    response = await fetchPublicUrl(url, fetchImpl, {
      method: "GET",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
  } catch {
    return {
      usable: false,
      reason: "unreachable",
      host,
      status: null,
      contentType: null,
    };
  }
  if (!response) {
    return {
      usable: false,
      reason: "unreachable",
      host,
      status: null,
      contentType: null,
    };
  }
  const contentType =
    response.headers.get("content-type")?.split(";")[0]?.trim() ?? null;
  // Headers are all we need: release the body without reading it.
  await response.body?.cancel().catch(() => undefined);
  if (!response.ok) {
    return {
      usable: false,
      reason: "unreachable",
      host,
      status: response.status,
      contentType,
    };
  }
  if (contentType === "text/html" || contentType === "application/xhtml+xml") {
    return {
      usable: false,
      reason: "notMedia",
      host,
      status: response.status,
      contentType,
    };
  }
  return { usable: true };
}

/**
 * Probe every public link of a failed request (max 4) and return the first
 * unusable one, logged once with the provider's own error so the row explains
 * the failure end to end.
 */
export async function findUnusableReference(params: {
  urls: readonly string[];
  fetchImpl: typeof globalThis.fetch;
  logger: EndpointLogger;
  logTag: "ImageGen" | "VideoGen";
  model: string;
  provider: string;
  providerError: string;
}): Promise<Extract<ReferenceProbeResult, { usable: false }> | null> {
  const { urls, fetchImpl, logger, logTag, model, provider, providerError } =
    params;
  const publicUrls = urls.filter((url) => /^https?:\/\//i.test(url));
  for (const url of publicUrls.slice(0, 4)) {
    const result = await probeReferenceUrl({ url, fetchImpl });
    if (!result.usable) {
      logger.warn(`[${logTag}] Provider failed on an unusable reference link`, {
        model,
        provider,
        reason: result.reason,
        host: result.host,
        status: result.status,
        contentType: result.contentType,
        referenceCount: publicUrls.length,
        providerError: providerError.slice(0, 300),
      });
      return result;
    }
  }
  return null;
}
