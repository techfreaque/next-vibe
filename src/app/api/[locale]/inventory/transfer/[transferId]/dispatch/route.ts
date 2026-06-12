/**
 * Inventory Transfer Dispatch API Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { InventoryTransferDispatchRepository } from "./repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, user, logger, locale }) =>
      InventoryTransferDispatchRepository.dispatchTransfer(
        data,
        user.id,
        logger,
        locale,
      ),
  },
});
