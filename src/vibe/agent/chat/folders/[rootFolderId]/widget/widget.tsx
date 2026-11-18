/**
 * Custom Widget for Folders List - Shell Only
 * Owns: root-folder tabs, new-chat/folder buttons, search input.
 * Content area is rendered via EndpointsPage (folder-contents endpoint).
 */

"use client";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Button } from "next-vibe/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "next-vibe/ui/components/dialog";
import { Div } from "next-vibe/ui/components/div";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "next-vibe/ui/components/dropdown-menu";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { FolderPlus } from "next-vibe/ui/components/icons/FolderPlus";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { MessageSquarePlus } from "next-vibe/ui/components/icons/MessageSquarePlus";
import { Search } from "next-vibe/ui/components/icons/Search";
import { X } from "next-vibe/ui/components/icons/X";
import { Input, type InputRefObject } from "next-vibe/ui/components/input";
import { ScrollArea } from "next-vibe/ui/components/scroll-area";
import { Span } from "next-vibe/ui/components/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe/ui/components/tooltip";
import { useSilentHistory } from "next-vibe/ui/hooks/use-navigation";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetContext,
  useWidgetPlatform,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  getFolderTourAttr,
  TOUR_DATA_ATTRS,
} from "../../../../ai-stream/stream/widget/chat-ui/data-attrs";
import { useSidebarPreview } from "../../../../ai-stream/stream/widget/chat-ui/sidebar/preview/context";
import { scopedTranslation as previewTranslation } from "../../../../ai-stream/stream/widget/chat-ui/sidebar/preview/i18n";
import cortexSearchDefinitions from "../../../../cortex/search/definition";
import { DEFAULT_FOLDER_CONFIGS, isDefaultFolderId } from "../../../config";
import { NEW_MESSAGE_ID } from "../../../enum";
import folderContentsDefinition from "../../../folder-contents/[rootFolderId]/definition";
import { useChatBootContext } from "../../../hooks/context";
import { useChatNavigationStore } from "../../../hooks/use-chat-navigation-store";
import { scopedTranslation as threadWidgetTranslation } from "../../../threads/widget/i18n";
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

  const preview = useSidebarPreview();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const rootFolders = useMemo(
    () =>
      Object.values(DEFAULT_FOLDER_CONFIGS)
        .filter((f) => f.id !== DefaultFolderId.REMOTE || isAdmin)
        .filter((f) => f.id !== DefaultFolderId.BACKGROUND || isAuthenticated)
        .toSorted((a, b) => a.order - b.order),
    [isAdmin, isAuthenticated],
  );

  const isFolderAccessible = (folderId: string): boolean => {
    if (
      folderId === DefaultFolderId.PUBLIC ||
      folderId === DefaultFolderId.INCOGNITO
    ) {
      return true;
    }
    return isAuthenticated;
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
    onSelectFolder(folderId);
  };

  return (
    <>
      {preview ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="max-w-full gap-1.5 rounded-full bg-background text-xs"
              aria-label={`${previewTranslation.scopedT(locale).t("locations")}: ${t(`widget.config.foldersShort.${activeRootFolderId}`)}`}
              data-tour={TOUR_DATA_ATTRS.ROOT_FOLDERS}
            >
              <Icon
                icon={DEFAULT_FOLDER_CONFIGS[activeRootFolderId].icon}
                className="size-3.5"
              />
              {t(`widget.config.foldersShort.${activeRootFolderId}`)}
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-[350] min-w-40">
            {rootFolders.map((folder) => (
              <DropdownMenuItem
                key={folder.id}
                className={cn(
                  "min-h-10 gap-2",
                  folder.id === activeRootFolderId && "bg-accent font-semibold",
                )}
                onSelect={() => handleClick(folder.id)}
                data-tour={getFolderTourAttr(folder.id)}
              >
                <Icon icon={folder.icon} className="size-4" />
                {t(`widget.config.foldersShort.${folder.id}`)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
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
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleClick(folderConfig.id);
                    }
                  }}
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
      )}

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
// UUID regex to extract thread IDs from cortex paths
// ---------------------------------------------------------------------------

const UUID_REGEX =
  /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

// ---------------------------------------------------------------------------
// FoldersListContainer - shell widget
// ---------------------------------------------------------------------------

export function FoldersListContainer(): React.JSX.Element {
  const field = useWidgetValue<typeof definition.GET>();
  const { user, locale, logger } = useWidgetContext();
  const platform = useWidgetPlatform();
  const { initialFolderContentsData, initialRootFolderId } =
    useChatBootContext();
  const { t } = scopedTranslation.scopedT(locale);

  const preview = useSidebarPreview();
  const previewT = previewTranslation.scopedT(locale).t;
  const { t: threadT } = threadWidgetTranslation.scopedT(locale);
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

  // Search query persisted in Zustand store (survives sidebar unmount/remount)
  const searchQuery = useChatNavigationStore((s) => s.sidebarSearchQuery);
  const setSearchQuery = useChatNavigationStore((s) => s.setSidebarSearchQuery);
  const [rawDebouncedQuery, setDebouncedQuery] = useState(searchQuery.trim());
  // An empty search query clears the debounced value immediately (no debounce)
  const debouncedQuery =
    searchQuery.trim().length === 0 ? "" : rawDebouncedQuery;
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const searchInputRef = useRef<InputRefObject>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (preview?.panel === "search") {
      searchInputRef.current?.focus();
    }
  }, [preview?.panel]);

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
      user.roles.includes(UserPermissionRole.ADMIN),
    [user],
  );

  const activeRootFolderId = useChatNavigationStore(
    (s) => s.currentRootFolderId,
  );
  const activeFolderId = useChatNavigationStore((s) => s.currentSubFolderId);
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);
  const setNavigation = useChatNavigationStore((s) => s.setNavigation);
  const { pushState } = useSilentHistory();

  // --- Cortex vector search for threads ---
  const searchEndpoint = useEndpoint(
    cortexSearchDefinitions,
    useMemo(
      () => ({
        read: {
          queryOptions: {
            enabled: false,
            refetchOnWindowFocus: false,
            staleTime: 60 * 1000,
          },
          formOptions: {
            autoSubmit: false,
            persistForm: false,
          },
        },
      }),
      [],
    ),
    logger,
    user,
  );

  // Debounce search query (300ms)
  useEffect(() => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }
    if (searchQuery.trim().length === 0) {
      return;
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return (): void => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, setDebouncedQuery]);

  // Clear search when switching root folders (but not on initial mount)
  const prevRootFolderRef = useRef(activeRootFolderId);
  useEffect(() => {
    if (prevRootFolderRef.current !== activeRootFolderId) {
      prevRootFolderRef.current = activeRootFolderId;
      setSearchQuery("");
      setDebouncedQuery("");
    }
  }, [activeRootFolderId, setSearchQuery]);

  const canSearchCortex =
    isAuthenticated &&
    !(preview && activeRootFolderId === DefaultFolderId.INCOGNITO);

  // Trigger cortex search when debounced query changes or on mount with persisted query
  const searchSubmittedRef = useRef("");
  useEffect(() => {
    if (!canSearchCortex || !debouncedQuery || !searchEndpoint?.read) {
      searchSubmittedRef.current = "";
      return;
    }
    const searchKey = `${debouncedQuery}::${activeRootFolderId}`;
    if (searchSubmittedRef.current === searchKey) {
      return;
    }
    searchSubmittedRef.current = searchKey;
    const form = searchEndpoint.read.form;
    form.setValue("query", debouncedQuery);
    form.setValue("path", `/threads/${activeRootFolderId}`);
    form.setValue("maxResults", 20);
    searchEndpoint.read.submitForm();
  }, [debouncedQuery, activeRootFolderId, searchEndpoint, canSearchCortex]);

  // Extract thread IDs from cortex search results
  const searchResponse = searchEndpoint?.read?.response;
  const searchThreadIds = useMemo(() => {
    if (!searchResponse?.success) {
      return [];
    }
    const results = searchResponse.data?.results ?? [];
    const ids: string[] = [];
    for (const result of results) {
      const match = result.resultPath.match(UUID_REGEX);
      if (match?.[1]) {
        ids.push(match[1]);
      }
    }
    return ids;
  }, [searchResponse]);

  // Show loading while debouncing OR while API is fetching
  const isSearchActive = canSearchCortex && searchQuery.trim().length > 0;
  const isDebouncePending =
    isSearchActive && searchQuery.trim() !== debouncedQuery;
  const isSearching =
    isSearchActive &&
    (isDebouncePending || (searchEndpoint?.read?.isLoading ?? false));
  // Only show search results view after debounce fires AND API responds
  const hasSearchResults = debouncedQuery.length > 0 && !isDebouncePending;

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedQuery("");
    searchInputRef.current?.focus();
  }, [setSearchQuery]);

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
    pushState(url);
  };

  const handleCreateThread = (): void => {
    setNavigation({
      activeThreadId: NEW_MESSAGE_ID,
      currentRootFolderId: activeRootFolderId,
      currentSubFolderId: null,
    });
    pushState(`/${locale}/threads/${activeRootFolderId}/${NEW_MESSAGE_ID}`);
    preview?.onOpenChat();
  };

  const isOnNewThreadPage =
    activeThreadId === NEW_MESSAGE_ID && activeFolderId === null;

  const canCreateThread = field
    ? (rootFolderPermissions?.canCreateThread ?? false)
    : true;
  const canCreateFolder = field
    ? (rootFolderPermissions?.canCreateFolder ?? false)
    : true;

  const rootPicker = (
    <RootFolderBar
      activeRootFolderId={activeRootFolderId}
      onSelectFolder={handleSelectRootFolder}
      isAuthenticated={isAuthenticated}
      isAdmin={isAdmin}
    />
  );
  const showSearch = preview
    ? preview.variant !== "B" || preview.panel === "search"
    : isAuthenticated;

  return (
    <Div
      className={
        preview
          ? "flex min-h-0 flex-col h-full bg-background"
          : "flex flex-col h-full bg-background"
      }
    >
      {preview ? (
        <Div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-3 pb-2 pt-3">
          <Span className="text-base font-semibold tracking-tight">
            {previewT(
              preview.panel === "search"
                ? "search"
                : preview.variant === "C"
                  ? "workspace"
                  : preview.variant === "A"
                    ? "library"
                    : "chats",
            )}
          </Span>
          {rootPicker}
        </Div>
      ) : (
        <>
          <Div className="bg-background flex flex-col gap-0 pt-15" />
          {rootPicker}
        </>
      )}
      {preview?.panel !== "search" && (
        <Div
          className={
            preview
              ? "flex shrink-0 items-center gap-1.5 px-3 pb-2"
              : "flex flex-row items-center gap-1 px-3 pb-2 min-w-max"
          }
        >
          {canCreateThread && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Div className="w-full">
                    <Button
                      onClick={handleCreateThread}
                      disabled={!preview && isOnNewThreadPage}
                      className={
                        preview
                          ? "h-11 w-full justify-start rounded-lg px-3"
                          : `w-full h-10 sm:h-9 ${buttonColorClass}`
                      }
                      data-tour={TOUR_DATA_ATTRS.NEW_CHAT_BUTTON}
                    >
                      <MessageSquarePlus
                        className={preview ? "size-4" : "h-4 w-4 mr-2"}
                      />
                      {preview
                        ? threadT("common.newChat")
                        : getNewChatLabel(activeRootFolderId)}
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
                    className={
                      preview
                        ? "size-11 shrink-0 rounded-lg border border-border hover:bg-accent"
                        : "h-11 w-11 hover:bg-accent"
                    }
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
      )}

      {/* Guests and incognito previews filter the current level locally. */}
      {showSearch && (
        <Div className="px-3 pb-3 flex flex-row gap-2 border-b border-border">
          <Div className="relative flex-1 flex flex-row">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              ref={searchInputRef}
              type="text"
              aria-label={preview ? previewT("searchChats") : undefined}
              placeholder={
                preview
                  ? previewT("searchChats")
                  : t("widget.common.searchPlaceholder")
              }
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim().length === 0) {
                  setDebouncedQuery("");
                }
              }}
              className={cn(
                preview
                  ? "pl-8 h-10 text-sm rounded-lg bg-muted/35 border-border"
                  : "pl-8 h-10 sm:h-8 text-sm border-none bg-primary/10 focus-visible:ring-primary",
                preview ? searchQuery && "pr-10" : isSearchActive && "pr-8",
              )}
            />
            {preview && searchQuery ? (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 size-10"
                onClick={handleClearSearch}
                aria-label={previewT("clearSearch")}
              >
                <X />
              </Button>
            ) : (
              isSearchActive && (
                <Div
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-sm p-0.5 hover:bg-primary/10"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Div>
              )
            )}
          </Div>
        </Div>
      )}

      <Div className="flex-1 overflow-hidden px-0">
        <ScrollArea className="h-full">
          {isSearchActive && hasSearchResults ? (
            isSearching ? (
              <Div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </Div>
            ) : searchThreadIds.length > 0 ? (
              <Div className="px-1 py-1">
                <EndpointsPage
                  logger={logger}
                  key={searchThreadIds.join(",")}
                  endpoint={folderContentsDefinition}
                  locale={locale}
                  user={user}
                  platform={platform}
                  endpointOptions={{
                    read: {
                      urlPathParams: { rootFolderId: activeRootFolderId },
                      initialState: {
                        subFolderId: null,
                        threadIds: searchThreadIds,
                      },
                      queryOptions: {
                        refetchOnWindowFocus: false,
                        staleTime: 30 * 1000,
                      },
                    },
                    subscribeToEvents: true,
                  }}
                />
              </Div>
            ) : (
              <Div className="flex items-center justify-center py-8">
                <Span className="text-sm text-muted-foreground">
                  {preview
                    ? previewT("noMatches")
                    : t("widget.common.noResults")}
                </Span>
              </Div>
            )
          ) : isSearchActive ? (
            <Div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </Div>
          ) : (
            <Div className="px-1 py-1">
              <EndpointsPage
                logger={logger}
                endpoint={folderContentsDefinition}
                locale={locale}
                user={user}
                platform={platform}
                endpointOptions={{
                  read: {
                    urlPathParams: { rootFolderId: activeRootFolderId },
                    initialState: { subFolderId: null, threadIds: null },
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
          )}
        </ScrollArea>
      </Div>

      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("widget.newFolder.title")}</DialogTitle>
          </DialogHeader>
          <EndpointsPage
            logger={logger}
            endpoint={{ POST: createFolderDefinition.POST }}
            locale={locale}
            user={user}
            platform={platform}
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
