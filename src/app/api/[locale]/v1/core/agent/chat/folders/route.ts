/**
 * Chat Folders API Route Handler
 * Handles GET (list) and POST (create) requests for folders
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { createFolder, getFolders } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (props) => {
      return await getFolders(props.user, props.data);
    },
  },
  [Methods.POST]: {
    email: undefined,
    handler: async (props) => {
      return await createFolder(
        props.user,
        props.data,
        props.locale,
        props.logger,
      );
    },
  },
});
