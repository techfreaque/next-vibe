"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { type InputRefObject,
Input } from "next-vibe-ui/ui/input";
import { P } from "next-vibe-ui/ui/typography";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import { Tooltip } from "next-vibe-ui/ui/tooltip";
import { TooltipContent } from "next-vibe-ui/ui/tooltip";
import { TooltipProvider } from "next-vibe-ui/ui/tooltip";
import { TooltipTrigger } from "next-vibe-ui/ui/tooltip";
import { FolderPlus } from "next-vibe-ui/ui/icons/FolderPlus";
import { MessageSquarePlus } from "next-vibe-ui/ui/icons/MessageSquarePlus";
import { Search } from "next-vibe-ui/ui/icons/Search";
import type { JSX } from "react";
import React, { useEffect, useRef, useState } from "react";

import { useChatContext } from "@/app/[locale]/chat/features/chat/context";
import {
  type DefaultFolderId,
  DEFAULT_FOLDER_IDS,
} from "@/app/api/[locale]/v1/core/agent/chat/config";
import type { UseChatReturn } from "@/app/api/[locale]/v1/core/agent/chat/hooks/hooks";
import type { FolderUpdate } from "@/app/api/[locale]/v1/core/agent/chat/folders/hooks/use-operations";
import { useCredits } from "@/app/api/[locale]/v1/core/credits/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import {
  buildFolderUrl,
  getNewChatTranslationKey,
  getNewFolderTranslationKey,
  getRootFolderId,
} from "../../lib/utils/navigation";
import { FolderList } from "./folder-list";
import { NewFolderDialog } from "./new-folder-dialog";
import { RootFolderBar } from "./root-folder-bar";
import { ThreadList } from "./thread-list";
import { SidebarFooter } from "./sidebar-footer";
import { type TFunction } from "@/i18n/core/static-types";

interface ChatSidebarProps {
  chat: UseChatReturn;
  activeThreadId: string | null;
  activeFolderId: string | null;
  locale: CountryLanguage;
  logger: EndpointLogger;
  onCreateThread: (folderId?: string | null) => void;
  onSelectThread: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
  onMoveThread: (threadId: string, folderId: string | null) => void;
  onPinThread: (threadId: string, pinned: boolean) => void;
  onArchiveThread: (threadId: string, archived: boolean) => void;
  onCreateFolder: (name: string, parentId: string, icon?: string) => string;
  onUpdateFolder: (folderId: string, updates: FolderUpdate) => void;
  onDeleteFolder: (folderId: string, deleteThreads: boolean) => void;
  onReorderFolder: (folderId: string, direction: "up" | "down") => void;
  onMoveFolderToParent: (folderId: string, newParentId: string | null) => void;
  onUpdateThreadTitle: (threadId: string, title: string) => void;
  searchThreads: (query: string) => Array<{ id: string; title: string }>;
  autoFocusSearch?: boolean;
  user: JwtPayloadType | undefined;
}

const getButtonColorClasses = (color: string | null): string => {
  if (!color) {
    return "";
  }

  /* eslint-disable i18next/no-literal-string */
  const colorMap: Record<string, string> = {
    sky: "bg-sky-500/15 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 border-sky-500/30",
    teal: "bg-teal-500/15 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 border-teal-500/30",
    amber:
      "bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border-amber-500/30",
    purple:
      "bg-purple-500/15 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 border-purple-500/30",
    zinc: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-500/20 border-zinc-500/30",
  };
  /* eslint-enable i18next/no-literal-string */

  return colorMap[color] || "";
};

