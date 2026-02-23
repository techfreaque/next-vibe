import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { chatFolders } from "@/app/api/[locale]/agent/chat/db";
import {
  canDeleteFolder,
  canUpdateFolder,
  canViewFolder,
} from "@/app/api/[locale]/agent/chat/permissions/permissions";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  FolderDeleteResponseOutput,
  FolderGetResponseOutput,
  FolderUpdateRequestOutput,
  FolderUpdateResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

/**
 * Folder Repository - Static class pattern
 * Uses direct database access for folder operations
 */
export class FolderRepository {
  /**
   * Get a single folder by ID
   */
  static async getFolder(
    user: JwtPayloadType,
    data: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [folder] = await db
        .select()
        .from(chatFolders)
        .where(eq(chatFolders.id, data.id))
        .limit(1);

      if (!folder) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Check if user can read this folder
      if (!(await canViewFolder(user, folder, logger, locale))) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return success({
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
            rolesView: folder.rolesView,
            rolesManage: folder.rolesManage,
            rolesCreateThread: folder.rolesCreateThread,
            rolesPost: folder.rolesPost,
            rolesModerate: folder.rolesModerate,
            rolesAdmin: folder.rolesAdmin,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
          },
        },
      });
    } catch {
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update a folder
   */
  static async updateFolder(
    user: JwtPayloadType,
    data: FolderUpdateRequestOutput & { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderUpdateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
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
          message: t("patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Check if user can update this folder (moderators can rename)
      if (!(await canUpdateFolder(user, existingFolder, logger, locale))) {
        return fail({
          message: t("patch.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Prevent circular parent references
      if (updates.parentId === id) {
        return fail({
          message: t("patch.errors.validation.circularReference"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Update the folder
      logger.info("Updating folder", { id });

      // Build update object with proper types
      const updateData: Partial<typeof chatFolders.$inferInsert> = {
        updatedAt: new Date(),
      };

      // Only include fields that are actually being updated
      if (updates.name !== undefined) {
        updateData.name = updates.name;
      }
      if (updates.icon !== undefined) {
        updateData.icon = updates.icon;
      }
      if (updates.color !== undefined) {
        updateData.color = updates.color;
      }
      if (updates.parentId !== undefined) {
        updateData.parentId = updates.parentId;
      }
      if (updates.expanded !== undefined) {
        updateData.expanded = updates.expanded;
      }
      if (updates.sortOrder !== undefined) {
        updateData.sortOrder = updates.sortOrder;
      }
      if (updates.rolesView !== undefined) {
        updateData.rolesView = updates.rolesView;
      }
      if (updates.rolesManage !== undefined) {
        updateData.rolesManage = updates.rolesManage;
      }
      if (updates.rolesCreateThread !== undefined) {
        updateData.rolesCreateThread = updates.rolesCreateThread;
      }
      if (updates.rolesPost !== undefined) {
        updateData.rolesPost = updates.rolesPost;
      }
      if (updates.rolesModerate !== undefined) {
        updateData.rolesModerate = updates.rolesModerate;
      }
      if (updates.rolesAdmin !== undefined) {
        updateData.rolesAdmin = updates.rolesAdmin;
      }

      const [updatedFolder] = await db
        .update(chatFolders)
        .set(updateData)
        .where(eq(chatFolders.id, id))
        .returning();
      logger.info("Updated folder result:", {
        updatedFolder: updatedFolder ? { id: updatedFolder.id } : null,
      });

      if (!updatedFolder) {
        return fail({
          message: t("patch.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
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
            rolesView: updatedFolder.rolesView,
            rolesManage: updatedFolder.rolesManage,
            rolesCreateThread: updatedFolder.rolesCreateThread,
            rolesPost: updatedFolder.rolesPost,
            rolesModerate: updatedFolder.rolesModerate,
            rolesAdmin: updatedFolder.rolesAdmin,
            createdAt: updatedFolder.createdAt,
            updatedAt: updatedFolder.updatedAt,
          },
        },
      });
    } catch {
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete a folder (cascade deletes handled by database)
   */
  static async deleteFolder(
    user: JwtPayloadType,
    data: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderDeleteResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
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
          message: t("delete.errors.notFound.title"),
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
      if (
        !(await canDeleteFolder(
          user,
          existingFolder,
          logger,
          locale,
          foldersMap,
        ))
      ) {
        return fail({
          message: t("delete.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Delete the folder (cascade will handle child folders and threads)
      await db.delete(chatFolders).where(eq(chatFolders.id, id));

      return success({
        response: {
          success: true,
          deletedFolderId: id,
        },
      });
    } catch {
      return fail({
        message: t("delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

// Type for native repository type checking
export type FolderRepositoryType = Pick<
  typeof FolderRepository,
  keyof typeof FolderRepository
>;
