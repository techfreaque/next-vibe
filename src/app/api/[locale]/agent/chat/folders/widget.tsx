/**
 * Custom Widget for Folders List - Complete Sidebar
 * Orchestrator: fetches folders, delegates threads/CRUD to EndpointsPage
 * No useChatContext — fully widget-pattern based
 */

"use client";

import { usePathname, useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { FolderPlus } from "next-vibe-ui/ui/icons/FolderPlus";
import { MessageSquarePlus } from "next-vibe-ui/ui/icons/MessageSquarePlus";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Input, type InputRefObject } from "next-vibe-ui/ui/input";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import { Span } from "next-vibe-ui/ui/span";
import { Tooltip } from "next-vibe-ui/ui/tooltip";
import { TooltipContent } from "next-vibe-ui/ui/tooltip";
import { TooltipProvider } from "next-vibe-ui/ui/tooltip";
import { TooltipTrigger } from "next-vibe-ui/ui/tooltip";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  buildFolderUrl,
  getNewChatTranslationKey,
  getNewFolderTranslationKey,
} from "@/app/[locale]/chat/lib/utils/navigation";
import {
  getFolderTourAttr,
  TOUR_DATA_ATTRS,
} from "@/app/api/[locale]/agent/chat/_components/welcome-tour/tour-config";
import {
  DEFAULT_FOLDER_CONFIGS,
  DefaultFolderId,
  isDefaultFolderId,
} from "@/app/api/[locale]/agent/chat/config";
import { NEW_MESSAGE_ID } from "@/app/api/[locale]/agent/chat/enum";
import { FolderAccessModal } from "@/app/api/[locale]/agent/chat/folders/_components/folder-access-modal";
import { NewFolderDialog } from "@/app/api/[locale]/agent/chat/threads/_components/thread-area/new-folder-dialog";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { simpleT } from "@/i18n/core/shared";

import { useWidgetContext } from "../../../system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import threadsDefinition from "../threads/definition";
import type definition from "./definition";
import type { FolderListResponseOutput } from "./definition";

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
};
/* eslint-enable i18next/no-literal-string */

function getRootFolderColor(folderId: DefaultFolderId): string {
  return DEFAULT_FOLDER_CONFIGS[folderId]?.color ?? "zinc";
}

/**
 * Improved RootFolderBar with icon + label, auth-aware, FolderAccessModal
 */
