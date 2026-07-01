import "server-only";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import {
  type ChannelBinding,
  createEndpointEmitter,
} from "next-vibe/realtime/emitter";
import type { EmitEventNamed } from "next-vibe/realtime/structured-events";

import { DefaultFolderId } from "../../../config";
import messagesDefinitions from "./definition";

export type MessagesWsEmit = EmitEventNamed<
  (typeof messagesDefinitions.GET)["types"]["EventResponsePayloads"],
  (typeof messagesDefinitions.GET)["types"]["EventRequestPayloads"],
  (typeof messagesDefinitions.GET)["types"]["EventEmitUrlPayloads"],
  (typeof messagesDefinitions.GET)["types"]["EventPayloadTypes"]
>;

/** Non-batched emitter for the messages channel — for one-shot emits outside streaming. */
export function createMessagesGetEmitter(
  logger: EndpointLogger,
  user: JwtPayloadType,
): MessagesWsEmit {
  return createEndpointEmitter(messagesDefinitions.GET, logger, user);
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
  logger: EndpointLogger,
  user: JwtPayloadType,
  options?: { fanOut?: boolean },
): MessagesWsEmit {
  const fanOut = options?.fanOut ?? true;

  return createEndpointEmitter(messagesDefinitions.GET, logger, user, {
    fanOut,
  });
}
