/**
 * Root Folder Permissions Repository
 * Computes permissions for root folders (private, shared, public, incognito)
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  DEFAULT_FOLDER_CONFIGS,
  isIncognitoFolder,
} from "@/app/api/[locale]/v1/core/agent/chat/config";
import {
  canCreateFolder,
  hasRolePermission,
} from "@/app/api/[locale]/v1/core/agent/chat/permissions/permissions";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  RootPermissionsGetRequestOutput,
  RootPermissionsGetResponseOutput,
} from "./definition";

/**
 * Root Folder Permissions Repository Interface
 */
export interface RootFolderPermissionsRepositoryInterface {
  getRootFolderPermissions(
    data: RootPermissionsGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<RootPermissionsGetResponseOutput>>;
}

/**
 * Root Folder Permissions Repository Implementation
 */
export class RootFolderPermissionsRepositoryImpl
  implements RootFolderPermissionsRepositoryInterface
{
  /**
   * Compute permissions for a root folder
   * Root folders don't exist in the database, so we compute permissions based on DEFAULT_FOLDER_CONFIGS
   *
   * For non-public root folders (private, shared, incognito), permissions are always true
   * For public root folder, permissions are based on user role and folder config
   */
  async getRootFolderPermissions(
    data: RootPermissionsGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<RootPermissionsGetResponseOutput>> {
    const { rootFolderId } = data;

    // Get the root folder config
    const rootConfig = DEFAULT_FOLDER_CONFIGS.find(
      (config) => config.id === rootFolderId,
    );

    if (!rootConfig) {
      logger.error("Root folder config not found", { rootFolderId });
      return success({
        canCreateThread: false,
        canCreateFolder: false,
      });
    }

    // Special handling for incognito folder
    // Incognito is localStorage-only and should allow everyone to create threads/folders locally
    const isIncognito = isIncognitoFolder(rootFolderId);

    if (isIncognito) {
      return success({
        canCreateThread: true,
        canCreateFolder: true,
      });
    }

    // Admin users can always create threads and folders in any root folder
    const userId = user.id;
    if (userId) {
      const { isAdmin } = await import("../../permissions/permissions");
      const isAdminUser = await isAdmin(userId, logger);
      if (isAdminUser) {
        return success({
          canCreateThread: true,
          canCreateFolder: true,
        });
      }
    }

    // For PRIVATE and SHARED root folders with empty rolesCreateThread ([]),
    // authenticated users should be able to create threads (owner-only semantics don't apply to root folders)
    // For PUBLIC root folder, use the explicit rolesCreateThread configuration
    let canCreateThreadInRoot: boolean;
    if (
      (rootFolderId === "private" || rootFolderId === "shared") &&
      rootConfig.rolesCreateThread.length === 0
    ) {
      // Empty array for PRIVATE/SHARED means "authenticated users only"
      canCreateThreadInRoot = !user.isPublic && !!userId;
    } else {
      // Use the rolesCreateThread from the root folder config
      canCreateThreadInRoot = await hasRolePermission(
        user,
        rootConfig.rolesCreateThread,
        logger,
      );
    }

    // Check canCreateFolder permission
    // Use canCreateFolder helper which has special logic for each root folder
    const canCreateFolderInRoot = await canCreateFolder(
      user,
      rootFolderId,
      logger,
      null, // No parent folder for root level
    );

    return success({
      canCreateThread: canCreateThreadInRoot,
      canCreateFolder: canCreateFolderInRoot,
    });
  }
}

export const rootFolderPermissionsRepository =
  new RootFolderPermissionsRepositoryImpl();
