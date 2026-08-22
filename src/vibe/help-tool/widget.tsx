/**
 * Help Tools Widget
 * Unified tool discovery widget for web and AI platforms.
 * - Web: full tool list with enable/disable toggles, category collapsing, click-to-detail
 * - AI/MCP: compact overview or search results
 */

"use client";
import { Badge } from "next-vibe/ui/components/badge";
import type { ButtonMouseEvent } from "next-vibe/ui/components/button";
import { Button } from "next-vibe/ui/components/button";
import { Dialog, DialogContent } from "next-vibe/ui/components/dialog";
import { Div } from "next-vibe/ui/components/div";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "next-vibe/ui/components/dropdown-menu";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Bot } from "next-vibe/ui/components/icons/Bot";
import { Check } from "next-vibe/ui/components/icons/Check";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Eye } from "next-vibe/ui/components/icons/Eye";
import { EyeOff } from "next-vibe/ui/components/icons/EyeOff";
import { Globe } from "next-vibe/ui/components/icons/Globe";
import { Monitor } from "next-vibe/ui/components/icons/Monitor";
import { PanelLeft } from "next-vibe/ui/components/icons/PanelLeft";
import { Pin } from "next-vibe/ui/components/icons/Pin";
import { PinOff } from "next-vibe/ui/components/icons/PinOff";
import { RotateCcw } from "next-vibe/ui/components/icons/RotateCcw";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Settings } from "next-vibe/ui/components/icons/Settings";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { X } from "next-vibe/ui/components/icons/X";
import { Zap } from "next-vibe/ui/components/icons/Zap";
import { Input } from "next-vibe/ui/components/input";
import { AnimatePresence, MotionDiv } from "next-vibe/ui/components/motion";
import { Pre } from "next-vibe/ui/components/pre";
import { ResizableContainer } from "next-vibe/ui/components/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { Switch } from "next-vibe/ui/components/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe/ui/components/tooltip";
import { P } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import {
  useSearchParams,
  useSilentHistory,
} from "next-vibe/ui/hooks/use-navigation";
import { usePathname } from "next-vibe/ui/hooks/use-pathname";
import { useWindowSize } from "next-vibe/ui/hooks/use-window-size";
import { addWindowListener } from "next-vibe/ui/lib/dom";
import {
  getCurrentOrigin,
  getCurrentPathname,
  getCurrentSearch,
  historyBack,
} from "next-vibe/ui/lib/location";
import { getScreenWidth } from "next-vibe/ui/lib/screen";
import { storage } from "next-vibe/ui/lib/storage";
import type { JSX } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Logo } from "@/_pages/_components/logo";
import { ThemeToggleDropdown } from "@/_pages/_components/theme-toggle";
import {
  ADMIN_GROUPS,
  CATEGORY_REGISTRY,
  GROUP_LABELS,
} from "@/generated/categories/registry";

import { LocaleSelectorContent } from "../agent/ai-stream/stream/widget/chat-ui/top-area/locale-selector-content";
import {
  getDefaultToolIdsForUser,
  getDefaultWebPinnedIdsForUser,
} from "../agent/chat/constants";
import type { EnabledTool } from "../agent/chat/hooks/store";
import settingsDefinition from "../agent/chat/settings/definition";
import favoriteByIdDefinition from "../agent/skills/favorites/[id]/definition";
import favoritesListDefinition from "../agent/skills/favorites/definition";
import { endpointToUrlSegment } from "../core/core-utils/path";
import type { NavigationStackEntry } from "../core/definition/endpoint";
import type { CreateApiEndpointAny } from "../core/definition/endpoint-base";
import { useTranslation } from "../core/i18n/core/client";
import { EXECUTE_TOOL_ALIAS } from "../execute-tool/constants";
import { UserPermissionRole } from "../identity/roles/enum";
import { Platform } from "../platforms/platforms";
import { VibeFrameHost } from "../platforms/vibe-frame/VibeFrameHost";
import remoteConnectionListDefinition from "../remote-connection/list/definition";
import { cn } from "../unified-ui/_shared/cn";
import {
  useWidgetDisabled,
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetUser,
  useWidgetValue,
} from "../unified-ui/_shared/use-widget-context";
import { resolveEndpoint } from "../unified-ui/hooks/resolve-endpoint";
import { apiClient } from "../unified-ui/hooks/store";
import { useEndpoint } from "../unified-ui/hooks/use-endpoint";
import { useUrlNavStack } from "../unified-ui/hooks/use-url-nav-stack";
import { EndpointsPage } from "../unified-ui/renderers/web/EndpointsPage";
import { Icon } from "../unified-ui/widgets/form-fields/icon-field/icon-component";
import type { IconKey } from "../unified-ui/widgets/form-fields/icon-field/icons";
import type { CategoryDefinitionSerialized } from "./category-types";
import type definition from "./definition";
import type {
  HelpGetRequestInput,
  HelpToolMetadataSerialized,
} from "./definition";
import { scopedTranslation } from "./i18n";

// ─── Constants ──────────────────────────────────────────────────────────────

/** URL path segment for the tools browser (after locale prefix) */
const ADMIN_ENDPOINTS_PATH = "tools";

/**
 * Search params that belong to the sidebar/filter state and must survive
 * when switching between tools. Everything else is endpoint-specific (e.g. "id")
 * and must be cleared when the user picks a different tool from the sidebar.
 */
const FILTER_PARAM_KEYS = new Set([
  "q",
  "sf",
  "prod",
  "view",
  "inst",
  "p",
  "ps",
  "cat",
  "sub",
]);

// Prevents the admin two-pane layout from rendering recursively when HelpToolsWidget
// is mounted inside another HelpToolsWidget's EndpointsPage.
const HelpAdminLayoutActiveContext = createContext(false);

function renderFolderCell(
  icon: IconKey,
  label: string,
  count: number,
  onClick: () => void,
): JSX.Element {
  return (
    <Button
      key={label}
      type="button"
      variant="ghost"
      size="unset"
      onClick={onClick}
      className="flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-colors h-auto w-full min-w-0 hover:bg-accent text-foreground/60 hover:text-foreground border border-transparent hover:border-border/50"
    >
      <Div className="relative h-10 w-10 rounded-xl bg-muted/80 flex items-center justify-center shrink-0 group-hover:bg-muted">
        <Icon icon={icon} className="h-5 w-5 text-muted-foreground" />
        <Span className="absolute -bottom-1.5 -right-1.5 bg-background border border-border/80 rounded-full text-[9px] font-bold leading-none min-w-[18px] h-[14px] flex items-center justify-center px-0.5 text-muted-foreground tabular-nums">
          {count}
        </Span>
      </Div>
      <Span className="text-[10px] leading-tight line-clamp-3 w-full font-medium">
        {label}
      </Span>
    </Button>
  );
}

// ─── Sidebar collapsed state (persisted per storageId) ──────────────────────

const _sidebarRegistry = new Map<
  string,
  {
    collapsed: boolean;
    initialized: boolean;
    listeners: Set<(v: boolean) => void>;
  }
>();

function _getOrCreateSidebarEntry(storageId: string): {
  collapsed: boolean;
  initialized: boolean;
  listeners: Set<(v: boolean) => void>;
} {
  const existing = _sidebarRegistry.get(storageId);
  if (existing) {
    return existing;
  }
  const entry = {
    collapsed: false,
    initialized: false,
    listeners: new Set<(v: boolean) => void>(),
  };
  _sidebarRegistry.set(storageId, entry);
  return entry;
}

function useSidebarCollapsed(
  storageId: string,
): [boolean, (collapsed: boolean) => void] {
  const entry = _getOrCreateSidebarEntry(storageId);
  const [collapsed, setLocalCollapsed] = useState(entry.collapsed);
  const logger = useLogger();

  useEffect(() => {
    const listener = (v: boolean): void => setLocalCollapsed(v);
    entry.listeners.add(listener);
    if (!entry.initialized) {
      entry.initialized = true;
      void storage.getItem(storageId).then((stored) => {
        const v =
          stored !== null
            ? (JSON.parse(stored) as boolean)
            : getScreenWidth(logger) < 930;
        entry.collapsed = v;
        for (const l of entry.listeners) {
          l(v);
        }
        return undefined;
      });
    }
    return (): void => {
      entry.listeners.delete(listener);
    };
  }, [storageId, entry, logger]);

  const setCollapsed = useCallback(
    (value: boolean): void => {
      setLocalCollapsed(value);
      // eslint-disable-next-line react-compiler/react-compiler -- intentional mutation of module-level store object
      entry.collapsed = value;
      void storage.setItem(storageId, JSON.stringify(value));
      for (const l of entry.listeners) {
        l(value);
      }
    },
    [storageId, entry],
  );

  return [collapsed, setCollapsed];
}

// ─── Label helpers ──────────────────────────────────────────────────────────

function getToolLabel(tool: HelpToolMetadataSerialized): string {
  return (
    tool.titleShort ?? tool.title ?? tool.aliases?.[0] ?? tool.id ?? tool.name
  );
}

const isIdSegment = (s: string): boolean =>
  s === "id" || s.endsWith("Id") || /^\d+$/.test(s);

function getSubcategory(toolName: string): string {
  // Strip instanceId__ prefix for remote tools (e.g. "hermes__agent_chat_GET" → "agent_chat_GET")
  const sepIdx = toolName.indexOf("__");
  const effectiveName = sepIdx !== -1 ? toolName.slice(sepIdx + 2) : toolName;
  const parts = effectiveName.split("_");
  const pathParts = parts.slice(0, -1);
  if (pathParts.length <= 3) {
    return "General";
  }
  const resources = pathParts
    .slice(2)
    .filter((s) => !isIdSegment(s))
    .slice(0, 2);
  if (resources.length === 0) {
    return "General";
  }
  return resources
    .map((s) =>
      s
        .replaceAll(/([A-Z])/g, " $1")
        .replaceAll(/[-]/g, " ")
        .trim()
        .replace(/^\w/, (c) => c.toUpperCase()),
    )
    .join(" / ");
}

// ─── Navigate to actual tool endpoint by toolName ───────────────────────────

async function navigateToLocalTool(
  toolName: string,
  navigate: ReturnType<typeof useWidgetNavigation>["push"],
): Promise<void> {
  const endpointDef = await resolveEndpoint(toolName);
  if (endpointDef) {
    navigate(endpointDef, {});
  }
}

// No nav stack persistence — stack is purely in-memory.
// Each push records a browser history entry so Back pops the stack.
// On refresh the stack is lost; user lands on the base endpoint (correct).

// ─── Main widget component ──────────────────────────────────────────────────

