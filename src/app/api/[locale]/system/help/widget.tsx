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
import {
  Check,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
  Search,
  Shield,
  X,
} from "next-vibe-ui/ui/icons";
import { Input } from "next-vibe-ui/ui/input";
import { Pre } from "next-vibe-ui/ui/pre";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
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
import { useMemo, useState } from "react";

import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { EnabledTool } from "@/app/api/[locale]/agent/chat/hooks/store";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { useWidgetNavigation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { simpleT } from "@/i18n/core/shared";

import type definition from "./definition";
import type {
  HelpGetResponseOutput,
  HelpToolMetadataSerialized,
} from "./definition";

/**
 * Props for custom widget — follows the CustomWidgetProps pattern
 */
interface CustomWidgetProps {
  field: {
    value: HelpGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

// ─── Category/label helpers ─────────────────────────────────────────────────

function humanizeCategory(category: string): string {
  if (!category.startsWith("app.")) {
    return category;
  }
  const parts = category.split(".");
  const apiIdx = parts.indexOf("api");
  const catIdx = parts.indexOf("category");
  if (apiIdx >= 0 && catIdx > apiIdx + 1) {
    const segments = parts.slice(apiIdx + 1, catIdx);
    return segments
      .map((s) =>
        s
          .replace(/([A-Z])/g, " $1")
          .replace(/[-_]/g, " ")
          .trim()
          .replace(/^\w/, (c) => c.toUpperCase()),
      )
      .join(" > ");
  }
  return parts[parts.length - 1].replace(/^\w/, (c) => c.toUpperCase());
}

function getToolLabel(tool: HelpToolMetadataSerialized): string {
  if (tool.aliases && tool.aliases.length > 0) {
    return tool.aliases[0]
      .replace(/[-_:]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  const parts = tool.toolName.split("_");
  const method = parts[parts.length - 1];
  const pathParts = parts.slice(0, -1);
  const meaningful = pathParts.slice(-2);
  const verb =
    method === "GET"
      ? "Get"
      : method === "POST"
        ? "Create"
        : method === "PUT"
          ? "Update"
          : method === "PATCH"
            ? "Edit"
            : method === "DELETE"
              ? "Delete"
              : method;
  const resource = meaningful
    .map((s) =>
      s
        .replace(/([A-Z])/g, " $1")
        .replace(/[-]/g, " ")
        .trim()
        .replace(/^\w/, (c) => c.toUpperCase()),
    )
    .join(" ");
  return `${verb} ${resource}`;
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
  interface EndpointNodeMap {
    [key: string]: EndpointNodeMap | CreateApiEndpointAny;
  }
  const { endpoints } =
    await import("@/app/api/[locale]/system/generated/endpoints");
  const toolParts = toolName.split("_");
  const method = toolParts[toolParts.length - 1];
  const pathSegments = toolParts.slice(0, -1);

  let node = endpoints as EndpointNodeMap;
  for (const seg of pathSegments) {
    const next = node[seg] as EndpointNodeMap | undefined;
    if (!next || typeof next !== "object") {
      return;
    }
    node = next;
  }
  const endpointDef = node[method];
  if (endpointDef && "method" in endpointDef) {
    navigate(endpointDef as CreateApiEndpointAny, {});
  }
}

// ─── Main widget component ──────────────────────────────────────────────────

export function HelpToolsWidget({ field }: CustomWidgetProps): JSX.Element {
  const { push: navigate } = useWidgetNavigation();
  const { enabledTools, setEnabledTools } = useChatContext();
  const locale = "en-US";
  const { t } = simpleT(locale as Parameters<typeof simpleT>[0]);

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const response = field.value;
  const availableTools: HelpToolMetadataSerialized[] = useMemo(
    () => response?.tools ?? [],
    [response],
  );
  const totalCount = response?.totalCount ?? 0;
  const matchedCount = response?.matchedCount ?? 0;
  const categories = response?.categories ?? [];
  const hint = response?.hint;

  const effectiveEnabledTools = useMemo((): EnabledTool[] => {
    if (enabledTools !== null) {
      return enabledTools;
    }
    return availableTools.map((tool) => ({
      id: tool.toolName,
      requiresConfirmation: tool.requiresConfirmation ?? false,
      active: false,
    }));
  }, [enabledTools, availableTools]);

  const filteredTools = useMemo((): HelpToolMetadataSerialized[] => {
    if (searchQuery.length === 0) {
      return availableTools;
    }
    const query = searchQuery.toLowerCase();
    return availableTools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category?.toLowerCase().includes(query) ||
        tool.aliases?.some((a) => a.toLowerCase().includes(query)) ||
        (tool.tags?.some((tag) => tag.toLowerCase().includes(query)) ?? false),
    );
  }, [availableTools, searchQuery]);

  const toolsByCategory = useMemo(() => {
    const grouped: Record<
      string,
      {
        tools: HelpToolMetadataSerialized[];
        subcategories: Record<string, HelpToolMetadataSerialized[]>;
      }
    > = {};
    for (const tool of filteredTools) {
      const category = humanizeCategory(tool.category ?? "Other");
      if (!grouped[category]) {
        grouped[category] = { tools: [], subcategories: {} };
      }
      grouped[category].tools.push(tool);
      const subKey = getSubcategory(tool.toolName);
      if (!grouped[category].subcategories[subKey]) {
        grouped[category].subcategories[subKey] = [];
      }
      grouped[category].subcategories[subKey].push(tool);
    }
    return grouped;
  }, [filteredTools]);

  const stats = useMemo(() => {
    const active = effectiveEnabledTools.filter((t) => t.active).length;
    const enabled = effectiveEnabledTools.length;
    return { active, enabled, total: totalCount };
  }, [effectiveEnabledTools, totalCount]);

  const allVisibleEnabled = useMemo(
    () =>
      filteredTools.length > 0 &&
      filteredTools.every((tool) =>
        effectiveEnabledTools.some((t) => t.id === tool.toolName),
      ),
    [filteredTools, effectiveEnabledTools],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleToggleEnabled = (toolName: string): void => {
    const existing = effectiveEnabledTools.find((t) => t.id === toolName);
    if (existing) {
      setEnabledTools(effectiveEnabledTools.filter((t) => t.id !== toolName));
    } else {
      const tool = availableTools.find((t) => t.toolName === toolName);
      setEnabledTools([
        ...effectiveEnabledTools,
        {
          id: toolName,
          requiresConfirmation: tool?.requiresConfirmation ?? false,
          active: true,
        },
      ]);
    }
  };

  const handleToggleActive = (toolName: string): void => {
    setEnabledTools(
      effectiveEnabledTools.map((t) =>
        t.id === toolName ? { ...t, active: !t.active } : t,
      ),
    );
  };

  const handleToggleConfirmation = (toolName: string): void => {
    setEnabledTools(
      effectiveEnabledTools.map((t) =>
        t.id === toolName
          ? { ...t, requiresConfirmation: !t.requiresConfirmation }
          : t,
      ),
    );
  };

  const handleEnableAll = (): void => {
    const allIds = filteredTools.map((tool) => tool.toolName);
    const allEnabled = allIds.every((id) =>
      effectiveEnabledTools.some((t) => t.id === id),
    );
    if (allEnabled) {
      setEnabledTools(
        effectiveEnabledTools.filter((t) => !allIds.includes(t.id)),
      );
    } else {
      const toAdd = filteredTools
        .filter(
          (tool) => !effectiveEnabledTools.some((t) => t.id === tool.toolName),
        )
        .map((tool) => ({
          id: tool.toolName,
          requiresConfirmation: tool.requiresConfirmation ?? false,
          active: true,
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
    const ids = tools.map((t) => t.toolName);
    const allEnabled = ids.every((id) =>
      effectiveEnabledTools.some((t) => t.id === id),
    );
    if (allEnabled) {
      setEnabledTools(effectiveEnabledTools.filter((t) => !ids.includes(t.id)));
    } else {
      const toAdd = tools
        .filter(
          (tool) => !effectiveEnabledTools.some((t) => t.id === tool.toolName),
        )
        .map((tool) => ({
          id: tool.toolName,
          requiresConfirmation: tool.requiresConfirmation ?? false,
          active: true,
        }));
      setEnabledTools([...effectiveEnabledTools, ...toAdd]);
    }
  };

  const handleToolRowClick = async (toolName: string): Promise<void> => {
    const helpDef = await import("./definition");
    navigate(helpDef.default.GET, {
      data: { toolName },
    });
  };

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
              <Span className="capitalize">{humanizeCategory(name)}</Span>
              <Badge variant="secondary" className="text-[10px]">
                {count}
              </Badge>
            </Div>
          ))}
        </Div>
        <P className="text-xs text-muted-foreground text-center">
          {t("app.api.system.help.get.fields.totalCount.title")}: {totalCount}
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
              <Badge variant="outline" className="font-mono text-xs">
                {tool.method}
              </Badge>
            </Div>
            <P className="text-sm text-muted-foreground mt-1">
              {tool.description}
            </P>
            {tool.aliases && tool.aliases.length > 0 && (
              <P className="text-xs text-muted-foreground/70 mt-1">
                {t("app.api.system.help.get.fields.aliases.title")}:{" "}
                {tool.aliases.join(", ")}
              </P>
            )}
          </Div>
        </Div>

        {tool.parameters && (
          <Div>
            <Span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("app.api.system.help.get.fields.parameters.title")}
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
            void navigateToTool(tool.toolName, navigate);
          }}
        >
          {t("app.api.system.help.get.fields.openTool.label")}
        </Button>
      </Div>
    );
  }

  // Full list mode (web)
  return (
    <Div className="flex flex-col gap-0">
      {/* Stats Bar */}
      <Div className="flex gap-3 text-xs px-4 pt-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary/10 text-primary font-medium">
                <Eye className="h-3.5 w-3.5" />
                <Span>
                  {stats.active} {t("app.chat.aiTools.modal.activeLabel")}
                </Span>
              </Div>
            </TooltipTrigger>
            <TooltipContent>
              <P className="text-xs">
                {t("app.chat.aiTools.modal.activeTooltip")}
              </P>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted text-muted-foreground font-medium">
                <Shield className="h-3.5 w-3.5" />
                <Span>
                  {stats.enabled} {t("app.chat.aiTools.modal.enabledLabel")}
                </Span>
              </Div>
            </TooltipTrigger>
            <TooltipContent>
              <P className="text-xs">
                {t("app.chat.aiTools.modal.enabledTooltip")}
              </P>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Div className="flex items-center gap-1.5 px-2.5 py-1.5 text-muted-foreground/60">
          <Span>
            {stats.total} {t("app.chat.aiTools.modal.totalLabel")}
          </Span>
        </Div>

        {matchedCount !== totalCount && (
          <Div className="flex items-center gap-1.5 px-2.5 py-1.5 text-muted-foreground/60">
            <Span>{matchedCount} matched</Span>
          </Div>
        )}
      </Div>

      <Div className="flex gap-4 flex-1 flex-col px-4 pb-4 pt-3">
        {/* Search + Controls */}
        <Div className="flex flex-col gap-2 shrink-0">
          <Div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("app.chat.aiTools.modal.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </Div>

          {filteredTools.length > 0 && (
            <Div className="flex gap-2">
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
                    ? t("app.chat.aiTools.modal.expandAll")
                    : t("app.chat.aiTools.modal.collapseAll")}
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
                      {t("app.chat.aiTools.modal.deselectAll")}
                    </Span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1 shrink-0" />
                    <Span className="truncate">
                      {t("app.chat.aiTools.modal.selectAll")}
                    </Span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleResetToDefault}
                variant="outline"
                size="sm"
                className="flex-1 min-w-0"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1 shrink-0" />
                <Span className="truncate">
                  {t("app.chat.aiTools.modal.resetToDefault")}
                </Span>
              </Button>
            </Div>
          )}
        </Div>

        {/* Tools List */}
        <ScrollArea className="flex-1 pr-4">
          {filteredTools.length === 0 ? (
            <Div className="text-center py-8 text-muted-foreground text-sm">
              {searchQuery.length > 0
                ? t("app.chat.aiTools.modal.noToolsFound")
                : t("app.chat.aiTools.modal.noToolsAvailable")}
            </Div>
          ) : (
            <Div className="flex flex-col gap-3">
              {Object.entries(toolsByCategory).map(
                ([category, { tools, subcategories }]) => {
                  const isExpanded = expandedCategories.has(category);
                  const categoryIds = tools.map((t) => t.toolName);
                  const enabledCount = categoryIds.filter((id) =>
                    effectiveEnabledTools.some((t) => t.id === id),
                  ).length;
                  const activeCount = categoryIds.filter((id) =>
                    effectiveEnabledTools.some((t) => t.id === id && t.active),
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
                                      key={tool.toolName}
                                      tool={tool}
                                      effectiveEnabledTools={
                                        effectiveEnabledTools
                                      }
                                      onToggleEnabled={handleToggleEnabled}
                                      onToggleActive={handleToggleActive}
                                      onToggleConfirmation={
                                        handleToggleConfirmation
                                      }
                                      onRowClick={handleToolRowClick}
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
                                  key={tool.toolName}
                                  tool={tool}
                                  effectiveEnabledTools={effectiveEnabledTools}
                                  onToggleEnabled={handleToggleEnabled}
                                  onToggleActive={handleToggleActive}
                                  onToggleConfirmation={
                                    handleToggleConfirmation
                                  }
                                  onRowClick={handleToolRowClick}
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
        </ScrollArea>

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
              <Span>{t("app.chat.aiTools.modal.legendActive")}</Span>
            </Div>
            <Div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <Span>{t("app.chat.aiTools.modal.legendConfirm")}</Span>
            </Div>
          </Div>
          <P>
            {t("app.chat.aiTools.modal.stats", {
              enabled: stats.enabled,
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
  onRowClick,
  t,
}: {
  tool: HelpToolMetadataSerialized;
  effectiveEnabledTools: EnabledTool[];
  onToggleEnabled: (toolName: string) => void;
  onToggleActive: (toolName: string) => void;
  onToggleConfirmation: (toolName: string) => void;
  onRowClick: (toolName: string) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
}): JSX.Element {
  const enabledTool = effectiveEnabledTools.find(
    (et) => et.id === tool.toolName,
  );
  const isEnabled = !!enabledTool;
  const isActive = enabledTool?.active ?? false;
  const requiresConfirmation = enabledTool?.requiresConfirmation ?? false;

  return (
    <Div
      className={cn(
        "px-4 py-2.5 transition-colors hover:bg-accent/30 cursor-pointer",
        isEnabled && isActive && "bg-primary/5",
        isEnabled && !isActive && "bg-muted/30",
      )}
      onClick={() => void onRowClick(tool.toolName)}
    >
      <Div className="flex items-center gap-3">
        <Div
          onClick={(e) => {
            e.stopPropagation();
            onToggleEnabled(tool.toolName);
          }}
        >
          <Switch
            checked={isEnabled}
            onCheckedChange={() => onToggleEnabled(tool.toolName)}
            className="h-4 w-7 shrink-0"
          />
        </Div>
        <Div className="flex-1 min-w-0">
          <Div className="flex items-center gap-2">
            <P className="text-sm font-medium truncate">{getToolLabel(tool)}</P>
            <Badge
              variant="outline"
              className="text-[10px] px-1 py-0 font-mono shrink-0"
            >
              {tool.method}
            </Badge>
          </Div>
          <P className="text-[11px] text-muted-foreground/70 truncate">
            {tool.description}
          </P>
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
                    onToggleActive(tool.toolName);
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
                    ? t("app.chat.aiTools.modal.activeOn")
                    : t("app.chat.aiTools.modal.activeOff")}
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
                    onToggleConfirmation(tool.toolName);
                  }}
                >
                  <Shield className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <P className="text-xs">
                  {requiresConfirmation
                    ? t("app.chat.aiTools.modal.confirmOn")
                    : t("app.chat.aiTools.modal.confirmOff")}
                </P>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Div>
    </Div>
  );
}
