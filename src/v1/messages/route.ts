import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import v1MessagesEndpoints from "./definition";
import { V1MessagesRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: v1MessagesEndpoints,
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
      V1MessagesRepository.create({
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
