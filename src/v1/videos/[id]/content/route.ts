import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { V1VideosRepository } from "../../repository";
import v1VideoContentEndpoints from "./definition";

export const { GET, HEAD, tools } = endpointsHandler({
  headFromGet: true,
  endpoint: v1VideoContentEndpoints,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, locale, logger, request, t }) =>
      V1VideosRepository.content({
        id: urlPathParams.id,
        user,
        locale,
        logger,
        request,
        t,
      }),
  },
});
