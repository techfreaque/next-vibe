"use client";

import aiStreamDefinition from "next-vibe/agent/ai-stream/stream/definition";
import { useQueryPrefill } from "next-vibe/agent/ai-stream/stream/hooks/use-query-prefill";
import { ChatBootProvider } from "next-vibe/agent/chat/hooks/context";
import { ChatNavigationProvider } from "next-vibe/agent/chat/hooks/use-chat-navigation-store";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import type { ThreadsPathPageData } from "./page";

export function ThreadsPageClient({
  locale,
  user,
  platform,
  creditsToUse,
  initialRootFolderId,
  initialSubFolderId,
  initialThreadId,
  rootFolderPermissions,
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
}: ThreadsPathPageData & { user: JwtPayloadType }): JSX.Element {
  const logger = useLogger();
  // ?q=<text>&model=<id> pre-fill the composer / pick the model once
  // (model pages, shared prompt links)
  useQueryPrefill({
    activeThreadId: initialThreadId,
    rootFolderId: initialRootFolderId,
    subFolderId: initialSubFolderId,
    user,
    locale,
    initialSettings: initialSettingsData,
  });

  return (
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
        <EndpointsPage
          logger={logger}
          endpoint={aiStreamDefinition}
          locale={locale}
          user={user}
          platform={platform}
          className="flex flex-col h-dvh w-full"
        />
      </ChatBootProvider>
    </ChatNavigationProvider>
  );
}
