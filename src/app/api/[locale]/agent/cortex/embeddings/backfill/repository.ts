import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";

import type { CortexBackfillResponseOutput } from "./definition";

export const CortexBackfillRepository = {
  async backfill(
    data: { force?: boolean | null },
    logger: EndpointLogger,
  ): Promise<ResponseType<CortexBackfillResponseOutput>> {
    const { materializeAllVirtualMounts, backfillEmbeddings } =
      await import("../backfill");

    // Step 1: Materialize virtual mounts synchronously - fast, just DB upserts
    const materialized = await materializeAllVirtualMounts();
    logger.info("Cortex virtual mounts materialized", { materialized });

    // Step 2: Run embedding backfill in background - rate-limited, takes minutes
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
};
