"use client";

import Link from "next/link";
import { useRouter } from "next-vibe-ui/hooks";
import {
  Button,
  Div,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  P,
  ScrollArea,
  Span,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui";
import {
  Coins,
  FolderPlus,
  HelpCircle,
  Info,
  MessageSquarePlus,
  Search,
  Settings,
} from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React, { useEffect, useRef, useState } from "react";

import { DEFAULT_FOLDER_IDS } from "@/app/api/[locale]/v1/core/agent/chat/config";
import type {
  FolderUpdate,
  UseChatReturn,
} from "@/app/api/[locale]/v1/core/agent/chat/hooks";
import { useCredits } from "@/app/api/[locale]/v1/core/credits/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { authClientRepository } from "@/app/api/[locale]/v1/core/user/auth/repository-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { UI_CONFIG } from "../../lib/config/constants";
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

interface ChatSidebarProps {
  chat: UseChatReturn;
  activeThreadId: string | null;
  activeFolderId?: string;
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
  onToggleFolderExpanded: (folderId: string) => void;
  onReorderFolder: (folderId: string, direction: "up" | "down") => void;
  onMoveFolderToParent: (folderId: string, newParentId: string | null) => void;
  onUpdateThreadTitle: (threadId: string, title: string) => void;
  searchThreads: (query: string) => Array<{ id: string; title: string }>;
  autoFocusSearch?: boolean;
}

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
  onToggleFolderExpanded,
  onReorderFolder,
  onMoveFolderToParent,
  onUpdateThreadTitle,
  searchThreads,
  autoFocusSearch = false,
}: ChatSidebarProps): JSX.Element {
  const { t } = simpleT(locale);
  const router = useRouter();
  const endpoint = useCredits(logger);
  const credits = endpoint.read?.response?.success
    ? endpoint.read.response.data
    : null;
  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get the root folder ID from the active folder (could be root or subfolder)
  const activeRootFolderId = activeFolderId
    ? getRootFolderId(chat.folders, activeFolderId)
    : chat.currentRootFolderId || DEFAULT_FOLDER_IDS.PRIVATE;

  // Check if user is authenticated using auth status cookie (client-side only)
  useEffect(() => {
    const authStatusResponse = authClientRepository.hasAuthStatus(logger);
    setIsAuthenticated(
      authStatusResponse.success && authStatusResponse.data === true,
    );
  }, [logger]);

  // Check if current folder requires authentication
  const requiresAuth = activeRootFolderId !== DEFAULT_FOLDER_IDS.INCOGNITO;

  // Get color for the active root folder - using simple color mapping
  const rootFolderColor =
    activeRootFolderId === DEFAULT_FOLDER_IDS.PRIVATE
      ? "blue"
      : activeRootFolderId === DEFAULT_FOLDER_IDS.SHARED
        ? "green"
        : activeRootFolderId === DEFAULT_FOLDER_IDS.PUBLIC
          ? "purple"
          : "gray";

  // Get button color classes based on root folder color
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
      zinc: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-500/20 border-zinc-500/30",
    };
    /* eslint-enable i18next/no-literal-string */

    return colorMap[color] || "";
  };

  const handleSelectFolder = (folderId: string): void => {
    const rootFolderId = getRootFolderId(chat.folders, folderId);

    // If user is not authenticated and tries to access non-incognito folder, redirect to incognito
    if (!isAuthenticated && rootFolderId !== DEFAULT_FOLDER_IDS.INCOGNITO) {
      logger.info(
        "Non-authenticated user attempted to access non-incognito folder, redirecting to incognito",
        {
          attemptedFolder: rootFolderId,
        },
      );
      const url = buildFolderUrl(locale, DEFAULT_FOLDER_IDS.INCOGNITO, null);
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
    // Always create subfolders under the active folder (never at root level)
    // If no active folder, use the active root folder as parent
    const parentId: string = activeFolderId || activeRootFolderId;
    onCreateFolder(name, parentId, icon);
  };

  const isSearching = searchQuery.length > 0;
  const searchResults = isSearching ? searchThreads(searchQuery) : [];

  return (
    <Div className="flex flex-col h-full bg-background">
      <Div className="bg-background space-y-0 pt-15" />

      {/* Root Folder Navigation Bar */}
      <RootFolderBar
        activeFolderId={activeRootFolderId}
        locale={locale}
        onSelectFolder={handleSelectFolder}
      />
      {/* New Chat Button */}
      <Div className="flex items-center gap-1 px-3 pb-2 min-w-max">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Div className="w-full">
                <Button
                  onClick={() => onCreateThread(activeRootFolderId)}
                  className={`w-full h-10 sm:h-9 ${getButtonColorClasses(rootFolderColor)}`}
                  disabled={requiresAuth && !isAuthenticated}
                >
                  <MessageSquarePlus className="h-4 w-4 mr-2" />
                  {t(getNewChatTranslationKey(activeRootFolderId))}
                </Button>
              </Div>
            </TooltipTrigger>
            {requiresAuth && !isAuthenticated && (
              <TooltipContent side="bottom">
                <P>{t("app.chat.common.loginRequired")}</P>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        {/* New Folder Button */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 hover:bg-accent"
                onClick={() => setNewFolderDialogOpen(true)}
                title={t(getNewFolderTranslationKey(activeRootFolderId))}
                disabled={requiresAuth && !isAuthenticated}
              >
                <FolderPlus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <P>
                {requiresAuth && !isAuthenticated
                  ? t("app.chat.common.loginRequired")
                  : t(getNewFolderTranslationKey(activeRootFolderId))}
              </P>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Div>
      {/* Search Bar + Fullscreen Button */}
      <Div className="px-3 pb-3 flex gap-2  border-b border-border ">
        <Div className="relative flex-1">
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
        {/* {onNavigateToThreads && (
          <Button
            variant="outline"
            size="icon"
            onClick={onNavigateToThreads}
            className="h-10 w-10 sm:h-8 sm:w-8 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
            title={t("app.chat.common.viewAllThreads")}
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        )} */}
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
                onToggleFolderExpanded={onToggleFolderExpanded}
                onReorderFolder={onReorderFolder}
                onMoveFolderToParent={onMoveFolderToParent}
                onUpdateThreadTitle={onUpdateThreadTitle}
              />
            )}
          </Div>
        </ScrollArea>
      </Div>

      {/* Credits Dropdown and Navigation Section */}
      <Div className="border-t border-border bg-background px-3 py-3 space-y-2">
        {credits && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-10">
                <Div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-blue-500" />
                  <Span className="text-sm font-medium">
                    {t("app.chat.credits.total", { count: credits.total })}
                  </Span>
                </Div>
                <Span className="text-xs text-muted-foreground">
                  {t("app.chat.credits.viewDetails")}
                </Span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={UI_CONFIG.SIDEBAR_WIDTH}
            >
              <Div className="px-2 py-2 space-y-2">
                <Div className="flex items-center justify-between">
                  <Span className="text-sm font-medium">
                    {t("app.chat.credits.breakdown")}
                  </Span>
                </Div>
                <Div className="space-y-1 text-sm">
                  <Div className="flex justify-between">
                    <Span className="text-muted-foreground">
                      {t("app.chat.credits.total")}
                    </Span>
                    <Span className="font-medium">{credits.total}</Span>
                  </Div>
                  {credits.permanent > 0 && (
                    <Div className="flex justify-between">
                      <Span className="text-muted-foreground">
                        {t("app.chat.credits.permanent")}
                      </Span>
                      <Span>{credits.permanent}</Span>
                    </Div>
                  )}
                  {credits.expiring > 0 && (
                    <Div className="flex justify-between">
                      <Span className="text-muted-foreground">
                        {t("app.chat.credits.expiring")}
                      </Span>
                      <Span>{credits.expiring}</Span>
                    </Div>
                  )}
                  {credits.free > 0 && (
                    <Div className="flex justify-between">
                      <Span className="text-muted-foreground">
                        {t("app.chat.credits.free")}
                      </Span>
                      <Span>{credits.free}</Span>
                    </Div>
                  )}
                  {credits.expiresAt && (
                    <Div className="flex justify-between text-xs">
                      <Span className="text-muted-foreground">
                        {t("app.chat.credits.expiresAt")}
                      </Span>
                      <Span>
                        {new Date(credits.expiresAt).toLocaleDateString()}
                      </Span>
                    </Div>
                  )}
                </Div>
              </Div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/subscription`}
                  className="w-full cursor-pointer"
                >
                  <Coins className="h-4 w-4 mr-2" />
                  {t("app.chat.credits.buyMore")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Div className="flex flex-col gap-1">
          <Link href={`/${locale}/app/dashboard`}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2"
            >
              <Settings className="h-3.5 w-3.5 mr-2" />
              {t("app.chat.credits.navigation.profile")}
            </Button>
          </Link>
          <Link href={`/${locale}/subscription`}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2"
            >
              <Coins className="h-3.5 w-3.5 mr-2" />
              {t("app.chat.credits.navigation.subscription")}
            </Button>
          </Link>
          <Link href={`/${locale}/story/about-us`}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2"
            >
              <Info className="h-3.5 w-3.5 mr-2" />
              {t("app.chat.credits.navigation.about")}
            </Button>
          </Link>
          <Link href={`/${locale}/help`}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-2"
            >
              <HelpCircle className="h-3.5 w-3.5 mr-2" />
              {t("app.chat.credits.navigation.help")}
            </Button>
          </Link>
        </Div>
      </Div>

      <NewFolderDialog
        open={newFolderDialogOpen}
        onOpenChange={setNewFolderDialogOpen}
        onSave={handleCreateFolder}
        locale={locale}
      />
    </Div>
  );
}
