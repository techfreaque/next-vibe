import { success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ logger }) => {
      const { backfillEmbeddings } = await import("../backfill");
      const result = await backfillEmbeddings();

      logger.info("Cortex embedding backfill completed", {
        processed: result.processed,
        failed: result.failed,
        skipped: result.skipped,
      });

      return success(result);
    },
  },
});
