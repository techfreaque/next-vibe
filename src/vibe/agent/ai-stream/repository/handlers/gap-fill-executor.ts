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
  ModelMessage,
  TextPart,
  ToolResultPart,
} from "ai";
import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import { getInstanceAvailability } from "next-vibe/agent/env-availability";
import { IMAGE_GEN_ALIAS } from "next-vibe/agent/image-generation/constants";
import type { Modality } from "next-vibe/agent/models/enum";
import { AUDIO_GEN_TOOL_NAME } from "next-vibe/agent/music-generation/constants";
import { VIDEO_GEN_TOOL_NAME } from "next-vibe/agent/video-generation/constants";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ChatMessage } from "../../../chat/db";
import type { ChatModelOption } from "../../models";
import { reserveFixtureOrdinals } from "../../testing/fetch-cache";
import type { MessageDbWriter } from "../core/message-db-writer";
import type { BridgeContext } from "../core/modality-resolver";
import { BridgeCall } from "./bridge-call";

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
    /** Fixture chain of the owning stream — vision-bridge model calls bind it. */
    toolExecutionContext: ToolExecutionContext;
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

    const availability = await getInstanceAvailability();

    // Invariant bridge-call context — shared by every attachment bridge below.
    const bridge = {
      bridgeContext,
      dbWriter,
      abortSignal,
      logger,
      user,
      locale,
      availability,
      toolExecutionContext: params.toolExecutionContext,
    };

    // ── Deterministic fixture ordinals for the parallel fan-out ─────────────
    // Every bridge call below fires inside Promise.all (kept for prod/dev
    // throughput), so the ORDER in which their fetches hit the fixture engine
    // is nondeterministic. We therefore enumerate the bridge jobs in a STABLE
    // order (message index, then part index), reserve one fixture ordinal per
    // job UP FRONT, and hand each racing call its own pinned ordinal via a
    // cloned toolExecutionContext. No-op outside a fixture run (reserve returns []).
    const bridgeKeys = GapFillExecutor.planBridgeKeys(messages, activeModel);
    const reserved =
      bridge.toolExecutionContext?.threadId && bridgeKeys.length > 0
        ? await reserveFixtureOrdinals(
            bridge.toolExecutionContext.threadId,
            bridgeKeys.length,
          )
        : [];
    const ordinalByKey = new Map<string, number>();
    bridgeKeys.forEach((k, i) => {
      const ord = reserved[i];
      if (ord !== undefined) {
        ordinalByKey.set(k, ord);
      }
    });
    // Clone the shared bridge context, pinning the fixture ordinal for one call.
    const pinBridge = (key: string): typeof bridge => {
      const ord = ordinalByKey.get(key);
      if (ord === undefined || !bridge.toolExecutionContext) {
        return bridge;
      }
      return {
        ...bridge,
        toolExecutionContext: {
          ...bridge.toolExecutionContext,
          fixtureOrdinal: ord,
        },
      };
    };

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

        // Replace each unsupported attachment part with text variant - in
        // parallel. Each bridge call takes its pre-reserved ordinal via a
        // pinned context keyed by its STABLE (msgIndex:partIndex) coordinate.
        const newParts = await Promise.all(
          parts.map(async (part, partIndex) => {
            if (part.type === "image") {
              if (activeModel.inputs.includes("image")) {
                return part;
              }
              return GapFillExecutor.bridgeToTextPart({
                part,
                chatMessageId: chatMsg?.id ?? null,
                label: "image",
                descriptor: "vision",
                failDescriptor: "vision bridge",
                bridge: pinBridge(`p1:${msgIndex}:${partIndex}`),
              });
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
              return GapFillExecutor.bridgeToTextPart({
                part,
                chatMessageId: chatMsg?.id ?? null,
                label: modality,
                descriptor: modality === "video" ? "vision" : "audio",
                failDescriptor: modality === "video" ? "video vision" : "STT",
                bridge: pinBridge(`p1:${msgIndex}:${partIndex}`),
              });
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

    // Reserve Pass-2 ordinals in stable order (after all Pass-1 ordinals), same
    // deterministic-parallel-fan-out treatment as Pass 1. Enumerate first so the
    // reservation order matches the calls that actually fire.
    const p2Keys = GapFillExecutor.planToolResultKeys(
      updated,
      activeModel,
      MEDIA_TOOL_NAMES,
    );
    const p2Reserved =
      bridge.toolExecutionContext?.threadId && p2Keys.length > 0
        ? await reserveFixtureOrdinals(
            bridge.toolExecutionContext.threadId,
            p2Keys.length,
          )
        : [];
    p2Keys.forEach((k, i) => {
      const ord = p2Reserved[i];
      if (ord !== undefined) {
        ordinalByKey.set(k, ord);
      }
    });

    const updatedWithToolResults = await Promise.all(
      updated.map(async (msg, msgIndex): Promise<ModelMessage> => {
        if (msg.role !== "tool" || !Array.isArray(msg.content)) {
          return msg;
        }

        const newContent = await Promise.all(
          msg.content.map(async (part, partIndex): Promise<typeof part> => {
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

            const description = await BridgeCall.bridgeMediaUrl({
              mediaUrl: fileUrl,
              modality,
              chatMessageId,
              ...pinBridge(`p2:${msgIndex}:${partIndex}`),
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

  /**
   * Bridge one unsupported attachment part to a text description and wrap it in
   * an explicitly-framed text part (so the model treats it as the attachment,
   * not the user's own prose). Falls back to a "could not be processed" notice
   * when no bridge model is configured. Shared by the image and file branches.
   */
  private static async bridgeToTextPart(args: {
    part: ImagePart | FilePart;
    chatMessageId: string | null;
    /** Attachment noun shown to the model (e.g. "image", "video", "audio"). */
    label: string;
    /** Kind of description produced (e.g. "vision", "audio"). */
    descriptor: string;
    /** Missing-model wording (e.g. "vision bridge", "video vision", "STT"). */
    failDescriptor: string;
    bridge: Omit<
      Parameters<typeof BridgeCall.bridgeAttachment>[0],
      "part" | "chatMessageId"
    >;
  }): Promise<TextPart> {
    const variantText = await BridgeCall.bridgeAttachment({
      part: args.part,
      chatMessageId: args.chatMessageId,
      ...args.bridge,
    });
    return {
      type: "text" as const,
      text: variantText
        ? `[${args.label} attachment - system-injected ${args.descriptor} description (you cannot see the raw file)]:\n${variantText}`
        : `[${args.label} attachment: could not be processed - no ${args.failDescriptor} model configured. Inform the user they can add one in favorite settings.]`,
    };
  }

  /**
   * Enumerate the Pass-1 attachment bridge jobs in STABLE order (message index,
   * then part index), producing one `p1:<msgIndex>:<partIndex>` key per job.
   * MUST mirror the exact conditions of the Pass-1 parallel map so the reserved
   * fixture ordinals line up with the calls that actually fire.
   */
  private static planBridgeKeys(
    messages: ModelMessage[],
    activeModel: ChatModelOption,
  ): string[] {
    const keys: string[] = [];
    messages.forEach((msg, msgIndex) => {
      if (msg.role !== "user" || !Array.isArray(msg.content)) {
        return;
      }
      msg.content.forEach((part, partIndex) => {
        if (part.type === "image") {
          if (!activeModel.inputs.includes("image")) {
            keys.push(`p1:${msgIndex}:${partIndex}`);
          }
          return;
        }
        if (part.type === "file") {
          const mime =
            "mediaType" in part && typeof part.mediaType === "string"
              ? part.mediaType
              : "";
          const modality: Modality = mime.startsWith("video/")
            ? "video"
            : "audio";
          if (!activeModel.inputs.includes(modality)) {
            keys.push(`p1:${msgIndex}:${partIndex}`);
          }
        }
      });
    });
    return keys;
  }

  /**
   * Enumerate the Pass-2 tool-result media bridge jobs in STABLE order. MUST
   * mirror the exact firing conditions of the Pass-2 map (media tool, no
   * existing text, a resolvable file URL, and a modality the active model
   * cannot see) so the reserved ordinals line up with the calls that fire.
   */
  private static planToolResultKeys(
    messages: ModelMessage[],
    activeModel: ChatModelOption,
    mediaToolNames: readonly string[],
  ): string[] {
    const keys: string[] = [];
    messages.forEach((msg, msgIndex) => {
      if (msg.role !== "tool" || !Array.isArray(msg.content)) {
        return;
      }
      msg.content.forEach((part, partIndex) => {
        const p = part as ToolResultPart;
        if (p.type !== "tool-result" || !mediaToolNames.includes(p.toolName)) {
          return;
        }
        interface MediaOutputValue {
          file?: string;
          imageUrl?: string;
          videoUrl?: string;
          audioUrl?: string;
          text?: string | null;
        }
        interface MediaOutput {
          value?: MediaOutputValue;
        }
        const v = (p.output as MediaOutput | undefined)?.value;
        if (!v || typeof v !== "object") {
          return;
        }
        const fileUrl =
          typeof v.file === "string"
            ? v.file
            : typeof v.imageUrl === "string"
              ? v.imageUrl
              : typeof v.videoUrl === "string"
                ? v.videoUrl
                : typeof v.audioUrl === "string"
                  ? v.audioUrl
                  : undefined;
        const existingText = typeof v.text === "string" ? v.text : null;
        if (existingText && existingText.trim().length > 0) {
          return;
        }
        if (!fileUrl) {
          return;
        }
        const modality: Modality =
          p.toolName === IMAGE_GEN_ALIAS
            ? "image"
            : p.toolName === VIDEO_GEN_TOOL_NAME
              ? "video"
              : "audio";
        if (activeModel.inputs.includes(modality)) {
          return;
        }
        keys.push(`p2:${msgIndex}:${partIndex}`);
      });
    });
    return keys;
  }
}
