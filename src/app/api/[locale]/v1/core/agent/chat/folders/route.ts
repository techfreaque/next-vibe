/**
 * Chat Folders API Route Handler
 * Handles GET (list) and POST (create) requests for folders
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/handler-types";

import type {
  FolderCreateRequestOutput,
  FolderCreateResponseOutput,
  FolderListRequestOutput,
  FolderListResponseOutput,
} from "./definition";
import definitions from "./definition";
import { createFolder, getFolders } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        FolderListRequestOutput,
        Record<string, never>,
        typeof definitions.GET.allowedRoles
      >,
    ): Promise<ResponseType<FolderListResponseOutput>> => {
      return await getFolders(props.user, props.data);
    },
  },
  [Methods.POST]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        FolderCreateRequestOutput,
        Record<string, never>,
        typeof definitions.POST.allowedRoles
      >,
    ): Promise<ResponseType<FolderCreateResponseOutput>> => {
      return await createFolder(
        props.user,
        props.data,
        props.locale,
        props.logger,
      );
    },
  },
});
