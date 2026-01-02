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
import { DropdownMenuTrigger } from "next-vibe-ui/ui/dropdown-menu";
import { ArrowDown } from "next-vibe-ui/ui/icons/ArrowDown";
import { ArrowUp } from "next-vibe-ui/ui/icons/ArrowUp";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Edit } from "next-vibe-ui/ui/icons/Edit";
import { FolderInput } from "next-vibe-ui/ui/icons/FolderInput";
import { FolderPlus } from "next-vibe-ui/ui/icons/FolderPlus";
import { MessageSquarePlus } from "next-vibe-ui/ui/icons/MessageSquarePlus";
import { MoreVertical } from "next-vibe-ui/ui/icons/MoreVertical";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import React, { useMemo } from "react";

import {
  getFolderColor,
  getFolderDisplayName,
  getFolderIcon,
  isDefaultFolder,
} from "@/app/[locale]/chat/lib/utils/folder-utils";
import { buildFolderUrl, getRootFolderId } from "@/app/[locale]/chat/lib/utils/navigation";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { ChatFolder } from "@/app/api/[locale]/agent/chat/hooks/store";
import { getIconComponent, type IconValue } from "@/app/api/[locale]/agent/chat/model-access/icons";
import { type EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTouchDevice } from "@/hooks/use-touch-device";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { DivMouseEvent } from "@/packages/next-vibe-ui/web/ui/div";

import {
  getFolderColorClasses,
  groupThreadsByTime,
  shouldFolderBeExpanded,
} from "./folder-list-helpers";
import { FolderPermissionsDialog } from "./folder-permissions-dialog";
import { MoveFolderDialog } from "./move-folder-dialog";
import { RenameFolderDialog } from "./rename-folder-dialog";
import { ThreadList } from "./thread-list";

interface FolderItemProps {
  folder: ChatFolder;
  activeFolderId: string | null;
  locale: CountryLanguage;
  depth?: number;
  logger: EndpointLogger;
}

