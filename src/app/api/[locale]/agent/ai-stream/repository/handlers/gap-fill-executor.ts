/**
 * GapFillExecutor
 *
 * Runs modality bridge calls (vision-bridge, STT) on message attachments
 * when the active LLM doesn't natively support the attachment's modality.
 *
 * Flow:
 *   1. Iterate history messages looking for attachments that need bridging
 *   2. For each: emit GAP_FILL_STARTED, call bridge model, emit GAP_FILL_COMPLETED
 *   3. Return updated ModelMessage[] with text variants substituted in-place
 *      so the LLM receives text descriptions instead of raw files
 *
 * All bridge calls run in parallel via Promise.all for maximum throughput.
 */

import "server-only";

import type {
  FilePart,
  ImagePart,
  LanguageModel,
  ModelMessage,
  ToolResultPart,
} from "ai";
import { generateText as aiGenerateText } from "ai";

import type { Modality } from "@/app/api/[locale]/agent/models/enum";
import type {
  ModelId,
  ModelOption,
} from "@/app/api/[locale]/agent/models/models";
import { calculateCreditCost } from "@/app/api/[locale]/agent/models/models";
import { IMAGE_GEN_TOOL_NAME } from "@/app/api/[locale]/agent/image-generation/constants";
import { AUDIO_GEN_TOOL_NAME } from "@/app/api/[locale]/agent/music-generation/constants";
import { VIDEO_GEN_TOOL_NAME } from "@/app/api/[locale]/agent/video-generation/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ChatMessage } from "../../../chat/db";
import type { MessageDbWriter } from "../core/message-db-writer";
import {
  type BridgeContext,
  ModalityResolver,
} from "../core/modality-resolver";
import { ProviderFactory } from "../core/provider-factory";

/**
 * Run gap-fill on all messages in the history that have attachments the
 * active model cannot handle natively.
 *
 * Returns a new messages array with variant text substituted for raw files.
 * All bridge calls run in parallel.
 */
