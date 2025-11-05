"use client";

import { cn } from "next-vibe/shared/utils";
import { useRouter } from "next-vibe-ui/hooks";
import { AlertDialog } from "next-vibe-ui//ui/alert-dialog";
import { AlertDialogAction } from "next-vibe-ui//ui/alert-dialog";
import { AlertDialogCancel } from "next-vibe-ui//ui/alert-dialog";
import { AlertDialogContent } from "next-vibe-ui//ui/alert-dialog";
import { AlertDialogDescription } from "next-vibe-ui//ui/alert-dialog";
import { AlertDialogFooter } from "next-vibe-ui//ui/alert-dialog";
import { AlertDialogHeader } from "next-vibe-ui//ui/alert-dialog";
import { AlertDialogTitle } from "next-vibe-ui//ui/alert-dialog";
import { Button } from "next-vibe-ui//ui/button";
import { Div } from "next-vibe-ui//ui/div";
import { DropdownMenu } from "next-vibe-ui//ui/dropdown-menu";
import { DropdownMenuContent } from "next-vibe-ui//ui/dropdown-menu";
import { DropdownMenuItem } from "next-vibe-ui//ui/dropdown-menu";
import { DropdownMenuTrigger } from "next-vibe-ui//ui/dropdown-menu";
import { Span } from "next-vibe-ui//ui/span";
import { ArrowDown } from "next-vibe-ui//ui/icons/ArrowDown";
import { ArrowUp } from "next-vibe-ui//ui/icons/ArrowUp";
import { ChevronDown } from "next-vibe-ui//ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe-ui//ui/icons/ChevronRight";
import { Edit } from "next-vibe-ui//ui/icons/Edit";
import { FolderInput } from "next-vibe-ui//ui/icons/FolderInput";
import { FolderPlus } from "next-vibe-ui//ui/icons/FolderPlus";
import { MessageSquarePlus } from "next-vibe-ui//ui/icons/MessageSquarePlus";
import { MoreVertical } from "next-vibe-ui//ui/icons/MoreVertical";
import { Shield } from "next-vibe-ui//ui/icons/Shield";
import { Trash2 } from "next-vibe-ui//ui/icons/Trash2";
import type { JSX } from "react";
import React, { useMemo } from "react";

