/**
 * MessageConverter - Converts ChatMessage to AI SDK format
 */

import "server-only";

import type { ModelMessage } from "ai";

import { defaultLocale } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { DefaultFolderId } from "../../../chat/config";
import type { ChatMessage } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import { createMetadataSystemMessage } from "../sytem-prompt/message-metadata-generator";

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

          // DEBUG: Log attachment processing
          // oxlint-disable-next-line no-console
          console.error("=== PROCESSING USER MESSAGE WITH ATTACHMENTS ===");
          // oxlint-disable-next-line no-console
          console.error("Attachment count:", message.metadata.attachments.length);
          // oxlint-disable-next-line no-console
          console.error(
            "Attachments:",
            JSON.stringify(
              message.metadata.attachments.map((a) => ({
                filename: a.filename,
                mimeType: a.mimeType,
                hasData: "data" in a && !!a.data,
                hasUrl: !!a.url,
                dataLength: "data" in a && a.data ? a.data.length : 0,
              })),
            ),
          );

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
                // oxlint-disable-next-line no-console
                console.error("Fetching attachment from URL for AI context:", attachment.url);
                const response = await fetch(attachment.url);
                if (response.ok) {
                  const buffer = await response.arrayBuffer();
                  base64Data = Buffer.from(buffer).toString("base64");
                  // oxlint-disable-next-line no-console
                  console.error("Successfully fetched and converted attachment to base64");
                } else {
                  // oxlint-disable-next-line no-console
                  console.error(
                    "Failed to fetch attachment:",
                    response.status,
                    response.statusText,
                  );
                }
              } catch (error) {
                // oxlint-disable-next-line no-console
                console.error("Error fetching attachment from URL:", error);
              }
            }

            if (base64Data) {
              if (attachment.mimeType.startsWith("image/")) {
                // Images: Add as image part
                contentParts.push({
                  type: "image",
                  image: `data:${attachment.mimeType};base64,${base64Data}`,
                });
                // oxlint-disable-next-line no-console
                console.error("Added image part:", attachment.filename);
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
                  // oxlint-disable-next-line no-console
                  console.error("Added text file as text part:", attachment.filename);
                } catch (error) {
                  // oxlint-disable-next-line no-console
                  console.error("Failed to decode text attachment:", attachment.filename, error);
                }
              }
            }
          }

          // oxlint-disable-next-line no-console
          console.error("Final content parts:", contentParts.length, "parts");
          // oxlint-disable-next-line no-console
          console.error(
            "Content parts structure:",
            JSON.stringify(
              contentParts.map((p) => ({
                type: p.type,
                ...(p.type === "text"
                  ? { text: p.text }
                  : {
                      imageLength: typeof p.image === "string" ? p.image.length : "URL",
                    }),
              })),
            ),
          );

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
            // Translate error messages for AI (using default locale for consistency)
            const output = toolCall.error
              ? {
                  type: "error-text" as const,
                  value:
                    toolCall.error.message === "app.api.agent.chat.aiStream.errors.userDeclinedTool"
                      ? simpleT(defaultLocale).t(toolCall.error.message)
                      : JSON.stringify({
                          message: toolCall.error.message,
                          params: toolCall.error.messageParams,
                        }),
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
        return null;
      case ChatMessageRole.ERROR:
        return { content: message.content ?? "", role: "assistant" };
    }
  }

  /**
   * Convert array of ChatMessages to AI SDK format
   */
  static async toAiSdkMessages(
    messages: ChatMessage[],
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
      const converted = await MessageConverter.toAiSdkMessage(msg);
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
}