export function HelpToolsWidget(): JSX.Element {
  const { push: navigate } = useWidgetNavigation();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const endpointMutations = useWidgetEndpointMutations();
  const disabled = useWidgetDisabled();

  // Two-pane sidebar mode when on /tools path.
  // Disabled if this widget is nested inside another HelpToolsWidget's admin layout
  // (prevents infinite recursive nesting).
  const isInsideAdminLayout = useContext(HelpAdminLayoutActiveContext);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAdminLayout =
    !isInsideAdminLayout && (pathname?.includes("/tools") ?? false);
  const [selectedAdminEndpoint, setSelectedAdminEndpointState] =
    useState<CreateApiEndpointAny | null>(null);
  const selectedAdminEndpointRef = useRef<CreateApiEndpointAny | null>(null);
  const setSelectedAdminEndpoint = useCallback(
    (ep: CreateApiEndpointAny | null): void => {
      selectedAdminEndpointRef.current = ep;
      setSelectedAdminEndpointState(ep);
    },
    [],
  );

  // ── URL state helpers ──────────────────────────────────────────────────────
  // Search: ?cat=&sub=&nav=&q=&sf=...  → all state in search params
  // Path:   /tools/<alias>   → base endpoint

  const silentHistory = useSilentHistory();

  // Stable refs so callbacks always read current values without re-creating
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  // Track the effective current pathname + search across silent pushState/replaceState calls.
  // usePathname() / useSearchParams() only reflect router-aware navigations, not silent writes.
  // Every silent push/replace must go through writeSilentUrl() which keeps these in sync.
  const effectivePathnameRef = useRef(pathname);
  const effectiveSearchRef = useRef(
    new URLSearchParams(searchParams.toString()),
  );

  // Single point for all silent URL writes — keeps effective refs in sync.
  const writeSilentUrl = useCallback(
    (newPath: string, newSearch: URLSearchParams, push = false): void => {
      effectivePathnameRef.current = newPath;
      effectiveSearchRef.current = newSearch;
      const url =
        newPath + (newSearch.toString() ? `?${newSearch.toString()}` : "");
      if (push) {
        silentHistory.pushState(url);
      } else {
        silentHistory.replaceState(url);
      }
    },
    [silentHistory],
  );

  const parseAdminSidebarPath = useCallback((): string[] => {
    const cat = effectiveSearchRef.current.get("cat");
    const sub = effectiveSearchRef.current.get("sub");
    if (cat && sub) {
      return [cat, sub];
    }
    if (cat) {
      return [cat];
    }
    return [];
  }, []);

  // Ref so the mount effect (below) can access urlNavStack which is declared later.
  const urlNavStackRef = useRef<ReturnType<typeof useUrlNavStack>>(undefined);
  // Guard so the seed-on-mount effect only runs once.
  const didSeedRef = useRef(false);

  // Resolve initial base endpoint from URL on mount.
  // When the URL has endpoint-specific params (e.g. ?id=xxx after a page refresh
  // at a deep path like leads/lead/[id]), seed the nav stack so the params are applied.
  useEffect(() => {
    if (didSeedRef.current) {
      return;
    }
    didSeedRef.current = true;
    if (!isAdminLayout) {
      return;
    }
    const pathParts = pathnameRef.current.split("/");
    const toolsIdx = pathParts.indexOf("tools");
    const toolSlug =
      toolsIdx !== -1 ? pathParts.slice(toolsIdx + 1).join("/") : "";
    const toolToLoad = toolSlug || null;

    if (toolToLoad) {
      void (async (): Promise<void> => {
        const endpointDef = await resolveEndpoint(toolToLoad);
        if (endpointDef) {
          setSelectedAdminEndpoint(endpointDef);
          // Collect endpoint-specific params from search (non-filter keys).
          const params: Record<string, string> = {};
          searchParamsRef.current.forEach((v, k) => {
            if (!FILTER_PARAM_KEYS.has(k)) {
              params[k] = v;
            }
          });
          if (Object.keys(params).length > 0) {
            // Determine which params are path params vs data params.
            const pathParamKeys = new Set(
              endpointDef.path
                .filter((s) => s.startsWith("["))
                .map((s) => s.slice(1, -1)),
            );
            const urlPathParams: Record<string, string> = {};
            const data: Record<string, string> = {};
            for (const [k, v] of Object.entries(params)) {
              if (pathParamKeys.has(k)) {
                urlPathParams[k] = v;
              } else {
                data[k] = v;
              }
            }
            urlNavStackRef.current?._seedStack({
              endpoint: endpointDef,
              params: {
                urlPathParams:
                  Object.keys(urlPathParams).length > 0
                    ? urlPathParams
                    : undefined,
                data: Object.keys(data).length > 0 ? data : undefined,
              },
              timestamp: Date.now(),
            });
          }
        }
      })();
    }
  }, [isAdminLayout, setSelectedAdminEndpoint]);

  // ── Admin tool-pane navigation stack (URL-synced) ──────────────────────────
  // Each nav push/replace encodes the ACTIVE endpoint as:
  //   path:   /tools/<alias>
  //   search: ?<urlPathParams + primitive data fields>  (help tool params preserved)
  // Pop = real browser back. No ?nav= stacking.

  // URL structure: /en-US/tools/<alias>?<search>
  // One alias in the path at all times — tool selection AND nav push both just
  // replace/push that single alias. No nesting.

  // Build a URL for a nav stack entry. Also updates effectiveSearchRef when entry params
  // are applied, so subsequent reads see the new state.
  const buildNavEntryUrl = useCallback(
    (
      entry: { alias: string; params: Record<string, string> } | null,
    ): string => {
      const sp = new URLSearchParams(effectiveSearchRef.current.toString());
      if (entry) {
        for (const [k, v] of Object.entries(entry.params)) {
          sp.set(k, v);
        }
        const path = `/${locale}/${ADMIN_ENDPOINTS_PATH}/${entry.alias}`;
        // Update effective refs eagerly so other reads see the new state.
        effectivePathnameRef.current = path;
        effectiveSearchRef.current = sp;
        return path + (sp.toString() ? `?${sp.toString()}` : "");
      }
      return (
        effectivePathnameRef.current +
        (sp.toString() ? `?${sp.toString()}` : "")
      );
    },
    [locale, effectiveSearchRef, effectivePathnameRef],
  );

  // Read the active endpoint alias from the URL path segment after /tools/.
  // Returns null when there is no alias (base /tools page).
  const readActiveEntry = useCallback((): {
    alias: string;
    params: Record<string, string>;
  } | null => {
    const pathParts = effectivePathnameRef.current.split("/");
    const toolsIdx = pathParts.indexOf("tools");
    // Collect all segments after /tools/ to support deep paths (path+method fallback)
    const alias =
      toolsIdx !== -1 ? pathParts.slice(toolsIdx + 1).join("/") : "";
    if (!alias) {
      return null;
    }
    const params: Record<string, string> = {};
    effectiveSearchRef.current.forEach((v, k) => {
      if (!FILTER_PARAM_KEYS.has(k)) {
        params[k] = v;
      }
    });
    return { alias, params };
  }, []);

  // navHistory wraps writeSilentUrl so effectiveSearchRef stays in sync on push/replace.
  // back() uses window.history directly — popstate handler restores refs from the real URL.
  const navHistory = {
    pushState: (url: string): void => {
      const u = new URL(url, getCurrentOrigin());
      effectivePathnameRef.current = u.pathname;
      effectiveSearchRef.current = new URLSearchParams(u.search);
      silentHistory.pushState(url);
    },
    replaceState: (url: string): void => {
      const u = new URL(url, getCurrentOrigin());
      effectivePathnameRef.current = u.pathname;
      effectiveSearchRef.current = new URLSearchParams(u.search);
      silentHistory.replaceState(url);
    },
    back: (): void => {
      historyBack();
    },
  };

  const subscribePopState = useCallback((handler: () => void): (() => void) => {
    const wrappedHandler = (): void => {
      // Restore effective refs from the real browser URL on back/forward.
      effectivePathnameRef.current = getCurrentPathname();
      effectiveSearchRef.current = new URLSearchParams(getCurrentSearch());
      handler();
    };
    return addWindowListener("popstate", wrappedHandler);
  }, []);

  const urlNavStack = useUrlNavStack({
    enabled: isAdminLayout,
    history: navHistory,
    buildUrl: buildNavEntryUrl,
    readActiveEntry,
    onPopState: subscribePopState,
    onStackRestored: useCallback(
      (restored: NavigationStackEntry | null): void => {
        setSidebarPathRaw(parseAdminSidebarPath());
        if (!restored) {
          // Back at base — resolve base endpoint from path (join all segments after /tools/)
          const pathParts = effectivePathnameRef.current.split("/");
          const toolsIdx = pathParts.indexOf("tools");
          const toolSlug =
            toolsIdx !== -1 ? pathParts.slice(toolsIdx + 1).join("/") : "";
          if (toolSlug) {
            void (async (): Promise<void> => {
              const endpointDef = await resolveEndpoint(toolSlug);
              setSelectedAdminEndpoint(endpointDef ?? null);
            })();
          } else {
            setSelectedAdminEndpoint(null);
          }
        }
      },
      [parseAdminSidebarPath, setSelectedAdminEndpoint],
    ),
  });
  urlNavStackRef.current = urlNavStack;

  // selectedAdminEndpoint is ONLY changed by:
  //   1. handleOpenTool (sidebar click → sets base endpoint, clears nav stack)
  //   2. onStackRestored (browser back → resolves base endpoint from URL)
  //   3. Initial mount (resolveEndpoint from URL path)
  //
  // Sub-navigations within EndpointsPage (pickers, create forms) push to urlNavStack
  // but must NOT change selectedAdminEndpoint — that would change the key prop and
  // cause a full remount, wiping the UI state.

  const [adminSidebarCollapsed, setAdminSidebarCollapsed] = useSidebarCollapsed(
    "admin-endpoints-sidebar",
  );
  const [localeDialogOpen, setLocaleDialogOpen] = useState(false);
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 930;

  const translationContext = useTranslation();

  // ── Active favorite tool config (cascade: favorite → skill → system defaults) ──

  // Load settings to get activeFavoriteId
  const settingsState = useEndpoint(
    settingsDefinition,
    useMemo(
      () => ({
        read: {
          queryOptions: {
            enabled: !user?.isPublic,
            refetchOnWindowFocus: false,
          },
        },
      }),
      [user?.isPublic],
    ),
    logger,
    user,
  );
  const activeFavoriteId = useMemo(
    () => settingsState.read?.data?.activeFavoriteId ?? null,
    [settingsState.read?.data],
  );
  const settingsLoaded = useMemo(
    () => settingsState.read?.data !== undefined,
    [settingsState.read?.data],
  );

  // When no activeFavoriteId is set in settings, fall back to the first favorite in the list.
  // This lets the tool toggles work even if the user hasn't explicitly selected a favorite.
  const favoritesListState = useEndpoint(
    favoritesListDefinition,
    useMemo(
      () => ({
        read: {
          queryOptions: {
            enabled:
              !user?.isPublic && settingsLoaded && activeFavoriteId === null,
            refetchOnWindowFocus: false,
          },
        },
      }),
      [user?.isPublic, settingsLoaded, activeFavoriteId],
    ),
    logger,
    user,
  );
  const effectiveFavoriteId = useMemo(
    () =>
      activeFavoriteId ??
      favoritesListState.read?.data?.favorites[0]?.id ??
      null,
    [activeFavoriteId, favoritesListState.read?.data],
  );

  // Web sidebar pinned tools — separate from AI pinnedTools on favorites
  const webPinnedTools = useMemo(
    () => settingsState.read?.data?.webPinnedTools ?? null,
    [settingsState.read?.data],
  );

  const setWebPinnedTools = useCallback(
    (tools: string[] | null): void => {
      if (user?.isPublic) {
        return;
      }
      // Optimistic update
      apiClient.updateEndpointData(settingsDefinition.GET, logger, (prev) => {
        if (!prev?.success) {
          return prev;
        }
        return { success: true, data: { ...prev.data, webPinnedTools: tools } };
      });
      void apiClient.mutate(
        settingsDefinition.POST,
        logger,
        user,
        { webPinnedTools: tools },
        undefined,
        locale,
      );
    },
    [user, logger, locale],
  );

  // Load active favorite's tool config
  const favoriteState = useEndpoint(
    favoriteByIdDefinition,
    useMemo(
      () => ({
        read: {
          urlPathParams: effectiveFavoriteId
            ? { id: effectiveFavoriteId }
            : { id: "" },
          queryOptions: {
            enabled: !user?.isPublic && !!effectiveFavoriteId,
            refetchOnWindowFocus: false,
          },
        },
      }),
      [effectiveFavoriteId, user?.isPublic],
    ),
    logger,
    user,
  );
  const activeFavoriteData = useMemo(
    () => favoriteState.read?.data ?? null,
    [favoriteState.read?.data],
  );

  // ── Tool config persistence ───────────────────────────────────────────────
  // pinnedTools and availableTools are independent — save them separately so
  // each operation only writes the field it actually changed.
  // null = "inherit defaults / no restriction" — always preserved as-is unless
  // the user explicitly changed that specific field.

  const savePinnedTools = useCallback(
    (
      pinnedTools: Array<{
        toolId: string;
        requiresConfirmation: boolean;
      }> | null,
    ): void => {
      if (!effectiveFavoriteId || user?.isPublic || !activeFavoriteData) {
        return;
      }
      apiClient.updateEndpointData(
        favoriteByIdDefinition.GET,
        logger,
        (prev) => {
          if (!prev?.success) {
            return undefined;
          }
          return {
            success: true as const,
            data: { ...prev.data, pinnedTools },
          };
        },
        { urlPathParams: { id: effectiveFavoriteId } },
      );
      void apiClient.mutate(
        favoriteByIdDefinition.PATCH,
        logger,
        user,
        { pinnedTools, modelSelection: activeFavoriteData.modelSelection },
        { id: effectiveFavoriteId },
        locale,
      );
    },
    [effectiveFavoriteId, activeFavoriteData, user, logger, locale],
  );

  const saveAvailableTools = useCallback(
    (
      availableTools: Array<{
        toolId: string;
        requiresConfirmation: boolean;
      }> | null,
    ): void => {
      if (!effectiveFavoriteId || user?.isPublic || !activeFavoriteData) {
        return;
      }
      apiClient.updateEndpointData(
        favoriteByIdDefinition.GET,
        logger,
        (prev) => {
          if (!prev?.success) {
            return undefined;
          }
          return {
            success: true as const,
            data: { ...prev.data, availableTools },
          };
        },
        { urlPathParams: { id: effectiveFavoriteId } },
      );
      void apiClient.mutate(
        favoriteByIdDefinition.PATCH,
        logger,
        user,
        { availableTools, modelSelection: activeFavoriteData.modelSelection },
        { id: effectiveFavoriteId },
        locale,
      );
    },
    [effectiveFavoriteId, activeFavoriteData, user, logger, locale],
  );

  // Reset both tool lists to null (inherit defaults) at once
  const resetToolConfig = useCallback((): void => {
    if (!effectiveFavoriteId || user?.isPublic || !activeFavoriteData) {
      return;
    }
    apiClient.updateEndpointData(
      favoriteByIdDefinition.GET,
      logger,
      (prev) => {
        if (!prev?.success) {
          return prev;
        }
        return {
          success: true,
          data: { ...prev.data, pinnedTools: null, availableTools: null },
        };
      },
      { urlPathParams: { id: effectiveFavoriteId } },
    );
    void apiClient.mutate(
      favoriteByIdDefinition.PATCH,
      logger,
      user,
      {
        pinnedTools: null,
        availableTools: null,
        modelSelection: activeFavoriteData.modelSelection,
      },
      { id: effectiveFavoriteId },
      locale,
    );
  }, [effectiveFavoriteId, activeFavoriteData, user, logger, locale]);
  const { t } = scopedTranslation.scopedT(locale);

  const searchQuery = form.watch("query") ?? "";
  const statsFilter =
    form.watch("statsFilter") ?? (isAdminLayout ? "webPinned" : "pinned");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  // Admin launcher sidebar navigation: path of [catKey] or [catKey, subKey]
  // Initialized from URL search params so state survives reload and back/forward.
  const [sidebarPath, setSidebarPathRaw] = useState<string[]>(() =>
    isAdminLayout ? parseAdminSidebarPath() : [],
  );

  // Stable refs for functions declared later — allows setSidebarPath to call them
  // without a forward-declaration error (all are assigned before any render call).
  const syncFilterParamsToUrlRef = useRef<
    (overrides?: Partial<HelpGetRequestInput>) => void
  >(() => undefined);
  const triggerRefetchRef = useRef<() => void>(() => undefined);
  const handleOpenToolRef = useRef<(toolName: string) => Promise<void>>(
    async () => undefined,
  );

  const setSidebarPath = useCallback(
    (path: string[], catValue?: string, defaultEntryAlias?: string): void => {
      setSidebarPathRaw(path);
      if (isAdminLayout) {
        const sp = new URLSearchParams(effectiveSearchRef.current.toString());
        if (path[0]) {
          sp.set("cat", path[0]);
        } else {
          sp.delete("cat");
        }
        if (path[1]) {
          sp.set("sub", path[1]);
        } else {
          sp.delete("sub");
        }
        writeSilentUrl(effectivePathnameRef.current, sp);
        // Open the category's default endpoint in the main pane immediately.
        if (defaultEntryAlias) {
          void handleOpenToolRef.current(defaultEntryAlias);
        }
      }
      // Sync category form field so the server filters tools for this category.
      // catValue is the actual value to filter by (e.g. catDef.key or subCategory name).
      // When clearing (path=[]), clear the category field too.
      form.setValue("category", catValue ?? undefined);
      syncFilterParamsToUrlRef.current({ category: catValue ?? undefined });
      setTimeout(triggerRefetchRef.current, 50);
    },
    [isAdminLayout, writeSilentUrl, form],
  );

  // Browser Back/Forward is handled by useUrlNavStack hook.
  // The onPopState callback restores sidebar path and base endpoint.

  // Vibe-frame overlay for remote tool execution
  const [vibeFrame, setVibeFrame] = useState<{
    serverUrl: string;
    endpoint: string;
  } | null>(null);

  const response = useWidgetValue<typeof definition.GET>();
  const isFetching = endpointMutations?.read?.isFetching ?? false;
  const availableTools: HelpToolMetadataSerialized[] = useMemo(
    () => response?.tools ?? [],
    [response],
  );
  const totalCount = response?.totalCount ?? 0;
  const serverPinnedCount = response?.pinnedCount;
  const serverAllowedCount = response?.allowedCount;
  const serverCliAllowedCount = response?.cliAllowedCount;
  const serverMcpPinnedCount = response?.mcpPinnedCount;
  const serverMcpAllowedCount = response?.mcpAllowedCount;
  // All AI-platform tool IDs — used when materializing an explicit allowlist from null.
  const allAiToolIds: string[] = useMemo(
    () => response?.allAiToolIds ?? [],
    [response],
  );
  // Skill-level defaults — the middle layer of the cascade (fav → skill → role defaults).
  // null means the skill has no restriction → fall through to role defaults.
  const skillPinnedDefault: string[] | null =
    response?.skillPinnedDefault ?? null;
  const skillAllowedDefault: string[] | null =
    response?.skillAllowedDefault ?? null;
  const categories = response?.categories ?? [];
  const hint = response?.hint;

  // Track whether there's ever been a successful response — used to distinguish
  // "first load" (show nothing) from "refetch in progress" (show stale + overlay).
  const hasLoadedOnce = useRef(false);
  if (response) {
    hasLoadedOnce.current = true;
  }

  // Admin context from response
  const currentPlatform = response?.currentPlatform;
  const currentEnv = response?.currentEnv;

  // Check if user has admin role (for initial render before response comes back)
  const isAdminUser = useMemo(
    () => !user?.isPublic && user?.roles?.includes(UserPermissionRole.ADMIN),
    [user],
  );

  // prodOnly / instanceId - read from form (already requestFields in definition)
  const prodOnly = form.watch("includeProdOnly") ?? false;
  const activeViewAsRole = form.watch("viewAsRole");

  // Instance switcher - fetch connected remote instances
  const activeInstanceId = form.watch("instanceId");
  const endpointOptions = useMemo(() => {
    return {
      read: {
        formOptions: {
          defaultValues: { activeOnly: true },
        },
        queryOptions: {
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000,
          enabled: isAdminUser,
        },
      },
    };
  }, [isAdminUser]);
  const connectionsState = useEndpoint(
    remoteConnectionListDefinition,
    endpointOptions,
    logger,
    user,
  );
  const connectedInstances = useMemo(() => {
    const resp = connectionsState?.read?.response;
    if (!resp || resp.success !== true) {
      return [];
    }
    return resp.data.connections;
  }, [connectionsState?.read?.response]);

  const effectiveEnabledTools = useMemo((): EnabledTool[] => {
    // Cascade: active favorite → skill → role defaults
    const favPinned = activeFavoriteData?.pinnedTools ?? null;
    const favAllowed = activeFavoriteData?.availableTools ?? null;

    // Build requiresConfirmation lookup from favorite's config (pinned takes precedence)
    const favConfirmMap = new Map<string, boolean>();
    if (favPinned) {
      for (const item of favPinned) {
        favConfirmMap.set(item.toolId, item.requiresConfirmation ?? false);
      }
    }
    if (favAllowed) {
      for (const item of favAllowed) {
        if (!favConfirmMap.has(item.toolId)) {
          favConfirmMap.set(item.toolId, item.requiresConfirmation ?? false);
        }
      }
    }

    // Pinned set: fav → skill's pinnedTools → role defaults
    const pinnedSet: Set<string> =
      favPinned !== null
        ? new Set(favPinned.map((item) => item.toolId))
        : skillPinnedDefault !== null
          ? new Set(skillPinnedDefault)
          : new Set(getDefaultToolIdsForUser(user));

    // Allowed set: fav → skill's availableTools → null (all allowed)
    const allowedSet: Set<string> | null =
      favAllowed !== null
        ? new Set(favAllowed.map((item) => item.toolId))
        : skillAllowedDefault !== null
          ? new Set(skillAllowedDefault)
          : null;

    return availableTools
      .filter((tool) => {
        const id = tool.id ?? tool.name;
        return allowedSet === null || allowedSet.has(id);
      })
      .map((tool) => {
        const id = tool.id ?? tool.name;
        return {
          id,
          requiresConfirmation:
            favConfirmMap.get(id) ?? tool.requiresConfirmation ?? false,
          pinned: pinnedSet.has(id),
        };
      });
  }, [
    activeFavoriteData,
    availableTools,
    user,
    skillPinnedDefault,
    skillAllowedDefault,
  ]);

  // For public users, server returns all tools and we filter client-side from localStorage.
  // For authenticated users, server already applied the statsFilter.
  const visibleTools = useMemo((): HelpToolMetadataSerialized[] => {
    if (!user?.isPublic) {
      return availableTools;
    }
    if (statsFilter === "pinned") {
      return availableTools.filter((tool) =>
        effectiveEnabledTools.some(
          (et) => et.id === (tool.id ?? tool.name) && et.pinned,
        ),
      );
    }
    if (statsFilter === "allowed") {
      return availableTools.filter((tool) =>
        effectiveEnabledTools.some((et) => et.id === (tool.id ?? tool.name)),
      );
    }
    if (statsFilter === "webPinned") {
      const webPins = new Set(
        webPinnedTools ?? (user ? getDefaultWebPinnedIdsForUser(user) : []),
      );
      return availableTools.filter((tool) => webPins.has(tool.id ?? tool.name));
    }
    return availableTools;
  }, [
    user,
    availableTools,
    statsFilter,
    effectiveEnabledTools,
    webPinnedTools,
  ]);

  const toolsByCategory = useMemo(() => {
    const grouped: Record<
      string,
      {
        tools: HelpToolMetadataSerialized[];
        subcategories: Record<string, HelpToolMetadataSerialized[]>;
      }
    > = {};
    for (const tool of visibleTools) {
      // category is omitted on compact (AI/MCP) payloads; web always sets it,
      // but fall back so the grouping is total.
      const category = tool.category ?? "";
      if (!grouped[category]) {
        grouped[category] = { tools: [], subcategories: {} };
      }
      grouped[category].tools.push(tool);
      const subKey = tool.subCategory ?? getSubcategory(tool.id ?? tool.name);
      if (!grouped[category].subcategories[subKey]) {
        grouped[category].subcategories[subKey] = [];
      }
      grouped[category].subcategories[subKey].push(tool);
    }
    return grouped;
  }, [visibleTools]);

  // Build lookup: registry key → CategoryDefinitionSerialized (for admin layout)
  const categoryByKey = useMemo((): Map<
    string,
    CategoryDefinitionSerialized
  > => {
    const map = new Map<string, CategoryDefinitionSerialized>();
    for (const cat of CATEGORY_REGISTRY) {
      map.set(cat.key, cat);
    }
    return map;
  }, []);

  // Group tools by AdminGroup via direct category key match
  const toolsByGroup = useMemo((): Map<
    string,
    {
      catDef: CategoryDefinitionSerialized;
      tools: HelpToolMetadataSerialized[];
    }[]
  > => {
    const map = new Map<
      string,
      {
        catDef: CategoryDefinitionSerialized;
        tools: HelpToolMetadataSerialized[];
      }[]
    >();
    const byCatKey = new Map<string, HelpToolMetadataSerialized[]>();

    for (const tool of visibleTools) {
      // Direct key match - category is now a plain key (e.g. "ai", "userAuth")
      const registryKey: string | undefined = tool.category;
      const catDef = registryKey ? categoryByKey.get(registryKey) : undefined;
      const bucket = catDef?.key ?? "__other__";
      if (!byCatKey.has(bucket)) {
        byCatKey.set(bucket, []);
      }
      byCatKey.get(bucket)!.push(tool);
    }

    for (const group of ADMIN_GROUPS) {
      const entries: {
        catDef: CategoryDefinitionSerialized;
        tools: HelpToolMetadataSerialized[];
      }[] = [];
      for (const catDef of CATEGORY_REGISTRY) {
        if (catDef.group !== group) {
          continue;
        }
        const tools = byCatKey.get(catDef.key) ?? [];
        if (tools.length > 0) {
          entries.push({ catDef, tools });
        }
      }
      if (entries.length > 0) {
        map.set(group, entries);
      }
    }

    // Uncategorized → append to system group
    const otherTools = byCatKey.get("__other__") ?? [];
    if (otherTools.length > 0) {
      const otherCat: CategoryDefinitionSerialized = {
        key: "__other__",
        label: "Other",
        labels: {},
        group: "system",
        icon: "zap",
        order: 999,
      };
      const existing = map.get("system") ?? [];
      map.set("system", [...existing, { catDef: otherCat, tools: otherTools }]);
    }

    return map;
  }, [visibleTools, categoryByKey]);

  // Stable counts that don't reset to 0 while a refetch is in progress.
  // Updated only when a settled (non-fetching) response arrives.
  const [stablePinnedCount, setStablePinnedCount] = useState<
    number | undefined
  >(undefined);
  const [stableAllowedCount, setStableAllowedCount] = useState<
    number | undefined
  >(undefined);
  const [stableCliAllowedCount, setStableCliAllowedCount] = useState<
    number | undefined
  >(undefined);
  const [stableMcpPinnedCount, setStableMcpPinnedCount] = useState<
    number | undefined
  >(undefined);
  const [stableMcpAllowedCount, setStableMcpAllowedCount] = useState<
    number | undefined
  >(undefined);
  const [stableTotalCount, setStableTotalCount] = useState(0);
  const [stableAiToolIds, setStableAiToolIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isFetching && response) {
      setStablePinnedCount(serverPinnedCount);
      setStableAllowedCount(serverAllowedCount);
      setStableCliAllowedCount(serverCliAllowedCount);
      setStableMcpPinnedCount(serverMcpPinnedCount);
      setStableMcpAllowedCount(serverMcpAllowedCount);
      setStableTotalCount(totalCount);
      setStableAiToolIds(allAiToolIds);
    }
  }, [
    isFetching,
    response,
    serverPinnedCount,
    serverAllowedCount,
    serverCliAllowedCount,
    serverMcpPinnedCount,
    serverMcpAllowedCount,
    totalCount,
    allAiToolIds,
  ]);

  const stats = useMemo(() => {
    // Counts must cover ALL tools, not just the current filtered subset.
    // Derive from favorite config directly — not effectiveEnabledTools which is
    // built from availableTools (already subset-filtered by statsFilter).
    // Optimistic updates on activeFavoriteData are reflected immediately.
    const favPinned = activeFavoriteData?.pinnedTools ?? null;

    // pinned: use favorite's pinned list length if set, else stable server count, else defaults
    const pinned =
      favPinned !== null
        ? favPinned.length
        : (stablePinnedCount ?? getDefaultToolIdsForUser(user).length);

    // enabled: server computes this correctly (cascade: favorite → skill → all AI tools).
    // Use stable count so it doesn't vanish during a filter-tab refetch.
    const enabled =
      stableAllowedCount ??
      (stableAiToolIds.length > 0 ? stableAiToolIds.length : stableTotalCount);

    // webPinned: always from local state (optimistically updated)
    const webPinned = (
      webPinnedTools ?? (user ? getDefaultWebPinnedIdsForUser(user) : [])
    ).length;

    return {
      pinned,
      enabled,
      webPinned,
      total: stableTotalCount,
      cliAllowed: stableCliAllowedCount,
      mcpPinned: stableMcpPinnedCount,
      mcpAllowed: stableMcpAllowedCount,
    };
  }, [
    activeFavoriteData,
    webPinnedTools,
    user,
    stablePinnedCount,
    stableAllowedCount,
    stableCliAllowedCount,
    stableMcpPinnedCount,
    stableMcpAllowedCount,
    stableTotalCount,
    stableAiToolIds,
  ]);

  const allVisibleEnabled = useMemo(
    () =>
      visibleTools.length > 0 &&
      visibleTools.every((tool) =>
        effectiveEnabledTools.some((et) => et.id === (tool.id ?? tool.name)),
      ),
    [visibleTools, effectiveEnabledTools],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  // Each handler derives its state from activeFavoriteData (the DB source of truth),
  // never from effectiveEnabledTools (which is limited to the current filtered view).
  // null = "inherit defaults / no restriction".

  const handleToggleEnabled = (toolName: string): void => {
    if (activeInstanceId) {
      return;
    }
    // availableTools: null = all tools allowed. Toggling one off materialises the
    // full AI tool list minus that tool. Toggling one on adds it back.
    const favAllowed = activeFavoriteData?.availableTools ?? null;
    if (favAllowed === null) {
      // Currently unrestricted — disabling one tool: materialise from ALL AI tools minus it.
      // Must use allAiToolIds (server-provided), not just the visible page subset.
      const next = allAiToolIds
        .filter((id) => id !== toolName)
        .map((id) => ({ toolId: id, requiresConfirmation: false }));
      saveAvailableTools(next);
    } else {
      const existingIdx = favAllowed.findIndex(
        (entry) => entry.toolId === toolName,
      );
      if (existingIdx !== -1) {
        saveAvailableTools(
          favAllowed.filter((entry) => entry.toolId !== toolName),
        );
      } else {
        saveAvailableTools([
          ...favAllowed,
          { toolId: toolName, requiresConfirmation: false },
        ]);
      }
    }
    setTimeout(triggerRefetchRef.current, 300);
  };

  const handleToggleActive = (toolName: string): void => {
    if (activeInstanceId) {
      return;
    }
    // pinnedTools cascade: fav → skill's pinnedDefault → role defaults.
    const favPinned = activeFavoriteData?.pinnedTools ?? null;
    const basePinnedIds: readonly string[] =
      skillPinnedDefault !== null
        ? skillPinnedDefault
        : getDefaultToolIdsForUser(user);
    const currentPinned: Array<{
      toolId: string;
      requiresConfirmation: boolean;
    }> =
      favPinned ??
      basePinnedIds.map((id) => ({
        toolId: id,
        requiresConfirmation: false,
      }));
    const existingIdx = currentPinned.findIndex(
      (entry) => entry.toolId === toolName,
    );
    const next =
      existingIdx !== -1
        ? currentPinned.filter((entry) => entry.toolId !== toolName)
        : [...currentPinned, { toolId: toolName, requiresConfirmation: false }];
    savePinnedTools(next);
    setTimeout(triggerRefetchRef.current, 300);
  };

  const handleToggleConfirmation = (toolName: string): void => {
    if (activeInstanceId) {
      return;
    }
    // requiresConfirmation is stored in pinnedTools (for pinned tools) and/or
    // availableTools (for explicitly-allowed tools). We update whichever lists
    // the tool actually appears in. Never materialize a null list just for rc —
    // that would incorrectly restrict previously-unrestricted tool access.
    const favPinned = activeFavoriteData?.pinnedTools ?? null;
    const favAllowed = activeFavoriteData?.availableTools ?? null;

    // Derive current rc from whichever explicit list has it, or false.
    const currentRc =
      favPinned?.find((e) => e.toolId === toolName)?.requiresConfirmation ??
      favAllowed?.find((e) => e.toolId === toolName)?.requiresConfirmation ??
      false;
    const nextRc = !currentRc;

    let savedSomething = false;

    // Update pinnedTools if the tool is explicitly there.
    if (favPinned !== null && favPinned.some((e) => e.toolId === toolName)) {
      savePinnedTools(
        favPinned.map((e) =>
          e.toolId === toolName ? { ...e, requiresConfirmation: nextRc } : e,
        ),
      );
      savedSomething = true;
    }

    // Update availableTools if the tool is explicitly there.
    if (favAllowed !== null && favAllowed.some((e) => e.toolId === toolName)) {
      saveAvailableTools(
        favAllowed.map((e) =>
          e.toolId === toolName ? { ...e, requiresConfirmation: nextRc } : e,
        ),
      );
      savedSomething = true;
    }

    // Tool is in neither explicit list. Prefer writing to availableTools since
    // requiresConfirmation is an "allowed tool" concern. Materialize from
    // allAiToolIds (same base as handleToggleEnabled) with rc set for this tool.
    // This avoids polluting pinnedTools with non-pinned tools.
    if (!savedSomething) {
      const base = allAiToolIds.map((id) => ({
        toolId: id,
        requiresConfirmation: id === toolName ? nextRc : false,
      }));
      saveAvailableTools(base);
    }

    setTimeout(triggerRefetchRef.current, 300);
  };

  const handleEnableAll = (): void => {
    if (activeInstanceId) {
      return;
    }
    const allIds = visibleTools.map((tool) => tool.id ?? tool.name);
    const favAllowed = activeFavoriteData?.availableTools ?? null;
    const allEnabled = allIds.every(
      (id) =>
        favAllowed === null || favAllowed.some((entry) => entry.toolId === id),
    );
    if (allEnabled) {
      // Disable all visible: remove them from the allowed list (or materialise minus all)
      if (favAllowed === null) {
        const next = availableTools
          .filter((m) => !allIds.includes(m.id ?? m.name))
          .map((m) => ({
            toolId: m.id ?? m.name,
            requiresConfirmation: m.requiresConfirmation ?? false,
          }));
        saveAvailableTools(next);
      } else {
        saveAvailableTools(
          favAllowed.filter((entry) => !allIds.includes(entry.toolId)),
        );
      }
    } else {
      // Enable all visible: add missing ones (only relevant when favAllowed is not null)
      if (favAllowed !== null) {
        const toAdd = allIds
          .filter((id) => !favAllowed.some((entry) => entry.toolId === id))
          .map((id) => {
            const m = availableTools.find(
              (tool) => (tool.id ?? tool.name) === id,
            );
            return {
              toolId: id,
              requiresConfirmation: m?.requiresConfirmation ?? false,
            };
          });
        if (toAdd.length > 0) {
          saveAvailableTools([...favAllowed, ...toAdd]);
        }
      }
    }
  };

  const handleResetToDefault = (): void => {
    if (isAdminLayout) {
      setWebPinnedTools(null);
      saveAvailableTools(null);
    }
    resetToolConfig();
  };

  const isManuallyCustomized = isAdminLayout
    ? webPinnedTools !== null
    : ((): boolean => {
        const fav = activeFavoriteData;
        if (!fav) {
          return false;
        }
        if ((fav.availableTools ?? null) !== null) {
          return true;
        }
        const fp = fav.pinnedTools ?? null;
        if (fp === null) {
          return false;
        }
        const defIds: readonly string[] =
          skillPinnedDefault !== null
            ? skillPinnedDefault
            : getDefaultToolIdsForUser(user);
        if (fp.length !== defIds.length) {
          return true;
        }
        const fpSet = new Set(fp.map((p) => p.toolId));
        return defIds.some((id) => !fpSet.has(id));
      })();

  const toggleCategory = (category: string): void => {
    const next = new Set(expandedCategories);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    setExpandedCategories(next);
  };

  const toggleCategoryTools = (tools: HelpToolMetadataSerialized[]): void => {
    const ids = tools.map((tool) => tool.id ?? tool.name);
    const favAllowed = activeFavoriteData?.availableTools ?? null;
    const allEnabled = ids.every(
      (id) =>
        favAllowed === null || favAllowed.some((entry) => entry.toolId === id),
    );
    if (allEnabled) {
      if (favAllowed === null) {
        // Materialize from the cascade base (allAiToolIds = skill list or all AI tools),
        // not from the visible page subset (availableTools only covers the current filter view).
        const next = allAiToolIds
          .filter((id) => !ids.includes(id))
          .map((id) => {
            const m = availableTools.find(
              (tool) => (tool.id ?? tool.name) === id,
            );
            return {
              toolId: id,
              requiresConfirmation: m?.requiresConfirmation ?? false,
            };
          });
        saveAvailableTools(next);
      } else {
        saveAvailableTools(
          favAllowed.filter((entry) => !ids.includes(entry.toolId)),
        );
      }
    } else if (favAllowed !== null) {
      const toAdd = tools
        .filter(
          (tool) =>
            !favAllowed.some(
              (entry) => entry.toolId === (tool.id ?? tool.name),
            ),
        )
        .map((tool) => ({
          toolId: tool.id ?? tool.name,
          requiresConfirmation: tool.requiresConfirmation ?? false,
        }));
      if (toAdd.length > 0) {
        saveAvailableTools([...favAllowed, ...toAdd]);
      }
    }
  };

  const handleOpenTool = useCallback(
    async (toolName: string): Promise<void> => {
      // Remote tool: instanceId__toolName → embed via vibe-frame if possible
      const sepIdx = toolName.indexOf("__");
      if (sepIdx !== -1) {
        const instanceId = toolName.slice(0, sepIdx);
        const bareToolName = toolName.slice(sepIdx + 2);
        const conn = connectedInstances.find(
          (c) => c.instanceId === instanceId,
        );
        const serverUrl = conn?.localUrl ?? conn?.remoteUrl;
        if (serverUrl) {
          setVibeFrame({ serverUrl, endpoint: bareToolName });
          return;
        }
        // Fallback: no server URL known - navigate to execute-tool
        const { getEndpoint } = await import("@/generated/endpoints/endpoint");
        const executeTool = await getEndpoint(EXECUTE_TOOL_ALIAS);
        if (executeTool) {
          navigate(executeTool, { data: { toolName } });
        }
        return;
      }

      // Admin layout: show endpoint in main pane + push URL history entry
      if (isAdminLayout) {
        const endpointDef = await resolveEndpoint(toolName);
        if (endpointDef) {
          const alias = endpointToUrlSegment(endpointDef);
          const current = selectedAdminEndpointRef.current;
          const currentAlias = current ? endpointToUrlSegment(current) : null;

          if (alias === currentAlias) {
            // Same base tool — if a sub-navigation is stacked (e.g. viewing a lead
            // while leads-list is the base), pop back to the base view.
            if (urlNavStack?.canGoBack) {
              urlNavStack._clearStack();
              // Build a clean URL: keep only filter params, drop endpoint-specific ones.
              const sp = new URLSearchParams();
              effectiveSearchRef.current.forEach((v, k) => {
                if (FILTER_PARAM_KEYS.has(k)) {
                  sp.set(k, v);
                }
              });
              const newPath = `/${locale}/${ADMIN_ENDPOINTS_PATH}/${alias}`;
              writeSilentUrl(newPath, sp, true);
            }
            return;
          }

          setSelectedAdminEndpoint(endpointDef);
          // Clear in-memory nav stack without triggering history.back().
          // Using pop() would fire popstate which reads the (not yet updated) URL
          // and immediately overwrite the endpoint we just set.
          urlNavStack?._clearStack();
          // Keep only filter params — endpoint-specific params (id, etc.) belong
          // to the previous tool and must not leak into the new tool's URL.
          const sp = new URLSearchParams();
          effectiveSearchRef.current.forEach((v, k) => {
            if (FILTER_PARAM_KEYS.has(k)) {
              sp.set(k, v);
            }
          });
          const newPath = `/${locale}/${ADMIN_ENDPOINTS_PATH}/${alias}`;
          writeSilentUrl(newPath, sp, true);
        }
        return;
      }

      await navigateToLocalTool(toolName, navigate);
    },
    [
      connectedInstances,
      isAdminLayout,
      locale,
      navigate,
      setSelectedAdminEndpoint,
      writeSilentUrl,
      urlNavStack,
    ],
  );

  handleOpenToolRef.current = handleOpenTool;

  // ── Admin navigation stack override ─────────────────────────────────────────
  // urlNavStack (from useUrlNavStack) is passed directly as navigationOverride
  // to EndpointsPage. It handles all push/pop/replace + URL sync.

  const triggerRefetch = useCallback((): void => {
    if (onSubmit) {
      onSubmit();
    } else {
      endpointMutations?.read?.remove?.();
      endpointMutations?.read?.refetch?.();
    }
  }, [onSubmit, endpointMutations]);
  triggerRefetchRef.current = triggerRefetch;

  // Write filter params to URL using the effective pathname (tracks silent pushes).
  // Called after any filter change so URL always reflects current state.
  const syncFilterParamsToUrl = useCallback(
    (overrides: Partial<HelpGetRequestInput> = {}): void => {
      if (!isAdminLayout) {
        return;
      }
      const values = { ...form.getValues(), ...overrides };
      // Start from effectiveSearchRef so cat/sub and other non-filter params are preserved.
      const sp = new URLSearchParams(effectiveSearchRef.current.toString());
      if (values.query) {
        sp.set("q", values.query);
      } else {
        sp.delete("q");
      }
      if (values.statsFilter && values.statsFilter !== "webPinned") {
        sp.set("sf", values.statsFilter);
      } else {
        sp.delete("sf");
      }
      if (values.includeProdOnly) {
        sp.set("prod", "1");
      } else {
        sp.delete("prod");
      }
      if (values.viewAsRole) {
        sp.set("view", values.viewAsRole);
      } else {
        sp.delete("view");
      }
      if (values.instanceId) {
        sp.set("inst", values.instanceId);
      } else {
        sp.delete("inst");
      }
      if (values.page && values.page > 1) {
        sp.set("p", String(values.page));
      } else {
        sp.delete("p");
      }
      if (values.pageSize) {
        sp.set("ps", String(values.pageSize));
      } else {
        sp.delete("ps");
      }
      writeSilentUrl(effectivePathnameRef.current, sp);
    },
    [form, isAdminLayout, writeSilentUrl],
  );
  syncFilterParamsToUrlRef.current = syncFilterParamsToUrl;

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const setSearchQuery = useCallback(
    (value: string) => {
      form.setValue("query", value || undefined);
      syncFilterParamsToUrl({ query: value || undefined });
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(triggerRefetch, 400);
    },
    [form, syncFilterParamsToUrl, triggerRefetch],
  );

  const handleInstanceChange = useCallback(
    (instanceId: string | undefined): void => {
      const newFilter = instanceId
        ? "all"
        : isAdminLayout
          ? "webPinned"
          : "pinned";
      form.setValue("instanceId", instanceId);
      // Remote instance: send "all" so server skips pinned filtering on snapshot tools.
      // Local: restore "pinned" default.
      form.setValue("statsFilter", newFilter, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      syncFilterParamsToUrl({ instanceId, statsFilter: newFilter });
      setTimeout(triggerRefetch, 50);
    },
    [form, syncFilterParamsToUrl, triggerRefetch, isAdminLayout],
  );

  const handleProdToggle = useCallback(
    (checked: boolean): void => {
      form.setValue("includeProdOnly", checked || undefined);
      syncFilterParamsToUrl({ includeProdOnly: checked || undefined });
      setTimeout(triggerRefetch, 50);
    },
    [form, syncFilterParamsToUrl, triggerRefetch],
  );

  const handleViewAsRoleChange = useCallback(
    (role: string): void => {
      const mapped =
        role === UserPermissionRole.PUBLIC
          ? UserPermissionRole.PUBLIC
          : role === UserPermissionRole.CUSTOMER
            ? UserPermissionRole.CUSTOMER
            : undefined;
      form.setValue("viewAsRole", mapped);
      syncFilterParamsToUrl({ viewAsRole: mapped });
      setTimeout(triggerRefetch, 50);
    },
    [form, syncFilterParamsToUrl, triggerRefetch],
  );

  const handleStatsFilterChange = useCallback(
    (
      filter:
        | "pinned"
        | "allowed"
        | "all"
        | "webPinned"
        | "cliAllowed"
        | "mcpPinned"
        | "mcpAllowed",
    ): void => {
      form.setValue("statsFilter", filter, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      syncFilterParamsToUrl({ statsFilter: filter });
      setTimeout(triggerRefetch, 50);
    },
    [form, syncFilterParamsToUrl, triggerRefetch],
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  // Shared filter chips — shown in non-admin (modal) mode only
  const filterChips = (
    <Div className="flex items-center gap-1.5 px-4 pt-4">
      {(
        [
          {
            key: "webPinned" as const,
            icon: Pin,
            label: t("aiTools.modal.webPinnedLabel"),
            count: stats.webPinned,
          },
          {
            key: "pinned" as const,
            icon: Eye,
            label: t("aiTools.modal.pinnedLabel"),
            count: stats.pinned,
          },
          {
            key: "allowed" as const,
            icon: Shield,
            label: t("aiTools.modal.enabledLabel"),
            count: stats.enabled,
          },
          {
            key: "all" as const,
            icon: null,
            label: t("aiTools.modal.totalLabel"),
            count: stats.total,
          },
        ] as const
      ).map(({ key, icon: FilterIcon, label, count }) => (
        <Button
          key={key}
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleStatsFilterChange(key)}
          className={cn(
            "h-7 px-2.5 gap-1.5 text-xs rounded-full transition-all border",
            statsFilter === key
              ? "bg-primary text-primary-foreground border-primary font-semibold hover:bg-primary/90 hover:text-primary-foreground"
              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-transparent",
          )}
        >
          {FilterIcon && <FilterIcon className="h-3 w-3 shrink-0" />}
          <Span className="tabular-nums font-bold">{count}</Span>
          <Span className="capitalize">{label}</Span>
        </Button>
      ))}
    </Div>
  );

  // Overview mode (no tools to show after filtering, just categories)
  // Skip for admin layout — the admin sidebar handles category navigation internally.
  if (!isAdminLayout && visibleTools.length === 0 && categories.length > 0) {
    return (
      <Div className="flex flex-col gap-0">
        {filterChips}
        <Div className="flex flex-col gap-3 p-4">
          {hint && <P className="text-xs text-muted-foreground">{hint}</P>}
          <Div className="flex flex-col gap-1">
            {categories.map(({ name, count }) => (
              <Div
                key={name}
                className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent cursor-pointer text-sm"
                onClick={(): void => {
                  void (async (): Promise<void> => {
                    const helpDef = await import("./definition");
                    navigate(helpDef.default.GET, {
                      data: { category: name },
                    });
                  })();
                }}
              >
                <Span className="capitalize">{name}</Span>
                <Badge variant="secondary" className="text-[10px]">
                  {count}
                </Badge>
              </Div>
            ))}
          </Div>
          <P className="text-xs text-muted-foreground text-center">
            {t("get.fields.totalCount.title")}: {totalCount}
          </P>
        </Div>
      </Div>
    );
  }

  // Detail mode: single tool with parameters — skip in admin layout (sidebar handles navigation)
  if (
    !isAdminLayout &&
    availableTools.length === 1 &&
    response?.matchedCount === 1
  ) {
    const tool = availableTools[0];
    return (
      <Div className="flex flex-col gap-4 p-4">
        <Div className="flex items-start gap-3">
          <Div className="flex-1 min-w-0">
            <Div className="flex items-center gap-2 flex-wrap">
              <Span className="font-bold text-base">{getToolLabel(tool)}</Span>
              {tool.aliases?.[0] && (
                <Badge variant="secondary" className="font-mono text-xs">
                  {tool.aliases[0]}
                </Badge>
              )}
            </Div>
            <P className="text-sm text-muted-foreground mt-1">
              {tool.description}
            </P>
            {tool.aliases && tool.aliases.length > 0 && (
              <P className="text-xs text-muted-foreground/70 mt-1">
                {t("get.fields.aliases.title")}: {tool.aliases.join(", ")}
              </P>
            )}
            {tool.platforms && tool.platforms.length > 0 && (
              <Div className="flex items-center gap-1 mt-2">
                <Span className="text-[11px] text-muted-foreground/60 mr-1">
                  {t("get.fields.platforms.title")}:
                </Span>
                {tool.platforms.map((p) => (
                  <Badge
                    key={p}
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0 font-mono",
                      p === Platform.CLI &&
                        "border-amber-500/30 text-amber-600",
                      p === Platform.MCP &&
                        "border-violet-500/30 text-violet-600",
                      p === Platform.AI && "border-blue-500/30 text-blue-600",
                      p === Platform.TRPC &&
                        "border-emerald-500/30 text-emerald-600",
                      p === Platform.CRON && "border-gray-500/30 text-gray-600",
                    )}
                  >
                    {p}
                  </Badge>
                ))}
              </Div>
            )}
          </Div>
        </Div>

        {tool.parameters && (
          <Div>
            <Span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("get.fields.parameters.title")}
            </Span>
            <Div className="mt-1 rounded-md bg-muted/50 p-3 text-xs font-mono overflow-x-auto">
              <Pre>{JSON.stringify(tool.parameters, null, 2)}</Pre>
            </Div>
          </Div>
        )}

        {!disabled && (
          <Button
            variant="default"
            size="sm"
            onClick={(): void => {
              void handleOpenTool(tool.id ?? tool.name);
            }}
          >
            {t("get.fields.openTool.label")}
          </Button>
        )}
      </Div>
    );
  }
  // ── Web pin helpers (shared between admin sidebar and modal) ─────────────────
  const webPinnedSet = new Set(
    webPinnedTools ?? (user ? getDefaultWebPinnedIdsForUser(user) : []),
  );
  const canPin = !user?.isPublic;

  const handleToggleWebPin = (toolId: string, e: ButtonMouseEvent): void => {
    e.stopPropagation();
    if (!canPin) {
      return;
    }
    const current =
      webPinnedTools ?? (user ? getDefaultWebPinnedIdsForUser(user) : []);
    if (webPinnedSet.has(toolId)) {
      setWebPinnedTools(current.filter((id) => id !== toolId));
    } else {
      setWebPinnedTools([...current, toolId]);
    }
    setTimeout(triggerRefetchRef.current, 300);
  };

  // Admin layout: two-pane sidebar browser
  if (isAdminLayout) {
    const selectedToolId = selectedAdminEndpoint
      ? endpointToUrlSegment(selectedAdminEndpoint)
      : null;

    // ── Launcher sidebar helpers ───────────────────────────────────────────────

    const isSearching = searchQuery.length > 0;
    const activeCatKey = sidebarPath[0];
    const activeSubKey = sidebarPath[1];
    const activeCat = activeCatKey
      ? categoryByKey.get(activeCatKey)
      : undefined;
    const categoryEntry = activeCatKey
      ? (toolsByGroup.get(activeCat?.group ?? "") ?? []).find(
          (e) => e.catDef.key === activeCatKey,
        )
      : undefined;

    const renderToolCell = (tool: HelpToolMetadataSerialized): JSX.Element => {
      const toolId = tool.id ?? tool.name;
      const isSelected =
        selectedToolId === toolId ||
        selectedToolId === (tool.aliases?.[0] ?? null);
      const isWebPinned = webPinnedSet.has(toolId);
      const enabledTool = effectiveEnabledTools.find((et) => et.id === toolId);
      const isAllowed = !!enabledTool;
      const isAiPinned = enabledTool?.pinned ?? false;
      const requiresConfirm = enabledTool?.requiresConfirmation ?? false;

      return (
        <Div key={toolId} className="relative group flex flex-col">
          <Button
            type="button"
            variant="ghost"
            size="unset"
            onClick={() => void handleOpenTool(toolId)}
            title={tool.description}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-colors h-auto w-full min-w-0",
              isSelected
                ? "bg-primary/10 text-primary border border-primary/20"
                : "hover:bg-accent text-foreground/60 hover:text-foreground border border-transparent hover:border-border/50",
            )}
          >
            <Div
              className={cn(
                "relative h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                isSelected ? "bg-primary/15" : "bg-muted/80",
              )}
            >
              {tool.icon ? (
                <Icon
                  icon={tool.icon}
                  className={cn(
                    "h-5 w-5",
                    isSelected ? "text-primary" : "text-muted-foreground",
                  )}
                />
              ) : (
                <Zap
                  className={cn(
                    "h-5 w-5",
                    isSelected ? "text-primary" : "text-muted-foreground",
                  )}
                />
              )}
              {/* Status indicators */}
              {(isAiPinned || isWebPinned) && (
                <Span
                  className={cn(
                    "absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-background",
                    isAiPinned && isWebPinned
                      ? "bg-amber-500"
                      : isAiPinned
                        ? "bg-primary"
                        : "bg-amber-500",
                  )}
                />
              )}
            </Div>
            <Span className="text-[10px] leading-tight line-clamp-3 w-full font-medium">
              {getToolLabel(tool)}
            </Span>
          </Button>
          {/* Controls row - overlays icon area on hover */}
          <Div className="absolute inset-x-0 top-2 z-20 flex items-center justify-center gap-0.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <Div className="flex items-center gap-0.5 bg-card/95 backdrop-blur-sm rounded-lg shadow-sm border border-border/50 px-1 py-0.5 pointer-events-auto">
              {/* Allow toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="unset"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleEnabled(toolId);
                      }}
                      className={cn(
                        "h-5 w-5 p-0 flex items-center justify-center rounded transition-all",
                        isAllowed
                          ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                          : "text-muted-foreground/50 hover:text-emerald-600 hover:bg-emerald-500/10",
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {isAllowed
                      ? "Remove — AI can no longer call this"
                      : "Allow — AI can call this on demand"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* AI Pin toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="unset"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(toolId);
                      }}
                      className={cn(
                        "h-5 w-5 p-0 flex items-center justify-center rounded transition-all",
                        isAiPinned
                          ? "text-primary hover:text-primary/70 hover:bg-primary/10"
                          : "text-muted-foreground/50 hover:text-primary hover:bg-primary/10",
                      )}
                    >
                      {isAiPinned ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {isAiPinned
                      ? t("aiTools.modal.activeOn")
                      : t("aiTools.modal.activeOff")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* Confirm toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="unset"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAllowed) {
                          handleToggleConfirmation(toolId);
                        }
                      }}
                      className={cn(
                        "h-5 w-5 p-0 flex items-center justify-center rounded transition-all",
                        requiresConfirm
                          ? "text-warning hover:bg-warning/10"
                          : "text-muted-foreground/50 hover:text-warning hover:bg-warning/10",
                        !isAllowed && "cursor-default",
                      )}
                    >
                      <Shield className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {requiresConfirm
                      ? t("aiTools.modal.confirmOn")
                      : t("aiTools.modal.confirmOff")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* Web pin toggle */}
              {canPin && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="unset"
                        onClick={(e) => handleToggleWebPin(toolId, e)}
                        className={cn(
                          "h-5 w-5 p-0 flex items-center justify-center rounded transition-all",
                          isWebPinned
                            ? "text-amber-500 hover:bg-amber-500/10"
                            : "text-muted-foreground/50 hover:text-amber-500 hover:bg-amber-500/10",
                        )}
                      >
                        {isWebPinned ? (
                          <PinOff className="h-3 w-3" />
                        ) : (
                          <Pin className="h-3 w-3" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      {isWebPinned ? "Unpin from sidebar" : "Pin to sidebar"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </Div>
          </Div>
        </Div>
      );
    };

    const toolGrid = (tools: HelpToolMetadataSerialized[]): JSX.Element => (
      <Div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          gap: 4,
        }}
      >
        {tools.map(renderToolCell)}
      </Div>
    );

    const isLoadingTransition = isFetching && hasLoadedOnce.current;

    const toolListSidebar = (
      <Div className="flex flex-col h-full overflow-hidden pt-14 relative">
        {/* ── Loading overlay — covers full sidebar during filter transitions ── */}
        {isLoadingTransition && (
          <Div className="absolute inset-0 z-20 pointer-events-none">
            {/* Spinner pinned to top of content area */}
            <Div className="absolute top-28 left-0 right-0 flex justify-center">
              <Div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/90 border border-border/60 shadow-sm text-[11px] text-muted-foreground backdrop-blur-sm">
                <Div className="h-3 w-3 rounded-full border-2 border-muted-foreground/20 border-t-primary animate-spin shrink-0" />
                <Span>{t("aiTools.modal.loading")}</Span>
              </Div>
            </Div>
          </Div>
        )}
        {/* ── Search ─────────────────────────────────────────────────── */}
        <Div className="px-3 pt-1 pb-2 shrink-0">
          <Div className="flex items-center h-9 rounded-xl border border-border bg-muted/40 focus-within:bg-background focus-within:border-ring/50 focus-within:ring-1 focus-within:ring-ring/20 transition-all gap-1 px-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) {
                  setSidebarPath([]);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  clearTimeout(searchDebounceRef.current);
                  triggerRefetch();
                }
              }}
              placeholder="Search tools…"
              className="flex-1 h-full border-none bg-transparent text-xs shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-1 placeholder:text-muted-foreground/60"
            />
            {isSearching && (
              <Button
                type="button"
                variant="ghost"
                size="unset"
                onClick={() => setSearchQuery("")}
                className="h-5 w-5 p-0 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent shrink-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="unset"
              onClick={() => {
                clearTimeout(searchDebounceRef.current);
                triggerRefetch();
              }}
              className="h-6 w-6 p-0 flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 text-primary shrink-0"
            >
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Div>
        </Div>

        {/* ── Filter chips ��──────────────────────────────────────────── */}
        <Div className="flex flex-col gap-1 px-3 pb-2 shrink-0">
          {/* Web + AI row — always visible */}
          <Div className="flex items-center gap-1">
            {(
              [
                {
                  key: "webPinned" as const,
                  icon: Pin,
                  label: "Web",
                  count: stats.webPinned,
                },
                {
                  key: "pinned" as const,
                  icon: Bot,
                  label: "AI pins",
                  count: stats.pinned,
                },
                {
                  key: "allowed" as const,
                  icon: Shield,
                  label: "AI allowed",
                  count: stats.enabled,
                },
                {
                  key: "all" as const,
                  icon: null,
                  label: "All",
                  count: stats.total,
                },
              ] as const
            ).map(({ key, icon: FilterIcon, label, count }) => (
              <Button
                key={key}
                type="button"
                variant="ghost"
                size="unset"
                onClick={() => {
                  handleStatsFilterChange(key);
                  setSidebarPath([]);
                }}
                className={cn(
                  "flex-1 h-8 flex flex-col items-center justify-center gap-0 rounded-lg text-xs transition-all border",
                  statsFilter === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-accent/50",
                )}
              >
                <Span className="flex items-center gap-0.5 text-[10px] font-medium opacity-80 leading-none">
                  {FilterIcon && (
                    <FilterIcon className="h-2.5 w-2.5 shrink-0" />
                  )}
                  {label}
                </Span>
                <Span className="tabular-nums font-bold text-sm leading-none">
                  {count}
                </Span>
              </Button>
            ))}
          </Div>
          {/* CLI + MCP row — admin only, shown once counts have loaded */}
          {isAdminUser &&
            (stats.cliAllowed !== undefined ||
              stats.mcpPinned !== undefined) && (
              <Div className="flex items-center gap-1">
                {(
                  [
                    {
                      key: "cliAllowed" as const,
                      icon: Terminal,
                      label: "CLI",
                      count: stats.cliAllowed ?? 0,
                    },
                    {
                      key: "mcpPinned" as const,
                      icon: Zap,
                      label: "MCP vis",
                      count: stats.mcpPinned ?? 0,
                    },
                    {
                      key: "mcpAllowed" as const,
                      icon: Zap,
                      label: "MCP all",
                      count: stats.mcpAllowed ?? 0,
                    },
                  ] as const
                ).map(({ key, icon: FilterIcon, label, count }) => (
                  <Button
                    key={key}
                    type="button"
                    variant="ghost"
                    size="unset"
                    onClick={() => {
                      handleStatsFilterChange(key);
                      setSidebarPath([]);
                    }}
                    className={cn(
                      "flex-1 h-8 flex flex-col items-center justify-center gap-0 rounded-lg text-xs transition-all border",
                      statsFilter === key
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-accent/50",
                    )}
                  >
                    <Span className="flex items-center gap-0.5 text-[10px] font-medium opacity-80 leading-none">
                      <FilterIcon className="h-2.5 w-2.5 shrink-0" />
                      {label}
                    </Span>
                    <Span className="tabular-nums font-bold text-sm leading-none">
                      {count}
                    </Span>
                  </Button>
                ))}
                {/* Prod toggle — inline, compact */}
                {currentEnv === "development" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="unset"
                    onClick={() => handleProdToggle(!prodOnly)}
                    title={t("aiTools.modal.prodOnly")}
                    className={cn(
                      "shrink-0 h-8 w-8 flex flex-col items-center justify-center gap-0 rounded-lg text-xs transition-all border",
                      prodOnly
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-600"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-accent/50",
                    )}
                  >
                    <Span className="text-[9px] font-bold leading-none uppercase tracking-wide">
                      {prodOnly ? "PROD" : "DEV"}
                    </Span>
                  </Button>
                )}
              </Div>
            )}
        </Div>

        {/* ── Breadcrumb / category header (when drilled in) ──────────── */}
        {sidebarPath.length > 0 && !isSearching && (
          <Div className="px-2 pb-1 shrink-0">
            <Div className="flex items-center gap-1 bg-muted/40 rounded-lg px-1 py-0.5">
              <Button
                type="button"
                variant="ghost"
                size="unset"
                onClick={() => setSidebarPath(sidebarPath.slice(0, -1))}
                className="flex items-center gap-1 h-6 px-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent flex-shrink-0"
              >
                <ChevronRight className="h-3 w-3 rotate-180 shrink-0" />
                <Span className="truncate max-w-[90px]">
                  {activeSubKey ? (activeCat?.label ?? activeCatKey) : "All"}
                </Span>
              </Button>
              {activeSubKey && (
                <>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/30 shrink-0" />
                  <Span className="text-xs font-medium text-foreground truncate">
                    {activeSubKey}
                  </Span>
                </>
              )}
            </Div>
          </Div>
        )}

        {/* ── Scrollable content ──────────────────────────────────────── */}
        <Div
          className={cn(
            "flex-1 overflow-y-auto px-3 pb-3 transition-opacity duration-150",
            isLoadingTransition && "opacity-40 pointer-events-none",
          )}
        >
          {/* Search results */}
          {isSearching &&
            (visibleTools.length === 0 ? (
              <Div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <Search className="h-7 w-7 text-muted-foreground/25" />
                <Div>
                  <Span className="block text-sm font-medium text-foreground/60">
                    {/* oxlint-disable-next-line i18n/no-literal-string */}
                    No results
                  </Span>
                  <Span className="block text-[11px] text-muted-foreground/50 mt-0.5">
                    &ldquo;{searchQuery}&rdquo;
                  </Span>
                </Div>
              </Div>
            ) : (
              <Div className="pt-1">
                <Span className="block text-[10px] font-medium text-muted-foreground/40 uppercase tracking-wider pb-2">
                  {visibleTools.length} result
                  {visibleTools.length !== 1 ? "s" : ""}
                </Span>
                {toolGrid(visibleTools)}
              </Div>
            ))}

          {/* Level 2: subcategory tools */}
          {!isSearching && activeCatKey && activeSubKey && categoryEntry && (
            <Div className="pt-1">
              {toolGrid(
                categoryEntry.tools.filter(
                  (tool) => tool.subCategory === activeSubKey,
                ),
              )}
            </Div>
          )}

          {/* Level 1: category — root tools first, then subcategory folders */}
          {!isSearching && activeCatKey && !activeSubKey && categoryEntry && (
            <Div className="pt-1">
              {((): JSX.Element => {
                const registeredSubKeys = new Set(
                  Object.keys(activeCat?.subcategories ?? {}),
                );
                const hasSubcats =
                  activeCat?.subcategories &&
                  Object.keys(activeCat.subcategories).length > 0;

                const rootTools: HelpToolMetadataSerialized[] = [];
                const matchedBySubcat: Record<
                  string,
                  HelpToolMetadataSerialized[]
                > = {};
                for (const tool of categoryEntry.tools) {
                  const sub = tool.subCategory;
                  if (sub && registeredSubKeys.has(sub)) {
                    (matchedBySubcat[sub] ??= []).push(tool);
                  } else {
                    rootTools.push(tool);
                  }
                }

                if (!hasSubcats) {
                  return toolGrid(categoryEntry.tools);
                }

                const sortedSubcats = Object.entries(
                  activeCat!.subcategories!,
                ).toSorted((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0));

                const folderSubcats: [string, (typeof sortedSubcats)[0][1]][] =
                  [];
                for (const [subKey, subDef] of sortedSubcats) {
                  const tools = matchedBySubcat[subKey] ?? [];
                  if (tools.length === 0) {
                    continue;
                  }
                  folderSubcats.push([subKey, subDef]);
                }

                // If no folders, render everything flat
                if (folderSubcats.length === 0) {
                  return toolGrid(categoryEntry.tools);
                }

                return (
                  <>
                    {/* Root tools render directly — no folder nesting */}
                    {rootTools.length > 0 && toolGrid(rootTools)}
                    {/* Subcategory sections inline */}
                    {folderSubcats.map(([subKey, subDef], idx) => (
                      <Div
                        key={subKey}
                        className={
                          idx === 0 && rootTools.length > 0
                            ? "mb-5 mt-3"
                            : "mb-5"
                        }
                      >
                        <Div className="flex items-center gap-2 mb-2">
                          <Span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                            {subDef.labels[locale] ?? subDef.label ?? subKey}
                          </Span>
                          <Div className="flex-1 h-px bg-border/50" />
                        </Div>
                        {toolGrid(matchedBySubcat[subKey] ?? [])}
                      </Div>
                    ))}
                  </>
                );
              })()}
            </Div>
          )}

          {/* Level 0: root — unified tool view (all filters) */}
          {!isSearching &&
            !activeCatKey &&
            ((): JSX.Element | null => {
              const isPinnedFilter = statsFilter === "pinned";
              const isWebPinnedFilter = statsFilter === "webPinned";
              const favPins = activeFavoriteData?.pinnedTools ?? null;
              const defaultPinIds: readonly string[] =
                skillPinnedDefault !== null
                  ? skillPinnedDefault
                  : getDefaultToolIdsForUser(user);
              const aiPinsCustomized =
                favPins !== null &&
                ((): boolean => {
                  if (favPins.length !== defaultPinIds.length) {
                    return true;
                  }
                  const favSet = new Set(favPins.map((p) => p.toolId));
                  return defaultPinIds.some((id) => !favSet.has(id));
                })();
              const webPinsCustomized = webPinnedTools !== null;

              // Reset banner for filters that support user-customised state
              const resetBanner =
                (isPinnedFilter && aiPinsCustomized) ||
                (isWebPinnedFilter && webPinsCustomized) ? (
                  <Div className="mb-3 rounded-xl bg-gradient-to-br from-primary/8 to-transparent border border-primary/15 p-3">
                    <Div className="flex items-center gap-2 mb-1.5">
                      <Div className="h-6 w-6 rounded-md bg-primary/15 flex items-center justify-center shrink-0">
                        {isPinnedFilter ? (
                          <Bot className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Pin className="h-3.5 w-3.5 text-primary" />
                        )}
                      </Div>
                      <Span className="text-xs font-semibold text-foreground">
                        {isPinnedFilter
                          ? t("aiTools.modal.aiPinsTitle")
                          : "Web sidebar"}
                      </Span>
                    </Div>
                    <Span className="block text-[11px] text-muted-foreground leading-snug mb-2">
                      {isPinnedFilter
                        ? t("aiTools.modal.aiPinsDescription")
                        : "Tools pinned to your sidebar."}
                    </Span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="unset"
                      onClick={handleResetToDefault}
                      className="w-full h-6 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground rounded-lg hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
                    >
                      <RotateCcw className="h-3 w-3 shrink-0" />
                      {t("aiTools.modal.resetToDefaults")}
                    </Button>
                  </Div>
                ) : null;

              // < 20 tools: flat inline grid
              if (visibleTools.length > 0 && visibleTools.length < 20) {
                return (
                  <Div className="pt-1">
                    {resetBanner}
                    {toolGrid(visibleTools)}
                  </Div>
                );
              }

              // 0 tools
              if (visibleTools.length === 0 && categories.length === 0) {
                return (
                  <Div className="pt-1">
                    {resetBanner}
                    <Div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                      <Span className="text-xs text-muted-foreground">
                        {t("aiTools.modal.noPinnedTools")}
                      </Span>
                      <Span className="text-[11px] text-muted-foreground/50">
                        {t("aiTools.modal.noPinnedToolsHint")}
                      </Span>
                    </Div>
                  </Div>
                );
              }

              // ≥ 20 tools: grouped by category
              // Categories come from the server (already aligned to active filter).
              // When tools are returned alongside categories, build counts from tools directly.
              const catCountMap =
                categories.length > 0
                  ? new Map<string, number>(
                      categories.map(({ name, count }) => [name, count]),
                    )
                  : visibleTools.reduce((map, tool) => {
                      const cat = tool.category ?? "";
                      map.set(cat, (map.get(cat) ?? 0) + 1);
                      return map;
                    }, new Map<string, number>());

              const overviewGroups = ADMIN_GROUPS.map((group) => {
                const entries = CATEGORY_REGISTRY.filter(
                  (c) => c.group === group,
                )
                  .map((catDef) => ({
                    catDef,
                    count: catCountMap.get(catDef.key) ?? 0,
                  }))
                  .filter(({ count }) => count > 0);
                return { group, entries };
              }).filter(({ entries }) => entries.length > 0);

              if (overviewGroups.length === 0) {
                return (
                  <Div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
                    <Span className="text-sm text-muted-foreground">
                      {t("aiTools.modal.noToolsAvailable")}
                    </Span>
                  </Div>
                );
              }

              return (
                <Div className="pt-1">
                  {resetBanner}
                  {overviewGroups.map(({ group, entries }) => (
                    <Div key={group} className="mb-5">
                      <Div className="flex items-center gap-2 mb-2">
                        <Span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                          {GROUP_LABELS[group]}
                        </Span>
                        <Div className="flex-1 h-px bg-border/50" />
                      </Div>
                      <Div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(80px, 1fr))",
                          gap: 4,
                        }}
                      >
                        {entries.map(({ catDef, count }) =>
                          renderFolderCell(
                            catDef.icon,
                            catDef.labels[locale] ?? catDef.label,
                            count,
                            () =>
                              setSidebarPath(
                                [catDef.key],
                                catDef.key,
                                catDef.defaultEntryAlias,
                              ),
                          ),
                        )}
                      </Div>
                    </Div>
                  ))}
                </Div>
              );
            })()}
        </Div>
      </Div>
    );

    const mainContent = (
      <Div className="flex flex-col min-h-full w-full relative">
        {selectedAdminEndpoint ? (
          <HelpAdminLayoutActiveContext.Provider value={true}>
            <EndpointsPage
              key={selectedToolId ?? "tool"}
              endpoint={{
                [selectedAdminEndpoint.method]: selectedAdminEndpoint,
              }}
              locale={locale}
              user={user}
              platform={platform}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic endpoint type
              endpointOptions={{} as any}
              navigationOverride={urlNavStack}
              className="flex flex-col flex-1"
            />
          </HelpAdminLayoutActiveContext.Provider>
        ) : (
          <Div className="flex flex-col items-center justify-center h-full text-center px-8 gap-4 min-h-[400px]">
            <Div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
              <Zap className="h-8 w-8 text-muted-foreground" />
            </Div>
            <Div>
              <Span className="text-lg font-semibold text-foreground block">
                {t("aiTools.modal.selectTool")}
              </Span>
              <Span className="text-sm text-muted-foreground block mt-1">
                {t("aiTools.modal.selectToolHint")}
              </Span>
            </Div>
          </Div>
        )}
      </Div>
    );

    return (
      <>
        <Div className="flex flex-1 min-h-0 overflow-hidden bg-background">
          {/* ── Floating Top Bar (like AI stream) ───────────────────── */}
          <Dialog open={localeDialogOpen} onOpenChange={setLocaleDialogOpen}>
            <DialogContent className="max-w-md">
              <LocaleSelectorContent />
            </DialogContent>
          </Dialog>

          <Div className="absolute top-4 left-4 z-[310] flex flex-row gap-1">
            {/* Sidebar toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAdminSidebarCollapsed(!adminSidebarCollapsed)}
              className="bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9"
              title={t("aiTools.modal.closeSidebar")}
            >
              <PanelLeft className="h-5 w-5" />
            </Button>

            {/* Settings dropdown (theme + locale + admin filters) - only when sidebar open */}
            {!adminSidebarCollapsed && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9"
                    title={t("aiTools.modal.adminFilters")}
                    suppressHydrationWarning
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {/* Theme Toggle */}
                  <ThemeToggleDropdown locale={locale} />

                  {/* Locale Selector - Desktop: Sub-menu, Mobile: Dialog */}
                  <Div className="hidden md:block">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="cursor-pointer">
                        <Span className="mr-2">
                          {translationContext.currentCountry.flag}
                        </Span>
                        <Span>{translationContext.currentCountry.name}</Span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <LocaleSelectorContent />
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </Div>
                  <DropdownMenuItem
                    className="cursor-pointer md:hidden flex items-center justify-between"
                    onSelect={(e) => {
                      e.preventDefault();
                      setLocaleDialogOpen(true);
                    }}
                  >
                    <Div className="flex items-center">
                      <Span className="mr-2">
                        {translationContext.currentCountry.flag}
                      </Span>
                      <Span>{translationContext.currentCountry.name}</Span>
                    </Div>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </DropdownMenuItem>

                  {/* Admin filters */}
                  {isAdminUser && (
                    <>
                      {/* View as role */}
                      <Div className="px-2 py-1.5">
                        <Select<string>
                          value={activeViewAsRole ?? "admin"}
                          onValueChange={handleViewAsRoleChange}
                        >
                          <SelectTrigger className="h-7 text-[11px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">
                              {t("get.fields.viewAsRole.options.admin")}
                            </SelectItem>
                            <SelectItem value={UserPermissionRole.CUSTOMER}>
                              {t("get.fields.viewAsRole.options.customer")}
                            </SelectItem>
                            <SelectItem value={UserPermissionRole.PUBLIC}>
                              {t("get.fields.viewAsRole.options.public")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </Div>
                      {/* Reset pins */}
                      {canPin && webPinnedTools !== null && (
                        <Div className="px-2 py-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setWebPinnedTools(null)}
                            className="w-full h-7 text-[11px] text-muted-foreground hover:text-destructive"
                          >
                            <RotateCcw className="h-3 w-3 mr-1.5" />
                            {t("aiTools.modal.resetPins")}
                          </Button>
                        </Div>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Logo */}
            <Logo locale={locale} size="h-8" />
          </Div>

          {/* ── Sidebar + Main Content ──────────────────────────────── */}
          {isMobile ? (
            <Div className="flex flex-row flex-1 min-h-0 w-full">
              <AnimatePresence initial={false}>
                {!adminSidebarCollapsed && (
                  <MotionDiv
                    key="mobile-sidebar"
                    initial={{ x: -260 }}
                    animate={{ x: 0 }}
                    exit={{ x: -260 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed inset-y-0 left-0 z-[210] bg-background border-r border-border w-65"
                  >
                    <Div className="h-full w-full bg-background">
                      {toolListSidebar}
                    </Div>
                  </MotionDiv>
                )}
              </AnimatePresence>

              <AnimatePresence initial={false}>
                {!adminSidebarCollapsed && (
                  <MotionDiv
                    key="mobile-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed inset-0 bg-black/50 z-[200]"
                    onClick={() => setAdminSidebarCollapsed(true)}
                    aria-label={t("aiTools.modal.closeSidebar")}
                  />
                )}
              </AnimatePresence>

              <Div className="flex flex-col flex-1 min-h-0 w-full overflow-y-auto">
                {mainContent}
              </Div>
            </Div>
          ) : (
            <Div className="flex flex-row flex-1 min-h-0 w-full">
              <ResizableContainer
                defaultWidth={280}
                minWidth={200}
                maxWidth="90vw"
                storageId="admin-endpoints-sidebar"
                className="bg-background z-10"
                collapsed={adminSidebarCollapsed}
              >
                <AnimatePresence initial={false} mode="sync">
                  {!adminSidebarCollapsed && (
                    <MotionDiv
                      key="sidebar"
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="h-full"
                    >
                      <Div className="flex flex-col h-full w-full bg-background overflow-hidden border-r border-border">
                        {toolListSidebar}
                      </Div>
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </ResizableContainer>

              <Div className="flex flex-col flex-1 min-h-0 min-w-0 relative z-9 overflow-y-auto">
                {mainContent}
              </Div>
            </Div>
          )}
        </Div>
      </>
    );
  }

  // Full list mode (web)
  return (
    <Div className="flex flex-col gap-0">
      {/* Admin Env Info */}
      {isAdminUser && currentEnv && (
        <Div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <Badge
            variant={currentEnv === "production" ? "default" : "secondary"}
            className={cn(
              "text-[10px] font-mono",
              currentEnv === "production"
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
            )}
          >
            {currentEnv === "production" ? "PROD" : "DEV"}
          </Badge>
          {currentPlatform && (
            <Badge variant="outline" className="text-[10px] font-mono">
              {currentPlatform}
            </Badge>
          )}
        </Div>
      )}

      {/* Instance Switcher - shows when remote instances are connected */}
      {connectedInstances.length > 0 && (
        <Div className="flex items-center gap-1 px-4 pt-3">
          <Button
            variant={activeInstanceId === undefined ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-7 text-xs gap-1.5 px-2.5",
              activeInstanceId === undefined &&
                "bg-primary text-primary-foreground",
            )}
            onClick={() => handleInstanceChange(undefined)}
          >
            <Monitor className="h-3 w-3" />
          </Button>
          {connectedInstances.map((conn) => (
            <Button
              key={conn.instanceId}
              variant={
                activeInstanceId === conn.instanceId ? "default" : "outline"
              }
              size="sm"
              className={cn(
                "h-7 text-xs gap-1.5 px-2.5",
                activeInstanceId === conn.instanceId &&
                  "bg-primary text-primary-foreground",
              )}
              onClick={() => handleInstanceChange(conn.instanceId)}
            >
              <Globe className="h-3 w-3" />
              <Span>{conn.instanceId}</Span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[9px] px-1 py-0",
                  conn.healthStatus === "healthy" &&
                    "border-emerald-500/30 text-emerald-600",
                  conn.healthStatus === "warning" &&
                    "border-amber-500/30 text-amber-600",
                  conn.healthStatus === "critical" &&
                    "border-red-500/30 text-destructive",
                  conn.healthStatus === "disconnected" &&
                    "border-gray-500/30 text-gray-400",
                )}
              >
                {conn.healthStatus}
              </Badge>
            </Button>
          ))}
        </Div>
      )}

      {/* Filter chips */}
      {filterChips}

      <Div className="flex gap-3 flex-col px-4 pb-4 pt-3">
        {/* Search + Controls */}
        <Div className="flex flex-col gap-2 shrink-0">
          <Div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("aiTools.modal.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </Div>

          {!disabled && (
            <Div className="flex gap-2">
              {visibleTools.length > 0 && (
                <>
                  <Button
                    onClick={
                      expandedCategories.size === 0
                        ? () =>
                            setExpandedCategories(
                              new Set(Object.keys(toolsByCategory)),
                            )
                        : () => setExpandedCategories(new Set())
                    }
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-0"
                  >
                    <Span className="truncate">
                      {expandedCategories.size === 0
                        ? t("aiTools.modal.expandAll")
                        : t("aiTools.modal.collapseAll")}
                    </Span>
                  </Button>

                  <Button
                    onClick={handleEnableAll}
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-0"
                  >
                    {allVisibleEnabled ? (
                      <>
                        <X className="h-4 w-4 mr-1 shrink-0" />
                        <Span className="truncate">
                          {t("aiTools.modal.deselectAll")}
                        </Span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1 shrink-0" />
                        <Span className="truncate">
                          {t("aiTools.modal.selectAll")}
                        </Span>
                      </>
                    )}
                  </Button>
                </>
              )}

              {isManuallyCustomized && (
                <Button
                  onClick={handleResetToDefault}
                  variant="outline"
                  size="sm"
                  className="flex-1 min-w-0"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1 shrink-0" />
                  <Span className="truncate">
                    {t("aiTools.modal.resetToDefault")}
                  </Span>
                </Button>
              )}
            </Div>
          )}
        </Div>

        {/* Tools List */}
        <Div className="relative max-h-[45dvh] overflow-y-auto pr-1">
          {endpointMutations?.read?.isLoading && (
            <Div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-md">
              <Span className="text-xs text-muted-foreground animate-pulse">
                {t("aiTools.modal.loading")}
              </Span>
            </Div>
          )}
          {visibleTools.length === 0 ? (
            <Div className="text-center py-8 text-muted-foreground text-sm">
              {searchQuery.length > 0
                ? t("aiTools.modal.noToolsFound")
                : t("aiTools.modal.noToolsAvailable")}
            </Div>
          ) : (
            <Div className="flex flex-col gap-3">
              {Object.entries(toolsByCategory).map(
                ([category, { tools, subcategories }]) => {
                  const isExpanded = expandedCategories.has(category);
                  const categoryIds = tools.map((et) => et.id);
                  const enabledCount = categoryIds.filter((id) =>
                    effectiveEnabledTools.some((et) => et.id === id),
                  ).length;
                  const activeCount = categoryIds.filter((id) =>
                    effectiveEnabledTools.some(
                      (et) => et.id === id && et.pinned,
                    ),
                  ).length;
                  const allCategoryEnabled = enabledCount === tools.length;
                  const hasSubcategories =
                    Object.keys(subcategories).length > 1;
                  const sortedSubcategories = Object.entries(
                    subcategories,
                  ).toSorted((a, b) => b[1].length - a[1].length);

                  return (
                    <Div
                      key={category}
                      className="border rounded-lg overflow-hidden"
                    >
                      {/* Category Header */}
                      <Div
                        onClick={() => toggleCategory(category)}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <Span className="text-sm font-medium capitalize flex-1 text-left">
                          {category}
                        </Span>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 gap-1"
                        >
                          <Eye className="h-2.5 w-2.5" />
                          {activeCount}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {enabledCount}/{tools.length}
                        </Badge>
                        {!disabled && (
                          <Div
                            onClick={(e) => e.stopPropagation()}
                            className="shrink-0"
                          >
                            <Switch
                              checked={allCategoryEnabled}
                              onCheckedChange={() => toggleCategoryTools(tools)}
                              className="h-4 w-7"
                            />
                          </Div>
                        )}
                      </Div>

                      {/* Tools in category */}
                      {isExpanded && (
                        <Div className="border-t">
                          {hasSubcategories ? (
                            sortedSubcategories.map(([subName, subTools]) => (
                              <Div key={subName}>
                                <Div className="px-4 py-1.5 bg-muted/30 border-b">
                                  <Span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                                    {subName} ({subTools.length})
                                  </Span>
                                </Div>
                                <Div className="divide-y">
                                  {subTools.map((tool, idx) => (
                                    <ToolRow
                                      key={`${tool.id ?? tool.name}-${idx}`}
                                      tool={tool}
                                      effectiveEnabledTools={
                                        effectiveEnabledTools
                                      }
                                      onToggleEnabled={handleToggleEnabled}
                                      onToggleActive={handleToggleActive}
                                      onToggleConfirmation={
                                        handleToggleConfirmation
                                      }
                                      onOpenTool={handleOpenTool}
                                      onToggleWebPin={
                                        canPin ? handleToggleWebPin : undefined
                                      }
                                      isWebPinned={webPinnedSet.has(
                                        tool.id ?? tool.name,
                                      )}
                                      t={t}
                                      disabled={disabled}
                                    />
                                  ))}
                                </Div>
                              </Div>
                            ))
                          ) : (
                            <Div className="divide-y">
                              {tools.map((tool, idx) => (
                                <ToolRow
                                  key={`${tool.id ?? tool.name}-${idx}`}
                                  tool={tool}
                                  effectiveEnabledTools={effectiveEnabledTools}
                                  onToggleEnabled={handleToggleEnabled}
                                  onToggleActive={handleToggleActive}
                                  onToggleConfirmation={
                                    handleToggleConfirmation
                                  }
                                  onOpenTool={handleOpenTool}
                                  onToggleWebPin={
                                    canPin ? handleToggleWebPin : undefined
                                  }
                                  isWebPinned={webPinnedSet.has(
                                    tool.id ?? tool.name,
                                  )}
                                  t={t}
                                  disabled={disabled}
                                />
                              ))}
                            </Div>
                          )}
                        </Div>
                      )}
                    </Div>
                  );
                },
              )}
            </Div>
          )}
        </Div>

        {hint && (
          <P className="text-xs text-muted-foreground text-center shrink-0">
            {hint}
          </P>
        )}

        {/* Footer */}
        <Div className="shrink-0 pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
          <Div className="flex items-center gap-3">
            <Div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <Span>{t("aiTools.modal.legendActive")}</Span>
            </Div>
            <Div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <Span>{t("aiTools.modal.legendConfirm")}</Span>
            </Div>
            {canPin && (
              <Div className="flex items-center gap-1">
                <Pin className="h-3 w-3" />
                <Span>{t("aiTools.modal.legendWebPin")}</Span>
              </Div>
            )}
          </Div>
          <P>
            {t("aiTools.modal.stats", {
              pinned: stats.pinned,
              total: stats.total,
            })}
          </P>
        </Div>
      </Div>

      {/* Vibe-frame overlay for remote tool execution */}
      {vibeFrame && (
        <Div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
          <Div className="flex items-center justify-between px-4 py-2 border-b shrink-0">
            <Span className="text-sm font-medium text-muted-foreground font-mono">
              {vibeFrame.endpoint}
            </Span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setVibeFrame(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Div>
          <Div className="flex-1 overflow-auto">
            <VibeFrameHost
              serverUrl={vibeFrame.serverUrl}
              endpoint={vibeFrame.endpoint}
              locale={locale}
              onClose={() => setVibeFrame(null)}
            />
          </Div>
        </Div>
      )}
    </Div>
  );
}

// ─── Tool Row ───────────────────────────────────────────────────────────────

function ToolRow({
  tool,
  effectiveEnabledTools,
  onToggleEnabled,
  onToggleActive,
  onToggleConfirmation,
  onOpenTool,
  onToggleWebPin,
  isWebPinned,
  t,
  disabled,
}: {
  tool: HelpToolMetadataSerialized;
  effectiveEnabledTools: EnabledTool[];
  onToggleEnabled: (toolName: string) => void;
  onToggleActive: (toolName: string) => void;
  onToggleConfirmation: (toolName: string) => void;
  onOpenTool: (toolName: string) => Promise<void>;
  onToggleWebPin?: (toolId: string, e: ButtonMouseEvent) => void;
  isWebPinned?: boolean;
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
  disabled?: boolean;
}): JSX.Element {
  const enabledTool = effectiveEnabledTools.find(
    (et) => et.id === (tool.id ?? tool.name),
  );
  const isEnabled = !!enabledTool;
  const isActive = enabledTool?.pinned ?? false;
  const requiresConfirmation = enabledTool?.requiresConfirmation ?? false;

  return (
    <Div
      className={cn(
        "px-4 py-2.5 transition-colors",
        isEnabled && isActive && "bg-primary/5",
        isEnabled && !isActive && "bg-muted/30",
      )}
    >
      <Div className="flex items-center gap-3">
        {!disabled && (
          <Switch
            checked={isEnabled}
            onCheckedChange={() => onToggleEnabled(tool.id ?? tool.name)}
            className="h-4 w-7 shrink-0"
          />
        )}
        <Div className="flex-1 min-w-0">
          <Div className="flex items-center gap-2">
            <P className="text-sm font-medium truncate">{getToolLabel(tool)}</P>
            {tool.aliases?.[0] && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1 py-0 font-mono shrink-0"
              >
                {tool.aliases[0]}
              </Badge>
            )}
          </Div>
          <Div className="flex items-center gap-1 mt-0.5">
            <P className="text-[11px] text-muted-foreground/70 truncate flex-1">
              {tool.description}
            </P>
            {tool.platforms && tool.platforms.length > 0 && (
              <Div className="flex gap-0.5 shrink-0">
                {tool.platforms.map((p) => (
                  <Badge
                    key={p}
                    variant="outline"
                    className={cn(
                      "text-[9px] px-1 py-0 font-mono leading-tight",
                      p === Platform.CLI &&
                        "border-amber-500/30 text-amber-600",
                      p === Platform.MCP &&
                        "border-violet-500/30 text-violet-600",
                      p === Platform.AI && "border-blue-500/30 text-blue-600",
                      p === Platform.TRPC &&
                        "border-emerald-500/30 text-emerald-600",
                      p === Platform.CRON && "border-gray-500/30 text-gray-600",
                    )}
                  >
                    {p}
                  </Badge>
                ))}
              </Div>
            )}
          </Div>
        </Div>
        {!disabled && isEnabled && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-7 w-7 p-0 shrink-0",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleActive(tool.id ?? tool.name);
                  }}
                >
                  {isActive ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <P className="text-xs">
                  {isActive
                    ? t("aiTools.modal.activeOn")
                    : t("aiTools.modal.activeOff")}
                </P>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {!disabled && isEnabled && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 w-7 p-0 shrink-0",
                    requiresConfirmation
                      ? "text-warning bg-warning/10 hover:bg-warning/20"
                      : "text-muted-foreground/40 hover:text-muted-foreground",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleConfirmation(tool.id ?? tool.name);
                  }}
                >
                  <Shield className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <P className="text-xs">
                  {requiresConfirmation
                    ? t("aiTools.modal.confirmOn")
                    : t("aiTools.modal.confirmOff")}
                </P>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {!disabled && onToggleWebPin && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 w-7 p-0 shrink-0",
                    isWebPinned
                      ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20"
                      : "text-muted-foreground/40 hover:text-amber-500 hover:bg-amber-500/10",
                  )}
                  onClick={(e) => {
                    onToggleWebPin(tool.id ?? tool.name, e);
                  }}
                >
                  {isWebPinned ? (
                    <PinOff className="h-3.5 w-3.5" />
                  ) : (
                    <Pin className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <P className="text-xs">
                  {isWebPinned ? "Unpin from sidebar" : "Pin to sidebar"}
                </P>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {!disabled && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 shrink-0 text-muted-foreground/40 hover:text-primary hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    void onOpenTool(tool.id ?? tool.name);
                  }}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <P className="text-xs">{t("get.fields.openTool.label")}</P>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Div>
    </Div>
  );
}
