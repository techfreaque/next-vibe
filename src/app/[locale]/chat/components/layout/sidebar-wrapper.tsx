"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui";
import type { JSX } from "react";
import React from "react";

import type {
  FolderUpdate,
  UseChatReturn,
} from "@/app/api/[locale]/v1/core/agent/chat/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { ChatFolder, ChatThread, DefaultFolderId } from "../../types";
import { ChatSidebar } from "../sidebar/chat-sidebar";

const SIDEBAR_WIDTH = "w-80";

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
}: SidebarWrapperProps): JSX.Element {
  const { t } = simpleT(locale);

  // Detect if we're on mobile (window width < 768px)
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
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
      const isRootFolder =
        parentId === "private" ||
        parentId === "shared" ||
        parentId === "public" ||
        parentId === "incognito";

      const rootFolderId = isRootFolder
        ? (parentId as DefaultFolderId)
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

  return (
    <>
      {/* Sidebar Container */}
      <Div
        suppressHydrationWarning
        className={cn(
          // Desktop: flexible width with smooth transition, z-10 to stay below input (z-20)
          "hidden md:block transition-all duration-200 ease-in-out overflow-hidden border-r border-border flex-shrink-0",
          collapsed ? "w-0 border-r-0" : SIDEBAR_WIDTH,
          // Mobile: fixed overlay with z-50 (same as top bar, above input z-20, above backdrop z-30)
          "md:relative md:z-10 fixed inset-y-0 left-0 z-50",
          !collapsed && "block",
        )}
      >
        <Div className={`h-full ${SIDEBAR_WIDTH} bg-background`}>
          <ChatSidebar
            chat={chat}
            activeThreadId={activeThreadId}
            activeFolderId={activeSubFolderId || undefined}
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
            onToggleFolderExpanded={() => {}}
            onReorderFolder={() => {}}
            onMoveFolderToParent={handleMoveFolderToParent}
            onUpdateThreadTitle={onUpdateThreadTitle}
            searchThreads={() => []}
          />
        </Div>
      </Div>

      {/* Mobile Overlay Backdrop */}
      {!collapsed && (
        <Div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
          aria-label={t("app.chat.common.closeSidebar")}
        />
      )}
    </>
  );
}
