/**
 * Inventory Transfer Cancel API Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { InventoryTransferCancelRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      InventoryTransferCancelRepository.cancelTransfer(
        urlPathParams,
        user.id,
        logger,
        locale,
      ),
  },
});
