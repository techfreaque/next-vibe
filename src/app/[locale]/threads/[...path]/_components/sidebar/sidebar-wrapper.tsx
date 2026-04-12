"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { AnimatePresence, MotionDiv } from "next-vibe-ui/ui/motion";
import { ResizableContainer } from "next-vibe-ui/ui/resizable";
import type { JSX, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import foldersDefinition from "@/app/api/[locale]/agent/chat/folders/[rootFolderId]/definition";
import { useChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import { scopedTranslation } from "@/app/api/[locale]/agent/chat/threads/widget/i18n";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { platform } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

import { SidebarFooter } from "./footer/sidebar-footer";
import { useSidebarCollapsed } from "./use-sidebar-collapsed";

const SIDEBAR_WIDTH = "w-65";
const SIDEBAR_MIN_WIDTH_PX = 245;
const SIDEBAR_MAX_WIDTH_VW = 90;

interface SidebarWrapperProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
  children?: ReactNode;
}

function WidgetSidebar({
  locale,
  user,
  logger,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
}): JSX.Element {
  const { initialFoldersData, initialRootFolderId } = useChatBootContext();

  const currentRootFolderId = useChatNavigationStore(
    (s) => s.currentRootFolderId,
  );

  // Only pass server-prefetched data for the initial root folder.
  // Tab switches → key changes → fresh fetch via endpointOptions without initialData.
  const foldersInitialData =
    currentRootFolderId === initialRootFolderId ? initialFoldersData : null;

  const foldersEndpointOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { rootFolderId: currentRootFolderId },
        queryOptions: {
          refetchOnWindowFocus: false,
          staleTime: 30 * 1000,
        },
        initialData: foldersInitialData ?? undefined,
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
      <SidebarFooter locale={locale} user={user} logger={logger} />
    </Div>
  );
}

export function SidebarWrapper({
  locale,
  user,
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

    checkMobile();

    window.addEventListener("resize", checkMobile);
    return (): void => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Mobile: use overlay (NO RESIZE - fixed width)
  if (isMobile) {
    return (
      <Div className="flex flex-row h-screen h-max-screen w-full">
        <AnimatePresence>
          {!collapsed && (
            <MotionDiv
              key="mobile-sidebar"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "fixed inset-y-0 left-0 z-[210] bg-background border-r border-border",
                SIDEBAR_WIDTH,
              )}
            >
              <Div className="h-full w-full bg-background">
                <WidgetSidebar locale={locale} user={user} logger={logger} />
              </Div>
            </MotionDiv>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!collapsed && (
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

        <Div className="h-screen h-max-screen w-full">{children}</Div>
      </Div>
    );
  }

  // Desktop: Resizable sidebar
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
              <WidgetSidebar locale={locale} user={user} logger={logger} />
            </MotionDiv>
          )}
        </AnimatePresence>
      </ResizableContainer>

      <Div className="flex h-screen w-full relative z-9">{children}</Div>
    </Div>
  );
}
