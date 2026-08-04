import "server-only";

import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import {
  type ChannelBinding,
  createEndpointEmitter,
} from "next-vibe/realtime/core/emitter";
import type { ResolvedRelayContext } from "next-vibe/realtime/core/relay-context";
import type { EmitEventNamed } from "next-vibe/realtime/core/structured-events";

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
  resolvedRelayContext?: ResolvedRelayContext;
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

/**
 * Incognito threads NEVER leave the instance: they have no DB row, so a
 * relayed event would materialize an orphaned mirror stub on the peer.
 * Local WS delivery (the viewer's own UI) is unaffected.
 */
function messagesFanOut(
  routing: MessagesChannelRouting,
  requested: boolean | undefined,
): boolean {
  if (routing.rootFolderId === DefaultFolderId.INCOGNITO) {
    return false;
  }
  return requested ?? true;
}

/** Non-batched emitter for the messages channel — for one-shot emits outside streaming. */
export function createMessagesGetEmitter(
  logger: EndpointLogger,
  user: JwtPayloadType,
  routing: MessagesChannelRouting,
): MessagesWsEmit {
  return createEndpointEmitter(messagesDefinitions.GET, logger, user, {
    ...messagesChannelBinding(routing),
    fanOut: messagesFanOut(routing, undefined),
    resolvedRelayContext: routing.resolvedRelayContext,
  });
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
    fanOut: messagesFanOut(routing, options?.fanOut),
    resolvedRelayContext: routing.resolvedRelayContext,
  });
}