export function ChatSidebar({
  chat,
  activeThreadId,
  activeFolderId,
  locale,
  logger,
  onCreateThread,
  onSelectThread,
  onDeleteThread,
  onMoveThread,
  onPinThread,
  onArchiveThread,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  onReorderFolder,
  onMoveFolderToParent,
  onUpdateThreadTitle,
  searchThreads,
  autoFocusSearch = false,
  user,
}: ChatSidebarProps): JSX.Element {
  const { t } = simpleT(locale);
  const router = useRouter();

  // Get initial credits from context (server-side data)
  const { initialCredits } = useChatContext();

  // Fetch credits with server-side initial data (disables initial fetch)
  // Only use credits hook if we have initial data from server
  const endpoint = initialCredits ? useCredits(logger, initialCredits) : null;
  const readState = endpoint?.read;
  const credits = readState?.response?.success
    ? readState.response.data
    : initialCredits;
  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const searchInputRef = useRef<InputRefObject>(null);

  // Use server-provided user prop to determine authentication status immediately
  // This prevents hydration mismatch - no client-side delay
  const isAuthenticated = user !== undefined && !user.isPublic;

  // Get the root folder ID from URL - this is the single source of truth
  // Never derive it from activeFolderId as folders might not be loaded yet during initial render
  const activeRootFolderId = chat.currentRootFolderId;

  // Get color for the active root folder - using simple color mapping
  const rootFolderColor =
    activeRootFolderId === DEFAULT_FOLDER_IDS.PRIVATE
      ? "sky"
      : activeRootFolderId === DEFAULT_FOLDER_IDS.INCOGNITO
        ? "purple"
        : activeRootFolderId === DEFAULT_FOLDER_IDS.SHARED
          ? "teal"
          : activeRootFolderId === DEFAULT_FOLDER_IDS.PUBLIC
            ? "amber"
            : "zinc";

  const handleSelectFolder = (folderId: string): void => {
    const rootFolderId = getRootFolderId(chat.folders, folderId);

    // If user is not authenticated and tries to access private/shared folders, redirect to public
    if (
      !isAuthenticated &&
      rootFolderId !== DEFAULT_FOLDER_IDS.PUBLIC &&
      rootFolderId !== DEFAULT_FOLDER_IDS.INCOGNITO
    ) {
      logger.info(
        "Non-authenticated user attempted to access private/shared folder, redirecting to public",
        {
          attemptedFolder: rootFolderId,
        },
      );
      const url = buildFolderUrl(locale, DEFAULT_FOLDER_IDS.PUBLIC, null);
      router.push(url);
      return;
    }

    // If folderId IS the root folder, don't pass it as subfolder
    const subFolderId = folderId === rootFolderId ? null : folderId;
    const url = buildFolderUrl(locale, rootFolderId, subFolderId);
    router.push(url);
  };

  // Auto-focus search input when requested
  useEffect(() => {
    if (autoFocusSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocusSearch]);

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
  };

  const handleCreateFolder = (name: string, icon: string): void => {
    // If in a subfolder, create under that subfolder
    // If in root folder (no activeFolderId), create at root level (parentId = activeRootFolderId)
    // The sidebar-wrapper will convert root folder ID to null for the actual API call
    const parentId: string = activeFolderId || activeRootFolderId;
    onCreateFolder(name, parentId, icon);
  };

  const isSearching = searchQuery.length > 0;
  const searchResults = isSearching ? searchThreads(searchQuery) : [];

  return (
    <Div className="flex flex-col h-full bg-background">
      <Div className="bg-background flex flex-col gap-0 pt-15" />

      {/* Root Folder Navigation Bar */}
      <RootFolderBar
        activeFolderId={activeRootFolderId}
        onSelectFolder={handleSelectFolder}
        isAuthenticated={isAuthenticated}
        locale={locale}
      />
      {/* New Chat Button */}
      <Div className="flex flex-row items-center gap-1 px-3 pb-2 min-w-max">
        {(() => {
          // Determine if user can create threads in current location
          // Permissions are computed server-side and passed as props
          const canCreateThread = chat.rootFolderPermissions.canCreateThread;

          // Don't show button if user doesn't have permission
          if (!canCreateThread) {
            return null;
          }

          return (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Div className="w-full">
                    <Button
                      onClick={() => onCreateThread(activeRootFolderId)}
                      className={`w-full h-10 sm:h-9 ${getButtonColorClasses(rootFolderColor)}`}
                    >
                      <MessageSquarePlus className="h-4 w-4 mr-2" />
                      {t(getNewChatTranslationKey(activeRootFolderId))}
                    </Button>
                  </Div>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          );
        })()}
        {/* New Folder Button */}
        <NewFolderButton
          activeRootFolderId={activeRootFolderId}
          chat={chat}
          activeFolderId={null}
          setNewFolderDialogOpen={setNewFolderDialogOpen}
          t={t}
        />
      </Div>
      {/* Search Bar + Fullscreen Button */}
      <Div className="px-3 pb-3 flex flex-row gap-2 border-b border-border ">
        <Div className="relative flex-1 flex flex-row">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={t("app.chat.common.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8 h-10 sm:h-8 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500"
          />
        </Div>
      </Div>

      <Div className="flex-1 overflow-hidden px-0">
        <ScrollArea className="h-full">
          <Div className="px-2 py-2">
            {isSearching ? (
              <Div>
                <Div className="px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {t("app.chat.common.searchResults", {
                    count: searchResults.length,
                  })}
                </Div>
                <ThreadList
                  threads={searchResults
                    .map((result) => chat.threads[result.id])
                    .filter(Boolean)}
                  activeThreadId={activeThreadId}
                  onSelectThread={onSelectThread}
                  onDeleteThread={onDeleteThread}
                  onUpdateTitle={onUpdateThreadTitle}
                  onMoveThread={onMoveThread}
                  onPinThread={onPinThread}
                  onArchiveThread={onArchiveThread}
                  chat={chat}
                  locale={locale}
                  logger={logger}
                  compact
                />
                {searchResults.length === 0 && (
                  <Div className="px-4 py-8 text-center text-sm text-slate-500">
                    {t("app.chat.common.noChatsFound")}
                  </Div>
                )}
              </Div>
            ) : (
              <FolderList
                chat={chat}
                activeThreadId={activeThreadId}
                activeRootFolderId={activeRootFolderId}
                activeFolderId={activeFolderId}
                locale={locale}
                onCreateThread={onCreateThread}
                onSelectThread={onSelectThread}
                onDeleteThread={onDeleteThread}
                onMoveThread={onMoveThread}
                onPinThread={onPinThread}
                onArchiveThread={onArchiveThread}
                onCreateFolder={onCreateFolder}
                onUpdateFolder={onUpdateFolder}
                onDeleteFolder={onDeleteFolder}
                onReorderFolder={onReorderFolder}
                onMoveFolderToParent={onMoveFolderToParent}
                onUpdateThreadTitle={onUpdateThreadTitle}
                logger={logger}
              />
            )}
          </Div>
        </ScrollArea>
      </Div>

      {/* Compact Footer with Credits and User Menu */}
      <SidebarFooter
        locale={locale}
        credits={credits}
        user={user}
        logger={logger}
      />

      <NewFolderDialog
        open={newFolderDialogOpen}
        onOpenChange={setNewFolderDialogOpen}
        onSave={handleCreateFolder}
        locale={locale}
      />
    </Div>
  );
}

function NewFolderButton({
  activeRootFolderId,
  chat,
  activeFolderId,
  t,
  setNewFolderDialogOpen,
}: {
  activeRootFolderId: DefaultFolderId;
  chat: UseChatReturn;
  activeFolderId: string | null;
  t: TFunction;
  setNewFolderDialogOpen: (open: boolean) => void;
}): JSX.Element | null {
  // Determine if user can create folders in current location
  // If in a subfolder, check folder.canManage (which includes canCreateFolder)
  // If in root folder, use server-computed permissions from props
  const canCreateFolder = activeFolderId
    ? (chat.folders[activeFolderId]?.canManage ?? false)
    : chat.rootFolderPermissions.canCreateFolder;

  // Don't show button if user doesn't have permission
  if (!canCreateFolder) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 hover:bg-accent"
            onClick={() => setNewFolderDialogOpen(true)}
            title={t(getNewFolderTranslationKey(activeRootFolderId))}
          >
            <FolderPlus className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <P>{t(getNewFolderTranslationKey(activeRootFolderId))}</P>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
