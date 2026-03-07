/**
 * AI Stream Events
 * 100% typesafe event definitions shared between server and client
 */

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { ErrorResponseType } from "@/app/api/[locale]/shared/types/response.schema";

import type { MessageMetadata, ToolCall, ToolCallResult } from "../../../db";
import type { ChatMessageRole } from "../../../enum";

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
  // Thread metadata update event
  THREAD_TITLE_UPDATED = "thread-title-updated",
  // Stream lifecycle event — unambiguous "stream is completely done" signal
  STREAM_FINISHED = "stream-finished",
}

/**
 * Message created event data
 */
export interface MessageCreatedEventData {
  messageId: string;
  threadId: string;
  role: ChatMessageRole;
  parentId: string | null;
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
 * Thread title updated event data
 * Emitted when the thread title is set from the user message content.
 * Fired on new threads (send operation) and when STT transcription sets the title.
 */
export interface ThreadTitleUpdatedEventData {
  /** Thread ID */
  threadId: string;
  /** New title derived from message content */
  title: string;
}

/**
 * Stream finished event data
 * Emitted once when the entire stream (including all tool loops) is completely done.
 * This is the definitive "stream is over" signal for client cleanup.
 */
export interface StreamFinishedEventData {
  /** Thread ID */
  threadId: string;
  /** How the stream ended: "completed" | "cancelled" | "error" | "timeout" */
  reason: "completed" | "cancelled" | "error" | "timeout";
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
  // Thread metadata
  [StreamEventType.THREAD_TITLE_UPDATED]: ThreadTitleUpdatedEventData;
  // Stream lifecycle
  [StreamEventType.STREAM_FINISHED]: StreamFinishedEventData;
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

  threadTitleUpdated: (
    data: ThreadTitleUpdatedEventData,
  ): StreamEvent<StreamEventType.THREAD_TITLE_UPDATED> => ({
    type: StreamEventType.THREAD_TITLE_UPDATED,
    data,
  }),

  streamFinished: (
    data: StreamFinishedEventData,
  ): StreamEvent<StreamEventType.STREAM_FINISHED> => ({
    type: StreamEventType.STREAM_FINISHED,
    data,
  }),
};
