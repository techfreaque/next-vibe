import "server-only";

import type { Experimental_DownloadFunction } from "ai";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { EndpointLogger } from "next-vibe/logger/types";

import { createFixtureFetch } from "../ai-stream/testing/fetch-cache";

/**
 * AI SDK `experimental_download` bound to the fixture chain.
 *
 * When a prompt carries a media URL the model can't take by reference
 * (e.g. video/mp4 on OpenRouter, an image URL without an extension), the AI
 * SDK downloads it itself with the GLOBAL fetch — a live external call that
 * escapes record/replay. Routing the download through createFixtureFetch keeps
 * it on the same scope/ordinal chain as the model call. URLs the model
 * accepts natively are passed through untouched (null = keep the URL).
 */
export function createFixtureDownload(
  toolExecutionContext: ToolExecutionContext,
  logger: EndpointLogger,
): Experimental_DownloadFunction {
  const fetchImpl = createFixtureFetch(toolExecutionContext, logger);
  return async (requests) => {
    const results: Array<{
      data: Uint8Array;
      mediaType: string | undefined;
    } | null> = [];
    // Sequential: fixture ordinals replay by position.
    for (const { url, isUrlSupportedByModel } of requests) {
      if (isUrlSupportedByModel) {
        results.push(null);
        continue;
      }
      const response = await fetchImpl(url.toString());
      if (!response.ok) {
        // Let the model/provider report the unreachable URL itself
        results.push(null);
        continue;
      }
      results.push({
        data: new Uint8Array(await response.arrayBuffer()),
        mediaType: response.headers.get("content-type") ?? undefined,
      });
    }
    return results;
  };
}
