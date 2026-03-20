/**
 * Help Tools Widget
 * Unified tool discovery widget for web and AI platforms.
 * - Web: full tool list with enable/disable toggles, category collapsing, click-to-detail
 * - AI/MCP: compact overview or search results
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Bot } from "next-vibe-ui/ui/icons/Bot";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Eye } from "next-vibe-ui/ui/icons/Eye";
import { EyeOff } from "next-vibe-ui/ui/icons/EyeOff";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Monitor } from "next-vibe-ui/ui/icons/Monitor";
import { RotateCcw } from "next-vibe-ui/ui/icons/RotateCcw";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Terminal } from "next-vibe-ui/ui/icons/Terminal";
import { X } from "next-vibe-ui/ui/icons/X";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Input } from "next-vibe-ui/ui/input";
import { Pre } from "next-vibe-ui/ui/pre";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import { Switch } from "next-vibe-ui/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import { P } from "next-vibe-ui/ui/typography";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useCallback, useMemo, useRef, useState } from "react";

import { VibeFrameHost } from "@/app/api/[locale]/system/unified-interface/vibe-frame/VibeFrameHost";

import { getDefaultToolIdsForUser } from "@/app/api/[locale]/agent/chat/constants";
import type { EnabledTool } from "@/app/api/[locale]/agent/chat/hooks/store";
import { useChatSettings } from "@/app/api/[locale]/agent/chat/settings/hooks";
import { ChatSettingsRepositoryClient } from "@/app/api/[locale]/agent/chat/settings/repository-client";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import remoteConnectionListDefinition from "@/app/api/[locale]/user/remote-connection/list/definition";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { Platform } from "../unified-interface/shared/types/platform";
import type definition from "./definition";
import type {
  HelpGetResponseOutput,
  HelpToolMetadataSerialized,
} from "./definition";
import { scopedTranslation } from "./i18n";

/**
 * Props for custom widget — follows the CustomWidgetProps pattern
 */
