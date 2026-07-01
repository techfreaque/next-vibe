import "server-only";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { createEndpointEmitter } from "next-vibe/realtime/emitter";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";

import folderContentsDefinitions, {
  type FolderContentsGetWsEmit,
} from "./definition";
import { FolderContentsRepository } from "./repository";

export function createFolderContentsEmitter(
  logger: EndpointLogger,
  user: JwtPayloadType,
): FolderContentsGetWsEmit {
  return createEndpointEmitter(folderContentsDefinitions.GET, logger, user);
}
