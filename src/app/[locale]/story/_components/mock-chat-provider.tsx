"use client";

/**
 * Lightweight mock ChatBootProvider for landing page chat demo.
 * Provides a mock ChatBootValue so the real chat components
 * can render without the full chat infrastructure.
 */

import type { JSX, ReactNode } from "react";
import { useMemo } from "react";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatBootValue } from "@/app/api/[locale]/agent/chat/hooks/context";
import { ChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { ChatNavigationProvider } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import type { AgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";

const MOCK_ENV: AgentEnvAvailability = {
  openRouter: false,
  voice: false,
  braveSearch: false,
  kagiSearch: false,
  anySearch: false,
  uncensoredAI: false,
  freedomGPT: false,
  gabAI: false,
  veniceAI: false,
  scrappey: false,
};

const MOCK_CREDITS: ChatBootValue["initialCredits"] = {
  total: 0,
  expiring: 0,
  permanent: 0,
  earned: 0,
  free: 0,
  expiresAt: null,
};

export function MockChatProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const mockValue = useMemo(
    (): ChatBootValue => ({
      initialCredits: MOCK_CREDITS,
      envAvailability: MOCK_ENV,
      rootFolderPermissions: { canCreateThread: false, canCreateFolder: false },
      initialFoldersData: null,
      initialThreadsData: null,
      initialRootFolderId: DefaultFolderId.PRIVATE,
      initialMessagesData: null,
      initialPathData: null,
      initialSettingsData: null,
      initialCharacterData: null,
      initialPublicFeedData: null,
      initialThreadId: null,
      initialFolderContentsData: null,
      initialSubFolderContentsData: null,
      initialSubFolderId: null,
    }),
    [],
  );

  return (
    <ChatBootContext.Provider value={mockValue}>
      <ChatNavigationProvider
        activeThreadId={null}
        currentRootFolderId={DefaultFolderId.PRIVATE}
        currentSubFolderId={null}
        leafMessageId={null}
        isEmbedded={false}
      >
        {children}
      </ChatNavigationProvider>
    </ChatBootContext.Provider>
  );
}
