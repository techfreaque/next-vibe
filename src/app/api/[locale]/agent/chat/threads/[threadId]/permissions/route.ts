/**
 * Chat Thread Permissions API Route Handler
 * Handles GET and PATCH requests for thread permissions (moderator management)
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ThreadPermissionsRepository } from "./repository";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (props) => {
      return await ThreadPermissionsRepository.getThreadPermissions(
        props.user,
        { threadId: props.urlPathParams.threadId },
        props.t,
        props.logger,
        props.locale,
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
      return await ThreadPermissionsRepository.updateThreadPermissions(
        props.user,
        dataWithId,
        props.t,
        props.logger,
        props.locale,
      );
    },
  },
});
