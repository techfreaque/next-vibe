/**
 * Custom Widget for Folders List - Complete Sidebar
 * Orchestrator: fetches folders, delegates threads/CRUD to EndpointsPage
 * No useChatContext — fully widget-pattern based
 *
 * Full feature parity with legacy folder-item.tsx + sidebar.tsx:
 * - Root folder tabs
 * - Folder tree with expand/collapse, context menu
 * - Threads delegated to nested EndpointsPage
 * - SidebarFoldersContext for cross-widget folder data sharing
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import {
  Div,
  type DivGenericTarget,
  type DivMouseEvent,
} from "next-vibe-ui/ui/div";
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
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { MessageSquarePlus } from "next-vibe-ui/ui/icons/MessageSquarePlus";
import { MoreVertical } from "next-vibe-ui/ui/icons/MoreVertical";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Input, type InputRefObject } from "next-vibe-ui/ui/input";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import { Span } from "next-vibe-ui/ui/span";
import { Tooltip } from "next-vibe-ui/ui/tooltip";
import { TooltipContent } from "next-vibe-ui/ui/tooltip";
import { TooltipProvider } from "next-vibe-ui/ui/tooltip";
import { TooltipTrigger } from "next-vibe-ui/ui/tooltip";
import { createContext, useContext, useMemo, useRef, useState } from "react";

import {
  getFolderColor,
  getFolderDisplayName,
  getFolderIcon,
  isDefaultFolder,
} from "@/app/[locale]/chat/lib/utils/folder-utils";
import {
  buildFolderUrl,
  getNewChatTranslationKey,
  getNewFolderTranslationKey,
  getRootFolderId,
} from "@/app/[locale]/chat/lib/utils/navigation";
import {
  DEFAULT_FOLDER_CONFIGS,
  DefaultFolderId,
  isDefaultFolderId,
} from "@/app/api/[locale]/agent/chat/config";
import { NEW_MESSAGE_ID } from "@/app/api/[locale]/agent/chat/enum";
import {
  getFolderTourAttr,
  TOUR_DATA_ATTRS,
} from "@/app/api/[locale]/agent/chat/widget/welcome-tour/tour-config";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { useTouchDevice } from "@/hooks/use-touch-device";
import { simpleT } from "@/i18n/core/shared";

import { useWidgetContext } from "../../../../system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { useChatBootContext } from "../../hooks/context";
import type { ChatFolder } from "../../hooks/store";
import { useChatNavigationStore } from "../../hooks/use-chat-navigation-store";
import { scopedTranslation as chatScopedTranslation } from "../../i18n";
import threadsDefinition from "../../threads/definition";
import moveDefinitions from "../[id]/move/definition";
import renameDefinitions from "../[id]/rename/definition";
import createFolderDefinition from "../create/definition";
import type definition from "../definition";
import type { FolderListResponseOutput } from "../definition";
import { FolderAccessModal } from "./folder-access-modal";
import { FolderPermissionsDialog } from "./folder-permissions-dialog";

type FolderFromResponse = FolderListResponseOutput["folders"][number];

// ---------------------------------------------------------------------------
// Sidebar Folders Context — shared between folders and threads widgets
// ---------------------------------------------------------------------------

const SidebarFoldersContext = createContext<FolderFromResponse[]>([]);

/**
 * Hook to access folder data from the sidebar context.
 * Used by threads/widget.tsx for the "move to folder" submenu.
 */
export function useSidebarFolders(): FolderFromResponse[] {
  return useContext(SidebarFoldersContext);
}

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

/* eslint-disable i18next/no-literal-string */
const ROOT_FOLDER_COLOR_MAP: Record<
  string,
  { active: string; hover: string; button: string }
