import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { canManageThreadPermissions } from "@/app/api/[locale]/agent/chat/permissions/permissions";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  ThreadPermissionsGetResponseOutput,
  ThreadPermissionsUpdateRequestOutput,
  ThreadPermissionsUpdateResponseOutput,
} from "./definition";
import type { ThreadPermissionsT } from "./i18n";

export class ThreadPermissionsRepository {
  /**
   * Get thread permissions
   * Returns 5 permission fields: rolesView, rolesEdit, rolesPost, rolesModerate, rolesAdmin
   * Each field can be: null (inherit), [] (deny), or [roles...] (allow)
   */
  static async getThreadPermissions(
    user: JwtPayloadType,
    data: { threadId: string },
    t: ThreadPermissionsT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ThreadPermissionsGetResponseOutput>> {
    if (user.isPublic) {
      return fail({
        message: t("get.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, data.threadId))
        .limit(1);

      if (!thread) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Check if user can manage this thread's permissions
      const canManage = await canManageThreadPermissions(
        user,
        thread,
        null,
        logger,
        locale,
      );
      if (!canManage) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Return permissions as-is (null, [], or [roles...])
      return success({
        rolesView: thread.rolesView,
        rolesEdit: thread.rolesEdit,
        rolesPost: thread.rolesPost,
        rolesModerate: thread.rolesModerate,
        rolesAdmin: thread.rolesAdmin,
      });
    } catch {
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update thread permissions
   * Updates 5 permission fields: rolesView, rolesEdit, rolesPost, rolesModerate, rolesAdmin
   * Each field can be: null (inherit), [] (deny), or [roles...] (allow)
   */
  static async updateThreadPermissions(
    user: JwtPayloadType,
    data: ThreadPermissionsUpdateRequestOutput & { threadId: string },
    t: ThreadPermissionsT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ThreadPermissionsUpdateResponseOutput>> {
    if (user.isPublic) {
      return fail({
        message: t("patch.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    try {
      const {
        threadId,
        rolesView,
        rolesEdit,
        rolesPost,
        rolesModerate,
        rolesAdmin,
      } = data;

      // Verify thread exists
      const [existingThread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      if (!existingThread) {
        return fail({
          message: t("patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Check if user can manage this thread's permissions
      const canManage = await canManageThreadPermissions(
        user,
        existingThread,
        null,
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
        rolesEdit?: (typeof UserRoleDB)[number][] | null;
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

      if (rolesEdit !== undefined) {
        updateData.rolesEdit = rolesEdit;
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
        .update(chatThreads)
        .set(updateData)
        .where(eq(chatThreads.id, threadId));

      logger.info("Thread permissions updated", {
        threadId,
        rolesView: rolesView ?? "unchanged",
        rolesEdit: rolesEdit ?? "unchanged",
        rolesPost: rolesPost ?? "unchanged",
        rolesModerate: rolesModerate ?? "unchanged",
        rolesAdmin: rolesAdmin ?? "unchanged",
      });

      // Return updated values (use provided values or keep existing)
      return success({
        rolesViewResult: rolesView ?? existingThread.rolesView,
        rolesEditResult: rolesEdit ?? existingThread.rolesEdit,
        rolesPostResult: rolesPost ?? existingThread.rolesPost,
        rolesModerateResult: rolesModerate ?? existingThread.rolesModerate,
        rolesAdminResult: rolesAdmin ?? existingThread.rolesAdmin,
      });
    } catch {
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
