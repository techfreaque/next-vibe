import "server-only";

import type { DefaultFolderId } from "next-vibe/agent/chat/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { createEndpointEmitter } from "next-vibe/realtime/emitter";
import type { ResolvedRelayContext } from "next-vibe/realtime/remote-event-bridge/relay-context";

import folderContentsDefinitions, {
  type FolderContentsGetWsEmit,
} from "./definition";
import { FolderContentsRepository } from "./repository";

/**
 * Folder-contents emitter, bound to one `rootFolderId` channel. The folder's
 * trust class (PUBLIC/SHARED → shared resource channel, else the owner's own)
 * resolves the channel kind — the same trust the subscribe-side resolveChannel
 * applies — so list events for a public/shared folder reach all its viewers.
 * folder-contents GET is `scope:"resolved"`, so the kind binds here as kindOverride.
 */
export function createFolderContentsEmitter(
  logger: EndpointLogger,
  user: JwtPayloadType,
  rootFolderId: DefaultFolderId,
  options?: {
    fanOut?: boolean;
    subFolderId?: string | null;
    resolvedRelayContext?: ResolvedRelayContext;
  },
): FolderContentsGetWsEmit {
  return createEndpointEmitter(folderContentsDefinitions.GET, logger, user, {
    urlPathParams: { rootFolderId },
    ...(options?.fanOut === false ? { fanOut: false as const } : {}),
    // folder-contents GET keys on subFolderId/threadIds (includeInCacheKey), and
    // the WS CHANNEL keys on those same fields — so a viewer of a NESTED folder
    // (subFolderId set) is on a DIFFERENT channel than the root view. List events
    // must therefore target the channel of the folder the item actually lives in:
    // pass `subFolderId` = the thread's folderId so the nested-folder viewer
    // receives it. Omitted / null → the root view's channel (subFolderId
    // undefined), matching a root-level item. threadIds is never a channel filter.
    requestData: {
      subFolderId: options?.subFolderId ?? undefined,
      threadIds: undefined,
    },
    kindOverride:
      FolderContentsRepository.emitChannelForFolder(rootFolderId).kind,
    resolvedRelayContext: options?.resolvedRelayContext,
  });
}
