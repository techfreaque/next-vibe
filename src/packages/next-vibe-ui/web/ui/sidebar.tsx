"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { AnimatePresence, MotionDiv } from "next-vibe-ui/ui/motion";
import { ResizableContainer } from "next-vibe-ui/ui/resizable";
import type { JSX, ReactNode } from "react";
import React from "react";

import { envClient } from "@/config/env-client";
import { ScrollArea } from "./scroll-area";

const SIDEBAR_WIDTH = "w-65";
const SIDEBAR_MIN_WIDTH_PX = 235;
const SIDEBAR_MAX_WIDTH_VW = 90;

export interface SidebarLayoutProps {
  sidebar?: ReactNode;
  children?: ReactNode;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  closeSidebarLabel?: string;
  className?: string;
  sidebarClassName?: string;
  contentClassName?: string;
  topBarLeft?: ReactNode;
  topBarRight?: ReactNode;
}

export function SidebarLayout({
  sidebar,
  children,
  collapsed = false,
  onCollapsedChange,
  closeSidebarLabel = "Close sidebar",
  className,
  sidebarClassName,
  contentClassName,
  topBarLeft,
  topBarRight,
}: SidebarLayoutProps): JSX.Element {
  const [isMobile, setIsMobile] = React.useState(
    envClient.platform.isReactNative,
  );

  React.useEffect(() => {
    if (envClient.platform.isReactNative) {
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

  if (isMobile) {
    return (
      <Div className={cn("h-screen h-max-screen w-full", className)}>
        <TopBar topBarLeft={topBarLeft} topBarRight={topBarRight} />

        <Div
          suppressHydrationWarning
          className={cn(
            "fixed inset-y-0 left-0 z-50 bg-background border-r border-border transition-transform duration-200 ease-in-out",
            SIDEBAR_WIDTH,
            collapsed ? "-translate-x-full" : "translate-x-0",
          )}
        >
          <Div className={cn("h-full w-full bg-background", sidebarClassName)}>
            {sidebar}
          </Div>
        </Div>

        {!collapsed && (
          <Div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => onCollapsedChange?.(!collapsed)}
            aria-label={closeSidebarLabel}
          />
        )}

        <Div className={cn("h-screen h-max-screen w-full", contentClassName)}>
          <ScrollArea className="h-screen w-full">{children}</ScrollArea>
        </Div>
      </Div>
    );
  }

  return (
    <Div className={cn("flex flex-row h-full w-full", className)}>
      <TopBar topBarLeft={topBarLeft} topBarRight={topBarRight} />
      <ResizableContainer
        defaultWidth={260}
        minWidth={SIDEBAR_MIN_WIDTH_PX}
        maxWidth={`${SIDEBAR_MAX_WIDTH_VW}vw`}
        storageId="sidebar-layout"
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
              <Div
                className={cn("h-full w-full bg-background", sidebarClassName)}
              >
                {sidebar}
              </Div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </ResizableContainer>

      <Div
        className={cn("flex h-screen w-full relative z-9", contentClassName)}
      >
        <ScrollArea className="h-screen w-full">{children}</ScrollArea>
      </Div>
    </Div>
  );
}

export interface TopBarProps {
  topBarLeft?: ReactNode;
  topBarRight?: ReactNode;
}

function TopBar({ topBarLeft, topBarRight }: TopBarProps): JSX.Element {
  return (
    <>
      {/* Top bar left */}
      {topBarLeft && (
        <Div className="fixed top-4 left-4 z-51 flex flex-row gap-1">
          {topBarLeft}
        </Div>
      )}

      {/* Top bar right */}
      {topBarRight && (
        <Div className="fixed top-4 right-4 z-51 flex flex-row gap-1">
          {topBarRight}
        </Div>
      )}
    </>
  );
}
