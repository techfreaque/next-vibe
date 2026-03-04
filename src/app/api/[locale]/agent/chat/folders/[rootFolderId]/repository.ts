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

import type {
  FolderCreateRequestOutput,
  FolderCreateResponseOutput,
} from "./create/definition";
import type {
  FolderListResponseOutput,
  FolderListUrlVariablesOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type FoldersT = ReturnType<typeof scopedTranslation.scopedT>["t"];

/**
 * Chat Folders Repository - Static class pattern
 */
export class ChatFoldersRepository {
  /**
   * Get all folders for the authenticated user or anonymous user (lead)
   */
  static async getFolders(
    data: FolderListUrlVariablesOutput,
    user: JwtPayloadType,
    t: FoldersT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderListResponseOutput>> {
    // For anonymous users (public), use leadId instead of userId
    // For authenticated users, use userId
    const userIdentifier = user.isPublic ? user.leadId : user.id;

    if (!userIdentifier) {
      logger.error("Missing user identifier", { user });
      return fail({
        message: t("get.errors.unauthorized.title"),
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
        if (await canViewFolder(user, folder, logger, locale)) {
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
            canManageFolder(user, folder, logger, locale, folderMap),
            canCreateThreadInFolder(user, folder, logger, locale, folderMap),
            canHideFolder(user, folder, logger, locale, folderMap),
            canDeleteFolder(user, folder, logger, locale, folderMap),
            canManageFolderPermissions(user, folder, logger, locale, folderMap),
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
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
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
        const { RootFolderPermissionsRepository } =
          await import("./root-permissions/repository");
        const permissionsResult =
          await RootFolderPermissionsRepository.getRootFolderPermissions(
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
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Create a new folder
   */
  static async createFolder(
    data: FolderCreateRequestOutput,
    user: JwtPayloadType,
    t: FoldersT,
    logger: EndpointLogger,
    locale: CountryLanguage,
    rootFolderId: DefaultFolderId,
  ): Promise<ResponseType<FolderCreateResponseOutput>> {
    try {
      logger.debug("Creating folder", {
        rootFolderId,
        name: data.name,
      });

      // Check permissions using the permission system
      const hasPermission = await canCreateFolder(
        user,
        rootFolderId,
        logger,
        locale,
        data.parentId,
      );

      if (!hasPermission) {
        // Determine the specific error message
        if (user.isPublic) {
          return fail({
            message: t("post.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }

        if (rootFolderId === "incognito") {
          return fail({
            message: t("post.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
            messageParams: {
              message: t("post.errors.forbidden.incognitoNotAllowed"),
            },
          });
        }

        if (rootFolderId === "public") {
          return fail({
            message: t("post.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }

        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // For authenticated users, use userId
      const userIdentifier = user.id;

      if (!userIdentifier) {
        logger.error("Missing user identifier", { user });
        return fail({
          message: t("post.errors.unauthorized.title"),
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
            eq(chatFolders.rootFolderId, rootFolderId),
            data.parentId
              ? eq(chatFolders.parentId, data.parentId)
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
          rootFolderId,
          name: data.name,
          icon: data.icon || null,
          color: data.color || null,
          parentId: data.parentId || null,
          expanded: true,
          sortOrder: nextSortOrder,
          // rolesView, rolesManage, rolesCreateThread, rolesPost, rolesModerate, rolesAdmin are NOT set
          // They default to null which means inherit from parent folder
        })
        .returning();

      if (!newFolder) {
        logger.error("Failed to insert folder into database");
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Folders should always have a userId at creation
      if (!newFolder.userId) {
        logger.error("Created folder has null userId", {
          folderId: newFolder.id,
        });
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        folderId: newFolder.id,
        createdAt: newFolder.createdAt,
        updatedAt: newFolder.updatedAt,
      });
    } catch (error) {
      logger.error("Failed to create folder", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
