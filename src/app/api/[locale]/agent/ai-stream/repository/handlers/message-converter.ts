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
import type { ChatMessage } from "../../../chat/db";
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
   */
  static async toAiSdkMessages(
    messages: ChatMessage[],
    logger: EndpointLogger,
    rootFolderId?: DefaultFolderId,
    upcomingResponseContext?: { model: string; character: string | null },
  ): Promise<ModelMessage[]> {
    const result: ModelMessage[] = [];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];

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

    // Add context for the upcoming assistant response at the END
    // This tells the model what config will be used for its response
    // and explicitly instructs not to echo this metadata
    if (upcomingResponseContext) {
      const parts: string[] = [];
      parts.push(`Model:${upcomingResponseContext.model}`);
      if (upcomingResponseContext.character) {
        parts.push(`Character:${upcomingResponseContext.character}`);
      }
      result.push({
        role: "system",
        content: `[Your response context: ${parts.join(" | ")}]`,
      });
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