interface CustomWidgetProps {
  field: {
    value: HelpGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

// ─── Label helpers ──────────────────────────────────────────────────────────

function getToolLabel(tool: HelpToolMetadataSerialized): string {
  return tool.title || tool.aliases?.[0] || tool.id;
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
        .replace(/([A-Z])/g, " $1")
        .replace(/[-]/g, " ")
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
  const { getEndpoint } =
    await import("@/app/api/[locale]/system/generated/endpoint");
  const endpointDef = await getEndpoint(toolName);
  if (endpointDef) {
    navigate(endpointDef, {});
  }
}

// ─── Main widget component ──────────────────────────────────────────────────

export function HelpToolsWidget({ field }: CustomWidgetProps): JSX.Element {
  const { push: navigate } = useWidgetNavigation();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const endpointMutations = useWidgetEndpointMutations();

  // Use settings directly (no ChatProvider dependency)
  const settingsOps = useChatSettings(user, logger);
  const effectiveSettings = useMemo(
    () => settingsOps.settings ?? ChatSettingsRepositoryClient.getDefaults(),
    [settingsOps.settings],
  );
  const enabledTools = useMemo((): EnabledTool[] | null => {
    const { availableTools, pinnedTools } = effectiveSettings;
    if (availableTools === null && pinnedTools === null) {
      return null;
    }
    const allIds = new Set([
      ...(availableTools ?? []).map((t) => t.toolId),
      ...(pinnedTools ?? []).map((t) => t.toolId),
    ]);
    return [...allIds].map((id) => {
      const allowed = availableTools?.find((t) => t.toolId === id);
      const pinned = pinnedTools?.find((t) => t.toolId === id);
      return {
        id,
        requiresConfirmation:
          allowed?.requiresConfirmation ??
          pinned?.requiresConfirmation ??
          false,
        pinned:
          pinnedTools !== null
            ? pinnedTools.some((t) => t.toolId === id)
            : true,
      };
    });
  }, [effectiveSettings]);
  const setEnabledTools = useCallback(
    (tools: EnabledTool[] | null): void => {
      if (tools === null) {
        settingsOps.setTools(null, null);
        return;
      }
      const availableTools = tools.map(({ id, requiresConfirmation }) => ({
        toolId: id,
        requiresConfirmation,
      }));
      const pinnedTools = tools
        .filter((t) => t.pinned)
        .map(({ id, requiresConfirmation }) => ({
          toolId: id,
          requiresConfirmation,
        }));
      settingsOps.setTools(availableTools, pinnedTools);
    },
    [settingsOps],
  );
  const { t } = scopedTranslation.scopedT(locale);

  const searchQuery = form.watch("query") ?? "";
  const statsFilter = form.watch("statsFilter") ?? "pinned";
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  // Vibe-frame overlay for remote tool execution
  const [vibeFrame, setVibeFrame] = useState<{
    serverUrl: string;
    endpoint: string;
  } | null>(null);

  const response = field.value;
  const availableTools: HelpToolMetadataSerialized[] = useMemo(
    () => response?.tools ?? [],
    [response],
  );
  const totalCount = response?.totalCount ?? 0;
  const pinnedCount = response?.pinnedCount;
  const allowedCount = response?.allowedCount;
  const categories = response?.categories ?? [];
  const hint = response?.hint;

  // Admin context from response
  const currentPlatform = response?.currentPlatform;
  const currentEnv = response?.currentEnv;

  // Check if user has admin role (for initial render before response comes back)
  const isAdminUser = useMemo(
    () => !user?.isPublic && user?.roles?.includes(UserPermissionRole.ADMIN),
    [user],
  );

  // Platform / prodOnly / instanceId — read from form (already requestFields in definition)
  const activePlatform = form.watch("platform");
  const prodOnly = form.watch("includeProdOnly") ?? false;

  // Instance switcher — fetch connected remote instances
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
        },
      },
    };
  }, []);
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
    if (enabledTools !== null) {
      return enabledTools;
    }
    // null = default: all tools are allowed (enabled), only role-appropriate DEFAULT_TOOL_IDS are pinned
    const defaultPinnedSet = new Set<string>(getDefaultToolIdsForUser(user));
    return availableTools.map((tool) => ({
      id: tool.id,
      requiresConfirmation: tool.requiresConfirmation ?? false,
      pinned: defaultPinnedSet.has(tool.id),
    }));
  }, [enabledTools, availableTools, user]);

  const toolsByCategory = useMemo(() => {
    const grouped: Record<
      string,
      {
        tools: HelpToolMetadataSerialized[];
        subcategories: Record<string, HelpToolMetadataSerialized[]>;
      }
    > = {};
    for (const tool of availableTools) {
      const category = tool.category;
      if (!grouped[category]) {
        grouped[category] = { tools: [], subcategories: {} };
      }
      grouped[category].tools.push(tool);
      const subKey = getSubcategory(tool.id);
      if (!grouped[category].subcategories[subKey]) {
        grouped[category].subcategories[subKey] = [];
      }
      grouped[category].subcategories[subKey].push(tool);
    }
    return grouped;
  }, [availableTools]);

  const stats = useMemo(
    () => ({
      pinned: pinnedCount ?? 0,
      enabled: allowedCount ?? totalCount,
      total: totalCount,
    }),
    [pinnedCount, allowedCount, totalCount],
  );

  const allVisibleEnabled = useMemo(
    () =>
      availableTools.length > 0 &&
      availableTools.every((tool) =>
        effectiveEnabledTools.some((et) => et.id === tool.id),
      ),
    [availableTools, effectiveEnabledTools],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleToggleEnabled = (toolName: string): void => {
    // Remote tools (instanceId__name) must not pollute local pinned settings
    if (activeInstanceId) {
      return;
    }
    const existing = effectiveEnabledTools.find((et) => et.id === toolName);
    if (existing) {
      setEnabledTools(effectiveEnabledTools.filter((et) => et.id !== toolName));
    } else {
      const tool = availableTools.find((et) => et.id === toolName);
      setEnabledTools([
        ...effectiveEnabledTools,
        {
          id: toolName,
          requiresConfirmation: tool?.requiresConfirmation ?? false,
          pinned: true,
        },
      ]);
    }
  };

  const handleToggleActive = (toolName: string): void => {
    if (activeInstanceId) {
      return;
    }
    setEnabledTools(
      effectiveEnabledTools.map((et) =>
        et.id === toolName ? { ...et, pinned: !et.pinned } : et,
      ),
    );
  };

  const handleToggleConfirmation = (toolName: string): void => {
    if (activeInstanceId) {
      return;
    }
    setEnabledTools(
      effectiveEnabledTools.map((et) =>
        et.id === toolName
          ? { ...et, requiresConfirmation: !et.requiresConfirmation }
          : et,
      ),
    );
  };

  const handleEnableAll = (): void => {
    if (activeInstanceId) {
      return;
    }
    const allIds = availableTools.map((tool) => tool.id);
    const allEnabled = allIds.every((id) =>
      effectiveEnabledTools.some((et) => et.id === id),
    );
    if (allEnabled) {
      setEnabledTools(
        effectiveEnabledTools.filter((et) => !allIds.includes(et.id)),
      );
    } else {
      const toAdd = availableTools
        .filter(
          (tool) => !effectiveEnabledTools.some((et) => et.id === tool.id),
        )
        .map((tool) => ({
          id: tool.id,
          requiresConfirmation: tool.requiresConfirmation ?? false,
          pinned: true,
        }));
      setEnabledTools([...effectiveEnabledTools, ...toAdd]);
    }
  };

  const handleResetToDefault = (): void => {
    setEnabledTools(null);
  };

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
    const ids = tools.map((et) => et.id);
    const allEnabled = ids.every((id) =>
      effectiveEnabledTools.some((et) => et.id === id),
    );
    if (allEnabled) {
      setEnabledTools(
        effectiveEnabledTools.filter((et) => !ids.includes(et.id)),
      );
    } else {
      const toAdd = tools
        .filter(
          (tool) => !effectiveEnabledTools.some((et) => et.id === tool.id),
        )
        .map((tool) => ({
          id: tool.id,
          requiresConfirmation: tool.requiresConfirmation ?? false,
          pinned: true,
        }));
      setEnabledTools([...effectiveEnabledTools, ...toAdd]);
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
        // Fallback: no server URL known — navigate to execute-tool
        const { getEndpoint } =
          await import("@/app/api/[locale]/system/generated/endpoint");
        const executeTool = await getEndpoint("execute-tool");
        if (executeTool) {
          navigate(executeTool, { data: { toolName } });
        }
        return;
      }
      await navigateToLocalTool(toolName, navigate);
    },
    [connectedInstances, navigate],
  );

  const triggerRefetch = useCallback((): void => {
    if (onSubmit) {
      onSubmit();
    } else {
      endpointMutations?.read?.refetch?.();
    }
  }, [onSubmit, endpointMutations]);

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const setSearchQuery = useCallback(
    (value: string) => {
      form.setValue("query", value || undefined);
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(triggerRefetch, 400);
    },
    [form, triggerRefetch],
  );

  const handleInstanceChange = useCallback(
    (instanceId: string | undefined): void => {
      form.setValue("instanceId", instanceId);
      // Remote instance: send "all" so server skips pinned filtering on snapshot tools.
      // Local: restore "pinned" default.
      form.setValue("statsFilter", instanceId ? "all" : "pinned", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setTimeout(triggerRefetch, 50);
    },
    [form, triggerRefetch],
  );

  const handlePlatformChange = useCallback(
    (platform: Platform | undefined): void => {
      form.setValue("platform", platform);
      setTimeout(triggerRefetch, 50);
    },
    [form, triggerRefetch],
  );

  const handleProdToggle = useCallback(
    (checked: boolean): void => {
      form.setValue("includeProdOnly", checked || undefined);
      setTimeout(triggerRefetch, 50);
    },
    [form, triggerRefetch],
  );

  const handleStatsFilterChange = useCallback(
    (filter: "pinned" | "allowed" | "all"): void => {
      form.setValue("statsFilter", filter, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setTimeout(triggerRefetch, 50);
    },
    [form, triggerRefetch],
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  // Overview mode (no tools returned, just categories)
  if (availableTools.length === 0 && categories.length > 0) {
    return (
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
    );
  }

  // Detail mode: single tool with parameters
  if (availableTools.length === 1 && response?.matchedCount === 1) {
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

        <Button
          variant="default"
          size="sm"
          onClick={(): void => {
            void handleOpenTool(tool.id);
          }}
        >
          {t("get.fields.openTool.label")}
        </Button>
      </Div>
    );
  }
  const platformTabs = [
    {
      key: undefined,
      label: t("aiTools.platformFilter.all"),
      icon: <Globe className="h-3 w-3" />,
    },
    {
      key: Platform.CLI,
      label: t("aiTools.platformFilter.cli"),
      icon: <Terminal className="h-3 w-3" />,
    },
    {
      key: Platform.CLI_PACKAGE,
      label: t("aiTools.platformFilter.cliPackage"),
      icon: <Terminal className="h-3 w-3" />,
    },
    {
      key: Platform.MCP,
      label: t("aiTools.platformFilter.mcp"),
      icon: <Zap className="h-3 w-3" />,
    },
    {
      key: Platform.AI,
      label: t("aiTools.platformFilter.ai"),
      icon: <Monitor className="h-3 w-3" />,
    },
    {
      key: Platform.TRPC,
      label: t("aiTools.platformFilter.web"),
      icon: <Globe className="h-3 w-3" />,
    },
    {
      key: Platform.CRON,
      label: t("aiTools.platformFilter.cron"),
      icon: <Clock className="h-3 w-3" />,
    },
    {
      key: Platform.ELECTRON,
      label: t("aiTools.platformFilter.electron"),
      icon: <Monitor className="h-3 w-3" />,
    },
    {
      key: Platform.FRAME,
      label: t("aiTools.platformFilter.frame"),
      icon: <MessageSquare className="h-3 w-3" />,
    },
    {
      key: Platform.REMOTE_SKILL,
      label: t("aiTools.platformFilter.skill"),
      icon: <Bot className="h-3 w-3" />,
    },
    {
      key: Platform.NEXT_PAGE,
      label: t("aiTools.platformFilter.nextPage"),
      icon: <Globe className="h-3 w-3" />,
    },
    {
      key: Platform.NEXT_API,
      label: t("aiTools.platformFilter.nextApi"),
      icon: <Globe className="h-3 w-3" />,
    },
  ] as const satisfies Array<{
    key: Platform | undefined;
    label: string;
    icon: JSX.Element;
  }>;
  // Exhaustive check: compile error if a Platform value is missing from the array above
  type _PlatformTabKeys = Exclude<
    (typeof platformTabs)[number]["key"],
    undefined
  >;
  const _exhaustiveCheck: [_PlatformTabKeys] extends [Platform]
    ? [Platform] extends [_PlatformTabKeys]
      ? true
      : never
    : never = true;
  void _exhaustiveCheck;

  // Full list mode (web)
  return (
    <Div className="flex flex-col gap-0">
      {/* Admin Platform & Env Bar */}
      {isAdminUser && (
        <Div className="px-4 pt-4 pb-2 flex flex-col gap-2">
          {/* Environment + Platform Info */}
          <Div className="flex items-center gap-2 text-xs text-muted-foreground">
            {currentEnv && (
              <Badge
                variant={currentEnv === "production" ? "default" : "secondary"}
                className={cn(
                  "text-[10px] font-mono",
                  currentEnv === "production"
                    ? "bg-red-500/10 text-red-600 border-red-500/20"
                    : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                )}
              >
                {currentEnv === "production" ? "PROD" : "DEV"}
              </Badge>
            )}
            {currentPlatform && (
              <Badge variant="outline" className="text-[10px] font-mono">
                {currentPlatform}
              </Badge>
            )}
          </Div>

          {/* Platform Filter + Prod Toggle */}
          <Div className="flex items-center gap-2">
            <Select<Platform | "all">
              value={activePlatform ?? "all"}
              onValueChange={(v) =>
                handlePlatformChange(v === "all" ? undefined : v)
              }
            >
              <SelectTrigger className="h-7 text-xs w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platformTabs.map(({ key, label, icon }) => (
                  <SelectItem key={key ?? "all"} value={key ?? "all"}>
                    <Div className="flex items-center gap-1.5">
                      {icon}
                      <Span>{label}</Span>
                    </Div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Dev/Prod Toggle (only visible in dev) */}
            {currentEnv === "development" && (
              <Div className="flex items-center gap-1.5 ml-auto">
                <Span className="text-[11px] text-muted-foreground">
                  {t("aiTools.envFilter.production")}
                </Span>
                <Switch
                  checked={prodOnly}
                  onCheckedChange={handleProdToggle}
                  className="h-4 w-7"
                />
              </Div>
            )}
          </Div>
        </Div>
      )}

      {/* Instance Switcher — shows when remote instances are connected */}
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
                    "border-red-500/30 text-red-600",
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
      <Div className="flex items-center gap-1.5 px-4 pt-4">
        {(
          [
            ...(!user?.isPublic
              ? [
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
                ]
              : []),
            {
              key: "all" as const,
              icon: null,
              label: t("aiTools.modal.totalLabel"),
              count: stats.total,
            },
          ] as const
        ).map(({ key, icon: Icon, label, count }) => (
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
            {Icon && <Icon className="h-3 w-3 shrink-0" />}
            <Span className="tabular-nums font-bold">{count}</Span>
            <Span className="capitalize">{label}</Span>
          </Button>
        ))}
      </Div>

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

          <Div className="flex gap-2">
            {availableTools.length > 0 && (
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
          </Div>
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
          {availableTools.length === 0 ? (
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
                                  {subTools.map((tool) => (
                                    <ToolRow
                                      key={tool.id}
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
                                      t={t}
                                    />
                                  ))}
                                </Div>
                              </Div>
                            ))
                          ) : (
                            <Div className="divide-y">
                              {tools.map((tool) => (
                                <ToolRow
                                  key={tool.id}
                                  tool={tool}
                                  effectiveEnabledTools={effectiveEnabledTools}
                                  onToggleEnabled={handleToggleEnabled}
                                  onToggleActive={handleToggleActive}
                                  onToggleConfirmation={
                                    handleToggleConfirmation
                                  }
                                  onOpenTool={handleOpenTool}
                                  t={t}
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
          <Div className="flex items-center gap-4">
            <Div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <Span>{t("aiTools.modal.legendActive")}</Span>
            </Div>
            <Div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <Span>{t("aiTools.modal.legendConfirm")}</Span>
            </Div>
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
  t,
}: {
  tool: HelpToolMetadataSerialized;
  effectiveEnabledTools: EnabledTool[];
  onToggleEnabled: (toolName: string) => void;
  onToggleActive: (toolName: string) => void;
  onToggleConfirmation: (toolName: string) => void;
  onOpenTool: (toolName: string) => Promise<void>;
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
}): JSX.Element {
  const enabledTool = effectiveEnabledTools.find((et) => et.id === tool.id);
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
        <Switch
          checked={isEnabled}
          onCheckedChange={() => onToggleEnabled(tool.id)}
          className="h-4 w-7 shrink-0"
        />
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
        {isEnabled && (
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
                    onToggleActive(tool.id);
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
        {isEnabled && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 w-7 p-0 shrink-0",
                    requiresConfirmation
                      ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20"
                      : "text-muted-foreground/40 hover:text-muted-foreground",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleConfirmation(tool.id);
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 shrink-0 text-muted-foreground/40 hover:text-primary hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  void onOpenTool(tool.id);
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
      </Div>
    </Div>
  );
}
