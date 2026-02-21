/**
 * Task Pull Route Handler (cron-only)
 * Calls remote Thea's sync endpoint to pull new pending tasks.
 * Also retries pushing any unsynced completions as a retry mechanism.
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { pullFromRemote } from "../repository";
import endpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ logger }) => {
      return await pullFromRemote(logger);
    },
  },
});
