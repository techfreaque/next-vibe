import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import v1AudioTranslationsEndpoints from "./definition";
import { V1AudioTranslationsRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: v1AudioTranslationsEndpoints,
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
      V1AudioTranslationsRepository.translate({
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
