import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { reviewCostHistory } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale, t }) =>
      reviewCostHistory(
        data.companyId,
        data.history,
        user.id,
        logger,
        locale,
        t,
      ),
  },
});
