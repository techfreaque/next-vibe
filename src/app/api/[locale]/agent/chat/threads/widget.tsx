/**
 * Custom Widget for Threads List
 * Renders threads for a given folder — used by EndpointsPage from folders/widget.tsx
 * No useChatContext — fully props/widget-context based
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { useRouter } from "next-vibe-ui/hooks";
import { AlertDialog } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogAction } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogCancel } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogContent } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogDescription } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogFooter } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogHeader } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogTitle } from "next-vibe-ui/ui/alert-dialog";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { DropdownMenu } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuContent } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuItem } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuSeparator } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuTrigger } from "next-vibe-ui/ui/dropdown-menu";
import { Edit2 } from "next-vibe-ui/ui/icons/Edit2";
import { MoreVertical } from "next-vibe-ui/ui/icons/MoreVertical";
import { Pin } from "next-vibe-ui/ui/icons/Pin";
import { PinOff } from "next-vibe-ui/ui/icons/PinOff";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Input } from "next-vibe-ui/ui/input";
import { Tooltip } from "next-vibe-ui/ui/tooltip";
import { TooltipContent } from "next-vibe-ui/ui/tooltip";
import { TooltipProvider } from "next-vibe-ui/ui/tooltip";
import { TooltipTrigger } from "next-vibe-ui/ui/tooltip";
import { P } from "next-vibe-ui/ui/typography";
import React, { useState } from "react";

import {
  chatColors,
  chatTransitions,
} from "@/app/[locale]/chat/lib/design-tokens";
import { useWidgetContext } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { useTouchDevice } from "@/hooks/use-touch-device";
import { simpleT } from "@/i18n/core/shared";
import type { DivMouseEvent } from "@/packages/next-vibe-ui/web/ui/div";
import type { InputKeyboardEvent } from "@/packages/next-vibe-ui/web/ui/input";

import type definition from "./definition";
import type { ThreadListResponseOutput } from "./definition";

type ThreadFromResponse =
  ThreadListResponseOutput["response"]["threads"][number];

/**
 * Props for custom widget — matches the customWidgetObject pattern
 */
interface CustomWidgetProps {
  field: {
    value: ThreadListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

/**
 * Single thread row — props-only, no context
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
  const router = useRouter();
  const isTouch = useTouchDevice();
  const { locale, logger, user } = useWidgetContext();
  const { t } = simpleT(locale);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(thread.title);
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleThreadClick = (e: DivMouseEvent): void => {
    if (isEditing) {
      return;
    }
    if (e.target.closest?.("button") || e.target.closest?.("input")) {
      return;
    }
    const url = thread.folderId
      ? `/${locale}/threads/${thread.rootFolderId}/${thread.folderId}/${thread.id}`
      : `/${locale}/threads/${thread.rootFolderId}/${thread.id}`;
    router.push(url);
  };

  const mutateThread = async (updates: {
    title?: string;
    pinned?: boolean;
    folderId?: string | null;
  }): Promise<void> => {
    const { apiClient } =
      await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
    const threadDef =
      await import("@/app/api/[locale]/agent/chat/threads/[threadId]/definition");
    await apiClient.mutate(
      threadDef.default.PATCH,
      logger,
      user,
      { updates },
      { threadId: thread.id },
      locale,
    );
    const threadsDef = await import("./definition");
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

  const handleConfirmDelete = (): void => {
    void (async (): Promise<void> => {
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
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
      const threadsDef = await import("./definition");
      await apiClient.refetchEndpoint(threadsDef.default.GET, logger);
    })();
    setDeleteDialogOpen(false);
  };

  const hasMenuItems = thread.canEdit || thread.canDelete;

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

      {thread.pinned && (
        <Div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
      )}

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
  const { locale } = useWidgetContext();
  const { t } = simpleT(locale);

  const threads = field.value?.response?.threads ?? [];

  // Sort: pinned first, then by updatedAt desc
  const sorted = [...threads].toSorted((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // Derive active thread ID from URL
  const [activeThreadId, setActiveThreadId] = React.useState<string | null>(
    null,
  );
  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const parts = window.location.pathname.split("/").filter(Boolean);
    const lastPart = parts[parts.length - 1];
    // UUIDs or NEW_MESSAGE_ID
    setActiveThreadId(lastPart ?? null);
  }, []);

  const grouped = groupByTime(sorted);

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
