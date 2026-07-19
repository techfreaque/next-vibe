import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { DescribeImageRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger, t, toolExecutionContext }) =>
      DescribeImageRepository.describeImage(
        data,
        user,
        locale,
        logger,
        t,
        toolExecutionContext.favoriteId,
        toolExecutionContext,
      ),
  },
});
