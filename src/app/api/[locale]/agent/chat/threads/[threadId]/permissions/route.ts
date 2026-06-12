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
    handler: (props) =>
      ThreadPermissionsRepository.getThreadPermissions(
        props.user,
        { threadId: props.urlPathParams.threadId },
        props.t,
        props.logger,
        props.locale,
      ),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: (props) =>
      ThreadPermissionsRepository.updateThreadPermissions(
        props.user,
        { ...props.data, threadId: props.urlPathParams.threadId },
        props.t,
        props.logger,
        props.locale,
      ),
  },
});