import type { UseChatReturn } from "@/app/api/[locale]/v1/core/agent/chat/hooks/hooks";
import type { FolderUpdate } from "@/app/api/[locale]/v1/core/agent/chat/folders/hooks/use-operations";
import {
  getIconComponent,
  type IconValue,
} from "@/app/api/[locale]/v1/core/agent/chat/model-access/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useTouchDevice } from "../../hooks/use-touch-device";
import {
  getFolderColor,
  getFolderDisplayName,
  getFolderIcon,
  isDefaultFolder,
} from "../../lib/utils/folder-utils";
import { buildFolderUrl, getRootFolderId } from "../../lib/utils/navigation";
import type { DefaultFolderId, ChatFolder, ChatThread } from "../../types";
import { FolderPermissionsDialog } from "./folder-permissions-dialog";
import { MoveFolderDialog } from "./move-folder-dialog";
import { RenameFolderDialog } from "./rename-folder-dialog";
import { ThreadList } from "./thread-list";
import { P } from "next-vibe-ui/ui/typography";
import { type EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";

// Time grouping helpers
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const MONTH_MS = 30 * DAY_MS;

/**
 * Get the ancestry chain of a folder (all parent folders up to root)
 * Returns an array of folder IDs from root to the given folder
 */
function getFolderAncestry(
  folderId: string,
  folders: Record<string, ChatFolder>,
): string[] {
  const ancestry: string[] = [];
  let currentId: string | null = folderId;

  while (currentId !== null) {
    ancestry.unshift(currentId);
    const folder = folders[currentId];
    currentId = folder?.parentId ?? null;
  }

  return ancestry;
}

/**
 * Determine if a folder should be expanded based on active thread/folder
 * Pure function - no state, just computation
 */
function shouldFolderBeExpanded(
  folderId: string,
  activeThreadId: string | null,
  activeFolderId: string | null,
  folders: Record<string, ChatFolder>,
  threads: Record<string, ChatThread>,
): boolean {
  // Determine which folder should be the "target" (the one containing the active item)
  let targetFolderId: string | null = null;

  if (activeFolderId) {
    // If there's an active folder, that's our target
    targetFolderId = activeFolderId;
  } else if (activeThreadId) {
    // If there's an active thread, find its folder
    const thread = threads[activeThreadId];
    targetFolderId = thread?.folderId ?? null;
  }

  // If no target, nothing should be expanded
  if (!targetFolderId) {
    return false;
  }

  // Get the ancestry chain of the target folder
  const targetAncestry = getFolderAncestry(targetFolderId, folders);

  // This folder should be expanded if it's in the ancestry chain (but not the target itself)
  // The target folder itself should also be expanded to show its contents
  return targetAncestry.includes(folderId);
}

/**
 * Get Tailwind color classes for folder hover effects based on root folder color
 */
function getFolderColorClasses(color: string | null): {
  hover: string;
  active: string;
  border: string;
} {
  switch (color) {
    case "sky":
      return {
        hover: "hover:bg-sky-500/8",
        active: "bg-sky-500/12",
        border: "border-sky-400",
      };
    case "teal":
      return {
        hover: "hover:bg-teal-500/8",
        active: "bg-teal-500/12",
        border: "border-teal-400",
      };
    case "amber":
      return {
        hover: "hover:bg-amber-500/8",
        active: "bg-amber-500/12",
        border: "border-amber-400",
      };
    case "purple":
      return {
        hover: "hover:bg-purple-500/8",
        active: "bg-purple-500/12",
        border: "border-purple-400",
      };
    case "zinc":
      return {
        hover: "hover:bg-zinc-500/8",
        active: "bg-zinc-500/12",
        border: "border-zinc-400",
      };
    default:
      return {
        hover: "hover:bg-accent/50",
        active: "bg-accent",
        border: "border-primary",
      };
  }
}

function groupThreadsByTime(threads: ChatThread[]): {
  today: ChatThread[];
  lastWeek: ChatThread[];
  lastMonth: ChatThread[];
} {
  const now = Date.now();
  const today: ChatThread[] = [];
  const lastWeek: ChatThread[] = [];
  const lastMonth: ChatThread[] = [];

  threads.forEach((thread) => {
    const age = now - thread.updatedAt.getTime();
    if (age < DAY_MS) {
      today.push(thread);
    } else if (age < WEEK_MS) {
      lastWeek.push(thread);
    } else if (age < MONTH_MS) {
      lastMonth.push(thread);
    }
  });

  return { today, lastWeek, lastMonth };
}

interface FolderListProps {
  chat: UseChatReturn;
  activeThreadId: string | null;
  activeRootFolderId: DefaultFolderId;
  activeFolderId: string | null;
  locale: CountryLanguage;
  onCreateThread: (folderId?: string | null) => void;
  onSelectThread: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
  onMoveThread: (threadId: string, folderId: string | null) => void;
  onPinThread: (threadId: string, pinned: boolean) => void;
  onArchiveThread: (threadId: string, archived: boolean) => void;
  onCreateFolder: (name: string, parentId: string, icon?: string) => void;
  onUpdateFolder: (folderId: string, updates: FolderUpdate) => void;
  onDeleteFolder: (folderId: string, deleteThreads: boolean) => void;
  onReorderFolder: (folderId: string, direction: "up" | "down") => void;
  onMoveFolderToParent: (folderId: string, newParentId: string | null) => void;
  onUpdateThreadTitle: (threadId: string, title: string) => void;
  logger: EndpointLogger;
}

export function FolderList({
  chat,
  activeThreadId,
  activeRootFolderId,
  activeFolderId,
  locale,
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
  logger,
}: FolderListProps): JSX.Element {
  const { t } = simpleT(locale);

  // If no active root folder, show message (shouldn't happen in normal flow)
  // Get direct children (subfolders) of the active root folder
  // Filter folders where parentId is null (direct children of root folder)
  const childFolders = Object.values(chat.folders).filter(
    (folder) =>
      folder.rootFolderId === activeRootFolderId && folder.parentId === null,
  );

  // Get threads in the active root folder (not in any subfolder)
  const childThreads = Object.values(chat.threads).filter(
    (thread) =>
      thread.rootFolderId === activeRootFolderId && thread.folderId === null,
  );

  // Group threads by time
  const groupedThreads = groupThreadsByTime(childThreads);

  return (
    <Div className="space-y-1 py-2">
      {/* Render child folders */}
      {childFolders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          chat={chat}
          activeThreadId={activeThreadId}
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
      ))}

      {/* Render threads directly in the active root folder */}
      {childThreads.length > 0 && (
        <>
          {groupedThreads.today.length > 0 && (
            <Div className="mt-4">
              <Div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                {t("app.chat.folderList.today")}
              </Div>
              <ThreadList
                threads={groupedThreads.today}
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
              />
            </Div>
          )}

          {groupedThreads.lastWeek.length > 0 && (
            <Div className="mt-4">
              <Div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                {t("app.chat.folderList.lastWeek")}
              </Div>
              <ThreadList
                threads={groupedThreads.lastWeek}
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
              />
            </Div>
          )}

          {groupedThreads.lastMonth.length > 0 && (
            <Div className="mt-4">
              <Div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                {t("app.chat.folderList.lastMonth")}
              </Div>
              <ThreadList
                threads={groupedThreads.lastMonth}
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
              />
            </Div>
          )}
        </>
      )}

      {/* Empty state */}
      {childFolders.length === 0 && childThreads.length === 0 && (
        <P className="px-4 py-8 text-center text-sm text-muted-foreground">
          {t("app.chat.folderList.emptyFolder")}
        </P>
      )}
    </Div>
  );
}

