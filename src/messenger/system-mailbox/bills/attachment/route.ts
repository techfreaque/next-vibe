import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { BillMailboxRepository } from "../repository";
import endpoint from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      BillMailboxRepository.attachment(
        data.reviewId,
        data.index,
        user.id,
        locale,
        logger,
      ),
  },
});
