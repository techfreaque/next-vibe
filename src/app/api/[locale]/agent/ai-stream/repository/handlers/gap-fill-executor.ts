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

import { IMAGE_GEN_ALIAS } from "@/app/api/[locale]/agent/image-generation/constants";
import type { Modality } from "@/app/api/[locale]/agent/models/enum";
import { calculateCreditCost } from "@/app/api/[locale]/agent/models/models";
import { AUDIO_GEN_TOOL_NAME } from "@/app/api/[locale]/agent/music-generation/constants";
import { VIDEO_GEN_TOOL_NAME } from "@/app/api/[locale]/agent/video-generation/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ChatMessage } from "../../../chat/db";
import type { ChatModelOption } from "../../models";
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
    /** ID of the current user message - used directly instead of content-based lookup */
    currentUserMessageId?: string | null;
    activeModel: ChatModelOption;
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
      currentUserMessageId,
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

    // Find index of the last user message in ModelMessage array so we can
    // use currentUserMessageId directly instead of a fallible content-based lookup.
    const lastUserMsgIndex = messages.reduce(
      (acc, msg, i) => (msg.role === "user" ? i : acc),
      -1,
    );

    // Process all messages in parallel
    const updated = await Promise.all(
      messages.map(async (msg, msgIndex): Promise<ModelMessage> => {
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
        const hasFiles = parts.some((p) => {
          if (p.type !== "file") {
            return false;
          }
          const mime =
            "mediaType" in p && typeof p.mediaType === "string"
              ? p.mediaType
              : "";
          const modality: Modality = mime.startsWith("video/")
            ? "video"
            : "audio";
          return !activeModel.inputs.includes(modality);
        });

        if (!hasImages && !hasFiles) {
          return msg;
        }

        // Find the ChatMessage that corresponds to this ModelMessage.
        // Primary path: if this is the last user message and currentUserMessageId
        // is provided, use it directly - avoids fragile content-based lookup.
        // Fallback: match by text content (heuristic for historical messages).
        let chatMsg: ChatMessage | undefined;
        if (msgIndex === lastUserMsgIndex && currentUserMessageId) {
          chatMsg = chatHistoryById.get(currentUserMessageId);
          if (!chatMsg) {
            // The current user message may not be in chatHistoryById (e.g. it was
            // added to messages but not to chatHistory). Build a minimal stub so
            // emitGapFillCompleted can write the variant to the correct DB row.
            chatMsg = { id: currentUserMessageId } as ChatMessage;
          }
        } else {
          const textPart = parts.find((p) => p.type === "text");
          const msgText =
            textPart && "text" in textPart ? String(textPart.text) : "";
          chatMsg = [...chatHistoryById.values()].find(
            (m) => m.content === msgText || msgText.startsWith(m.content ?? ""),
          );
        }

        // Replace each unsupported attachment part with text variant - in parallel
        const newParts = await Promise.all(
          parts.map(async (part) => {
            if (part.type === "image") {
              if (activeModel.inputs.includes("image")) {
                return part;
              }
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
              return variantText
                ? { type: "text" as const, text: variantText }
                : {
                    type: "text" as const,
                    text: `[image attachment: could not be processed - no vision bridge model configured. Inform the user they can add one in favorite settings.]`,
                  };
            }

            if (part.type === "file") {
              const mime =
                "mediaType" in part && typeof part.mediaType === "string"
                  ? part.mediaType
                  : "";
              const modality: Modality = mime.startsWith("video/")
                ? "video"
                : "audio";
              if (activeModel.inputs.includes(modality)) {
                return part;
              }
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
              return variantText
                ? { type: "text" as const, text: variantText }
                : {
                    type: "text" as const,
                    text: `[${modality} attachment: could not be processed - no ${modality === "video" ? "video vision" : "STT"} bridge model configured. Inform the user they can add one in favorite settings.]`,
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
      IMAGE_GEN_ALIAS,
      VIDEO_GEN_TOOL_NAME,
      AUDIO_GEN_TOOL_NAME,
    ] as const;
    type MediaToolName = (typeof MEDIA_TOOL_NAMES)[number];

    // Build a lookup from toolCallId → ChatMessage.id for event emission
    const toolCallIdToChatMessageId = new Map<string, string>();
    for (const chatMsg of chatHistory) {
      const tc = chatMsg.metadata?.toolCall;
      if (tc && "toolCallId" in tc && typeof tc.toolCallId === "string") {
        toolCallIdToChatMessageId.set(tc.toolCallId, chatMsg.id);
      }
    }

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
              imageUrl?: string;
              videoUrl?: string;
              audioUrl?: string;
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

            // Normalize: FilePartHandler stores { file }, real tool APIs store { imageUrl/videoUrl/audioUrl }
            const fileUrl =
              typeof outputValue.file === "string"
                ? outputValue.file
                : typeof outputValue.imageUrl === "string"
                  ? outputValue.imageUrl
                  : typeof outputValue.videoUrl === "string"
                    ? outputValue.videoUrl
                    : typeof outputValue.audioUrl === "string"
                      ? outputValue.audioUrl
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

            // Check if model can see this modality - if it can, it doesn't need text
            const modality: Modality =
              p.toolName === IMAGE_GEN_ALIAS
                ? "image"
                : p.toolName === VIDEO_GEN_TOOL_NAME
                  ? "video"
                  : "audio";
            if (activeModel.inputs.includes(modality)) {
              return part;
            }

            // Resolve chatMessageId for event emission
            const chatMessageId =
              "toolCallId" in p && typeof p.toolCallId === "string"
                ? (toolCallIdToChatMessageId.get(p.toolCallId) ?? null)
                : null;

            logger.debug(
              `[GapFill] Bridging null-text ${modality} tool result via vision`,
              {
                fileUrl: fileUrl.slice(0, 80),
                chatMessageId,
              },
            );

            const description = await GapFillExecutor.bridgeMediaUrl({
              mediaUrl: fileUrl,
              modality,
              chatMessageId,
              bridgeContext,
              dbWriter,
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
    const mime =
      !isImage && "mediaType" in part && typeof part.mediaType === "string"
        ? part.mediaType
        : "";
    const isVideo = !isImage && mime.startsWith("video/");

    const bridgeType: "stt" | "vision" | "translation" | "tts" = isImage
      ? "vision"
      : isVideo
        ? "vision"
        : "stt";
    const modality: Modality = isImage ? "image" : isVideo ? "video" : "audio";

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

    if (isVideo) {
      // Video file → video vision bridge
      return GapFillExecutor.bridgeVideoFilePart({
        part: part as FilePart,
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

    // Audio file → audio-vision bridge
    return GapFillExecutor.bridgeStt({
      part: part as FilePart,
      chatMessageId,
      bridgeContext,
      dbWriter,
      abortSignal: params.abortSignal,
      logger,
      user,
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
      modality,
      bridgeType,
    } = params;

    const visionModel = ModalityResolver.resolveImageVisionModel(
      bridgeContext,
      user,
    );

    if (!visionModel) {
      logger.warn(
        "[GapFill] No image vision model configured, skipping image bridge",
        { modality },
      );
      return null;
    }

    // Get the correct provider for the vision model (not the active model's provider)
    const visionProvider = ProviderFactory.getProviderForModel(
      visionModel,
      logger,
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
      const creditCost = calculateCreditCost(
        visionModel,
        result.usage.inputTokens ?? 0,
        result.usage.outputTokens ?? 0,
      );

      if (chatMessageId && description) {
        const variant = {
          modality: "text" as Modality,
          content: description,
          modelId: visionModel.id,
          creditCost,
          createdAt: new Date().toISOString(),
        };

        await dbWriter.emitGapFillCompleted({
          messageId: chatMessageId,
          bridgeType,
          modality,
          variant,
        });

        // Deduct credits for the vision bridge call
        if (creditCost > 0) {
          await dbWriter.deductAndEmitCredits({
            user,
            amount: creditCost,
            feature: `vision-bridge:${visionModel.id}`,
            type: "model",
            model: visionModel.id,
          });
        }
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
    abortSignal: AbortSignal;
    logger: EndpointLogger;
    user: JwtPayloadType;
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
      modality,
      bridgeType,
    } = params;

    // Audio attachment bridging uses audio-vision LLM only (e.g. Gemini).
    // Dedicated STT models (Whisper, Deepgram) are reserved for the voice UI
    // transcription flow, not for gap-filling audio file attachments.
    const audioVisionModel = ModalityResolver.resolveAudioVisionModel(
      bridgeContext,
      user,
    );
    if (!audioVisionModel) {
      logger.warn(
        "[GapFill] No audio-vision model configured, skipping audio bridge",
        { modality },
      );
      return null;
    }

    const audioVisionProvider = ProviderFactory.getProviderForModel(
      audioVisionModel,
      logger,
    );

    try {
      const mimeType =
        "mediaType" in part && part.mediaType
          ? String(part.mediaType)
          : "audio/webm";

      let fileData: FilePart;
      if ("data" in part && part.data) {
        fileData = {
          type: "file" as const,
          data: part.data,
          mediaType: mimeType as `audio/${string}`,
        };
      } else if ("url" in part && part.url) {
        fileData = {
          type: "file" as const,
          data: new URL(String(part.url)),
          mediaType: mimeType as `audio/${string}`,
        };
      } else {
        logger.warn(
          "[GapFill] Audio FilePart has no data or url, skipping audio-vision bridge",
        );
        return null;
      }

      const result = await aiGenerateText({
        model: audioVisionProvider.chat(
          audioVisionModel.providerModel,
        ) as LanguageModel,
        abortSignal: params.abortSignal,
        messages: [
          {
            role: "user" as const,
            content: [
              fileData,
              {
                type: "text" as const,
                text: "Describe what you hear in this audio file in 1-3 sentences. If it contains speech, transcribe the spoken words. If it contains music, describe the instruments, genre, and mood. Be specific and concise.",
              },
            ],
          },
        ],
      });

      const transcript = result.text.trim();
      const creditCost = calculateCreditCost(
        audioVisionModel,
        result.usage.inputTokens ?? 0,
        result.usage.outputTokens ?? 0,
      );

      if (chatMessageId && transcript) {
        const variant = {
          modality: "text" as Modality,
          content: transcript,
          modelId: audioVisionModel.id,
          creditCost,
          createdAt: new Date().toISOString(),
        };

        await dbWriter.emitGapFillCompleted({
          messageId: chatMessageId,
          bridgeType,
          modality,
          variant,
        });

        if (creditCost > 0) {
          await dbWriter.deductAndEmitCredits({
            user,
            amount: creditCost,
            feature: `audio-vision-bridge:${audioVisionModel.id}`,
            type: "model",
            model: audioVisionModel.id,
          });
        }
      }

      return transcript || null;
    } catch (err) {
      logger.warn("[GapFill] Audio-vision LLM bridge call failed", {
        error: err instanceof Error ? err.message : String(err),
        modality,
        bridgeType,
      });
      return null;
    }
  }

  /**
   * Bridge a raw video file part to a text description via the video vision model.
   * Used when a user uploads a video file and the active model can't see video.
   */
  private static async bridgeVideoFilePart(params: {
    part: FilePart;
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
      modality,
      bridgeType,
    } = params;

    const videoVisionModel = ModalityResolver.resolveVideoVisionModel(
      bridgeContext,
      user,
    );

    if (!videoVisionModel) {
      logger.warn(
        "[GapFill] No video vision model configured, skipping video bridge",
        { modality },
      );
      return null;
    }

    const videoVisionProvider = ProviderFactory.getProviderForModel(
      videoVisionModel,
      logger,
    );

    try {
      // Build file part - pass data or URL depending on what's available
      let fileData: FilePart;
      if ("data" in part && part.data) {
        fileData = {
          type: "file" as const,
          data: part.data,
          mediaType:
            "mediaType" in part && part.mediaType
              ? (part.mediaType as `video/${string}`)
              : "video/mp4",
        };
      } else if ("url" in part && part.url) {
        fileData = {
          type: "file" as const,
          data: new URL(String(part.url)),
          mediaType:
            "mediaType" in part && part.mediaType
              ? (part.mediaType as `video/${string}`)
              : "video/mp4",
        };
      } else {
        logger.warn("[GapFill] Video FilePart has no data or url, skipping");
        return null;
      }

      const result = await aiGenerateText({
        model: videoVisionProvider.chat(
          videoVisionModel.providerModel,
        ) as LanguageModel,
        abortSignal: params.abortSignal,
        messages: [
          {
            role: "user" as const,
            content: [
              fileData,
              {
                type: "text" as const,
                text: "Describe this video in detail. Include the visual content, actions, scene, style, any text visible, and any notable elements. This description will be used by another AI model that cannot see video.",
              },
            ],
          },
        ],
      });

      const description = result.text.trim();
      const creditCost = calculateCreditCost(
        videoVisionModel,
        result.usage.inputTokens ?? 0,
        result.usage.outputTokens ?? 0,
      );

      if (chatMessageId && description) {
        const variant = {
          modality: "text" as Modality,
          content: description,
          modelId: videoVisionModel.id,
          creditCost,
          createdAt: new Date().toISOString(),
        };

        await dbWriter.emitGapFillCompleted({
          messageId: chatMessageId,
          bridgeType,
          modality,
          variant,
        });

        if (creditCost > 0) {
          await dbWriter.deductAndEmitCredits({
            user,
            amount: creditCost,
            feature: `video-vision-bridge:${videoVisionModel.id}`,
            type: "model",
            model: videoVisionModel.id,
          });
        }
      }

      return description || null;
    } catch (err) {
      logger.warn("[GapFill] Video vision bridge call failed", {
        error: err instanceof Error ? err.message : String(err),
        modality,
        bridgeType,
      });
      return null;
    }
  }

  /**
   * Bridge a media URL to a text description via the appropriate vision bridge model.
   * Used when a media tool result has a null text field and the active model can't see that modality.
   */
  private static async bridgeMediaUrl(params: {
    mediaUrl: string;
    modality: Modality;
    chatMessageId: string | null;
    bridgeContext: BridgeContext;
    dbWriter: MessageDbWriter;
    abortSignal: AbortSignal;
    logger: EndpointLogger;
    user: JwtPayloadType;
    locale: CountryLanguage;
  }): Promise<string | null> {
    const {
      mediaUrl,
      modality,
      chatMessageId,
      bridgeContext,
      dbWriter,
      abortSignal,
      logger,
      user,
    } = params;

    // Pick the correct vision model resolver per modality
    const visionModel =
      modality === "video"
        ? ModalityResolver.resolveVideoVisionModel(bridgeContext, user)
        : modality === "audio"
          ? ModalityResolver.resolveAudioVisionModel(bridgeContext, user)
          : ModalityResolver.resolveImageVisionModel(bridgeContext, user);

    if (!visionModel) {
      logger.warn("[GapFill] No vision model configured for media URL bridge", {
        modality,
      });
      return null;
    }

    const visionProvider = ProviderFactory.getProviderForModel(
      visionModel,
      logger,
    );

    const promptText =
      modality === "image"
        ? "Describe this generated image in detail. Include subject, style, colors, composition, and any notable elements. This description will be shown to another AI model that cannot see images."
        : modality === "video"
          ? "Describe this video in detail. Include the visual content, actions, scene, style, and any notable elements. This description will be shown to another AI model that cannot see video."
          : "Describe this audio in detail. Include the content, instruments, mood, tempo, and any notable elements. This description will be shown to another AI model that cannot hear audio.";

    // Build content parts per modality - separate paths for correct typing
    const contentParts: ImagePart | FilePart =
      modality === "image"
        ? { type: "image" as const, image: new URL(mediaUrl) }
        : {
            type: "file" as const,
            data: new URL(mediaUrl),
            mediaType: modality === "video" ? "video/mp4" : "audio/mpeg",
          };

    // Emit GAP_FILL_STARTED so the frontend can show a status indicator
    if (chatMessageId) {
      dbWriter.emitGapFillStarted({
        messageId: chatMessageId,
        bridgeType: "vision",
        modality,
      });
    }

    try {
      const result = await aiGenerateText({
        model: visionProvider.chat(visionModel.providerModel) as LanguageModel,
        abortSignal,
        messages: [
          {
            role: "user" as const,
            content: [
              contentParts,
              { type: "text" as const, text: promptText },
            ],
          },
        ],
      });

      // Deduct credits for the vision bridge call using actual token usage
      const creditCost = calculateCreditCost(
        visionModel,
        result.usage.inputTokens ?? 0,
        result.usage.outputTokens ?? 0,
      );
      if (creditCost > 0) {
        await dbWriter.deductAndEmitCredits({
          user,
          amount: creditCost,
          feature: `vision-bridge:${visionModel.id}`,
          type: "model",
          model: visionModel.id,
        });
      }

      const description = result.text.trim();

      // Emit GAP_FILL_COMPLETED + persist variant to DB
      if (chatMessageId && description) {
        const variant = {
          modality: "text" as Modality,
          content: description,
          modelId: visionModel.id,
          creditCost,
          createdAt: new Date().toISOString(),
        };

        await dbWriter.emitGapFillCompleted({
          messageId: chatMessageId,
          bridgeType: "vision",
          modality,
          variant,
        });
      }

      return description || null;
    } catch (err) {
      logger.warn(
        `[GapFill] ${modality} vision bridge for tool result failed`,
        {
          error: err instanceof Error ? err.message : String(err),
          mediaUrl: mediaUrl.slice(0, 80),
        },
      );
      return null;
    }
  }
}
