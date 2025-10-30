import "server-only";

import { and, eq } from "drizzle-orm";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { chatFolders } from "@/app/api/[locale]/v1/core/agent/chat/db";
import { validateNoCircularReference } from "@/app/api/[locale]/v1/core/agent/chat/validation";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";

import type {
  FolderDeleteResponseOutput,
  FolderGetResponseOutput,
  FolderUpdateRequestOutput,
  FolderUpdateResponseOutput,
} from "./definition";

/**
 * Get a single folder by ID
 */
export async function getFolder(
  user: JwtPayloadType,
  data: { id: string },
): Promise<ResponseType<FolderGetResponseOutput>> {
  if (user.isPublic) {
    return fail({
      message:
        "app.api.v1.core.agent.chat.folders.id.get.errors.unauthorized.title",
      errorType: ErrorResponseTypes.UNAUTHORIZED,
    });
  }

  try {
    const [folder] = await db
      .select()
      .from(chatFolders)
      .where(and(eq(chatFolders.id, data.id), eq(chatFolders.userId, user.id)))
      .limit(1);

    if (!folder) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.folders.id.get.errors.notFound.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    return createSuccessResponse({
      response: {
        folder: {
          id: folder.id,
          userId: folder.userId,
          name: folder.name,
          icon: folder.icon,
          color: folder.color,
          parentId: folder.parentId,
          expanded: folder.expanded,
          sortOrder: folder.sortOrder,
          metadata:
            (folder.metadata as Record<
              string,
              string | number | boolean | null
            >) || {},
          createdAt: folder.createdAt.toISOString(),
          updatedAt: folder.updatedAt.toISOString(),
        },
      },
    });
  } catch {
    return fail({
      message: "app.api.v1.core.agent.chat.folders.id.get.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * Update a folder
 */
export async function updateFolder(
  user: JwtPayloadType,
  data: FolderUpdateRequestOutput & { id: string },
): Promise<ResponseType<FolderUpdateResponseOutput>> {
  if (user.isPublic) {
    return fail({
      message:
        "app.api.v1.core.agent.chat.folders.id.patch.errors.unauthorized.title",
      errorType: ErrorResponseTypes.UNAUTHORIZED,
    });
  }

  try {
    const { id, updates } = data;

    // Verify folder exists and belongs to user
    const [existingFolder] = await db
      .select()
      .from(chatFolders)
      .where(and(eq(chatFolders.id, id), eq(chatFolders.userId, user.id)))
      .limit(1);

    if (!existingFolder) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.folders.id.patch.errors.notFound.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Prevent circular parent references
    const circularError = validateNoCircularReference(
      id,
      updates.parentId,
      "app.api.v1.core.agent.chat.folders.id.patch.errors.validation.title" as const,
      "app.api.v1.core.agent.chat.folders.id.patch.errors.validation.circularReference" as const,
    );
    if (circularError) {
      return circularError;
    }

    // Update the folder
    const [updatedFolder] = await db
      .update(chatFolders)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(chatFolders.id, id), eq(chatFolders.userId, user.id)))
      .returning();

    if (!updatedFolder) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.folders.id.patch.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return createSuccessResponse({
      response: {
        folder: {
          id: updatedFolder.id,
          userId: updatedFolder.userId,
          name: updatedFolder.name,
          icon: updatedFolder.icon,
          color: updatedFolder.color,
          parentId: updatedFolder.parentId,
          expanded: updatedFolder.expanded,
          sortOrder: updatedFolder.sortOrder,
          metadata:
            (updatedFolder.metadata as Record<
              string,
              string | number | boolean | null
            >) || {},
          createdAt: updatedFolder.createdAt.toISOString(),
          updatedAt: updatedFolder.updatedAt.toISOString(),
        },
      },
    });
  } catch {
    return fail({
      message:
        "app.api.v1.core.agent.chat.folders.id.patch.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * Delete a folder (cascade deletes handled by database)
 */
export async function deleteFolder(
  user: JwtPayloadType,
  data: { id: string },
): Promise<ResponseType<FolderDeleteResponseOutput>> {
  if (user.isPublic) {
    return fail({
      message:
        "app.api.v1.core.agent.chat.folders.id.delete.errors.unauthorized.title",
      errorType: ErrorResponseTypes.UNAUTHORIZED,
    });
  }

  try {
    const { id } = data;

    // Verify folder exists and belongs to user
    const [existingFolder] = await db
      .select()
      .from(chatFolders)
      .where(and(eq(chatFolders.id, id), eq(chatFolders.userId, user.id)))
      .limit(1);

    if (!existingFolder) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.folders.id.delete.errors.notFound.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Delete the folder (cascade will handle child folders and threads)
    await db
      .delete(chatFolders)
      .where(and(eq(chatFolders.id, id), eq(chatFolders.userId, user.id)));

    return createSuccessResponse({
      response: {
        success: true,
        deletedFolderId: id,
      },
    });
  } catch {
    return fail({
      message:
        "app.api.v1.core.agent.chat.folders.id.delete.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
