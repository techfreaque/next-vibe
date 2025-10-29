import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";
import {
  fail,
  createSuccessResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { chatFolders } from "@/app/api/[locale]/v1/core/agent/chat/db";
import { canCreateFolder } from "@/app/api/[locale]/v1/core/agent/chat/permissions/permissions";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { JsonValue } from "type-fest";

import type {
  FolderCreateRequestOutput,
  FolderCreateResponseOutput,
  FolderListRequestOutput,
  FolderListResponseOutput,
} from "./definition";

/**
 * Get all folders for the authenticated user or anonymous user (lead)
 */
export async function getFolders(
  user: JwtPayloadType,
  data: FolderListRequestOutput,
): Promise<ResponseType<FolderListResponseOutput>> {
  // For anonymous users (public), use leadId instead of userId
  // For authenticated users, use userId
  const userIdentifier = user.isPublic ? user.leadId : user.id;

  if (!userIdentifier) {
    return fail({
      message: "app.api.v1.core.agent.chat.folders.get.errors.unauthorized.title",
      errorType: ErrorResponseTypes.UNAUTHORIZED,
    });
  }

  const { rootFolderId } = data;

  try {
    const folders = await db
      .select()
      .from(chatFolders)
      .where(
        and(
          eq(chatFolders.userId, userIdentifier),
          eq(chatFolders.rootFolderId, rootFolderId),
        ),
      )
      .orderBy(desc(chatFolders.sortOrder), desc(chatFolders.createdAt));

    return createSuccessResponse({
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
        metadata: (folder.metadata as JsonValue) || {},
        createdAt: new Date(folder.createdAt),
        updatedAt: new Date(folder.updatedAt),
      })),
    });
  } catch {
    return fail({
      message: "app.api.v1.core.agent.chat.folders.get.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * Create a new folder
 */
export async function createFolder(
  user: JwtPayloadType,
  data: FolderCreateRequestOutput,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<ResponseType<FolderCreateResponseOutput>> {
  try {
    const { folder: folderData } = data;

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
          message: "app.api.v1.core.agent.chat.folders.post.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      if (folderData.rootFolderId === "incognito") {
        return fail({
          message: "app.api.v1.core.agent.chat.folders.post.errors.forbidden.title",
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
          message: "app.api.v1.core.agent.chat.folders.post.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return fail({
        message: "app.api.v1.core.agent.chat.folders.post.errors.forbidden.title",
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    // For authenticated users, use userId
    const userIdentifier = user.id;

    if (!userIdentifier) {
      return fail({
        message: "app.api.v1.core.agent.chat.folders.post.errors.unauthorized.title",
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
      return fail({
        message: "app.api.v1.core.agent.chat.folders.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return createSuccessResponse({
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
          metadata: (newFolder.metadata as JsonValue) || {},
          createdAt: new Date(newFolder.createdAt),
          updatedAt: new Date(newFolder.updatedAt),
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
