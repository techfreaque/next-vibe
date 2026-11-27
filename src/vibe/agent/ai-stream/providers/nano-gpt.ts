/**
 * NanoGPT Provider
 * OpenAI-compatible aggregator (https://api.nano-gpt.com/api/v1) serving
 * uncensored / abliterated open-weight models (GLM 5.3, DeepSeek V4.1, …).
 * Native tool calling + streamed usage are supported upstream, so unlike the
 * prompt-engineered providers (Venice, Gab, FreedomGPT) the request passes
 * through untouched.
 *
 * Uses the OpenAI-compatible chat model (not OpenAI's): NanoGPT models are
 * reasoning models that stream a `reasoning` / `reasoning_content` delta
 * before `content`. Only the compatible model surfaces those as
 * reasoning-delta parts (OpenAI's chat model drops them), and it does not run
 * OpenAI's strict-schema normalisation that strips JSON Schema `propertyNames`
 * from tool schemas. No max output tokens is sent (the loop never sets one),
 * so reasoning cannot starve the final content on our side.
 */

import "server-only";

import { OpenAICompatibleChatLanguageModel } from "@ai-sdk/openai-compatible";
import { safeParseJSON } from "@ai-sdk/provider-utils";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { agentEnv } from "../../env";
import { ApiProvider } from "../../models/models";
import { GARBLED_REPLACE_HEADER } from "./openrouter/garbled-guard";
import { applyClientCache, isJsonRecord } from "./openrouter/routing";
import { logProviderRequest } from "./shared/debug-file-logger";
import type { ClientPromptCache } from "./shared/prompt-cache";
import { withBufferedToolCalls } from "./shared/tool-call-delta-buffer";
import { nanoGptCostExtractor } from "./shared/upstream-cost";
import {
  summarizeUpstreamError,
  upstreamErrorResponse,
} from "./shared/upstream-error";

const NANO_GPT_BASE_URL = "https://api.nano-gpt.com/api/v1";

const nanoGptRequestSchema = z.object({
  model: z.string(),
  messages: z.array(
    z.object({
      role: z.string(),
      content: z
        .union([
          z.string(),
          z.array(
            z.object({
              type: z.string(),
              image_url: z
                .object({ url: z.string() })
                .optional()
                .catch(undefined),
            }),
          ),
        ])
        .nullish(),
    }),
  ),
  tools: z.array(z.object({})).optional(),
  max_tokens: z.number().optional(),
  max_completion_tokens: z.number().optional(),
  tool_choice: z.json().optional(),
  reasoning: z.json().optional(),
  reasoning_effort: z.string().optional(),
  temperature: z.number().optional(),
});

/**
 * Which optional features a request carried (no content): tools, images,
 * output cap, reasoning knobs, size. Enough to bisect a bare 400.
 */
