import { useMemo } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";

type ChatContextType = ReturnType<typeof useChatContext>;

interface ChatPermissionsResult {
  canPost: boolean;
  noPermissionReason: string | undefined;
}

/**
 * Hook to compute chat posting permissions and user-friendly permission denial messages.
 * This determines if the user can send messages based on thread and folder permissions.
 */
export function useChatPermissions(
  chat: ChatContextType,
  locale: CountryLanguage,
): ChatPermissionsResult {
  const { t } = simpleT(locale);
  const {
    activeThread: thread,
    currentSubFolderId,
    folders,
    rootFolderPermissions,
  } = chat;

  // Compute canPost permission reactively
  // This determines if the user can send messages in the current context
  const canPost = useMemo(() => {
    // If there's a thread, use thread's canPost permission
    if (thread) {
      return thread.canPost ?? true;
    }
    // If no thread, check if user can create threads in current folder
    // Case 1: We're in a subfolder - use server-computed canCreateThread permission
    if (currentSubFolderId) {
      const currentFolder = folders[currentSubFolderId];
      // If folder not loaded yet, optimistically enable input (will be corrected once loaded)
      return currentFolder?.canCreateThread ?? true;
    }
    // Case 2: We're in a root folder (no subfolder)
    // Use server-computed root folder permissions passed as props
    return rootFolderPermissions.canCreateThread;
  }, [thread, currentSubFolderId, folders, rootFolderPermissions]);

  // Compute noPermissionReason reactively
  // This provides a user-friendly message explaining why they can't post
  const noPermissionReason = useMemo(() => {
    if (thread && thread.canPost === false) {
      return t("app.chat.input.noPostPermission");
    }
    if (!thread && currentSubFolderId) {
      const currentFolder = folders[currentSubFolderId];
      // Only show message if folder is loaded and permission is explicitly false
      if (currentFolder && currentFolder.canCreateThread === false) {
        return t("app.chat.input.noCreateThreadPermission");
      }
    }
    // Check root folder permissions (server-computed, passed as props)
    if (
      !thread &&
      !currentSubFolderId &&
      rootFolderPermissions.canCreateThread === false
    ) {
      return t("app.chat.input.noCreateThreadPermissionInRootFolder");
    }
    return undefined;
  }, [thread, currentSubFolderId, folders, rootFolderPermissions, t]);

  return { canPost, noPermissionReason };
}
