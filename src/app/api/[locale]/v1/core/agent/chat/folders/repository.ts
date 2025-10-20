import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { chatFolders } from "@/app/api/[locale]/v1/core/agent/chat/db";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type {
  FolderCreateRequestOutput,
  FolderCreateResponseOutput,
  FolderListRequestOutput,
  FolderListResponseOutput,
} from "./definition";

/**
 * Get all folders for the authenticated user
 */
export async function getFolders(
  user: JwtPrivatePayloadType,
  data: FolderListRequestOutput,
): Promise<ResponseType<FolderListResponseOutput>> {
  if (!user.id) {
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
          eq(chatFolders.userId, user.id),
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
  user: JwtPrivatePayloadType,
  data: FolderCreateRequestOutput,
  locale: CountryLanguage,
): Promise<ResponseType<FolderCreateResponseOutput>> {
  if (!user.id) {
    return createErrorResponse(
      "app.api.v1.core.agent.chat.folders.post.errors.unauthorized.title",
      ErrorResponseTypes.UNAUTHORIZED,
    );
  }

  try {
    const { folder: folderData } = data;

    // Reject incognito folder creation - they should never be created on server
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

    // Get the next sort order
    const existingFolders = await db
      .select()
      .from(chatFolders)
      .where(
        and(
          eq(chatFolders.userId, user.id),
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
        userId: user.id,
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
  } catch {
    return createErrorResponse(
      "app.api.v1.core.agent.chat.folders.post.errors.server.title",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }
}
