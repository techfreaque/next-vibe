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

export const dynamic = "force-dynamic";

import { redirect } from "next-vibe-ui/lib/redirect";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { isUUID, parseChatUrl } from "@/app/[locale]/chat/lib/url-parser";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { NEW_MESSAGE_ID } from "@/app/api/[locale]/agent/chat/enum";
import type { FolderContentsResponseOutput } from "@/app/api/[locale]/agent/chat/folder-contents/[rootFolderId]/definition";
import { scopedTranslation as folderContentsScopedTranslation } from "@/app/api/[locale]/agent/chat/folder-contents/[rootFolderId]/i18n";
import { FolderContentsRepository } from "@/app/api/[locale]/agent/chat/folder-contents/[rootFolderId]/repository";
import type { FolderListResponseOutput } from "@/app/api/[locale]/agent/chat/folders/[rootFolderId]/definition";
import { scopedTranslation as foldersScopedTranslation } from "@/app/api/[locale]/agent/chat/folders/[rootFolderId]/i18n";
import { ChatFoldersRepository } from "@/app/api/[locale]/agent/chat/folders/[rootFolderId]/repository";
import { RootFolderPermissionsRepository } from "@/app/api/[locale]/agent/chat/folders/[rootFolderId]/root-permissions/repository";
import { FolderRepository } from "@/app/api/[locale]/agent/chat/folders/subfolders/[subFolderId]/repository";
import type { RootFolderPermissions } from "@/app/api/[locale]/agent/chat/hooks/context";
import { ChatBootProvider } from "@/app/api/[locale]/agent/chat/hooks/context";
import { ChatNavigationProvider } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import type { PublicFeedGetResponseOutput } from "@/app/api/[locale]/agent/chat/public-feed/definition";
import { FeedSortMode } from "@/app/api/[locale]/agent/chat/public-feed/definition";
import { scopedTranslation as publicFeedScopedTranslation } from "@/app/api/[locale]/agent/chat/public-feed/i18n";
import { PublicFeedRepository } from "@/app/api/[locale]/agent/chat/public-feed/repository";
import type { ChatSettingsGetResponseOutput } from "@/app/api/[locale]/agent/chat/settings/definition";
import { scopedTranslation as settingsScopedTranslation } from "@/app/api/[locale]/agent/chat/settings/i18n";
import { ChatSettingsRepository } from "@/app/api/[locale]/agent/chat/settings/repository";
import type { SkillGetResponseOutput } from "@/app/api/[locale]/agent/chat/skills/[id]/definition";
import { SkillsRepository } from "@/app/api/[locale]/agent/chat/skills/repository";
import type { MessageListResponseOutput } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/definition";
import { scopedTranslation as messagesScopedTranslation } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/i18n";
import type { PathGetResponseOutput } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/path/definition";
import { scopedTranslation as pathScopedTranslation } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/path/i18n";
import { pathRepository } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/path/repository";
import { MessagesRepository } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/repository";
import { ThreadByIdRepository } from "@/app/api/[locale]/agent/chat/threads/[threadId]/repository";
import type { ThreadListResponseOutput } from "@/app/api/[locale]/agent/chat/threads/definition";
import { scopedTranslation as threadsScopedTranslation } from "@/app/api/[locale]/agent/chat/threads/i18n";
import { ThreadsRepository } from "@/app/api/[locale]/agent/chat/threads/repository";
import type { AgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { agentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { EnvAvailabilitySetter } from "@/app/api/[locale]/agent/env-availability-context";
import type { CreditsGetResponseOutput } from "@/app/api/[locale]/credits/definition";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
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
  searchParams: Promise<{
    message?: string;
  }>;
}

export interface ThreadsPathPageData {
  locale: CountryLanguage;
  user: JwtPayloadType | null;
  creditsToUse: CreditsGetResponseOutput;
  initialRootFolderId: DefaultFolderId;
  initialSubFolderId: string | null;
  initialThreadId: string | null;
  rootFolderPermissions: RootFolderPermissions;
  envAvailability: AgentEnvAvailability;
  leafMessageId: string | null;
  initialFoldersData: FolderListResponseOutput | null;
  initialThreadsData: ThreadListResponseOutput | null;
  initialMessagesData: MessageListResponseOutput | null;
  initialPathData: PathGetResponseOutput | null;
  initialSettingsData: ChatSettingsGetResponseOutput | null;
  initialSkillData: SkillGetResponseOutput | null;
  initialPublicFeedData: PublicFeedGetResponseOutput | null;
  initialFolderContentsData: FolderContentsResponseOutput | null;
  initialSubFolderContentsData: FolderContentsResponseOutput | null;
}

export async function tanstackLoader({
  params,
  searchParams,
}: ThreadsPathPageProps): Promise<ThreadsPathPageData> {
  const { locale, path } = await params;
  const resolvedSearchParams = await searchParams;
  const logger = createEndpointLogger(false, Date.now(), locale);
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

  // Determine root folder early so we can redirect unauthenticated users
  // away from private/incognito folders before doing any DB work
  const { initialRootFolderId: earlyRootFolderId } = parseChatUrl(path);

  if (user?.isPublic && earlyRootFolderId === DefaultFolderId.PRIVATE) {
    redirect(`/${locale}/threads/incognito`);
  }

  if (!user) {
    return {
      locale,
      user: null,
      creditsToUse: {
        total: 0,
        expiring: 0,
        permanent: 0,
        earned: 0,
        free: 0,
        expiresAt: null,
      },
      initialRootFolderId: DefaultFolderId.PRIVATE,
      initialSubFolderId: null,
      initialThreadId: null,
      rootFolderPermissions: { canCreateThread: false, canCreateFolder: false },
      envAvailability: agentEnvAvailability,
      leafMessageId: null,
      initialFoldersData: null,
      initialThreadsData: null,
      initialMessagesData: null,
      initialPathData: null,
      initialSettingsData: null,
      initialSkillData: null,
      initialPublicFeedData: null,
      initialFolderContentsData: null,
      initialSubFolderContentsData: null,
    };
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
  let rootFolderPermissions: RootFolderPermissions = {
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

  // Prefetch initial sidebar + thread data server-side to avoid client-side fetch on mount.
  // Skip for incognito (localStorage-only).
  // This data is passed as initialData so pages render immediately without a fetch.
  const leafMessageId = resolvedSearchParams.message ?? null;

  let initialFoldersData: FolderListResponseOutput | null = null;
  let initialThreadsData: ThreadListResponseOutput | null = null;
  let initialMessagesData: MessageListResponseOutput | null = null;
  let initialPathData: PathGetResponseOutput | null = null;
  let initialSettingsData: ChatSettingsGetResponseOutput | null = null;
  let initialSkillData: SkillGetResponseOutput | null = null;
  let initialPublicFeedData: PublicFeedGetResponseOutput | null = null;
  let initialFolderContentsData: FolderContentsResponseOutput | null = null;
  let initialSubFolderContentsData: FolderContentsResponseOutput | null = null;

  if (initialRootFolderId !== DefaultFolderId.INCOGNITO && user) {
    const { t: foldersT } = foldersScopedTranslation.scopedT(locale);
    const { t: threadsT } = threadsScopedTranslation.scopedT(locale);
    const { t: messagesT } = messagesScopedTranslation.scopedT(locale);
    const { t: settingsT } = settingsScopedTranslation.scopedT(locale);
    const { t: pathT } = pathScopedTranslation.scopedT(locale);
    const { t: folderContentsT } =
      folderContentsScopedTranslation.scopedT(locale);

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
            subFolderId: initialSubFolderId ?? null,
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
    const selectedSkill = initialSettingsData?.selectedSkill ?? null;

    const [pathResult, characterResult] = await Promise.all([
      activeThreadIdForFetch
        ? pathRepository.getPath(
            { threadId: activeThreadIdForFetch },
            {
              rootFolderId: initialRootFolderId,
              leafMessageId: leafMessageId ?? undefined,
            },
            user,
            pathT,
            logger,
            locale,
          )
        : Promise.resolve(null),
      selectedSkill
        ? SkillsRepository.getSkillById(
            { id: selectedSkill },
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
      initialSkillData = characterResult.data;
    }

    // Fetch public feed data server-side when on the public folder with no active thread
    if (
      initialRootFolderId === DefaultFolderId.PUBLIC &&
      !activeThreadIdForFetch
    ) {
      const { t: publicFeedT } = publicFeedScopedTranslation.scopedT(locale);
      const publicFeedResult = await PublicFeedRepository.getFeed(
        { sortMode: FeedSortMode.HOT, page: 1, limit: 20 },
        user,
        publicFeedT,
        logger,
        locale,
      );
      if (publicFeedResult.success) {
        initialPublicFeedData = publicFeedResult.data;
      }
    }

    // Prefetch folder contents for the sidebar (avoids loading flash on mount).
    // When in a subfolder, fetch BOTH root-level (subFolderId: null) AND the
    // subfolder's contents in parallel - root seeds the top-level EndpointsPage,
    // subfolder seeds the expanded FolderRow's child EndpointsPage.
    const folderContentsPromises: [
      ReturnType<typeof FolderContentsRepository.getFolderContents>,
      ReturnType<typeof FolderContentsRepository.getFolderContents> | null,
    ] = [
      FolderContentsRepository.getFolderContents(
        { rootFolderId: initialRootFolderId },
        { subFolderId: undefined }, // always fetch root level
        user,
        folderContentsT,
        logger,
        locale,
      ),
      initialSubFolderId
        ? FolderContentsRepository.getFolderContents(
            { rootFolderId: initialRootFolderId },
            { subFolderId: initialSubFolderId },
            user,
            folderContentsT,
            logger,
            locale,
          )
        : null,
    ];
    const [rootContentsResult, subFolderContentsResult] = await Promise.all(
      folderContentsPromises,
    );
    if (rootContentsResult.success) {
      initialFolderContentsData = rootContentsResult.data;
    }
    if (subFolderContentsResult && subFolderContentsResult.success) {
      initialSubFolderContentsData = subFolderContentsResult.data;
    }
  }

  // For incognito routes, settings and skill are not fetched above (localStorage-only).
  // But we still need the default skill data so SSR and client render the same
  // Selector button structure - otherwise React hydration fails and causes a blank flash.
  if (initialSkillData === null && user) {
    const defaultSkillResult = await SkillsRepository.getSkillById(
      { id: "thea" },
      user,
      logger,
      locale,
    );
    if (defaultSkillResult.success) {
      initialSkillData = defaultSkillResult.data;
    }
  }

  return {
    locale,
    user,
    creditsToUse,
    initialRootFolderId,
    initialSubFolderId,
    initialThreadId,
    rootFolderPermissions,
    envAvailability: agentEnvAvailability,
    leafMessageId,
    initialFoldersData,
    initialThreadsData,
    initialMessagesData,
    initialPathData,
    initialSettingsData,
    initialSkillData,
    initialPublicFeedData,
    initialFolderContentsData,
    initialSubFolderContentsData,
  };
}

export function TanstackPage({
  locale,
  user,
  creditsToUse,
  initialRootFolderId,
  initialSubFolderId,
  initialThreadId,
  rootFolderPermissions,
  envAvailability,
  leafMessageId,
  initialFoldersData,
  initialThreadsData,
  initialMessagesData,
  initialPathData,
  initialSettingsData,
  initialSkillData,
  initialPublicFeedData,
  initialFolderContentsData,
  initialSubFolderContentsData,
}: ThreadsPathPageData): JSX.Element {
  const { t: userT } = userScopedTranslation.scopedT(locale);

  if (!user) {
    return <Div>{userT("auth.errors.unknownError")}</Div>;
  }

  return (
    <>
      <EnvAvailabilitySetter env={envAvailability} />
      <ChatNavigationProvider
        activeThreadId={initialThreadId}
        currentRootFolderId={initialRootFolderId}
        currentSubFolderId={initialSubFolderId}
        leafMessageId={initialPathData?.resolvedLeafMessageId ?? leafMessageId}
      >
        <ChatBootProvider
          activeThreadId={initialThreadId}
          currentRootFolderId={initialRootFolderId}
          currentSubFolderId={initialSubFolderId}
          initialCredits={creditsToUse}
          rootFolderPermissions={rootFolderPermissions}
          initialFoldersData={initialFoldersData}
          initialThreadsData={initialThreadsData}
          initialMessagesData={initialMessagesData}
          initialPathData={initialPathData}
          initialSettingsData={initialSettingsData}
          initialSkillData={initialSkillData}
          initialPublicFeedData={initialPublicFeedData}
          initialFolderContentsData={initialFolderContentsData}
          initialSubFolderContentsData={initialSubFolderContentsData}
          initialSubFolderId={initialSubFolderId}
        >
          <ChatInterface user={user} />
        </ChatBootProvider>
      </ChatNavigationProvider>
    </>
  );
}

export default async function ThreadsPathPage({
  params,
  searchParams,
}: ThreadsPathPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params, searchParams });
  return <TanstackPage {...data} />;
}
