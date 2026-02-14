/**
 * AI Stream SSE Events
 * 100% typesafe event definitions shared between server and client
 */

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { ErrorResponseType } from "@/app/api/[locale]/shared/types/response.schema";

import type { MessageMetadata, ToolCall, ToolCallResult } from "../chat/db";
import type { ChatMessageRole } from "../chat/enum";

/**
 * SSE Protocol Constants
 * Shared between server and client for parsing SSE events
 */
export const SSE_EVENT_PREFIX = "event: ";
export const SSE_DATA_PREFIX = "data: ";
export const SSE_EVENT_SEPARATOR = "\n\n";

/**
 * Event type enum - single source of truth for all event types
 */
export enum StreamEventType {
  MESSAGE_CREATED = "message-created",
  CONTENT_DELTA = "content-delta",
  CONTENT_DONE = "content-done",
  REASONING_DELTA = "reasoning-delta",
  REASONING_DONE = "reasoning-done",
  TOOL_CALL = "tool-call",
  TOOL_WAITING = "tool-waiting",
  TOOL_RESULT = "tool-result",
  ERROR = "error",
  // Voice mode events
  VOICE_TRANSCRIBED = "voice-transcribed",
  AUDIO_CHUNK = "audio-chunk",
  // File upload event
  FILES_UPLOADED = "files-uploaded",
  // Credit deduction event
  CREDITS_DEDUCTED = "credits-deducted",
  // Token metadata event
  TOKENS_UPDATED = "tokens-updated",
  // Compacting events
  COMPACTING_DELTA = "compacting-delta",
  COMPACTING_DONE = "compacting-done",
}

/**
 * Message created event data
 */
export interface MessageCreatedEventData {
  messageId: string;
  threadId: string;
  role: ChatMessageRole;
  parentId: string | null;
  depth: number;
  content: string | null;
  model: ModelId | null;
  character: string | null;
  sequenceId?: string | null; // Links messages in the same AI response sequence
  toolCall?: ToolCall; // Tool call for TOOL role messages (singular - each TOOL message has exactly one tool call)
  metadata?: MessageMetadata; // Message metadata including attachments, tokens, etc.
}

/**
 * Content delta event data
 */
export interface ContentDeltaEventData {
  messageId: string;
  delta: string;
}

/**
 * Content done event data
 */
export interface ContentDoneEventData {
  messageId: string;
  content: string;
  totalTokens: number | null;
  finishReason: string | null;
}

/**
 * Reasoning delta event data
 */
export interface ReasoningDeltaEventData {
  messageId: string;
  delta: string;
}

/**
 * Reasoning done event data
 */
export interface ReasoningDoneEventData {
  messageId: string;
  content: string;
}

/**
 * Tool call event data
 */
export interface ToolCallEventData {
  messageId: string;
  toolName: string;
  args: ToolCallResult;
}

/**
 * Tool waiting event data
 */
export interface ToolWaitingEventData {
  messageId: string;
  toolName: string;
  toolCallId: string;
}

/**
 * Tool result event data
 */
export interface ToolResultEventData {
  messageId: string;
  toolName: string;
  result: ToolCallResult | undefined;
  error?: ErrorResponseType; // Tool execution error message
  toolCall?: ToolCall; // Full tool call data with result for frontend rendering
}

/**
 * Error event data
 */
export interface ErrorEventData {
  code: string;
  message: string;
  details?: string;
}

/**
 * Compacting delta event data
 * Streamed as history is being compacted
 */
export interface CompactingDeltaEventData {
  messageId: string;
  delta: string;
}

/**
 * Compacting done event data
 * Emitted when history compacting completes
 */
export interface CompactingDoneEventData {
  messageId: string;
  content: string;
  metadata: {
    isCompacting: true;
    compactedMessageCount: number;
  };
}

/**
 * Voice transcribed event data
 * Emitted when STT completes in voice mode (before LLM processes)
 */
export interface VoiceTranscribedEventData {
  /** User message ID that contains the audio */
  messageId: string;
  /** Transcribed text from user's voice */
  text: string;
  /** Confidence score (0-1) if available */
  confidence: number | null;
  /** Duration of the audio in seconds */
  durationSeconds: number | null;
}

/**
 * Audio chunk event data
 * Emitted for streaming TTS - each chunk is a playable audio segment
 */
export interface AudioChunkEventData {
  /** Message ID this audio belongs to */
  messageId: string;
  /** Base64-encoded audio data (data URL format) */
  audioData: string;
  /** Chunk index (0-based) */
  chunkIndex: number;
  /** Whether this is the final chunk */
  isFinal: boolean;
  /** Text that was converted to this audio */
  text: string;
}

/**
 * Files uploaded event data
 * Emitted when file attachments finish uploading to storage (server threads only)
 */
