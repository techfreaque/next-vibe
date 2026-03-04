"use client";

/**
 * FolderContentsWidget — the real renderer for folder-contents endpoint.
 *
 * Renders a flat list of items (folders + threads) for the current level.
 * When a folder is expanded (activeFolderId === item.id), renders a child
 * EndpointsPage for that subfolder level beneath it.
 *
 * Ownership: this widget owns all item-level rendering.
 * FoldersListContainer (folders endpoint) owns only the shell:
 * root-folder tabs, new-chat button, search, and the top-level EndpointsPage call.
 */

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { Div, type DivMouseEvent } from "next-vibe-ui/ui/div";
import { DropdownMenu } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuContent } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuItem } from "next-vibe-ui/ui/dropdown-menu";
import { DropdownMenuTrigger } from "next-vibe-ui/ui/dropdown-menu";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Edit } from "next-vibe-ui/ui/icons/Edit";
import { FolderInput } from "next-vibe-ui/ui/icons/FolderInput";
import { FolderPlus } from "next-vibe-ui/ui/icons/FolderPlus";
import { MessageSquarePlus } from "next-vibe-ui/ui/icons/MessageSquarePlus";
import { MoreVertical } from "next-vibe-ui/ui/icons/MoreVertical";
import { Pin } from "next-vibe-ui/ui/icons/Pin";
import { PinOff } from "next-vibe-ui/ui/icons/PinOff";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import { useMemo, useState } from "react";

import {
  chatColors,
  chatTransitions,
} from "@/app/[locale]/chat/lib/design-tokens";
import {
  getFolderColor,
  getFolderDisplayName,
  getFolderIcon,
  isDefaultFolder,
} from "@/app/[locale]/chat/lib/utils/folder-utils";
import { buildFolderUrl } from "@/app/[locale]/chat/lib/utils/navigation";
import {
  DefaultFolderId,
  isDefaultFolderId,
} from "@/app/api/[locale]/agent/chat/config";
import { NEW_MESSAGE_ID } from "@/app/api/[locale]/agent/chat/enum";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import { useWidgetContext } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { useTouchDevice } from "@/hooks/use-touch-device";

import type { ChatFolder } from "../../db";
import createFolderDefinition from "../../folders/[rootFolderId]/create/definition";
import { scopedTranslation as foldersScopedTranslation } from "../../folders/[rootFolderId]/i18n";
import { FolderPermissionsDialog } from "../../folders/[rootFolderId]/widget/folder-permissions-dialog";
import moveDefinitions from "../../folders/subfolders/[subFolderId]/move/definition";
import renameDefinitions from "../../folders/subfolders/[subFolderId]/rename/definition";
import { useChatNavigationStore } from "../../hooks/use-chat-navigation-store";
import type {
  FolderContentsItem,
  FolderContentsResponseOutput,
} from "./definition";
import definitions from "./definition";

// ---------------------------------------------------------------------------
// Color helpers (copied from folders widget)
// ---------------------------------------------------------------------------

/* eslint-disable i18next/no-literal-string */
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

// ---------------------------------------------------------------------------
// ThreadRow
// ---------------------------------------------------------------------------

