import "server-only";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { createEndpointEmitter } from "next-vibe/realtime/emitter";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";

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
): FolderContentsGetWsEmit {
  return createEndpointEmitter(folderContentsDefinitions.GET, logger, user);
}
