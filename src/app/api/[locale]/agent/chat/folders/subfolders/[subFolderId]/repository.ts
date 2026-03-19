import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { chatFolders } from "@/app/api/[locale]/agent/chat/db";
import { canManageFolder } from "@/app/api/[locale]/agent/chat/permissions/permissions";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  FolderDeleteResponseOutput,
  FolderGetResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";
import type {
  FolderUpdateRequestOutput,
  FolderUpdateResponseOutput,
} from "./update/definition";

/**
 * Folder Repository - Static class pattern
 */
export class FolderRepository {
  static async getFolder(
    user: JwtPayloadType,
    data: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    if (user.isPublic) {
      return fail({
        message: t("get.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

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

      const canManage = await canManageFolder(user, folder, logger, locale);
      if (!canManage) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return success({
        id: folder.id,
        name: folder.name,
        icon: folder.icon,
        color: folder.color,
        parentId: folder.parentId,
        rootFolderId: folder.rootFolderId,
        expanded: folder.expanded,
        sortOrder: folder.sortOrder,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
      });
    } catch {
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async updateFolder(
    user: JwtPayloadType,
    data: FolderUpdateRequestOutput & { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderUpdateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    if (user.isPublic) {
      return fail({
        message: t("get.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      const [existing] = await db
        .select()
        .from(chatFolders)
        .where(eq(chatFolders.id, data.id))
        .limit(1);

      if (!existing) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const canManage = await canManageFolder(user, existing, logger, locale);
      if (!canManage) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const now = new Date();
      const [updated] = await db
        .update(chatFolders)
        .set({
          ...(data.name !== undefined && { name: data.name }),
          ...(data.icon !== undefined && { icon: data.icon }),
          ...(data.color !== undefined && { color: data.color }),
          ...(data.parentId !== undefined && { parentId: data.parentId }),
          ...(data.expanded !== undefined && { expanded: data.expanded }),
          ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
          ...(data.rolesView !== undefined && { rolesView: data.rolesView }),
          ...(data.rolesManage !== undefined && {
            rolesManage: data.rolesManage,
          }),
          ...(data.rolesCreateThread !== undefined && {
            rolesCreateThread: data.rolesCreateThread,
          }),
          ...(data.rolesPost !== undefined && { rolesPost: data.rolesPost }),
          ...(data.rolesModerate !== undefined && {
            rolesModerate: data.rolesModerate,
          }),
          ...(data.rolesAdmin !== undefined && { rolesAdmin: data.rolesAdmin }),
          ...(data.pinned !== undefined && { pinned: data.pinned }),
          updatedAt: now,
        })
        .where(eq(chatFolders.id, data.id))
        .returning();

      logger.info("Folder updated", { folderId: data.id });

      return success({
        folderId: updated.id,
        updatedAt: updated.updatedAt,
      });
    } catch {
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async deleteFolder(
    user: JwtPayloadType,
    data: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderDeleteResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    if (user.isPublic) {
      return fail({
        message: t("delete.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      const [folder] = await db
        .select()
        .from(chatFolders)
        .where(eq(chatFolders.id, data.id))
        .limit(1);

      if (!folder) {
        return fail({
          message: t("delete.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const canManage = await canManageFolder(user, folder, logger, locale);
      if (!canManage) {
        return fail({
          message: t("delete.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      await db.delete(chatFolders).where(eq(chatFolders.id, data.id));

      logger.info("Folder deleted", { folderId: data.id });

      return success({
        id: folder.id,
        name: folder.name,
        updatedAt: new Date(),
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
