/**
 * MessageConverter - Converts ChatMessage to AI SDK format
 */

import "server-only";

import type { ModelMessage, ToolCallPart, ToolResultPart } from "ai";

import { IMAGE_GEN_ALIAS } from "@/app/api/[locale]/agent/image-generation/constants";
import type { Modality } from "@/app/api/[locale]/agent/models/enum";
import { AUDIO_GEN_TOOL_NAME } from "@/app/api/[locale]/agent/music-generation/constants";
import { VIDEO_GEN_TOOL_NAME } from "@/app/api/[locale]/agent/video-generation/constants";
import type {
  ContentBlock,
  ErrorResponseType,
} from "@/app/api/[locale]/shared/types/response.schema";
import { parseError } from "@/app/api/[locale]/shared/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { extractDocumentText, isDocumentMimeType } from "./document-extractor";

import type { DefaultFolderId } from "../../../chat/config";
import type { ChatMessage, ToolCallResult } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import type { ChatModelOption } from "../../models";
import { createMetadataSystemMessage } from "../system-prompt/message-metadata";

export class MessageConverter {
  /**
   * Type guard to check if a message is a full ChatMessage (not a simple role/content object)
   */
  private static isChatMessage(
    message: ChatMessage | { role: ChatMessageRole; content: string },
  ): message is ChatMessage {
    return "id" in message && "createdAt" in message;
  }