export class GapFillExecutor {
  static async runGapFill(params: {
    messages: ModelMessage[];
    /** Raw ChatMessage history (needed for attachment data + variant cache) */
    chatHistory: ChatMessage[];
    activeModel: ModelOption;
    bridgeContext: BridgeContext;
    dbWriter: MessageDbWriter;
    abortSignal: AbortSignal;
    isIncognito: boolean;
    logger: EndpointLogger;
    user: JwtPayloadType;
    locale: CountryLanguage;
  }): Promise<ModelMessage[]> {
    const {
      messages,
      chatHistory,
      activeModel,
      bridgeContext,
      dbWriter,
      abortSignal,
      logger,
      user,
      locale,
    } = params;

    // Build a lookup from messageId → ChatMessage for variant access
    const chatHistoryById = new Map<string, ChatMessage>(
      chatHistory.map((m) => [m.id, m]),
    );

    // Process all messages in parallel
    const updated = await Promise.all(
      messages.map(async (msg): Promise<ModelMessage> => {
        // Only user messages can have attachments
        if (msg.role !== "user" || !Array.isArray(msg.content)) {
          return msg;
        }

        const parts = msg.content;
        const hasImages = parts.some(
          (p) =>
            p.type === "image" &&
            !activeModel.inputs.includes("image" as Modality),
        );
        const hasFiles = parts.some(
          (p) =>
            p.type === "file" &&
            !activeModel.inputs.includes("file" as Modality),
        );

        if (!hasImages && !hasFiles) {
          return msg;
        }

        // Find the ChatMessage that corresponds to this ModelMessage
        // We identify by matching text content (heuristic; good enough)
        const textPart = parts.find((p) => p.type === "text");
        const msgText =
          textPart && "text" in textPart ? String(textPart.text) : "";

        const chatMsg = [...chatHistoryById.values()].find(
          (m) => m.content === msgText || msgText.startsWith(m.content ?? ""),
        );

        // Replace each unsupported attachment part with text variant - in parallel
        const newParts = await Promise.all(
          parts.map(async (part) => {
            if (
              (part.type === "image" || part.type === "file") &&
              !activeModel.inputs.includes(
                (part.type === "image" ? "image" : "file") as Modality,
              )
            ) {
              const variantText = await GapFillExecutor.bridgeAttachment({
                part,
                chatMessageId: chatMsg?.id ?? null,
                bridgeContext,
                dbWriter,
                abortSignal,
                logger,
                user,
                locale,
              });

              if (variantText) {
                // Replace image/file part with a text part
                return { type: "text" as const, text: variantText };
              }
              // Bridge failed or not configured - replace with a placeholder so
              // the model knows an attachment existed but couldn't be processed.
              const attachmentType =
                part.type === "image" ? "image" : "audio/file";
              return {
                type: "text" as const,
                text: `[${attachmentType} attachment: could not be processed - no vision/STT bridge model configured for this conversation. If the user references this attachment, inform them that you cannot access it with the current model configuration and suggest configuring a vision bridge model in the favorite settings.]`,
              };
            }
            return part;
          }),
        );

        const filteredParts = newParts.filter(
          (p): p is NonNullable<(typeof newParts)[number]> => p !== null,
        );
        return { ...msg, content: filteredParts };
      }),
    );

    // Pass 2: Tool-result media gap-fill
    // For image_gen / video_gen / audio_gen tool results where:
    //   - active model can't see the produced media modality, AND
    //   - text field is null/empty (shouldn't happen after FilePartHandler fix, but defensive)
    // → call vision bridge to generate a text description and substitute it in
    const MEDIA_TOOL_NAMES = [
      IMAGE_GEN_TOOL_NAME,
      VIDEO_GEN_TOOL_NAME,
      AUDIO_GEN_TOOL_NAME,
    ] as const;
    type MediaToolName = (typeof MEDIA_TOOL_NAMES)[number];

    const updatedWithToolResults = await Promise.all(
      updated.map(async (msg): Promise<ModelMessage> => {
        if (msg.role !== "tool" || !Array.isArray(msg.content)) {
          return msg;
        }

        const newContent = await Promise.all(
          msg.content.map(async (part): Promise<typeof part> => {
            const p = part as ToolResultPart;
            if (p.type !== "tool-result") {
              return part;
            }
            if (!MEDIA_TOOL_NAMES.includes(p.toolName as MediaToolName)) {
              return part;
            }

            // output is typed as LanguageModelV2ToolResultContent in AI SDK —
            // in practice for our media tools it's always { type: "json", value: {...} }
            interface MediaOutputValue {
              file?: string;
              text?: string | null;
              mediaType?: string;
              creditCost?: number;
            }
            interface MediaOutput {
              type?: string;
              value?: MediaOutputValue;
            }
            const outputValue = (p.output as MediaOutput | undefined)?.value;
            if (!outputValue || typeof outputValue !== "object") {
              return part;
            }

            const fileUrl =
              typeof outputValue.file === "string"
                ? outputValue.file
                : undefined;
            const existingText =
              typeof outputValue.text === "string" ? outputValue.text : null;

            // If text is already populated, nothing to do
            if (existingText && existingText.trim().length > 0) {
              return part;
            }
            // If no file URL, nothing to bridge
            if (!fileUrl) {
              return part;
            }

            // Check if model can see this modality — if it can, it doesn't need text
            const modality: Modality =
              p.toolName === IMAGE_GEN_TOOL_NAME
                ? "image"
                : p.toolName === VIDEO_GEN_TOOL_NAME
                  ? "video"
                  : "audio";
            if (activeModel.inputs.includes(modality)) {
              return part;
            }

            // Generate text description via vision bridge (images only for now;
            // audio/video fall back to a generic placeholder since there's no audio-vision bridge)
            if (modality !== "image") {
              // For audio/video: substitute a generic description so model isn't confused
              const genericText = `[generated ${modality} — no text description available]`;
              return {
                ...p,
                output: {
                  type: "json" as const,
                  value: { ...outputValue, text: genericText },
                },
              };
            }

            logger.info(
              "[GapFill] Bridging null-text image_gen tool result via vision",
              {
                fileUrl: fileUrl.slice(0, 80),
              },
            );

            const description = await GapFillExecutor.bridgeImageUrl({
              imageUrl: fileUrl,
              bridgeContext,
              abortSignal,
              logger,
              user,
              locale,
            });

            if (!description) {
              return part;
            }

            return {
              ...p,
              output: {
                type: "json" as const,
                value: { ...outputValue, text: description },
              },
            };
          }),
        );

        return { ...msg, content: newContent };
      }),
    );

    return updatedWithToolResults;
  }

