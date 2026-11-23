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
import { logProviderRequest } from "./shared/debug-file-logger";
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
  imageTransportCounts?: { remote: number; inline: number; other: number };
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
  const parts = multipart.flat();
  const images = parts.filter(({ type }) => type === "image_url");
  const imageTransportCounts = { remote: 0, inline: 0, other: 0 };
  for (const image of images) {
    const url = image.image_url?.url ?? "";
    if (/^https?:\/\//i.test(url)) {imageTransportCounts.remote++;}
    else if (/^data:/i.test(url)) {imageTransportCounts.inline++;}
    else {imageTransportCounts.other++;}
  }
  return {
    model: request.model,
    imageTransportCounts,
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
): {
  chat: (modelId: string) => OpenAICompatibleChatLanguageModel;
} {
  const customFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
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
    return response;
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
