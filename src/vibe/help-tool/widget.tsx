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
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Building } from "next-vibe/ui/components/icons/Building";
import { Check } from "next-vibe/ui/components/icons/Check";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Eye } from "next-vibe/ui/components/icons/Eye";
import { EyeOff } from "next-vibe/ui/components/icons/EyeOff";
import { Globe } from "next-vibe/ui/components/icons/Globe";
import { Monitor } from "next-vibe/ui/components/icons/Monitor";
import { MoreHorizontal } from "next-vibe/ui/components/icons/MoreHorizontal";
import { PanelLeft } from "next-vibe/ui/components/icons/PanelLeft";
import { Pin } from "next-vibe/ui/components/icons/Pin";
import { PinOff } from "next-vibe/ui/components/icons/PinOff";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { RotateCcw } from "next-vibe/ui/components/icons/RotateCcw";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Settings } from "next-vibe/ui/components/icons/Settings";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { X } from "next-vibe/ui/components/icons/X";
import type { InputRefObject } from "next-vibe/ui/components/input";
import { Input } from "next-vibe/ui/components/input";
import { Link } from "next-vibe/ui/components/link";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { AnimatePresence, MotionDiv } from "next-vibe/ui/components/motion";
import { Nav } from "next-vibe/ui/components/nav";
import { Pre } from "next-vibe/ui/components/pre";
import { ResizableContainer } from "next-vibe/ui/components/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "next-vibe/ui/components/sheet";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { Switch } from "next-vibe/ui/components/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe/ui/components/tooltip";
import { H2, P } from "next-vibe/ui/components/typography";
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
  reloadPage,
} from "next-vibe/ui/lib/location";
import { getScreenWidth } from "next-vibe/ui/lib/screen";
import { setLocalItem, storage } from "next-vibe/ui/lib/storage";
import {
  AdminRecordCompanyContext,
  adminRecordCompanyKey,
} from "next-vibe/unified-ui/_shared/admin-record-company";
import { AdminRecordContext } from "next-vibe/unified-ui/_shared/admin-record-context";
import { LandingCountsContext } from "next-vibe/unified-ui/_shared/category-summary-panel";
import { ToolUnavailableState } from "next-vibe/unified-ui/_shared/tool-unavailable-state";
import type { JSX } from "react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { z } from "zod";

import { LocalePickerDialog } from "@/_pages/_components/locale-picker";
import { getLocaleLabel } from "@/_pages/_components/locale-picker/model";
import { Logo } from "@/_pages/_components/logo";
import { ThemeToggleDropdown } from "@/_pages/_components/theme-toggle";
import {
  copyCatalogSearchParams,
  parseToolsInitialState,
  readEndpointSearchParams,
} from "@/_pages/tools/initial-state";
import {
  ToolCompanyContext,
  useWorkspaceCompany,
} from "@/companies/_shared/workspace-company-context";
import { CATEGORY_REGISTRY } from "@/generated/categories/registry";

import { LocaleSelectorContent } from "../agent/ai-stream/stream/widget/chat-ui/top-area/locale-selector-content";
import {
  getDefaultToolIdsForUser,
  getDefaultWebPinnedIdsForUser,
} from "../agent/chat/constants";
import type { EnabledTool } from "../agent/chat/hooks/store";
import settingsDefinition from "../agent/chat/settings/definition";
import type { ToolPreferencePatch } from "../agent/chat/settings/tool-preferences";
import favoriteByIdDefinition from "../agent/skills/favorites/[id]/definition";
import favoritesListDefinition from "../agent/skills/favorites/definition";
import {
  endpointToUrlSegment,
  getPreferredName,
  pathSegmentsToToolName,
} from "../core/core-utils/path";
import type { NavigationStackEntry } from "../core/definition/endpoint";
import type { CreateApiEndpointAny } from "../core/definition/endpoint-base";
import { coreClientEnv } from "../core/env-client";
import { permissionsRegistry } from "../core/permissions/registry";
import { parseError } from "../core/utils/parse-error";
import { EXECUTE_TOOL_ALIAS } from "../execute-tool/constants";
import { PlatformMarker, UserPermissionRole } from "../identity/roles/enum";
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
  useWidgetResponse,
  useWidgetUser,
  useWidgetValue,
} from "../unified-ui/_shared/use-widget-context";
import { resolveEndpoint } from "../unified-ui/hooks/resolve-endpoint";
import { apiClient } from "../unified-ui/hooks/store";
import { useEndpoint } from "../unified-ui/hooks/use-endpoint";
import type { NavigationOptions } from "../unified-ui/hooks/use-navigation-stack";
import {
  deserializeNavigationData,
  serializeNavigationData,
  useUrlNavStack,
} from "../unified-ui/hooks/use-url-nav-stack";
import { EndpointsPage } from "../unified-ui/renderers/web/EndpointsPage";
import { humanCategoryName, recentToolIds } from "./admin-catalog-model";
import {
  AdminCatalog,
  CatalogPagination,
  CatalogToolList,
} from "./admin-workspace";
import { CatalogOverview } from "./catalog-overview";
import type { CategoryDefinitionSerialized } from "./category-types";
import type definition from "./definition";
import type {
  HelpGetRequestInput,
  HelpGetResponseOutput,
  HelpToolMetadataSerialized,
} from "./definition";
import {
  applyWorkspaceCompany,
  applyWorkspaceCompanyToEntry,
  hasFixedRecordCompany,
  hasWorkspaceCompanyInput,
  readWorkspaceCompanyOverride,
} from "./erp-company-scope";
import { ErpCompanySwitch } from "./erp-company-switch";
import { scopedTranslation } from "./i18n";
import { categoryLabel, localizedLabel } from "./localized-label";
import { RecordSearch } from "./record-search";
import { resolveEffectiveUser } from "./repository/meta-filter";
import {
  parseSidebarPathFromSearch,
  toolNavigationScope,
} from "./sidebar-path";
import { ChatToolNavigationContext, ToolNavigation } from "./tool-navigation";

// ─── Constants ──────────────────────────────────────────────────────────────

const ADMIN_ENDPOINTS_PATH = "tools";
const recentToolsSchema = z.array(z.string());
const subscribeToHydration = (): (() => void) => () => undefined;

type StatsFilter = NonNullable<HelpGetRequestInput["statsFilter"]>;

function toolAliasFromPathname(pathname: string): string {
  const segments = pathname.split("/");
  const mount = segments.indexOf(ADMIN_ENDPOINTS_PATH);
  return mount === -1 ? "" : segments.slice(mount + 1).join("/");
}

function splitToolInputs(
  endpoint: CreateApiEndpointAny,
  args: Record<string, string>,
): {
  urlPathParams?: Record<string, string>;
  data?: ReturnType<typeof deserializeNavigationData>;
} {
  const pathParamKeys = new Set(
    endpoint.path
      .filter((segment) => segment.startsWith("["))
      .map((segment) => segment.slice(1, -1)),
  );
  const urlPathParams: Record<string, string> = {};
  const data: Record<string, string> = {};
  for (const [key, value] of Object.entries(args)) {
    (pathParamKeys.has(key) ? urlPathParams : data)[key] = value;
  }
  return {
    urlPathParams:
      Object.keys(urlPathParams).length > 0 ? urlPathParams : undefined,
    data:
      Object.keys(data).length > 0
        ? deserializeNavigationData(data, endpoint.requestSchema)
        : undefined,
  };
}

async function resolveCatalogEndpoint(
  toolName: string,
): Promise<CreateApiEndpointAny | null> {
  const endpoint = await resolveEndpoint(toolName);
  if (endpoint || coreClientEnv.NODE_ENV === "production") {
    return endpoint;
  }
  const { getEndpoint } = await import("@/generated/endpoints/endpoint-dev");
  return getEndpoint(toolName);
}

// Prevents the admin two-pane layout from rendering recursively when HelpToolsWidget
// is mounted inside another HelpToolsWidget's EndpointsPage.

