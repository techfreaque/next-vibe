"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { AnimatePresence, MotionDiv } from "next-vibe-ui/ui/motion";
import { ResizableContainer } from "next-vibe-ui/ui/resizable";
import type { JSX } from "react";
import React from "react";

import { isDefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
import type { UseChatReturn } from "@/app/api/[locale]/v1/core/agent/chat/hooks/hooks";
import type { FolderUpdate } from "@/app/api/[locale]/v1/core/agent/chat/folders/hooks/use-operations";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { ChatFolder, ChatThread, DefaultFolderId } from "../../types";
import { ChatSidebar } from "../sidebar/chat-sidebar";
import { envClient } from "@/config/env-client";

const SIDEBAR_WIDTH = "w-65";
const SIDEBAR_MIN_WIDTH_PX = 235; // Minimum 235px
const SIDEBAR_MAX_WIDTH_VW = 90; // Maximum 90vw

interface SidebarWrapperProps {
  threads: Record<string, ChatThread>;
  folders: Record<string, ChatFolder>;
  activeThreadId: string | null;
  activeRootFolderId: DefaultFolderId;
  activeSubFolderId: string | null;
  collapsed: boolean;
  locale: CountryLanguage;
  logger: EndpointLogger;
  onToggle: () => void;
  onCreateThread: (folderId?: string | null) => void;
  onSelectThread: (threadId: string) => void;
  onDeleteThread: (threadId: string) => Promise<void>;
  onUpdateFolder: (folderId: string, updates: FolderUpdate) => Promise<void>;
  onDeleteFolder: (folderId: string) => Promise<void>;
  onUpdateThreadTitle: (threadId: string, title: string) => void;
  currentRootFolderId: string;
  currentSubFolderId: string | null;
  chat: UseChatReturn;
  user: JwtPayloadType | undefined;
  children?: React.ReactNode;
}

export function SidebarWrapper({
  activeThreadId,
  activeSubFolderId,
  collapsed,
  locale,
  logger,
  onToggle,
  onCreateThread,
  onSelectThread,
  onDeleteThread,
  onUpdateFolder,
  onUpdateThreadTitle,
  chat,
  user,
  children,
}: SidebarWrapperProps): JSX.Element {
  const { t } = simpleT(locale);

  // Detect if we're on mobile (window width < 768px)
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (envClient.platform.isReactNative) {
      setIsMobile(true);
      return;
    }
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkMobile();

    // Check on resize
    window.addEventListener("resize", checkMobile);
    return (): void => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Wrap handlers to auto-collapse sidebar on mobile
  const handleCreateThread = React.useCallback(
    (folderId?: string | null) => {
      onCreateThread(folderId);
      // Auto-collapse sidebar on mobile after creating thread
      if (isMobile && !collapsed) {
        onToggle();
      }
    },
    [onCreateThread, isMobile, collapsed, onToggle],
  );

  const handleSelectThread = React.useCallback(
    (threadId: string) => {
      onSelectThread(threadId);
      // Auto-collapse sidebar on mobile after selecting thread
      if (isMobile && !collapsed) {
        onToggle();
      }
    },
    [onSelectThread, isMobile, collapsed, onToggle],
  );

  // Wrap createFolder to match expected signature
  const handleCreateFolder = React.useCallback(
    (name: string, parentId: string, icon?: string): string => {
      // Determine rootFolderId from parentId
      const isRootFolder = isDefaultFolderId(parentId);

      const rootFolderId = isRootFolder
        ? parentId
        : chat.folders[parentId]?.rootFolderId || "private";

      const actualParentId = isRootFolder ? null : parentId;

      // Call async function but return empty string immediately
      void chat.createFolder(name, rootFolderId, actualParentId, icon);
      return "";
    },
    [chat],
  );

  // Handle moving thread to a different folder
  const handleMoveThread = React.useCallback(
    (threadId: string, folderId: string | null) => {
      logger.debug("SidebarWrapper", "Moving thread to folder", {
        threadId,
        folderId,
      });
      void chat.updateThread(threadId, { folderId });
    },
    [chat, logger],
  );

  // Handle pinning/unpinning thread
  const handlePinThread = React.useCallback(
    (threadId: string, pinned: boolean) => {
      logger.debug("SidebarWrapper", "Toggling thread pin", {
        threadId,
        pinned,
      });
      void chat.updateThread(threadId, { pinned });
    },
    [chat, logger],
  );

  const handleArchiveThread = React.useCallback(
    (threadId: string, archived: boolean) => {
      logger.debug("SidebarWrapper", "Toggling thread archive", {
        threadId,
        archived,
      });
      void chat.updateThread(threadId, { archived });
    },
    [chat, logger],
  );

  // Handle moving folder to a different parent
  const handleMoveFolderToParent = React.useCallback(
    (folderId: string, newParentId: string | null) => {
      logger.debug("SidebarWrapper", "Moving folder to parent", {
        folderId,
        newParentId,
      });
      void onUpdateFolder(folderId, { parentId: newParentId });
    },
    [onUpdateFolder, logger],
  );

  // Handle reordering folders (move up/down)
  const handleReorderFolder = React.useCallback(
    (folderId: string, direction: "up" | "down") => {
      logger.debug("SidebarWrapper", "Reorder folder", {
        folderId,
        direction,
      });

      const folder = chat.folders[folderId];
      if (!folder) {
        logger.error("Folder not found for reordering", { folderId });
        return;
      }

      // Get all sibling folders (same parent and rootFolderId), including current folder
      const allSiblings = Object.values(chat.folders)
        .filter(
          (f) =>
            f.rootFolderId === folder.rootFolderId &&
            f.parentId === folder.parentId,
        )
        .toSorted((a, b) => {
          // First sort by sortOrder
          if (a.sortOrder !== b.sortOrder) {
            return a.sortOrder - b.sortOrder;
          }
          // If sortOrder is the same, use createdAt as tiebreaker for stable ordering
          return a.createdAt.getTime() - b.createdAt.getTime();
        });

      // Find current folder's index in the sorted list
      const currentIndex = allSiblings.findIndex((f) => f.id === folderId);

      if (currentIndex === -1) {
        logger.error("Folder not found in siblings list", { folderId });
        return;
      }

      if (direction === "up" && currentIndex > 0) {
        // Move folder up by swapping positions with previous sibling
        const prevSibling = allSiblings[currentIndex - 1];
        if (prevSibling) {
          // Reassign sortOrder values to ensure they are different
          // Give the current folder the previous sibling's position
          void onUpdateFolder(folderId, { sortOrder: currentIndex - 1 });
          void onUpdateFolder(prevSibling.id, { sortOrder: currentIndex });
        }
      } else if (
        direction === "down" &&
        currentIndex < allSiblings.length - 1
      ) {
        // Move folder down by swapping positions with next sibling
        const nextSibling = allSiblings[currentIndex + 1];
        if (nextSibling) {
          // Reassign sortOrder values to ensure they are different
          // Give the current folder the next sibling's position
          void onUpdateFolder(folderId, { sortOrder: currentIndex + 1 });
          void onUpdateFolder(nextSibling.id, { sortOrder: currentIndex });
        }
      }
    },
    [chat.folders, onUpdateFolder, logger],
  );

  // Mobile: use overlay (NO RESIZE - fixed width)
  if (isMobile) {
    return (
      <Div className="flex flex-row h-full w-full relative">
        {/* Mobile Sidebar Container - Fixed Overlay (NO RESIZE) */}
        <Div
          suppressHydrationWarning
          className={cn(
            "fixed inset-y-0 left-0 z-50 bg-background border-r border-border transition-transform duration-200 ease-in-out",
            SIDEBAR_WIDTH,
            collapsed ? "-translate-x-full" : "translate-x-0",
          )}
        >
          <Div className="h-full w-full bg-background">
            <ChatSidebar
              user={user}
              chat={chat}
              activeThreadId={activeThreadId}
              activeFolderId={activeSubFolderId}
              locale={locale}
              logger={logger}
              onCreateThread={handleCreateThread}
              onSelectThread={handleSelectThread}
              onDeleteThread={onDeleteThread}
              onMoveThread={handleMoveThread}
              onPinThread={handlePinThread}
              onArchiveThread={handleArchiveThread}
              onCreateFolder={handleCreateFolder}
              onUpdateFolder={onUpdateFolder}
              onDeleteFolder={chat.deleteFolder}
              onReorderFolder={handleReorderFolder}
              onMoveFolderToParent={handleMoveFolderToParent}
              onUpdateThreadTitle={onUpdateThreadTitle}
              searchThreads={() => []}
            />
          </Div>
        </Div>

        {/* Mobile Overlay Backdrop */}
        {!collapsed && (
          <Div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={onToggle}
            aria-label={t("app.chat.common.closeSidebar")}
          />
        )}

        {/* Chat Area for Mobile */}
        <Div className="flex-1 h-full w-full">{children}</Div>
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
        className="bg-background"
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
              <ChatSidebar
                user={user}
                chat={chat}
                activeThreadId={activeThreadId}
                activeFolderId={activeSubFolderId}
                locale={locale}
                logger={logger}
                onCreateThread={handleCreateThread}
                onSelectThread={handleSelectThread}
                onDeleteThread={onDeleteThread}
                onMoveThread={handleMoveThread}
                onPinThread={handlePinThread}
                onArchiveThread={handleArchiveThread}
                onCreateFolder={handleCreateFolder}
                onUpdateFolder={onUpdateFolder}
                onDeleteFolder={chat.deleteFolder}
                onReorderFolder={handleReorderFolder}
                onMoveFolderToParent={handleMoveFolderToParent}
                onUpdateThreadTitle={onUpdateThreadTitle}
                searchThreads={() => []}
              />
            </MotionDiv>
          )}
        </AnimatePresence>
      </ResizableContainer>

      {/* Main Content Panel - Chat Area (flexes to fill remaining space) */}
      <Div className="flex-1  h-screen">{children}</Div>
    </Div>
  );
}
