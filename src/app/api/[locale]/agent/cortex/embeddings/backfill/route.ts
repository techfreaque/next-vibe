import { success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      const { materializeAllVirtualMounts, backfillEmbeddings } =
        await import("../backfill");

      // Step 1: Materialize virtual mounts synchronously — fast, just DB upserts
      const materialized = await materializeAllVirtualMounts();
      logger.info("Cortex virtual mounts materialized", { materialized });

      // Step 2: Run embedding backfill in background — rate-limited, takes minutes
      void backfillEmbeddings(data.force ?? false).then((result) => {
        logger.info("Cortex embedding backfill completed", result);
        return result;
      });

      return success({
        materialized,
        processed: 0,
        failed: 0,
        skipped: 0,
      });
    },
  },
});
