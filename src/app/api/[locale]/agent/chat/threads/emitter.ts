import "server-only";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { createEndpointEmitter } from "next-vibe/realtime/emitter";

import type { DefaultFolderId } from "../config";
import threadsDefinitions, {
  type ThreadsGetWsEmit,
  type ThreadsPostWsEmit,
} from "./definition";

export function createThreadsGetEmitter(
  logger: EndpointLogger,
  user: JwtPayloadType,
): ThreadsGetWsEmit {
  return createEndpointEmitter(threadsDefinitions.GET, logger, user);
}

export function createThreadsPostEmitter(
  logger: EndpointLogger,
  user: JwtPayloadType,
): ThreadsPostWsEmit {
  // threads POST has no url params and no cache-key fields → no channel binding.
  return createEndpointEmitter(threadsDefinitions.POST, logger, user);
}
