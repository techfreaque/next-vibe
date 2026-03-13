/**
 * Help Tools Widget
 * Unified tool discovery widget for web and AI platforms.
 * - Web: full tool list with enable/disable toggles, category collapsing, click-to-detail
 * - AI/MCP: compact overview or search results
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Eye } from "next-vibe-ui/ui/icons/Eye";
import { EyeOff } from "next-vibe-ui/ui/icons/EyeOff";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { Monitor } from "next-vibe-ui/ui/icons/Monitor";
import { RotateCcw } from "next-vibe-ui/ui/icons/RotateCcw";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Terminal } from "next-vibe-ui/ui/icons/Terminal";
import { X } from "next-vibe-ui/ui/icons/X";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Input } from "next-vibe-ui/ui/input";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";
import { Switch } from "next-vibe-ui/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";

import { getDefaultToolIds } from "@/app/api/[locale]/agent/chat/constants";
import type { EnabledTool } from "@/app/api/[locale]/agent/chat/hooks/store";
import { useChatSettings } from "@/app/api/[locale]/agent/chat/settings/hooks";
import { ChatSettingsRepositoryClient } from "@/app/api/[locale]/agent/chat/settings/repository-client";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

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
  const parts = toolName.split("_");
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

async function navigateToTool(
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
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();
  const endpointMutations = useWidgetEndpointMutations();

  // Use settings directly (no ChatProvider dependency)
  const settingsOps = useChatSettings(user, logger);
  const effectiveSettings = useMemo(
    () => settingsOps.settings ?? ChatSettingsRepositoryClient.getDefaults(),
    [settingsOps.settings],
  );
  const enabledTools = useMemo((): EnabledTool[] | null => {
    const { allowedTools, pinnedTools } = effectiveSettings;
    if (allowedTools === null && pinnedTools === null) {
      return null;
    }
    const allIds = new Set([
      ...(allowedTools ?? []).map((t) => t.toolId),
      ...(pinnedTools ?? []).map((t) => t.toolId),
    ]);
    return [...allIds].map((id) => {
      const allowed = allowedTools?.find((t) => t.toolId === id);
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
      const allowedTools = tools.map(({ id, requiresConfirmation }) => ({
        toolId: id,
        requiresConfirmation,
      }));
      const pinnedTools = tools
        .filter((t) => t.pinned)
        .map(({ id, requiresConfirmation }) => ({
          toolId: id,
          requiresConfirmation,
        }));
      settingsOps.setTools(allowedTools, pinnedTools);
    },
    [settingsOps],
  );
  const { t } = scopedTranslation.scopedT(locale);

  const searchQuery = (form.watch("query") as string | undefined) ?? "";
  const setSearchQuery = useCallback(
    (value: string) => {
      form.setValue("query", value);
    },
    [form],
  );
  const [statsFilter, setStatsFilter] = useState<"all" | "pinned" | "allowed">(
    "pinned",
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const response = field.value;
  const availableTools: HelpToolMetadataSerialized[] = useMemo(
    () => response?.tools ?? [],
    [response],
  );
  const totalCount = response?.totalCount ?? 0;
  const categories = response?.categories ?? [];
  const hint = response?.hint;

  // Admin context from response
  const isAdmin = response?.isAdmin ?? false;
  const currentPlatform = response?.currentPlatform;
  const currentEnv = response?.currentEnv;

  // Check if user has admin role (for initial render before response comes back)
  const isAdminUser = useMemo(
    () => !user?.isPublic && user?.roles?.includes(UserPermissionRole.ADMIN),
    [user],
  );

  // Platform filter state
  const [activePlatform, setActivePlatform] = useState<string | undefined>(
    undefined,
  );
  const [prodOnly, setProdOnly] = useState(false);

  const effectiveEnabledTools = useMemo((): EnabledTool[] => {
    if (enabledTools !== null) {
      return enabledTools;
    }
    // null = default: all tools are allowed (enabled), only DEFAULT_TOOL_IDS are pinned
    const defaultPinnedSet = new Set<string>(getDefaultToolIds());
    return availableTools.map((tool) => ({
      id: tool.id,
      requiresConfirmation: tool.requiresConfirmation ?? false,
      pinned: defaultPinnedSet.has(tool.id),
    }));
  }, [enabledTools, availableTools]);

  const filteredTools = useMemo((): HelpToolMetadataSerialized[] => {
    const enabledIds = new Set(effectiveEnabledTools.map((et) => et.id));
    const pinnedIds = new Set(
      effectiveEnabledTools.filter((et) => et.pinned).map((et) => et.id),
    );
    let tools = availableTools;
    if (statsFilter === "pinned") {
      tools = tools.filter((tool) => pinnedIds.has(tool.id));
    } else if (statsFilter === "allowed") {
      tools = tools.filter((tool) => enabledIds.has(tool.id));
    }
    if (searchQuery.length === 0) {
      return tools;
    }
    const query = searchQuery.toLowerCase();
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category?.toLowerCase().includes(query) ||
        tool.aliases?.some((a) => a.toLowerCase().includes(query)) ||
        (tool.tags?.some((tag) => tag.toLowerCase().includes(query)) ?? false),
    );
  }, [availableTools, searchQuery, statsFilter, effectiveEnabledTools]);

  const toolsByCategory = useMemo(() => {
    const grouped: Record<
      string,
      {
        tools: HelpToolMetadataSerialized[];
        subcategories: Record<string, HelpToolMetadataSerialized[]>;
      }
    > = {};
    for (const tool of filteredTools) {
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
  }, [filteredTools]);

  const stats = useMemo(() => {
    const pinned = effectiveEnabledTools.filter((et) => et.pinned).length;
    const enabled = effectiveEnabledTools.length;
    return { pinned, enabled, total: totalCount };
  }, [effectiveEnabledTools, totalCount]);

  const allVisibleEnabled = useMemo(
    () =>
      filteredTools.length > 0 &&
      filteredTools.every((tool) =>
        effectiveEnabledTools.some((et) => et.id === tool.id),
      ),
    [filteredTools, effectiveEnabledTools],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleToggleEnabled = (toolName: string): void => {
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
    setEnabledTools(
      effectiveEnabledTools.map((et) =>
        et.id === toolName ? { ...et, pinned: !et.pinned } : et,
      ),
    );
  };

  const handleToggleConfirmation = (toolName: string): void => {
    setEnabledTools(
      effectiveEnabledTools.map((et) =>
        et.id === toolName
          ? { ...et, requiresConfirmation: !et.requiresConfirmation }
          : et,
      ),
    );
  };

  const handleEnableAll = (): void => {
    const allIds = filteredTools.map((tool) => tool.id);
    const allEnabled = allIds.every((id) =>
      effectiveEnabledTools.some((et) => et.id === id),
    );
    if (allEnabled) {
      setEnabledTools(
        effectiveEnabledTools.filter((et) => !allIds.includes(et.id)),
      );
    } else {
      const toAdd = filteredTools
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

  const handleOpenTool = async (toolName: string): Promise<void> => {
    await navigateToTool(toolName, navigate);
  };

  const triggerRefetch = useCallback((): void => {
    if (onSubmit) {
      onSubmit();
    } else {
      endpointMutations?.read?.refetch?.();
    }
  }, [onSubmit, endpointMutations]);

  const handlePlatformChange = useCallback(
    (platform: string | undefined): void => {
      setActivePlatform(platform);
      form?.setValue(
        "platform",
        platform as "cli" | "mcp" | "ai" | "web" | "all" | undefined,
      );
      // Small delay to let form state propagate to Zustand store
      setTimeout(triggerRefetch, 50);
    },
    [form, triggerRefetch],
  );

  const handleProdToggle = useCallback(
    (checked: boolean): void => {
      setProdOnly(checked);
      form?.setValue("includeProdOnly", checked || undefined);
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
                      p === "cli" && "border-amber-500/30 text-amber-600",
                      p === "mcp" && "border-violet-500/30 text-violet-600",
                      p === "ai" && "border-blue-500/30 text-blue-600",
                      p === "web" && "border-emerald-500/30 text-emerald-600",
                      p === "cron" && "border-gray-500/30 text-gray-600",
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
            void navigateToTool(tool.id, navigate);
          }}
        >
          {t("get.fields.openTool.label")}
        </Button>
      </Div>
    );
  }

  // Full list mode (web)
  return (
    <Div className="flex flex-col gap-0">
      {/* Admin Platform & Env Bar */}
      {(isAdmin || isAdminUser) && (
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

          {/* Platform Tabs */}
          <Div className="flex items-center gap-1">
            {(
              [
                {
                  key: undefined,
                  label: t("aiTools.platformFilter.all"),
                  icon: <Globe className="h-3 w-3" />,
                },
                {
                  key: "cli",
                  label: t("aiTools.platformFilter.cli"),
                  icon: <Terminal className="h-3 w-3" />,
                },
                {
                  key: "mcp",
                  label: t("aiTools.platformFilter.mcp"),
                  icon: <Zap className="h-3 w-3" />,
                },
                {
                  key: "ai",
                  label: t("aiTools.platformFilter.ai"),
                  icon: <Monitor className="h-3 w-3" />,
                },
                {
                  key: "web",
                  label: t("aiTools.platformFilter.web"),
                  icon: <Globe className="h-3 w-3" />,
                },
              ] as const
            ).map(({ key, label, icon }) => (
              <Button
                key={key ?? "all"}
                variant={activePlatform === key ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-7 text-xs gap-1.5 px-2.5",
                  activePlatform === key &&
                    "bg-primary text-primary-foreground",
                )}
                onClick={() => handlePlatformChange(key)}
              >
                {icon}
                <Span>{label}</Span>
              </Button>
            ))}

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

      {/* Filter chips */}
      <Div className="flex items-center gap-1.5 px-4 pt-4">
        {(
          [
            {
              key: "pinned",
              icon: Eye,
              label: t("aiTools.modal.pinnedLabel"),
              count: stats.pinned,
            },
            {
              key: "allowed",
              icon: Shield,
              label: t("aiTools.modal.enabledLabel"),
              count: stats.enabled,
            },
            {
              key: "all",
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
            onClick={() => setStatsFilter(key)}
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
            {filteredTools.length > 0 && (
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
        <Div
          style={{
            maxHeight: "45dvh",
            overflowY: "auto",
            paddingRight: "4px",
            contain: "layout",
          }}
        >
          {filteredTools.length === 0 ? (
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
                      p === "cli" && "border-amber-500/30 text-amber-600",
                      p === "mcp" && "border-violet-500/30 text-violet-600",
                      p === "ai" && "border-blue-500/30 text-blue-600",
                      p === "web" && "border-emerald-500/30 text-emerald-600",
                      p === "cron" && "border-gray-500/30 text-gray-600",
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
