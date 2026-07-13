import "server-only";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { createEndpointEmitter } from "next-vibe/realtime/emitter";

import type { ResolvedRelayContext } from "@/app/api/[locale]/system/realtime/remote-event-bridge/relay-context";

import type { DefaultFolderId } from "../config";
import threadsDefinitions, {
  type ThreadsGetWsEmit,
  type ThreadsPostWsEmit,
} from "./definition";

/**
 * The threads list channel key. Threads GET marks rootFolderId + subFolderId as
 * includeInCacheKey, so the client subscribes per folder view — the emitter MUST
 * carry the same values, or it emits to a different channel than the one watched.
 */
export interface ThreadsChannelRouting {
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
  resolvedRelayContext?: ResolvedRelayContext;
}

// Threads list is `scope:"user"` (channel = owner's `user/{id}`) keyed by the
// folder view's rootFolderId + subFolderId.
export function createThreadsGetEmitter(
  logger: EndpointLogger,
  user: JwtPayloadType,
  routing: ThreadsChannelRouting,
): ThreadsGetWsEmit {
  return createEndpointEmitter(threadsDefinitions.GET, logger, user, {
    requestData: {
      rootFolderId: routing.rootFolderId,
      subFolderId: routing.subFolderId,
    },
    resolvedRelayContext: routing.resolvedRelayContext,
  });
}

export function createThreadsPostEmitter(
  logger: EndpointLogger,
  user: JwtPayloadType,
  options?: { resolvedRelayContext?: ResolvedRelayContext },
): ThreadsPostWsEmit {
  // threads POST has no url params and no cache-key fields → no channel binding.
  return createEndpointEmitter(threadsDefinitions.POST, logger, user, {
    resolvedRelayContext: options?.resolvedRelayContext,
  });
}
