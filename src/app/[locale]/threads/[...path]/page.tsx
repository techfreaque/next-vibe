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

import { redirect } from "next-vibe-ui/lib/redirect";
import type { JSX } from "react";

import { isUUID, parseChatUrl } from "@/app/[locale]/chat/lib/url-parser";
import { ChatInterface } from "@/app/api/[locale]/agent/chat/_components/chat-interface";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { NEW_MESSAGE_ID } from "@/app/api/[locale]/agent/chat/enum";
import { folderRepository } from "@/app/api/[locale]/agent/chat/folders/[id]/repository";
import { rootFolderPermissionsRepository } from "@/app/api/[locale]/agent/chat/folders/root-permissions/repository";
import { ChatProvider } from "@/app/api/[locale]/agent/chat/hooks/context";
import { threadByIdRepository } from "@/app/api/[locale]/agent/chat/threads/[threadId]/repository";
import { creditRepository } from "@/app/api/[locale]/credits/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { userRepository } from "@/app/api/[locale]/user/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

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
  const logger = createEndpointLogger(false, Date.now(), locale);

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
      locale,
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
      const folderResponse = await folderRepository.getFolder(
        user,
        { id: initialThreadId },
        logger,
        locale,
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

  // Handle redirects based on root folder type
  // For private/shared/incognito: redirect from root to /new
  // For public: redirect from /new to root
  if (
    (initialRootFolderId === DefaultFolderId.PRIVATE ||
      initialRootFolderId === DefaultFolderId.SHARED ||
      initialRootFolderId === DefaultFolderId.INCOGNITO) &&
    !initialThreadId &&
    !initialSubFolderId
  ) {
    redirect(`/${locale}/threads/${initialRootFolderId}/${NEW_MESSAGE_ID}`);
  }

  return (
    <ChatProvider
      user={user}
      locale={locale}
      activeThreadId={initialThreadId}
      currentRootFolderId={initialRootFolderId}
      currentSubFolderId={initialSubFolderId}
      initialCredits={creditsToUse}
      rootFolderPermissions={rootFolderPermissions}
    >
      <ChatInterface user={user} />
    </ChatProvider>
  );
}
