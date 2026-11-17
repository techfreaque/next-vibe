import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import v1VideosEndpoints from "./definition";
import { V1VideosRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: v1VideosEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({
      data,
      user,
      locale,
      logger,
      request,
      t,
      toolExecutionContext,
      platform,
    }) =>
      V1VideosRepository.create({
        data,
        user,
        locale,
        logger,
        request,
        t,
        toolExecutionContext,
        platform,
      }),
  },
});
