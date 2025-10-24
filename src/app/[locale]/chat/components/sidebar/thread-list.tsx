"use client";

import { cn } from "next-vibe/shared/utils";
import { useRouter } from "next-vibe-ui/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Div,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  P,
  Span,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui";
import {
  Archive,
  ArchiveRestore,
  Edit2,
  FolderInput,
  MoreVertical,
  Pin,
  PinOff,
  Trash2,
} from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React, { useState } from "react";

import type { UseChatReturn } from "@/app/api/[locale]/v1/core/agent/chat/hooks";
import { getIconComponent } from "@/app/api/[locale]/v1/core/agent/chat/model-access/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useTouchDevice } from "../../hooks/use-touch-device";
import { chatColors, chatTransitions } from "../../lib/design-tokens";
import type { ChatThread } from "../../types";

interface ThreadListProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
  onUpdateTitle: (threadId: string, title: string) => void;
  onMoveThread?: (threadId: string, folderId: string | null) => void;
  onPinThread?: (threadId: string, pinned: boolean) => void;
  onArchiveThread?: (threadId: string, archived: boolean) => void;
  chat?: UseChatReturn;
  compact?: boolean;
  locale: CountryLanguage;
}

export function ThreadList({
  threads,
  activeThreadId,
  onSelectThread,
  onDeleteThread,
  onUpdateTitle,
  onMoveThread,
  onPinThread,
  onArchiveThread,
  chat,
  compact = false,
  locale,
}: ThreadListProps): JSX.Element {
  return (
    <Div className="space-y-0.5">
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          thread={thread}
          isActive={thread.id === activeThreadId}
          onSelect={onSelectThread}
          onDelete={onDeleteThread}
          onUpdateTitle={onUpdateTitle}
          onMoveThread={onMoveThread}
          onPinThread={onPinThread}
          onArchiveThread={onArchiveThread}
          chat={chat}
          compact={compact}
          locale={locale}
        />
      ))}
    </Div>
  );
}

interface ThreadItemProps {
  thread: ChatThread;
  isActive: boolean;
  onSelect: (threadId: string) => void;
  onDelete: (threadId: string) => void;
  onUpdateTitle: (threadId: string, title: string) => void;
  onMoveThread?: (threadId: string, folderId: string | null) => void;
  onPinThread?: (threadId: string, pinned: boolean) => void;
  onArchiveThread?: (threadId: string, archived: boolean) => void;
  chat?: UseChatReturn;
  compact?: boolean;
  locale: CountryLanguage;
}

function ThreadItem({
  thread,
  isActive,
  onDelete,
  onUpdateTitle,
  onMoveThread,
  onPinThread,
  onArchiveThread,
  chat,
  compact = false,
  locale,
}: ThreadItemProps): JSX.Element {
  const router = useRouter();
  const isTouch = useTouchDevice();
  const { t } = simpleT(locale);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(thread.title);
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Get model icon (fallback to default model if not set)
  // Model config removed - icons no longer shown in thread list for clean design

  const handleDeleteClick = (): void => {
    setDropdownOpen(false);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = (): void => {
    onDelete(thread.id);
    setDeleteDialogOpen(false);
  };

  const handlePinToggle = (): void => {
    setDropdownOpen(false);
    if (onPinThread) {
      onPinThread(thread.id, !thread.pinned);
    }
  };

  const handleArchiveToggle = (): void => {
    setDropdownOpen(false);
    if (onArchiveThread) {
      onArchiveThread(thread.id, !thread.archived);
    }
  };

  const handleEdit = (): void => {
    setDropdownOpen(false);
    setIsEditing(true);
  };

  const handleSaveEdit = (): void => {
    if (editTitle.trim()) {
      onUpdateTitle(thread.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (): void => {
    setEditTitle(thread.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleMoveToFolder = (folderId: string | null): void => {
    setDropdownOpen(false);
    if (onMoveThread) {
      onMoveThread(thread.id, folderId);
    }
  };

  // Get all folders for the move menu
  const allFolders = chat ? Object.values(chat.folders) : [];
  const currentFolderId = thread.folderId;

  // Handle thread click to navigate
  const handleThreadClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    // Don't navigate if editing or clicking on buttons
    if (isEditing) {
      return;
    }

    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("input")) {
      return;
    }

    // Navigate to thread using root folder ID, subfolder ID, and thread ID
    const url = thread.folderId
      ? `/${locale}/threads/${thread.rootFolderId}/${thread.folderId}/${thread.id}`
      : `/${locale}/threads/${thread.rootFolderId}/${thread.id}`;
    router.push(url);
  };

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
        // Don't remove hover state if dropdown is open
        if (!dropdownOpen) {
          setIsHovered(false);
        }
      }}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => {
        // Keep touched state briefly for action visibility
        setTimeout(() => setIsTouched(false), 3000);
      }}
    >
      {isEditing ? (
        <Div className="flex-1 min-w-0">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 text-sm bg-background border border-border rounded"
            autoFocus
            onClick={(e) => e.stopPropagation()}
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

      {!isEditing && (isHovered || isTouched || isActive || isTouch) && (
        <Div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu
            open={dropdownOpen}
            onOpenChange={(open) => {
              setDropdownOpen(open);
              // Reset hover/touch state when dropdown closes
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
              onClick={(e) => e.stopPropagation()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuItem onSelect={handleEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                {t("app.chat.actions.rename")}
              </DropdownMenuItem>

              {onPinThread && (
                <DropdownMenuItem onSelect={handlePinToggle}>
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

              {onArchiveThread && (
                <DropdownMenuItem onSelect={handleArchiveToggle}>
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

              {onMoveThread && chat && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <FolderInput className="h-4 w-4 mr-2" />
                      {t("app.chat.actions.moveToFolder")}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {/* Option to move to root (no folder) */}
                      {currentFolderId !== null && (
                        <DropdownMenuItem
                          onSelect={() => handleMoveToFolder(null)}
                        >
                          {((): JSX.Element => {
                            const UnfiledIcon = getIconComponent("folder");
                            return (
                              <>
                                <UnfiledIcon className="h-4 w-4 mr-2" />
                                {t("app.chat.actions.unfiled")}
                              </>
                            );
                          })()}
                        </DropdownMenuItem>
                      )}

                      {/* List all folders */}
                      {allFolders.length > 0 ? (
                        allFolders.map((folder) => {
                          const FolderIcon = getIconComponent(
                            folder.icon ?? "folder",
                          );
                          return (
                            <DropdownMenuItem
                              key={folder.id}
                              onSelect={() => handleMoveToFolder(folder.id)}
                              disabled={currentFolderId === folder.id}
                            >
                              <FolderIcon className="h-4 w-4 mr-2" />
                              {folder.name}
                            </DropdownMenuItem>
                          );
                        })
                      ) : (
                        <DropdownMenuItem disabled>
                          <Span className="text-sm text-muted-foreground">
                            {t("app.chat.actions.noFoldersAvailable")}
                          </Span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleDeleteClick}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t("app.chat.common.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Div>
      )}

      {thread.pinned && (
        <Div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
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
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              {t("app.chat.common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                handleConfirmDelete();
              }}
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
