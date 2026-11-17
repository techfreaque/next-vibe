import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { V1MusicRepository } from "../repository";
import v1MusicJobEndpoints from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: v1MusicJobEndpoints,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, locale, logger, request, t }) =>
      V1MusicRepository.get({
        id: urlPathParams.id,
        user,
        locale,
        logger,
        request,
        t,
      }),
  },
});
