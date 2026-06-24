import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import { createEndpointEmitter } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import type { EmitEventNamed } from "@/app/api/[locale]/system/unified-interface/websocket/structured-events";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import messagesDefinitions from "./definition";

type GET = typeof messagesDefinitions.GET;
type MessagesEventPayloads = ComputeEventPayloads<
  GET["types"]["ResponseOutput"],
  GET["types"]["RequestOutput"],
  GET["types"]["Events"]
>;

/** Typed emit callback for the messages WS channel — fully inferred from the definition. */
export type MessagesWsEmit = EmitEventNamed<MessagesEventPayloads>;

/** Typed emit callback alias used by stream context and TTS handler. */
export type WsEmitCallback = MessagesWsEmit;

/**
 * A messages-channel event as a discriminated {name, payload} pair — keeps the
 * event name correlated with its typed payload across the union so a replayed
 * wire event stays type-safe.
 */
export type MessagesEventInput = {
  [K in keyof MessagesEventPayloads & string]: {
    name: K;
    payload: MessagesEventPayloads[K];
  };
}[keyof MessagesEventPayloads & string];

/** Non-batched emitter for the messages channel — for one-shot emits outside streaming. */
export function createMessagesGetEmitter(
  threadId: string,
  logger: EndpointLogger,
  user: JwtPayloadType,
): MessagesWsEmit {
  return createEndpointEmitter(messagesDefinitions.GET, logger, user, {
    threadId,
  });
}

/**
 * Build a batching emitter for the messages channel of a thread.
 * High-frequency events (content-delta, compacting-delta) accumulate into a
 * single WS frame. The batcher is flushed by the TTS handler at stream end.
 *
 * When fanOut=false (connector replaying a peer stream), remote relay is
 * suppressed to break echo loops.
 */
export function createMessagesEmitter(
  threadId: string,
  logger: EndpointLogger,
  user: JwtPayloadType,
  options?: { fanOut?: boolean },
): MessagesWsEmit {
  const fanOut = options?.fanOut ?? true;

  return createEndpointEmitter(
    messagesDefinitions.GET,
    logger,
    user,
    { threadId },
    {
      fanOut,
    },
  );
}
