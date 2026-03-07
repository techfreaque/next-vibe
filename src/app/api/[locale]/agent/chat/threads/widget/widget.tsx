/**
 * Custom Widget for Threads List
 * Renders threads for a given folder — used by EndpointsPage from folders/widget.tsx
 */

"use client";

import { success } from "next-vibe/shared/types/response.schema";
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
import React, { useEffect, useMemo, useState } from "react";

import {
  chatColors,
  chatTransitions,
} from "@/app/[locale]/chat/lib/design-tokens";
import type { FolderListResponseOutput } from "@/app/api/[locale]/agent/chat/folders/[rootFolderId]/definition";
import foldersDefinition from "@/app/api/[locale]/agent/chat/folders/[rootFolderId]/definition";
import { ThreadPermissionsDialog } from "@/app/api/[locale]/agent/chat/threads/[threadId]/permissions/widget";
import { ThreadShareDialog } from "@/app/api/[locale]/agent/chat/threads/[threadId]/share-links/widget";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { useWidgetContext } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { useTouchDevice } from "@/hooks/use-touch-device";

import { DefaultFolderId } from "../../config";
import type { ChatThread } from "../../db";
import { useChatStore } from "../../hooks/store";
import { useChatNavigationStore } from "../../hooks/use-chat-navigation-store";
import type definition from "../definition";
import type { ThreadListResponseOutput } from "../definition";
import { scopedTranslation } from "../i18n";

