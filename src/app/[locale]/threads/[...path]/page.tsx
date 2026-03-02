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
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { isUUID, parseChatUrl } from "@/app/[locale]/chat/lib/url-parser";
import { CharactersRepository } from "@/app/api/[locale]/agent/chat/characters/repository";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { NEW_MESSAGE_ID } from "@/app/api/[locale]/agent/chat/enum";
import { FolderRepository } from "@/app/api/[locale]/agent/chat/folders/[id]/repository";
import { scopedTranslation as foldersScopedTranslation } from "@/app/api/[locale]/agent/chat/folders/i18n";
import { ChatFoldersRepository } from "@/app/api/[locale]/agent/chat/folders/repository";
import { RootFolderPermissionsRepository } from "@/app/api/[locale]/agent/chat/folders/root-permissions/repository";
import { ChatBootProvider } from "@/app/api/[locale]/agent/chat/hooks/context";
import { ChatNavigationProvider } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import { scopedTranslation as settingsScopedTranslation } from "@/app/api/[locale]/agent/chat/settings/i18n";
import { ChatSettingsRepository } from "@/app/api/[locale]/agent/chat/settings/repository";
import { scopedTranslation as messagesScopedTranslation } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/i18n";
import { scopedTranslation as pathScopedTranslation } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/path/i18n";
import { pathRepository } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/path/repository";
import { MessagesRepository } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/repository";
import { ThreadByIdRepository } from "@/app/api/[locale]/agent/chat/threads/[threadId]/repository";
import { scopedTranslation as threadsScopedTranslation } from "@/app/api/[locale]/agent/chat/threads/i18n";
import { ThreadsRepository } from "@/app/api/[locale]/agent/chat/threads/repository";
import { getAgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { EnvAvailabilityProvider } from "@/app/api/[locale]/agent/env-availability-context";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { scopedTranslation as userScopedTranslation } from "@/app/api/[locale]/user/i18n";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import { ChatInterface } from "./_components/chat-interface";

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
  const { t } = userScopedTranslation.scopedT(locale);
  const { t: creditsT } = creditsScopedTranslation.scopedT(locale);

  // Get authenticated user
  const userResponse = await UserRepository.getUserByAuth(
    {
      detailLevel: UserDetailLevel.MINIMAL,
      roles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
    },
    locale,
    logger,
  );

  const user = userResponse.success ? userResponse.data : undefined;
  if (!user) {
    return <Div>{t("auth.errors.unknownError")}</Div>;
  }

  if (env.NEXT_PUBLIC_LOCAL_MODE && user.isPublic) {
    redirect(`/${locale}/user/login`);
  }

  // Fetch credit balance for all users (both authenticated and public)
  // Always fetch credits if we have a user (even public users have leadId)
  const creditsResponse = await CreditRepository.getCreditBalanceForUser(
    user,
    locale,
    logger,
    creditsT,
  );
  const initialCredits = creditsResponse.success ? creditsResponse.data : null;

  // Parse URL server-side to get navigation state
  // This prevents hydration mismatch - URL is the single source of truth
  let { initialRootFolderId, initialSubFolderId, initialThreadId } =
    parseChatUrl(path);

  // Disambiguate between thread IDs and folder IDs
  // Both are UUIDs, so we need to check the database to determine which one it is
  // This happens when URL is /threads/[rootId]/[uuid] - could be either a thread or a folder
  // SKIP for incognito mode - everything is localStorage-only, no server calls
  if (
    initialThreadId &&
    !initialSubFolderId &&
    isUUID(initialThreadId) &&
    user &&
    initialRootFolderId !== DefaultFolderId.INCOGNITO
  ) {
    // Check if it's a thread first
    const threadResponse = await ThreadByIdRepository.getThreadById(
      initialThreadId,
      user,
      locale,
      logger,
    );

    if (!threadResponse.success) {
      // Not a thread, check if it's a folder
      const folderResponse = await FolderRepository.getFolder(
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
    earned: 0,
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
      await RootFolderPermissionsRepository.getRootFolderPermissions(
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

  const envAvailability = getAgentEnvAvailability();

  // Prefetch initial sidebar + thread data server-side to avoid client-side fetch on mount.
  // Skip for incognito (localStorage-only).
  // This data is passed as initialData so pages render immediately without a fetch.
  let initialFoldersData = null;
  let initialThreadsData = null;
  let initialMessagesData = null;
  let initialPathData = null;
  let initialSettingsData = null;
  let initialCharacterData = null;

  if (initialRootFolderId !== DefaultFolderId.INCOGNITO && user) {
    const { t: foldersT } = foldersScopedTranslation.scopedT(locale);
    const { t: threadsT } = threadsScopedTranslation.scopedT(locale);
    const { t: messagesT } = messagesScopedTranslation.scopedT(locale);
    const { t: settingsT } = settingsScopedTranslation.scopedT(locale);
    const { t: pathT } = pathScopedTranslation.scopedT(locale);

    const activeThreadIdForFetch =
      initialThreadId && initialThreadId !== NEW_MESSAGE_ID
        ? initialThreadId
        : null;

    // Fetch folders, threads, messages, settings in parallel (settings needed to know the character)
    const [foldersResult, threadsResult, messagesResult, settingsResult] =
      await Promise.all([
        ChatFoldersRepository.getFolders(
          { rootFolderId: initialRootFolderId },
          user,
          foldersT,
          logger,
          locale,
        ),
        ThreadsRepository.listThreads(
          {
            rootFolderId: initialRootFolderId,
            subFolderId: initialSubFolderId ?? undefined,
            page: 1,
            limit: 50,
          },
          user,
          threadsT,
          logger,
          locale,
        ),
        activeThreadIdForFetch
          ? MessagesRepository.listMessages(
              { threadId: activeThreadIdForFetch },
              user,
              messagesT,
              logger,
              locale,
            )
          : Promise.resolve(null),
        user.isPublic
          ? Promise.resolve(null)
          : ChatSettingsRepository.getSettings(user, logger, settingsT),
      ]);

    if (foldersResult.success) {
      initialFoldersData = foldersResult.data;
    }
    if (threadsResult.success) {
      initialThreadsData = threadsResult.data;
    }
    if (messagesResult && messagesResult.success) {
      initialMessagesData = messagesResult.data;
    }
    if (settingsResult && settingsResult.success) {
      initialSettingsData = settingsResult.data;
    }

    // Fetch path + character in parallel (character depends on settings, path depends on thread)
    const selectedCharacter = initialSettingsData?.selectedCharacter ?? null;

    const [pathResult, characterResult] = await Promise.all([
      activeThreadIdForFetch
        ? pathRepository.getPath(
            { threadId: activeThreadIdForFetch },
            { branchIndices: {} },
            user,
            pathT,
            logger,
            locale,
          )
        : Promise.resolve(null),
      selectedCharacter
        ? CharactersRepository.getCharacterById(
            { id: selectedCharacter },
            user,
            logger,
            locale,
          )
        : Promise.resolve(null),
    ]);

    if (pathResult && pathResult.success) {
      initialPathData = pathResult.data;
    }
    if (characterResult && characterResult.success) {
      initialCharacterData = characterResult.data;
    }
  }

  return (
    <EnvAvailabilityProvider availability={envAvailability}>
      <ChatNavigationProvider
        activeThreadId={initialThreadId}
        currentRootFolderId={initialRootFolderId}
        currentSubFolderId={initialSubFolderId}
      >
        <ChatBootProvider
          user={user}
          locale={locale}
          activeThreadId={initialThreadId}
          currentRootFolderId={initialRootFolderId}
          currentSubFolderId={initialSubFolderId}
          initialCredits={creditsToUse}
          rootFolderPermissions={rootFolderPermissions}
          envAvailability={envAvailability}
          initialFoldersData={initialFoldersData}
          initialThreadsData={initialThreadsData}
          initialMessagesData={initialMessagesData}
          initialPathData={initialPathData}
          initialSettingsData={initialSettingsData}
          initialCharacterData={initialCharacterData}
        >
          <ChatInterface user={user} />
        </ChatBootProvider>
      </ChatNavigationProvider>
    </EnvAvailabilityProvider>
  );
}
