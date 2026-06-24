import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import { createEndpointEmitter } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

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
  return createEndpointEmitter(threadsDefinitions.POST, logger, user);
}