  /**
   * Convert ChatMessageRole enum to AI SDK compatible role
   * Converts TOOL messages to proper AI SDK tool result format
   * Converts ERROR -> ASSISTANT (so errors stay in chain)
   * Returns an array when a single DB message needs to be expanded into multiple AI SDK messages (e.g., tool-call + tool-result)
   */
  static async toAiSdkMessage(
    message: ChatMessage | { role: ChatMessageRole; content: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
    modelConfig?: ChatModelOption,
  ): Promise<ModelMessage | ModelMessage[] | null> {
    switch (message.role) {
      case ChatMessageRole.USER: {
        // IMPORTANT: Always use array format for user messages for cache stability
        // When cache_control is added via providerOptions, AI SDK transforms string content
        // to array format. Using array format consistently ensures the message structure
        // is identical between first request and history.
        const contentParts: Array<
          | { type: "text"; text: string }
          | { type: "image"; image: string | URL }
          | { type: "file"; data: Uint8Array; mediaType: string }
        > = [];

        // Add text content if present
        if (message.content) {
          contentParts.push({ type: "text", text: message.content });
        }

        // Check if message has attachments
        if (
          "metadata" in message &&
          message.metadata?.attachments &&
          message.metadata.attachments.length > 0
        ) {
          // Add attachments
          for (const attachment of message.metadata.attachments) {
            // Get base64 data - either from attachment.data or from URL
            let base64Data: string | null = null;

            if ("data" in attachment && attachment.data) {
              // First message: has base64 data directly
              base64Data = attachment.data;
            } else if (attachment.url) {
              // Message from history: fetch from URL and convert to base64
              try {
                const response = await fetch(attachment.url);
                if (response.ok) {
                  const buffer = await response.arrayBuffer();
                  base64Data = Buffer.from(buffer).toString("base64");
                }
              } catch (error) {
                logger.error(
                  "[MessageConverter] Failed to fetch attachment for AI context",
                  {
                    attachmentId: attachment.id,
                    filename: attachment.filename,
                    error: parseError(error),
                  },
                );
              }
            }

            if (base64Data) {
              if (attachment.mimeType.startsWith("image/")) {
                // Images: Add as image part
                contentParts.push({
                  type: "image",
                  image: `data:${attachment.mimeType};base64,${base64Data}`,
                });
              } else if (
                attachment.mimeType.startsWith("text/") ||
                attachment.mimeType === "application/json" ||
                attachment.mimeType === "application/xml"
              ) {
                // Text files: Decode and add as text part
                try {
                  const decoded = Buffer.from(base64Data, "base64").toString(
                    "utf-8",
                  );
                  contentParts.push({
                    type: "text",
                    text: `\n\n[File: ${attachment.filename}]\n${decoded}\n[End of file]`,
                  });
                } catch (error) {
                  logger.error(
                    "[MessageConverter] Failed to decode attachment for AI context",
                    parseError(error),
                    {
                      attachmentId: attachment.id,
                      filename: attachment.filename,
                    },
                  );
                }
              } else if (
                attachment.mimeType.startsWith("audio/") ||
                attachment.mimeType.startsWith("video/")
              ) {
                // Audio/video: pass as FilePart (Uint8Array) so models that support it can process it
                contentParts.push({
                  type: "file",
                  data: Buffer.from(base64Data, "base64"),
                  mediaType: attachment.mimeType,
                });
              } else if (isDocumentMimeType(attachment.mimeType)) {
                // Documents (PDF, DOCX, XLSX): Extract text content
                try {
                  const docBuffer = Buffer.from(base64Data, "base64");
                  const extracted = await extractDocumentText(
                    docBuffer,
                    attachment.mimeType,
                    logger,
                  );
                  if (extracted) {
                    contentParts.push({
                      type: "text",
                      text: `\n\n[File: ${attachment.filename}]\n${extracted}\n[End of file]`,
                    });
                  } else {
                    logger.warn(
                      "[MessageConverter] No text extracted from document",
                      {
                        attachmentId: attachment.id,
                        filename: attachment.filename,
                        mimeType: attachment.mimeType,
                      },
                    );
                  }
                } catch (error) {
                  logger.error(
                    "[MessageConverter] Failed to extract document text",
                    parseError(error),
                    {
                      attachmentId: attachment.id,
                      filename: attachment.filename,
                    },
                  );
                }
              }
            }
          }
        }

        // Return array format (even for text-only messages for consistency)
        // NOTE: We return the raw array here. cache_control is added later in toAiSdkMessages
        // by directly embedding it in the last text part (not via providerOptions) to ensure
        // consistent format between current messages and history messages.
        return { content: contentParts, role: "user" };
      }
      case ChatMessageRole.ASSISTANT: {
        const assistantParts: Array<
          | { type: "text"; text: string }
          | { type: "file"; data: string; mediaType: string }
        > = [];

        // Add text content - strip <think> blocks (kept in DB for UI but must
        // not be re-sent to AI as part of history).
        if (message.content?.trim()) {
          const strippedContent = message.content
            .replace(/<think>[\s\S]*?<\/think>/g, "")
            .replace(/<think>[\s\S]*$/i, "")
            .replace(/<\/think>/gi, "")
            .trim();
          if (strippedContent) {
            assistantParts.push({ type: "text", text: strippedContent });
          }
        }

        // Add generated image so the model can see its own previous output.
        // Fetch + base64 encode (same pattern as user attachments) for reliability
        // across providers that may not accept raw CDN URLs.
        const generatedMedia =
          "metadata" in message ? message.metadata?.generatedMedia : undefined;
        if (generatedMedia?.url && generatedMedia.type === "image") {
          try {
            const response = await fetch(generatedMedia.url);
            if (response.ok) {
              const buffer = await response.arrayBuffer();
              const base64Data = Buffer.from(buffer).toString("base64");
              const mimeType = generatedMedia.mimeType ?? "image/png";
              assistantParts.push({
                type: "file",
                data: base64Data,
                mediaType: mimeType,
              });
            }
          } catch (error) {
            logger.error(
              "[MessageConverter] Failed to fetch generated image for AI context",
              { url: generatedMedia.url, error: parseError(error) },
            );
          }
        }

        if (assistantParts.length === 0) {
          return null;
        }
        // Preserve string format for text-only to avoid unnecessary format changes
        // that could affect prompt caching. Use array only when images are present.
        if (assistantParts.length === 1 && assistantParts[0]?.type === "text") {
          return { content: assistantParts[0].text, role: "assistant" };
        }
        return { content: assistantParts, role: "assistant" };
      }
      case ChatMessageRole.SYSTEM:
        return { content: message.content ?? "", role: "system" };
      case ChatMessageRole.TOOL:
        // Convert TOOL messages to proper AI SDK format
        if ("metadata" in message && message.metadata?.toolCall) {
          const toolCall = message.metadata.toolCall;
          // Debug: log tool result hash for cache analysis
          const resultHash = toolCall.result
            ? Buffer.from(JSON.stringify(toolCall.result))
                .toString("base64")
                .slice(0, 20)
            : "no-result";
          logger.debug("[CACHE DEBUG] Tool message conversion", {
            toolCallId: toolCall.toolCallId,
            toolName: toolCall.toolName,
            resultHash,
            resultLength: toolCall.result
              ? JSON.stringify(toolCall.result).length
              : 0,
          });

          // Always return BOTH: ASSISTANT with tool-call AND TOOL with tool-result.
          // Tools awaiting confirmation have no result/error yet - emit the
          // waiting_for_confirmation status as a placeholder result so the AI SDK
          // never sees a tool-call without a matching tool-result.
          const output = toolCall.error
            ? {
                type: "error-text" as const,
                value: MessageConverter.translateErrorRecursive(
                  toolCall.error,
                  locale,
                ),
              }
            : toolCall.result
              ? MessageConverter.buildToolResultOutput(
                  toolCall.result,
                  toolCall.toolName,
                  modelConfig,
                )
              : toolCall.waitingForConfirmation
                ? {
                    type: "json" as const,
                    value: {
                      status: "waiting_for_confirmation",
                      toolName: toolCall.toolName,
                    },
                  }
                : toolCall.callbackMode === "wakeUp"
                  ? {
                      type: "json" as const,
                      value: {
                        status: "pending",
                        hint: "Result will be injected into this thread when ready. Do NOT call this tool again.",
                      },
                    }
                  : {
                      // Fallback: tool call has no result yet (e.g. detach goroutine hasn't
                      // completed when a parallel wakeUp revival fires). Always emit a placeholder
                      // so the AI SDK never sees a tool-call without a matching tool-result.
                      type: "json" as const,
                      value: {
                        status: "pending",
                        hint: "Result not yet available.",
                      },
                    };

          if (output !== null) {
            return [
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId: toolCall.toolCallId,
                    toolName: toolCall.toolName,
                    input: toolCall.args,
                  },
                ],
              },
              {
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolCallId: toolCall.toolCallId,
                    toolName: toolCall.toolName,
                    output,
                  },
                ],
              },
            ];
          }
          // No result, no error, not waiting - tool-call only (shouldn't normally happen)
          return {
            role: "assistant",
            content: [
              {
                type: "tool-call",
                toolCallId: toolCall.toolCallId,
                toolName: toolCall.toolName,
                input: toolCall.args,
              },
            ],
          };
        }
        // Skip TOOL messages without toolCall metadata
        logger.error(
          "[MessageConverter] TOOL message without toolCall metadata",
          {
            messageId: MessageConverter.isChatMessage(message)
              ? message.id
              : "unknown",
          },
        );
        return null;
      case ChatMessageRole.ERROR: {
        // ERROR messages contain serialized MessageResponseType
        if (!message.content) {
          return {
            content: "",
            role: "assistant",
          };
        }

        // Quick check: if it doesn't look like JSON, skip parsing
        const trimmedContent = message.content.trim();
        if (!trimmedContent.startsWith("{")) {
          // Plain text error message (e.g. "Generation was stopped...")
          return {
            content: message.content,
            role: "assistant",
          };
        }

        try {
          const errorData = JSON.parse(message.content) as ErrorResponseType;

          return {
            content: MessageConverter.translateErrorRecursive(
              errorData,
              locale,
            ),
            role: "assistant",
          };
        } catch (error) {
          logger.error(
            "[MessageConverter] Failed to deserialize error message",
            {
              error: parseError(error),
              content: message.content,
            },
          );
          return {
            content: message.content,
            role: "assistant",
          };
        }
      }
    }
  }

  /**
   * Convert array of ChatMessages to AI SDK format
   * Properly handles multiple consecutive TOOL messages by combining them into a single assistant message
   * Adds cache_control to enable Anthropic prompt caching via OpenRouter
   */
  static async toAiSdkMessages(
    messages: ChatMessage[],
    logger: EndpointLogger,
    timezone: string,
    rootFolderId: DefaultFolderId,
    locale: CountryLanguage,
    modelConfig?: ChatModelOption,
  ): Promise<ModelMessage[]> {
    const result: ModelMessage[] = [];

    // Track sequenceIds for which we have already emitted a metadata system message.
    // Each logical AI turn shares a sequenceId across its placeholder ASSISTANT + TOOL chain.
    // We only emit one [Context:] system message per sequenceId so sequential tool calls
    // that share a sequenceId don't produce redundant system messages between each pair.
    const emittedMetadataSequenceIds = new Set<string>();

    // Pre-pass: collect toolCallIds that have been superseded by a deferred result message.
    // When a background/wakeUp result arrives, a deferred TOOL message is inserted with
    // originalToolCallId pointing back to the original call. The original must be
    // suppressed from AI context so the AI sees the deferred result as authoritative.
    const supersededToolCallIds = new Set<string>();
    for (const msg of messages) {
      if (
        msg.role === ChatMessageRole.TOOL &&
        "metadata" in msg &&
        msg.metadata?.toolCall?.originalToolCallId &&
        msg.metadata.toolCall.isDeferred
      ) {
        supersededToolCallIds.add(msg.metadata.toolCall.originalToolCallId);
      }
    }

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];

      // Check if this is the start of a TOOL message sequence (multiple consecutive tool calls)
      if (
        msg.role === ChatMessageRole.TOOL &&
        "metadata" in msg &&
        msg.metadata?.toolCall
      ) {
        // Look ahead to find all TOOL messages in this step.
        // Empty placeholder ASSISTANT messages (no content) between tools do NOT
        // break the group - they are just DB artifacts from sequential tool calls.
        // Non-empty ASSISTANT messages are also skipped when all tools seen so far
        // are superseded - this handles the wakeUp case where the AI emits a
        // "dispatched" response after the pending tool, before the deferred result.
        // A group ends at: a USER message, or an ASSISTANT with text when we already
        // have at least one non-superseded tool.
        const toolMessages: ChatMessage[] = [msg];
        let j = i + 1;
        while (j < messages.length) {
          const next = messages[j];
          if (
            next?.role === ChatMessageRole.TOOL &&
            "metadata" in next &&
            next.metadata?.toolCall
          ) {
            // Another tool message - add to group
            toolMessages.push(next);
            j++;
          } else if (
            next?.role === ChatMessageRole.ASSISTANT &&
            (!next.content || !next.content.trim())
          ) {
            // Empty placeholder ASSISTANT - skip over it (don't add to toolMessages)
            j++;
          } else if (
            next?.role === ChatMessageRole.ASSISTANT &&
            next.content?.trim() &&
            toolMessages.every(
              (t) =>
                "metadata" in t &&
                supersededToolCallIds.has(t.metadata!.toolCall!.toolCallId) &&
                !t.metadata!.toolCall!.isDeferred,
            )
          ) {
            // Non-empty ASSISTANT between a fully-superseded group and a deferred result.
            // This is the AI's "dispatched" response that preceded the wakeUp result —
            // skip it so the deferred tool is included in the same group.
            j++;
          } else {
            // Real content boundary - stop
            break;
          }
        }

        // Skip ahead past all consumed messages (tools + skipped empty assistants)
        i = j - 1;

        // Check if the last message in result is an ASSISTANT message with text content
        // If so, we need to merge the tool calls into that message
        const lastResultMsg = result[result.length - 1];
        const hasTextAssistant =
          lastResultMsg &&
          lastResultMsg.role === "assistant" &&
          typeof lastResultMsg.content === "string";

        // Build tool call content array for assistant message
        const toolCallContent: Array<{
          type: "tool-call";
          toolCallId: string;
          toolName: string;
          input: ToolCallResult;
        }> = [];

        // Build separate tool result messages (one per tool call with result)
        const toolResultMessages: ModelMessage[] = [];

        // Track seen toolCallIds to prevent duplicates (API rejects non-unique IDs)
        const seenToolCallIds = new Set<string>();

        for (const toolMsg of toolMessages) {
          const toolCall = toolMsg.metadata!.toolCall!;

          // Skip original tool calls that have been superseded by a deferred result.
          // The deferred message (isDeferred=true) is the authoritative one with the
          // real async result. The original stays in DB for UI display but is excluded
          // from AI context.
          if (
            supersededToolCallIds.has(toolCall.toolCallId) &&
            !toolCall.isDeferred
          ) {
            logger.debug(
              "[MessageConverter] Skipping superseded tool call - deferred result takes over",
              {
                toolCallId: toolCall.toolCallId,
                toolName: toolCall.toolName,
              },
            );
            continue;
          }

          // Skip duplicate toolCallIds - keep the first occurrence
          // Duplicates can occur when a tool call fails and is retried with the same ID
          if (seenToolCallIds.has(toolCall.toolCallId)) {
            logger.warn(
              "[MessageConverter] Skipping duplicate toolCallId in batch",
              {
                toolCallId: toolCall.toolCallId,
                toolName: toolCall.toolName,
                messageId: MessageConverter.isChatMessage(toolMsg)
                  ? toolMsg.id
                  : "unknown",
              },
            );
            continue;
          }
          seenToolCallIds.add(toolCall.toolCallId);

          // Add tool call to assistant message content.
          // For deferred wakeUp results: replace args with a short hint so the AI isn't
          // confused by seeing the full args again. Full args are preserved in DB/UI.
          // For all other cases: use original args.
          const inputForAi =
            toolCall.isDeferred && toolCall.originalToolCallId
              ? { hint: "args omitted - see result below" }
              : toolCall.args;
          toolCallContent.push({
            type: "tool-call",
            toolCallId: toolCall.toolCallId,
            toolName: toolCall.toolName,
            input: inputForAi,
          });

          // Create tool result message.
          // Tools awaiting confirmation have no result/error yet - emit the
          // waiting_for_confirmation status as a placeholder result so the AI SDK
          // never sees a tool-call without a matching tool-result.
          const output = toolCall.error
            ? {
                type: "error-text" as const,
                value: MessageConverter.translateErrorRecursive(
                  toolCall.error,
                  locale,
                ),
              }
            : toolCall.result
              ? MessageConverter.buildToolResultOutput(
                  toolCall.result,
                  toolCall.toolName,
                  modelConfig,
                )
              : toolCall.waitingForConfirmation
                ? {
                    type: "json" as const,
                    value: {
                      status: "waiting_for_confirmation",
                      toolName: toolCall.toolName,
                    },
                  }
                : toolCall.callbackMode === "wakeUp"
                  ? {
                      type: "json" as const,
                      value: {
                        status: "pending",
                        hint: "Result will be injected into this thread when ready. Do NOT call this tool again.",
                      },
                    }
                  : {
                      // Fallback: tool call has no result yet (e.g. detach goroutine hasn't
                      // completed when a parallel wakeUp revival fires). Always emit a placeholder
                      // so the AI SDK never sees a tool-call without a matching tool-result.
                      type: "json" as const,
                      value: {
                        status: "pending",
                        hint: "Result not yet available.",
                      },
                    };

          if (output !== null) {
            toolResultMessages.push({
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  output,
                },
              ],
            });
          }
        }

        if (hasTextAssistant) {
          // Merge tool calls into existing assistant message with text
          // AI SDK format: assistant message can have both text and tool-calls
          const textContent = lastResultMsg.content as string;
          result[result.length - 1] = {
            role: "assistant",
            content: [{ type: "text", text: textContent }, ...toolCallContent],
          };
          logger.debug(
            "[MessageConverter] Merged tool calls into text assistant message",
            {
              toolCount: toolMessages.length,
              resultCount: toolResultMessages.length,
            },
          );
        } else {
          // Create new assistant message with just tool calls
          // AI SDK format: assistant message with only tool-call content parts
          result.push({
            role: "assistant",
            content: toolCallContent,
          });
          logger.debug(
            "[MessageConverter] Created assistant message with tool calls",
            {
              toolCount: toolMessages.length,
              resultCount: toolResultMessages.length,
            },
          );
        }

        // Add all TOOL result messages (one message per result)
        // AI SDK format: separate tool message for each tool result
        result.push(...toolResultMessages);

        continue;
      }

      // Inject metadata system message before user/assistant messages.
      // Only for full ChatMessage objects (not simple { role, content } objects).
      // Only emit once per sequenceId - sequential tool calls share a sequenceId across
      // their placeholder ASSISTANT + TOOL chain, so we skip duplicate injections.
      if (
        MessageConverter.isChatMessage(msg) &&
        (msg.role === ChatMessageRole.USER ||
          msg.role === ChatMessageRole.ASSISTANT)
      ) {
        const seqKey = msg.sequenceId ?? msg.id;
        if (!emittedMetadataSequenceIds.has(seqKey)) {
          emittedMetadataSequenceIds.add(seqKey);
          const metadataContent = createMetadataSystemMessage(
            msg,
            rootFolderId,
            timezone,
          );
          result.push({
            role: "system",
            content: metadataContent,
          });
        }
      }

      // Convert and add the actual message
      // toAiSdkMessage can return a single message, an array of messages, or null
      const converted = await MessageConverter.toAiSdkMessage(
        msg,
        logger,
        locale,
        modelConfig,
      );
      if (converted !== null) {
        // If it's an array, flatten it into the result
        if (Array.isArray(converted)) {
          result.push(...converted);
        } else {
          result.push(converted);
        }
      }
    }

    // Safety net: deduplicate tool_use IDs across the entire result.
    // The API rejects messages with non-unique tool_use IDs.
    // This handles edge cases where the same toolCallId appears in separate
    // assistant messages (e.g. non-consecutive TOOL messages sharing an ID).
    const globalSeenToolCallIds = new Set<string>();
    for (let k = 0; k < result.length; k++) {
      const msg = result[k];
      if (msg.role === "assistant" && Array.isArray(msg.content)) {
        const contentArr = msg.content;
        const indicesToRemove = new Set<number>();
        for (let p = 0; p < contentArr.length; p++) {
          const part = contentArr[p];
          if (part && part.type === "tool-call") {
            const toolPart = part as ToolCallPart;
            if (globalSeenToolCallIds.has(toolPart.toolCallId)) {
              logger.warn(
                "[MessageConverter] Removing duplicate toolCallId from assistant message",
                { toolCallId: toolPart.toolCallId },
              );
              indicesToRemove.add(p);
            } else {
              globalSeenToolCallIds.add(toolPart.toolCallId);
            }
          }
        }
        if (indicesToRemove.size > 0) {
          const kept = contentArr.flatMap((part, idx) =>
            indicesToRemove.has(idx) ? [] : [part],
          );
          result[k] = { ...msg, content: kept };
        }
      }
      if (msg.role === "tool" && Array.isArray(msg.content)) {
        const contentArr = msg.content;
        const indicesToRemove = new Set<number>();
        for (let p = 0; p < contentArr.length; p++) {
          const part = contentArr[p];
          if (part && part.type === "tool-result") {
            const toolPart = part as ToolResultPart;
            if (!globalSeenToolCallIds.has(toolPart.toolCallId)) {
              logger.warn("[MessageConverter] Removing orphaned tool-result", {
                toolCallId: toolPart.toolCallId,
              });
              indicesToRemove.add(p);
            }
          }
        }
        if (indicesToRemove.size > 0) {
          const kept = contentArr.flatMap((part, idx) =>
            indicesToRemove.has(idx) ? [] : [part],
          );
          result[k] = { ...msg, content: kept };
        }
      }
    }

    // Remove any assistant/tool messages that ended up with empty content arrays
    return result.filter(
      (msg) => !Array.isArray(msg.content) || msg.content.length > 0,
    );
  }
  /**
   * Build tool result output, detecting ContentResponse to pass images to the AI model
   * When the result contains a ContentResponse (with __isContentResponse marker),
   * we use the AI SDK's `type: 'content'` format with `file-data` parts so the
   * model can actually "see" images (e.g. screenshots from browser tools).
   *
   * For media tool results (image_gen / video_gen / audio_gen) applies modality-aware logic:
   * - Model supports the media modality → pass file URL (model can see it natively)
   * - Model does not support it → pass only text description (gap-fill ensures text is populated)
   */
  private static buildToolResultOutput(
    result: ToolCallResult | undefined,
    toolName?: string,
    modelConfig?: ChatModelOption,
  ):
    | {
        type: "json";
        value: ToolCallResult | null;
      }
    | {
        type: "content";
        value: Array<
          | { type: "text"; text: string }
          | { type: "file-data"; data: string; mediaType: string }
        >;
      } {
    // Check if result is a ContentResponse (stored as JSON with marker fields)
    if (
      result &&
      typeof result === "object" &&
      !Array.isArray(result) &&
      "__isContentResponse" in result &&
      "content" in result &&
      Array.isArray(result.content)
    ) {
      const blocks = result.content as ContentBlock[];
      const contentParts: Array<
        | { type: "text"; text: string }
        | { type: "file-data"; data: string; mediaType: string }
      > = [];

      for (const block of blocks) {
        if (block.type === "text") {
          contentParts.push({ type: "text", text: block.text });
        } else if (block.type === "image") {
          contentParts.push({
            type: "file-data",
            data: block.data,
            mediaType: block.mimeType,
          });
        }
      }

      if (contentParts.length > 0) {
        return { type: "content", value: contentParts };
      }
    }

    // Media tool result modality-aware handling:
    // image_gen / video_gen / audio_gen results carry { file, text, mediaType, creditCost }
    // The model should see the file only if it natively supports that modality;
    // otherwise it sees only the text description (gap-fill guarantees text is populated).
    const MEDIA_TOOL_NAMES = [
      IMAGE_GEN_ALIAS,
      VIDEO_GEN_TOOL_NAME,
      AUDIO_GEN_TOOL_NAME,
    ] as const;
    if (
      toolName &&
      MEDIA_TOOL_NAMES.includes(
        toolName as (typeof MEDIA_TOOL_NAMES)[number],
      ) &&
      result &&
      typeof result === "object" &&
      !Array.isArray(result)
    ) {
      const mediaResult = result as {
        file?: string;
        imageUrl?: string;
        videoUrl?: string;
        audioUrl?: string;
        text?: string | null;
        mediaType?: string;
        creditCost?: number;
      };

      // Normalize: generate_image/video/music return { imageUrl / videoUrl / audioUrl }
      // while FilePartHandler (native Gemini gen) stores { file }.
      // Resolve the canonical file URL from whichever field is present.
      const fileUrl =
        mediaResult.file ??
        mediaResult.imageUrl ??
        mediaResult.videoUrl ??
        mediaResult.audioUrl;

      // If neither format has a media URL, fall through to generic JSON passthrough.
      if (!fileUrl && !mediaResult.text) {
        return { type: "json", value: result ?? null };
      }

      // Determine which modality this tool produces
      const modality: Modality =
        toolName === IMAGE_GEN_ALIAS
          ? "image"
          : toolName === VIDEO_GEN_TOOL_NAME
            ? "video"
            : "audio";

      const modelCanSee = modelConfig?.inputs?.includes(modality) ?? false;

      if (modelCanSee && fileUrl) {
        // Model supports this modality - pass file URL so it can see its own output.
        // Preserve text alongside so model has both the visual and the description.
        return {
          type: "json" as const,
          value: {
            file: fileUrl,
            text: mediaResult.text ?? null,
            mediaType: mediaResult.mediaType ?? null,
            creditCost: mediaResult.creditCost ?? null,
          } satisfies ToolCallResult,
        };
      }

      // Model cannot see the file - pass URL + text so the AI can reference it by URL
      // and also has a text description if gap-fill produced one.
      // Always include the media URL (imageUrl/videoUrl/audioUrl) so the AI can cite it.
      return {
        type: "json" as const,
        value: {
          ...(mediaResult.imageUrl !== undefined && {
            imageUrl: mediaResult.imageUrl,
          }),
          ...(mediaResult.videoUrl !== undefined && {
            videoUrl: mediaResult.videoUrl,
          }),
          ...(mediaResult.audioUrl !== undefined && {
            audioUrl: mediaResult.audioUrl,
          }),
          ...(fileUrl &&
            !mediaResult.imageUrl &&
            !mediaResult.videoUrl &&
            !mediaResult.audioUrl && { file: fileUrl }),
          text: mediaResult.text ?? null,
          mediaType: mediaResult.mediaType ?? null,
          creditCost: mediaResult.creditCost ?? null,
        } satisfies ToolCallResult,
      };
    }

    return { type: "json", value: result ?? null };
  }

  /**
   * Recursively build error message string from already-translated error chain
   * (repositories call t("key", params) and store the result; no re-translation needed)
   */
  private static translateErrorRecursive(
    error: ErrorResponseType,
    locale: CountryLanguage,
  ): string {
    if (error.cause) {
      const causeMessage = MessageConverter.translateErrorRecursive(
        error.cause,
        locale,
      );
      return `${error.message}\n\nCause: ${causeMessage}`;
    }

    return error.message;
  }
}
