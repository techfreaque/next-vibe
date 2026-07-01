"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { EndpointsPage } from "next-vibe/ui/renderers/react/EndpointsPage";
import type { JSX } from "react";

import aiStreamDefinition from "@/app/api/[locale]/agent/ai-stream/stream/definition";
import { ChatBootProvider } from "@/app/api/[locale]/agent/chat/hooks/context";
import { ChatNavigationProvider } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";

import type { ThreadsPathPageData } from "./page";

export function ThreadsPageClient({
  locale,
  user,
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
          className="flex flex-col h-dvh w-full"
        />
      </ChatBootProvider>
    </ChatNavigationProvider>
  );
}
