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
import { DropdownMenuSub } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuSubContent } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuSubTrigger } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuTrigger } from "next-vibe-ui/ui/dropdown-menu";
import { Archive } from "next-vibe-ui/ui/icons/Archive";
import { ArchiveRestore } from "next-vibe-ui/ui/icons/ArchiveRestore";
import { Edit2 } from "next-vibe-ui/ui/icons/Edit2";
import { FolderInput } from "next-vibe-ui/ui/icons/FolderInput";
import { MoreVertical } from "next-vibe-ui/ui/icons/MoreVertical";
import { Pin } from "next-vibe-ui/ui/icons/Pin";
import { PinOff } from "next-vibe-ui/ui/icons/PinOff";
import { Share2 } from "next-vibe-ui/ui/icons/Share2";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import { Tooltip } from "next-vibe-ui/ui/tooltip";
import { TooltipContent } from "next-vibe-ui/ui/tooltip";
import { TooltipProvider } from "next-vibe-ui/ui/tooltip";
import { TooltipTrigger } from "next-vibe-ui/ui/tooltip";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import React, { useState } from "react";

import { chatColors, chatTransitions } from "@/app/[locale]/chat/lib/design-tokens";
import type { UseChatReturn } from "@/app/api/[locale]/agent/chat/hooks/hooks";
import type { ChatThread } from "@/app/api/[locale]/agent/chat/hooks/store";
import { getIconComponent } from "@/app/api/[locale]/agent/chat/model-access/icons";
import { type EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTouchDevice } from "@/hooks/use-touch-device";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { DivMouseEvent } from "@/packages/next-vibe-ui/web/ui/div";
import type { InputKeyboardEvent } from "@/packages/next-vibe-ui/web/ui/input";

import { ThreadPermissionsDialog } from "./thread-permissions-dialog";
import { ThreadShareDialog } from "./thread-share-dialog";

export interface ThreadItemProps {
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
  logger: EndpointLogger;
}

export function ThreadItem({
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
  logger,
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
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

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

  const handleKeyDown = (e: InputKeyboardEvent<"text">): void => {
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

  const handleManagePermissions = (): void => {
    setDropdownOpen(false);
    setPermissionsDialogOpen(true);
  };

  const handleManageSharing = (): void => {
    setDropdownOpen(false);
    setShareDialogOpen(true);
  };

  // Get all folders for the move menu - only folders from the same root folder
  const allFolders = chat
    ? Object.values(chat.folders).filter((folder) => folder.rootFolderId === thread.rootFolderId)
    : [];
  const currentFolderId = thread.folderId;

  // Handle thread click to navigate
  const handleThreadClick = (e: DivMouseEvent): void => {
    // Don't navigate if editing or clicking on buttons
    if (isEditing) {
      return;
    }

    if (e.target.closest?.("button") || e.target.closest?.("input")) {
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
        isActive ? cn(chatColors.sidebar.active, "shadow-sm") : chatColors.sidebar.hover,
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
                  <Div className={cn("text-sm font-medium truncate", compact && "text-xs")}>
                    {thread.title}
                  </Div>
                  {!compact && thread.preview && (
                    <Div className="text-xs text-muted-foreground truncate">{thread.preview}</Div>
                  )}
                </Div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <P className="text-sm">{thread.title}</P>
                {thread.preview && (
                  <P className="text-xs text-muted-foreground mt-1">{thread.preview}</P>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Div>
      )}

      {/* Determine if context menu has any items */}
      {!isEditing &&
        (isHovered || isTouched || isActive || isTouch) &&
        ((): JSX.Element | null => {
          const hasMenuItems =
            thread.canEdit || // Rename, pin, archive, move
            thread.canManagePermissions || // Manage permissions
            thread.canDelete; // Delete

          if (!hasMenuItems) {
            return null;
          }

          return (
            <Div className="flex items-center gap-1">
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
                    onClick={() => {
                      setDropdownOpen(true);
                    }}
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e?.preventDefault()}>
                  {/* Only show Rename if user has permission (computed server-side) */}
                  {thread.canEdit && (
                    <DropdownMenuItem onSelect={handleEdit} className="cursor-pointer">
                      <Edit2 className="h-4 w-4 mr-2" />
                      {t("app.chat.actions.rename")}
                    </DropdownMenuItem>
                  )}

                  {/* Only show Pin/Unpin if user has permission (computed server-side) */}
                  {onPinThread && thread.canEdit && (
                    <DropdownMenuItem onSelect={handlePinToggle} className="cursor-pointer">
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

                  {/* Only show Archive/Unarchive if user has permission (computed server-side) */}
                  {onArchiveThread && thread.canEdit && (
                    <DropdownMenuItem onSelect={handleArchiveToggle} className="cursor-pointer">
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

                  {/* Only show Manage Permissions if user has permission (computed server-side) */}
                  {thread.canManagePermissions && (
                    <DropdownMenuItem onSelect={handleManagePermissions} className="cursor-pointer">
                      <Shield className="h-4 w-4 mr-2" />
                      {t("app.chat.folderList.managePermissions")}
                    </DropdownMenuItem>
                  )}

                  {/* Only show Manage Sharing for threads in SHARED folder */}
                  {thread.rootFolderId === "shared" && thread.canEdit && (
                    <DropdownMenuItem onSelect={handleManageSharing} className="cursor-pointer">
                      <Share2 className="h-4 w-4 mr-2" />
                      {t("app.chat.actions.manageSharing")}
                    </DropdownMenuItem>
                  )}

                  {/* Only show Move to Folder if user has permission (computed server-side) */}
                  {onMoveThread && chat && thread.canEdit && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="cursor-pointer">
                          <FolderInput className="h-4 w-4 mr-2" />
                          {t("app.chat.actions.moveToFolder")}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {/* Option to move to root (no folder) */}
                          {currentFolderId !== null && (
                            <DropdownMenuItem
                              onSelect={() => handleMoveToFolder(null)}
                              className="cursor-pointer"
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
                              const FolderIcon = getIconComponent(folder.icon ?? "folder");
                              return (
                                <DropdownMenuItem
                                  key={folder.id}
                                  onSelect={() => handleMoveToFolder(folder.id)}
                                  disabled={currentFolderId === folder.id}
                                  className="cursor-pointer"
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

                  {/* Only show Delete if user has permission (computed server-side) */}
                  {thread.canDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={handleDeleteClick}
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
          );
        })()}

      {thread.pinned && (
        <Div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("app.chat.threadList.deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("app.chat.threadList.deleteDialog.description", {
                title: thread.title,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("app.chat.common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleConfirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("app.chat.common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permissions Dialog */}
      <ThreadPermissionsDialog
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
        threadId={thread.id}
        threadTitle={thread.title}
        locale={locale}
        logger={logger}
      />

      {/* Share Dialog */}
      <ThreadShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        threadId={thread.id}
        threadTitle={thread.title}
        locale={locale}
      />
    </Div>
  );
}