  private static async bridgeAttachment(params: {
    part: ImagePart | FilePart;
    chatMessageId: string | null;
    bridgeContext: BridgeContext;
    dbWriter: MessageDbWriter;
    abortSignal: AbortSignal;
    logger: EndpointLogger;
    user: JwtPayloadType;
    locale: CountryLanguage;
  }): Promise<string | null> {
    const {
      part,
      chatMessageId,
      bridgeContext,
      dbWriter,
      logger,
      user,
      locale,
    } = params;

    const isImage = part.type === "image";
    const bridgeType: "stt" | "vision" | "translation" | "tts" = isImage
      ? "vision"
      : "stt"; // file parts are audio/STT
    const modality: Modality = isImage ? "image" : "file";

    // Emit GAP_FILL_STARTED
    if (chatMessageId) {
      dbWriter.emitGapFillStarted({
        messageId: chatMessageId,
        bridgeType,
        modality,
      });
    }

    if (isImage) {
      return GapFillExecutor.bridgeVision({
        part: part as ImagePart,
        chatMessageId,
        bridgeContext,
        dbWriter,
        abortSignal: params.abortSignal,
        logger,
        user,
        locale,
        modality,
        bridgeType,
      });
    }

    // Audio file → STT bridge
    return GapFillExecutor.bridgeStt({
      part: part as FilePart,
      chatMessageId,
      bridgeContext,
      dbWriter,
      logger,
      user,
      locale,
      modality,
      bridgeType,
    });
  }

  private static async bridgeVision(params: {
    part: ImagePart;
    chatMessageId: string | null;
    bridgeContext: BridgeContext;
    dbWriter: MessageDbWriter;
    abortSignal: AbortSignal;
    logger: EndpointLogger;
    user: JwtPayloadType;
    locale: CountryLanguage;
    modality: Modality;
    bridgeType: "stt" | "vision" | "translation" | "tts";
  }): Promise<string | null> {
    const {
      part,
      chatMessageId,
      bridgeContext,
      dbWriter,
      logger,
      user,
      locale,
      modality,
      bridgeType,
    } = params;

    const visionModel = ModalityResolver.resolveVisionBridgeModel(
      bridgeContext,
      user,
    );

    // Get the correct provider for the vision model (not the active model's provider)
    const visionProvider = ProviderFactory.getProviderForModel(
      visionModel,
      logger,
      locale,
    );

    try {
      // Build vision prompt
      // ImagePart.image is DataContent | URL - can be a base64 string, data URI, Uint8Array, or URL object
      const imageField = part.image;

      if (!imageField) {
        logger.warn("[GapFill] Image part has no image data, skipping");
        return null;
      }

      // Pass image directly to generateText - the AI SDK accepts DataContent | URL natively
      const imageContent = {
        type: "image" as const,
        image: imageField,
        ...(part.mediaType
          ? { mimeType: part.mediaType as `image/${string}` }
          : {}),
      };

      const result = await aiGenerateText({
        model: visionProvider.chat(visionModel.providerModel) as LanguageModel,
        abortSignal: params.abortSignal,
        messages: [
          {
            role: "user" as const,
            content: [
              imageContent,
              {
                type: "text" as const,
                text: "Describe this image in detail. Be comprehensive - include colors, objects, text, layout, and any notable features. This description will be used by another AI model that cannot see images.",
              },
            ],
          },
        ],
      });

      const description = result.text.trim();
      const creditCost = calculateCreditCost(visionModel, 0, 0, 0, 0);

      if (chatMessageId && description) {
        const variant = {
          modality: "text" as Modality,
          content: description,
          modelId: visionModel.id as ModelId,
          creditCost,
          createdAt: new Date().toISOString(),
        };

        await dbWriter.emitGapFillCompleted({
          messageId: chatMessageId,
          bridgeType,
          modality,
          variant,
        });
      }

      return description || null;
    } catch (err) {
      logger.warn("[GapFill] Vision bridge call failed", {
        error: err instanceof Error ? err.message : String(err),
        modality,
        bridgeType,
      });
      return null;
    }
  }

