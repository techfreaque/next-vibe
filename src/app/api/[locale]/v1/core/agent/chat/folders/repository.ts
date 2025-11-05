import "server-only";

import { and, desc, eq, isNull, or } from "drizzle-orm";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { chatFolders } from "@/app/api/[locale]/v1/core/agent/chat/db";
import {
  canCreateFolder,
  canReadFolder,
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

      // Filter folders based on user permissions using canReadFolder
      const visibleFolders = [];
      for (const folder of allFolders) {
        if (await canReadFolder(user, folder, logger)) {
          visibleFolders.push(folder);
        }
      }

      return createSuccessResponse({
        folders: visibleFolders.map((folder) => ({
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
          rolesRead: folder.rolesRead || [],
          rolesWrite: folder.rolesWrite || [],
          rolesHide: folder.rolesHide || [],
          rolesDelete: folder.rolesDelete || [],
          createdAt: folder.createdAt.toISOString(),
          updatedAt: folder.updatedAt.toISOString(),
        })),
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
          // rolesRead, rolesWrite, rolesHide, rolesDelete are NOT set
          // They default to [] which means inherit from parent folder
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

      return createSuccessResponse({
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
            rolesRead: newFolder.rolesRead || [],
            rolesWrite: newFolder.rolesWrite || [],
            rolesHide: newFolder.rolesHide || [],
            rolesDelete: newFolder.rolesDelete || [],
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
