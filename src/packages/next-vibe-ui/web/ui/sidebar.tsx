"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { ResizableContainer } from "next-vibe-ui/ui/resizable";
import type { JSX, ReactNode } from "react";
import React from "react";

import { platform } from "@/config/env-client";

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
  /** localStorage key for persisting sidebar width. Defaults to "sidebar-layout" */
  storageId?: string;
  /** Default sidebar width in pixels. Defaults to 260 */
  defaultWidth?: number;
  /** Minimum sidebar width in pixels. Defaults to 235 */
  minWidth?: number;
  /** Whether the content area scrolls. Set false when child manages its own scroll. Defaults to true */
  scrollable?: boolean;
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
  storageId = "sidebar-layout",
  defaultWidth = 260,
  minWidth = SIDEBAR_MIN_WIDTH_PX,
  scrollable = true,
}: SidebarLayoutProps): JSX.Element {
  const [isMobile, setIsMobile] = React.useState(platform.isReactNative);

  React.useEffect(() => {
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

  if (isMobile) {
    return (
      <Div className={cn("h-screen h-max-screen w-full relative", className)}>
        {topBarLeft && (
          <Div className="absolute top-4 left-4 z-51 flex flex-row gap-1">
            {topBarLeft}
          </Div>
        )}
        {topBarRight && (
          <Div className="absolute top-4 right-4 z-51 flex flex-row gap-1">
            {topBarRight}
          </Div>
        )}

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

        <Div className={cn("flex-1 min-w-0 min-h-0 w-full h-full")}>
          {scrollable ? (
            <ScrollArea className="h-full w-full">
              <Div className={cn("min-h-full", contentClassName)}>
                {children}
              </Div>
            </ScrollArea>
          ) : (
            <Div className={cn("h-full w-full", contentClassName)}>
              {children}
            </Div>
          )}
        </Div>
      </Div>
    );
  }

  return (
    <Div className={cn("flex flex-row h-full w-full", className)}>
      <ResizableContainer
        defaultWidth={defaultWidth}
        minWidth={minWidth}
        maxWidth={`${SIDEBAR_MAX_WIDTH_VW}vw`}
        storageId={storageId}
        className="bg-background z-10"
        collapsed={collapsed}
      >
        <Div
          className={cn(
            "flex flex-col h-full w-full bg-background",
            sidebarClassName,
          )}
        >
          {topBarLeft && (
            <Div className="shrink-0 flex flex-row gap-1 p-2 border-b border-border">
              {topBarLeft}
            </Div>
          )}
          {sidebar}
        </Div>
      </ResizableContainer>

      <Div className={cn("flex flex-1 min-w-0 h-full relative z-9")}>
        {scrollable ? (
          <ScrollArea className="h-full w-full">
            <Div className={cn("min-h-full", contentClassName)}>{children}</Div>
          </ScrollArea>
        ) : (
          <Div className={cn("h-full w-full", contentClassName)}>
            {children}
          </Div>
        )}
      </Div>
    </Div>
  );
}
