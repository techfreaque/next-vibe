/**
 * Inventory Warehouse Get API Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { InventoryWarehouseGetRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      InventoryWarehouseGetRepository.getWarehouse(
        urlPathParams.warehouseId,
        user.id,
        logger,
        locale,
      ),
  },
});
