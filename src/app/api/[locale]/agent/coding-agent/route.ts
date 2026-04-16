/**
 * Coding Agent Route Handler
 * Dispatches to the selected provider config based on data.provider.
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { endpoints } from "./definition";
import { runCodingAgent } from "./repository";
import { claudeCodeConfig } from "./providers/claude-code/repository";
import { openCodeConfig } from "./providers/open-code/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, logger, t, cronTaskId, streamContext }) => {
      return runCodingAgent(
        data.provider === "open-code" ? openCodeConfig : claudeCodeConfig,
        data,
        user.id,
        logger,
        t,
        cronTaskId,
        streamContext,
      );
    },
  },
});
