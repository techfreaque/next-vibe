/**
 * Remove Invoice Line Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import lineRemoveDefinitions from "./definition";
import { InvoiceLineRemoveRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: lineRemoveDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      InvoiceLineRemoveRepository.removeLine(
        user.id,
        urlPathParams,
        logger,
        locale,
      ),
  },
});
