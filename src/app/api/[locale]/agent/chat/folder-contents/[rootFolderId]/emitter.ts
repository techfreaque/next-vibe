import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import { createEndpointEmitter } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import folderContentsDefinitions, {
  type FolderContentsGetWsEmit,
} from "./definition";

export function createFolderContentsEmitter(
  logger: EndpointLogger,
  user: JwtPayloadType,
): FolderContentsGetWsEmit {
  return createEndpointEmitter(folderContentsDefinitions.GET, logger, user);
}
