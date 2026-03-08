/**
 * MessageConverter - Converts ChatMessage to AI SDK format
 */

import "server-only";

import type { ModelMessage, ToolCallPart, ToolResultPart } from "ai";

import type {
  ContentBlock,
  ErrorResponseType,
} from "@/app/api/[locale]/shared/types/response.schema";
import { parseError } from "@/app/api/[locale]/shared/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { DefaultFolderId } from "../../../chat/config";
import type { ChatMessage, ToolCallResult } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
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
      case ChatMessageRole.ASSISTANT:
        if (!message.content || !message.content.trim()) {
          return null;
        }
        return { content: message.content.trim(), role: "assistant" };
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
          logger.info("[CACHE DEBUG] Tool message conversion", {
            toolCallId: toolCall.toolCallId,
            toolName: toolCall.toolName,
            resultHash,
            resultLength: toolCall.result
              ? JSON.stringify(toolCall.result).length
              : 0,
          });

          // Check if this TOOL message has a result or error (executed)
          // If yes, we need to return BOTH: ASSISTANT with tool-call AND TOOL with tool-result
          // If no, return only ASSISTANT with tool-call
          if (toolCall.result || toolCall.error) {
            // Tool has been executed - return BOTH messages for AI SDK
            // Message 1: ASSISTANT message with tool-call (the request)
            // Message 2: TOOL message with tool-result (the response)

            // Translate error messages recursively for AI using the caller's locale
            const output = toolCall.error
              ? {
                  type: "error-text" as const,
                  value: MessageConverter.translateErrorRecursive(
                    toolCall.error,
                    locale,
                  ),
                }
              : MessageConverter.buildToolResultOutput(toolCall.result);

            return [
              // Message 1: Assistant's tool call
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
              // Message 2: Tool result
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
          } else {
            // Tool has not been executed yet - convert to ASSISTANT message with tool-call only
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
  ): Promise<ModelMessage[]> {
    const result: ModelMessage[] = [];

    // Pre-pass: collect toolCallIds that have been superseded by a deferred result message.
    // When a background/noLoop result arrives late, a second TOOL message is inserted with
    // originalToolCallId pointing back to the original pending call. The original pending
    // call (no result) must be suppressed from AI context so the AI sees the deferred
    // result message as the authoritative tool call+result pair.
    const supersededToolCallIds = new Set<string>();
    for (const msg of messages) {
      if (
        msg.role === ChatMessageRole.TOOL &&
        "metadata" in msg &&
        msg.metadata?.toolCall?.originalToolCallId
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
        // Look ahead to find all consecutive TOOL messages
        const toolMessages: ChatMessage[] = [msg];
        let j = i + 1;
        while (
          j < messages.length &&
          messages[j]?.role === ChatMessageRole.TOOL &&
          "metadata" in messages[j] &&
          messages[j].metadata?.toolCall
        ) {
          toolMessages.push(messages[j]);
          j++;
        }

        // Skip ahead past the tool messages we just collected
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

          // Skip original pending calls that have been superseded by a deferred result message.
          // The deferred message (with originalToolCallId set) replaces the original in AI context.
          if (supersededToolCallIds.has(toolCall.toolCallId)) {
            logger.info(
              "[MessageConverter] Skipping superseded pending tool call — deferred result message takes over",
              {
                toolCallId: toolCall.toolCallId,
                toolName: toolCall.toolName,
              },
            );
            continue;
          }

          // Skip duplicate toolCallIds — keep the first occurrence
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
          // wakeUp: suppress args from AI context — result may arrive days later,
          // args could be stale or already compacted. Result is what matters.
          const inputForAi =
            toolCall.callbackMode === "wakeUp" &&
            (toolCall.result || toolCall.error)
              ? {}
              : toolCall.args;
          toolCallContent.push({
            type: "tool-call",
            toolCallId: toolCall.toolCallId,
            toolName: toolCall.toolName,
            input: inputForAi,
          });

          // If tool was executed, create separate tool result message
          // AI SDK format: one tool message per result
          if (toolCall.result || toolCall.error) {
            const output = toolCall.error
              ? {
                  type: "error-text" as const,
                  value: MessageConverter.translateErrorRecursive(
                    toolCall.error,
                    locale,
                  ),
                }
              : MessageConverter.buildToolResultOutput(toolCall.result);

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

      // Inject metadata system message before user/assistant messages
      // Only for full ChatMessage objects (not simple { role, content } objects)
      if (
        MessageConverter.isChatMessage(msg) &&
        (msg.role === ChatMessageRole.USER ||
          msg.role === ChatMessageRole.ASSISTANT)
      ) {
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

      // Convert and add the actual message
      // toAiSdkMessage can return a single message, an array of messages, or null
      const converted = await MessageConverter.toAiSdkMessage(
        msg,
        logger,
        locale,
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
   */
  private static buildToolResultOutput(result: ToolCallResult | undefined):
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

    return { type: "json", value: result ?? null };
  }

  /**
   * Recursively translate error messages including nested causes
   */
  private static translateErrorRecursive(
    error: ErrorResponseType,
    locale: CountryLanguage,
  ): string {
    const { t } = simpleT(locale);
    const mainMessage = t(error.message, error.messageParams);

    if (error.cause) {
      const causeMessage = MessageConverter.translateErrorRecursive(
        error.cause,
        locale,
      );
      return `${mainMessage}\n\nCause: ${causeMessage}`;
    }

    return mainMessage;
  }
}
