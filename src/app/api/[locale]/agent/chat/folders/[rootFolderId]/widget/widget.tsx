/**
 * Custom Widget for Folders List - Shell Only
 * Owns: root-folder tabs, new-chat/folder buttons, search input.
 * Content area is rendered via EndpointsPage (folder-contents endpoint).
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { FolderPlus } from "next-vibe-ui/ui/icons/FolderPlus";
import { MessageSquarePlus } from "next-vibe-ui/ui/icons/MessageSquarePlus";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Input, type InputRefObject } from "next-vibe-ui/ui/input";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import { Span } from "next-vibe-ui/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import { cn } from "next-vibe/shared/utils";
import { useMemo, useRef, useState } from "react";

import {
  getFolderTourAttr,
  TOUR_DATA_ATTRS,
} from "@/app/[locale]/threads/[...path]/_components/welcome-tour/tour-attrs";
import {
  DEFAULT_FOLDER_CONFIGS,
  DefaultFolderId,
  isDefaultFolderId,
} from "@/app/api/[locale]/agent/chat/config";
import { NEW_MESSAGE_ID } from "@/app/api/[locale]/agent/chat/enum";
import folderContentsDefinition from "@/app/api/[locale]/agent/chat/folder-contents/[rootFolderId]/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import {
  useWidgetContext,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { useChatBootContext } from "../../../hooks/context";
import { useChatNavigationStore } from "../../../hooks/use-chat-navigation-store";
import { ThreadsList } from "../../../threads/widget/widget";
import createFolderDefinition from "../create/definition";
import type definition from "../definition";
import { scopedTranslation } from "../i18n";
import { FolderAccessModal } from "./folder-access-modal";

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
    active: "bg-green-500/15 text-success-foreground hover:bg-green-500/20",
    hover: "hover:bg-green-500/10 hover:text-green-600",
    button:
      "bg-green-500/15 text-success-foreground hover:bg-green-500/20 border-green-500/30",
  },
};
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
  const { t } = scopedTranslation.scopedT(locale);

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
                  {t(`widget.config.foldersShort.${folderConfig.id}`)}
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
// FoldersListContainer - shell widget
// ---------------------------------------------------------------------------

export function FoldersListContainer(): React.JSX.Element {
  const field = useWidgetValue<typeof definition.GET>();
  const { user, locale } = useWidgetContext();
  const { initialFolderContentsData, initialRootFolderId } =
    useChatBootContext();
  const { t } = scopedTranslation.scopedT(locale);

  const getNewChatLabel = (rootFolderId: DefaultFolderId): string => {
    switch (rootFolderId) {
      case DefaultFolderId.PRIVATE:
        return t("widget.common.newPrivateChat");
      case DefaultFolderId.SHARED:
        return t("widget.common.newSharedChat");
      case DefaultFolderId.PUBLIC:
        return t("widget.common.newPublicChat");
      case DefaultFolderId.INCOGNITO:
        return t("widget.common.newIncognitoChat");
      default:
        return t("widget.common.newChat");
    }
  };

  const getNewFolderLabel = (rootFolderId: DefaultFolderId): string => {
    switch (rootFolderId) {
      case DefaultFolderId.PRIVATE:
        return t("widget.common.newPrivateFolder");
      case DefaultFolderId.SHARED:
        return t("widget.common.newSharedFolder");
      case DefaultFolderId.PUBLIC:
        return t("widget.common.newPublicFolder");
      case DefaultFolderId.INCOGNITO:
        return t("widget.common.newIncognitoFolder");
      default:
        return t("widget.common.newFolder");
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const searchInputRef = useRef<InputRefObject>(null);

  const rootFolderPermissions = field?.rootFolderPermissions;

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

  const activeRootFolderId = useChatNavigationStore(
    (s) => s.currentRootFolderId,
  );
  const activeFolderId = useChatNavigationStore((s) => s.currentSubFolderId);
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);
  const setNavigation = useChatNavigationStore((s) => s.setNavigation);

  const rootFolderColor = getRootFolderColorName(activeRootFolderId);
  const buttonColorClass = ROOT_FOLDER_COLOR_MAP[rootFolderColor]?.button ?? "";

  const handleSelectRootFolder = (folderId: DefaultFolderId): void => {
    const needsNewThread =
      folderId === DefaultFolderId.PRIVATE ||
      folderId === DefaultFolderId.SHARED ||
      folderId === DefaultFolderId.INCOGNITO;

    setNavigation({
      currentRootFolderId: folderId,
      currentSubFolderId: null,
      activeThreadId: needsNewThread ? NEW_MESSAGE_ID : null,
    });

    const rootFolderUrl = `/${locale}/threads/${folderId}`;
    const url = needsNewThread
      ? `${rootFolderUrl}/${NEW_MESSAGE_ID}`
      : rootFolderUrl;
    window.history.pushState(null, "", url);
  };

  const handleCreateThread = (): void => {
    setNavigation({
      activeThreadId: NEW_MESSAGE_ID,
      currentRootFolderId: activeRootFolderId,
      currentSubFolderId: null,
    });
    window.history.pushState(
      null,
      "",
      `/${locale}/threads/${activeRootFolderId}/${NEW_MESSAGE_ID}`,
    );
  };

  const isOnNewThreadPage =
    activeThreadId === NEW_MESSAGE_ID && activeFolderId === null;

  const canCreateThread = field
    ? (rootFolderPermissions?.canCreateThread ?? false)
    : true;
  const canCreateFolder = field
    ? (rootFolderPermissions?.canCreateFolder ?? false)
    : true;

  return (
    <Div className="flex flex-col h-full bg-background">
      <Div className="bg-background flex flex-col gap-0 pt-15" />

      <RootFolderBar
        activeRootFolderId={activeRootFolderId}
        onSelectFolder={handleSelectRootFolder}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
      />

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
                    {getNewChatLabel(activeRootFolderId)}
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
                  title={getNewFolderLabel(activeRootFolderId)}
                >
                  <FolderPlus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {getNewFolderLabel(activeRootFolderId)}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Div>

      <Div className="px-3 pb-3 flex flex-row gap-2 border-b border-border">
        <Div className="relative flex-1 flex flex-row">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={t("widget.common.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-10 sm:h-8 text-sm border-none bg-primary/10 focus-visible:ring-primary"
          />
        </Div>
      </Div>

      <Div className="flex-1 overflow-hidden px-0">
        <ScrollArea className="h-full">
          <Div className="px-1 py-1">
            <EndpointsPage
              endpoint={folderContentsDefinition}
              locale={locale}
              user={user}
              endpointOptions={{
                read: {
                  urlPathParams: { rootFolderId: activeRootFolderId },
                  initialState: { subFolderId: null },
                  initialData:
                    activeRootFolderId === initialRootFolderId
                      ? (initialFolderContentsData ?? undefined)
                      : undefined,
                  queryOptions: {
                    refetchOnWindowFocus: false,
                    staleTime: 30 * 1000,
                  },
                },
                subscribeToEvents: true,
              }}
            />
          </Div>
        </ScrollArea>
      </Div>

      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("widget.newFolder.title")}</DialogTitle>
          </DialogHeader>
          <EndpointsPage
            endpoint={{ POST: createFolderDefinition.POST }}
            locale={locale}
            user={user}
            endpointOptions={{
              create: {
                urlPathParams: { rootFolderId: activeRootFolderId },
                initialState: {
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
  );
}

// Keep ThreadsList export for backward compatibility
// Keep ThreadsList export for backward compatibility
export { ThreadsList };
