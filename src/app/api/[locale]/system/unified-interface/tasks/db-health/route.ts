/**
 * DB Health Check Route Handler
 * Called by cron to verify database connectivity
 */

import "server-only";

import { success } from "next-vibe/shared/types/response.schema";

import { rawPool } from "@/app/api/[locale]/system/db";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { formatDatabase } from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ logger }) => {
      await rawPool.query("SELECT 1");
      logger.debug(formatDatabase("Database health check - OK", "🗄️ "));
      return success({ healthy: true });
    },
  },
});
