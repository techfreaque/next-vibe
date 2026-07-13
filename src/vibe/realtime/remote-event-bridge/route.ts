/**
 * Remote Event Bridge Route
 *
 * HTTP POST — direct-http peers POST a remote-event frame here.
 * Reverse-WS peers are handled directly by connector → RemoteEventBridgeRepository.handleRemoteEvent.
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { endpoints } from "./definition";
import { RemoteEventBridgeRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, logger }) =>
      RemoteEventBridgeRepository.receive(data, user, logger),
  },
});
