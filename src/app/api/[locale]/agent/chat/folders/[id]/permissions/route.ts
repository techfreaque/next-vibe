/**
 * Chat Folder Permissions API Route Handler
 * Handles GET and PATCH requests for folder permissions (moderator management)
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { getFolderPermissions, updateFolderPermissions } from "./repository";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (props) => {
      return await getFolderPermissions(props.user, { id: props.urlPathParams.id }, props.logger);
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async (props) => {
      const dataWithId = {
        ...props.data,
        id: props.urlPathParams.id,
      };
      return await updateFolderPermissions(props.user, dataWithId, props.logger);
    },
  },
});
