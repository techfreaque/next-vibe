/**
 * Custom Widget for Folders List - Complete Sidebar Replacement
 * Drop-in replacement for the current sidebar with root folder bar, search, and nested tree
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
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { X } from "next-vibe-ui/ui/icons/X";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import { useMemo, useState } from "react";

import { isDefaultFolder } from "@/app/[locale]/chat/lib/utils/folder-utils";
import { buildFolderUrl } from "@/app/[locale]/chat/lib/utils/navigation";
import {
  DEFAULT_FOLDER_CONFIGS,
  DefaultFolderId,
} from "@/app/api/[locale]/agent/chat/config";
import type { ChatThread } from "@/app/api/[locale]/agent/chat/hooks/store";
import { groupThreadsByTime } from "@/app/api/[locale]/agent/chat/threads/_components/thread-area/folder-list-helpers";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { useTouchDevice } from "@/hooks/use-touch-device";
import type { DivMouseEvent } from "@/packages/next-vibe-ui/web/ui/div";

import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetTranslation,
} from "../../../system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type definition from "./definition";
import type { FolderListResponseOutput } from "./definition";

type FolderFromResponse = FolderListResponseOutput["folders"][number];

function toDate(value: string | number | Date): Date {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string") {
    return new Date(value);
  }
  return new Date(value);
}

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: FolderListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

/**
 * Helper to get folder color classes for styling
 */
function getFolderColorClasses(color: string): {
  hover: string;
  active: string;
  border: string;
} {
  const colorMap: Record<
    string,
    { hover: string; active: string; border: string }
  > = {
    sky: {
      hover: "hover:bg-sky-50 dark:hover:bg-sky-950/20",
      active: "bg-sky-100 dark:bg-sky-950/30",
      border: "border-sky-500",
    },
    teal: {
      hover: "hover:bg-teal-50 dark:hover:bg-teal-950/20",
      active: "bg-teal-100 dark:bg-teal-950/30",
      border: "border-teal-500",
    },
    amber: {
      hover: "hover:bg-amber-50 dark:hover:bg-amber-950/20",
      active: "bg-amber-100 dark:bg-amber-950/30",
      border: "border-amber-500",
    },
    purple: {
      hover: "hover:bg-purple-50 dark:hover:bg-purple-950/20",
      active: "bg-purple-100 dark:bg-purple-950/30",
      border: "border-purple-500",
    },
    zinc: {
      hover: "hover:bg-zinc-50 dark:hover:bg-zinc-950/20",
      active: "bg-zinc-100 dark:bg-zinc-950/30",
      border: "border-zinc-500",
    },
  };

  return (
    colorMap[color] || {
      hover: "hover:bg-slate-50 dark:hover:bg-slate-900/20",
      active: "bg-slate-100 dark:bg-slate-900/30",
      border: "border-slate-500",
    }
  );
}

// Removed local shouldFolderBeExpanded - using shared helper instead

/**
 * Individual folder item component (recursive)
 */
interface FolderItemProps {
  folder: FolderFromResponse;
  activeFolderId: string | null;
  activeThreadId: string | null;
  folders: Record<string, FolderFromResponse>;
  threads: Record<string, ChatThread>;
  depth: number;
  onDelete: (folderId: string) => Promise<void>;
  onCreate: (
    name: string,
    rootFolderId: DefaultFolderId,
    parentId: string,
  ) => Promise<void>;
  onUpdate: (
    folderId: string,
    data: {
      name?: string;
      parentId?: string | null;
      sortOrder?: number;
    },
  ) => Promise<void>;
}

