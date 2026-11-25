import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import v1MediaFileEndpoints from "./definition";
import { V1MediaFileRepository } from "./repository";

export const { GET, HEAD, tools } = endpointsHandler({
  headFromGet: true,
  endpoint: v1MediaFileEndpoints,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, locale, logger, request, t }) =>
      V1MediaFileRepository.download({
        threadId: urlPathParams.threadId,
        filename: urlPathParams.filename,
        expires: data.expires,
        sig: data.sig,
        user,
        locale,
        logger,
        request,
        t,
      }),
  },
});
