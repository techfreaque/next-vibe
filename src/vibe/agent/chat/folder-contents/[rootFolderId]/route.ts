/**
 * Folder Contents API Route Handler
 * Handles GET requests for unified folder+thread lists
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { FolderContentsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, data, user, logger, t, locale }) =>
      FolderContentsRepository.getFolderContents(
        urlPathParams,
        data,
        user,
        t,
        logger,
        locale,
      ),
    resolveChannel: (ctx) =>
      FolderContentsRepository.resolveSubscriptionChannel(ctx),
    onRemoteEvent: {
      "thread-title-updated": (props) =>
        FolderContentsRepository.applyRemoteThreadTitleUpdated(props),
      "folder-created": (props) =>
        FolderContentsRepository.applyRemoteFolderCreated(props),
      "folder-updated": (props) =>
        FolderContentsRepository.applyRemoteFolderUpdated(props),
      "folder-deleted": (props) =>
        FolderContentsRepository.applyRemoteFolderDeleted(props),
    },
  },
});
