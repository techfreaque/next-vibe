"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { AnimatePresence, MotionDiv } from "next-vibe-ui/ui/motion";
import { ResizableContainer } from "next-vibe-ui/ui/resizable";
import type { JSX } from "react";
import React from "react";

import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { ChatSidebar } from "@/app/api/[locale]/agent/chat/threads/_components/sidebar";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { platform } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

const SIDEBAR_WIDTH = "w-65";
const SIDEBAR_MIN_WIDTH_PX = 235; // Minimum 235px
const SIDEBAR_MAX_WIDTH_VW = 90; // Maximum 90vw

interface SidebarWrapperProps {
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType | undefined;
  children?: React.ReactNode;
}

export function SidebarWrapper({
  locale,
  logger,
  user,
  children,
}: SidebarWrapperProps): JSX.Element {
  const { sidebarCollapsed: collapsed, setSidebarCollapsed } = useChatContext();
  const { t } = simpleT(locale);

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
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
              <ChatSidebar user={user} locale={locale} logger={logger} />
            </Div>
          </Div>
        )}

        {/* Mobile Overlay Backdrop */}
        {!collapsed && (
          <Div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarCollapsed(!collapsed)}
            aria-label={t("app.chat.common.closeSidebar")}
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
              <ChatSidebar user={user} locale={locale} logger={logger} />
            </MotionDiv>
          )}
        </AnimatePresence>
      </ResizableContainer>

      {/* Main Content Panel - Chat Area (flexes to fill remaining space) */}
      <Div className="flex h-screen w-full relative z-9">{children}</Div>
    </Div>
  );
}
