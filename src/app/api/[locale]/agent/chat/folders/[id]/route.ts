/**
 * Chat Folder by ID API Route Handler
 * Handles GET, PATCH, and DELETE requests for individual folders
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { folderRepository } from "./repository";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (props) => {
      return await folderRepository.getFolder(
        props.user,
        { id: props.urlPathParams.id },
        props.logger,
      );
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async (props) => {
      const dataWithId = {
        ...props.data,
        id: props.urlPathParams.id,
      };
      return await folderRepository.updateFolder(
        props.user,
        dataWithId,
        props.logger,
      );
    },
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: async (props) => {
      return await folderRepository.deleteFolder(
        props.user,
        { id: props.urlPathParams.id },
        props.logger,
      );
    },
  },
});
