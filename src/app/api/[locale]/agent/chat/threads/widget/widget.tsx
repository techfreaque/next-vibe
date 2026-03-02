/**
 * Custom Widget for Threads List
 * Renders threads for a given folder — used by EndpointsPage from folders/widget.tsx
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { AlertDialog } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogAction } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogCancel } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogContent } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogDescription } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogFooter } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogHeader } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogTitle } from "next-vibe-ui/ui/alert-dialog";
import { Button } from "next-vibe-ui/ui/button";
import type { DivMouseEvent } from "next-vibe-ui/ui/div";
import { Div } from "next-vibe-ui/ui/div";
import { DropdownMenu } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuContent } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuItem } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuSeparator } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuSub } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuSubContent } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuSubTrigger } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuTrigger } from "next-vibe-ui/ui/dropdown-menu";
import { Archive } from "next-vibe-ui/ui/icons/Archive";
import { ArchiveRestore } from "next-vibe-ui/ui/icons/ArchiveRestore";
import { Edit2 } from "next-vibe-ui/ui/icons/Edit2";
import { FolderInput } from "next-vibe-ui/ui/icons/FolderInput";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { MoreVertical } from "next-vibe-ui/ui/icons/MoreVertical";
import { Pin } from "next-vibe-ui/ui/icons/Pin";
import { PinOff } from "next-vibe-ui/ui/icons/PinOff";
import { Share2 } from "next-vibe-ui/ui/icons/Share2";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import type { InputKeyboardEvent } from "next-vibe-ui/ui/input";
import { Input } from "next-vibe-ui/ui/input";
import { Tooltip } from "next-vibe-ui/ui/tooltip";
import { TooltipContent } from "next-vibe-ui/ui/tooltip";
import { TooltipProvider } from "next-vibe-ui/ui/tooltip";
import { TooltipTrigger } from "next-vibe-ui/ui/tooltip";
import { P } from "next-vibe-ui/ui/typography";
import React, { useMemo, useState } from "react";

import {
  chatColors,
  chatTransitions,
} from "@/app/[locale]/chat/lib/design-tokens";
import { useAIStreamStore } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/store";
import { ThreadPermissionsDialog } from "@/app/api/[locale]/agent/chat/threads/[threadId]/permissions/widget";
import { ThreadShareDialog } from "@/app/api/[locale]/agent/chat/threads/[threadId]/share-links/widget";
import { useWidgetContext } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { useTouchDevice } from "@/hooks/use-touch-device";
import { simpleT } from "@/i18n/core/shared";

import { DefaultFolderId } from "../../config";
import { useSidebarFolders } from "../../folders/widget/widget";
import { useChatNavigationStore } from "../../hooks/use-chat-navigation-store";
import type definition from "../definition";
import type { ThreadListResponseOutput } from "../definition";

type ThreadFromResponse = ThreadListResponseOutput["threads"][number];

/**
 * Props for custom widget — matches the customWidgetObject pattern
 */
