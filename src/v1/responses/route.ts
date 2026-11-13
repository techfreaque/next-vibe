import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import v1ResponsesEndpoints from "./definition";
import { V1ResponsesRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: v1ResponsesEndpoints,
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
    }) =>
      V1ResponsesRepository.create({
        data,
        user,
        locale,
        logger,
        request,
        t,
        toolExecutionContext,
      }),
  },
});