type ThreadFromResponse = ThreadListResponseOutput["threads"][number];
type FolderFromResponse = FolderListResponseOutput["folders"][number];

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
  allFolders,
}: {
  thread: ThreadFromResponse;
  isActive: boolean;
  compact?: boolean;
  allFolders: FolderFromResponse[];
}): React.JSX.Element {
  const isTouch = useTouchDevice();
  const { locale, logger, user } = useWidgetContext();
  const { t } = scopedTranslation.scopedT(locale);
  const isThreadStreaming = thread.isStreaming;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(thread.title);
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

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
    // Optimistic update — apply immediately in cache
    const threadsDefModule = await import("../definition");
    const isFolderMove =
      "folderId" in updates && updates.folderId !== thread.folderId;
    apiClient.updateEndpointData(
      threadsDefModule.default.GET,
      logger,
      (old) => {
        if (!old?.success) {
          return old;
        }
        // When moving to a different folder, remove from current list
        // (server will include it in the target folder's list)
        if (isFolderMove) {
          return success({
            ...old.data,
            threads: old.data.threads.filter((row) => row.id !== thread.id),
          });
        }
        return success({
          ...old.data,
          threads: old.data.threads.map((row) =>
            row.id === thread.id ? { ...row, ...updates } : row,
          ),
        });
      },
      {
        requestData: {
          rootFolderId: thread.rootFolderId,
          subFolderId: thread.folderId ?? null,
        },
      },
    );

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
        { ...updates, rootFolderId: thread.rootFolderId },
        { threadId: thread.id },
        locale,
      );
    }
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
      // Optimistic update — remove thread from cache immediately
      const threadsDefModule = await import("../definition");
      apiClient.updateEndpointData(
        threadsDefModule.default.GET,
        logger,
        (old) => {
          if (!old?.success) {
            return old;
          }
          return success({
            ...old.data,
            threads: old.data.threads.filter((row) => row.id !== thread.id),
            totalCount: old.data.totalCount - 1,
          });
        },
        {
          requestData: {
            rootFolderId: thread.rootFolderId,
            subFolderId: thread.folderId ?? null,
          },
        },
      );

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
          { rootFolderId: thread.rootFolderId },
          { threadId: thread.id },
          locale,
        );
      }
    })();
    setDeleteDialogOpen(false);
  };

  const hasMenuItems =
    thread.canEdit || thread.canManagePermissions || thread.canDelete;

  return (
    <Div
      className={cn(
        "relative flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer",
        chatTransitions.colors,
        isActive
          ? cn(chatColors.sidebar.active, "shadow-sm")
          : chatColors.sidebar.hover,
        compact && "py-1",
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
                    {t("widget.actions.rename")}
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
                        {t("widget.actions.unpin")}
                      </>
                    ) : (
                      <>
                        <Pin className="h-4 w-4 mr-2" />
                        {t("widget.actions.pin")}
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
                        {t("widget.actions.unarchive")}
                      </>
                    ) : (
                      <>
                        <Archive className="h-4 w-4 mr-2" />
                        {t("widget.actions.archive")}
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
                    {t("widget.folderList.managePermissions")}
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
                    {t("widget.actions.manageSharing")}
                  </DropdownMenuItem>
                )}

                {/* Move to Folder */}
                {thread.canEdit && allFolders.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="cursor-pointer">
                        <FolderInput className="h-4 w-4 mr-2" />
                        {t("widget.actions.moveToFolder")}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {/* Move to root (unfiled) */}
                        {thread.folderId !== null && (
                          <DropdownMenuItem
                            onSelect={() => handleMoveToFolder(null)}
                            className="cursor-pointer"
                          >
                            <Icon icon="folder" className="h-4 w-4 mr-2" />
                            {t("widget.actions.unfiled")}
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
                      {t("widget.common.delete")}
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
              {t("widget.threadList.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("widget.threadList.deleteDialog.description", {
                title: thread.title,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("widget.common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("widget.common.delete")}
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
  allFolders,
  compact,
}: {
  label: string;
  threads: ThreadFromResponse[];
  activeThreadId: string | null;
  allFolders: FolderFromResponse[];
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
            allFolders={allFolders}
            compact={compact}
          />
        ))}
      </Div>
    </Div>
  );
}

/**
 * Renders a sorted, grouped list of threads with no data fetching.
 * Used by both FoldersListContainer (for root threads and folder threads)
 * and by ThreadsListContainer (EndpointsPage widget).
 */
export function ThreadsList({
  threads,
  allFolders,
  isLoading,
  showEmptyMessage = true,
}: {
  threads: ThreadFromResponse[];
  allFolders: FolderFromResponse[];
  isLoading?: boolean;
  showEmptyMessage?: boolean;
}): React.JSX.Element {
  const { locale } = useWidgetContext();
  const { t } = scopedTranslation.scopedT(locale);

  // Sync threads into Zustand store so useLazyBranchLoader can look up rootFolderId
  const addThread = useChatStore((s) => s.addThread);
  useEffect(() => {
    for (const thread of threads) {
      addThread({
        ...(thread as ChatThread),
        createdAt: new Date(thread.createdAt),
        updatedAt: new Date(thread.updatedAt),
      });
    }
  }, [threads, addThread]);

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

  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);
  const grouped = useMemo(() => groupByTime(sorted), [sorted]);

  if (isLoading) {
    return (
      <Div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  if (threads.length === 0) {
    if (!showEmptyMessage) {
      return <></>;
    }
    return (
      <Div className="px-4 py-4 text-center text-sm text-muted-foreground">
        {t("widget.common.noChatsFound")}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-0.5">
      <ThreadSection
        label={t("widget.folderList.today")}
        threads={grouped.today}
        activeThreadId={activeThreadId}
        allFolders={allFolders}
      />
      <ThreadSection
        label={t("widget.folderList.lastWeek")}
        threads={grouped.lastWeek}
        activeThreadId={activeThreadId}
        allFolders={allFolders}
      />
      <ThreadSection
        label={t("widget.folderList.lastMonth")}
        threads={grouped.lastMonth}
        activeThreadId={activeThreadId}
        allFolders={allFolders}
      />
      <ThreadSection
        label={t("widget.folderList.older")}
        threads={grouped.older}
        activeThreadId={activeThreadId}
        allFolders={allFolders}
      />
    </Div>
  );
}

/**
 * ThreadsListContainer — the widget rendered by EndpointsPage for threads/definition GET.
 * Only used as fallback; primary rendering is done via ThreadsList in folders/widget.tsx.
 */
export function ThreadsListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const { logger, user, endpointMutations } = useWidgetContext();

  const isLoadingFresh = endpointMutations?.read?.isLoadingFresh ?? false;
  const rootFolderId = useChatNavigationStore((s) => s.currentRootFolderId);

  const dataLoaded = field.value !== null && field.value !== undefined;

  // Only show root threads here (folderId === null).
  // Folder threads are rendered inside FolderRow in folders/widget.tsx.
  const rootThreads = useMemo(
    () => (field.value?.threads ?? []).filter((t) => t.folderId === null),
    [field.value?.threads],
  );

  const foldersEndpoint = useEndpoint(
    foldersDefinition,
    useMemo(
      () => ({
        read: {
          urlPathParams: { rootFolderId },
          queryOptions: {
            enabled: true,
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
      [rootFolderId],
    ),
    logger,
    user,
  );

  const allFolders = useMemo(
    (): FolderFromResponse[] =>
      foldersEndpoint.read?.response?.success
        ? foldersEndpoint.read.response.data.folders.filter(
            (f) => f.rootFolderId === rootFolderId,
          )
        : [],
    [foldersEndpoint.read?.response, rootFolderId],
  );

  if (!dataLoaded) {
    return (
      <Div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  return (
    <ThreadsList
      threads={rootThreads}
      allFolders={allFolders}
      isLoading={isLoadingFresh}
    />
  );
}