export function FolderItem({
  folder,
  activeFolderId,
  locale,
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
  const [permissionsDialogOpen, setPermissionsDialogOpen] = React.useState(false);

  // Get data and callbacks from context
  const {
    activeThreadId,
    folders,
    threads,
    handleCreateThreadInFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    handleReorderFolder,
    handleMoveFolderToParent,
  } = useChatContext();

  // Compute if this folder should be expanded (pure computation, no state)
  const isExpanded = shouldFolderBeExpanded(
    folder.id,
    activeThreadId,
    activeFolderId,
    folders,
    threads,
  );

  const threadsInFolder = useMemo(() => {
    return Object.values(threads)
      .filter((t) => t.folderId === folder.id)
      .toSorted((a, b) => {
        // Pinned threads come first
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }
        // Then sort by updatedAt (newest first)
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      });
  }, [threads, folder.id]);

  const groupedThreads = useMemo(() => {
    return groupThreadsByTime(threadsInFolder);
  }, [threadsInFolder]);

  const { t } = simpleT(locale);
  const folderDisplayName = getFolderDisplayName(folder, locale);
  const isDefault = isDefaultFolder(folder.id);

  // Count threads in this folder (not subfolders)
  const threadCount = threadsInFolder.length;

  // Memoize root folder ID, color and color classes
  const { rootFolderId, colorClasses } = useMemo(() => {
    const rootId = getRootFolderId(folders, folder.id);
    const rootFolderColor = getFolderColor(rootId, folder.color || undefined);
    return {
      rootFolderId: rootId,
      colorClasses: getFolderColorClasses(rootFolderColor),
    };
  }, [folders, folder.id, folder.color]);

  const handleDeleteClick = (): void => {
    // Cannot delete default folders
    if (isDefault) {
      return;
    }

    setDropdownOpen(false);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = (): void => {
    void deleteFolder(folder.id);
    setDeleteDialogOpen(false);
  };

  const handleCreateSubfolder = (): void => {
    setDropdownOpen(false);
    const name = window.prompt(t("app.chat.folderList.enterFolderName"));
    if (name) {
      void createFolder(name, folder.rootFolderId, folder.id);
    }
  };

  const handleToggleExpanded = (): void => {
    // If currently expanded (this folder is in the active path), collapse by navigating to parent
    if (isExpanded) {
      // Navigate to parent folder to "collapse" this folder
      const rootFolderId = getRootFolderId(folders, folder.id);
      const parentFolderId = folder.parentId;
      const url = buildFolderUrl(locale, rootFolderId, parentFolderId);
      router.push(url);
    } else {
      // If not expanded, expand by navigating to this folder
      const rootFolderId = getRootFolderId(folders, folder.id);
      const url = buildFolderUrl(locale, rootFolderId, folder.id);
      router.push(url);
    }
  };

  const handleCreateThreadInFolderClick = (): void => {
    handleCreateThreadInFolder(folder.id);
  };

  const handleRenameFolder = (): void => {
    setDropdownOpen(false);
    setRenameDialogOpen(true);
  };

  const handleSaveRename = (name: string, icon: IconValue | null): void => {
    void updateFolder(folder.id, { name, icon });
  };

  const handleMoveUp = (): void => {
    setDropdownOpen(false);
    handleReorderFolder(folder.id, "up");
  };

  const handleMoveDown = (): void => {
    setDropdownOpen(false);
    handleReorderFolder(folder.id, "down");
  };

  const handleMoveToFolder = (): void => {
    setDropdownOpen(false);
    setMoveDialogOpen(true);
  };

  const handleSaveMove = (targetFolderId: string | null): void => {
    handleMoveFolderToParent(folder.id, targetFolderId);
  };

  const handleManagePermissions = (): void => {
    setDropdownOpen(false);
    setPermissionsDialogOpen(true);
  };

  // Memoize move capabilities based on sibling folders
  const { canMoveUp, canMoveDown } = useMemo(() => {
    const siblings = Object.values(folders)
      .filter((f) => f.parentId === folder.parentId && f.rootFolderId === folder.rootFolderId)
      .toSorted((a, b) => {
        // First sort by sortOrder
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        // If sortOrder is the same, use createdAt as tiebreaker for stable ordering
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
    const currentIndex = siblings.findIndex((f) => f.id === folder.id);
    return {
      canMoveUp: currentIndex > 0,
      canMoveDown: currentIndex < siblings.length - 1,
    };
  }, [folders, folder.parentId, folder.rootFolderId, folder.id]);

  // Memoize folder icon component
  const FolderIcon = useMemo(() => {
    const folderIcon = getFolderIcon(folder.id, folder.icon);
    return getIconComponent(folderIcon);
  }, [folder.id, folder.icon]);

  const isActive = activeFolderId === folder.id;

  // Handle folder click to navigate
  const handleFolderClick = (e: DivMouseEvent): void => {
    // Don't navigate if clicking on buttons
    if (e.target.closest?.("button")) {
      return;
    }

    // If this folder IS the root folder, don't pass it as subfolder
    const subFolderId = folder.id === rootFolderId ? null : folder.id;
    const url = buildFolderUrl(locale, rootFolderId, subFolderId);
    router.push(url);
  };

  const folderHeaderContent = (
    <Div style={{ paddingLeft: `${depth * 12 + 8}px` }}>
      <Div
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 rounded-md transition-colors min-h-9 cursor-pointer",
          colorClasses.hover,
          isActive && `${colorClasses.active} border-l-2 ${colorClasses.border}`,
        )}
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
          className="h-5 w-5 p-0 hover:bg-transparent shrink-0"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        <Div className="flex items-center gap-2 flex-1 min-w-0">
          <FolderIcon className="h-4 w-4 shrink-0" />
          <Span className="text-sm font-medium truncate">{folderDisplayName}</Span>
          {/* eslint-disable i18next/no-literal-string -- Formatting characters for count display */}
          <Span className="text-xs text-muted-foreground shrink-0">({threadCount})</Span>
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
              style={{
                width: isHovered || isTouch ? "auto" : "0px",
                opacity: isHovered || isTouch ? 1 : 0,
                overflow: "hidden",
              }}
            >
              <Div className="flex items-center gap-1 shrink-0">
                {/* Only show "New chat in folder" button if user has permission */}
                {folder.canCreateThread && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCreateThreadInFolderClick}
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
                        onClick={() => {
                          setDropdownOpen(true);
                        }}
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
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
            </Div>
          );
        })()}
      </Div>
    </Div>
  );

  return (
    <Div>
      {folderHeaderContent}

      {isExpanded && (
        <Div>
          {/* Child folders */}
          {Object.values(folders)
            .filter((f) => f.parentId === folder.id)
            .toSorted((a, b) => {
              // First sort by sortOrder
              if (a.sortOrder !== b.sortOrder) {
                return a.sortOrder - b.sortOrder;
              }
              // If sortOrder is the same, use createdAt as tiebreaker for stable ordering
              return a.createdAt.getTime() - b.createdAt.getTime();
            })
            .map((childFolder) => (
              <FolderItem
                key={childFolder.id}
                folder={childFolder}
                activeFolderId={activeFolderId}
                locale={locale}
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
                  <ThreadList threads={groupedThreads.today} locale={locale} logger={logger} />
                </Div>
              )}

              {groupedThreads.lastWeek.length > 0 && (
                <Div className="mb-2">
                  <Div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t("app.chat.folderList.lastWeek")}
                  </Div>
                  <ThreadList threads={groupedThreads.lastWeek} locale={locale} logger={logger} />
                </Div>
              )}

              {groupedThreads.lastMonth.length > 0 && (
                <Div className="mb-2">
                  <Div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t("app.chat.folderList.lastMonth")}
                  </Div>
                  <ThreadList threads={groupedThreads.lastMonth} locale={locale} logger={logger} />
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
        folders={folders}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("app.chat.folderList.deleteDialog.title")}</AlertDialogTitle>
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
