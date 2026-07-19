/**
 * Message context pipeline — convert stage (single-message conversion, tool
 * grouping, placeholder precedence ladder, dedup/remap).
 */

import "server-only";

import type { ToolResultOutput } from "@ai-sdk/provider-utils";
import type { ModelMessage, ToolCallPart } from "ai";
import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import type { ErrorResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { DefaultFolderId } from "../../../chat/config";
import type { ChatMessage, ToolCall } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import { fetchStorageFileAsBase64 } from "../../../chat/storage/url-utils";
import type { ChatModelOption } from "../../models";
import { createMetadataSystemMessage } from "../../system-prompt/builder";
import { createFixtureFetch } from "../../testing/fetch-cache";
import {
  extractDocumentText,
  isDocumentMimeType,
} from "../handlers/attachments";
import { buildToolResultOutput } from "./tool-output";

// ─── Stage: convert (single-message, tool grouping, ladder, dedup/remap) ───

// -- JSON / error helpers (folded from handlers/convert/json-sanitize.ts) --

/**
 * Build the full error message from an already-translated error chain.
 * Repositories store the translated `message`, so no re-translation is needed;
 * this just appends nested causes.
 */
function buildErrorChainMessage(error: ErrorResponseType): string {
  if (error.cause) {
    const causeMessage = buildErrorChainMessage(error.cause);
    return `${error.message}\n\nCause: ${causeMessage}`;
  }
  return error.message;
}

/**
 * Type guard to check if a message is a full ChatMessage (not a simple role/content object)
 */
function isChatMessage(
  message: ChatMessage | { role: ChatMessageRole; content: string },
): message is ChatMessage {
  return "id" in message && "createdAt" in message;
}

/**
 * Decide the tool-result output for one tool call. Precedence ladder:
 * error → resolved wakeUp dispatch → real result → waiting-for-confirmation
 * → wakeUp pending → generic pending placeholder.
 *
 * Tools awaiting confirmation have no result/error yet - emit the
 * waiting_for_confirmation status as a placeholder result so the AI SDK
 * never sees a tool-call without a matching tool-result.
 * A wakeUp DISPATCH whose deferred result already exists later in this
 * context: override whatever the dispatch stored ("...will be injected
 * when complete...") with a TERMINAL "completed — result below" status.
 * Without this the dispatch's own pending hint is the last tool result the
 * model sees and it re-calls the tool. Never override the deferred message
 * itself (isDeferred) — that carries the real result. Transport-agnostic
 * (local/direct/remote-folder).
 *
 * Shared by toAiSdkMessage and toAiSdkMessages so the precedence and hint
 * strings stay identical on both paths.
 */
async function buildOutputForToolCall(
  toolCall: ToolCall,
  logger: EndpointLogger,
  modelConfig: ChatModelOption | undefined,
  isCurrentTurn: boolean | undefined,
  resolvedDispatchToolCallIds: ReadonlySet<string> | undefined,
  fetchImpl: typeof globalThis.fetch,
): Promise<ToolResultOutput | null> {
  const isResolvedDispatch =
    toolCall.callbackMode === "wakeUp" &&
    !toolCall.isDeferred &&
    resolvedDispatchToolCallIds?.has(toolCall.toolCallId) === true;
  return toolCall.error
    ? {
        type: "error-text" as const,
        value: buildErrorChainMessage(toolCall.error),
      }
    : isResolvedDispatch
      ? {
          type: "json" as const,
          value: {
            status: "completed",
            hint: "Task completed. Its result has been delivered below in this conversation — do NOT call this tool again; respond using that result.",
          },
        }
      : toolCall.result
        ? await buildToolResultOutput(
            logger,
            toolCall.result,
            toolCall.toolName,
            modelConfig,
            isCurrentTurn,
            fetchImpl,
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
}

/**
 * Convert ChatMessageRole enum to AI SDK compatible role
 * Converts TOOL messages to proper AI SDK tool result format
 * Converts ERROR -> ASSISTANT (so errors stay in chain)
 * Returns an array when a single DB message needs to be expanded into multiple AI SDK messages (e.g., tool-call + tool-result)
 */
export async function toAiSdkMessage(
  message: ChatMessage | { role: ChatMessageRole; content: string },
  logger: EndpointLogger,
  modelConfig?: ChatModelOption,
  isCurrentTurn?: boolean,
  /**
   * toolCallIds of wakeUp DISPATCH messages whose deferred result already exists
   * elsewhere in the same context (computed by toAiSdkMessages from the full
   * message set). A dispatch placeholder in this set renders a TERMINAL
   * "completed — result delivered below" status instead of the "pending / will be
   * injected" hint, so the model never re-calls a tool that already finished.
   * Transport-agnostic: applies identically to local, direct, and remote-folder.
   */
  resolvedDispatchToolCallIds?: ReadonlySet<string>,
  /** Fixture-aware fetch for attachment/media downloads; defaults to live fetch. */
  // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- live-fetch default for callers without a fixture chain
  fetchImpl: typeof globalThis.fetch = fetch,
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
        | { type: "file"; data: string; mediaType: string }
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
              const response = await fetchImpl(attachment.url, {
                signal: AbortSignal.timeout(15_000),
              });
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
              // Audio/video: pass as FilePart. Keep `data` a base64 STRING,
              // not a decoded Uint8Array/Buffer - provider SDKs (e.g.
              // @openrouter/ai-sdk-provider's convertUint8ArrayToBase64)
              // re-encode a Uint8Array by concatenating one character per
              // byte in a loop, which builds a deeply-nested cons string that
              // can throw "Maximum call stack size exceeded" on large audio
              // files. A string is passed through as-is by that same
              // provider code, skipping the buggy re-encode entirely.
              contentParts.push({
                type: "file",
                data: base64Data,
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
                  // The model must SEE that a file was attached and unreadable
                  // — silently dropping it makes the AI deny the upload ever
                  // happened instead of telling the user what went wrong.
                  contentParts.push({
                    type: "text",
                    text: `\n\n[File: ${attachment.filename} — attached, but its text could not be extracted (${attachment.mimeType}). Tell the user the file could not be read.]`,
                  });
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
          .replaceAll(/<think>[\s\S]*?<\/think>/g, "")
          .replace(/<think>[\s\S]*$/i, "")
          .replaceAll("</think>", "")
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
        const base64Data = await fetchStorageFileAsBase64(
          generatedMedia.url,
          undefined,
          fetchImpl,
        );
        if (base64Data) {
          const mimeType = generatedMedia.mimeType ?? "image/png";
          assistantParts.push({
            type: "file",
            data: base64Data,
            mediaType: mimeType,
          });
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
        // See buildOutputForToolCall for the placeholder precedence ladder.
        const output: ToolResultOutput | null = await buildOutputForToolCall(
          toolCall,
          logger,
          modelConfig,
          isCurrentTurn,
          resolvedDispatchToolCallIds,
          fetchImpl,
        );

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
          messageId: isChatMessage(message) ? message.id : "unknown",
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
          content: buildErrorChainMessage(errorData),
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
 * Adds cache_control to enable Anthropic prompt caching via OpenRouter
 */
export async function toAiSdkMessages(
  messages: ChatMessage[],
  logger: EndpointLogger,
  timezone: string,
  rootFolderId: DefaultFolderId,
  modelConfig: ChatModelOption | undefined,
  isRevival: boolean | undefined,
  toolExecutionContext: ToolExecutionContext,
): Promise<ModelMessage[]> {
  // One fixture-aware fetch per conversion pass (attachment/media downloads).
  const fetchImpl = createFixtureFetch(toolExecutionContext, logger);
  const result: ModelMessage[] = [];

  // Track sequenceIds for which we have already emitted a metadata system message.
  // Each logical AI turn shares a sequenceId across its placeholder ASSISTANT + TOOL chain.
  // We only emit one [Context:] system message per sequenceId so sequential tool calls
  // that share a sequenceId don't produce redundant system messages between each pair.
  const emittedMetadataSequenceIds = new Set<string>();

  // Pre-pass (non-revival only): collect toolCallIds superseded by a deferred result.
  // In revival context we show the full history instead of suppressing the original.
  const supersededToolCallIds = new Set<string>();
  if (!isRevival) {
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
  }

  // ALL modes (revival included): collect the original toolCallIds that a deferred
  // result has already delivered. Revival keeps the original placeholder visible
  // (so the AI sees the STEP_OK dispatch turn), but the placeholder must NOT render
  // its "Result will be injected when ready — do NOT call again" PENDING hint once
  // the deferred result exists: that reads as "still waiting" and the model
  // re-dispatches the tool. Marking the original as resolved lets us render a
  // terminal "completed, result delivered below" status instead.
  const resolvedDispatchToolCallIds = new Set<string>();
  for (const msg of messages) {
    if (
      msg.role === ChatMessageRole.TOOL &&
      "metadata" in msg &&
      msg.metadata?.toolCall?.originalToolCallId &&
      msg.metadata.toolCall.isDeferred
    ) {
      resolvedDispatchToolCallIds.add(msg.metadata.toolCall.originalToolCallId);
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
      // Non-revival: non-empty ASSISTANT between a fully-superseded group and a deferred
      // result is also skipped (handles "dispatched" intermediate response).
      // Revival: non-empty ASSISTANT is a hard boundary - the AI needs to see the full
      // prior-turn context (e.g. STEP_OK) before the deferred result.
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
          !isRevival &&
          next?.role === ChatMessageRole.ASSISTANT &&
          next.content?.trim() &&
          toolMessages.every(
            (t) =>
              "metadata" in t &&
              supersededToolCallIds.has(t.metadata!.toolCall!.toolCallId) &&
              !t.metadata!.toolCall!.isDeferred,
          )
        ) {
          // Non-revival: skip intermediate "dispatched" assistant so deferred joins the group.
          j++;
        } else {
          // Real content boundary - stop
          break;
        }
      }

      // Skip ahead past all consumed messages (tools + skipped empty assistants)
      i = j - 1;

      // Toolless models (supportsTools:false — native image gen): OMIT
      // prior-turn structured tool groups entirely. Empirically proven
      // (2026-07-04, gemini-3-pro-image-preview): with structured tool turns
      // in history the model imitates them — it emits a (dead) tool call on
      // EVERY native-generation ask regardless of prompt, system note,
      // tool_choice:"none", or image-only modality; with them omitted it
      // generates natively, AND an explicit "call the tool" prompt still
      // yields a structured tool call (the loop executes those). The current
      // turn's own in-flight calls/results ride the SDK step state, not this
      // history conversion, so tool-driven turns are unaffected.
      if (modelConfig?.supportsTools === false) {
        continue;
      }

      // This tool group is the "current turn" if it ends at the last message in the array.
      // Current-turn images are fetched as base64; history images become URL stubs.
      const isCurrentTurn = j - 1 === messages.length - 1;

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
        input: WidgetData;
      }> = [];

      // Build separate tool result messages (one per tool call with result)
      const toolResultMessages: ModelMessage[] = [];

      // Track seen toolCallIds to prevent duplicates (API rejects non-unique IDs)
      const seenToolCallIds = new Set<string>();

      for (const toolMsg of toolMessages) {
        const toolCall = toolMsg.metadata!.toolCall!;

        // Non-revival: a deferred result row supersedes its original pending
        // message. Emit only the deferred row so each toolCallId appears
        // exactly once in the converted batch.
        if (
          !isRevival &&
          !toolCall.isDeferred &&
          supersededToolCallIds.has(toolCall.toolCallId)
        ) {
          continue;
        }

        // In revival context: use a fresh synthetic toolCallId for deferred results so the
        // AI SDK doesn't see duplicate IDs (the original pending call already used this ID).
        // This lets revival AI see: [original pending call] → [STEP_OK response] → [deferred final result]
        // giving it full context about the async lifecycle.
        // In non-revival context: original is superseded (stripped), so deferred uses its real ID.
        const effectiveToolCallId =
          isRevival && toolCall.isDeferred && toolCall.originalToolCallId
            ? `deferred-${toolCall.toolCallId}`
            : toolCall.toolCallId;

        // Duplicate toolCallIds must never reach the provider (API rejects
        // non-unique IDs). With superseded originals stripped above, a
        // duplicate here means two non-deferred rows share a toolCallId -
        // an invariant violation in message creation, not a display concern.
        if (seenToolCallIds.has(effectiveToolCallId)) {
          logger.error(
            "[MessageConverter] Duplicate toolCallId in batch - dropping later occurrence",
            {
              toolCallId: effectiveToolCallId,
              toolName: toolCall.toolName,
              messageId: isChatMessage(toolMsg) ? toolMsg.id : "unknown",
            },
          );
          continue;
        }

        seenToolCallIds.add(effectiveToolCallId);

        // Add tool call to assistant message content.
        toolCallContent.push({
          type: "tool-call",
          toolCallId: effectiveToolCallId,
          toolName: toolCall.toolName,
          input: toolCall.args,
        });

        // Create tool result message.
        // See buildOutputForToolCall for the placeholder precedence ladder.
        const output: ToolResultOutput | null = await buildOutputForToolCall(
          toolCall,
          logger,
          modelConfig,
          isCurrentTurn,
          resolvedDispatchToolCallIds,
          fetchImpl,
        );

        if (output !== null) {
          toolResultMessages.push({
            role: "tool",
            content: [
              {
                type: "tool-result",
                toolCallId: effectiveToolCallId,
                toolName: toolCall.toolName,
                output,
              },
            ],
          });
        }
      }

      // Every tool message in the group was a superseded original (its
      // deferred result lives in a later group) - nothing to emit here.
      if (toolCallContent.length === 0) {
        continue;
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

    // Convert the message first - some messages (empty assistant with no tool calls)
    // return null and should be fully skipped including their metadata system message.
    // toAiSdkMessage can return a single message, an array of messages, or null
    const converted = await toAiSdkMessage(
      msg,
      logger,
      modelConfig,
      undefined,
      resolvedDispatchToolCallIds,
      fetchImpl,
    );
    if (converted === null) {
      // Message was filtered (e.g. empty assistant) - skip metadata injection too
      // to avoid orphaned system messages that could confuse the provider.
      continue;
    }

    // Inject metadata system message before user/assistant messages.
    // Only for full ChatMessage objects (not simple { role, content } objects).
    // Only emit once per sequenceId - sequential tool calls share a sequenceId across
    // their placeholder ASSISTANT + TOOL chain, so we skip duplicate injections.
    if (
      isChatMessage(msg) &&
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
          logger,
        );
        result.push({
          role: "system",
          content: metadataContent,
        });
      }
    }

    // Add the converted message(s)
    if (Array.isArray(converted)) {
      result.push(...converted);
    } else {
      result.push(converted);
    }
  }

  // Provider invariant pass: tool_use IDs must be unique within one request,
  // but some providers (e.g. kimi) number tool calls per RESPONSE - two turns
  // that each call the same tool re-use the same ID string
  // (functions.tool-help:0). Those are distinct real calls, so later
  // occurrences are REMAPPED to a unique suffix (and their adjacent
  // tool-results patched to match) - never dropped, the model keeps the
  // full call/result history. A tool-result whose call is entirely absent
  // (orphan) is invalid at the provider; dropping its LAST part drops the
  // message itself right here — the final array is valid by construction,
  // with no trailing cleanup sweep.
  //
  // NOTE (toolless models, supportsTools:false — native image gen): structured
  // tool-call/tool-result parts stay UNFLATTENED even for these models. The
  // provider (OpenRouter/Google) accepts them with zero declared tools AND
  // passes the model's own emitted tool calls through (native_finish_reason
  // UNEXPECTED_TOOL_CALL) — T11c depends on exactly that. An experiment that
  // flattened tool history into bracketed text made the model imitate the
  // BRACKET TEXT in its reply instead of emitting structured calls — worse.
  // What actually keeps native generation on track is the trailing-system
  // reorder (appendTrailingSystemMessages: the user ask stays LAST) plus not
  // declaring tool schemas on the request (setup.ts toolsOverride gate).
  const globalSeenToolCallIds = new Set<string>();
  const pendingRemap = new Map<string, string>();
  const finalMessages: ModelMessage[] = [];
  for (let k = 0; k < result.length; k++) {
    const msg = result[k];
    if (msg.role === "assistant" && Array.isArray(msg.content)) {
      let changed = false;
      const remapped = msg.content.map((part, p) => {
        if (!part || part.type !== "tool-call") {
          return part;
        }
        const toolPart = part as ToolCallPart;
        if (globalSeenToolCallIds.has(toolPart.toolCallId)) {
          const newId = `${toolPart.toolCallId}#h${String(k)}-${String(p)}`;
          pendingRemap.set(toolPart.toolCallId, newId);
          globalSeenToolCallIds.add(newId);
          changed = true;
          logger.debug(
            "[MessageConverter] Remapped provider-reused toolCallId in history",
            { from: toolPart.toolCallId, to: newId },
          );
          return { ...toolPart, toolCallId: newId };
        }
        globalSeenToolCallIds.add(toolPart.toolCallId);
        return part;
      });
      finalMessages.push(changed ? { ...msg, content: remapped } : msg);
      continue;
    }
    if (msg.role === "tool" && Array.isArray(msg.content)) {
      let changed = false;
      const keptParts: typeof msg.content = [];
      for (const part of msg.content) {
        if (part.type !== "tool-result") {
          keptParts.push(part);
          continue;
        }
        const remappedId = pendingRemap.get(part.toolCallId);
        if (remappedId) {
          // This result belongs to the most recent remapped call - the
          // original call's own result already passed through earlier.
          pendingRemap.delete(part.toolCallId);
          changed = true;
          keptParts.push({ ...part, toolCallId: remappedId });
          continue;
        }
        if (!globalSeenToolCallIds.has(part.toolCallId)) {
          logger.warn("[MessageConverter] Removing orphaned tool-result", {
            toolCallId: part.toolCallId,
          });
          changed = true;
          continue;
        }
        keptParts.push(part);
      }
      if (keptParts.length === 0) {
        // Every part was an orphaned tool-result — the message has no valid
        // representation at the provider; skip it entirely.
        continue;
      }
      finalMessages.push(changed ? { ...msg, content: keptParts } : msg);
      continue;
    }
    finalMessages.push(msg);
  }
  return finalMessages;
}