interface FolderItemProps {
  folder: ChatFolder;
  chat: UseChatReturn;
  activeThreadId: string | null;
  activeFolderId: string | null;
  locale: CountryLanguage;
  onCreateThread: (folderId?: string | null) => void;
  onSelectThread: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
  onMoveThread: (threadId: string, folderId: string | null) => void;
  onPinThread: (threadId: string, pinned: boolean) => void;
  onArchiveThread: (threadId: string, archived: boolean) => void;
  onCreateFolder: (name: string, parentId: string, icon?: string) => void;
  onUpdateFolder: (folderId: string, updates: FolderUpdate) => void;
  onDeleteFolder: (folderId: string, deleteThreads: boolean) => void;
  onReorderFolder: (folderId: string, direction: "up" | "down") => void;
  onMoveFolderToParent: (folderId: string, newParentId: string | null) => void;
  onUpdateThreadTitle: (threadId: string, title: string) => void;
  depth?: number;
  logger: EndpointLogger;
}

function FolderItem({
  folder,
  chat,
  activeThreadId,
  activeFolderId,
  locale,
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
  depth = 0,
  logger,
}: FolderItemProps): JSX.Element {
  const router = useRouter();
  const isTouch = useTouchDevice();
  const [isHovered, setIsHovered] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] =
    React.useState(false);

  // Compute if this folder should be expanded (pure computation, no state)
  const isExpanded = shouldFolderBeExpanded(
    folder.id,
    activeThreadId,
    activeFolderId,
    chat.folders,
    chat.threads,
  );

  const threadsInFolder = useMemo(() => {
    return Object.values(chat.threads)
      .filter((t) => t.folderId === folder.id)
      .toSorted((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [chat.threads, folder.id]);

  const groupedThreads = useMemo(() => {
    return groupThreadsByTime(threadsInFolder);
  }, [threadsInFolder]);

  const { t } = simpleT(locale);
  const folderDisplayName = getFolderDisplayName(folder, locale);
  const isDefault = isDefaultFolder(folder.id);

  // Count threads in this folder (not subfolders)
  const threadCount = threadsInFolder.length;

  // Get root folder ID and color for styling
  const rootFolderId = getRootFolderId(chat.folders, folder.id);
  const rootFolderColor = getFolderColor(
    rootFolderId,
    folder.color || undefined,
  );
  const colorClasses = getFolderColorClasses(rootFolderColor);

  const handleDeleteClick = (): void => {
    // Cannot delete default folders
    if (isDefault) {
      return;
    }

    setDropdownOpen(false);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = (): void => {
    onDeleteFolder(folder.id, false);
    setDeleteDialogOpen(false);
  };

  const handleCreateSubfolder = (): void => {
    setDropdownOpen(false);
    const name = window.prompt(t("app.chat.folderList.enterFolderName"));
    if (name) {
      onCreateFolder(name, folder.id);
    }
  };

  const handleToggleExpanded = (e: React.MouseEvent): void => {
    e.stopPropagation(); // Prevent folder navigation when clicking chevron

    // If currently expanded (this folder is in the active path), collapse by navigating to parent
    if (isExpanded) {
      // Navigate to parent folder to "collapse" this folder
      const rootFolderId = getRootFolderId(chat.folders, folder.id);
      const parentFolderId = folder.parentId;
      const url = buildFolderUrl(locale, rootFolderId, parentFolderId);
      router.push(url);
    } else {
      // If not expanded, expand by navigating to this folder
      const rootFolderId = getRootFolderId(chat.folders, folder.id);
      const url = buildFolderUrl(locale, rootFolderId, folder.id);
      router.push(url);
    }
  };

  const handleCreateThreadInFolder = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onCreateThread(folder.id);
  };

  const handleRenameFolder = (): void => {
    setDropdownOpen(false);
    setRenameDialogOpen(true);
  };

  const handleSaveRename = (name: string, icon: IconValue | null): void => {
    onUpdateFolder(folder.id, { name, icon });
  };

  const handleMoveUp = (): void => {
    setDropdownOpen(false);
    onReorderFolder(folder.id, "up");
  };

  const handleMoveDown = (): void => {
    setDropdownOpen(false);
    onReorderFolder(folder.id, "down");
  };

  const handleMoveToFolder = (): void => {
    setDropdownOpen(false);
    setMoveDialogOpen(true);
  };

  const handleSaveMove = (targetFolderId: string | null): void => {
    onMoveFolderToParent(folder.id, targetFolderId);
  };

  const handleManagePermissions = (): void => {
    setDropdownOpen(false);
    setPermissionsDialogOpen(true);
  };

  // Determine if move up/down should be disabled
  // Get sibling folders (folders with same parent)
  const siblingFolders = Object.values(chat.folders)
    .filter(
      (f) =>
        f.parentId === folder.parentId &&
        f.rootFolderId === folder.rootFolderId,
    )
    .toSorted((a, b) => a.sortOrder - b.sortOrder);
  const currentIndex = siblingFolders.findIndex((f) => f.id === folder.id);
  const canMoveUp = currentIndex > 0;
  const canMoveDown = currentIndex < siblingFolders.length - 1;

  const folderIcon = getFolderIcon(folder.id, folder.icon);
  const FolderIcon = getIconComponent(folderIcon);
  const isActive = activeFolderId === folder.id;

  // Handle folder click to navigate
  const handleFolderClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    // Don't navigate if clicking on buttons
    if (e.target instanceof HTMLElement && e.target.closest("button")) {
      return;
    }

    // If this folder IS the root folder, don't pass it as subfolder
    const subFolderId = folder.id === rootFolderId ? null : folder.id;
    const url = buildFolderUrl(locale, rootFolderId, subFolderId);
    router.push(url);
  };

  const folderHeaderContent = (
    <Div
      className={cn(
        "flex items-center gap-1 px-2 py-1.5 rounded-md transition-colors min-h-[36px] cursor-pointer",
        colorClasses.hover,
        isActive && `${colorClasses.active} border-l-2 ${colorClasses.border}`,
      )}
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
      onClick={handleFolderClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        // Don't remove hover state if dropdown is open
        if (!dropdownOpen) {
          setIsHovered(false);
        }
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleExpanded}
        className="h-5 w-5 p-0 hover:bg-transparent flex-shrink-0"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      <Div className="flex items-center gap-2 flex-1 min-w-0">
        <FolderIcon className="h-4 w-4 flex-shrink-0" />
        <Span className="text-sm font-medium truncate">
          {folderDisplayName}
        </Span>
        {/* eslint-disable i18next/no-literal-string -- Formatting characters for count display */}
        <Span className="text-xs text-muted-foreground flex-shrink-0">
          ({threadCount})
        </Span>
        {/* eslint-enable i18next/no-literal-string */}
      </Div>

      {/* Determine if context menu has any items */}
      {((): JSX.Element => {
        const hasMenuItems =
          folder.canManage || // Move up/down, create subfolder, rename, move to folder
          folder.canManagePermissions || // Manage permissions
          (!isDefault && folder.canDelete); // Delete folder

        return (
          <Div
            className="flex items-center gap-1 shrink-0"
            style={{
              width: isHovered || isTouch ? "auto" : "0px",
              opacity: isHovered || isTouch ? 1 : 0,
              overflow: "hidden",
            }}
            onClick={(e): void => e.stopPropagation()}
          >
            {/* Only show "New chat in folder" button if user has permission */}
            {folder.canCreateThread && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCreateThreadInFolder}
                className="h-6 w-6"
                title={t("app.chat.folderList.newChatInFolder")}
              >
                <MessageSquarePlus className="h-3.5 w-3.5" />
              </Button>
            )}

            {/* Only show context menu button if there are items to show */}
            {hasMenuItems && (
              <DropdownMenu
                open={dropdownOpen}
                onOpenChange={(open) => {
                  setDropdownOpen(open);
                  // Reset hover state when dropdown closes
                  if (!open) {
                    setIsHovered(false);
                  }
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
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
                  {/* Only show move up/down if user has manage permission */}
                  {folder.canManage && (
                    <>
                      <DropdownMenuItem
                        onSelect={handleMoveUp}
                        disabled={!canMoveUp}
                        className="cursor-pointer"
                      >
                        <ArrowUp className="h-4 w-4 mr-2" />
                        {t("app.chat.folderList.moveUp")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={handleMoveDown}
                        disabled={!canMoveDown}
                        className="cursor-pointer"
                      >
                        <ArrowDown className="h-4 w-4 mr-2" />
                        {t("app.chat.folderList.moveDown")}
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Only show Create Subfolder if user has permission (computed server-side) */}
                  {folder.canManage && (
                    <DropdownMenuItem
                      onSelect={handleCreateSubfolder}
                      className="cursor-pointer"
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      {t("app.chat.folderList.newSubfolder")}
                    </DropdownMenuItem>
                  )}

                  {/* Only show Manage Permissions if user has permission (computed server-side) */}
                  {folder.canManagePermissions && (
                    <DropdownMenuItem
                      onSelect={handleManagePermissions}
                      className="cursor-pointer"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {t("app.chat.folderList.managePermissions")}
                    </DropdownMenuItem>
                  )}

                  {/* Only custom folders can be renamed, moved, and deleted - check permissions */}
                  {!isDefault && folder.canManage && (
                    <>
                      <DropdownMenuItem
                        onSelect={handleRenameFolder}
                        className="cursor-pointer"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t("app.chat.folderList.renameFolder")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={handleMoveToFolder}
                        className="cursor-pointer"
                      >
                        <FolderInput className="h-4 w-4 mr-2" />
                        {t("app.chat.folderList.moveToFolder")}
                      </DropdownMenuItem>
                    </>
                  )}
                  {!isDefault && folder.canDelete && (
                    <DropdownMenuItem
                      onSelect={handleDeleteClick}
                      className="text-destructive cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t("app.chat.folderList.deleteFolder")}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </Div>
        );
      })()}
    </Div>
  );

  return (
    <Div>
      {folderHeaderContent}

      {isExpanded && (
        <Div>
          {/* Child folders */}
          {Object.values(chat.folders)
            .filter((f) => f.parentId === folder.id)
            .toSorted((a, b) => a.sortOrder - b.sortOrder)
            .map((childFolder) => (
              <FolderItem
                key={childFolder.id}
                folder={childFolder}
                chat={chat}
                activeThreadId={activeThreadId}
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
                depth={depth + 1}
                logger={logger}
              />
            ))}

          {/* Threads in folder - grouped by time */}
          {threadsInFolder.length > 0 && (
            <Div style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}>
              {groupedThreads.today.length > 0 && (
                <Div className="mb-2">
                  <Div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t("app.chat.folderList.today")}
                  </Div>
                  <ThreadList
                    threads={groupedThreads.today}
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
                  />
                </Div>
              )}

              {groupedThreads.lastWeek.length > 0 && (
                <Div className="mb-2">
                  <Div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t("app.chat.folderList.lastWeek")}
                  </Div>
                  <ThreadList
                    threads={groupedThreads.lastWeek}
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
                  />
                </Div>
              )}

              {groupedThreads.lastMonth.length > 0 && (
                <Div className="mb-2">
                  <Div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t("app.chat.folderList.lastMonth")}
                  </Div>
                  <ThreadList
                    threads={groupedThreads.lastMonth}
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
                  />
                </Div>
              )}
            </Div>
          )}
        </Div>
      )}

      <RenameFolderDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        folderName={folderDisplayName}
        folderIcon={folder.icon || "folder"}
        onSave={handleSaveRename}
        locale={locale}
      />

      <MoveFolderDialog
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        folder={folder}
        folders={chat.folders}
        onMove={handleSaveMove}
        locale={locale}
      />

      <FolderPermissionsDialog
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
        folderId={folder.id}
        folderName={folderDisplayName}
        locale={locale}
        logger={logger}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("app.chat.folderList.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {threadsInFolder.length > 0
                ? t("app.chat.folderList.deleteDialog.descriptionWithThreads", {
                    folderName: folderDisplayName,
                    count: threadsInFolder.length,
                  })
                : t("app.chat.folderList.deleteDialog.description", {
                    folderName: folderDisplayName,
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