  private static async bridgeStt(params: {
    part: FilePart;
    chatMessageId: string | null;
    bridgeContext: BridgeContext;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
    user: JwtPayloadType;
    locale: CountryLanguage;
    modality: Modality;
    bridgeType: "stt" | "vision" | "translation" | "tts";
  }): Promise<string | null> {
    const {
      part,
      chatMessageId,
      bridgeContext,
      dbWriter,
      logger,
      user,
      locale,
      modality,
      bridgeType,
    } = params;

    const sttModel = ModalityResolver.resolveSttModel(bridgeContext, user);
    if (!sttModel) {
      logger.warn("[GapFill] No STT bridge model configured, skipping", {
        modality,
      });
      return null;
    }

    try {
      // Reconstruct a File from the FilePart's base64 data
      const mimeType =
        "mimeType" in part && part.mimeType
          ? String(part.mimeType)
          : "audio/webm";

      let audioBytes: Uint8Array;
      if ("data" in part && part.data) {
        const data = part.data;
        if (typeof data === "string") {
          audioBytes = Buffer.from(data, "base64");
        } else if (data instanceof ArrayBuffer) {
          audioBytes = new Uint8Array(data);
        } else {
          // Uint8Array or Buffer (Buffer extends Uint8Array)
          audioBytes = new Uint8Array(
            (data as Uint8Array).buffer,
            (data as Uint8Array).byteOffset,
            (data as Uint8Array).byteLength,
          );
        }
      } else if ("url" in part && part.url) {
        // URL-based file - fetch the bytes
        const response = await fetch(String(part.url));
        const arrayBuffer = await response.arrayBuffer();
        audioBytes = new Uint8Array(arrayBuffer);
      } else {
        logger.warn("[GapFill] FilePart has no data or url, skipping STT");
        return null;
      }

      const ext = mimeType.split("/")[1]?.split(";")[0] ?? "webm";
      const audioFile = new File(
        [audioBytes.buffer as ArrayBuffer],
        `audio.${ext}`,
        {
          type: mimeType,
        },
      );

      const { scopedTranslation: sttScopedTranslation } =
        await import("../../../speech-to-text/i18n");
      const sttT = sttScopedTranslation.scopedT(locale).t;

      const { SpeechToTextRepository } =
        await import("../../../speech-to-text/repository");

      const result = await SpeechToTextRepository.transcribeAudio(
        audioFile,
        user,
        locale,
        logger,
        sttT,
        sttModel.id,
      );

      if (!result.success) {
        logger.warn("[GapFill] STT bridge call failed", {
          error: result.message,
          modality,
        });
        return null;
      }

      const transcript = result.data.response.text;
      const creditCost = result.data.creditCost ?? 0;

      if (chatMessageId && transcript) {
        const variant = {
          modality: "text" as Modality,
          content: transcript,
          modelId: sttModel.id as ModelId,
          creditCost,
          createdAt: new Date().toISOString(),
        };

        await dbWriter.emitGapFillCompleted({
          messageId: chatMessageId,
          bridgeType,
          modality,
          variant,
        });
      }

      return transcript || null;
    } catch (err) {
      logger.warn("[GapFill] STT bridge call failed", {
        error: err instanceof Error ? err.message : String(err),
        modality,
        bridgeType,
      });
      return null;
    }
  }

  /**
   * Bridge an image URL to a text description via the vision bridge model.
   * Used when a media tool result has a null text field and the active model can't see images.
   */
  private static async bridgeImageUrl(params: {
    imageUrl: string;
    bridgeContext: BridgeContext;
    abortSignal: AbortSignal;
    logger: EndpointLogger;
    user: JwtPayloadType;
    locale: CountryLanguage;
  }): Promise<string | null> {
    const { imageUrl, bridgeContext, abortSignal, logger, user, locale } =
      params;

    const visionModel = ModalityResolver.resolveVisionBridgeModel(
      bridgeContext,
      user,
    );
    const visionProvider = ProviderFactory.getProviderForModel(
      visionModel,
      logger,
      locale,
    );

    try {
      const result = await aiGenerateText({
        model: visionProvider.chat(visionModel.providerModel) as LanguageModel,
        abortSignal,
        messages: [
          {
            role: "user" as const,
            content: [
              { type: "image" as const, image: new URL(imageUrl) },
              {
                type: "text" as const,
                text: "Describe this generated image in detail. Include subject, style, colors, composition, and any notable elements. This description will be shown to another AI model that cannot see images.",
              },
            ],
          },
        ],
      });

      return result.text.trim() || null;
    } catch (err) {
      logger.warn("[GapFill] Vision bridge for tool result failed", {
        error: err instanceof Error ? err.message : String(err),
        imageUrl: imageUrl.slice(0, 80),
      });
      return null;
    }
  }
}
