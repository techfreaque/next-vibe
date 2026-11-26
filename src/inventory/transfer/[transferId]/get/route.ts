/**
 * Inventory Transfer Get API Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { InventoryTransferGetRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      InventoryTransferGetRepository.getTransfer(
        urlPathParams,
        user.id,
        logger,
        locale,
      ),
  },
});
