/**
 * Claude Code Run Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { endpoints } from "./definition";
import { ClaudeCodeRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, logger, t, cronTaskId, streamContext }) =>
      ClaudeCodeRepository.runClaudeCode(
        data,
        user,
        logger,
        t,
        cronTaskId,
        streamContext,
      ),
  },
});
