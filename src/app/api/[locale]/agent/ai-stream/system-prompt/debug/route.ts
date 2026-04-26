import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { scopedTranslation } from "./i18n";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      const { t } = scopedTranslation.scopedT(locale);
      const { buildDebugSystemPrompt } = await import("./repository");
      return buildDebugSystemPrompt({
        rootFolderId: data.rootFolderId,
        userRole: data.userRole,
        userMessage: data.userMessage,
        threadId: data.threadId,
        userId: data.userId,
        skillId: data.skillId,
        subFolderId: data.subFolderId,
        requestingUser: user,
        locale,
        logger,
        t,
      });
    },
  },
});
