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

/**
 * The messages channel is keyed by `threadId` (route param) + `rootFolderId`
 * (an includeInCacheKey field). Both must be supplied so the server-side WS
 * channel key matches the client's subscription key. Typed to catch mismatches
 * at compile time.
 */
export interface MessagesChannelRouting {
  threadId: string;
  rootFolderId: DefaultFolderId;
}

/**
 * Folders where the AI stream runner's user identity differs from the viewer's.
 * PUBLIC: everyone can watch; SHARED: link-shared viewers have their own identity.
 * For these, events must be broadcast to the endpoint's ws-channel (all subscribers)
 * rather than the owner's user-channel.
 */
const BROADCAST_FOLDER_IDS: ReadonlySet<DefaultFolderId> = new Set([
  DefaultFolderId.PUBLIC,
  DefaultFolderId.SHARED,
]);

/**
 * The channel binding for a messages emitter: threadId routes the channel,
 * rootFolderId scopes it, and the folder decides owner-private vs shared delivery
 * (messages GET is `scope:"resolved"`, so the kind is resolved here).
 */
function messagesChannelBinding(
  routing: MessagesChannelRouting,
): ChannelBinding<typeof messagesDefinitions.GET> {
  return {
    urlPathParams: { threadId: routing.threadId },
    requestData: { rootFolderId: routing.rootFolderId },
    kindOverride: BROADCAST_FOLDER_IDS.has(routing.rootFolderId)
      ? "resource"
      : "user",
  };
}

/** Non-batched emitter for the messages channel — for one-shot emits outside streaming. */
export function createMessagesGetEmitter(
  logger: EndpointLogger,
  user: JwtPayloadType,
  routing: MessagesChannelRouting,
): MessagesWsEmit {
  return createEndpointEmitter(
    messagesDefinitions.GET,
    logger,
    user,
    messagesChannelBinding(routing),
  );
}

/**
 * Build an emitter for the messages channel of a thread.
 *
 * When fanOut=false (connector replaying a peer stream), remote relay is
 * suppressed to break echo loops.
 */
export function createMessagesEmitter(
  logger: EndpointLogger,
  user: JwtPayloadType,
  routing: MessagesChannelRouting,
  options?: { fanOut?: boolean },
): MessagesWsEmit {
  return createEndpointEmitter(messagesDefinitions.GET, logger, user, {
    ...messagesChannelBinding(routing),
    fanOut: options?.fanOut ?? true,
  });
}
