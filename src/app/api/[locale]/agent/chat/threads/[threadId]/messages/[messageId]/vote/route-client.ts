/**
 * Vote Message Client-Side Route Handler
 * Stores votes in localStorage for incognito threads.
 * Votes are used as AI feedback — they affect context messages shown to the AI.
 */

"use client";

import { clientEndpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/client-multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { VoteRepositoryClient } from "./repository-client";

/**
 * Client-side handlers — stores votes in localStorage for incognito threads
 */
export const { POST } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, urlPathParams, logger, locale }) =>
      VoteRepositoryClient.voteMessage(
        urlPathParams.threadId,
        urlPathParams.messageId,
        data.vote,
        logger,
        locale,
      ),
  },
});
