/**
 * Folder Contents API Route Handler
 * Handles GET requests for unified folder+thread lists
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
    canSubscribe: async ({ user, urlPathParams, logger }) => {
      const rootFolderId = urlPathParams.rootFolderId;
      if (!rootFolderId) {
        return false;
      }

      const { isDefaultFolderId, DefaultFolderId } =
        await import("../../config");

      if (!isDefaultFolderId(rootFolderId)) {
        const { eq } = await import("drizzle-orm");
        const { db } = await import("@/app/api/[locale]/system/db");
        const { chatFolders } =
          await import("@/app/api/[locale]/agent/chat/db");
        const { canViewFolder } =
          await import("@/app/api/[locale]/agent/chat/permissions/permissions");
        const [folder] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, rootFolderId))
          .limit(1);
        if (!folder) {
          return false;
        }
        return canViewFolder(user, folder, logger, "en-US");
      }
      switch (rootFolderId) {
        case DefaultFolderId.INCOGNITO:
          return false;
        case DefaultFolderId.PRIVATE:
          return !user.isPublic && !!user.id;
        case DefaultFolderId.PUBLIC:
          return user.isPublic ? !!user.leadId : !!user.id;
        default:
          return !user.isPublic && !!user.id;
      }
    },
    onRemoteEvent: {
      "thread-title-updated": (props) =>
        FolderContentsRepository.applyRemoteThreadTitleUpdated(props),
    },
  },
});
