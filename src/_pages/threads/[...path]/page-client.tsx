"use client";

import aiStreamDefinition from "next-vibe/agent/ai-stream/stream/definition";
import { ChatBootProvider } from "next-vibe/agent/chat/hooks/context";
import { ChatNavigationProvider } from "next-vibe/agent/chat/hooks/use-chat-navigation-store";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
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
