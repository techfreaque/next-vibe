import "server-only";

import { and, desc, eq, isNull, or } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatFolders } from "@/app/api/[locale]/agent/chat/db";
import {
  canCreateFolder,
  canCreateThreadInFolder,
  canDeleteFolder,
  canHideFolder,
  canManageFolder,
  canManageFolderPermissions,
  canViewFolder,
} from "@/app/api/[locale]/agent/chat/permissions/permissions";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type {
  FolderCreateRequestOutput,
  FolderCreateResponseOutput,
  FolderListRequestOutput,
  FolderListResponseOutput,
} from "./definition";

/**
 * Chat Folders Repository Interface
 */
export interface ChatFoldersRepositoryInterface {
  getFolders(
    data: FolderListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<FolderListResponseOutput>>;

  createFolder(
    data: FolderCreateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<FolderCreateResponseOutput>>;
}

/**
 * Chat Folders Repository Implementation
 */
export class ChatFoldersRepositoryImpl implements ChatFoldersRepositoryInterface {
  /**
   * Get all folders for the authenticated user or anonymous user (lead)
   */
  async getFolders(
    data: FolderListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<FolderListResponseOutput>> {
    // For anonymous users (public), use leadId instead of userId
    // For authenticated users, use userId
    const userIdentifier = user.isPublic ? user.leadId : user.id;

    if (!userIdentifier) {
      logger.error("Missing user identifier", { user });
      return fail({
        message: "app.api.agent.chat.folders.get.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    const { rootFolderId } = data;

    try {
      logger.debug("Fetching folders", { userIdentifier, rootFolderId });

      // Build where conditions based on rootFolderId
      // For PUBLIC root folder: fetch ALL folders (permission filtering happens later)
      // For SHARED root folder: fetch user's own folders + folders where user is moderator
      // For other root folders: only fetch user's own folders
      let whereConditions;
      if (rootFolderId === "public") {
        // PUBLIC folder: fetch all folders in this root folder
        whereConditions = eq(chatFolders.rootFolderId, rootFolderId);
      } else if (rootFolderId === "shared") {
        // SHARED folder: fetch user's own folders
        // Permission filtering happens later via canReadFolder
        whereConditions = and(
          eq(chatFolders.rootFolderId, rootFolderId),
          eq(chatFolders.userId, userIdentifier), // User's own folders
        );
      } else if (rootFolderId) {
        // Other specific root folder: only user's own folders
        whereConditions = and(
          eq(chatFolders.userId, userIdentifier),
          eq(chatFolders.rootFolderId, rootFolderId),
        );
      } else {
        // No rootFolderId specified: fetch all PUBLIC folders + user's own folders from other root folders
        whereConditions = or(
          eq(chatFolders.rootFolderId, DefaultFolderId.PUBLIC), // All PUBLIC folders
          eq(chatFolders.userId, userIdentifier), // User's own folders from any root folder
        );
      }

      const allFolders = await db
        .select()
        .from(chatFolders)
        .where(whereConditions)
        .orderBy(desc(chatFolders.sortOrder), desc(chatFolders.createdAt));

      // Filter folders based on user permissions using canViewFolder
      const visibleFolders = [];
      for (const folder of allFolders) {
        if (await canViewFolder(user, folder, logger)) {
          visibleFolders.push(folder);
        }
      }

      // Build folder map for permission checks
      const folderMap: Record<string, (typeof allFolders)[0]> = {};
      for (const folder of allFolders) {
        folderMap[folder.id] = folder;
      }

      // Map folders to response format with permission flags
      const foldersWithPermissionsOrNull = await Promise.all(
        visibleFolders.map(async (folder) => {
          // Compute all permission flags server-side
          const [
            canManageFolderFlag,
            canCreateThreadFlag,
            canModerateFlag,
            canDeleteFlag,
            canManagePermsFlag,
          ] = await Promise.all([
            canManageFolder(user, folder, logger, folderMap),
            canCreateThreadInFolder(user, folder, logger, folderMap),
            canHideFolder(user, folder, logger, folderMap),
            canDeleteFolder(user, folder, logger, folderMap),
            canManageFolderPermissions(user, folder, logger, folderMap),
          ]);

          // System folders (PUBLIC root categories) can have null userId
          // Only skip if it's not a PUBLIC folder
          if (
            !folder.userId &&
            folder.rootFolderId !== DefaultFolderId.PUBLIC
          ) {
            logger.warn("Folder has null userId in non-PUBLIC root, skipping", {
              folderId: folder.id,
              rootFolderId: folder.rootFolderId,
            });
            return null;
          }

          return {
            id: folder.id,
            userId: folder.userId,
            rootFolderId: folder.rootFolderId,
            name: folder.name,
            icon: folder.icon,
            color: folder.color,
            parentId: folder.parentId,
            expanded: folder.expanded,
            sortOrder: folder.sortOrder,
            rolesView: folder.rolesView || [],
            rolesManage: folder.rolesManage || [],
            rolesCreateThread: folder.rolesCreateThread || [],
            rolesPost: folder.rolesPost || [],
            rolesModerate: folder.rolesModerate || [],
            rolesAdmin: folder.rolesAdmin || [],
            // Permission flags - computed server-side
            canManage: canManageFolderFlag,
            canCreateThread: canCreateThreadFlag,
            canModerate: canModerateFlag,
            canDelete: canDeleteFlag,
            canManagePermissions: canManagePermsFlag,
            createdAt: folder.createdAt.toISOString(),
            updatedAt: folder.updatedAt.toISOString(),
          };
        }),
      );

      // Filter out null entries (folders without userId)
      const foldersWithPermissions = foldersWithPermissionsOrNull.filter(
        (folder): folder is NonNullable<typeof folder> => folder !== null,
      );

      // Compute root folder permissions
      // If rootFolderId is specified, compute permissions for that root folder
      // Otherwise, return default permissions (no permissions)
      let rootFolderPermissions = {
        canCreateThread: false,
        canCreateFolder: false,
      };
      if (rootFolderId) {
        const { rootFolderPermissionsRepository } =
          await import("./root-permissions/repository");
        const permissionsResult =
          await rootFolderPermissionsRepository.getRootFolderPermissions(
            { rootFolderId },
            user,
            locale,
            logger,
          );
        if (permissionsResult.success) {
          rootFolderPermissions = permissionsResult.data;
        }
      }

      return success({
        rootFolderPermissions,
        folders: foldersWithPermissions,
      });
    } catch (error) {
      logger.error("Failed to fetch folders", parseError(error));
      return fail({
        message: "app.api.agent.chat.folders.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Create a new folder
   */
  async createFolder(
    data: FolderCreateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<FolderCreateResponseOutput>> {
    try {
      const { folder: folderData } = data;

      logger.debug("Creating folder", {
        rootFolderId: folderData.rootFolderId,
        name: folderData.name,
      });

      // Check permissions using the permission system
      const hasPermission = await canCreateFolder(
        user,
        folderData.rootFolderId,
        logger,
        folderData.parentId,
      );

      if (!hasPermission) {
        // Determine the specific error message
        if (user.isPublic) {
          return fail({
            message: "app.api.agent.chat.folders.post.errors.forbidden.title",
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }

        if (folderData.rootFolderId === "incognito") {
          return fail({
            message: "app.api.agent.chat.folders.post.errors.forbidden.title",
            errorType: ErrorResponseTypes.FORBIDDEN,
            messageParams: {
              message: simpleT(locale).t(
                "app.api.agent.chat.folders.post.errors.forbidden.incognitoNotAllowed",
              ),
            },
          });
        }

        if (folderData.rootFolderId === "public") {
          return fail({
            message: "app.api.agent.chat.folders.post.errors.forbidden.title",
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }

        return fail({
          message: "app.api.agent.chat.folders.post.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // For authenticated users, use userId
      const userIdentifier = user.id;

      if (!userIdentifier) {
        logger.error("Missing user identifier", { user });
        return fail({
          message: "app.api.agent.chat.folders.post.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Get the next sort order
      const existingFolders = await db
        .select()
        .from(chatFolders)
        .where(
          and(
            eq(chatFolders.userId, userIdentifier),
            eq(chatFolders.rootFolderId, folderData.rootFolderId),
            folderData.parentId
              ? eq(chatFolders.parentId, folderData.parentId)
              : isNull(chatFolders.parentId),
          ),
        );

      const nextSortOrder = existingFolders.length;

      // DO NOT set permission fields - leave as empty arrays to inherit from parent
      // Permission inheritance: empty array [] = inherit from parent folder
      // Only set explicit permissions when user overrides via context menu

      const [newFolder] = await db
        .insert(chatFolders)
        .values({
          userId: userIdentifier,
          rootFolderId: folderData.rootFolderId,
          name: folderData.name,
          icon: folderData.icon || null,
          color: folderData.color || null,
          parentId: folderData.parentId || null,
          expanded: true,
          sortOrder: nextSortOrder,
          // rolesView, rolesManage, rolesCreateThread, rolesPost, rolesModerate, rolesAdmin are NOT set
          // They default to null which means inherit from parent folder
        })
        .returning();

      if (!newFolder) {
        logger.error("Failed to insert folder into database");
        return fail({
          message: "app.api.agent.chat.folders.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Folders should always have a userId at creation
      if (!newFolder.userId) {
        logger.error("Created folder has null userId", {
          folderId: newFolder.id,
        });
        return fail({
          message: "app.api.agent.chat.folders.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        response: {
          folder: {
            id: newFolder.id,
            userId: newFolder.userId,
            rootFolderId: newFolder.rootFolderId,
            name: newFolder.name,
            icon: newFolder.icon,
            color: newFolder.color,
            parentId: newFolder.parentId,
            expanded: newFolder.expanded,
            sortOrder: newFolder.sortOrder,
            rolesView: newFolder.rolesView || [],
            rolesManage: newFolder.rolesManage || [],
            rolesCreateThread: newFolder.rolesCreateThread || [],
            rolesPost: newFolder.rolesPost || [],
            rolesModerate: newFolder.rolesModerate || [],
            rolesAdmin: newFolder.rolesAdmin || [],
            createdAt: newFolder.createdAt.toISOString(),
            updatedAt: newFolder.updatedAt.toISOString(),
          },
        },
      });
    } catch (error) {
      logger.error("Failed to create folder", parseError(error));
      return fail({
        message: "app.api.agent.chat.folders.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

export const chatFoldersRepository = new ChatFoldersRepositoryImpl();