function RootFolderBar({
  activeRootFolderId,
  onSelectFolder,
  isAuthenticated,
}: {
  activeRootFolderId: DefaultFolderId;
  onSelectFolder: (folderId: DefaultFolderId) => void;
  isAuthenticated: boolean;
}): React.JSX.Element {
  const { locale } = useWidgetContext();
  const { t } = simpleT(locale);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const rootFolders = useMemo(
    () =>
      Object.values(DEFAULT_FOLDER_CONFIGS).toSorted(
        (a, b) => a.order - b.order,
      ),
    [],
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
    if (isFolderAccessible(folderId)) {
      onSelectFolder(folderId as DefaultFolderId);
    } else {
      setSelectedFolderId(folderId);
      setModalOpen(true);
    }
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
              <Button
                key={folderConfig.id}
                variant="ghost"
                size="icon"
                className={`h-13 w-13 flex-col gap-1 ${colorClasses}`}
                onClick={() => handleClick(folderConfig.id)}
                suppressHydrationWarning
                data-tour={getFolderTourAttr(folderConfig.id)}
              >
                <Div className="h-5 w-5 flex items-center justify-center shrink-0">
                  <Icon
                    icon={folderConfig.icon}
                    className="h-5 w-5 flex items-center justify-center"
                  />
                </Div>
                <Span className="text-[9px] font-medium leading-none opacity-80">
                  {t(
                    `app.api.agent.chat.config.foldersShort.${folderConfig.id}` as Parameters<
                      typeof t
                    >[0],
                  )}
                </Span>
              </Button>
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

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: FolderListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

/**
 * FoldersListContainer — complete sidebar orchestrator widget
 * Receives folder data from the GET endpoint, delegates rendering down
 */
export function FoldersListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const { logger, user, locale } = useWidgetContext();
  const router = useRouter();
  const { t: simpleTranslate } = simpleT(locale);

  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const searchInputRef = useRef<InputRefObject>(null);
  const pathname = usePathname();

  const rootFolderPermissions = field.value?.rootFolderPermissions;

  const isAuthenticated = useMemo(
    () => user !== undefined && !user.isPublic,
    [user],
  );

  // Derive activeRootFolderId from URL pathname
  const [activeRootFolderId, setActiveRootFolderId] = useState<DefaultFolderId>(
    DefaultFolderId.PRIVATE,
  );
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Parse URL on mount and on navigation — pattern: /locale/threads/rootFolder[/subFolder][/threadId]
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const parts = (pathname ?? window.location.pathname)
      .split("/")
      .filter(Boolean);
    // parts[0] = locale, parts[1] = "threads", parts[2] = rootFolderId, ...
    const threadsIdx = parts.indexOf("threads");
    if (threadsIdx === -1) {
      return;
    }

    const rootId = parts[threadsIdx + 1] as DefaultFolderId | undefined;
    const seg3 = parts[threadsIdx + 2];
    const seg4 = parts[threadsIdx + 3];

    if (rootId && isDefaultFolderId(rootId)) {
      setActiveRootFolderId(rootId);
    }

    // seg3 could be subFolderId or threadId (UUID), seg4 would be threadId
    if (seg4) {
      // /locale/threads/root/subfolder/thread
      setActiveFolderId(seg3 ?? null);
      setActiveThreadId(seg4);
    } else if (seg3) {
      // /locale/threads/root/idOrFolder — if it's the new-message sentinel it's a thread page
      if (seg3 === NEW_MESSAGE_ID) {
        setActiveFolderId(null);
        setActiveThreadId(NEW_MESSAGE_ID);
      } else {
        // Could be a subfolder UUID or a thread UUID — check against known folders
        setActiveFolderId(seg3);
        setActiveThreadId(null);
      }
    } else {
      setActiveFolderId(null);
      setActiveThreadId(null);
    }
  }, [pathname]);

  // Root folder color for action buttons
  const rootFolderColor = getRootFolderColor(activeRootFolderId);
  const buttonColorClass = ROOT_FOLDER_COLOR_MAP[rootFolderColor]?.button ?? "";

  const handleSelectRootFolder = (folderId: DefaultFolderId): void => {
    setActiveRootFolderId(folderId);
    setActiveFolderId(null);
    const url = buildFolderUrl(locale, folderId, null);
    router.push(url);
  };

  const handleCreateThread = (): void => {
    const url = buildFolderUrl(locale, activeRootFolderId, activeFolderId);
    router.push(`${url}/${NEW_MESSAGE_ID}`);
  };

  const handleCreateFolder = async (
    name: string,
    icon: IconKey,
  ): Promise<void> => {
    try {
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
      const createDef = await import("./create/definition");
      const foldersDef = await import("./definition");

      await apiClient.mutate(
        createDef.default.POST,
        logger,
        user,
        {
          folder: {
            rootFolderId: activeRootFolderId,
            name,
            icon,
            parentId: activeFolderId ?? undefined,
          },
        },
        undefined,
        locale,
      );

      await apiClient.refetchEndpoint(foldersDef.default.GET, logger);
    } catch (error) {
      logger.error("Failed to create folder", { error: String(error), name });
    }
  };

  const isOnNewThreadPage = activeThreadId === NEW_MESSAGE_ID;

  // Stable endpointOptions for threads EndpointsPage — avoids remount on every render
  const threadsEndpointOptions = useMemo(
    () => ({
      read: {
        initialState: {
          rootFolderId: activeRootFolderId as
            | typeof DefaultFolderId.PRIVATE
            | typeof DefaultFolderId.SHARED
            | typeof DefaultFolderId.PUBLIC,
          subFolderId: activeFolderId ?? undefined,
          search: searchQuery || undefined,
        },
        queryOptions: {
          refetchOnWindowFocus: false,
          staleTime: 30 * 1000,
        },
      },
    }),
    [activeRootFolderId, activeFolderId, searchQuery],
  );
  // Show buttons optimistically while loading; hide only when server explicitly says false
  const dataLoaded = field.value !== null && field.value !== undefined;
  const canCreateThread = dataLoaded
    ? (rootFolderPermissions?.canCreateThread ?? false)
    : true;
  const canCreateFolder = dataLoaded
    ? activeFolderId
      ? (field.value?.folders.find((f) => f.id === activeFolderId)?.canManage ??
        false)
      : (rootFolderPermissions?.canCreateFolder ?? false)
    : true;

  return (
    <Div className="flex flex-col h-full bg-background">
      {/* Spacer matching the top bar height */}
      <Div className="bg-background flex flex-col gap-0 pt-15" />

      {/* Root Folder Navigation Bar */}
      <RootFolderBar
        activeRootFolderId={activeRootFolderId}
        onSelectFolder={handleSelectRootFolder}
        isAuthenticated={isAuthenticated}
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
            {activeRootFolderId !== DefaultFolderId.INCOGNITO ? (
              <EndpointsPage
                endpoint={threadsDefinition}
                locale={locale}
                user={user}
                forceMethod="GET"
                endpointOptions={threadsEndpointOptions}
              />
            ) : (
              <Div className="px-2 py-4 text-center text-sm text-muted-foreground">
                {simpleTranslate("app.chat.folders.incognitoDescription")}
              </Div>
            )}
          </Div>
        </ScrollArea>
      </Div>

      {/* New folder dialog */}
      <NewFolderDialog
        open={newFolderDialogOpen}
        onOpenChange={setNewFolderDialogOpen}
        onSave={handleCreateFolder}
        locale={locale}
      />
    </Div>
  );
}
