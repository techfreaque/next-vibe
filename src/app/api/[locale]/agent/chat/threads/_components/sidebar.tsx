"use client";
import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { FolderPlus } from "next-vibe-ui/ui/icons/FolderPlus";
import { MessageSquarePlus } from "next-vibe-ui/ui/icons/MessageSquarePlus";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Input, type InputRefObject } from "next-vibe-ui/ui/input";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import { Tooltip } from "next-vibe-ui/ui/tooltip";
import { TooltipContent } from "next-vibe-ui/ui/tooltip";
import { TooltipProvider } from "next-vibe-ui/ui/tooltip";
import { TooltipTrigger } from "next-vibe-ui/ui/tooltip";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  buildFolderUrl,
  getNewChatTranslationKey,
  getNewFolderTranslationKey,
  getRootFolderId,
} from "@/app/[locale]/chat/lib/utils/navigation";
import { SidebarFooter } from "@/app/api/[locale]/agent/chat/_components/sidebar/footer/sidebar-footer";
import { TOUR_DATA_ATTRS } from "@/app/api/[locale]/agent/chat/_components/welcome-tour/tour-config";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { NEW_MESSAGE_ID } from "@/app/api/[locale]/agent/chat/enum";
import { RootFolderBar } from "@/app/api/[locale]/agent/chat/folders/_components/root-folder-bar";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useCredits } from "@/app/api/[locale]/credits/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { type TFunction } from "@/i18n/core/static-types";

import { FolderList } from "./thread-area/folder-list";
import { NewFolderDialog } from "./thread-area/new-folder-dialog";
import { ThreadList } from "./thread-area/thread-list";

interface ChatSidebarProps {
  locale: CountryLanguage;
  logger: EndpointLogger;
  autoFocusSearch?: boolean;
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
  locale,
  logger,
  autoFocusSearch = false,
}: ChatSidebarProps): JSX.Element {
  const { t } = simpleT(locale);
  const router = useRouter();

  // Get data and callbacks from context
  const {
    initialCredits,
    threads,
    folders,
    currentSubFolderId: activeFolderId,
    currentRootFolderId: activeRootFolderId,
    activeThreadId,
    rootFolderPermissions,
    handleCreateThread,
    createFolder,
    searchThreads,
    user,
  } = useChatContext();

  // Fetch credits with server-side initial data (disables initial fetch)
  // Hook handles null case internally - called unconditionally per React rules
  const endpoint = useCredits(user, logger, initialCredits);
  const readState = endpoint?.read;
  const credits = readState?.response?.success
    ? readState.response.data
    : initialCredits;
  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const searchInputRef = useRef<InputRefObject>(null);

  // Use server-provided user prop to determine authentication status immediately
  // This prevents hydration mismatch - no client-side delay
  const isAuthenticated = useMemo(
    () => user !== undefined && !user.isPublic,
    [user],
  );

  // Get color for the active root folder - using simple color mapping
  const rootFolderColor = useMemo(
    () =>
      activeRootFolderId === DefaultFolderId.PRIVATE
        ? "sky"
        : activeRootFolderId === DefaultFolderId.INCOGNITO
          ? "purple"
          : activeRootFolderId === DefaultFolderId.SHARED
            ? "teal"
            : activeRootFolderId === DefaultFolderId.PUBLIC
              ? "amber"
              : "zinc",
    [activeRootFolderId],
  );

  const handleSelectFolder = React.useCallback(
    (folderId: string): void => {
      const rootFolderId = getRootFolderId(folders, folderId);

      // If user is not authenticated and tries to access private/shared folders, redirect to public
      if (
        !isAuthenticated &&
        rootFolderId !== DefaultFolderId.PUBLIC &&
        rootFolderId !== DefaultFolderId.INCOGNITO
      ) {
        logger.info(
          "Non-authenticated user attempted to access private/shared folder, redirecting to public",
          {
            attemptedFolder: rootFolderId,
          },
        );
        const url = buildFolderUrl(locale, DefaultFolderId.PUBLIC, null);
        router.push(url);
        return;
      }

      // If folderId IS the root folder, don't pass it as subfolder
      const subFolderId = folderId === rootFolderId ? null : folderId;
      const url = buildFolderUrl(locale, rootFolderId, subFolderId);
      router.push(url);
    },
    [folders, isAuthenticated, logger, locale, router],
  );

  // Auto-focus search input when requested
  useEffect(() => {
    if (autoFocusSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocusSearch]);

  const handleSearch = React.useCallback((query: string): void => {
    setSearchQuery(query);
  }, []);

  const handleCreateFolder = React.useCallback(
    (name: string, icon: IconKey): void => {
      // If in a subfolder, create under that subfolder
      // If in root folder (no activeFolderId), create at root level
      const parentId: string | null = activeFolderId;
      void createFolder(name, activeRootFolderId, parentId, icon);
    },
    [createFolder, activeRootFolderId, activeFolderId],
  );

  const isSearching = useMemo(() => searchQuery.length > 0, [searchQuery]);
  const searchResults = useMemo(
    () => (isSearching ? searchThreads(searchQuery) : []),
    [isSearching, searchQuery, searchThreads],
  );

  // Memoize filtered threads for search results to avoid recomputation
  // Sort by pinned status (pinned first) and then by updatedAt (newest first)
  const filteredSearchThreads = useMemo(
    () =>
      (
        searchResults.map((result) => threads[result.id]).filter(Boolean) || []
      ).toSorted((a, b) => {
        // Pinned threads come first
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }
        // Then sort by updatedAt (newest first)
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      }),
    [searchResults, threads],
  );

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
          const canCreateThread = rootFolderPermissions.canCreateThread;

          // Don't show button if user doesn't have permission
          if (!canCreateThread) {
            return null;
          }

          // Check if we're on the new thread page
          const isOnNewThreadPage = activeThreadId === NEW_MESSAGE_ID;

          return (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Div className="w-full">
                    <Button
                      onClick={() => handleCreateThread(activeRootFolderId)}
                      disabled={isOnNewThreadPage}
                      className={`w-full h-10 sm:h-9 ${getButtonColorClasses(rootFolderColor)}`}
                      data-tour={TOUR_DATA_ATTRS.NEW_CHAT_BUTTON}
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
            className="pl-8 h-10 sm:h-8 text-sm border-none bg-blue-200 dark:bg-blue-950 focus-visible:ring-blue-500"
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
                  threads={filteredSearchThreads}
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
                activeRootFolderId={activeRootFolderId}
                activeFolderId={activeFolderId}
                locale={locale}
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
  activeFolderId,
  t,
  setNewFolderDialogOpen,
}: {
  activeRootFolderId: DefaultFolderId;
  activeFolderId: string | null;
  t: TFunction;
  setNewFolderDialogOpen: (open: boolean) => void;
}): JSX.Element | null {
  // Get data from context
  const { folders, rootFolderPermissions } = useChatContext();

  // Determine if user can create folders in current location
  // If in a subfolder, check folder.canManage (which includes canCreateFolder)
  // If in root folder, use server-computed permissions from props
  const canCreateFolder = activeFolderId
    ? (folders[activeFolderId]?.canManage ?? false)
    : rootFolderPermissions.canCreateFolder;

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
