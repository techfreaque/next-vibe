import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { V1ImagesRepository } from "../repository";
import v1ImagesEditsEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: v1ImagesEditsEndpoints,
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
      V1ImagesRepository.edit({
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
