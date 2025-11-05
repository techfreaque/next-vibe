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
import type { UserRoleDB } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

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

    const rolesRead = Array.isArray(folder.rolesRead) ? folder.rolesRead : [];
    const rolesWrite = Array.isArray(folder.rolesWrite)
      ? folder.rolesWrite
      : [];
    const rolesHide = Array.isArray(folder.rolesHide) ? folder.rolesHide : [];
    const rolesDelete = Array.isArray(folder.rolesDelete)
      ? folder.rolesDelete
      : [];

    const responseData = {
      rolesRead,
      rolesWrite,
      rolesHide,
      rolesDelete,
    };

    logger.info("GET permissions response data", responseData);

    return createSuccessResponse(responseData);
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
    const { id, rolesRead, rolesWrite, rolesHide, rolesDelete } = data;

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
      rolesRead?: (typeof UserRoleDB)[number][];
      rolesWrite?: (typeof UserRoleDB)[number][];
      rolesHide?: (typeof UserRoleDB)[number][];
      rolesDelete?: (typeof UserRoleDB)[number][];
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (rolesRead !== undefined) {
      updateData.rolesRead = rolesRead;
    }

    if (rolesWrite !== undefined) {
      updateData.rolesWrite = rolesWrite;
    }

    if (rolesHide !== undefined) {
      updateData.rolesHide = rolesHide;
    }

    if (rolesDelete !== undefined) {
      updateData.rolesDelete = rolesDelete;
    }

    // Update the permissions
    await db.update(chatFolders).set(updateData).where(eq(chatFolders.id, id));

    logger.info("Folder permissions updated", {
      folderId: id,
      rolesReadCount: rolesRead?.length ?? 0,
      rolesWriteCount: rolesWrite?.length ?? 0,
      rolesHideCount: rolesHide?.length ?? 0,
      rolesDeleteCount: rolesDelete?.length ?? 0,
    });

    // Return updated values
    const finalRolesRead = rolesRead ?? existingFolder.rolesRead ?? [];
    const finalRolesWrite = rolesWrite ?? existingFolder.rolesWrite ?? [];
    const finalRolesHide = rolesHide ?? existingFolder.rolesHide ?? [];
    const finalRolesDelete = rolesDelete ?? existingFolder.rolesDelete ?? [];

    return createSuccessResponse({
      response: {
        rolesRead: Array.isArray(finalRolesRead) ? finalRolesRead : [],
        rolesWrite: Array.isArray(finalRolesWrite) ? finalRolesWrite : [],
        rolesHide: Array.isArray(finalRolesHide) ? finalRolesHide : [],
        rolesDelete: Array.isArray(finalRolesDelete) ? finalRolesDelete : [],
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
