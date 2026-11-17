import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { V1MusicRepository } from "../../repository";
import v1MusicContentEndpoints from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: v1MusicContentEndpoints,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, locale, logger, request, t }) =>
      V1MusicRepository.content({
        id: urlPathParams.id,
        user,
        locale,
        logger,
        request,
        t,
      }),
  },
});
