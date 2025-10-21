import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { chatFolders } from "@/app/api/[locale]/v1/core/agent/chat/db";
import { canCreateFolder } from "@/app/api/[locale]/v1/core/agent/chat/permissions/permissions";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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
    return createErrorResponse(
      "app.api.v1.core.agent.chat.folders.get.errors.unauthorized.title",
      ErrorResponseTypes.UNAUTHORIZED,
    );
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
        ...folder,
        createdAt: new Date(folder.createdAt),
        updatedAt: new Date(folder.updatedAt),
      })),
    }) as ResponseType<FolderListResponseOutput>;
  } catch {
    return createErrorResponse(
      "app.api.v1.core.agent.chat.folders.get.errors.server.title",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
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
        return createErrorResponse(
          "app.api.v1.core.agent.chat.folders.post.errors.forbidden.title",
          ErrorResponseTypes.FORBIDDEN,
        );
      }

      if (folderData.rootFolderId === "incognito") {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.folders.post.errors.forbidden.title",
          ErrorResponseTypes.FORBIDDEN,
          {
            message: simpleT(locale).t(
              "app.api.v1.core.agent.chat.folders.post.errors.forbidden.incognitoNotAllowed",
            ),
          },
        );
      }

      if (folderData.rootFolderId === "public") {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.folders.post.errors.forbidden.title",
          ErrorResponseTypes.FORBIDDEN,
        );
      }

      return createErrorResponse(
        "app.api.v1.core.agent.chat.folders.post.errors.forbidden.title",
        ErrorResponseTypes.FORBIDDEN,
      );
    }

    // For authenticated users, use userId
    const userIdentifier = user.id;

    if (!userIdentifier) {
      return createErrorResponse(
        "app.api.v1.core.agent.chat.folders.post.errors.unauthorized.title",
        ErrorResponseTypes.UNAUTHORIZED,
      );
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
      return createErrorResponse(
        "app.api.v1.core.agent.chat.folders.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }

    return createSuccessResponse({
      response: {
        folder: {
          ...newFolder,
          createdAt: new Date(newFolder.createdAt),
          updatedAt: new Date(newFolder.updatedAt),
        },
      },
    }) as ResponseType<FolderCreateResponseOutput>;
  } catch (error) {
    // eslint-disable-next-line no-console, i18next/no-literal-string
    console.error("createFolder - Failed to create folder:", error);
    return createErrorResponse(
      "app.api.v1.core.agent.chat.folders.post.errors.server.title",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
}
