/**
 * Catch-all route for threads with nested folder support
 * Handles:
 * - /threads/[rootId] - Root folder view
 * - /threads/[rootId]/[sub1]/[sub2]/... - Nested folder view
 * - /threads/[rootId]/[sub1]/.../[threadId] - Thread view
 *
 * All paths render the same ChatInterface component.
 * The ChatInterface will determine from the URL path whether to show:
 * - Folder view (no thread selected, just sidebar + empty chat area)
 * - Thread view (specific thread selected, sidebar + chat messages)
 */

import type { JSX } from "react";

import { ChatProvider } from "@/app/api/[locale]/v1/core/agent/chat/hooks/context";
import { isUUID, parseChatUrl } from "@/app/[locale]/chat/lib/url-parser";
import { getFolder } from "@/app/api/[locale]/v1/core/agent/chat/folders/[id]/repository";
import { rootFolderPermissionsRepository } from "@/app/api/[locale]/v1/core/agent/chat/folders/root-permissions/repository";
import { threadByIdRepository } from "@/app/api/[locale]/v1/core/agent/chat/threads/[threadId]/repository";
import { creditRepository } from "@/app/api/[locale]/v1/core/credits/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { ChatInterface } from "../../chat/components/chat-interface";

interface ThreadsPathPageProps {
  params: Promise<{
    locale: CountryLanguage;
    path: string[];
  }>;
}

export default async function ThreadsPathPage({
  params,
}: ThreadsPathPageProps): Promise<JSX.Element> {
  const { locale, path } = await params;
  const logger = createEndpointLogger(true, Date.now(), locale);

  // Get authenticated user
  const userResponse = await userRepository.getUserByAuth(
    {
      detailLevel: UserDetailLevel.MINIMAL,
      roles: [UserRole.PUBLIC, UserRole.CUSTOMER],
    },
    locale,
    logger,
  );

  const user = userResponse.success ? userResponse.data : undefined;

  // Fetch credit balance for all users (both authenticated and public)
  // Always fetch credits if we have a user (even public users have leadId)
  let initialCredits = null;
  if (userResponse.success && userResponse.data) {
    const creditsResponse = await creditRepository.getCreditBalanceForUser(
      userResponse.data,
      logger,
    );
    initialCredits = creditsResponse.success ? creditsResponse.data : null;

    logger.debug("Server-side credits fetch", {
      success: creditsResponse.success,
      hasData: !!initialCredits,
      isPublic: userResponse.data.isPublic,
      leadId: userResponse.data.leadId,
    });
  }

  // Parse URL server-side to get navigation state
  // This prevents hydration mismatch - URL is the single source of truth
  let { initialRootFolderId, initialSubFolderId, initialThreadId } =
    parseChatUrl(path);

  // Disambiguate between thread IDs and folder IDs
  // Both are UUIDs, so we need to check the database to determine which one it is
  // This happens when URL is /threads/[rootId]/[uuid] - could be either a thread or a folder
  if (
    initialThreadId &&
    !initialSubFolderId &&
    isUUID(initialThreadId) &&
    user
  ) {
    // Check if it's a thread first
    const threadResponse = await threadByIdRepository.getThreadById(
      initialThreadId,
      user,
      locale,
      logger,
    );

    if (!threadResponse.success) {
      // Not a thread, check if it's a folder
      const folderResponse = await getFolder(
        user,
        { id: initialThreadId },
        logger,
      );

      if (folderResponse.success) {
        // It's a folder! Correct the parsed values
        logger.debug("URL disambiguation: UUID is a folder, not a thread", {
          folderId: initialThreadId,
        });
        initialSubFolderId = initialThreadId;
        initialThreadId = null;
      }
    }
  }

  // Provide default credits if null (e.g., for unauthenticated users or error cases)
  const creditsToUse = initialCredits ?? {
    total: 0,
    expiring: 0,
    permanent: 0,
    free: 0,
    expiresAt: null,
  };

  // Compute root folder permissions server-side
  // This is stateless and based on user role + folder config
  let rootFolderPermissions = {
    canCreateThread: false,
    canCreateFolder: false,
  };
  if (user) {
    const permissionsResult =
      await rootFolderPermissionsRepository.getRootFolderPermissions(
        { rootFolderId: initialRootFolderId },
        user,
        locale,
        logger,
      );
    if (permissionsResult.success) {
      rootFolderPermissions = permissionsResult.data;
    }
  }

  return (
    <ChatProvider
      locale={locale}
      activeThreadId={initialThreadId}
      currentRootFolderId={initialRootFolderId}
      currentSubFolderId={initialSubFolderId}
      initialCredits={creditsToUse}
      rootFolderPermissions={rootFolderPermissions}
    >
      <ChatInterface urlPath={path} user={user} />
    </ChatProvider>
  );
}
