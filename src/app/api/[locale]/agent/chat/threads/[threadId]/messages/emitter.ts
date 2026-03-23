/**
 * Messages Channel Emitter
 *
 * Server-side emitter for broadcasting stream events on the messages WS channel.
 * Events are defined on the messages GET endpoint (definition.ts) and emitted by
 * ai-stream repository during streaming.
 *
 * The channel is derived from the messages endpoint path - no hardcoded strings.
 * The payload is typed via StreamEvent - a discriminated union correlating type + data.
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { publishWsEvent } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";

import { buildMessagesChannel } from "./channel";
import type { StreamEvent } from "./events";

/**
 * Callback for broadcasting stream events over WebSocket.
 * Accepts a full StreamEvent - discriminated union preserves type correlation.
 */
export type WsEmitCallback = (event: StreamEvent) => void;

/**
 * Create a WsEmitCallback that publishes to the messages WS channel.
 * Each call serializes the StreamEvent and POSTs it to the WS sidecar.
 */
export function createMessagesEmitter(
  threadId: string,
  logger: EndpointLogger,
): WsEmitCallback {
  const channel = buildMessagesChannel(threadId);

  return (event: StreamEvent): void => {
    publishWsEvent({ channel, event: event.type, data: event.data }, logger);
  };
}
