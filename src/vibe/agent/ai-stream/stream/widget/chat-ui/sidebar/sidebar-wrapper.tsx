"use client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { AnimatePresence, MotionDiv } from "next-vibe/ui/components/motion";
import { ResizableContainer } from "next-vibe/ui/components/resizable";
import { useWindowSize } from "next-vibe/ui/hooks/use-window-size";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX, ReactNode } from "react";
import { useMemo } from "react";

import foldersDefinition from "../../../../../chat/folders/[rootFolderId]/definition";
import {
  useBootSeed,
  useChatBootContext,
} from "../../../../../chat/hooks/context";
import { useChatNavigationStore } from "../../../../../chat/hooks/use-chat-navigation-store";
import { scopedTranslation } from "../../../../../chat/threads/widget/i18n";
import { SidebarContent } from "./spaces/sidebar-content";
import {
  useSidebarCollapsed,
  useSidebarInitialized,
} from "./use-sidebar-collapsed";

const SIDEBAR_MIN_WIDTH_PX = 320;
const SIDEBAR_MAX_WIDTH_VW = 90;
const MOBILE_SIDEBAR_SLIDE_PX = 360;

interface SidebarWrapperProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
  platform: Platform;
  children?: ReactNode;
}

function WidgetSidebar({
  locale,
  user,
  logger,
  platform,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
  platform: Platform;
}): JSX.Element {
  const { initialFoldersData, initialRootFolderId } = useChatBootContext();

  const currentRootFolderId = useChatNavigationStore(
    (s) => s.currentRootFolderId,
  );

  // Only pass server-prefetched data for the initial root folder.
  // Tab switches → key changes → fresh fetch via endpointOptions without initialData.
  // and only once per page load: a remount after the cache was collected
  // fetches fresh instead of reviving the page-load snapshot.
  const foldersInitialData = useBootSeed(
    currentRootFolderId === initialRootFolderId ? initialFoldersData : null,
  );

  const foldersEndpointOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { rootFolderId: currentRootFolderId },
        subscribeToEvents: true,
        queryOptions: {
          refetchOnWindowFocus: false,
          staleTime: 30 * 1000,
        },
        initialData: foldersInitialData,
      },
    }),
    [currentRootFolderId, foldersInitialData],
  );

  return (
    <SidebarContent locale={locale} user={user} logger={logger}>
      <EndpointsPage
        logger={logger}
        key={currentRootFolderId}
        endpoint={foldersDefinition}
        locale={locale}
        user={user}
        platform={platform}
        forceMethod="GET"
        className="flex-1 h-full overflow-hidden"
        endpointOptions={foldersEndpointOptions}
      />
    </SidebarContent>
  );
}

export function SidebarWrapper({
  locale,
  user,
  logger,
  platform,
  children,
}: SidebarWrapperProps): JSX.Element {
  const [collapsed, setSidebarCollapsed] = useSidebarCollapsed();
  const sidebarReady = useSidebarInitialized();
  const { t } = scopedTranslation.scopedT(locale);

  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 930;

  // Mobile: use overlay (NO RESIZE - fixed width)
  if (isMobile) {
    return (
      <Div className="flex flex-row flex-1 min-h-0 w-full">
        <AnimatePresence initial={false}>
          {sidebarReady && !collapsed && (
            <MotionDiv
              key="mobile-sidebar"
              initial={{ x: -MOBILE_SIDEBAR_SLIDE_PX }}
              animate={{ x: 0 }}
              exit={{ x: -MOBILE_SIDEBAR_SLIDE_PX }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-[210] w-[min(calc(100vw-2.5rem),360px)] border-r border-border bg-background"
            >
              <Div className="h-full w-full bg-background">
                <WidgetSidebar
                  locale={locale}
                  user={user}
                  logger={logger}
                  platform={platform}
                />
              </Div>
            </MotionDiv>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {sidebarReady && !collapsed && (
            <MotionDiv
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/50 z-[200]"
              onClick={() => setSidebarCollapsed(!collapsed)}
              aria-label={t("common.close")}
            />
          )}
        </AnimatePresence>

        <Div className="flex flex-col flex-1 min-h-0 w-full">{children}</Div>
      </Div>
    );
  }

  // Desktop: Resizable sidebar
  return (
    <Div className="flex flex-row flex-1 min-h-0 w-full">
      <ResizableContainer
        defaultWidth={344}
        minWidth={SIDEBAR_MIN_WIDTH_PX}
        maxWidth={`${SIDEBAR_MAX_WIDTH_VW}vw`}
        storageId="chat-spaces-v4-D"
        className="bg-background z-10"
        collapsed={collapsed}
      >
        <AnimatePresence initial={false} mode="sync">
          {!collapsed && (
            <MotionDiv
              key="sidebar"
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full"
            >
              <WidgetSidebar
                locale={locale}
                user={user}
                logger={logger}
                platform={platform}
              />
            </MotionDiv>
          )}
        </AnimatePresence>
      </ResizableContainer>

      <Div className="flex flex-col flex-1 min-h-0 min-w-0 relative z-9">
        {children}
      </Div>
    </Div>
  );
}
