/**
 * Thread Rename API Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { ThreadRenameRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, user, locale, logger, streamContext }) =>
      ThreadRenameRepository.renameThread(
        data,
        user,
        locale,
        logger,
        streamContext,
      ),
  },
});
