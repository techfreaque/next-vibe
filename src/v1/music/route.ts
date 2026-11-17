import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import v1MusicEndpoints from "./definition";
import { V1MusicRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: v1MusicEndpoints,
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
      V1MusicRepository.create({
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
