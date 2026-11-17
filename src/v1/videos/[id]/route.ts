import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { V1VideosRepository } from "../repository";
import v1VideoEndpoints from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: v1VideoEndpoints,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, locale, logger, request, t }) =>
      V1VideosRepository.get({
        id: urlPathParams.id,
        user,
        locale,
        logger,
        request,
        t,
      }),
  },
});
