import "server-only";

import { and, desc, eq, isNull, or } from "drizzle-orm";
import {
  success,
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { chatFolders } from "@/app/api/[locale]/v1/core/agent/chat/db";
import {
  DEFAULT_FOLDER_CONFIGS,
  type DefaultFolderId,
  isIncognitoFolder,
} from "@/app/api/[locale]/v1/core/agent/chat/config";
import {
  canCreateFolder,
  canViewFolder,
  canManageFolder,
  canCreateThreadInFolder,
  canHideFolder,
  canDeleteFolder,
  canManageFolderPermissions,
  hasRolePermission,
} from "@/app/api/[locale]/v1/core/agent/chat/permissions/permissions";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
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
export class ChatFoldersRepositoryImpl
  implements ChatFoldersRepositoryInterface
{
  /**
   * Compute permissions for a root folder (static method for server-side use)
   * Root folders don't exist in the database, so we compute permissions based on DEFAULT_FOLDER_CONFIGS
   *
   * For non-public root folders (private, shared, incognito), permissions are always true
   * For public root folder, permissions are based on user role and folder config
   */
  static async computeRootFolderPermissions(
    rootFolderId: DefaultFolderId,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<{ canCreateThread: boolean; canCreateFolder: boolean }> {
    // Get the root folder config
    const rootConfig = DEFAULT_FOLDER_CONFIGS.find(
      (config) => config.id === rootFolderId,
    );

    if (!rootConfig) {
      logger.error("Root folder config not found", { rootFolderId });
      return { canCreateThread: false, canCreateFolder: false };
    }

    // Special handling for incognito folder
    // Incognito is localStorage-only and should allow everyone to create threads/folders locally
    const isIncognito = isIncognitoFolder(rootFolderId);

    if (isIncognito) {
      return {
        canCreateThread: true,
        canCreateFolder: true,
      };
    }

    // Admin users can always create threads and folders in any root folder
    const userId = user.id;
    if (userId) {
      const { isAdmin } = await import("../permissions/permissions");
      const isAdminUser = await isAdmin(userId, logger);
      if (isAdminUser) {
        return {
          canCreateThread: true,
          canCreateFolder: true,
        };
      }
    }

    // For PRIVATE and SHARED root folders with empty rolesCreateThread ([]),
    // authenticated users should be able to create threads (owner-only semantics don't apply to root folders)
    // For PUBLIC root folder, use the explicit rolesCreateThread configuration
    let canCreateThreadInRoot: boolean;
    if (
      (rootFolderId === "private" || rootFolderId === "shared") &&
      rootConfig.rolesCreateThread.length === 0
    ) {
      // Empty array for PRIVATE/SHARED means "authenticated users only"
      canCreateThreadInRoot = !user.isPublic && !!userId;
    } else {
      // Use the rolesCreateThread from the root folder config
      canCreateThreadInRoot = await hasRolePermission(
        user,
        rootConfig.rolesCreateThread,
        logger,
      );
    }

    // Check canCreateFolder permission
    // Use canCreateFolder helper which has special logic for each root folder
    const canCreateFolderInRoot = await canCreateFolder(
      user,
      rootFolderId as "private" | "shared" | "public" | "incognito",
      logger,
      null, // No parent folder for root level
    );

    return {
      canCreateThread: canCreateThreadInRoot,
      canCreateFolder: canCreateFolderInRoot,
    };
  }

  /**
   * Compute permissions for a root folder (instance method for backward compatibility)
   */
  private async computeRootFolderPermissions(
    rootFolderId: DefaultFolderId,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<{ canCreateThread: boolean; canCreateFolder: boolean }> {
    return ChatFoldersRepositoryImpl.computeRootFolderPermissions(
      rootFolderId,
      user,
      logger,
    );
  }

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
        message:
          "app.api.v1.core.agent.chat.folders.get.errors.unauthorized.title",
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
          eq(chatFolders.rootFolderId, "public"), // All PUBLIC folders
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
      const foldersWithPermissions = await Promise.all(
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

          return {
            id: folder.id,
            userId: folder.userId,
            rootFolderId: folder.rootFolderId as
              | "incognito"
              | "private"
              | "public"
              | "shared",
            name: folder.name,
            icon: folder.icon,
            color: folder.color,
            parentId: folder.parentId,
            expanded: folder.expanded,
            sortOrder: folder.sortOrder,
            metadata: folder.metadata || {},
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

      // Compute root folder permissions
      // If rootFolderId is specified, compute permissions for that root folder
      // Otherwise, return default permissions (no permissions)
      const rootFolderPermissions = rootFolderId
        ? await this.computeRootFolderPermissions(rootFolderId, user, logger)
        : { canCreateThread: false, canCreateFolder: false };

      return success({
        rootFolderPermissions,
        folders: foldersWithPermissions,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;
    } catch (error) {
      logger.error("Failed to fetch folders", parseError(error));
      return fail({
        message: "app.api.v1.core.agent.chat.folders.get.errors.server.title",
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
            message:
              "app.api.v1.core.agent.chat.folders.post.errors.forbidden.title",
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }

        if (folderData.rootFolderId === "incognito") {
          return fail({
            message:
              "app.api.v1.core.agent.chat.folders.post.errors.forbidden.title",
            errorType: ErrorResponseTypes.FORBIDDEN,
            messageParams: {
              message: simpleT(locale).t(
                "app.api.v1.core.agent.chat.folders.post.errors.forbidden.incognitoNotAllowed",
              ),
            },
          });
        }

        if (folderData.rootFolderId === "public") {
          return fail({
            message:
              "app.api.v1.core.agent.chat.folders.post.errors.forbidden.title",
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }

        return fail({
          message:
            "app.api.v1.core.agent.chat.folders.post.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // For authenticated users, use userId
      const userIdentifier = user.id;

      if (!userIdentifier) {
        logger.error("Missing user identifier", { user });
        return fail({
          message:
            "app.api.v1.core.agent.chat.folders.post.errors.unauthorized.title",
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
          metadata: {},
          // rolesView, rolesManage, rolesCreateThread, rolesPost, rolesModerate, rolesAdmin are NOT set
          // They default to null which means inherit from parent folder
        })
        .returning();

      if (!newFolder) {
        logger.error("Failed to insert folder into database");
        return fail({
          message:
            "app.api.v1.core.agent.chat.folders.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        response: {
          folder: {
            id: newFolder.id,
            userId: newFolder.userId,
            rootFolderId: newFolder.rootFolderId as
              | "incognito"
              | "private"
              | "public"
              | "shared",
            name: newFolder.name,
            icon: newFolder.icon,
            color: newFolder.color,
            parentId: newFolder.parentId,
            expanded: newFolder.expanded,
            sortOrder: newFolder.sortOrder,
            metadata: newFolder.metadata || {},
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;
    } catch (error) {
      logger.error("Failed to create folder", parseError(error));
      return fail({
        message: "app.api.v1.core.agent.chat.folders.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

export const chatFoldersRepository = new ChatFoldersRepositoryImpl();