function ThreadRow({ item }: { item: FolderContentsItem }): React.JSX.Element {
  const { locale, logger, user } = useWidgetContext();
  const { t } = foldersScopedTranslation.scopedT(locale);
  const isTouch = useTouchDevice();
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title ?? "");
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);
  const setNavigation = useChatNavigationStore((s) => s.setNavigation);
  const isActive = activeThreadId === item.id;
  const isIncognito = item.rootFolderId === DefaultFolderId.INCOGNITO;

  const handleThreadClick = (e: DivMouseEvent): void => {
    if (isEditing) {
      return;
    }
    if (e.target.closest?.("button") || e.target.closest?.("input")) {
      return;
    }
    setNavigation({
      activeThreadId: item.id,
      currentRootFolderId: item.rootFolderId as DefaultFolderId,
      currentSubFolderId: item.folderId ?? null,
    });
    const url = item.folderId
      ? `/${locale}/threads/${item.rootFolderId}/${item.folderId}/${item.id}`
      : `/${locale}/threads/${item.rootFolderId}/${item.id}`;
    window.history.pushState(null, "", url);
  };

  const mutateThread = async (updates: {
    title?: string;
    pinned?: boolean;
    archived?: boolean;
    folderId?: string | null;
  }): Promise<void> => {
    apiClient.updateEndpointData(
      definitions.GET,
      logger,
      (old) => {
        if (!old?.success) {
          return old;
        }
        return success({
          ...old.data,
          items: old.data.items.map((i) =>
            i.id === item.id ? { ...i, ...updates } : i,
          ),
        });
      },
      {
        urlPathParams: { rootFolderId: item.rootFolderId },
        requestData: { subFolderId: item.folderId ?? null },
      },
    );
    if (isIncognito) {
      const { ChatThreadsRepositoryClient } =
        await import("../../threads/repository-client");
      await ChatThreadsRepositoryClient.updateThread(
        item.id,
        updates,
        logger,
        locale,
      );
    } else {
      const threadDef = await import("../../threads/[threadId]/definition");
      await apiClient.mutate(
        threadDef.default.PATCH,
        logger,
        user,
        { ...updates, rootFolderId: item.rootFolderId },
        { threadId: item.id },
        locale,
      );
    }
  };

  const handleSaveEdit = (): void => {
    if (editTitle.trim() && editTitle.trim() !== item.title) {
      void mutateThread({ title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleConfirmDelete = (): void => {
    void (async (): Promise<void> => {
      apiClient.updateEndpointData(
        definitions.GET,
        logger,
        (old) => {
          if (!old?.success) {
            return old;
          }
          return success({
            ...old.data,
            items: old.data.items.filter((i) => i.id !== item.id),
          });
        },
        {
          urlPathParams: { rootFolderId: item.rootFolderId },
          requestData: { subFolderId: item.folderId ?? null },
        },
      );
      if (isIncognito) {
        const { ChatThreadsRepositoryClient } =
          await import("../../threads/repository-client");
        await ChatThreadsRepositoryClient.deleteThread(item.id, logger, locale);
      } else {
        const threadDef = await import("../../threads/[threadId]/definition");
        await apiClient.mutate(
          threadDef.default.DELETE,
          logger,
          user,
          { rootFolderId: item.rootFolderId },
          { threadId: item.id },
          locale,
        );
      }
    })();
    setDeleteDialogOpen(false);
  };

  const hasMenuItems =
    item.canEdit ?? item.canManagePermissions ?? item.canDelete;

  return (
    <>
      <Div
        className={cn(
          "relative flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer",
          chatTransitions.colors,
          isActive
            ? cn(chatColors.sidebar.active, "shadow-sm")
            : chatColors.sidebar.hover,
        )}
        onClick={handleThreadClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          if (!dropdownOpen) {
            setIsHovered(false);
          }
        }}
        onTouchStart={() => setIsTouched(true)}
        onTouchEnd={() => setTimeout(() => setIsTouched(false), 3000)}
      >
        {isEditing ? (
          <Div className="flex-1 min-w-0">
            <Input<"text">
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveEdit();
                } else if (e.key === "Escape") {
                  setEditTitle(item.title ?? "");
                  setIsEditing(false);
                }
              }}
              className="w-full px-2 py-1 text-sm bg-background border border-border rounded"
            />
          </Div>
        ) : (
          <Div className="flex-1 min-w-0">
            <Div className="text-sm font-medium truncate">{item.title}</Div>
            {item.preview && (
              <Div className="text-xs text-muted-foreground truncate">
                {item.preview}
              </Div>
            )}
          </Div>
        )}

        {!isEditing &&
          (isHovered || isTouched || isActive || isTouch) &&
          hasMenuItems && (
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
                {item.canEdit && (
                  <DropdownMenuItem
                    onSelect={() => {
                      setDropdownOpen(false);
                      void mutateThread({ pinned: !item.pinned });
                    }}
                    className="cursor-pointer"
                  >
                    {item.pinned ? (
                      <PinOff className="h-4 w-4 mr-2" />
                    ) : (
                      <Pin className="h-4 w-4 mr-2" />
                    )}
                    {item.pinned
                      ? t("widget.folderList.unpin")
                      : t("widget.folderList.pin")}
                  </DropdownMenuItem>
                )}
                {item.canEdit && (
                  <DropdownMenuItem
                    onSelect={() => {
                      setDropdownOpen(false);
                      setIsEditing(true);
                    }}
                    className="cursor-pointer"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {t("widget.actions.rename")}
                  </DropdownMenuItem>
                )}
                {item.canDelete && (
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
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

        {item.isStreaming && (
          /* eslint-disable i18next/no-literal-string */
          <Div className="flex items-center gap-0.5 shrink-0">
            <Div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]" />
            <Div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]" />
            <Div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]" />
          </Div>
          /* eslint-enable i18next/no-literal-string */
        )}

        {item.pinned && (
          <Div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
        )}
      </Div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("widget.threadList.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("widget.threadList.deleteDialog.description", {
                title: item.title ?? "",
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
    </>
  );
}

// ---------------------------------------------------------------------------
// FolderRow
// ---------------------------------------------------------------------------

function FolderRow({
  item,
  activeRootFolderId,
}: {
  item: FolderContentsItem;
  activeRootFolderId: DefaultFolderId;
}): React.JSX.Element {
  const isTouch = useTouchDevice();
  const { locale, logger, user } = useWidgetContext();
  const { t } = foldersScopedTranslation.scopedT(locale);
  const setNavigation = useChatNavigationStore((s) => s.setNavigation);
  const activeFolderId = useChatNavigationStore((s) => s.currentSubFolderId);

  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [newSubfolderDialogOpen, setNewSubfolderDialogOpen] = useState(false);

  const isExpanded = activeFolderId === item.id;
  const isActive = activeFolderId === item.id;
  const isDefault = isDefaultFolder(item.id);
  const isIncognito = activeRootFolderId === DefaultFolderId.INCOGNITO;

  // For display name + icons: FolderContentsItem has id, name, icon, color fields
  const folderDisplayName = isDefaultFolder(item.id)
    ? getFolderDisplayName(
        { id: item.id, name: item.name ?? "" } as ChatFolder,
        locale,
      )
    : (item.name ?? item.id);
  const folderIcon = getFolderIcon(item.id, item.icon);
  const rootFolderColor = getFolderColor(
    activeRootFolderId,
    item.color ?? undefined,
  );
  const colorClasses = getFolderHoverClasses(rootFolderColor);

  const handleToggleExpanded = (): void => {
    if (isExpanded) {
      // collapse — go up to parent or root, preserve active thread
      setNavigation({
        currentRootFolderId: activeRootFolderId,
        currentSubFolderId: item.parentId ?? null,
      });
      window.history.pushState(
        null,
        "",
        buildFolderUrl(locale, activeRootFolderId, item.parentId),
      );
    } else {
      // expand — set subfolder and navigate to new thread in that folder
      setNavigation({
        currentRootFolderId: activeRootFolderId,
        currentSubFolderId: item.id,
        activeThreadId: NEW_MESSAGE_ID,
      });
      window.history.pushState(
        null,
        "",
        `${buildFolderUrl(locale, activeRootFolderId, item.id)}/${NEW_MESSAGE_ID}`,
      );
    }
  };

  const handleFolderClick = (e: DivMouseEvent): void => {
    const target = e.target;
    if ("closest" in target && (target as Element).closest?.("button")) {
      return;
    }
    handleToggleExpanded();
  };

  const handleCreateThreadInFolder = (): void => {
    setNavigation({
      activeThreadId: NEW_MESSAGE_ID,
      currentRootFolderId: activeRootFolderId,
      currentSubFolderId: item.id,
    });
    window.history.pushState(
      null,
      "",
      `${buildFolderUrl(locale, activeRootFolderId, item.id)}/${NEW_MESSAGE_ID}`,
    );
  };

  const mutateFolder = async (updates: {
    name?: string;
    icon?: IconKey | null;
    parentId?: string | null;
    sortOrder?: number;
    pinned?: boolean;
  }): Promise<void> => {
    const foldersDef = await import("../../folders/[rootFolderId]/definition");
    apiClient.updateEndpointData(
      foldersDef.default.GET,
      logger,
      (old) => {
        if (!old?.success) {
          return old;
        }
        return success({
          ...old.data,
          folders: old.data.folders.map((f) =>
            f.id === item.id ? { ...f, ...updates } : f,
          ),
        });
      },
      { urlPathParams: { rootFolderId: activeRootFolderId } },
    );
    // Also update folder-contents cache so pinned/name changes are reflected immediately
    apiClient.updateEndpointData(
      definitions.GET,
      logger,
      (old) => {
        if (!old?.success) {
          return old;
        }
        return success({
          ...old.data,
          items: old.data.items.map((i) =>
            i.id === item.id ? { ...i, ...updates } : i,
          ),
        });
      },
      {
        urlPathParams: { rootFolderId: activeRootFolderId },
        requestData: { subFolderId: item.parentId ?? null },
      },
    );
    if (isIncognito) {
      const { ChatFoldersRepositoryClient } =
        await import("../../folders/[rootFolderId]/repository-client");
      await ChatFoldersRepositoryClient.updateFolder(
        item.id,
        updates,
        logger,
        locale,
      );
    } else {
      const folderDef =
        await import("../../folders/subfolders/[subFolderId]/update/definition");
      await apiClient.mutate(
        folderDef.default.PATCH,
        logger,
        user,
        updates,
        { subFolderId: item.id },
        locale,
      );
    }
  };

  const handleConfirmDelete = (): void => {
    void (async (): Promise<void> => {
      const foldersDef =
        await import("../../folders/[rootFolderId]/definition");
      apiClient.updateEndpointData(
        foldersDef.default.GET,
        logger,
        (old) => {
          if (!old?.success) {
            return old;
          }
          return success({
            ...old.data,
            folders: old.data.folders.filter((f) => f.id !== item.id),
          });
        },
        { urlPathParams: { rootFolderId: activeRootFolderId } },
      );
      if (isIncognito) {
        const { ChatFoldersRepositoryClient } =
          await import("../../folders/[rootFolderId]/repository-client");
        await ChatFoldersRepositoryClient.deleteFolder(item.id, logger, locale);
      } else {
        const folderDef =
          await import("../../folders/subfolders/[subFolderId]/definition");
        await apiClient.mutate(
          folderDef.default.DELETE,
          logger,
          user,
          undefined,
          { subFolderId: item.id },
          locale,
        );
      }
    })();
    setDeleteDialogOpen(false);
  };

  const hasMenuItems =
    item.canManage ??
    item.canManagePermissions ??
    (!isDefault && item.canDelete);

  return (
    <Div>
      <Div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors min-h-9 cursor-pointer",
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
        <Icon icon={folderIcon} className="h-4 w-4 shrink-0" />
        <Span className="text-sm font-medium truncate flex-1 min-w-0">
          {folderDisplayName}
        </Span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleExpanded}
          className="h-4 w-4 p-0 hover:bg-transparent shrink-0 ml-auto"
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>

        <Div
          style={{
            width: isHovered || isTouch ? "auto" : "0px",
            opacity: isHovered || isTouch ? 1 : 0,
            overflow: "hidden",
          }}
        >
          <Div className="flex items-center gap-1 shrink-0">
            {item.canCreateThread && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCreateThreadInFolder}
                className="h-6 w-6"
                title={t("widget.folderList.newChatInFolder")}
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
                  {!isDefault && item.canManage && (
                    <DropdownMenuItem
                      onSelect={() => {
                        setDropdownOpen(false);
                        void mutateFolder({ pinned: !item.pinned });
                      }}
                      className="cursor-pointer"
                    >
                      {item.pinned ? (
                        <PinOff className="h-4 w-4 mr-2" />
                      ) : (
                        <Pin className="h-4 w-4 mr-2" />
                      )}
                      {item.pinned
                        ? t("widget.folderList.unpin")
                        : t("widget.folderList.pin")}
                    </DropdownMenuItem>
                  )}
                  {item.canManage && (
                    <DropdownMenuItem
                      onSelect={() => {
                        setDropdownOpen(false);
                        setNewSubfolderDialogOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      {t("widget.folderList.newSubfolder")}
                    </DropdownMenuItem>
                  )}
                  {item.canManagePermissions && (
                    <DropdownMenuItem
                      onSelect={() => {
                        setDropdownOpen(false);
                        setPermissionsDialogOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {t("widget.folderList.managePermissions")}
                    </DropdownMenuItem>
                  )}
                  {!isDefault && item.canManage && (
                    <DropdownMenuItem
                      onSelect={() => {
                        setDropdownOpen(false);
                        setRenameDialogOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {t("widget.folderList.renameFolder")}
                    </DropdownMenuItem>
                  )}
                  {!isDefault && item.canManage && (
                    <DropdownMenuItem
                      onSelect={() => {
                        setDropdownOpen(false);
                        setMoveDialogOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      <FolderInput className="h-4 w-4 mr-2" />
                      {t("widget.folderList.moveToFolder")}
                    </DropdownMenuItem>
                  )}
                  {!isDefault && item.canDelete && (
                    <DropdownMenuItem
                      onSelect={() => {
                        setDropdownOpen(false);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-destructive cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t("widget.folderList.deleteFolder")}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </Div>
        </Div>
      </Div>

      {/* Child level via EndpointsPage when expanded */}
      {isExpanded && (
        <Div className="pl-3">
          <EndpointsPage
            endpoint={definitions}
            locale={locale}
            user={user}
            endpointOptions={{
              read: {
                urlPathParams: { rootFolderId: activeRootFolderId },
                initialState: { subFolderId: item.id },
                queryOptions: {
                  refetchOnWindowFocus: false,
                  staleTime: 30_000,
                },
              },
            }}
          />
        </Div>
      )}

      {/* Dialogs */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("widget.renameFolder.title")}</DialogTitle>
          </DialogHeader>
          <EndpointsPage
            endpoint={renameDefinitions}
            locale={locale}
            user={user}
            endpointOptions={{
              update: {
                urlPathParams: { subFolderId: item.id },
                initialState: {
                  name: folderDisplayName,
                  icon: item.icon ?? "folder",
                },
                formOptions: { persistForm: false },
                mutationOptions: {
                  onSuccess: ({ requestData }) => {
                    setRenameDialogOpen(false);
                    void mutateFolder({
                      name: (requestData as { name?: string }).name,
                      icon: (requestData as { icon?: IconKey | null }).icon,
                    });
                  },
                },
              },
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("widget.moveFolder.title")}</DialogTitle>
          </DialogHeader>
          <EndpointsPage
            endpoint={moveDefinitions}
            locale={locale}
            user={user}
            endpointOptions={{
              update: {
                urlPathParams: { subFolderId: item.id },
                initialState: { parentId: item.parentId ?? null },
                formOptions: { persistForm: false },
                mutationOptions: {
                  onSuccess: ({ requestData }) => {
                    setMoveDialogOpen(false);
                    void mutateFolder({
                      parentId: (requestData as { parentId?: string | null })
                        .parentId,
                    });
                  },
                },
              },
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={newSubfolderDialogOpen}
        onOpenChange={setNewSubfolderDialogOpen}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("widget.folderList.newSubfolder")}</DialogTitle>
          </DialogHeader>
          <EndpointsPage
            endpoint={{ POST: createFolderDefinition.POST }}
            locale={locale}
            user={user}
            endpointOptions={{
              create: {
                urlPathParams: { rootFolderId: item.rootFolderId },
                initialState: {
                  parentId: item.id,
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
        folderId={item.id}
        folderName={folderDisplayName}
        locale={locale}
        logger={logger}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("widget.folderList.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("widget.folderList.deleteDialog.description", {
                folderName: folderDisplayName,
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
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Time grouping helpers
// ---------------------------------------------------------------------------

const ITEMS_PER_SECTION = 20;

type TimeGroup = "pinned" | "today" | "lastWeek" | "lastMonth" | "older";

function getTimeGroup(updatedAt: Date | string): Exclude<TimeGroup, "pinned"> {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);
  const updated = new Date(updatedAt);
  if (updated >= todayStart) {
    return "today";
  }
  if (updated >= weekAgo) {
    return "lastWeek";
  }
  if (updated >= monthAgo) {
    return "lastMonth";
  }
  return "older";
}

// ---------------------------------------------------------------------------
// ItemSection — renders a labeled group of items with show-more support
// ---------------------------------------------------------------------------

function ItemSection({
  label,
  items,
  activeRootFolderId,
}: {
  label: string;
  items: FolderContentsItem[];
  activeRootFolderId: DefaultFolderId;
}): React.JSX.Element | null {
  const [showAll, setShowAll] = useState(false);
  const { locale } = useWidgetContext();
  const { t } = foldersScopedTranslation.scopedT(locale);

  if (items.length === 0) {
    return null;
  }

  const visible = showAll ? items : items.slice(0, ITEMS_PER_SECTION);
  const hasMore = items.length > ITEMS_PER_SECTION && !showAll;

  return (
    /* eslint-disable i18next/no-literal-string */
    <Div className="mb-1">
      <Span className="block py-1 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </Span>
      <Div className="flex flex-col gap-0.5 pl-2">
        {visible.map((item) => {
          if (item.type === "folder") {
            return (
              <FolderRow
                key={item.id}
                item={item}
                activeRootFolderId={activeRootFolderId}
              />
            );
          }
          return <ThreadRow key={item.id} item={item} />;
        })}
      </Div>
      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground mt-0.5"
          onClick={() => setShowAll(true)}
        >
          {t("widget.folderList.showMore")} ({items.length - ITEMS_PER_SECTION})
        </Button>
      )}
    </Div>
    /* eslint-enable i18next/no-literal-string */
  );
}

// ---------------------------------------------------------------------------
// FolderContentsWidget — the real renderer
// ---------------------------------------------------------------------------

interface CustomWidgetProps {
  field: {
    value: FolderContentsResponseOutput | null | undefined;
  } & (typeof definitions.GET)["fields"];
}

export function FolderContentsWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const fieldItems = field.value?.items;
  const activeRootFolderId = useChatNavigationStore(
    (s) => s.currentRootFolderId,
  );
  const { locale } = useWidgetContext();
  const { t } = foldersScopedTranslation.scopedT(locale);

  const grouped = useMemo(() => {
    const rawItems: FolderContentsItem[] = fieldItems ?? [];
    const pinned: FolderContentsItem[] = [];
    const today: FolderContentsItem[] = [];
    const lastWeek: FolderContentsItem[] = [];
    const lastMonth: FolderContentsItem[] = [];
    const older: FolderContentsItem[] = [];

    for (const item of rawItems) {
      if (item.pinned) {
        pinned.push(item);
        continue;
      }
      const group = getTimeGroup(item.updatedAt);
      if (group === "today") {
        today.push(item);
      } else if (group === "lastWeek") {
        lastWeek.push(item);
      } else if (group === "lastMonth") {
        lastMonth.push(item);
      } else {
        older.push(item);
      }
    }

    return { pinned, today, lastWeek, lastMonth, older };
  }, [fieldItems]);

  if (!isDefaultFolderId(activeRootFolderId)) {
    return <Div />;
  }

  return (
    <Div>
      <ItemSection
        label={t("widget.folderList.pinned")}
        items={grouped.pinned}
        activeRootFolderId={activeRootFolderId}
      />
      <ItemSection
        label={t("widget.folderList.today")}
        items={grouped.today}
        activeRootFolderId={activeRootFolderId}
      />
      <ItemSection
        label={t("widget.folderList.lastWeek")}
        items={grouped.lastWeek}
        activeRootFolderId={activeRootFolderId}
      />
      <ItemSection
        label={t("widget.folderList.lastMonth")}
        items={grouped.lastMonth}
        activeRootFolderId={activeRootFolderId}
      />
      <ItemSection
        label={t("widget.folderList.older")}
        items={grouped.older}
        activeRootFolderId={activeRootFolderId}
      />
    </Div>
  );
}
