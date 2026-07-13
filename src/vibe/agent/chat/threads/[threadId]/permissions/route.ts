/**
 * Chat Thread Permissions API Route Handler
 * Handles GET and PATCH requests for thread permissions (moderator management)
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
