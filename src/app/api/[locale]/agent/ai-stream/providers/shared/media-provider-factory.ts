/**
 * Shared factory for media generation AI SDK providers (image + audio).
 * Eliminates duplicated doGenerate/doStream boilerplate across all provider wrappers.
 */

import "server-only";

import type {
  LanguageModelV2,
  LanguageModelV2CallOptions,
  LanguageModelV2CallWarning,
  LanguageModelV2Content,
  LanguageModelV2FinishReason,
  LanguageModelV2StreamPart,
  LanguageModelV2Usage,
} from "@ai-sdk/provider";

import type { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { extractLastUserPrompt } from "./prompt-extraction";

export function readStringOption(
  opts: LanguageModelV2CallOptions["providerOptions"],
  key: string,
): string | undefined {
  const val = opts?.["generation"]?.[key];
  return typeof val === "string" ? val : undefined;
}

type GenerateResult<TUrl extends string> = ResponseType<Record<TUrl, string>>;

interface MediaProviderConfig<TUrl extends string> {
  provider: ApiProvider;
  logPrefix: string;
  defaultMediaType: string;
  urlKey: TUrl;
  generate: (
    options: LanguageModelV2CallOptions,
    prompt: string,
    modelId: string,
  ) => Promise<GenerateResult<TUrl>>;
}

async function fetchAsBase64(
  url: string,
  defaultMediaType: string,
): Promise<{ base64: string; mediaType: string }> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const mediaType = response.headers.get("content-type") ?? defaultMediaType;
  return { base64, mediaType };
}

export function createMediaProvider<TUrl extends string>(
  logger: EndpointLogger,
  config: MediaProviderConfig<TUrl>,
): { chat: (modelId: string) => LanguageModelV2 } {
  return {
    chat: (modelId: string): LanguageModelV2 => ({
      specificationVersion: "v2",
      provider: config.provider,
      modelId,
      supportedUrls: {},

      async doGenerate(options: LanguageModelV2CallOptions): Promise<{
        content: LanguageModelV2Content[];
        finishReason: LanguageModelV2FinishReason;
        usage: LanguageModelV2Usage;
        warnings: LanguageModelV2CallWarning[];
      }> {
        const prompt = extractLastUserPrompt(options.prompt);

        logger.info(`[${config.logPrefix}] Generating (non-streaming)`, {
          model: modelId,
          promptLength: prompt.length,
        });

        const result = await config.generate(options, prompt, modelId);

        if (!result.success) {
          // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- LanguageModelV2 interface requires throwing on error
          throw new Error(result.message);
        }

        const { base64, mediaType } = await fetchAsBase64(
          result.data[config.urlKey],
          config.defaultMediaType,
        );

        return {
          content: [{ type: "file" as const, mediaType, data: base64 }],
          finishReason: "stop" as const,
          usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
          warnings: [],
        };
      },

      async doStream(options: LanguageModelV2CallOptions): Promise<{
        stream: ReadableStream<LanguageModelV2StreamPart>;
      }> {
        const prompt = extractLastUserPrompt(options.prompt);

        logger.info(`[${config.logPrefix}] Generating`, {
          model: modelId,
          promptLength: prompt.length,
        });

        const abortSignal = options.abortSignal;

        const stream = new ReadableStream<LanguageModelV2StreamPart>({
          async start(controller): Promise<void> {
            controller.enqueue({ type: "stream-start", warnings: [] });

            try {
              const result = await config.generate(
                { ...options, abortSignal },
                prompt,
                modelId,
              );

              if (!result.success) {
                controller.enqueue({
                  type: "error",
                  error: new Error(result.message),
                });
                controller.close();
                return;
              }

              const { base64, mediaType } = await fetchAsBase64(
                result.data[config.urlKey],
                config.defaultMediaType,
              );

              controller.enqueue({ type: "file", mediaType, data: base64 });
              controller.enqueue({
                type: "finish",
                finishReason: "stop",
                usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
              });
            } catch (error) {
              controller.enqueue({ type: "error", error });
            }

            controller.close();
          },
        });

        return { stream };
      },
    }),
  };
}
