/**
 * Coding Agent Route Handler
 * Dispatches to the selected provider config based on data.provider.
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { runCodingAgent } from "./repository";
import { claudeCodeConfig } from "./providers/claude-code/repository";
import { openCodeConfig } from "./providers/open-code/repository";
import { endpoints } from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, logger, t, cronTaskId, streamContext }) =>
      runCodingAgent(
        data.provider === "open-code" ? openCodeConfig : claudeCodeConfig,
        data,
        user,
        logger,
        t,
        cronTaskId,
        streamContext,
      ),
  },
});