async function describeRequestShape(
  body: BodyInit | null | undefined,
): Promise<{
  model: string | undefined;
  requestShape: Record<string, string | number | boolean> | null;
  imageTransportCounts?: {
    remote: number;
    inline: number;
    other: number;
    textDataUris: number;
    textImageUrls: number;
    textMarkdownImages: number;
    textImageRoles: string;
  };
}> {
  if (typeof body !== "string") {
    return { model: undefined, requestShape: null };
  }
  const parsed = await safeParseJSON({
    text: body,
    schema: nanoGptRequestSchema,
  });
  if (!parsed.success) {
    return {
      model: undefined,
      requestShape: { chars: body.length, parsed: false },
    };
  }
  const request = parsed.value;
  const multipart = request.messages.flatMap(({ content }) =>
    Array.isArray(content) ? [content] : [],
  );
  // NanoGPT answers "does not support image inputs" for text-only models
  // even when no image part is on the wire (prod 2026-11-27: 0 images, 0
  // multipart messages, 12-13 tool messages). Count image references inside
  // plain text per role so the next rejection names what it reacted to.
  const textImageRefs = { dataUris: 0, imageUrls: 0, markdownImages: 0 };
  const textImageRoles = new Set<string>();
  for (const message of request.messages) {
    if (typeof message.content !== "string") {
      continue;
    }
    const dataUris = (message.content.match(/data:image\//gi) ?? []).length;
    const imageUrls = (
      message.content.match(
        /https?:\/\/[^\s"')\]]+\.(?:png|jpe?g|webp|gif|avif|bmp)(?:\?[^\s"')\]]*)?/gi,
      ) ?? []
    ).length;
    const markdownImages = (message.content.match(/!\[[^\]]*\]\(/g) ?? [])
      .length;
    textImageRefs.dataUris += dataUris;
    textImageRefs.imageUrls += imageUrls;
    textImageRefs.markdownImages += markdownImages;
    if (dataUris + imageUrls + markdownImages > 0) {
      textImageRoles.add(message.role);
    }
  }
  const parts = multipart.flat();
  const images = parts.filter(({ type }) => type === "image_url");
  const imageTransportCounts = { remote: 0, inline: 0, other: 0 };
  for (const image of images) {
    const url = image.image_url?.url ?? "";
    if (/^https?:\/\//i.test(url)) {
      imageTransportCounts.remote++;
    } else if (/^data:/i.test(url)) {
      imageTransportCounts.inline++;
    } else {
      imageTransportCounts.other++;
    }
  }
  return {
    model: request.model,
    // Kept in this key: it stays outside the error fingerprint.
    imageTransportCounts: {
      ...imageTransportCounts,
      textDataUris: textImageRefs.dataUris,
      textImageUrls: textImageRefs.imageUrls,
      textMarkdownImages: textImageRefs.markdownImages,
      textImageRoles: [...textImageRoles].join(","),
    },
    requestShape: {
      chars: body.length,
      parsed: true,
      messages: request.messages.length,
      tools: request.tools?.length ?? 0,
      toolMessages: request.messages.filter(({ role }) => role === "tool")
        .length,
      multipartMessages: multipart.length,
      textOnlyMultipartMessages: multipart.filter(
        (content) =>
          content.length > 0 && content.every(({ type }) => type === "text"),
      ).length,
      images: images.length,
      audio: parts.filter(({ type }) => type === "input_audio").length,
      video: parts.filter(({ type }) => type === "video_url").length,
      files: parts.filter(({ type }) => type === "file").length,
      maxTokens: request.max_completion_tokens ?? request.max_tokens ?? "none",
      toolChoice: request.tool_choice !== undefined,
      reasoning:
        request.reasoning !== undefined ||
        request.reasoning_effort !== undefined,
      temperature: request.temperature !== undefined,
    },
  };
}

/**
 * Create a NanoGPT provider compatible with AI SDK V2
 */
export function createNanoGPT(
  logger: EndpointLogger,
  // Explicit fetch — the fixture engine binds record/replay per execution
  // chain (createFixtureFetch); plain live fetch otherwise. Never global.
  fetchImpl: typeof globalThis.fetch,
  clientCache?: ClientPromptCache,
): {
  chat: (modelId: string) => OpenAICompatibleChatLanguageModel;
} {
  const customFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    let replaceVisibleRequested = false;
    if (clientCache && typeof init?.body === "string") {
      const parsed = await safeParseJSON({ text: init.body, schema: z.json() });
      if (parsed.success && isJsonRecord(parsed.value)) {
        applyClientCache(parsed.value, clientCache);
        init = { ...init, body: JSON.stringify(parsed.value) };
      }
    }
    if (init?.headers) {
      // Internal opt-in header (chat loop): never sent upstream.
      const outgoing = new Headers(init.headers);
      if (outgoing.has(GARBLED_REPLACE_HEADER)) {
        replaceVisibleRequested = outgoing.get(GARBLED_REPLACE_HEADER) === "1";
        outgoing.delete(GARBLED_REPLACE_HEADER);
        init = { ...init, headers: outgoing };
      }
    }
    if (typeof init?.body === "string") {
      logProviderRequest("nano-gpt", init.body);
    }
    const response = await fetchImpl(input, init);
    if (!response.ok) {
      const upstreamError = summarizeUpstreamError(
        "NanoGPT",
        response.status,
        response.headers,
        await response.text(),
      );
      logger.error("[NanoGPT] API Error", {
        status: response.status,
        statusText: response.statusText,
        body: upstreamError.summary,
        upstreamResponseKind: upstreamError.isHtmlPage ? "edge-html" : "api",
        cfRay: upstreamError.cfRay,
        providerRequestId: response.headers.get("x-request-id"),
        retryAfter: response.headers.get("retry-after"),
        // Some upstreams report unsupported images for multipart requests.
        // Record the actual wire shape and separate media from text arrays.
        ...(await describeRequestShape(init?.body)),
      });
      return upstreamErrorResponse(response, upstreamError);
    }
    // Hold tool-call deltas until each call is complete, and re-send once
    // when NanoGPT ends the stream with "the final tool call was malformed"
    // (prod 2026-11-25..27: GLM 5.3 Uncensored, DeepSeek V4.1 Flash, 14
    // turns ended in an error bubble). The chat loop opts in to replacing
    // already-visible text via the replace marker header.
    return withBufferedToolCalls(response, {
      provider: "NanoGPT",
      logger,
      retry: {
        replaceVisible: replaceVisibleRequested,
        signal: init?.signal,
        resend: () => fetchImpl(input, init),
      },
    });
  };

  return {
    chat: (modelId: string): OpenAICompatibleChatLanguageModel =>
      new OpenAICompatibleChatLanguageModel(modelId, {
        provider: ApiProvider.NANO_GPT,
        headers: (): Record<string, string> => ({
          "Content-Type": "application/json",
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${agentEnv.NANO_GPT_API_KEY}`,
        }),
        includeUsage: true,
        // Real per-call cost (x_nanogpt_pricing / usage.cost) -> provider
        // metadata, so the call bills real cost x markup.
        metadataExtractor: nanoGptCostExtractor,
        url: ({ path }) => `${NANO_GPT_BASE_URL}${path}`,
        fetch: customFetch as typeof fetch,
      }),
  };
}
