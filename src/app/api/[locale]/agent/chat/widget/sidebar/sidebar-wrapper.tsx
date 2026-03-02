"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { AnimatePresence, MotionDiv } from "next-vibe-ui/ui/motion";
import { ResizableContainer } from "next-vibe-ui/ui/resizable";
import type { JSX, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import foldersDefinition from "@/app/api/[locale]/agent/chat/folders/definition";
import { useChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useChatStore } from "@/app/api/[locale]/agent/chat/hooks/store";
import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import { useDataLoader } from "@/app/api/[locale]/agent/chat/hooks/use-data-loader";
import { useSidebarCollapsed } from "@/app/api/[locale]/agent/chat/hooks/use-sidebar-collapsed";
import { scopedTranslation } from "@/app/api/[locale]/agent/chat/i18n";
import { SidebarFooter } from "@/app/api/[locale]/agent/chat/widget/sidebar/footer/sidebar-footer";
import { useCredits } from "@/app/api/[locale]/credits/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import { platform } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

const SIDEBAR_WIDTH = "w-65";
const SIDEBAR_MIN_WIDTH_PX = 245; // Minimum 235px
const SIDEBAR_MAX_WIDTH_VW = 90; // Maximum 90vw

interface SidebarWrapperProps {
  locale: CountryLanguage;
  logger: EndpointLogger;
  children?: ReactNode;
}

/**
 * New widget-based sidebar — no useChatContext inside the sidebar itself.
 * Footer is owned here so it stays outside the scrollable widget area.
 */
function WidgetSidebar({
  locale,
  logger,
}: {
  locale: CountryLanguage;
  logger: EndpointLogger;
}): JSX.Element {
  const {
    user,
    logger: bootLogger,
    locale: bootLocale,
    initialCredits,
    initialFoldersData,
    initialThreadsData,
    initialRootFolderId,
  } = useChatBootContext();
  const creditsEndpoint = useCredits(user, logger, initialCredits);
  const credits = creditsEndpoint?.read?.response?.success
    ? creditsEndpoint.read.response.data
    : initialCredits;

  // Read root folder from navigation store (reactive — updates when tab is switched)
  const currentRootFolderId = useChatNavigationStore(
    (s) => s.currentRootFolderId,
  );

  // Data loading — threads/folders into Zustand store
  const addThread = useChatStore((s) => s.addThread);
  const addMessage = useChatStore((s) => s.addMessage);
  const addFolder = useChatStore((s) => s.addFolder);
  const setDataLoaded = useChatStore((s) => s.setDataLoaded);

  const ssrInitialDataRef = useRef({
    rootFolderId: initialRootFolderId,
    threadsData: initialThreadsData,
    foldersData: initialFoldersData,
  });

  useDataLoader(
    bootLocale,
    bootLogger,
    currentRootFolderId,
    addThread,
    addMessage,
    addFolder,
    setDataLoaded,
    user,
    ssrInitialDataRef.current,
  );

  // Only use server-prefetched data for the initial root folder.
  // When user switches tabs, key changes → component remounts → no initialData (fresh fetch).
  const foldersInitialData =
    currentRootFolderId === initialRootFolderId ? initialFoldersData : null;

  const foldersEndpointOptions = useMemo(
    () => ({
      read: {
        initialState: {
          rootFolderId: currentRootFolderId,
        },
        queryOptions: {
          refetchOnWindowFocus: false,
          staleTime: 30 * 1000,
        },
        ...(foldersInitialData ? { initialData: foldersInitialData } : {}),
      },
    }),
    [currentRootFolderId, foldersInitialData],
  );

  return (
    <Div className="flex flex-col h-full bg-background overflow-hidden">
      <EndpointsPage
        key={currentRootFolderId}
        endpoint={foldersDefinition}
        locale={locale}
        user={user}
        forceMethod="GET"
        className="flex-1 h-full overflow-hidden"
        endpointOptions={foldersEndpointOptions}
      />
      <SidebarFooter
        locale={locale}
        credits={credits}
        user={user}
        logger={logger}
      />
    </Div>
  );
}

export function SidebarWrapper({
  locale,
  logger,
  children,
}: SidebarWrapperProps): JSX.Element {
  const [collapsed, setSidebarCollapsed] = useSidebarCollapsed();
  const { t } = scopedTranslation.scopedT(locale);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (platform.isReactNative) {
      setIsMobile(true);
      return;
    }
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 930);
    };

    // Check on mount
    checkMobile();

    // Check on resize
    window.addEventListener("resize", checkMobile);
    return (): void => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Mobile: use overlay (NO RESIZE - fixed width)
  if (isMobile) {
    return (
      <Div className="flex flex-row h-screen h-max-screen w-full">
        {/* Mobile Sidebar Container - Fixed Overlay (NO RESIZE) */}
        {!collapsed && (
          <Div
            suppressHydrationWarning
            className={cn(
              "fixed inset-y-0 left-0 z-50 bg-background border-r border-border",
              SIDEBAR_WIDTH,
            )}
          >
            <Div className="h-full w-full bg-background">
              <WidgetSidebar locale={locale} logger={logger} />
            </Div>
          </Div>
        )}

        {/* Mobile Overlay Backdrop */}
        {!collapsed && (
          <Div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarCollapsed(!collapsed)}
            aria-label={t("common.close")}
          />
        )}

        {/* Chat Area for Mobile */}
        <Div className="h-screen h-max-screen w-full">{children}</Div>
      </Div>
    );
  }

  // Desktop: Resizable sidebar with custom ResizableContainer
  return (
    <Div className="flex flex-row h-full w-full">
      <ResizableContainer
        defaultWidth={260}
        minWidth={SIDEBAR_MIN_WIDTH_PX}
        maxWidth={`${SIDEBAR_MAX_WIDTH_VW}vw`}
        storageId="chat-sidebar"
        className="bg-background z-10"
        collapsed={collapsed}
      >
        <AnimatePresence mode="sync">
          {!collapsed && (
            <MotionDiv
              key="sidebar"
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full"
            >
              <WidgetSidebar locale={locale} logger={logger} />
            </MotionDiv>
          )}
        </AnimatePresence>
      </ResizableContainer>

      {/* Main Content Panel - Chat Area (flexes to fill remaining space) */}
      <Div className="flex h-screen w-full relative z-9">{children}</Div>
    </Div>
  );
}