function RestoringTool({
  loading,
  unavailable,
  retry,
  failed,
}: {
  loading: string;
  unavailable: string;
  retry: string;
  failed: boolean;
}): JSX.Element {
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setTimedOut(true), 15_000);
    return (): void => clearTimeout(timeout);
  }, []);
  return failed || timedOut ? (
    <EmptyBlock
      className="mx-4 mt-6 rounded-xl border bg-card px-4 py-8 sm:mx-8"
      title={unavailable}
      action={{ label: retry, onClick: reloadPage }}
    />
  ) : (
    <Div
      aria-busy={true}
      aria-label={loading}
      className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 pb-10 pt-5 sm:px-8 sm:pt-8"
    >
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-8 w-72 max-w-full" />
      <Div className="grid grid-cols-2 gap-3 @2xl:grid-cols-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </Div>
      <Div className="flex flex-col gap-2 rounded-xl border bg-card p-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </Div>
    </Div>
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

/**
 * Subscribe to a sidebar entry. Loads the persisted value once per storageId.
 * Returns the unsubscribe function.
 */
function _subscribeSidebarEntry(
  storageId: string,
  listener: (v: boolean) => void,
  logger: ReturnType<typeof useLogger>,
): () => void {
  const entry = _getOrCreateSidebarEntry(storageId);
  entry.listeners.add(listener);
  if (!entry.initialized) {
    entry.initialized = true;
    void storage.getItem(storageId, logger).then((stored) => {
      let v = getScreenWidth(logger) < 930;
      if (stored !== null) {
        try {
          v = JSON.parse(stored) as boolean;
        } catch (error) {
          logger.warn("[storage] help sidebar state unparseable", {
            key: storageId,
            valueLength: stored.length,
            errorMessage:
              error instanceof Error ? error.message : String(error),
          });
        }
      }
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
}

/** Write a sidebar entry's collapsed value, persist it, and notify listeners. */
function _setSidebarEntryCollapsed(
  storageId: string,
  value: boolean,
  logger: ReturnType<typeof useLogger>,
): void {
  const entry = _getOrCreateSidebarEntry(storageId);
  entry.collapsed = value;
  void storage.setItem(storageId, JSON.stringify(value), logger);
  for (const l of entry.listeners) {
    l(value);
  }
}

function useSidebarCollapsed(
  storageId: string,
): [boolean, (collapsed: boolean) => void] {
  const [collapsed, setLocalCollapsed] = useState(
    () => _getOrCreateSidebarEntry(storageId).collapsed,
  );
  const logger = useLogger();

  useEffect(
    () =>
      _subscribeSidebarEntry(
        storageId,
        (v: boolean): void => setLocalCollapsed(v),
        logger,
      ),
    [storageId, logger],
  );

  const setCollapsed = useCallback(
    (value: boolean): void => {
      setLocalCollapsed(value);
      _setSidebarEntryCollapsed(storageId, value, logger);
    },
    [storageId, logger],
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
  const isAdminUser =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const prodOnly = form.watch("includeProdOnly") ?? false;
  const activeViewAsRole = isAdminUser ? form.watch("viewAsRole") : undefined;
  const activeInstanceId = form.watch("instanceId");
  const workspace = useWorkspaceCompany();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const hasLocalWorkspace =
    !user.isPublic && !activeViewAsRole && !activeInstanceId;
  const activeCompany = hasLocalWorkspace ? workspace?.active : undefined;
  const [recordCompany, setRecordCompany] = useState<{
    key: string;
    companyId: string;
  }>();
  const publishRecordCompany = useCallback(
    (key: string, companyId: string | undefined): void => {
      setRecordCompany((previous) => {
        if (!companyId) {
          return previous?.key === key ? undefined : previous;
        }
        return previous?.key === key && previous.companyId === companyId
          ? previous
          : { key, companyId };
      });
    },
    [],
  );
  // Record counts that landing summaries report for "Work with" shortcuts.
  const [landingCounts, setLandingCounts] = useState<
    Readonly<Record<string, number>>
  >({});
  const publishLandingCounts = useCallback(
    (counts: readonly { alias: string; count: number }[]): void => {
      setLandingCounts((previous) =>
        counts.every(({ alias, count }) => previous[alias] === count)
          ? previous
          : {
              ...previous,
              ...Object.fromEntries(
                counts.map(({ alias, count }) => [alias, count]),
              ),
            },
      );
    },
    [],
  );
  const [reportAction, setReportAction] = useState<{
    reportAlias: string;
    companyId: string;
    actionAlias: string | undefined;
  }>();
  const updateReportAction = (
    reportAlias: string,
    companyId: string,
    actionAlias: string | undefined,
  ): void => {
    setReportAction((previous) =>
      previous?.reportAlias === reportAlias &&
      previous.companyId === companyId &&
      previous.actionAlias === actionAlias
        ? previous
        : { reportAlias, companyId, actionAlias },
    );
  };
  const triggerRefetchRef = useRef<() => void>(() => undefined);
  // Two-pane sidebar mode when on /tools path.
  // Disabled if this widget is nested inside another HelpToolsWidget's admin layout
  // (prevents infinite recursive nesting).
  const inChatToolPicker = useContext(ChatToolNavigationContext);
  const isInsideAdminLayout = useContext(AdminRecordContext) !== null;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAdminLayout =
    !inChatToolPicker &&
    !isInsideAdminLayout &&
    pathname.split("/")[2] === ADMIN_ENDPOINTS_PATH;
  const response = useWidgetValue<typeof definition.GET>();
  const endpointResponse = useWidgetResponse();
  const visibleScope = toolNavigationScope({
    viewAsRole: activeViewAsRole,
    instanceId: activeInstanceId,
    includeProdOnly: prodOnly,
  });
  const scopeMatches = response?.navigationScope === visibleScope;
  const catalogDestinations = scopeMatches
    ? response?.adminCatalogDestinations
    : undefined;
  const catalogPending =
    isAdminLayout &&
    !activeInstanceId &&
    !catalogDestinations &&
    endpointResponse?.success !== false;
  const canOpenLocalEndpoint = useCallback(
    (endpoint: CreateApiEndpointAny): boolean => {
      const values = form.getValues();
      return (
        !values.instanceId &&
        (!isAdminLayout ||
          (catalogDestinations !== undefined &&
            Object.hasOwn(
              catalogDestinations,
              endpointToUrlSegment(endpoint),
            ))) &&
        (!values.includeProdOnly ||
          !endpoint.allowedRoles.includes(PlatformMarker.PRODUCTION_OFF)) &&
        permissionsRegistry.validateEndpointAccess(
          endpoint,
          resolveEffectiveUser(
            user,
            isAdminUser ? values.viewAsRole : undefined,
          ),
          platform,
        ).allowed
      );
    },
    [catalogDestinations, form, isAdminLayout, isAdminUser, platform, user],
  );

  const [selectedAdminEndpoint, setSelectedAdminEndpointState] =
    useState<CreateApiEndpointAny | null>(null);
  const [unavailableSelection, setUnavailableSelection] = useState(false);
  const [isRestoringTool, setIsRestoringTool] = useState(
    () => !!toolAliasFromPathname(pathname),
  );
  const [selectedToolInputs, setSelectedToolInputs] = useState<
    ReturnType<typeof splitToolInputs>
  >({});
  const selectedAdminEndpointRef = useRef<CreateApiEndpointAny | null>(null);
  const selectionRevision = useRef(0);
  const setSelectedAdminEndpoint = useCallback(
    (
      ep: CreateApiEndpointAny | null,
      args: Record<string, string> = {},
    ): void => {
      selectedAdminEndpointRef.current = ep;
      setSelectedAdminEndpointState(ep);
      setSelectedToolInputs(ep ? splitToolInputs(ep, args) : {});
    },
    [],
  );

  // ── URL state helpers ──────────────────────────────────────────────────────
  // Search: ?cat=&sub=&nav=&q=&sf=...  → all state in search params
  // Path:   /tools/<alias>   → base endpoint

  const silentHistory = useSilentHistory();

  // Router state can lag silent writes. Track the effective browser location explicitly.
  const routerSearch = searchParams.toString();
  const effectivePathnameRef = useRef(pathname);
  const effectiveSearchRef = useRef(new URLSearchParams(routerSearch));

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

  // Admin launcher sidebar navigation: path of [catKey] or [catKey, subKey]
  // Initialized from URL search params so state survives reload and back/forward.
  const [sidebarPath, setSidebarPathRaw] = useState<string[]>(() =>
    isAdminLayout ? parseSidebarPathFromSearch(searchParams) : [],
  );

  const [showDirectory, setShowDirectory] = useState(
    () => searchParams.get("catalog") === "all",
  );
  const urlNavStackRef = useRef<ReturnType<typeof useUrlNavStack>>(undefined);

  const restoreBaseTool = useCallback(async (): Promise<void> => {
    const revision = ++selectionRevision.current;
    const alias = toolAliasFromPathname(effectivePathnameRef.current);
    setUnavailableSelection(false);
    if (!alias) {
      setSelectedAdminEndpoint(null);
      setIsRestoringTool(false);
      return;
    }
    setIsRestoringTool(true);
    let endpointDef: CreateApiEndpointAny | null = null;
    try {
      endpointDef = await resolveCatalogEndpoint(alias);
    } catch (error) {
      logger.warn("Could not load catalog endpoint", {
        error: parseError(error).message,
      });
    }
    if (revision !== selectionRevision.current) {
      return;
    }
    if (endpointDef && canOpenLocalEndpoint(endpointDef)) {
      const params = readEndpointSearchParams(effectiveSearchRef.current);
      setSelectedAdminEndpoint(endpointDef, params);
      if (endpointDef.method !== "GET" && Object.keys(params).length > 0) {
        urlNavStackRef.current?._seedStack({
          endpoint: endpointDef,
          params: splitToolInputs(endpointDef, params),
          timestamp: Date.now(),
        });
      }
    } else {
      setSelectedAdminEndpoint(null);
      setUnavailableSelection(true);
    }
    setIsRestoringTool(false);
  }, [canOpenLocalEndpoint, logger, setSelectedAdminEndpoint]);

  const restoreCatalogFilters = useCallback((): void => {
    setShowDirectory(effectiveSearchRef.current.get("catalog") === "all");
    setSidebarPathRaw(parseSidebarPathFromSearch(effectiveSearchRef.current));
    const filters = parseToolsInitialState(effectiveSearchRef.current);
    const previous = form.getValues();
    const changed =
      previous.query !== filters.query ||
      previous.category !== filters.category ||
      previous.subCategory !== filters.subCategory ||
      previous.statsFilter !== filters.statsFilter ||
      previous.page !== filters.page ||
      previous.pageSize !== filters.pageSize ||
      previous.instanceId !== filters.instanceId ||
      previous.includeProdOnly !== filters.includeProdOnly ||
      previous.viewAsRole !== filters.viewAsRole;
    if (changed) {
      form.setValue("query", filters.query);
      form.setValue("category", filters.category);
      form.setValue("subCategory", filters.subCategory);
      form.setValue("statsFilter", filters.statsFilter);
      form.setValue("page", filters.page);
      form.setValue("pageSize", filters.pageSize);
      form.setValue("instanceId", filters.instanceId);
      form.setValue("includeProdOnly", filters.includeProdOnly);
      form.setValue("viewAsRole", filters.viewAsRole);
      setTimeout(triggerRefetchRef.current, 50);
    }
  }, [form]);

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
      if (entry) {
        const sp = copyCatalogSearchParams(effectiveSearchRef.current);
        for (const [k, v] of Object.entries(entry.params)) {
          sp.set(`arg.${k}`, v);
        }
        const path = `/${locale}/${ADMIN_ENDPOINTS_PATH}/${entry.alias}`;
        // Update effective refs eagerly so other reads see the new state.
        effectivePathnameRef.current = path;
        effectiveSearchRef.current = sp;
        return path + (sp.toString() ? `?${sp.toString()}` : "");
      }
      return (
        effectivePathnameRef.current +
        (effectiveSearchRef.current.size > 0
          ? `?${effectiveSearchRef.current.toString()}`
          : "")
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
    const alias = toolAliasFromPathname(effectivePathnameRef.current);
    if (!alias) {
      return null;
    }
    const params = readEndpointSearchParams(effectiveSearchRef.current);
    const base = selectedAdminEndpointRef.current;
    if (
      !base ||
      (alias === endpointToUrlSegment(base) &&
        (base.method === "GET" || Object.keys(params).length === 0))
    ) {
      return null;
    }
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
      selectionRevision.current += 1;
      setIsRestoringTool(!!toolAliasFromPathname(effectivePathnameRef.current));
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
        restoreCatalogFilters();
        if (!restored) {
          void restoreBaseTool();
          return;
        }
        const allowed = canOpenLocalEndpoint(restored.endpoint);
        if (!allowed) {
          urlNavStackRef.current?._clearStack();
          setSelectedAdminEndpoint(null);
        }
        setUnavailableSelection(!allowed);
        setIsRestoringTool(false);
      },
      [
        canOpenLocalEndpoint,
        restoreBaseTool,
        restoreCatalogFilters,
        setSelectedAdminEndpoint,
      ],
    ),
  });
  useEffect(() => {
    urlNavStackRef.current = urlNavStack;
  });

  const lastRouterLocation = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!isAdminLayout || catalogPending) {
      return;
    }
    const observed = `${pathname}?${routerSearch}`;
    const previous = lastRouterLocation.current;
    if (observed === previous) {
      return;
    }
    const browserSearch = new URLSearchParams(getCurrentSearch());
    if (
      pathname !== getCurrentPathname() ||
      routerSearch !== browserSearch.toString()
    ) {
      return;
    }
    lastRouterLocation.current = observed;
    if (
      previous !== undefined &&
      effectivePathnameRef.current === pathname &&
      effectiveSearchRef.current.toString() === routerSearch
    ) {
      return;
    }
    // A loader or Link updated the router, independent of our silent history.
    effectivePathnameRef.current = pathname;
    effectiveSearchRef.current = browserSearch;
    urlNavStackRef.current?._clearStack();
    restoreCatalogFilters();
    void restoreBaseTool();
  }, [
    catalogPending,
    isAdminLayout,
    pathname,
    restoreBaseTool,
    restoreCatalogFilters,
    routerSearch,
  ]);

  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] =
    useSidebarCollapsed("admin-endpoints-sidebar");
  const [localeDialogOpen, setLocaleDialogOpen] = useState(false);
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 930;
  const [mobileSidebarCollapsed, setMobileSidebarCollapsed] = useState(true);
  const [showPickerNavigation, setShowPickerNavigation] = useState(false);
  const [savingToolPreference, setSavingToolPreference] = useState(false);
  const [toolPreferenceError, setToolPreferenceError] = useState(false);
  const recentStorageId =
    !user.isPublic && isAdminLayout
      ? `admin-recent-tools:${user.id}`
      : undefined;
  const [recentTools, setRecentTools] = useState<{
    key: string;
    ids: string[];
  }>();
  useEffect(() => {
    if (!recentStorageId) {
      return;
    }
    const storageId = recentStorageId;
    let cancelled = false;
    const loadRecents = async (): Promise<void> => {
      const stored = await storage.getItem(storageId, logger);
      if (cancelled) {
        return;
      }
      let ids: string[] = [];
      if (stored) {
        try {
          const parsed = recentToolsSchema.safeParse(JSON.parse(stored));
          ids = parsed.success ? parsed.data : [];
        } catch (error) {
          logger.warn("Unable to read recent tools", {
            error: parseError(error).message,
          });
        }
      }
      setRecentTools({ key: storageId, ids });
    };
    void loadRecents();
    return (): void => {
      cancelled = true;
    };
  }, [recentStorageId, logger]);
  const setAdminSidebarCollapsed = isMobile
    ? setMobileSidebarCollapsed
    : setDesktopSidebarCollapsed;

  const openedTool =
    urlNavStack?.stack.findLast(({ renderInModal }) => !renderInModal)
      ?.endpoint ?? selectedAdminEndpoint;
  const openedAlias = openedTool && endpointToUrlSegment(openedTool);
  const recentAllowed =
    openedAlias && !!catalogDestinations?.[openedAlias]?.title;
  const recordedRecent = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (
      !recentStorageId ||
      activeViewAsRole ||
      !openedAlias ||
      !recentAllowed ||
      isRestoringTool
    ) {
      recordedRecent.current = undefined;
      return;
    }
    if (
      recentTools?.key !== recentStorageId ||
      recordedRecent.current === openedAlias
    ) {
      return;
    }
    recordedRecent.current = openedAlias;
    const ids = recentToolIds(recentTools.ids, openedAlias);
    setLocalItem(recentStorageId, JSON.stringify(ids), logger);
    setRecentTools({ key: recentStorageId, ids });
  }, [
    activeViewAsRole,
    isRestoringTool,
    logger,
    openedAlias,
    recentAllowed,
    recentStorageId,
    recentTools,
  ]);

  const localeLabel = getLocaleLabel(locale);

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
  const pickerFavoriteId = inChatToolPicker
    ? form.watch("chatFavoriteId")
    : undefined;
  const pickerSkillId = inChatToolPicker
    ? form.watch("chatSkillId")
    : undefined;
  const activeFavoriteId =
    pickerFavoriteId ??
    (pickerSkillId
      ? null
      : (settingsState.read?.data?.activeFavoriteId ?? null));
  const settingsLoaded = useMemo(
    () => settingsState.read?.data !== undefined,
    [settingsState.read?.data],
  );

  // Settings can outlive a deleted favorite or name a mode without a row.
  // Resolve the selection against the user's favorites before reading its config.
  const favoritesEnabled = !user.isPublic && settingsLoaded;
  const favoritesListState = useEndpoint(
    favoritesListDefinition,
    useMemo(
      () => ({
        read: {
          queryOptions: {
            enabled: favoritesEnabled,
            refetchOnWindowFocus: false,
          },
        },
      }),
      [favoritesEnabled],
    ),
    logger,
    user,
  );
  const favorites = favoritesListState.read?.data?.favorites;
  const effectiveFavoriteId = useMemo((): string | null => {
    if (activeFavoriteId === null) {
      return inChatToolPicker ? null : (favorites?.[0]?.id ?? null);
    }
    return (
      favorites?.find(
        (favorite) =>
          favorite.id === activeFavoriteId ||
          favorite.rowId === activeFavoriteId,
      )?.id ??
      favorites?.find((favorite) => favorite.skillId === activeFavoriteId)
        ?.id ??
      null
    );
  }, [activeFavoriteId, favorites, inChatToolPicker]);

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
        { webPinnedTools: tools, turnStepLimit: undefined },
        undefined,
        locale,
      );
    },
    [user, logger, locale],
  );

  // Load active favorite's tool config
  const canReadFavorite = !user.isPublic && !!effectiveFavoriteId;
  const favoriteState = useEndpoint(
    favoriteByIdDefinition,
    useMemo(
      () => ({
        read: {
          urlPathParams: { id: effectiveFavoriteId ?? "" },
          queryOptions: {
            enabled: canReadFavorite,
            refetchOnWindowFocus: false,
          },
        },
      }),
      [canReadFavorite, effectiveFavoriteId],
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
  const setSidebarPath = useCallback(
    (
      path: string[],
      filter?: StatsFilter,
      mode: "home" | "directory" = "home",
    ): void => {
      setSidebarPathRaw(path);
      const sp = copyCatalogSearchParams(effectiveSearchRef.current);
      sp.delete("cat");
      sp.delete("sub");
      sp.delete("p");
      setShowDirectory(mode === "directory");
      if (mode === "directory") {
        sp.set("catalog", "all");
      } else {
        sp.delete("catalog");
      }
      sp.delete("q");
      form.setValue("query", undefined, { shouldDirty: true });
      if (path[0]) {
        sp.set("cat", path[0]);
      }
      if (path[1]) {
        sp.set("sub", path[1]);
      }
      const nextFilter = filter ?? form.getValues("statsFilter") ?? "webPinned";
      if (nextFilter === "webPinned" && !path[0]) {
        sp.delete("sf");
      } else {
        sp.set("sf", nextFilter);
      }
      form.setValue("category", path[0], { shouldDirty: true });
      form.setValue("subCategory", path[1], { shouldDirty: true });
      form.setValue("statsFilter", nextFilter, { shouldDirty: true });
      form.setValue("page", undefined, { shouldDirty: true });
      selectionRevision.current += 1;
      setSelectedAdminEndpoint(null);
      setUnavailableSelection(false);
      setIsRestoringTool(false);
      urlNavStackRef.current?._clearStack();
      writeSilentUrl(`/${locale}/${ADMIN_ENDPOINTS_PATH}`, sp, true);
      if (isMobile) {
        setAdminSidebarCollapsed(true);
      }
      setTimeout(triggerRefetchRef.current, 50);
    },
    [
      form,
      isMobile,
      locale,
      setAdminSidebarCollapsed,
      setSelectedAdminEndpoint,
      writeSilentUrl,
    ],
  );

  // Browser Back/Forward is handled by useUrlNavStack hook.
  // The onPopState callback restores sidebar path and base endpoint.

  // Vibe-frame overlay for remote tool execution
  const [vibeFrame, setVibeFrame] = useState<{
    serverUrl: string;
    endpoint: string;
  } | null>(null);

  // SSR renders from a per-request query cache (QueryProvider
  // isolateServerRender), so the server and hydrating client agree.
  const isFetching = endpointMutations?.read?.isFetching ?? false;
  const availableTools: HelpToolMetadataSerialized[] = useMemo(
    () => response?.tools ?? [],
    [response],
  );
  const totalCount = response?.totalCount ?? 0;
  const serverPinnedCount = response?.pinnedCount;
  const serverAllowedCount = response?.allowedCount;
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
  const webCategories = scopeMatches ? (response?.webCategories ?? []) : [];
  const hint = response?.hint;

  // Admin context from response
  const currentPlatform = response?.currentPlatform;
  const currentEnv = response?.currentEnv;

  // Instance switcher - fetch connected remote instances
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

  // The server applies statsFilter for every user (public visitors resolve to
  // role defaults) before paginating, so the page is already the visible set.
  const visibleTools = availableTools;

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

  // Stable counts that don't reset to 0 while a refetch is in progress.
  // Updated only when a settled (non-fetching) response arrives.
  // Remember the last settled response (adjust-state-during-render pattern);
  // while settled, the live values are used directly.
  const isSettled = !isFetching && !!response;
  const [lastSettledResponse, setLastSettledResponse] = useState<
    typeof response | null
  >(null);
  if (isSettled && lastSettledResponse !== response) {
    setLastSettledResponse(response);
  }
  const settledResponse = isSettled ? response : lastSettledResponse;
  const stablePinnedCount = isSettled
    ? serverPinnedCount
    : settledResponse?.pinnedCount;
  const stableAllowedCount = isSettled
    ? serverAllowedCount
    : settledResponse?.allowedCount;
  const stableTotalCount = isSettled
    ? totalCount
    : (settledResponse?.totalCount ?? 0);
  const settledAiToolIds = settledResponse?.allAiToolIds;
  const stableAiToolIds: string[] = useMemo(
    () => settledAiToolIds ?? [],
    [settledAiToolIds],
  );

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
    const webPinned =
      settledResponse?.webPinnedCount ??
      (webPinnedTools ?? (user ? getDefaultWebPinnedIdsForUser(user) : []))
        .length;

    return {
      pinned,
      enabled,
      webPinned,
      total: stableTotalCount,
    };
  }, [
    activeFavoriteData,
    webPinnedTools,
    user,
    stablePinnedCount,
    stableAllowedCount,
    settledResponse?.webPinnedCount,
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
    async (
      toolName: string,
      recordSearch?: { field: string; value: string },
    ): Promise<void> => {
      const revision = ++selectionRevision.current;
      // Remote tool: instanceId__toolName → embed via vibe-frame if possible
      const sepIdx = toolName.indexOf("__");
      if (sepIdx !== -1) {
        const instanceId = toolName.slice(0, sepIdx);
        if (
          form.getValues("instanceId") !== instanceId ||
          form.getValues("viewAsRole")
        ) {
          return;
        }
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
        const endpointDef = await resolveCatalogEndpoint(toolName);
        if (revision !== selectionRevision.current) {
          return;
        }
        if (endpointDef && canOpenLocalEndpoint(endpointDef)) {
          const data = recordSearch
            ? { [recordSearch.field]: recordSearch.value }
            : undefined;
          if (
            data &&
            (!isAdminUser ||
              form.getValues("viewAsRole") ||
              endpointDef.method !== "GET" ||
              !endpointDef.requestSchema.safeParse(data).success)
          ) {
            return;
          }
          const alias = endpointToUrlSegment(endpointDef);
          const newPath = `/${locale}/${ADMIN_ENDPOINTS_PATH}/${alias}`;
          if (isMobile) {
            setAdminSidebarCollapsed(true);
          }
          if (
            selectedAdminEndpointRef.current &&
            effectivePathnameRef.current === newPath &&
            !isRestoringTool &&
            !data &&
            !urlNavStack?.canGoBack
          ) {
            return;
          }
          setUnavailableSelection(false);
          setIsRestoringTool(false);
          setSelectedAdminEndpoint(endpointDef, data);
          urlNavStack?._clearStack();
          const sp = copyCatalogSearchParams(effectiveSearchRef.current);
          if (recordSearch && data) {
            sp.set(`arg.${recordSearch.field}`, recordSearch.value);
          }
          writeSilentUrl(newPath, sp, true);
        } else {
          setSelectedAdminEndpoint(null);
          setUnavailableSelection(true);
          setIsRestoringTool(false);
        }
        return;
      }

      await navigateToLocalTool(toolName, navigate);
    },
    [
      connectedInstances,
      canOpenLocalEndpoint,
      form,
      isAdminLayout,
      isAdminUser,
      isMobile,
      isRestoringTool,
      locale,
      navigate,
      setAdminSidebarCollapsed,
      setSelectedAdminEndpoint,
      setVibeFrame,
      writeSilentUrl,
      urlNavStack,
    ],
  );

  // ── Catalog overview drill-down ────────────────────────────────────────────
  // The overview report is embedded in the catalog root. Its drill-downs open
  // the target tool as the selected tool (URL /tools/<alias>?arg.*), so Back
  // returns to the overview.
  const catalogOverviewNavigation = useMemo(
    () => ({
      push: <TEndpoint extends CreateApiEndpointAny>(
        endpointDef: TEndpoint,
        options?: NavigationOptions<TEndpoint>,
      ): void => {
        if (!canOpenLocalEndpoint(endpointDef)) {
          return;
        }
        ++selectionRevision.current;
        setUnavailableSelection(false);
        setIsRestoringTool(false);
        if (urlNavStack && endpointDef.method !== "GET") {
          // The overview opens actions in the tool pane. Keep the stack entry
          // so the form receives its prefill and success navigation.
          setSelectedAdminEndpoint(endpointDef);
          urlNavStack.push(endpointDef, { ...options, renderInModal: false });
          return;
        }
        const args = serializeNavigationData({
          ...options?.urlPathParams,
          ...options?.data,
        });
        const newPath = `/${locale}/${ADMIN_ENDPOINTS_PATH}/${endpointToUrlSegment(endpointDef)}`;
        setSelectedAdminEndpoint(endpointDef, args);
        urlNavStack?._clearStack();
        const sp = copyCatalogSearchParams(effectiveSearchRef.current);
        for (const [key, value] of Object.entries(args)) {
          sp.set(`arg.${key}`, value);
        }
        writeSilentUrl(newPath, sp, true);
      },
    }),
    [
      canOpenLocalEndpoint,
      locale,
      setSelectedAdminEndpoint,
      urlNavStack,
      writeSilentUrl,
    ],
  );

  // ── Admin navigation stack override ─────────────────────────────────────────
  // urlNavStack (from useUrlNavStack) is passed directly as navigationOverride
  // to EndpointsPage. It handles all push/pop/replace + URL sync.

  const catalogRefetchQueued = useRef(false);
  const triggerRefetch = useCallback((): void => {
    if ((isAdminLayout || inChatToolPicker) && isFetching) {
      // The form drops submissions while its GET is running. Replay the latest
      // filters once that response settles.
      catalogRefetchQueued.current = true;
      return;
    }
    catalogRefetchQueued.current = false;
    if (onSubmit) {
      onSubmit();
    } else {
      endpointMutations?.read?.remove?.();
      endpointMutations?.read?.refetch?.();
    }
  }, [
    endpointMutations,
    inChatToolPicker,
    isAdminLayout,
    isFetching,
    onSubmit,
  ]);
  useEffect(() => {
    triggerRefetchRef.current = triggerRefetch;
    if (isFetching || !catalogRefetchQueued.current) {
      return undefined;
    }
    const queued = setTimeout(() => triggerRefetchRef.current(), 0);
    return (): void => clearTimeout(queued);
  }, [isFetching, triggerRefetch]);

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
      if (
        values.statsFilter &&
        (values.statsFilter !== "webPinned" || sp.has("cat"))
      ) {
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

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const catalogInput = useRef<InputRefObject>(null);
  const setSearchQuery = useCallback(
    (value: string) => {
      form.setValue("query", value || undefined, { shouldDirty: true });
      form.setValue("page", undefined, { shouldDirty: true });
      syncFilterParamsToUrl({ query: value || undefined, page: undefined });
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(
        () => triggerRefetchRef.current(),
        400,
      );
    },
    [form, syncFilterParamsToUrl],
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
      if (isAdminLayout) {
        const sp = copyCatalogSearchParams(effectiveSearchRef.current);
        if (instanceId) {
          sp.set("inst", instanceId);
          sp.set("sf", newFilter);
        } else {
          sp.delete("inst");
          sp.delete("sf");
        }
        sp.delete("cat");
        sp.delete("sub");
        sp.delete("p");
        sp.delete("catalog");
        setShowDirectory(false);
        form.setValue("category", undefined, { shouldDirty: true });
        form.setValue("subCategory", undefined, { shouldDirty: true });
        form.setValue("page", undefined, { shouldDirty: true });
        setSidebarPathRaw([]);
        selectionRevision.current += 1;
        setSelectedAdminEndpoint(null);
        setUnavailableSelection(false);
        setIsRestoringTool(false);
        urlNavStackRef.current?._clearStack();
        writeSilentUrl(`/${locale}/${ADMIN_ENDPOINTS_PATH}`, sp, true);
      }
      setTimeout(triggerRefetch, 50);
    },
    [
      form,
      triggerRefetch,
      isAdminLayout,
      locale,
      setSelectedAdminEndpoint,
      writeSilentUrl,
    ],
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
      if (mapped) {
        form.setValue("statsFilter", "web", { shouldDirty: true });
      }
      syncFilterParamsToUrl({
        viewAsRole: mapped,
        ...(mapped && { statsFilter: "web" }),
      });
      setTimeout(triggerRefetch, 50);
    },
    [form, syncFilterParamsToUrl, triggerRefetch],
  );

  const handleStatsFilterChange = useCallback(
    (filter: StatsFilter): void => {
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
    !inChatToolPicker &&
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
    response?.navigationPins?.web ??
      webPinnedTools ??
      getDefaultWebPinnedIdsForUser(user),
  );
  const chatPinnedSet = new Set(response?.navigationPins?.chat);
  const aiAllowedSet = new Set(response?.aiAvailableToolIds);
  const canPin = !user?.isPublic;

  const toggleWebPin = (toolId: string): void => {
    if (!canPin || activeInstanceId || activeViewAsRole) {
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

  const handleToggleWebPin = (
    toolId: string,
    event: ButtonMouseEvent,
  ): void => {
    event.stopPropagation();
    toggleWebPin(toolId);
  };

  const saveToolPreference = async (
    patch: ToolPreferencePatch,
  ): Promise<void> => {
    if (
      !settingsLoaded ||
      savingToolPreference ||
      !canPin ||
      activeViewAsRole ||
      activeInstanceId
    ) {
      return;
    }
    setSavingToolPreference(true);
    setToolPreferenceError(false);
    try {
      const result = await apiClient.mutate(
        settingsDefinition.POST,
        logger,
        user,
        { toolPreference: patch, turnStepLimit: undefined },
        undefined,
        locale,
      );
      if (result.success) {
        await settingsState.read?.refetch?.();
        triggerRefetch();
      } else {
        setToolPreferenceError(true);
      }
    } catch (error) {
      logger.warn("Unable to save tool preference", {
        error: parseError(error).message,
      });
      setToolPreferenceError(true);
    } finally {
      setSavingToolPreference(false);
    }
  };

  const renderToolPreferences = (
    alias: string,
    tool?: HelpToolMetadataSerialized,
  ): JSX.Element | null => {
    if (
      !canPin ||
      !settingsLoaded ||
      activeViewAsRole ||
      activeInstanceId ||
      disabled
    ) {
      return null;
    }
    const id = getPreferredName(alias);
    const hidden = statsFilter === (inChatToolPicker ? "chatHidden" : "hidden");
    const hideKey = inChatToolPicker ? "chatHidden" : "webHidden";
    const pinKey = inChatToolPicker ? "chatPins" : "webPins";
    const pinned = (inChatToolPicker ? chatPinnedSet : webPinnedSet).has(id);
    const canUseAi = aiAllowedSet.has(id);
    const supportsAi =
      inChatToolPicker ||
      tool?.platforms?.includes(Platform.AI) ||
      allAiToolIds.includes(id) ||
      canUseAi;
    const supportsWeb =
      !tool?.platforms || tool.platforms.includes(Platform.NEXT_PAGE);
    const supportsPreferences = inChatToolPicker || supportsWeb;
    const aiPreference =
      settingsState.read?.data?.toolPreferences?.aiEnabled?.[id];
    const aiTool = effectiveEnabledTools.find(
      (entry) => getPreferredName(entry.id) === id,
    );
    const preferenceAction = (
      key: ToolPreferencePatch["key"],
      value: boolean,
    ): void => {
      void saveToolPreference({ toolId: id, key, value });
    };
    if (hidden) {
      return (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={savingToolPreference}
          onClick={() => preferenceAction(hideKey, false)}
        >
          {t("catalog.restoreTool")}
        </Button>
      );
    }
    if (!supportsPreferences && !supportsAi) {
      return null;
    }
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={savingToolPreference}
            aria-label={t("catalog.toolOptions")}
            className="shrink-0"
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {supportsPreferences && (
            <>
              <DropdownMenuItem
                onSelect={() => preferenceAction(pinKey, !pinned)}
              >
                {t(pinned ? "catalog.unfavoriteTool" : "catalog.favoriteTool")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => preferenceAction(hideKey, true)}
              >
                {t("catalog.hideTool")}
              </DropdownMenuItem>
            </>
          )}
          {supportsAi && (
            <>
              <DropdownMenuItem
                onSelect={() =>
                  preferenceAction("aiEnabled", !(aiPreference ?? canUseAi))
                }
              >
                {t(
                  (aiPreference ?? canUseAi)
                    ? "catalog.disableAi"
                    : "catalog.enableAi",
                )}
              </DropdownMenuItem>
              {aiPreference === true && !canUseAi && (
                <DropdownMenuItem disabled>
                  {t("catalog.aiRestricted")}
                </DropdownMenuItem>
              )}
            </>
          )}
          {supportsAi && !!effectiveFavoriteId && !!activeFavoriteData && (
            <>
              <DropdownMenuItem
                disabled={!canUseAi}
                onSelect={() => handleToggleActive(id)}
              >
                {t(
                  aiTool?.pinned
                    ? "aiTools.modal.activeOn"
                    : "aiTools.modal.activeOff",
                )}
              </DropdownMenuItem>
              {aiTool?.pinned && (
                <DropdownMenuItem
                  disabled={!canUseAi}
                  onSelect={() => handleToggleConfirmation(id)}
                >
                  {t(
                    aiTool.requiresConfirmation
                      ? "aiTools.modal.confirmOn"
                      : "aiTools.modal.confirmOff",
                  )}
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const submitCatalogSearch = (): void => {
    clearTimeout(searchDebounceRef.current);
    triggerRefetch();
  };
  const searchBox = (
    <Div className="flex w-full min-w-0 items-center gap-2 rounded-lg border bg-card px-2 focus-within:border-ring">
      <Search
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        ref={catalogInput}
        value={searchQuery}
        onChange={(event) => {
          const value = event.target.value;
          if (
            value &&
            !searchQuery &&
            isAdminLayout &&
            (sidebarPath.length || selectedAdminEndpoint)
          ) {
            setSidebarPath([], activeInstanceId ? "all" : "web");
          }
          if (value && !searchQuery && inChatToolPicker) {
            form.setValue("category", undefined);
            form.setValue("subCategory", undefined);
            form.setValue("statsFilter", "chat");
            setShowPickerNavigation(false);
          }
          setSearchQuery(value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            submitCatalogSearch();
          }
        }}
        aria-label={t("catalog.searchLabel")}
        placeholder={t("aiTools.modal.searchPlaceholder")}
        className="min-w-0 flex-1 border-none bg-transparent px-1 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      {searchQuery && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("catalog.clearSearch")}
          onClick={() => setSearchQuery("")}
        >
          <X className="size-4" />
        </Button>
      )}
    </Div>
  );
  const jumpToPage = (page: number): void => {
    form.setValue("page", page, { shouldDirty: true });
    syncFilterParamsToUrl({ page });
    triggerRefetch();
  };
  const instanceControls = !activeViewAsRole &&
    connectedInstances.length > 0 && (
      <Div className="flex min-w-0 flex-wrap items-center gap-1">
        <Button
          type="button"
          variant={activeInstanceId ? "outline" : "secondary"}
          aria-pressed={!activeInstanceId}
          size="sm"
          onClick={() => handleInstanceChange(undefined)}
        >
          <Monitor className="size-4" />
          {t("catalog.localInstance")}
        </Button>
        {connectedInstances.map((connection) => (
          <Button
            key={connection.instanceId}
            type="button"
            variant={
              activeInstanceId === connection.instanceId
                ? "secondary"
                : "outline"
            }
            size="sm"
            aria-pressed={activeInstanceId === connection.instanceId}
            onClick={() => handleInstanceChange(connection.instanceId)}
          >
            <Globe className="size-4" />
            {connection.instanceId}
          </Button>
        ))}
      </Div>
    );

  const remoteToolOverlay = vibeFrame && (
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
  );

  // Admin layout: two-pane sidebar browser
  if (isAdminLayout) {
    const selectedToolId = selectedAdminEndpoint
      ? endpointToUrlSegment(selectedAdminEndpoint)
      : null;

    const isSearching = searchQuery.trim().length > 0;
    const activeCatKey = sidebarPath[0];
    const activeSubKey = sidebarPath[1];
    const activeNavigationEntry = urlNavStack?.current;
    const displayedEndpoint =
      activeNavigationEntry?.endpoint ?? selectedAdminEndpoint;
    const selectedCategory = displayedEndpoint
      ? (catalogDestinations?.[endpointToUrlSegment(displayedEndpoint)]
          ?.category ?? displayedEndpoint.category)
      : undefined;
    const recordNavigationEntry = urlNavStack?.stack.findLast(
      (entry) => !entry.renderInModal,
    );
    const recordEndpoint =
      recordNavigationEntry?.endpoint ?? selectedAdminEndpoint;
    const companyScopedPage =
      !!recordEndpoint && hasWorkspaceCompanyInput(recordEndpoint);
    const fixedRecordCompany =
      !!recordEndpoint && hasFixedRecordCompany(recordEndpoint);
    const recordCompanyKey =
      fixedRecordCompany && hasLocalWorkspace && !isRestoringTool
        ? adminRecordCompanyKey(
            recordEndpoint,
            (recordNavigationEntry?.params ?? selectedToolInputs).urlPathParams,
          )
        : undefined;
    const companyOnRecord =
      recordCompany && recordCompany.key === recordCompanyKey
        ? workspace?.companies.find(({ id }) => id === recordCompany.companyId)
        : undefined;
    const explicitCompanyId = displayedEndpoint
      ? readWorkspaceCompanyOverride(
          displayedEndpoint,
          activeNavigationEntry?.params ?? selectedToolInputs,
        )
      : undefined;
    const companyScopedEndpoint =
      !!displayedEndpoint && hasWorkspaceCompanyInput(displayedEndpoint);
    const boundRecord =
      !!displayedEndpoint?.path.some(
        (segment) => segment.startsWith("[") && segment !== "[companyId]",
      ) ||
      (displayedEndpoint?.category === "companies" &&
        explicitCompanyId !== undefined);
    const companyInToolbar =
      explicitCompanyId === undefined
        ? activeCompany
        : workspace?.companies.find(({ id }) => id === explicitCompanyId);
    // Restored browser state can affect whether the toolbar shows the switch.
    const companySwitcherVisible =
      hydrated &&
      !isRestoringTool &&
      !fixedRecordCompany &&
      hasLocalWorkspace &&
      workspace &&
      workspace.companies.length > 0 &&
      (companyScopedEndpoint ||
        (!displayedEndpoint &&
          isAdminUser &&
          (!activeCatKey ||
            categoryByKey.get(activeCatKey)?.group === "business"))) &&
      (explicitCompanyId === undefined || companyInToolbar !== undefined);
    const selectWorkspaceCompany = (id: string): void => {
      if (id !== activeCompany?.id) {
        setReportAction(undefined);
      }
      workspace?.select(id);
      if (
        displayedEndpoint &&
        Object.keys(readEndpointSearchParams(effectiveSearchRef.current))
          .length > 0
      ) {
        // Company-specific record filters in the link belong to the old company.
        const search = copyCatalogSearchParams(effectiveSearchRef.current);
        writeSilentUrl(effectivePathnameRef.current, search);
        urlNavStack?._clearStack();
        void restoreBaseTool();
      }
    };
    const privilegedCatalog = isAdminUser && hasLocalWorkspace;
    const isHome =
      !activeInstanceId &&
      !showDirectory &&
      !activeCatKey &&
      !isSearching &&
      statsFilter === "webPinned";
    const canEditPreferences = canPin && !activeInstanceId && !activeViewAsRole;
    const createActions = privilegedCatalog
      ? [
          ...new Map(
            Object.values(
              scopeMatches ? (response?.adminCategoryLandings ?? {}) : {},
            )
              .flatMap((landing) => landing.createActions)
              .map((action) => [action.alias, action]),
          ).values(),
        ]
      : [];
    const createCompanyAction =
      response?.adminCategoryLandings?.companies?.createActions[0];
    const goHome = (): void =>
      setSidebarPath([], activeInstanceId ? "all" : "webPinned");
    const browseDirectory = (category?: string): void => {
      setSidebarPath(
        category ? [category] : [],
        activeInstanceId || category ? "all" : "web",
        "directory",
      );
    };
    const selectCategory = (category: string, subCategory?: string): void => {
      const advanced =
        showDirectory && statsFilter !== "web" && statsFilter !== "webPinned";
      setSidebarPath(
        subCategory ? [category, subCategory] : [category],
        activeInstanceId ? "all" : advanced ? statsFilter : "web",
        advanced ? "directory" : "home",
      );
    };
    const browseTools = (): void => {
      const category = selectedCategory ?? activeCatKey;
      if (category) {
        selectCategory(category);
      } else {
        goHome();
      }
    };
    const fixedToolbarCompany =
      companyOnRecord ??
      (companySwitcherVisible &&
      (boundRecord || workspace.companies.length === 1)
        ? companyInToolbar
        : undefined);
    const companySwitch = fixedToolbarCompany ? (
      <Span
        title={fixedToolbarCompany.name}
        className="inline-flex min-h-8 min-w-0 max-w-full items-center gap-2 rounded-md border bg-background px-2 py-1 text-sm sm:max-w-80"
      >
        <Building className="size-4 shrink-0" aria-hidden="true" />
        <Span className="sr-only">
          {t("erp.companySwitch.current", { name: fixedToolbarCompany.name })}
        </Span>
        <Span
          aria-hidden="true"
          className="line-clamp-2 min-w-0 [overflow-wrap:anywhere]"
        >
          {fixedToolbarCompany.name}
        </Span>
      </Span>
    ) : companySwitcherVisible && companyInToolbar ? (
      <ErpCompanySwitch
        t={t}
        activeCompany={companyInToolbar}
        companies={workspace.companies}
        onSelect={selectWorkspaceCompany}
        onBrowse={isMobile && selectedAdminEndpoint ? browseTools : undefined}
      />
    ) : undefined;
    const scopeOptions: { value: StatsFilter; label: string }[] = [
      { value: "web", label: t("catalog.allTools") },
      { value: "webPinned", label: t("catalog.favorites") },
      ...(canEditPreferences
        ? [{ value: "hidden" as const, label: t("catalog.hidden") }]
        : []),
      ...(privilegedCatalog
        ? [
            { value: "all" as const, label: t("admin.developer") },
            { value: "pinned" as const, label: t("aiTools.modal.chipAiPins") },
            {
              value: "allowed" as const,
              label: t("aiTools.modal.chipAiAllowed"),
            },
            { value: "cliAllowed" as const, label: t("aiTools.modal.chipCli") },
            {
              value: "mcpPinned" as const,
              label: t("aiTools.modal.chipMcpPinned"),
            },
            {
              value: "mcpAllowed" as const,
              label: t("aiTools.modal.chipMcpAllowed"),
            },
          ]
        : []),
    ];
    const navCategory = selectedCategory ?? activeCatKey;
    const navSubCategory = displayedEndpoint
      ? catalogDestinations?.[endpointToUrlSegment(displayedEndpoint)]
          ?.subCategory
      : activeSubKey;
    const sidePanel = (
      <ToolNavigation
        id="platform-admin-navigation"
        t={t}
        locale={locale}
        registry={categoryByKey}
        summaries={
          privilegedCatalog &&
          showDirectory &&
          statsFilter !== "web" &&
          statsFilter !== "webPinned" &&
          statsFilter !== "hidden"
            ? scopeMatches
              ? (response?.navigationCategories ?? [])
              : []
            : webCategories
        }
        activeCategory={navCategory}
        activeSubCategory={navSubCategory}
        homeActive={
          isHome &&
          !displayedEndpoint &&
          !isRestoringTool &&
          !unavailableSelection
        }
        primaryTools={
          scopeMatches && !showDirectory && navCategory
            ? response?.adminCategoryLandings?.[navCategory]?.destinations
            : undefined
        }
        selectedTool={
          displayedEndpoint
            ? endpointToUrlSegment(displayedEndpoint)
            : undefined
        }
        onOpenTool={(alias) => {
          void handleOpenTool(alias);
        }}
        onHome={goHome}
        onSelectCategory={selectCategory}
        instances={instanceControls}
        controls={
          !activeInstanceId && (
            <Select<StatsFilter>
              value={statsFilter}
              onValueChange={(filter) =>
                setSidebarPath([], filter, "directory")
              }
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder={t("catalog.allTools")}>
                  {
                    scopeOptions.find(({ value }) => value === statsFilter)
                      ?.label
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent position="popper">
                {scopeOptions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }
      />
    );
    const selectedToolAllowed =
      selectedAdminEndpoint &&
      canOpenLocalEndpoint(selectedAdminEndpoint) &&
      (!urlNavStack?.current ||
        canOpenLocalEndpoint(urlNavStack.current.endpoint));
    const companyId = activeCompany?.id;
    const toolInputs = selectedAdminEndpoint
      ? applyWorkspaceCompany(
          selectedAdminEndpoint,
          selectedToolInputs,
          companyId,
        )
      : selectedToolInputs;
    const scopedStack =
      companyId && urlNavStack
        ? urlNavStack.stack.map((entry) =>
            applyWorkspaceCompanyToEntry(entry, companyId),
          )
        : undefined;
    const navigationOverride =
      scopedStack && urlNavStack
        ? {
            ...urlNavStack,
            stack: scopedStack,
            current: scopedStack.at(-1) ?? null,
          }
        : urlNavStack;
    // A picker can be scoped to a company without changing the page beneath it.
    const scopedEntry = navigationOverride?.stack.findLast(
      (entry) => !entry.renderInModal,
    );
    const selectedCompanyId = scopedEntry
      ? readWorkspaceCompanyOverride(scopedEntry.endpoint, scopedEntry.params)
      : selectedAdminEndpoint
        ? readWorkspaceCompanyOverride(selectedAdminEndpoint, toolInputs)
        : undefined;
    const baseRecordKey = fixedRecordCompany
      ? adminRecordCompanyKey(selectedAdminEndpoint, toolInputs.urlPathParams)
      : undefined;
    const toolPageKey =
      baseRecordKey ??
      (selectedCompanyId
        ? `${selectedToolId}:${selectedCompanyId}`
        : selectedToolId);
    const mutationOptions = {
      urlPathParams: toolInputs.urlPathParams,
      autoPrefillData: toolInputs.data,
    };
    const toolPageProps = {
      logger,
      locale,
      user,
      platform,
      navigationOverride,
      className: "flex flex-col flex-1 min-w-0",
    };
    const renderSelectedTool = (
      endpoint: CreateApiEndpointAny,
    ): JSX.Element => {
      switch (endpoint.method) {
        case "GET":
          return (
            <EndpointsPage
              {...toolPageProps}
              key={toolPageKey}
              endpoint={{ GET: endpoint }}
              endpointOptions={{
                read: {
                  urlPathParams: toolInputs.urlPathParams,
                  initialState: toolInputs.data,
                },
              }}
            />
          );
        case "PATCH":
          return (
            <EndpointsPage
              {...toolPageProps}
              key={toolPageKey}
              endpoint={{ PATCH: endpoint }}
              endpointOptions={{ update: mutationOptions }}
            />
          );
        case "DELETE":
          return (
            <EndpointsPage
              {...toolPageProps}
              key={toolPageKey}
              endpoint={{ DELETE: endpoint }}
              endpointOptions={{ delete: mutationOptions }}
            />
          );
        case "PUT":
          return (
            <EndpointsPage
              {...toolPageProps}
              key={toolPageKey}
              endpoint={{ PUT: endpoint }}
              endpointOptions={{ create: mutationOptions }}
            />
          );
        case "POST":
          return (
            <EndpointsPage
              {...toolPageProps}
              key={toolPageKey}
              endpoint={{ POST: endpoint }}
              endpointOptions={{ create: mutationOptions }}
            />
          );
        default:
          return <EmptyBlock title={t("catalog.toolNotFound")} />;
      }
    };
    const adminLanding =
      activeCatKey && scopeMatches
        ? response?.adminCategoryLandings?.[activeCatKey]
        : undefined;
    const landingOverview = adminLanding?.summary ?? adminLanding?.overview;
    const homeSummary = Object.values(
      scopeMatches ? (response?.adminCategoryLandings ?? {}) : {},
    ).find(
      ({ summary }) => summary?.scope === "platform" && summary.home,
    )?.summary;
    const renderLandingReport = (
      report: NonNullable<
        HelpGetResponseOutput["adminCategoryLandings"]
      >[string]["summary"],
      contextualActions = false,
    ): JSX.Element | undefined => {
      if (!report) {
        return undefined;
      }
      if (report.scope === "company" && !activeCompany) {
        return (
          <Div className="flex flex-col items-start gap-3 rounded-xl border bg-card p-5">
            <P className="font-medium">{t("erp.overview.noCompany")}</P>
            {createCompanyAction && (
              <Link
                href={`/${locale}/${ADMIN_ENDPOINTS_PATH}/${createCompanyAction.alias}`}
                className="inline-flex min-h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {t("erp.createCompany")}
              </Link>
            )}
          </Div>
        );
      }
      return (
        <CatalogOverview
          alias={report.alias}
          args={report.args}
          progressive={report.progressive}
          onReportAction={contextualActions ? updateReportAction : undefined}
          companyId={report.scope === "company" ? activeCompany?.id : undefined}
          pageProps={{
            ...toolPageProps,
            navigationOverride: catalogOverviewNavigation,
          }}
        />
      );
    };
    const catalogLoading =
      (!scopeMatches || isFetching) && endpointResponse?.success !== false;
    const catalogError =
      endpointResponse?.success === false
        ? endpointResponse.message
        : undefined;
    const openTool = (toolName: string): void => {
      void handleOpenTool(toolName);
    };
    const openRecordSearch = (
      alias: string,
      field: string,
      value: string,
    ): void => {
      void handleOpenTool(alias, { field, value });
    };

    const recordBack = (
      endpoint: CreateApiEndpointAny,
    ): { label: string; onClick: () => void } | undefined => {
      const scope = catalogDestinations?.[endpointToUrlSegment(endpoint)];
      const parameter = endpoint.path.findIndex((segment) =>
        segment.startsWith("["),
      );
      if (!scope || parameter <= 0) {
        return undefined;
      }
      const listPath = [...endpoint.path.slice(0, parameter), "list"];
      const adjacentList = getPreferredName(
        pathSegmentsToToolName(listPath, "GET"),
      );
      const category = categoryByKey.get(scope.category);
      const alias =
        catalogDestinations[adjacentList]?.category === scope.category
          ? adjacentList
          : category?.recordSearch?.alias;
      const target = alias && catalogDestinations[getPreferredName(alias)];
      if (!alias || !target || target.category !== scope.category) {
        return undefined;
      }
      const landing = response?.adminCategoryLandings?.[scope.category];
      const link = [
        ...(landing?.destinations ?? []),
        ...(landing?.actions ?? []),
      ].find((item) => getPreferredName(item.alias) === alias);
      const section = target.subCategory
        ? category?.subcategories?.[target.subCategory]
        : undefined;
      const name =
        link?.title ??
        (section
          ? (localizedLabel(section.labels, locale) ?? section.label)
          : undefined);
      return {
        label: name
          ? t("admin.recordBackTo", { section: name })
          : t("catalog.browse"),
        onClick: () => openTool(alias),
      };
    };

    const breadcrumbCategory = navCategory && categoryByKey.get(navCategory);
    const breadcrumbSub =
      breadcrumbCategory &&
      navSubCategory &&
      breadcrumbCategory.subcategories?.[navSubCategory];
    const displayedAlias =
      displayedEndpoint && endpointToUrlSegment(displayedEndpoint);
    const displayedTitle =
      displayedAlias &&
      (catalogDestinations?.[displayedAlias]?.title ??
        (displayedEndpoint &&
          displayedEndpoint.scopedTranslation
            ?.scopedT(locale)
            .t(displayedEndpoint.title)));
    const recents =
      !canEditPreferences || recentTools?.key !== recentStorageId
        ? []
        : (recentTools?.ids ?? []).flatMap((alias) => {
            const entry = catalogDestinations?.[alias];
            return entry?.title ? [{ alias, title: entry.title }] : [];
          });

    const mainContent = (
      <Div
        id={
          !isRestoringTool && selectedToolAllowed && selectedAdminEndpoint
            ? `admin-tool-${endpointToUrlSegment(urlNavStack?.current?.endpoint ?? selectedAdminEndpoint)}`
            : "admin-catalog"
        }
        className="flex min-h-full w-full min-w-0 flex-col relative"
      >
        {activeViewAsRole && (
          <P className="border-b bg-muted/50 px-4 py-2 text-xs text-muted-foreground sm:px-8">
            {t("catalog.rolePreview", {
              role: t(
                `get.fields.viewAsRole.options.${activeViewAsRole === UserPermissionRole.CUSTOMER ? "customer" : "public"}`,
              ),
            })}
          </P>
        )}
        {toolPreferenceError && (
          <P className="border-b px-4 py-2 text-sm text-destructive">
            {t("catalog.preferenceError")}
          </P>
        )}
        {navCategory && scopeMatches && (
          <Nav
            aria-label={t("catalog.breadcrumbs")}
            className="flex min-w-0 flex-wrap items-center gap-0.5 border-b px-3 py-1 text-sm text-muted-foreground sm:px-7"
          >
            <Button type="button" variant="ghost" size="sm" onClick={goHome}>
              {t("erp.home")}
            </Button>
            <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => selectCategory(navCategory)}
              aria-current={
                !navSubCategory && !displayedTitle ? "page" : undefined
              }
            >
              {breadcrumbCategory
                ? (localizedLabel(breadcrumbCategory.labels, locale) ??
                  breadcrumbCategory.label)
                : humanCategoryName(navCategory)}
            </Button>
            {navSubCategory && (
              <>
                <ChevronRight
                  className="size-3.5 shrink-0"
                  aria-hidden="true"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => selectCategory(navCategory, navSubCategory)}
                  aria-current={!displayedTitle ? "page" : undefined}
                >
                  {breadcrumbSub
                    ? (localizedLabel(breadcrumbSub.labels, locale) ??
                      breadcrumbSub.label)
                    : humanCategoryName(navSubCategory)}
                </Button>
              </>
            )}
            {displayedTitle && (
              <>
                <ChevronRight
                  className="size-3.5 shrink-0"
                  aria-hidden="true"
                />
                <Span className="min-w-0 break-words px-2 font-medium text-foreground">
                  {displayedTitle}
                </Span>
              </>
            )}
          </Nav>
        )}
        {selectedToolAllowed && selectedAdminEndpoint && (
          <Div
            className={cn(
              "flex min-w-0 flex-1 flex-col",
              isRestoringTool && "hidden",
            )}
          >
            <AdminRecordContext.Provider
              value={{
                browse: browseTools,
                browseLabel: t("catalog.browse"),
                retryLabel: t("catalog.retry"),
                accessDeniedLabel: t("admin.recordAccessDenied"),
                recordBack,
                selectLabel: t("catalog.selectRecord"),
                openLabel: t("catalog.openRecord"),
                loadingLabel: t("aiTools.modal.loading"),
              }}
            >
              <AdminRecordCompanyContext.Provider
                value={
                  recordCompanyKey
                    ? { key: recordCompanyKey, publish: publishRecordCompany }
                    : null
                }
              >
                <ToolCompanyContext.Provider
                  value={hasLocalWorkspace ? selectedCompanyId : undefined}
                >
                  {companyScopedPage &&
                  hasLocalWorkspace &&
                  workspace &&
                  !selectedCompanyId ? (
                    <EmptyBlock
                      title={t("erp.overview.noCompany")}
                      action={
                        createCompanyAction
                          ? {
                              label: t("erp.createCompany"),
                              onClick: (): void =>
                                openTool(createCompanyAction.alias),
                            }
                          : undefined
                      }
                    />
                  ) : (
                    renderSelectedTool(selectedAdminEndpoint)
                  )}
                </ToolCompanyContext.Provider>
              </AdminRecordCompanyContext.Provider>
            </AdminRecordContext.Provider>
          </Div>
        )}
        {isRestoringTool ||
        (unavailableSelection &&
          !catalogDestinations &&
          endpointResponse?.success === false) ? (
          <RestoringTool
            loading={t("aiTools.modal.loading")}
            unavailable={t("catalog.openError")}
            retry={t("catalog.retry")}
            failed={!catalogDestinations && endpointResponse?.success === false}
          />
        ) : selectedToolAllowed ? null : unavailableSelection ||
          selectedAdminEndpoint ? (
          <ToolUnavailableState
            reason={
              selectedAdminEndpoint && !unavailableSelection
                ? "permission"
                : "unknown"
            }
            locale={locale}
            back={{ label: t("catalog.browse"), onClick: browseTools }}
          />
        ) : (
          <LandingCountsContext.Provider value={publishLandingCounts}>
            <AdminCatalog
              counts={landingCounts}
              t={t}
              locale={locale}
              registry={categoryByKey}
              activeCategory={activeCatKey}
              activeSubCategory={activeSubKey}
              tools={scopeMatches ? visibleTools : []}
              landing={adminLanding}
              isHome={isHome}
              showLanding={
                !showDirectory &&
                !isSearching &&
                !!activeCatKey &&
                !activeSubKey &&
                statsFilter === "web"
              }
              query={searchQuery}
              recents={recents}
              contextualActionAlias={
                reportAction &&
                reportAction.reportAlias === landingOverview?.alias &&
                reportAction.companyId === activeCompany?.id
                  ? reportAction.actionAlias
                  : undefined
              }
              overview={renderLandingReport(
                landingOverview,
                adminLanding?.contextualActions,
              )}
              homeSummary={renderLandingReport(
                homeSummary && {
                  ...homeSummary,
                  args: { ...homeSummary.args, ...homeSummary.homeArgs },
                },
              )}
              recordSearch={
                privilegedCatalog &&
                scopeMatches &&
                response?.recordSearchTargets?.length ? (
                  <RecordSearch
                    targets={response.recordSearchTargets}
                    t={t}
                    onSearch={openRecordSearch}
                  />
                ) : undefined
              }
              loading={catalogLoading}
              error={catalogError}
              currentPage={response?.currentPage ?? 1}
              totalPages={response?.totalPages ?? 0}
              matchedCount={response?.matchedCount ?? 0}
              onOpenTool={openTool}
              onAllTools={browseDirectory}
              onFavorites={() => setSidebarPath([], "webPinned", "directory")}
              onPage={jumpToPage}
              onRetry={triggerRefetch}
              viewTitle={
                scopeOptions.find(({ value }) => value === statsFilter)?.label
              }
              toolControls={renderToolPreferences}
            />
          </LandingCountsContext.Provider>
        )}
      </Div>
    );

    return (
      <>
        <Div
          className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background"
          onKeyDown={(event) => {
            if (
              (event.ctrlKey || event.metaKey) &&
              event.key.toLowerCase() === "k"
            ) {
              event.preventDefault();
              catalogInput.current?.focus();
            }
          }}
        >
          <LocalePickerDialog
            locale={locale}
            user={user}
            open={localeDialogOpen}
            onOpenChange={setLocaleDialogOpen}
          />

          <Div
            id="admin-tools-toolbar"
            data-admin-ready={hydrated ? "true" : undefined}
            className="relative z-[310] flex shrink-0 flex-wrap items-center gap-1 border-b bg-background px-4 py-2"
          >
            <Div className="hidden min-[930px]:block">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setDesktopSidebarCollapsed(!desktopSidebarCollapsed)
                }
                aria-label={t(
                  desktopSidebarCollapsed
                    ? "catalog.openSidebar"
                    : "aiTools.modal.closeSidebar",
                )}
                aria-expanded={!desktopSidebarCollapsed}
              >
                <PanelLeft className="size-5" aria-hidden="true" />
              </Button>
            </Div>
            <Div className="min-[930px]:hidden">
              <Sheet
                open={isMobile && !mobileSidebarCollapsed}
                onOpenChange={(open) => setMobileSidebarCollapsed(!open)}
              >
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t("catalog.openSidebar")}
                  >
                    <PanelLeft className="size-5" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="flex w-[min(88vw,22rem)] flex-col gap-0 p-0"
                >
                  <SheetTitle className="border-b px-4 py-3">
                    {t("catalog.title")}
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    {t("catalog.navigation")}
                  </SheetDescription>
                  <Div className="min-h-0 flex-1">{sidePanel}</Div>
                </SheetContent>
              </Sheet>
            </Div>

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
                      <Span className="mr-2">{localeLabel.flag}</Span>
                      <Span>{localeLabel.text}</Span>
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
                    <Span className="mr-2">{localeLabel.flag}</Span>
                    <Span>{localeLabel.text}</Span>
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
                    {currentEnv === "development" && (
                      <DropdownMenuItem
                        onSelect={() => handleProdToggle(!prodOnly)}
                      >
                        {t("aiTools.modal.prodOnly")}
                        {prodOnly ? " ✓" : ""}
                      </DropdownMenuItem>
                    )}
                    {/* Reset pins */}
                    {canPin &&
                      !activeViewAsRole &&
                      !activeInstanceId &&
                      (webPinnedTools !== null ||
                        settingsState.read?.data?.toolPreferences?.webPins) && (
                        <Div className="px-2 py-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setWebPinnedTools(null);
                              setTimeout(triggerRefetchRef.current, 300);
                            }}
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

            {/* Logo */}
            <Div
              className={companySwitch ? "hidden min-[930px]:block" : undefined}
            >
              <Logo locale={locale} size="h-8" />
            </Div>
            <Div className="order-last min-w-0 basis-full pt-1 sm:order-none sm:mx-2 sm:max-w-md sm:flex-1 sm:basis-auto sm:pt-0">
              {searchBox}
            </Div>
            <Div className="ml-auto flex min-w-0 flex-1 basis-0 items-center justify-end gap-2 sm:flex-initial sm:basis-auto">
              {companySwitch}
              {privilegedCatalog && createActions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      className="min-h-9 shrink-0 gap-1"
                    >
                      <Plus className="size-4 shrink-0" aria-hidden="true" />
                      {t("admin.new")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="max-h-[60vh] w-64 max-w-[90vw] overflow-y-auto"
                  >
                    {createActions.map(({ alias, title }) => (
                      <DropdownMenuItem
                        key={alias}
                        onSelect={() => void handleOpenTool(alias)}
                      >
                        {title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </Div>
          </Div>

          {/* ── Sidebar + Main Content ──────────────────────────────── */}
          <Div className="relative flex min-h-0 w-full flex-1 flex-row">
            <ResizableContainer
              defaultWidth={252}
              minWidth={200}
              maxWidth="28rem"
              storageId="admin-endpoints-sidebar"
              className="bg-background z-10 max-[930px]:hidden"
              collapsed={desktopSidebarCollapsed}
            >
              <AnimatePresence initial={false} mode="sync">
                {!desktopSidebarCollapsed && (
                  <MotionDiv
                    key="sidebar"
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="h-full"
                  >
                    <Div className="flex flex-col h-full w-full bg-background overflow-hidden border-r border-border">
                      {sidePanel}
                    </Div>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </ResizableContainer>
            {/* Keep the endpoint tree mounted when the sidebar changes modes. */}
            <Div
              className={cn(
                "flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto",
                isMobile ? "w-full" : "relative z-9",
              )}
            >
              {mainContent}
            </Div>
          </Div>
        </Div>
        {remoteToolOverlay}
      </>
    );
  }

  if (inChatToolPicker) {
    const category = form.watch("category");
    const subCategory = form.watch("subCategory");
    const chatFilter =
      statsFilter === "chatHidden" || statsFilter === "chat"
        ? statsFilter
        : "chatPinned";
    const isPickerHome =
      !category && !searchQuery && chatFilter === "chatPinned";
    const selectPickerView = (
      nextFilter: StatsFilter,
      nextCategory?: string,
      nextSubCategory?: string,
    ): void => {
      form.setValue("category", nextCategory, { shouldDirty: true });
      form.setValue("subCategory", nextSubCategory, { shouldDirty: true });
      form.setValue("statsFilter", nextFilter, { shouldDirty: true });
      setShowPickerNavigation(false);
      setSearchQuery("");
    };
    const pickerHeading = searchQuery
      ? t("admin.results")
      : chatFilter === "chatHidden"
        ? t("catalog.hidden")
        : category
          ? categoryLabel(category, locale, categoryByKey.get(category))
          : isPickerHome
            ? t("catalog.favorites")
            : t("catalog.allTools");
    return (
      <Div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Div className="flex shrink-0 items-center gap-2 border-b p-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={t("catalog.navigation")}
            aria-expanded={showPickerNavigation}
            className="shrink-0 md:hidden"
            onClick={() => setShowPickerNavigation(!showPickerNavigation)}
          >
            <PanelLeft className="size-4" aria-hidden="true" />
          </Button>
          {searchBox}
        </Div>
        {toolPreferenceError && (
          <P className="border-b px-4 py-2 text-sm text-destructive">
            {t("catalog.preferenceError")}
          </P>
        )}
        <Div className="flex min-h-0 flex-1">
          <Div
            className={cn(
              "min-h-0 w-full border-r md:block md:w-56 md:shrink-0",
              !showPickerNavigation && "hidden",
            )}
          >
            <ToolNavigation
              id="chat-tool-navigation"
              t={t}
              locale={locale}
              registry={categoryByKey}
              summaries={
                scopeMatches ? (response?.navigationCategories ?? []) : []
              }
              activeCategory={category}
              activeSubCategory={subCategory}
              homeActive={isPickerHome}
              onHome={() => selectPickerView("chatPinned")}
              onSelectCategory={(name, section) =>
                selectPickerView("chat", name, section)
              }
              controls={
                <Div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    aria-pressed={
                      chatFilter === "chat" && !category && !searchQuery
                    }
                    onClick={() => selectPickerView("chat")}
                  >
                    {t("catalog.allTools")}
                  </Button>
                  {canPin && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      aria-pressed={chatFilter === "chatHidden" && !searchQuery}
                      onClick={() => selectPickerView("chatHidden")}
                    >
                      {t("catalog.hidden")}
                    </Button>
                  )}
                </Div>
              }
            />
          </Div>
          <Div
            className={cn(
              "min-w-0 flex-1 overflow-y-auto p-3 sm:p-4",
              showPickerNavigation && "hidden md:block",
            )}
          >
            <H2 className="mb-3 text-base font-semibold">{pickerHeading}</H2>
            {endpointResponse?.success === false ? (
              <EmptyBlock
                title={t("catalog.loadError")}
                action={{ label: t("catalog.retry"), onClick: triggerRefetch }}
              />
            ) : isFetching || !scopeMatches ? (
              <LoadingBlock announce message={t("aiTools.modal.loading")} />
            ) : visibleTools.length > 0 ? (
              <Div className="flex min-w-0 flex-col gap-3">
                <CatalogToolList
                  tools={visibleTools}
                  t={t}
                  toolControls={renderToolPreferences}
                />
                <CatalogPagination
                  t={t}
                  currentPage={response?.currentPage ?? 1}
                  totalPages={response?.totalPages ?? 0}
                  onPage={jumpToPage}
                />
              </Div>
            ) : (
              <EmptyBlock
                title={t(
                  isPickerHome ? "catalog.noFavorites" : "catalog.noTools",
                )}
              />
            )}
          </Div>
        </Div>
      </Div>
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

      {remoteToolOverlay}
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
