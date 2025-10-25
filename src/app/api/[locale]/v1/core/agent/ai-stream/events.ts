/**
 * AI Stream SSE Events
 * 100% typesafe event definitions shared between server and client
 */

import type { DefaultFolderId } from "../chat/config";
import type { ModelId } from "../chat/model-access/models";

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
  THREAD_CREATED = "thread-created",
  MESSAGE_CREATED = "message-created",
  CONTENT_DELTA = "content-delta",
  CONTENT_DONE = "content-done",
  TOOL_CALL = "tool-call",
  ERROR = "error",
}

/**
 * Thread created event data
 */
export interface ThreadCreatedEventData {
  threadId: string;
  title: string;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
}

/**
 * Message created event data
 */
export interface MessageCreatedEventData {
  messageId: string;
  threadId: string;
  role: "user" | "assistant" | "system";
  parentId: string | null;
  depth: number;
  content: string;
  model?: ModelId;
  persona?: string;
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
 * Tool call event data
 */
export interface ToolCallEventData {
  messageId: string;
  toolName: string;
  args: Record<string, string | number | boolean | null>;
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
 * Event type to data mapping
 */
export interface StreamEventDataMap {
  [StreamEventType.THREAD_CREATED]: ThreadCreatedEventData;
  [StreamEventType.MESSAGE_CREATED]: MessageCreatedEventData;
  [StreamEventType.CONTENT_DELTA]: ContentDeltaEventData;
  [StreamEventType.CONTENT_DONE]: ContentDoneEventData;
  [StreamEventType.TOOL_CALL]: ToolCallEventData;
  [StreamEventType.ERROR]: ErrorEventData;
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
  threadCreated: (
    data: ThreadCreatedEventData,
  ): StreamEvent<StreamEventType.THREAD_CREATED> => ({
    type: StreamEventType.THREAD_CREATED,
    data,
  }),

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

  toolCall: (
    data: ToolCallEventData,
  ): StreamEvent<StreamEventType.TOOL_CALL> => ({
    type: StreamEventType.TOOL_CALL,
    data,
  }),

  error: (data: ErrorEventData): StreamEvent<StreamEventType.ERROR> => ({
    type: StreamEventType.ERROR,
    data,
  }),
};

/**
 * Format SSE event for transmission
 * Uses SSE protocol constants for consistency
 */
export function formatSSEEvent<T extends StreamEventType>(
  event: StreamEvent<T>,
): string {
  // eslint-disable-next-line i18next/no-literal-string
  return `${SSE_EVENT_PREFIX}${event.type}\n${SSE_DATA_PREFIX}${JSON.stringify(event.data)}${SSE_EVENT_SEPARATOR}`;
}

/**
 * Parse SSE event from string
 * Uses SSE protocol constants for consistency
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

    const data = JSON.parse(eventData) as StreamEventDataMap[StreamEventType];

    return {
      type: eventType as StreamEventType,
      data,
    };
  } catch {
    return null;
  }
}
