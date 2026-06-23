/**
 * Remote Event Bridge Route
 *
 * Two paths, same code:
 *   HTTP POST  → handler()         (direct-http peers call this directly)
 *   WS event   → onRemoteEvent     (reverse-WS peers send wire messages)
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
    onRemoteEvent: {
      "remote-event": async (payload, ctx) =>
        RemoteEventBridgeRepository.handleRemoteEvent(
          payload,
          ctx.user.id,
          ctx.logger,
        ),
    },
  },
});
