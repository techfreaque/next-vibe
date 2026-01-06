/**
 * MessageConverter - Converts ChatMessage to AI SDK format
 */

import "server-only";

import type { ModelMessage } from "ai";

import type { ErrorResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import { parseError } from "@/app/api/[locale]/shared/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { defaultLocale } from "@/i18n/core/config";
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
  ): Promise<ModelMessage | ModelMessage[] | null> {
    switch (message.role) {
      case ChatMessageRole.USER: {
        // Check if message has attachments
        if (
          "metadata" in message &&
          message.metadata?.attachments &&
          message.metadata.attachments.length > 0
        ) {
          const contentParts: Array<
            { type: "text"; text: string } | { type: "image"; image: string | URL }
          > = [];

          // Add text content if present
          if (message.content) {
            contentParts.push({ type: "text", text: message.content });
          }

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
                logger.error("[MessageConverter] Failed to fetch attachment for AI context", {
                  attachmentId: attachment.id,
                  filename: attachment.filename,
                  error: parseError(error),
                });
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
                  const decoded = Buffer.from(base64Data, "base64").toString("utf-8");
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

          return { content: contentParts, role: "user" };
        }

        return { content: message.content ?? "", role: "user" };
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

          // Check if this TOOL message has a result or error (executed)
          // If yes, we need to return BOTH: ASSISTANT with tool-call AND TOOL with tool-result
          // If no, return only ASSISTANT with tool-call
          if (toolCall.result || toolCall.error) {
            // Tool has been executed - return BOTH messages for AI SDK
            // Message 1: ASSISTANT message with tool-call (the request)
            // Message 2: TOOL message with tool-result (the response)

            // Translate error messages recursively for AI (using default locale for consistency)
            const output = toolCall.error
              ? {
                  type: "error-text" as const,
                  value: MessageConverter.translateErrorRecursive(toolCall.error),
                }
              : { type: "json" as const, value: toolCall.result ?? null };

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
        logger.error("[MessageConverter] TOOL message without toolCall metadata", {
          messageId: MessageConverter.isChatMessage(message) ? message.id : "unknown",
        });
        return null;
      case ChatMessageRole.ERROR: {
        // ERROR messages contain serialized MessageResponseType
        if (!message.content) {
          return {
            content: "",
            role: "assistant",
          };
        }

        try {
          const errorData = JSON.parse(message.content) as ErrorResponseType;

          return {
            content: MessageConverter.translateErrorRecursive(errorData),
            role: "assistant",
          };
        } catch (error) {
          logger.error("[MessageConverter] Failed to deserialize error message", {
            error: parseError(error),
            content: message.content,
          });
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
   */
  static async toAiSdkMessages(
    messages: ChatMessage[],
    logger: EndpointLogger,
    rootFolderId?: DefaultFolderId,
  ): Promise<ModelMessage[]> {
    const result: ModelMessage[] = [];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];

      // Check if this is the start of a TOOL message sequence (multiple consecutive tool calls)
      if (msg.role === ChatMessageRole.TOOL && "metadata" in msg && msg.metadata?.toolCall) {
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

        for (const toolMsg of toolMessages) {
          const toolCall = toolMsg.metadata!.toolCall!;

          // Add tool call to assistant message content
          toolCallContent.push({
            type: "tool-call",
            toolCallId: toolCall.toolCallId,
            toolName: toolCall.toolName,
            input: toolCall.args,
          });

          // If tool was executed, create separate tool result message
          // AI SDK format: one tool message per result
          if (toolCall.result || toolCall.error) {
            const output = toolCall.error
              ? {
                  type: "error-text" as const,
                  value: MessageConverter.translateErrorRecursive(toolCall.error),
                }
              : { type: "json" as const, value: toolCall.result ?? null };

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
          logger.debug("[MessageConverter] Merged tool calls into text assistant message", {
            toolCount: toolMessages.length,
            resultCount: toolResultMessages.length,
          });
        } else {
          // Create new assistant message with just tool calls
          // AI SDK format: assistant message with only tool-call content parts
          result.push({
            role: "assistant",
            content: toolCallContent,
          });
          logger.debug("[MessageConverter] Created assistant message with tool calls", {
            toolCount: toolMessages.length,
            resultCount: toolResultMessages.length,
          });
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
        (msg.role === ChatMessageRole.USER || msg.role === ChatMessageRole.ASSISTANT)
      ) {
        const metadataContent = createMetadataSystemMessage(msg, rootFolderId);
        result.push({
          role: "system",
          content: metadataContent,
        });
      }

      // Convert and add the actual message
      // toAiSdkMessage can return a single message, an array of messages, or null
      const converted = await MessageConverter.toAiSdkMessage(msg, logger);
      if (converted !== null) {
        // If it's an array, flatten it into the result
        if (Array.isArray(converted)) {
          result.push(...converted);
        } else {
          result.push(converted);
        }
      }
    }

    return result;
  }
  /**
   * Recursively translate error messages including nested causes
   */
  private static translateErrorRecursive(error: ErrorResponseType): string {
    const { t } = simpleT(defaultLocale);
    const mainMessage = t(error.message, error.messageParams);

    if (error.cause) {
      const causeMessage = MessageConverter.translateErrorRecursive(error.cause);
      return `${mainMessage}\n\nCause: ${causeMessage}`;
    }

    return mainMessage;
  }
}
