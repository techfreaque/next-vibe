"use client";

/**
 * Lightweight mock ChatBootProvider for landing page chat demo.
 * Provides a mock ChatBootValue so the real chat components
 * can render without the full chat infrastructure.
 */

import type { JSX, ReactNode } from "react";
import { useRef, useMemo } from "react";
import { create } from "zustand";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatBootValue } from "@/app/api/[locale]/agent/chat/hooks/context";
import { ChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { ChatNavigationProvider } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import { NavigationStackProvider } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-navigation-stack";
import type { UseNavigationStackReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-navigation-stack";
import { EnvAvailabilitySetter } from "@/app/api/[locale]/agent/env-availability-context";
import type { AgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { WidgetContextStoreContext } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { WidgetContextStoreType } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/widget-context-store";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { ReactWidgetContext } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";

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
  claudeCode: false,
  openAiImages: false,
  replicate: false,
  falAi: false,
  modelsLab: false,
  unbottled: false,
};

const MOCK_CREDITS: ChatBootValue["initialCredits"] = {
  total: 0,
  expiring: 0,
  permanent: 0,
  earned: 0,
  free: 0,
  expiresAt: null,
};

const MOCK_NAVIGATION: UseNavigationStackReturn = {
  push: (): void => {
    /* no-op for demo */
  },
  pop: (): void => {
    /* no-op for demo */
  },
  replace: (): void => {
    /* no-op for demo */
  },
  stack: [],
  canGoBack: false,
  current: null,
};

const MOCK_WIDGET_STORE = create()(() => ({
  context: { navigation: MOCK_NAVIGATION },
  setContext: (): void => {
    /* no-op */
  },
})) as WidgetContextStoreType<
  CreateApiEndpointAny,
  ReactWidgetContext<CreateApiEndpointAny>
>;

export function MockChatProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const widgetStoreRef = useRef(MOCK_WIDGET_STORE);

  const mockValue = useMemo(
    (): ChatBootValue => ({
      initialCredits: MOCK_CREDITS,
      rootFolderPermissions: { canCreateThread: false, canCreateFolder: false },
      initialFoldersData: null,
      initialThreadsData: null,
      initialRootFolderId: DefaultFolderId.PRIVATE,
      initialMessagesData: null,
      initialPathData: null,
      initialSettingsData: null,
      initialSkillData: null,
      initialPublicFeedData: null,
      initialThreadId: null,
      initialFolderContentsData: null,
      initialSubFolderContentsData: null,
      initialSubFolderId: null,
    }),
    [],
  );

  return (
    <WidgetContextStoreContext.Provider value={widgetStoreRef.current}>
      <EnvAvailabilitySetter env={MOCK_ENV} />
      <ChatBootContext.Provider value={mockValue}>
        <NavigationStackProvider>
          <ChatNavigationProvider
            activeThreadId={null}
            currentRootFolderId={DefaultFolderId.PRIVATE}
            currentSubFolderId={null}
            leafMessageId={null}
            isEmbedded={false}
          >
            {children}
          </ChatNavigationProvider>
        </NavigationStackProvider>
      </ChatBootContext.Provider>
    </WidgetContextStoreContext.Provider>
  );
}
