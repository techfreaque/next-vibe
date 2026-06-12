/**
 * Inventory Transfer List API Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { InventoryTransferListRepository } from "./repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, user, logger, locale }) =>
      InventoryTransferListRepository.listTransfers(
        data,
        user.id,
        logger,
        locale,
      ),
  },
});