export interface FilesUploadedEventData {
  /** Message ID that contains the attachments */
  messageId: string;
  /** Uploaded attachment metadata */
  attachments: Array<{
    id: string;
    url: string;
    filename: string;
    mimeType: string;
    size: number;
  }>;
}

/**
 * Credits deducted event data
 * Emitted when credits are deducted for tool calls or model usage
 */
export interface CreditsDeductedEventData {
  /** Amount of credits deducted */
  amount: number;
  /** Feature/model that consumed the credits */
  feature: string;
  /** Type of deduction: tool or model */
  type: "tool" | "model";
  /** Whether this was a partial deduction (insufficient funds) */
  partial?: boolean;
}

/**
 * Tokens updated event data
 * Emitted when final token counts are available for a message
 */
export interface TokensUpdatedEventData {
  /** Message ID */
  messageId: string;
  /** Input/prompt tokens */
  promptTokens: number;
  /** Output/completion tokens */
  completionTokens: number;
  /** Total tokens */
  totalTokens: number;
  /** Finish reason */
  finishReason: string | null;
  /** Actual credit cost based on real token usage */
  creditCost: number;
}

/**
 * Event type to data mapping
 */
export interface StreamEventDataMap {
  [StreamEventType.MESSAGE_CREATED]: MessageCreatedEventData;
  [StreamEventType.CONTENT_DELTA]: ContentDeltaEventData;
  [StreamEventType.CONTENT_DONE]: ContentDoneEventData;
  [StreamEventType.REASONING_DELTA]: ReasoningDeltaEventData;
  [StreamEventType.REASONING_DONE]: ReasoningDoneEventData;
  [StreamEventType.TOOL_CALL]: ToolCallEventData;
  [StreamEventType.TOOL_WAITING]: ToolWaitingEventData;
  [StreamEventType.TOOL_RESULT]: ToolResultEventData;
  [StreamEventType.ERROR]: ErrorResponseType;
  // Voice mode events
  [StreamEventType.VOICE_TRANSCRIBED]: VoiceTranscribedEventData;
  [StreamEventType.AUDIO_CHUNK]: AudioChunkEventData;
  // File upload event
  [StreamEventType.FILES_UPLOADED]: FilesUploadedEventData;
  // Credit deduction event
  [StreamEventType.CREDITS_DEDUCTED]: CreditsDeductedEventData;
  // Token metadata event
  [StreamEventType.TOKENS_UPDATED]: TokensUpdatedEventData;
  // Compacting events
  [StreamEventType.COMPACTING_DELTA]: CompactingDeltaEventData;
  [StreamEventType.COMPACTING_DONE]: CompactingDoneEventData;
}

/**
 * Generic stream event
 */
export interface StreamEvent<T extends StreamEventType = StreamEventType> {
  type: T;
  data: StreamEventDataMap[T];
}

/**
 * Type-safe event creator functions
 */
export const createStreamEvent = {
  messageCreated: (
    data: MessageCreatedEventData,
  ): StreamEvent<StreamEventType.MESSAGE_CREATED> => ({
    type: StreamEventType.MESSAGE_CREATED,
    data,
  }),

  contentDelta: (
    data: ContentDeltaEventData,
  ): StreamEvent<StreamEventType.CONTENT_DELTA> => ({
    type: StreamEventType.CONTENT_DELTA,
    data,
  }),

  contentDone: (
    data: ContentDoneEventData,
  ): StreamEvent<StreamEventType.CONTENT_DONE> => ({
    type: StreamEventType.CONTENT_DONE,
    data,
  }),

  reasoningDelta: (
    data: ReasoningDeltaEventData,
  ): StreamEvent<StreamEventType.REASONING_DELTA> => ({
    type: StreamEventType.REASONING_DELTA,
    data,
  }),

  reasoningDone: (
    data: ReasoningDoneEventData,
  ): StreamEvent<StreamEventType.REASONING_DONE> => ({
    type: StreamEventType.REASONING_DONE,
    data,
  }),

  toolCall: (
    data: ToolCallEventData,
  ): StreamEvent<StreamEventType.TOOL_CALL> => ({
    type: StreamEventType.TOOL_CALL,
    data,
  }),

  toolWaiting: (
    data: ToolWaitingEventData,
  ): StreamEvent<StreamEventType.TOOL_WAITING> => ({
    type: StreamEventType.TOOL_WAITING,
    data,
  }),

  toolResult: (
    data: ToolResultEventData,
  ): StreamEvent<StreamEventType.TOOL_RESULT> => ({
    type: StreamEventType.TOOL_RESULT,
    data,
  }),

  error: (data: ErrorResponseType): StreamEvent<StreamEventType.ERROR> => ({
    type: StreamEventType.ERROR,
    data,
  }),

  // Voice mode event creators
  voiceTranscribed: (
    data: VoiceTranscribedEventData,
  ): StreamEvent<StreamEventType.VOICE_TRANSCRIBED> => ({
    type: StreamEventType.VOICE_TRANSCRIBED,
    data,
  }),

  audioChunk: (
    data: AudioChunkEventData,
  ): StreamEvent<StreamEventType.AUDIO_CHUNK> => ({
    type: StreamEventType.AUDIO_CHUNK,
    data,
  }),

  filesUploaded: (
    data: FilesUploadedEventData,
  ): StreamEvent<StreamEventType.FILES_UPLOADED> => ({
    type: StreamEventType.FILES_UPLOADED,
    data,
  }),

  creditsDeducted: (
    data: CreditsDeductedEventData,
  ): StreamEvent<StreamEventType.CREDITS_DEDUCTED> => ({
    type: StreamEventType.CREDITS_DEDUCTED,
    data,
  }),

  tokensUpdated: (
    data: TokensUpdatedEventData,
  ): StreamEvent<StreamEventType.TOKENS_UPDATED> => ({
    type: StreamEventType.TOKENS_UPDATED,
    data,
  }),

  compactingDelta: (
    data: CompactingDeltaEventData,
  ): StreamEvent<StreamEventType.COMPACTING_DELTA> => ({
    type: StreamEventType.COMPACTING_DELTA,
    data,
  }),

  compactingDone: (
    data: CompactingDoneEventData,
  ): StreamEvent<StreamEventType.COMPACTING_DONE> => ({
    type: StreamEventType.COMPACTING_DONE,
    data,
  }),
};

