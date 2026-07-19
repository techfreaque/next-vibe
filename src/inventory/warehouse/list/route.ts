/**
 * Inventory Warehouse List API Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { InventoryWarehouseListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, user, logger, locale }) =>
      InventoryWarehouseListRepository.listWarehouses(
        data,
        user.id,
        logger,
        locale,
      ),
  },
});
