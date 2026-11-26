import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { BillMailboxRepository } from "../repository";
import endpoint from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger, cronTaskId }) =>
      BillMailboxRepository.sync(
        data.dryRun,
        data.limit,
        user.id,
        locale,
        logger,
        Boolean(cronTaskId),
      ),
  },
});