interface CustomWidgetProps {
  field: {
    value: ThreadListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

/**
 * Single thread row with full actions
 */
function ThreadRow({
  thread,
  isActive,
  compact,
}: {
  thread: ThreadFromResponse;
  isActive: boolean;
  compact?: boolean;
}): React.JSX.Element {
  const isTouch = useTouchDevice();
  const { locale, logger, user } = useWidgetContext();
  const { t } = simpleT(locale);
  const isThreadStreaming = useAIStreamStore(
    (state) => !!state.activeStreams[thread.id],
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(thread.title);
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Get folders from sidebar context for "move to folder" submenu
  const sidebarFolders = useSidebarFolders();
  const allFolders = useMemo(
    () =>
      sidebarFolders.filter(
        (folder) => folder.rootFolderId === thread.rootFolderId,
      ),
    [sidebarFolders, thread.rootFolderId],
  );

  const setNavigation = useChatNavigationStore((s) => s.setNavigation);

  const handleThreadClick = (e: DivMouseEvent): void => {
    if (isEditing) {
      return;
    }
    if (e.target.closest?.("button") || e.target.closest?.("input")) {
      return;
    }
    // Update Zustand store — single source of truth
    setNavigation({
      activeThreadId: thread.id,
      currentRootFolderId: thread.rootFolderId as DefaultFolderId,
      currentSubFolderId: thread.folderId ?? null,
    });
    // Update URL without server re-render
    const url = thread.folderId
      ? `/${locale}/threads/${thread.rootFolderId}/${thread.folderId}/${thread.id}`
      : `/${locale}/threads/${thread.rootFolderId}/${thread.id}`;
    window.history.pushState(null, "", url);
  };

  const isIncognito = thread.rootFolderId === DefaultFolderId.INCOGNITO;

  const mutateThread = async (updates: {
    title?: string;
    pinned?: boolean;
    archived?: boolean;
    folderId?: string | null;
  }): Promise<void> => {
    const { apiClient } =
      await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");

    if (isIncognito) {
      const { ChatThreadsRepositoryClient } =
        await import("../repository-client");
      await ChatThreadsRepositoryClient.updateThread(
        thread.id,
        updates,
        logger,
        locale,
      );
    } else {
      const threadDef =
        await import("@/app/api/[locale]/agent/chat/threads/[threadId]/definition");
      await apiClient.mutate(
        threadDef.default.PATCH,
        logger,
        user,
        updates,
        { threadId: thread.id },
        locale,
      );
    }

    const threadsDef = await import("../definition");
    await apiClient.refetchEndpoint(threadsDef.default.GET, logger);
  };

  const handleSaveEdit = (): void => {
    if (editTitle.trim() && editTitle.trim() !== thread.title) {
      void mutateThread({ title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (): void => {
    setEditTitle(thread.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: InputKeyboardEvent<"text">): void => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handlePinToggle = (): void => {
    setDropdownOpen(false);
    void mutateThread({ pinned: !thread.pinned });
  };

  const handleArchiveToggle = (): void => {
    setDropdownOpen(false);
    void mutateThread({ archived: !thread.archived });
  };

  const handleMoveToFolder = (folderId: string | null): void => {
    setDropdownOpen(false);
    void mutateThread({ folderId });
  };

  const handleManagePermissions = (): void => {
    setDropdownOpen(false);
    setPermissionsDialogOpen(true);
  };

  const handleManageSharing = (): void => {
    setDropdownOpen(false);
    setShareDialogOpen(true);
  };

  const handleConfirmDelete = (): void => {
    void (async (): Promise<void> => {
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");

      if (isIncognito) {
        const { ChatThreadsRepositoryClient } =
          await import("../repository-client");
        await ChatThreadsRepositoryClient.deleteThread(
          thread.id,
          logger,
          locale,
        );
      } else {
        const threadDef =
          await import("@/app/api/[locale]/agent/chat/threads/[threadId]/definition");
        await apiClient.mutate(
          threadDef.default.DELETE,
          logger,
          user,
          undefined,
          { threadId: thread.id },
          locale,
        );
      }

      const threadsDef = await import("../definition");
      await apiClient.refetchEndpoint(threadsDef.default.GET, logger);
    })();
    setDeleteDialogOpen(false);
  };

  const hasMenuItems =
    thread.canEdit || thread.canManagePermissions || thread.canDelete;

  return (
    <Div
      className={cn(
        "relative flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer",
        chatTransitions.colors,
        isActive
          ? cn(chatColors.sidebar.active, "shadow-sm")
          : chatColors.sidebar.hover,
        compact && "py-1.5",
      )}
      onClick={handleThreadClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!dropdownOpen) {
          setIsHovered(false);
        }
      }}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => {
        setTimeout(() => setIsTouched(false), 3000);
      }}
    >
      {isEditing ? (
        <Div className="flex-1 min-w-0">
          <Input<"text">
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 text-sm bg-background border border-border rounded"
          />
        </Div>
      ) : (
        <Div className="flex-1 min-w-0">
          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Div className="flex-1 min-w-0">
                  <Div
                    className={cn(
                      "text-sm font-medium truncate",
                      compact && "text-xs",
                    )}
                  >
                    {thread.title}
                  </Div>
                  {!compact && thread.preview && (
                    <Div className="text-xs text-muted-foreground truncate">
                      {thread.preview}
                    </Div>
                  )}
                </Div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <P className="text-sm">{thread.title}</P>
                {thread.preview && (
                  <P className="text-xs text-muted-foreground mt-1">
                    {thread.preview}
                  </P>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Div>
      )}

      {!isEditing &&
        (isHovered || isTouched || isActive || isTouch) &&
        hasMenuItems && (
          <Div className="flex items-center gap-1">
            <DropdownMenu
              open={dropdownOpen}
              onOpenChange={(open) => {
                setDropdownOpen(open);
                if (!open) {
                  setIsHovered(false);
                  setIsTouched(false);
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(true);
                  }}
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onCloseAutoFocus={(e) => e?.preventDefault()}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Rename */}
                {thread.canEdit && (
                  <DropdownMenuItem
                    onSelect={() => {
                      setDropdownOpen(false);
                      setIsEditing(true);
                    }}
                    className="cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    {t("app.chat.actions.rename")}
                  </DropdownMenuItem>
                )}

                {/* Pin/Unpin */}
                {thread.canEdit && (
                  <DropdownMenuItem
                    onSelect={handlePinToggle}
                    className="cursor-pointer"
                  >
                    {thread.pinned ? (
                      <>
                        <PinOff className="h-4 w-4 mr-2" />
                        {t("app.chat.actions.unpin")}
                      </>
                    ) : (
                      <>
                        <Pin className="h-4 w-4 mr-2" />
                        {t("app.chat.actions.pin")}
                      </>
                    )}
                  </DropdownMenuItem>
                )}

                {/* Archive/Unarchive */}
                {thread.canEdit && (
                  <DropdownMenuItem
                    onSelect={handleArchiveToggle}
                    className="cursor-pointer"
                  >
                    {thread.archived ? (
                      <>
                        <ArchiveRestore className="h-4 w-4 mr-2" />
                        {t("app.chat.actions.unarchive")}
                      </>
                    ) : (
                      <>
                        <Archive className="h-4 w-4 mr-2" />
                        {t("app.chat.actions.archive")}
                      </>
                    )}
                  </DropdownMenuItem>
                )}

                {/* Manage Permissions */}
                {thread.canManagePermissions && (
                  <DropdownMenuItem
                    onSelect={handleManagePermissions}
                    className="cursor-pointer"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {t("app.chat.folderList.managePermissions")}
                  </DropdownMenuItem>
                )}

                {/* Manage Sharing — only for threads in SHARED folder */}
                {/* eslint-disable-next-line i18next/no-literal-string */}
                {thread.rootFolderId === "shared" && thread.canEdit && (
                  <DropdownMenuItem
                    onSelect={handleManageSharing}
                    className="cursor-pointer"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {t("app.chat.actions.manageSharing")}
                  </DropdownMenuItem>
                )}

                {/* Move to Folder */}
                {thread.canEdit && allFolders.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="cursor-pointer">
                        <FolderInput className="h-4 w-4 mr-2" />
                        {t("app.chat.actions.moveToFolder")}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {/* Move to root (unfiled) */}
                        {thread.folderId !== null && (
                          <DropdownMenuItem
                            onSelect={() => handleMoveToFolder(null)}
                            className="cursor-pointer"
                          >
                            <Icon icon="folder" className="h-4 w-4 mr-2" />
                            {t("app.chat.actions.unfiled")}
                          </DropdownMenuItem>
                        )}
                        {allFolders.map((folder) => (
                          <DropdownMenuItem
                            key={folder.id}
                            onSelect={() => handleMoveToFolder(folder.id)}
                            disabled={thread.folderId === folder.id}
                            className="cursor-pointer"
                          >
                            <Icon
                              icon={folder.icon ?? "folder"}
                              className="h-4 w-4 mr-2"
                            />
                            {folder.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </>
                )}

                {/* Delete */}
                {thread.canDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        setDropdownOpen(false);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-destructive cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t("app.chat.common.delete")}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </Div>
        )}

      {/* Streaming indicator */}
      {isThreadStreaming && (
        <Div className="flex items-center gap-0.5 shrink-0">
          {/* eslint-disable i18next/no-literal-string */}
          <Div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]" />
          <Div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]" />
          <Div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]" />
          {/* eslint-enable i18next/no-literal-string */}
        </Div>
      )}

      {thread.pinned && (
        <Div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("app.chat.threadList.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("app.chat.threadList.deleteDialog.description", {
                title: thread.title,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("app.chat.common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("app.chat.common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permissions Dialog */}
      <ThreadPermissionsDialog
        user={user}
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
        threadId={thread.id}
        threadTitle={thread.title}
        locale={locale}
        logger={logger}
      />

      {/* Share Dialog */}
      <ThreadShareDialog
        user={user}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        threadId={thread.id}
        threadTitle={thread.title}
        locale={locale}
      />
    </Div>
  );
}

/**
 * Group threads by time bucket
 */
function groupByTime(threads: ThreadFromResponse[]): {
  today: ThreadFromResponse[];
  lastWeek: ThreadFromResponse[];
  lastMonth: ThreadFromResponse[];
  older: ThreadFromResponse[];
} {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);

  const today: ThreadFromResponse[] = [];
  const lastWeek: ThreadFromResponse[] = [];
  const lastMonth: ThreadFromResponse[] = [];
  const older: ThreadFromResponse[] = [];

  for (const thread of threads) {
    const updated = new Date(thread.updatedAt);
    if (updated >= todayStart) {
      today.push(thread);
    } else if (updated >= weekAgo) {
      lastWeek.push(thread);
    } else if (updated >= monthAgo) {
      lastMonth.push(thread);
    } else {
      older.push(thread);
    }
  }

  return { today, lastWeek, lastMonth, older };
}

/**
 * Renders a time-grouped section of threads
 */
function ThreadSection({
  label,
  threads,
  activeThreadId,
  compact,
}: {
  label: string;
  threads: ThreadFromResponse[];
  activeThreadId: string | null;
  compact?: boolean;
}): React.JSX.Element | null {
  if (threads.length === 0) {
    return null;
  }
  return (
    <Div className="mb-2">
      <Div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </Div>
      <Div className="flex flex-col gap-0.5">
        {threads.map((thread) => (
          <ThreadRow
            key={thread.id}
            thread={thread}
            isActive={thread.id === activeThreadId}
            compact={compact}
          />
        ))}
      </Div>
    </Div>
  );
}

/**
 * ThreadsListContainer — the widget rendered by EndpointsPage for threads/definition GET
 * Receives thread list from field.value, renders grouped by time with context menus
 */
export function ThreadsListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const { locale, endpointMutations } = useWidgetContext();
  const { t } = simpleT(locale);

  const isLoadingFresh = endpointMutations?.read?.isLoadingFresh ?? false;
  const dataLoaded = field.value !== null && field.value !== undefined;
  const threads = useMemo(
    () => field.value?.threads ?? [],
    [field.value?.threads],
  );

  // Sort: pinned first, then by updatedAt desc
  const sorted = useMemo(
    () =>
      [...threads].toSorted((a, b) => {
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }),
    [threads],
  );

  // Read active thread ID from navigation store (precise subscription)
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);

  const grouped = useMemo(() => groupByTime(sorted), [sorted]);

  if (!dataLoaded || isLoadingFresh) {
    return (
      <Div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  if (threads.length === 0) {
    return (
      <Div className="px-4 py-4 text-center text-sm text-muted-foreground">
        {t("app.chat.common.noChatsFound")}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-0.5">
      <ThreadSection
        label={t("app.chat.folderList.today")}
        threads={grouped.today}
        activeThreadId={activeThreadId}
      />
      <ThreadSection
        label={t("app.chat.folderList.lastWeek")}
        threads={grouped.lastWeek}
        activeThreadId={activeThreadId}
      />
      <ThreadSection
        label={t("app.chat.folderList.lastMonth")}
        threads={grouped.lastMonth}
        activeThreadId={activeThreadId}
      />
      <ThreadSection
        label={t("app.chat.folderList.older")}
        threads={grouped.older}
        activeThreadId={activeThreadId}
      />
    </Div>
  );
}
