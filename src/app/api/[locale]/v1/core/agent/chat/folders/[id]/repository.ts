import "server-only";

import { eq } from "drizzle-orm";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { chatFolders } from "@/app/api/[locale]/v1/core/agent/chat/db";
import {
  canDeleteFolder,
  canReadFolder,
  canUpdateFolder,
} from "@/app/api/[locale]/v1/core/agent/chat/permissions/permissions";
import { validateNoCircularReference } from "@/app/api/[locale]/v1/core/agent/chat/validation";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
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
  logger: EndpointLogger,
): Promise<ResponseType<FolderGetResponseOutput>> {
  try {
    const [folder] = await db
      .select()
      .from(chatFolders)
      .where(eq(chatFolders.id, data.id))
      .limit(1);

    if (!folder) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.folders.id.get.errors.notFound.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Check if user can read this folder
    if (!(await canReadFolder(user, folder, logger))) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.folders.id.get.errors.forbidden.title",
        errorType: ErrorResponseTypes.FORBIDDEN,
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
          allowedRoles: folder.allowedRoles || [],
          moderatorIds: folder.moderatorIds || [],
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
  logger: EndpointLogger,
): Promise<ResponseType<FolderUpdateResponseOutput>> {
  try {
    const { id, updates } = data;

    // Verify folder exists
    const [existingFolder] = await db
      .select()
      .from(chatFolders)
      .where(eq(chatFolders.id, id))
      .limit(1);

    if (!existingFolder) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.folders.id.patch.errors.notFound.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Check if user can update this folder (moderators can rename)
    if (!(await canUpdateFolder(user, existingFolder, logger))) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.folders.id.patch.errors.forbidden.title",
        errorType: ErrorResponseTypes.FORBIDDEN,
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
    logger.info("Updating folder with data:", { id, updates });
    const [updatedFolder] = await db
      .update(chatFolders)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(chatFolders.id, id))
      .returning();
    logger.info("Updated folder result:", { updatedFolder: updatedFolder ? { id: updatedFolder.id } : null });

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
          allowedRoles: (updatedFolder.allowedRoles as string[]) || [],
          moderatorIds: (updatedFolder.moderatorIds as string[]) || [],
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
  logger: EndpointLogger,
): Promise<ResponseType<FolderDeleteResponseOutput>> {
  try {
    const { id } = data;

    // Verify folder exists
    const [existingFolder] = await db
      .select()
      .from(chatFolders)
      .where(eq(chatFolders.id, id))
      .limit(1);

    if (!existingFolder) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.folders.id.delete.errors.notFound.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Get all folders for recursive moderator check
    const allFolders = await db.select().from(chatFolders);
    const foldersMap = allFolders.reduce(
      (acc, folder) => {
        acc[folder.id] = folder;
        return acc;
      },
      {} as Record<string, typeof existingFolder>,
    );

    // Check if user can delete this folder
    if (!(await canDeleteFolder(user, existingFolder, logger, foldersMap))) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.folders.id.delete.errors.forbidden.title",
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    // Delete the folder (cascade will handle child folders and threads)
    await db.delete(chatFolders).where(eq(chatFolders.id, id));

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
