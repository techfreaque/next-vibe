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
      "endpoint-event": async (payload, ctx) =>
        RemoteEventBridgeRepository.handleEndpointEvent(
          payload,
          "id" in ctx.user && typeof ctx.user.id === "string"
            ? ctx.user.id
            : null,
          ctx.logger,
        ),
      "live-message-event": async (payload, ctx) =>
        RemoteEventBridgeRepository.handleLiveMessageEvent(
          payload,
          "id" in ctx.user && typeof ctx.user.id === "string"
            ? ctx.user.id
            : null,
          ctx.logger,
        ),
    },
  },
});
