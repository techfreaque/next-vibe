/**
 * Remote Event Bridge Route
 *
 * HTTP POST — direct-http peers POST a remote-event frame here.
 * Reverse-WS peers are handled directly by connector → RemoteEventBridgeRepository.handleRemoteEvent.
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { endpoints } from "./definition";
import { RemoteEventBridgeRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, logger }) =>
      RemoteEventBridgeRepository.receive(data, user, logger),
  },
});
