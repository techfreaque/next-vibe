import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import v1AudioTranscriptionsEndpoints from "./definition";
import { V1AudioTranscriptionsRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: v1AudioTranscriptionsEndpoints,
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
      V1AudioTranscriptionsRepository.transcribe({
        data,
        task: "transcribe",
        user,
        locale,
        logger,
        request,
        t,
        toolExecutionContext,
      }),
  },
});
