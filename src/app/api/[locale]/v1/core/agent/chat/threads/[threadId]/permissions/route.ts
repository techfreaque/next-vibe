/**
 * Chat Thread Permissions API Route Handler
 * Handles GET and PATCH requests for thread permissions (moderator management)
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import {
  getThreadPermissions,
  updateThreadPermissions,
} from "./repository";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (props) => {
      return await getThreadPermissions(
        props.user,
        { threadId: props.urlPathParams.threadId },
        props.logger,
      );
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async (props) => {
      const dataWithId = {
        ...props.data,
        threadId: props.urlPathParams.threadId,
      };
      return await updateThreadPermissions(props.user, dataWithId, props.logger);
    },
  },
});
