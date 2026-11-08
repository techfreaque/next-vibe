import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import v1ChatCompletionsEndpoints from "./definition";
import { V1ChatCompletionsRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: v1ChatCompletionsEndpoints,
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
      V1ChatCompletionsRepository.complete({
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