/**
 * Format SSE event for transmission
 * Uses SSE protocol constants for consistency
 * Handles error serialization for events with error fields
 */
export function formatSSEEvent<T extends StreamEventType>(
  event: StreamEvent<T>,
): string {
  let dataToSerialize = event.data;

  // Handle TOOL_RESULT events with error field - serialize all errors
  if (event.type === StreamEventType.TOOL_RESULT) {
    const toolResultData = event.data as ToolResultEventData;
    const updates: Partial<ToolResultEventData> = {};

    // Serialize top-level error field
    if (toolResultData.error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      updates.error = JSON.stringify(toolResultData.error) as any;
    }

    // Serialize error inside toolCall object
    if (toolResultData.toolCall?.error) {
      updates.toolCall = {
        ...toolResultData.toolCall,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        error: JSON.stringify(toolResultData.toolCall.error) as any,
      };
    }

    if (Object.keys(updates).length > 0) {
      dataToSerialize = {
        ...toolResultData,
        ...updates,
      } as StreamEventDataMap[T];
    }
  }

  // eslint-disable-next-line i18next/no-literal-string
  return `${SSE_EVENT_PREFIX}${event.type}\n${SSE_DATA_PREFIX}${JSON.stringify(dataToSerialize)}${SSE_EVENT_SEPARATOR}`;
}

/**
 * Parse SSE event from string
 * Uses SSE protocol constants for consistency
 * Handles error deserialization for events with error fields
 * Returns null if parsing fails
 */
export function parseSSEEvent(eventString: string): StreamEvent | null {
  try {
    const lines = eventString.trim().split("\n");
    let eventType: string | null = null;
    let eventData: string | null = null;

    for (const line of lines) {
      if (line.startsWith(SSE_EVENT_PREFIX)) {
        eventType = line.slice(SSE_EVENT_PREFIX.length).trim();
      } else if (line.startsWith(SSE_DATA_PREFIX)) {
        eventData = line.slice(SSE_DATA_PREFIX.length).trim();
      }
    }

    if (!eventType || !eventData) {
      return null;
    }

    // Validate event type
    if (
      !Object.values(StreamEventType).includes(eventType as StreamEventType)
    ) {
      return null;
    }

    let data = JSON.parse(eventData) as StreamEventDataMap[StreamEventType];

    // Handle TOOL_RESULT events with error field - deserialize all errors
    if (eventType === StreamEventType.TOOL_RESULT) {
      const toolResultData = data as ToolResultEventData;
      const updates: Partial<ToolResultEventData> = {};

      // Deserialize top-level error field
      if (toolResultData.error && typeof toolResultData.error === "string") {
        try {
          updates.error = JSON.parse(toolResultData.error) as ErrorResponseType;
        } catch {
          // If error parsing fails, keep the original string
        }
      }

      // Deserialize error inside toolCall object
      if (
        toolResultData.toolCall?.error &&
        typeof toolResultData.toolCall.error === "string"
      ) {
        try {
          const parsedError = JSON.parse(
            toolResultData.toolCall.error,
          ) as ErrorResponseType;
          updates.toolCall = {
            ...toolResultData.toolCall,
            error: parsedError,
          };
        } catch {
          // If error parsing fails, keep the original
        }
      }

      if (Object.keys(updates).length > 0) {
        data = {
          ...toolResultData,
          ...updates,
        } as StreamEventDataMap[StreamEventType];
      }
    }

    return {
      type: eventType as StreamEventType,
      data,
    };
  } catch {
    return null;
  }
}
