/**
 * Chat Folder by ID API Route Handler
 * Handles GET, PATCH, and DELETE requests for individual folders
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/handler";

import type {
  FolderDeleteRequestOutput,
  FolderDeleteResponseOutput,
  FolderDeleteUrlParamsTypeOutput,
  FolderGetRequestOutput,
  FolderGetResponseOutput,
  FolderGetUrlParamsTypeOutput,
  FolderUpdateRequestOutput,
  FolderUpdateResponseOutput,
  FolderUpdateUrlParamsTypeOutput,
} from "./definition";
import definitions from "./definition";
import { deleteFolder, getFolder, updateFolder } from "./repository";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        FolderGetRequestOutput,
        FolderGetUrlParamsTypeOutput,
        typeof definitions.GET.allowedRoles
      >,
    ): Promise<ResponseType<FolderGetResponseOutput>> => {
      return await getFolder(props.user, { id: props.urlPathParams.id }, props.logger);
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        FolderUpdateRequestOutput,
        FolderUpdateUrlParamsTypeOutput,
        typeof definitions.PATCH.allowedRoles
      >,
    ): Promise<ResponseType<FolderUpdateResponseOutput>> => {
      const dataWithId = {
        ...props.data,
        id: props.urlPathParams.id,
      };
      return await updateFolder(props.user, dataWithId, props.logger);
    },
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        FolderDeleteRequestOutput,
        FolderDeleteUrlParamsTypeOutput,
        typeof definitions.DELETE.allowedRoles
      >,
    ): Promise<ResponseType<FolderDeleteResponseOutput>> => {
      return await deleteFolder(props.user, { id: props.urlPathParams.id }, props.logger);
    },
  },
});
