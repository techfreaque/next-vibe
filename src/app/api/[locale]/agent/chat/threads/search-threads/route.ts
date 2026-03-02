/**
 * Thread Search API Route Handler
 * Handles GET requests for searching threads
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { definitions } from "./definition";
import { searchThreads } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, data }) => {
      return {
        success: true,
        data: await searchThreads(user.id, data),
      };
    },
  },
});
