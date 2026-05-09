/**
 * Coding Agent Route Handler
 * Dispatches to the selected provider config based on data.provider.
 */

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import { chatSettings } from "@/app/api/[locale]/agent/chat/settings/db";
import { db } from "@/app/api/[locale]/system/db";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { endpoints } from "./definition";
import { runCodingAgent } from "./repository";
import { claudeCodeConfig } from "./providers/claude-code/repository";
import { openCodeConfig } from "./providers/open-code/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, user, logger, t, cronTaskId, streamContext }) => {
      const rows = await db
        .select({ codingAgent: chatSettings.codingAgent })
        .from(chatSettings)
        .where(eq(chatSettings.userId, user.id))
        .limit(1);

      if (rows[0]?.codingAgent === "next-vibe-coder") {
        return fail({
          message: t("codingAgent.run.post.errors.vibeCoderRedirect.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

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