> = {
  sky: {
    active: "bg-sky-500/15 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20",
    hover: "hover:bg-sky-500/10 hover:text-sky-600",
    button:
      "bg-sky-500/15 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 border-sky-500/30",
  },
  teal: {
    active:
      "bg-teal-500/15 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20",
    hover: "hover:bg-teal-500/10 hover:text-teal-600",
    button:
      "bg-teal-500/15 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 border-teal-500/30",
  },
  amber: {
    active:
      "bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20",
    hover: "hover:bg-amber-500/10 hover:text-amber-600",
    button:
      "bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border-amber-500/30",
  },
  purple: {
    active:
      "bg-purple-500/15 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20",
    hover: "hover:bg-purple-500/10 hover:text-purple-600",
    button:
      "bg-purple-500/15 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 border-purple-500/30",
  },
  zinc: {
    active:
      "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-500/20",
    hover: "hover:bg-zinc-500/10 hover:text-zinc-600",
    button:
      "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-500/20 border-zinc-500/30",
  },
  green: {
    active:
      "bg-green-500/15 text-green-700 dark:text-green-300 hover:bg-green-500/20",
    hover: "hover:bg-green-500/10 hover:text-green-600",
    button:
      "bg-green-500/15 text-green-700 dark:text-green-300 hover:bg-green-500/20 border-green-500/30",
  },
};

