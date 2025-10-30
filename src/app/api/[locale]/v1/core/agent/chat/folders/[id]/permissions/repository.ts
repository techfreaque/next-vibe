import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import { chatFolders } from "@/app/api/[locale]/v1/core/agent/chat/db";
import { canManageFolder } from "@/app/api/[locale]/v1/core/agent/chat/permissions/permissions";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";

import type {
  FolderPermissionsGetResponseOutput,
  FolderPermissionsUpdateRequestOutput,
  FolderPermissionsUpdateResponseOutput,
} from "./definition";

/**
 * Get folder permissions (moderator IDs)
 */
export async function getFolderPermissions(
  user: JwtPayloadType,
  data: { id: string },
  logger: EndpointLogger,
): Promise<ResponseType<FolderPermissionsGetResponseOutput>> {
  if (user.isPublic) {
    return fail({
      message:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.unauthorized.title",
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
        message:
          "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.notFound.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Check if user can manage this folder's permissions
    const canManage = await canManageFolder(user, folder, logger);
    if (!canManage) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.forbidden.title",
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    const moderatorIds = Array.isArray(folder.moderatorIds)
      ? folder.moderatorIds
      : [];
    const allowedRoles = Array.isArray(folder.allowedRoles)
      ? folder.allowedRoles
      : [];

    return createSuccessResponse({
      response: {
        allowedRoles,
        moderatorIds,
      },
    });
  } catch {
    return fail({
      message:
        "app.api.v1.core.agent.chat.folders.id.permissions.get.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * Update folder permissions (moderator IDs)
 */
export async function updateFolderPermissions(
  user: JwtPayloadType,
  data: FolderPermissionsUpdateRequestOutput & { id: string },
  logger: EndpointLogger,
): Promise<ResponseType<FolderPermissionsUpdateResponseOutput>> {
  if (user.isPublic) {
    return fail({
      message:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.unauthorized.title",
      errorType: ErrorResponseTypes.UNAUTHORIZED,
    });
  }

  try {
    const { id, moderatorIds, allowedRoles } = data;

    // Verify folder exists
    const [existingFolder] = await db
      .select()
      .from(chatFolders)
      .where(eq(chatFolders.id, id))
      .limit(1);

    if (!existingFolder) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.notFound.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Check if user can manage this folder's permissions
    const canManage = await canManageFolder(user, existingFolder, logger);
    if (!canManage) {
      return fail({
        message:
          "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.forbidden.title",
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    // Prepare update data - only update fields that are provided
    const updateData: {
      moderatorIds?: string[];
      allowedRoles?: string[];
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (moderatorIds !== undefined) {
      updateData.moderatorIds = moderatorIds;
    }

    if (allowedRoles !== undefined) {
      updateData.allowedRoles = allowedRoles;
    }

    // Update the permissions
    await db
      .update(chatFolders)
      .set(updateData)
      .where(eq(chatFolders.id, id));

    logger.info("Folder permissions updated", {
      folderId: id,
      moderatorCount: moderatorIds?.length ?? 0,
      allowedRolesCount: allowedRoles?.length ?? 0,
    });

    // Return updated values
    const finalModeratorIds = moderatorIds ?? existingFolder.moderatorIds ?? [];
    const finalAllowedRoles = allowedRoles ?? existingFolder.allowedRoles ?? [];

    return createSuccessResponse({
      response: {
        allowedRoles: Array.isArray(finalAllowedRoles)
          ? finalAllowedRoles
          : [],
        moderatorIds: Array.isArray(finalModeratorIds)
          ? finalModeratorIds
          : [],
      },
    });
  } catch {
    return fail({
      message:
        "app.api.v1.core.agent.chat.folders.id.permissions.patch.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
