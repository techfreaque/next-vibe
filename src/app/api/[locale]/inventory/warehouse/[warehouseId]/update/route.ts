/**
 * Inventory Warehouse Update API Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { InventoryWarehouseUpdateRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    handler: ({ data, user, logger, locale }) =>
      InventoryWarehouseUpdateRepository.updateWarehouse(
        data,
        user.id,
        logger,
        locale,
      ),
  },
});
