import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { chatFolders } from "@/app/api/[locale]/agent/chat/db";
import { canManageFolderPermissions } from "@/app/api/[locale]/agent/chat/permissions/permissions";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  FolderPermissionsGetResponseOutput,
  FolderPermissionsUpdateRequestOutput,
  FolderPermissionsUpdateResponseOutput,
} from "./definition";
import type { FolderPermissionsT } from "./i18n";

export class FolderPermissionsRepository {
  /**
   * Get folder permissions
   * Returns 6 permission fields: rolesView, rolesManage, rolesCreateThread, rolesPost, rolesModerate, rolesAdmin
   * Each field can be: null (inherit), [] (deny), or [roles...] (allow)
   */
  static async getFolderPermissions(
    user: JwtPayloadType,
    data: { id: string },
    logger: EndpointLogger,
    t: FolderPermissionsT,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderPermissionsGetResponseOutput>> {
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

      // Check if user can manage this folder's permissions
      const canManage = await canManageFolderPermissions(
        user,
        folder,
        logger,
        locale,
      );
      if (!canManage) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Return permissions as-is (null or array)
      const responseData: FolderPermissionsGetResponseOutput = {
        rolesView: folder.rolesView,
        rolesManage: folder.rolesManage,
        rolesCreateThread: folder.rolesCreateThread,
        rolesPost: folder.rolesPost,
        rolesModerate: folder.rolesModerate,
        rolesAdmin: folder.rolesAdmin,
      };

      logger.info("GET permissions response data", responseData);

      return success(responseData);
    } catch {
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update folder permissions
   * Updates 6 permission fields: rolesView, rolesManage, rolesCreateThread, rolesPost, rolesModerate, rolesAdmin
   * Each field can be: null (inherit), [] (deny), or [roles...] (allow)
   */
  static async updateFolderPermissions(
    user: JwtPayloadType,
    data: FolderPermissionsUpdateRequestOutput & { id: string },
    logger: EndpointLogger,
    t: FolderPermissionsT,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderPermissionsUpdateResponseOutput>> {
    if (user.isPublic) {
      return fail({
        message: t("patch.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      const {
        id,
        rolesView,
        rolesManage,
        rolesCreateThread,
        rolesPost,
        rolesModerate,
        rolesAdmin,
      } = data;

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

      // Check if user can manage this folder's permissions
      const canManage = await canManageFolderPermissions(
        user,
        existingFolder,
        logger,
        locale,
      );
      if (!canManage) {
        return fail({
          message: t("patch.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Prepare update data - only update fields that are provided
      const updateData: {
        rolesView?: (typeof UserRoleDB)[number][] | null;
        rolesManage?: (typeof UserRoleDB)[number][] | null;
        rolesCreateThread?: (typeof UserRoleDB)[number][] | null;
        rolesPost?: (typeof UserRoleDB)[number][] | null;
        rolesModerate?: (typeof UserRoleDB)[number][] | null;
        rolesAdmin?: (typeof UserRoleDB)[number][] | null;
        updatedAt: Date;
      } = {
        updatedAt: new Date(),
      };

      if (rolesView !== undefined) {
        updateData.rolesView = rolesView;
      }

      if (rolesManage !== undefined) {
        updateData.rolesManage = rolesManage;
      }

      if (rolesCreateThread !== undefined) {
        updateData.rolesCreateThread = rolesCreateThread;
      }

      if (rolesPost !== undefined) {
        updateData.rolesPost = rolesPost;
      }

      if (rolesModerate !== undefined) {
        updateData.rolesModerate = rolesModerate;
      }

      if (rolesAdmin !== undefined) {
        updateData.rolesAdmin = rolesAdmin;
      }

      // Update the permissions
      await db
        .update(chatFolders)
        .set(updateData)
        .where(eq(chatFolders.id, id));

      logger.info("Folder permissions updated", {
        folderId: id,
        rolesView: rolesView ?? "unchanged",
        rolesManage: rolesManage ?? "unchanged",
        rolesCreateThread: rolesCreateThread ?? "unchanged",
        rolesPost: rolesPost ?? "unchanged",
        rolesModerate: rolesModerate ?? "unchanged",
        rolesAdmin: rolesAdmin ?? "unchanged",
      });

      // Return updated values (use provided values or keep existing)
      return success({
        rolesViewResult: rolesView ?? existingFolder.rolesView,
        rolesManageResult: rolesManage ?? existingFolder.rolesManage,
        rolesCreateThreadResult:
          rolesCreateThread ?? existingFolder.rolesCreateThread,
        rolesPostResult: rolesPost ?? existingFolder.rolesPost,
        rolesModerateResult: rolesModerate ?? existingFolder.rolesModerate,
        rolesAdminResult: rolesAdmin ?? existingFolder.rolesAdmin,
      });
    } catch {
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
