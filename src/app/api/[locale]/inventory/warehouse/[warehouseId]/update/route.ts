/**
 * Inventory Warehouse Update API Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { InventoryWarehouseUpdateRepository } from "./repository";
import definitions from "./definition";

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
