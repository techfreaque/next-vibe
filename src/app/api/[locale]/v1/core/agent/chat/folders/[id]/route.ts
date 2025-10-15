/**
 * Chat Folder by ID API Route Handler
 * Handles GET, PATCH, and DELETE requests for individual folders
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/types";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

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
      return await getFolder(props.user, { id: props.urlVariables.id });
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
      const dataWithId: FolderUpdateRequestOutput & { id: string } = {
        ...props.data,
        id: props.urlVariables.id,
      };
      return await updateFolder(props.user, dataWithId);
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
      return await deleteFolder(props.user, { id: props.urlVariables.id });
    },
  },
});
