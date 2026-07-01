/**
 * Vote Message Client-Side Route Handler
 * Stores votes in localStorage for incognito threads.
 * Votes are used as AI feedback - they affect context messages shown to the AI.
 */

"use client";

import { Methods } from "next-vibe/core/definition/enums";
import { clientEndpointsHandler } from "next-vibe/core/route/client-multi";

import definitions from "./definition";
import { VoteRepositoryClient } from "./repository-client";

/**
 * Client-side handlers - stores votes in localStorage for incognito threads
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
