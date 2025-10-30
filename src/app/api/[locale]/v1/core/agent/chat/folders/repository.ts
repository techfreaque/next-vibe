import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { chatFolders } from "@/app/api/[locale]/v1/core/agent/chat/db";
import { canCreateFolder } from "@/app/api/[locale]/v1/core/agent/chat/permissions/permissions";
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
 * Metadata type for folder metadata (JSON object)
 */
type FolderMetadata = Record<string, string | number | boolean | null>;

/**
 * Chat Folders Repository Interface
 */
export interface ChatFoldersRepositoryInterface {
  getFolders(
    data: FolderListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; data?: FolderListResponseOutput; error?: { message: string; type: string } }>;

  createFolder(
    data: FolderCreateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; data?: FolderCreateResponseOutput; error?: { message: string; type: string } }>;
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
  ): Promise<{ success: boolean; data?: FolderListResponseOutput; error?: { message: string; type: string } }> {
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

      // Build where conditions - only filter by rootFolderId if provided
      const whereConditions = rootFolderId
        ? and(
          eq(chatFolders.userId, userIdentifier),
          eq(chatFolders.rootFolderId, rootFolderId),
        )
        : eq(chatFolders.userId, userIdentifier);

      const folders = await db
        .select()
        .from(chatFolders)
        .where(whereConditions)
        .orderBy(desc(chatFolders.sortOrder), desc(chatFolders.createdAt));

      return createSuccessResponse<FolderListResponseOutput>({
        folders: folders.map((folder) => ({
          id: folder.id,
          userId: folder.userId,
          rootFolderId: folder.rootFolderId as
            | "private"
            | "shared"
            | "public"
            | "incognito",
          name: folder.name,
          icon: folder.icon,
          color: folder.color,
          parentId: folder.parentId,
          expanded: folder.expanded,
          sortOrder: folder.sortOrder,
          metadata: (folder.metadata || {}) as FolderMetadata,
          createdAt: folder.createdAt.toISOString(),
          updatedAt: folder.updatedAt.toISOString(),
        })),
      });
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
  ): Promise<{ success: boolean; data?: FolderCreateResponseOutput; error?: { message: string; type: string } }> {
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

      return createSuccessResponse<FolderCreateResponseOutput>({
        response: {
          folder: {
            id: newFolder.id,
            userId: newFolder.userId,
            rootFolderId: newFolder.rootFolderId as
              | "private"
              | "shared"
              | "public"
              | "incognito",
            name: newFolder.name,
            icon: newFolder.icon,
            color: newFolder.color,
            parentId: newFolder.parentId,
            expanded: newFolder.expanded,
            sortOrder: newFolder.sortOrder,
            metadata: (newFolder.metadata || {}) as FolderMetadata,
            createdAt: newFolder.createdAt.toISOString(),
            updatedAt: newFolder.updatedAt.toISOString(),
          },
        },
      });
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