function FolderItem({
  folder,
  activeFolderId,
  activeThreadId,
  folders,
  threads,
  depth,
  onDelete,
  onCreate,
  onUpdate,
}: FolderItemProps): React.JSX.Element {
  const router = useRouter();
  const isTouch = useTouchDevice();
  const t = useWidgetTranslation();
  const { locale, logger } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();

  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Simple expansion logic without helpers that expect different types
  const isExpanded = useMemo(() => {
    if (!activeFolderId && !activeThreadId) {
      return false;
    }
    if (folder.id === activeFolderId) {
      return true;
    }

    // Check if folder is in the path to active folder
    let currentId = activeFolderId;
    while (currentId) {
      const current = folders[currentId];
      if (!current) {
        break;
      }
      if (current.parentId === folder.id) {
        return true;
      }
      currentId = current.parentId;
    }
    return false;
  }, [folder.id, activeFolderId, activeThreadId, folders]);
  const isActive = activeFolderId === folder.id;
  const isDefault = isDefaultFolder(folder.id);
  const folderDisplayName = isDefaultFolder(folder.id)
    ? t(DEFAULT_FOLDER_CONFIGS[folder.id].translationKey)
    : folder.name;

  // Count threads in this folder
  const threadsInFolder = useMemo(() => {
    return Object.values(threads)
      .filter((t) => t.folderId === folder.id)
      .toSorted((a, b) => {
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
  }, [threads, folder.id]);

  const threadCount = threadsInFolder.length;

  const groupedThreads = useMemo(() => {
    return groupThreadsByTime(threadsInFolder);
  }, [threadsInFolder]);

  const { rootFolderId, colorClasses } = useMemo(() => {
    const rootId = folder.rootFolderId;
    const color = DEFAULT_FOLDER_CONFIGS[rootId]?.color ?? folder.color ?? null;
    return {
      rootFolderId: rootId,
      colorClasses: getFolderColorClasses(color),
    };
  }, [folder.rootFolderId, folder.color]);

  const folderIcon = useMemo(() => {
    if (isDefaultFolder(folder.id)) {
      return DEFAULT_FOLDER_CONFIGS[folder.id].icon;
    }
    return folder.icon ?? "folder";
  }, [folder.id, folder.icon]);

  const { canMoveUp, canMoveDown } = useMemo(() => {
    const siblings = Object.values(folders)
      .filter(
        (f) =>
          f.parentId === folder.parentId &&
          f.rootFolderId === folder.rootFolderId,
      )
      .toSorted((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return toDate(a.createdAt).getTime() - toDate(b.createdAt).getTime();
      });
    const currentIndex = siblings.findIndex((f) => f.id === folder.id);
    return {
      canMoveUp: currentIndex > 0,
      canMoveDown: currentIndex < siblings.length - 1,
    };
  }, [folders, folder.parentId, folder.rootFolderId, folder.id]);

  const childFolders = useMemo(() => {
    return Object.values(folders)
      .filter((f) => f.parentId === folder.id)
      .toSorted((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return toDate(a.createdAt).getTime() - toDate(b.createdAt).getTime();
      });
  }, [folders, folder.id]);

  const handleToggleExpanded = (): void => {
    if (isExpanded) {
      const parentFolderId = folder.parentId;
      const url = buildFolderUrl(locale, rootFolderId, parentFolderId);
      router.push(url);
    } else {
      const url = buildFolderUrl(locale, rootFolderId, folder.id);
      router.push(url);
    }
  };

  const handleFolderClick = (e: DivMouseEvent): void => {
    if (e.target.closest?.("button")) {
      return;
    }
    const subFolderId = folder.id === rootFolderId ? null : folder.id;
    const url = buildFolderUrl(locale, rootFolderId, subFolderId);
    router.push(url);
  };

  const handleCreateSubfolder = (): void => {
    setDropdownOpen(false);
    const name = window.prompt(t("app.chat.folderList.enterFolderName"));
    if (name) {
      void onCreate(name, folder.rootFolderId, folder.id);
    }
  };

  const handleDelete = (): void => {
    setDropdownOpen(false);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = (): void => {
    void onDelete(folder.id);
    setDeleteDialogOpen(false);
  };

  const handleRenameFolder = async (): Promise<void> => {
    setDropdownOpen(false);
    try {
      const folderDef = await import("./[id]/definition");
      navigate(folderDef.default.PATCH, {
        urlPathParams: { id: folder.id },
        prefillFromGet: true,
        getEndpoint: folderDef.default.GET,
        popNavigationOnSuccess: 1,
      });
    } catch (error) {
      logger.error("Failed to navigate to rename folder", {
        error: String(error),
      });
    }
  };

  const handleMoveToFolder = async (): Promise<void> => {
    setDropdownOpen(false);
    try {
      const folderDef = await import("./[id]/definition");
      navigate(folderDef.default.PATCH, {
        urlPathParams: { id: folder.id },
        prefillFromGet: true,
        getEndpoint: folderDef.default.GET,
        popNavigationOnSuccess: 1,
      });
    } catch (error) {
      logger.error("Failed to navigate to move folder", {
        error: String(error),
      });
    }
  };

  const handleManagePermissions = async (): Promise<void> => {
    setDropdownOpen(false);
    try {
      const permissionsDef = await import("./[id]/permissions/definition");
      navigate(permissionsDef.default.PATCH, {
        urlPathParams: { id: folder.id },
        prefillFromGet: true,
        getEndpoint: permissionsDef.default.GET,
        popNavigationOnSuccess: 1,
      });
    } catch (error) {
      logger.error("Failed to navigate to folder permissions", {
        error: String(error),
      });
    }
  };

  const handleMoveUp = (): void => {
    setDropdownOpen(false);
    const siblings = Object.values(folders)
      .filter(
        (f) =>
          f.parentId === folder.parentId &&
          f.rootFolderId === folder.rootFolderId,
      )
      .toSorted((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return toDate(a.createdAt).getTime() - toDate(b.createdAt).getTime();
      });
    const currentIndex = siblings.findIndex((f) => f.id === folder.id);
    if (currentIndex > 0) {
      const prevFolder = siblings[currentIndex - 1];
      void onUpdate(folder.id, { sortOrder: prevFolder!.sortOrder });
      void onUpdate(prevFolder!.id, { sortOrder: folder.sortOrder });
    }
  };

  const handleMoveDown = (): void => {
    setDropdownOpen(false);
    const siblings = Object.values(folders)
      .filter(
        (f) =>
          f.parentId === folder.parentId &&
          f.rootFolderId === folder.rootFolderId,
      )
      .toSorted((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return toDate(a.createdAt).getTime() - toDate(b.createdAt).getTime();
      });
    const currentIndex = siblings.findIndex((f) => f.id === folder.id);
    if (currentIndex < siblings.length - 1) {
      const nextFolder = siblings[currentIndex + 1];
      void onUpdate(folder.id, { sortOrder: nextFolder!.sortOrder });
      void onUpdate(nextFolder!.id, { sortOrder: folder.sortOrder });
    }
  };

  const hasMenuItems =
    folder.canManage ||
    folder.canManagePermissions ||
    (!isDefault && folder.canDelete);

  return (
    <Div>
      <Div style={{ paddingLeft: `${depth * 12 + 8}px` }}>
        <Div
          className={cn(
            "flex items-center gap-1 px-2 py-1.5 rounded-md transition-colors min-h-9 cursor-pointer",
            colorClasses.hover,
            isActive &&
              `${colorClasses.active} border-l-2 ${colorClasses.border}`,
          )}
          onClick={handleFolderClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
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
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          <Div className="flex items-center gap-2 flex-1 min-w-0">
            <Icon icon={folderIcon} className="h-4 w-4 shrink-0" />
            <Span className="text-sm font-medium truncate">
              {folderDisplayName}
            </Span>
            <Span className="text-xs text-muted-foreground shrink-0">
              ({threadCount})
            </Span>
          </Div>

          <Div
            style={{
              width: isHovered || isTouch ? "auto" : "0px",
              opacity: isHovered || isTouch ? 1 : 0,
              overflow: "hidden",
            }}
          >
            <Div className="flex items-center gap-1 shrink-0">
              {folder.canCreateThread && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    // Handle create thread - will be implemented with chat context
                  }}
                  className="h-6 w-6"
                  title={t("app.chat.folderList.newChatInFolder")}
                >
                  <MessageSquarePlus className="h-3.5 w-3.5" />
                </Button>
              )}

              {hasMenuItems && (
                <DropdownMenu
                  open={dropdownOpen}
                  onOpenChange={(open) => {
                    setDropdownOpen(open);
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
                  <DropdownMenuContent
                    align="end"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
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
                        <DropdownMenuItem
                          onSelect={handleCreateSubfolder}
                          className="cursor-pointer"
                        >
                          <FolderPlus className="h-4 w-4 mr-2" />
                          {t("app.chat.folderList.newSubfolder")}
                        </DropdownMenuItem>
                      </>
                    )}

                    {folder.canManagePermissions && (
                      <DropdownMenuItem
                        onSelect={handleManagePermissions}
                        className="cursor-pointer"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        {t("app.chat.folderList.managePermissions")}
                      </DropdownMenuItem>
                    )}

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
                        onSelect={handleDelete}
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
        </Div>
      </Div>

      {isExpanded && (
        <Div>
          {/* Child folders */}
          {childFolders.map((childFolder) => (
            <FolderItem
              key={childFolder.id}
              folder={childFolder}
              activeFolderId={activeFolderId}
              activeThreadId={activeThreadId}
              folders={folders}
              threads={threads}
              depth={depth + 1}
              onDelete={onDelete}
              onCreate={onCreate}
              onUpdate={onUpdate}
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
                  <Div className="flex flex-col gap-0.5">
                    {groupedThreads.today.map((thread) => (
                      <Div
                        key={thread.id}
                        className="px-2 py-1.5 text-sm hover:bg-accent rounded-md cursor-pointer truncate"
                      >
                        {thread.title ?? t("app.chat.untitled")}
                      </Div>
                    ))}
                  </Div>
                </Div>
              )}

              {groupedThreads.lastWeek.length > 0 && (
                <Div className="mb-2">
                  <Div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t("app.chat.folderList.lastWeek")}
                  </Div>
                  <Div className="flex flex-col gap-0.5">
                    {groupedThreads.lastWeek.map((thread) => (
                      <Div
                        key={thread.id}
                        className="px-2 py-1.5 text-sm hover:bg-accent rounded-md cursor-pointer truncate"
                      >
                        {thread.title ?? t("app.chat.untitled")}
                      </Div>
                    ))}
                  </Div>
                </Div>
              )}

              {groupedThreads.lastMonth.length > 0 && (
                <Div className="mb-2">
                  <Div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t("app.chat.folderList.lastMonth")}
                  </Div>
                  <Div className="flex flex-col gap-0.5">
                    {groupedThreads.lastMonth.map((thread) => (
                      <Div
                        key={thread.id}
                        className="px-2 py-1.5 text-sm hover:bg-accent rounded-md cursor-pointer truncate"
                      >
                        {thread.title ?? t("app.chat.untitled")}
                      </Div>
                    ))}
                  </Div>
                </Div>
              )}
            </Div>
          )}
        </Div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("app.chat.folderList.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {threadCount > 0
                ? t("app.chat.folderList.deleteDialog.descriptionWithThreads", {
                    folderName: folderDisplayName,
                    count: threadCount,
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

/**
 * Root Folder Bar Component
 */
function RootFolderBar({
  activeRootFolderId,
  onSelectFolder,
}: {
  activeRootFolderId: DefaultFolderId;
  onSelectFolder: (folderId: DefaultFolderId) => void;
}): React.JSX.Element {
  const rootFolders = useMemo(() => {
    return Object.values(DEFAULT_FOLDER_CONFIGS).toSorted(
      (a, b) => a.order - b.order,
    );
  }, []);

  return (
    <Div className="overflow-x-auto border-b border-border">
      <Div className="flex flex-row items-center gap-1 px-3 py-2 min-w-max">
        {rootFolders.map((folderConfig) => {
          const isActive = folderConfig.id === activeRootFolderId;
          const folderColor = folderConfig.color;

          const colorClasses = isActive
            ? folderColor === "sky"
              ? "bg-sky-500/15 text-sky-700 dark:text-sky-300"
              : folderColor === "teal"
                ? "bg-teal-500/15 text-teal-700 dark:text-teal-300"
                : folderColor === "amber"
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  : folderColor === "purple"
                    ? "bg-purple-500/15 text-purple-700 dark:text-purple-300"
                    : "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300"
            : "hover:bg-accent";

          return (
            <Button
              key={folderConfig.id}
              variant="ghost"
              size="icon"
              className={cn("h-11 w-11", colorClasses)}
              onClick={() => onSelectFolder(folderConfig.id as DefaultFolderId)}
            >
              <Icon icon={folderConfig.icon} className="h-6 w-6" />
            </Button>
          );
        })}
      </Div>
    </Div>
  );
}

/**
 * Custom container widget for folders list - Complete sidebar replacement
 */
export function FoldersListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const t = useWidgetTranslation();
  const { logger, user, locale } = useWidgetContext();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeRootFolderId, setActiveRootFolderId] = useState<DefaultFolderId>(
    DefaultFolderId.PRIVATE,
  );

  const rawFolders = useMemo(
    () => field.value?.folders ?? [],
    [field.value?.folders],
  );
  const rootFolderPermissions = field.value?.rootFolderPermissions;

  // Convert array to Record for easy lookup
  const foldersMap = useMemo(() => {
    const map: Record<string, FolderFromResponse> = {};
    rawFolders.forEach((f) => {
      map[f.id] = f;
    });
    return map;
  }, [rawFolders]);

  // Empty threads map for now - threads will be added to definition later
  const threadsMap = useMemo<Record<string, ChatThread>>(() => ({}), []);

  // Get root-level folders (no parent) for active root folder
  const rootFolders = useMemo(() => {
    return rawFolders
      .filter(
        (f) => f.parentId === null && f.rootFolderId === activeRootFolderId,
      )
      .toSorted((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
  }, [rawFolders, activeRootFolderId]);

  // Filter folders by search
  const filteredFolders = useMemo(() => {
    if (!searchQuery) {
      return rootFolders;
    }
    return rootFolders.filter((folder) =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [rootFolders, searchQuery]);

  const handleDelete = async (folderId: string): Promise<void> => {
    try {
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
      const folderDef = await import("./[id]/definition");

      await apiClient.mutate(
        folderDef.default.DELETE,
        logger,
        user,
        undefined,
        { id: folderId },
        locale,
      );

      const foldersListDef = await import("./definition");
      await apiClient.refetchEndpoint(foldersListDef.default.GET, logger);
    } catch (error) {
      logger.error("Failed to delete folder", {
        error: String(error),
        folderId,
      });
    }
  };

  const handleCreate = async (
    name: string,
    rootFolderId: DefaultFolderId,
    parentId: string,
  ): Promise<void> => {
    try {
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
      const foldersListDef = await import("./definition");

      await apiClient.mutate(
        foldersListDef.default.POST,
        logger,
        user,
        {
          folder: {
            rootFolderId,
            name,
            parentId: parentId || undefined,
          },
        },
        undefined,
        locale,
      );

      await apiClient.refetchEndpoint(foldersListDef.default.GET, logger);
    } catch (error) {
      logger.error("Failed to create folder", {
        error: String(error),
        name,
        parentId,
      });
    }
  };

  const handleUpdate = async (
    folderId: string,
    data: {
      name?: string;
      parentId?: string | null;
      sortOrder?: number;
    },
  ): Promise<void> => {
    try {
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
      const folderDef = await import("./[id]/definition");

      await apiClient.mutate(
        folderDef.default.PATCH,
        logger,
        user,
        { updates: data },
        { id: folderId },
        locale,
      );

      const foldersListDef = await import("./definition");
      await apiClient.refetchEndpoint(foldersListDef.default.GET, logger);
    } catch (error) {
      logger.error("Failed to update folder", {
        error: String(error),
        folderId,
        data,
      });
    }
  };

  const handleNewThread = (): void => {
    // Navigate to new thread in active root folder
    router.push(`/chat?rootFolder=${activeRootFolderId}`);
  };

  const handleCreateRootFolder = async (): Promise<void> => {
    const name = window.prompt(t("app.chat.folderList.enterFolderName"));
    if (!name) {
      return;
    }
    await handleCreate(name, activeRootFolderId, "");
  };

  return (
    <Div className="flex flex-col h-full">
      {/* Root Folder Bar */}
      <RootFolderBar
        activeRootFolderId={activeRootFolderId}
        onSelectFolder={setActiveRootFolderId}
      />

      {/* Search Bar + New Thread Button */}
      <Div className="flex items-center gap-2 p-3 border-b border-border">
        <Div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("app.chat.search.placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9 h-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </Div>
        <Button
          variant="default"
          size="sm"
          onClick={handleNewThread}
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("app.chat.newThread")}
        </Button>
      </Div>

      {/* Scrollable Folders List */}
      <Div className="flex-1 overflow-y-auto py-2">
        {filteredFolders.length === 0 ? (
          <Div className="flex flex-col items-center justify-center p-8 text-center">
            <Span className="text-muted-foreground mb-4">
              {searchQuery
                ? t("app.chat.folders.noResults")
                : t("app.chat.folders.empty")}
            </Span>
            {!searchQuery && rootFolderPermissions?.canCreateFolder && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateRootFolder}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                {t("app.chat.folders.createFirst")}
              </Button>
            )}
          </Div>
        ) : (
          filteredFolders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              activeFolderId={null}
              activeThreadId={null}
              folders={foldersMap}
              threads={threadsMap}
              depth={0}
              onDelete={handleDelete}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
            />
          ))
        )}
      </Div>
    </Div>
  );
}
