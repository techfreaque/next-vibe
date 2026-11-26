/**
 * Remove Bill Line Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import lineRemoveDefinitions from "./definition";
import { BillLineRemoveRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: lineRemoveDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      BillLineRemoveRepository.removeLine(
        user.id,
        urlPathParams,
        logger,
        locale,
      ),
  },
});