function getFolderHoverClasses(color: string | null): {
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
/* eslint-enable i18next/no-literal-string */

function getRootFolderColorName(folderId: DefaultFolderId): string {
  return DEFAULT_FOLDER_CONFIGS[folderId]?.color ?? "zinc";
}

// ---------------------------------------------------------------------------
// RootFolderBar
// ---------------------------------------------------------------------------

function RootFolderBar({
  activeRootFolderId,
  onSelectFolder,
  isAuthenticated,
  isAdmin,
}: {
  activeRootFolderId: DefaultFolderId;
  onSelectFolder: (folderId: DefaultFolderId) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}): React.JSX.Element {
  const { locale } = useWidgetContext();
  const { t } = chatScopedTranslation.scopedT(locale);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const rootFolders = useMemo(
    () =>
      Object.values(DEFAULT_FOLDER_CONFIGS)
        .filter((f) => f.id !== DefaultFolderId.CRON || isAdmin)
        .toSorted((a, b) => a.order - b.order),
    [isAdmin],
  );

  const isFolderAccessible = (folderId: string): boolean => {
    if (isAuthenticated) {
      return true;
    }
    return (
      folderId === DefaultFolderId.PUBLIC ||
      folderId === DefaultFolderId.INCOGNITO
    );
  };

  const handleClick = (folderId: string): void => {
    if (!isDefaultFolderId(folderId)) {
      return;
    }
    if (!isFolderAccessible(folderId)) {
      setSelectedFolderId(folderId);
      setModalOpen(true);
      return;
    }
    onSelectFolder(folderId as DefaultFolderId);
  };

  return (
    <>
      <Div className="overflow-x-auto">
        <Div
          className="flex flex-row items-center gap-1 px-3 py-2 min-w-max"
          data-tour={TOUR_DATA_ATTRS.ROOT_FOLDERS}
        >
          {rootFolders.map((folderConfig) => {
            const isActive = folderConfig.id === activeRootFolderId;
            const color = folderConfig.color;
            const colorEntry = ROOT_FOLDER_COLOR_MAP[color];
            const colorClasses = isActive
              ? (colorEntry?.active ?? "bg-primary text-primary-foreground")
              : (colorEntry?.hover ?? "hover:bg-accent");

            return (
              <Div
                key={folderConfig.id}
                onClick={() => handleClick(folderConfig.id)}
                className={cn(
                  "inline-flex items-center justify-center rounded-md h-13 w-13 flex-col gap-1 text-sm font-medium transition-colors no-underline cursor-pointer",
                  colorClasses,
                )}
                data-tour={getFolderTourAttr(folderConfig.id)}
              >
                <Div className="h-5 w-5 flex items-center justify-center shrink-0">
                  <Icon
                    icon={folderConfig.icon}
                    className="h-5 w-5 flex items-center justify-center"
                  />
                </Div>
                <Span className="text-[9px] font-medium leading-none opacity-80">
                  {t(`config.foldersShort.${folderConfig.id}`)}
                </Span>
              </Div>
            );
          })}
        </Div>
      </Div>

      {selectedFolderId && (
        <FolderAccessModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          folderId={selectedFolderId}
          locale={locale}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// FolderRow — single folder with expand/collapse and context menu
// ---------------------------------------------------------------------------

function FolderRow({
  folder,
  allFolders,
  foldersRecord,
  activeFolderId,
  activeRootFolderId,
  depth,
}: {
  folder: FolderFromResponse;
  allFolders: FolderFromResponse[];
  foldersRecord: Record<string, FolderFromResponse>;
  activeFolderId: string | null;
  activeRootFolderId: DefaultFolderId;
  depth: number;
}): React.JSX.Element {
  const isTouch = useTouchDevice();
  const { locale, logger, user } = useWidgetContext();
  const { t } = simpleT(locale);
  const setNavigation = useChatNavigationStore((s) => s.setNavigation);

  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [newSubfolderDialogOpen, setNewSubfolderDialogOpen] = useState(false);

  const isDefault = isDefaultFolder(folder.id);
  const isActive = activeFolderId === folder.id;

  // Determine if folder should be expanded based on URL
  const isExpanded = useMemo(() => {
    if (!activeFolderId) {
      return false;
    }
    // Walk up ancestry chain — if this folder is in the path, expand it
    let currentId: string | null = activeFolderId;
    while (currentId !== null) {
      if (currentId === folder.id) {
        return true;
      }
      const parent: FolderFromResponse | undefined = foldersRecord[currentId];
      currentId = parent?.parentId ?? null;
    }
    return false;
  }, [activeFolderId, folder.id, foldersRecord]);

  // Child folders sorted by sortOrder
  const childFolders = useMemo(
    () =>
      allFolders
        .filter((f) => f.parentId === folder.id)
        .toSorted((a, b) => {
          if (a.sortOrder !== b.sortOrder) {
            return a.sortOrder - b.sortOrder;
          }
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }),
    [allFolders, folder.id],
  );

  // Sibling folders for move up/down
  const { canMoveUp, canMoveDown } = useMemo(() => {
    const siblings = allFolders
      .filter(
        (f) =>
          f.parentId === folder.parentId &&
          f.rootFolderId === folder.rootFolderId,
      )
      .toSorted((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    const idx = siblings.findIndex((f) => f.id === folder.id);
    return {
      canMoveUp: idx > 0,
      canMoveDown: idx < siblings.length - 1,
    };
  }, [allFolders, folder.parentId, folder.rootFolderId, folder.id]);

  // Cast to ChatFolder for utility functions that expect the DB type.
  // FolderFromResponse is structurally identical but Zod infers icon as a
  // literal union while ChatFolder uses the IconKey alias.
  const folderAsChatFolder = folder as ChatFolder;
  const foldersRecordAsChatFolder = foldersRecord as Record<string, ChatFolder>;
  const rootFolderId = getRootFolderId(foldersRecordAsChatFolder, folder.id);
  const rootFolderColor = getFolderColor(
    rootFolderId,
    folder.color ?? undefined,
  );
  const colorClasses = getFolderHoverClasses(rootFolderColor);
  const folderIcon = getFolderIcon(folder.id, folder.icon);
  const folderDisplayName = getFolderDisplayName(folderAsChatFolder, locale);

  const handleFolderClick = (e: DivMouseEvent): void => {
    // Check if click originated from a button to avoid double-handling.
    // On web, target is an HTMLElement but DivMouseEvent types it as DivGenericTarget.
    const target = e.target;
    if (
      "closest" in target &&
      (
        target as DivGenericTarget & { closest: (s: string) => Element | null }
      ).closest("button")
    ) {
      return;
    }
    const subFolderId = folder.id === rootFolderId ? null : folder.id;
    setNavigation({
      activeThreadId: null,
      currentRootFolderId: activeRootFolderId,
      currentSubFolderId: subFolderId,
    });
    const url = buildFolderUrl(locale, rootFolderId, subFolderId);
    window.history.pushState(null, "", url);
  };

  const handleToggleExpanded = (): void => {
    if (isExpanded) {
      setNavigation({
        activeThreadId: null,
        currentRootFolderId: activeRootFolderId,
        currentSubFolderId: folder.parentId ?? null,
      });
      const url = buildFolderUrl(locale, rootFolderId, folder.parentId);
      window.history.pushState(null, "", url);
    } else {
      setNavigation({
        activeThreadId: null,
        currentRootFolderId: activeRootFolderId,
        currentSubFolderId: folder.id,
      });
      const url = buildFolderUrl(locale, rootFolderId, folder.id);
      window.history.pushState(null, "", url);
    }
  };

  const handleCreateThreadInFolder = (): void => {
    setNavigation({
      activeThreadId: NEW_MESSAGE_ID,
      currentRootFolderId: activeRootFolderId,
      currentSubFolderId: folder.id,
    });
    const url = buildFolderUrl(locale, rootFolderId, folder.id);
    window.history.pushState(null, "", `${url}/${NEW_MESSAGE_ID}`);
  };

  const isIncognito = activeRootFolderId === DefaultFolderId.INCOGNITO;

  const mutateFolder = async (updates: {
    name?: string;
    icon?: IconKey | null;
    parentId?: string | null;
    sortOrder?: number;
  }): Promise<void> => {
    const { apiClient } =
      await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");

    if (isIncognito) {
      const { ChatFoldersRepositoryClient } =
        await import("../repository-client");
      await ChatFoldersRepositoryClient.updateFolder(
        folder.id,
        updates,
        logger,
        locale,
      );
    } else {
      const folderDef = await import("../[id]/update/definition");
      await apiClient.mutate(
        folderDef.default.PATCH,
        logger,
        user,
        updates,
        { id: folder.id },
        locale,
      );
    }

    const foldersDef = await import("../definition");
    await apiClient.refetchEndpoint(foldersDef.default.GET, logger);
  };

  const handleMoveUp = (): void => {
    setDropdownOpen(false);
    const siblings = allFolders
      .filter(
        (f) =>
          f.parentId === folder.parentId &&
          f.rootFolderId === folder.rootFolderId,
      )
      .toSorted((a, b) => a.sortOrder - b.sortOrder);
    const idx = siblings.findIndex((f) => f.id === folder.id);
    if (idx > 0) {
      const prevSibling = siblings[idx - 1];
      void mutateFolder({ sortOrder: prevSibling.sortOrder - 1 });
    }
  };

  const handleMoveDown = (): void => {
    setDropdownOpen(false);
    const siblings = allFolders
      .filter(
        (f) =>
          f.parentId === folder.parentId &&
          f.rootFolderId === folder.rootFolderId,
      )
      .toSorted((a, b) => a.sortOrder - b.sortOrder);
    const idx = siblings.findIndex((f) => f.id === folder.id);
    if (idx < siblings.length - 1) {
      const nextSibling = siblings[idx + 1];
      void mutateFolder({ sortOrder: nextSibling.sortOrder + 1 });
    }
  };

  const handleCreateSubfolder = (): void => {
    setDropdownOpen(false);
    setNewSubfolderDialogOpen(true);
  };

  const handleConfirmDelete = (): void => {
    void (async (): Promise<void> => {
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");

      if (isIncognito) {
        const { ChatFoldersRepositoryClient } =
          await import("../repository-client");
        await ChatFoldersRepositoryClient.deleteFolder(
          folder.id,
          logger,
          locale,
        );
      } else {
        const folderDef = await import("../[id]/definition");
        await apiClient.mutate(
          folderDef.default.DELETE,
          logger,
          user,
          undefined,
          { id: folder.id },
          locale,
        );
      }

      const foldersDef = await import("../definition");
      await apiClient.refetchEndpoint(foldersDef.default.GET, logger);
    })();
    setDeleteDialogOpen(false);
  };

  const hasMenuItems =
    folder.canManage ||
    folder.canManagePermissions ||
    (!isDefault && folder.canDelete);

  return (
    <Div>
      {/* Folder header row */}
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
          </Div>

          {/* Action buttons on hover */}
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
                  onClick={handleCreateThreadInFolder}
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
                      onClick={() => setDropdownOpen(true)}
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    {/* Move up/down */}
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

                    {/* Create subfolder */}
                    {folder.canManage && (
                      <DropdownMenuItem
                        onSelect={handleCreateSubfolder}
                        className="cursor-pointer"
                      >
                        <FolderPlus className="h-4 w-4 mr-2" />
                        {t("app.chat.folderList.newSubfolder")}
                      </DropdownMenuItem>
                    )}

                    {/* Manage permissions */}
                    {folder.canManagePermissions && (
                      <DropdownMenuItem
                        onSelect={() => {
                          setDropdownOpen(false);
                          setPermissionsDialogOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        {t("app.chat.folderList.managePermissions")}
                      </DropdownMenuItem>
                    )}

                    {/* Rename */}
                    {!isDefault && folder.canManage && (
                      <DropdownMenuItem
                        onSelect={() => {
                          setDropdownOpen(false);
                          setRenameDialogOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t("app.chat.folderList.renameFolder")}
                      </DropdownMenuItem>
                    )}

                    {/* Move to folder */}
                    {!isDefault && folder.canManage && (
                      <DropdownMenuItem
                        onSelect={() => {
                          setDropdownOpen(false);
                          setMoveDialogOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <FolderInput className="h-4 w-4 mr-2" />
                        {t("app.chat.folderList.moveToFolder")}
                      </DropdownMenuItem>
                    )}

                    {/* Delete */}
                    {!isDefault && folder.canDelete && (
                      <DropdownMenuItem
                        onSelect={() => {
                          setDropdownOpen(false);
                          setDeleteDialogOpen(true);
                        }}
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

      {/* Expanded content: child folders + thread count delegated to EndpointsPage */}
      {isExpanded && (
        <Div>
          {childFolders.map((child) => (
            <FolderRow
              key={child.id}
              folder={child}
              allFolders={allFolders}
              foldersRecord={foldersRecord}
              activeFolderId={activeFolderId}
              activeRootFolderId={activeRootFolderId}
              depth={depth + 1}
            />
          ))}
        </Div>
      )}

      {/* Dialogs */}
      {/* Rename dialog — EndpointsPage on PATCH_RENAME */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("app.chat.renameFolder.title")}</DialogTitle>
          </DialogHeader>
          <EndpointsPage
            endpoint={renameDefinitions}
            locale={locale}
            user={user}
            endpointOptions={{
              update: {
                urlPathParams: { id: folder.id },
                initialState: {
                  name: folderDisplayName,
                  icon: folder.icon ?? "folder",
                },
                formOptions: { persistForm: false },
                mutationOptions: {
                  onSuccess: () => {
                    setRenameDialogOpen(false);
                  },
                },
              },
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Move dialog — EndpointsPage on PATCH_MOVE */}
      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("app.chat.moveFolder.title")}</DialogTitle>
          </DialogHeader>
          <EndpointsPage
            endpoint={moveDefinitions}
            locale={locale}
            user={user}
            endpointOptions={{
              update: {
                urlPathParams: { id: folder.id },
                initialState: { parentId: folder.parentId ?? null },
                formOptions: { persistForm: false },
                mutationOptions: {
                  onSuccess: () => {
                    setMoveDialogOpen(false);
                  },
                },
              },
            }}
          />
        </DialogContent>
      </Dialog>

      {/* New subfolder dialog — EndpointsPage on create/definition.POST */}
      <Dialog
        open={newSubfolderDialogOpen}
        onOpenChange={setNewSubfolderDialogOpen}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("app.chat.folderList.newSubfolder")}</DialogTitle>
          </DialogHeader>
          <EndpointsPage
            endpoint={{ POST: createFolderDefinition.POST }}
            locale={locale}
            user={user}
            endpointOptions={{
              create: {
                initialState: {
                  rootFolderId: folder.rootFolderId,
                  parentId: folder.id,
                },
                formOptions: { persistForm: false },
                mutationOptions: {
                  onSuccess: () => {
                    setNewSubfolderDialogOpen(false);
                  },
                },
              },
            }}
          />
        </DialogContent>
      </Dialog>

      <FolderPermissionsDialog
        user={user}
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
        folderId={folder.id}
        folderName={folderDisplayName}
        locale={locale}
        logger={logger}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("app.chat.folderList.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("app.chat.folderList.deleteDialog.description", {
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

// ---------------------------------------------------------------------------
// FoldersListContainer — main orchestrator widget
// ---------------------------------------------------------------------------

interface CustomWidgetProps {
  field: {
    value: FolderListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

export function FoldersListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const { user, locale, endpointMutations } = useWidgetContext();
  const { initialThreadsData, initialRootFolderId } = useChatBootContext();
  const { t: simpleTranslate } = simpleT(locale);

  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const searchInputRef = useRef<InputRefObject>(null);

  const isLoadingFresh = endpointMutations?.read?.isLoadingFresh ?? false;
  const rootFolderPermissions = field.value?.rootFolderPermissions;
  const folders = useMemo(
    () => field.value?.folders ?? [],
    [field.value?.folders],
  );

  // Build folders record for dialog props
  const foldersRecord = useMemo(() => {
    const record: Record<string, FolderFromResponse> = {};
    for (const f of folders) {
      record[f.id] = f;
    }
    return record;
  }, [folders]);

  const isAuthenticated = useMemo(
    () => user !== undefined && !user.isPublic,
    [user],
  );
  const isAdmin = useMemo(
    () =>
      user !== undefined &&
      !user.isPublic &&
      "roles" in user &&
      (user as { roles?: string[] }).roles?.includes(
        UserPermissionRole.ADMIN,
      ) === true,
    [user],
  );

  // Read navigation state from Zustand store (precise subscriptions)
  // The store is the single source of truth after initial server seed
  const activeRootFolderId = useChatNavigationStore(
    (s) => s.currentRootFolderId,
  );
  const activeFolderId = useChatNavigationStore((s) => s.currentSubFolderId);
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);
  const setNavigation = useChatNavigationStore((s) => s.setNavigation);

  // Root folder color for action buttons
  const rootFolderColor = getRootFolderColorName(activeRootFolderId);
  const buttonColorClass = ROOT_FOLDER_COLOR_MAP[rootFolderColor]?.button ?? "";

  const handleSelectRootFolder = (folderId: DefaultFolderId): void => {
    // For private/shared/incognito, the server page.tsx redirects bare root
    // to /new anyway — navigate directly to avoid a redirect round-trip.
    const needsNewThread =
      folderId === DefaultFolderId.PRIVATE ||
      folderId === DefaultFolderId.SHARED ||
      folderId === DefaultFolderId.INCOGNITO;

    setNavigation({
      currentRootFolderId: folderId,
      currentSubFolderId: null,
      activeThreadId: needsNewThread ? NEW_MESSAGE_ID : null,
    });

    // Use pushState to update URL without triggering server component re-render.
    // The store update above drives all sidebar reactivity.
    const baseUrl = buildFolderUrl(locale, folderId, null);
    const url = needsNewThread ? `${baseUrl}/${NEW_MESSAGE_ID}` : baseUrl;
    window.history.pushState(null, "", url);
  };

  const handleCreateThread = (): void => {
    setNavigation({
      activeThreadId: NEW_MESSAGE_ID,
      currentRootFolderId: activeRootFolderId,
      currentSubFolderId: activeFolderId,
    });
    const url = buildFolderUrl(locale, activeRootFolderId, activeFolderId);
    window.history.pushState(null, "", `${url}/${NEW_MESSAGE_ID}`);
  };

  const isOnNewThreadPage = activeThreadId === NEW_MESSAGE_ID;

  // Only use server-prefetched threads data on initial render for the initial folder+subfolder.
  // Switching subfolder or searching clears initialData (component remounts via key change).
  const threadsInitialData =
    activeRootFolderId === initialRootFolderId &&
    !activeFolderId &&
    !searchQuery
      ? initialThreadsData
      : null;

  // Thread EndpointsPage options
  const threadsEndpointOptions = useMemo(
    () => ({
      read: {
        initialState: {
          rootFolderId: activeRootFolderId,
          subFolderId: activeFolderId ?? undefined,
          search: searchQuery || undefined,
        },
        queryOptions: {
          refetchOnWindowFocus: false,
          staleTime: 30 * 1000,
        },
        ...(threadsInitialData ? { initialData: threadsInitialData } : {}),
      },
    }),
    [activeRootFolderId, activeFolderId, searchQuery, threadsInitialData],
  );

  // Permission-based button visibility
  const dataLoaded = field.value !== null && field.value !== undefined;
  const canCreateThread = dataLoaded
    ? (rootFolderPermissions?.canCreateThread ?? false)
    : true;
  const canCreateFolder = dataLoaded
    ? activeFolderId
      ? (folders.find((f) => f.id === activeFolderId)?.canManage ?? false)
      : (rootFolderPermissions?.canCreateFolder ?? false)
    : true;

  // Top-level folders for the current root folder
  const topLevelFolders = useMemo(
    () =>
      folders
        .filter(
          (f) => f.rootFolderId === activeRootFolderId && f.parentId === null,
        )
        .toSorted((a, b) => {
          if (a.sortOrder !== b.sortOrder) {
            return a.sortOrder - b.sortOrder;
          }
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }),
    [folders, activeRootFolderId],
  );

  return (
    <SidebarFoldersContext.Provider value={folders}>
      <Div className="flex flex-col h-full bg-background">
        {/* Spacer matching the top bar height */}
        <Div className="bg-background flex flex-col gap-0 pt-15" />

        {/* Root Folder Navigation Bar */}
        <RootFolderBar
          activeRootFolderId={activeRootFolderId}
          onSelectFolder={handleSelectRootFolder}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
        />

        {/* Action bar: New chat + New folder */}
        <Div className="flex flex-row items-center gap-1 px-3 pb-2 min-w-max">
          {canCreateThread && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Div className="w-full">
                    <Button
                      onClick={handleCreateThread}
                      disabled={isOnNewThreadPage}
                      className={`w-full h-10 sm:h-9 ${buttonColorClass}`}
                      data-tour={TOUR_DATA_ATTRS.NEW_CHAT_BUTTON}
                    >
                      <MessageSquarePlus className="h-4 w-4 mr-2" />
                      {simpleTranslate(
                        getNewChatTranslationKey(activeRootFolderId),
                      )}
                    </Button>
                  </Div>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          )}

          {canCreateFolder && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 hover:bg-accent"
                    onClick={() => setNewFolderDialogOpen(true)}
                    title={simpleTranslate(
                      getNewFolderTranslationKey(activeRootFolderId),
                    )}
                  >
                    <FolderPlus className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {simpleTranslate(
                    getNewFolderTranslationKey(activeRootFolderId),
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Div>

        {/* Search bar */}
        <Div className="px-3 pb-3 flex flex-row gap-2 border-b border-border">
          <Div className="relative flex-1 flex flex-row">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder={simpleTranslate("app.chat.common.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-10 sm:h-8 text-sm border-none bg-blue-200 dark:bg-blue-950 focus-visible:ring-blue-500"
            />
          </Div>
        </Div>

        {/* Scrollable folder/thread tree */}
        <Div className="flex-1 overflow-hidden px-0">
          <ScrollArea className="h-full">
            <Div className="px-2 py-2">
              {isLoadingFresh ? (
                <Div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </Div>
              ) : (
                <>
                  {/* Folder tree (empty for incognito — no server folders) */}
                  {topLevelFolders.length > 0 && (
                    <Div className="mb-2">
                      {topLevelFolders.map((folder) => (
                        <FolderRow
                          key={folder.id}
                          folder={folder}
                          allFolders={folders}
                          foldersRecord={foldersRecord}
                          activeFolderId={activeFolderId}
                          activeRootFolderId={activeRootFolderId}
                          depth={0}
                        />
                      ))}
                    </Div>
                  )}

                  {/* Threads — useClientRoute routes incognito to route-client.ts */}
                  <EndpointsPage
                    key={`${activeRootFolderId}:${activeFolderId ?? "root"}`}
                    endpoint={threadsDefinition}
                    locale={locale}
                    user={user}
                    forceMethod="GET"
                    endpointOptions={threadsEndpointOptions}
                  />
                </>
              )}
            </Div>
          </ScrollArea>
        </Div>

        {/* New folder dialog — EndpointsPage on create/definition.POST */}
        <Dialog
          open={newFolderDialogOpen}
          onOpenChange={setNewFolderDialogOpen}
        >
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>
                {simpleTranslate("app.chat.newFolder.title")}
              </DialogTitle>
            </DialogHeader>
            <EndpointsPage
              endpoint={{ POST: createFolderDefinition.POST }}
              locale={locale}
              user={user}
              endpointOptions={{
                create: {
                  initialState: {
                    rootFolderId: activeRootFolderId,
                    parentId: activeFolderId ?? undefined,
                  },
                  formOptions: { persistForm: false },
                  mutationOptions: {
                    onSuccess: () => {
                      setNewFolderDialogOpen(false);
                    },
                  },
                },
              }}
            />
          </DialogContent>
        </Dialog>
      </Div>
    </SidebarFoldersContext.Provider>
  );
}
