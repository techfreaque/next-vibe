import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import v1AudioSpeechEndpoints from "./definition";
import { V1AudioSpeechRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: v1AudioSpeechEndpoints,
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
      V1AudioSpeechRepository.speak({
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
