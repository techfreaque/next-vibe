/**
 * ToolsConfigEdit Widget
 * Standalone reusable component for editing per-slot tool overrides.
 * Used in: character edit, favorite edit.
 *
 * Value format matches availableTools/pinnedTools fields:
 *   null = inherit from higher-level (character → settings)
 *   array = explicit override
 *
 * Internally converts to/from EnabledTool[] for consistent UI with HelpToolsWidget.
 */

/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Eye } from "next-vibe-ui/ui/icons/Eye";
import { EyeOff } from "next-vibe-ui/ui/icons/EyeOff";
import { RotateCcw } from "next-vibe-ui/ui/icons/RotateCcw";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Wrench } from "next-vibe-ui/ui/icons/Wrench";
import { X } from "next-vibe-ui/ui/icons/X";
import { Input } from "next-vibe-ui/ui/input";
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
import { useMemo, useState } from "react";

import { getDefaultToolIdsForUser } from "@/app/api/[locale]/agent/chat/constants";
import type { EnabledTool } from "@/app/api/[locale]/agent/chat/hooks/store";
import type { HelpToolMetadataSerialized } from "@/app/api/[locale]/system/help/definition";
import helpDefinitions from "@/app/api/[locale]/system/help/definition";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ToolEntry {
  toolId: string;
  requiresConfirmation: boolean;
}

export interface ToolsConfigValue {
  availableTools: ToolEntry[] | null;
  pinnedTools: ToolEntry[] | null;
}

export interface ToolsConfigEditProps {
  value: ToolsConfigValue;
  onChange: (value: ToolsConfigValue) => void;
  user: JwtPayloadType;
  logger: EndpointLogger;
  /** Optional sub-label shown in the header */
  label?: string;
  className?: string;
  /**
   * Skill's tool configuration - fallback when value is null (inherited).
   * Ensures the display reflects the actual resolved character defaults.
   */
  skillAvailableTools?: ToolEntry[] | null;
  skillPinnedTools?: ToolEntry[] | null;
}

// ─── Conversion helpers ─────────────────────────────────────────────────────

function toEnabledTools(
  availableTools: ToolEntry[] | null,
  pinnedTools: ToolEntry[] | null,
): EnabledTool[] | null {
  if (availableTools === null && pinnedTools === null) {
    return null; // null = inherit default
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
        allowed?.requiresConfirmation ?? pinned?.requiresConfirmation ?? false,
      pinned:
        pinnedTools !== null ? pinnedTools.some((t) => t.toolId === id) : true,
    };
  });
}

function fromEnabledTools(tools: EnabledTool[] | null): ToolsConfigValue {
  if (tools === null) {
    return { availableTools: null, pinnedTools: null };
  }
  return {
    availableTools: tools.map(({ id, requiresConfirmation }) => ({
      toolId: id,
      requiresConfirmation,
    })),
    pinnedTools: tools
      .filter((t) => t.pinned)
      .map(({ id, requiresConfirmation }) => ({
        toolId: id,
        requiresConfirmation,
      })),
  };
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
    .map((s: string) =>
      s
        .replace(/([A-Z])/g, " $1")
        .replace(/[-]/g, " ")
        .trim()
        .replace(/^\w/, (c: string) => c.toUpperCase()),
    )
    .join(" / ");
}

// ─── Main component ──────────────────────────────────────────────────────────

export function ToolsConfigEdit({
  value,
  onChange,
  user,
  logger,
  label,
  className,
  skillAvailableTools,
  skillPinnedTools,
}: ToolsConfigEditProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch available tools from help endpoint
  const helpEndpoint = useEndpoint(
    helpDefinitions,
    {
      read: {
        queryOptions: {
          staleTime: 5 * 60 * 1000,
          refetchOnWindowFocus: false,
        },
      },
    },
    logger,
    user,
  );

  const availableTools: HelpToolMetadataSerialized[] = useMemo(
    () => helpEndpoint.read?.data?.tools ?? [],
    [helpEndpoint.read?.data],
  );

  // Convert stored value → EnabledTool[] for UI
  const enabledTools = useMemo(
    () => toEnabledTools(value.availableTools, value.pinnedTools),
    [value.availableTools, value.pinnedTools],
  );

  // Skill's tool config as EnabledTool[] (fallback when value is inherited)
  const skillEnabledTools = useMemo(
    () =>
      skillAvailableTools !== undefined || skillPinnedTools !== undefined
        ? toEnabledTools(skillAvailableTools ?? null, skillPinnedTools ?? null)
        : null,
    [skillAvailableTools, skillPinnedTools],
  );

  // Effective tools for display (null = all default)
  const effectiveEnabledTools = useMemo((): EnabledTool[] => {
    if (enabledTools !== null) {
      return enabledTools;
    }
    // Fall back to skill's resolved tool config when inherited
    if (skillEnabledTools !== null) {
      return skillEnabledTools;
    }
    const defaultPinnedSet = new Set<string>(getDefaultToolIdsForUser(user));
    return availableTools.map((tool) => ({
      id: tool.id,
      requiresConfirmation: tool.requiresConfirmation ?? false,
      pinned: defaultPinnedSet.has(tool.id),
    }));
  }, [enabledTools, skillEnabledTools, availableTools, user]);

  const isInherited = enabledTools === null;

  const handleSetEnabledTools = (tools: EnabledTool[] | null): void => {
    onChange(fromEnabledTools(tools));
  };

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
    const pinned = effectiveEnabledTools.filter((t) => t.pinned).length;
    const enabled = effectiveEnabledTools.length;
    return { pinned, enabled, total: availableTools.length };
  }, [effectiveEnabledTools, availableTools]);

  const allVisibleEnabled = useMemo(
    () =>
      filteredTools.length > 0 &&
      filteredTools.every((tool) =>
        effectiveEnabledTools.some((t) => t.id === tool.id),
      ),
    [filteredTools, effectiveEnabledTools],
  );

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleToggleEnabled = (toolName: string): void => {
    const existing = effectiveEnabledTools.find((t) => t.id === toolName);
    if (existing) {
      handleSetEnabledTools(
        effectiveEnabledTools.filter((t) => t.id !== toolName),
      );
    } else {
      const tool = availableTools.find((t) => t.id === toolName);
      handleSetEnabledTools([
        ...effectiveEnabledTools,
        {
          id: toolName,
          requiresConfirmation: tool?.requiresConfirmation ?? false,
          pinned: true,
        },
      ]);
    }
  };

  const handleTogglePinned = (toolName: string): void => {
    handleSetEnabledTools(
      effectiveEnabledTools.map((t) =>
        t.id === toolName ? { ...t, pinned: !t.pinned } : t,
      ),
    );
  };

  const handleToggleConfirmation = (toolName: string): void => {
    handleSetEnabledTools(
      effectiveEnabledTools.map((t) =>
        t.id === toolName
          ? { ...t, requiresConfirmation: !t.requiresConfirmation }
          : t,
      ),
    );
  };

  const handleEnableAll = (): void => {
    const allIds = filteredTools.map((tool) => tool.id);
    const allEnabled = allIds.every((id) =>
      effectiveEnabledTools.some((t) => t.id === id),
    );
    if (allEnabled) {
      handleSetEnabledTools(
        effectiveEnabledTools.filter((t) => !allIds.includes(t.id)),
      );
    } else {
      const toAdd = filteredTools
        .filter((tool) => !effectiveEnabledTools.some((t) => t.id === tool.id))
        .map((tool) => ({
          id: tool.id,
          requiresConfirmation: tool.requiresConfirmation ?? false,
          pinned: true,
        }));
      handleSetEnabledTools([...effectiveEnabledTools, ...toAdd]);
    }
  };

  const handleResetToDefault = (): void => {
    handleSetEnabledTools(null);
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
    const ids = tools.map((t) => t.id);
    const allEnabled = ids.every((id) =>
      effectiveEnabledTools.some((t) => t.id === id),
    );
    if (allEnabled) {
      handleSetEnabledTools(
        effectiveEnabledTools.filter((t) => !ids.includes(t.id)),
      );
    } else {
      const toAdd = tools
        .filter((tool) => !effectiveEnabledTools.some((t) => t.id === tool.id))
        .map((tool) => ({
          id: tool.id,
          requiresConfirmation: tool.requiresConfirmation ?? false,
          pinned: true,
        }));
      handleSetEnabledTools([...effectiveEnabledTools, ...toAdd]);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Div className={cn("rounded-xl border bg-card flex flex-col", className)}>
      {/* Header - always visible, click to expand */}
      <Div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent/30 transition-colors rounded-xl"
        onClick={() => setIsExpanded((v) => !v)}
      >
        <Wrench className="h-4 w-4 text-primary flex-shrink-0" />
        <Div className="flex-1 flex flex-col gap-0.5">
          <Span className="text-sm font-semibold">Tools</Span>
          {label !== undefined && label !== "" && (
            <Span className="text-xs text-muted-foreground">{label}</Span>
          )}
        </Div>

        {/* Stats */}
        <Div className="flex items-center gap-2">
          {isInherited ? (
            <Badge
              variant="secondary"
              className="text-xs bg-muted text-muted-foreground"
            >
              inherited
            </Badge>
          ) : (
            <>
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 gap-1"
              >
                <Eye className="h-2.5 w-2.5" />
                {stats.pinned}
              </Badge>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {stats.enabled}/{stats.total}
              </Badge>
            </>
          )}
        </Div>

        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </Div>

      {/* Expanded content */}
      {isExpanded && (
        <Div className="border-t flex flex-col gap-3 p-4">
          {/* Inherit toggle */}
          <Div className="flex items-center justify-between gap-3 py-1">
            <Div className="flex flex-col">
              <Span className="text-xs font-medium">
                Override tool settings for this slot
              </Span>
              <Span className="text-[11px] text-muted-foreground">
                {isInherited
                  ? "Currently using inherited defaults. Enable to customize."
                  : "Custom tools configured for this slot."}
              </Span>
            </Div>
            <Switch
              checked={!isInherited}
              onCheckedChange={(checked) => {
                if (checked) {
                  // Materialize defaults into explicit list
                  handleSetEnabledTools(effectiveEnabledTools);
                } else {
                  handleResetToDefault();
                }
              }}
              className="h-4 w-7 shrink-0"
            />
          </Div>

          {!isInherited && availableTools.length > 0 && (
            <>
              {/* Stats bar */}
              <Div className="flex gap-2 text-xs flex-wrap">
                <Div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                  <Eye className="h-3 w-3" />
                  <Span>{stats.pinned} pinned</Span>
                </Div>
                <Div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-muted-foreground font-medium">
                  <Shield className="h-3 w-3" />
                  <Span>{stats.enabled} enabled</Span>
                </Div>
                <Div className="flex items-center gap-1.5 px-2 py-1 text-muted-foreground/60">
                  <Span>{stats.total} total</Span>
                </Div>
              </Div>

              {/* Search + controls */}
              <Div className="flex flex-col gap-2">
                <Div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </Div>

                <Div className="flex gap-2">
                  <Button
                    type="button"
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
                    <Span className="truncate text-xs">
                      {expandedCategories.size === 0
                        ? "Expand all"
                        : "Collapse all"}
                    </Span>
                  </Button>

                  <Button
                    type="button"
                    onClick={handleEnableAll}
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-0"
                  >
                    {allVisibleEnabled ? (
                      <>
                        <X className="h-3.5 w-3.5 mr-1 shrink-0" />
                        <Span className="truncate text-xs">Deselect all</Span>
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1 shrink-0" />
                        <Span className="truncate text-xs">Select all</Span>
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleResetToDefault}
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-0"
                  >
                    <RotateCcw className="h-3 w-3 mr-1 shrink-0" />
                    <Span className="truncate text-xs">Reset</Span>
                  </Button>
                </Div>
              </Div>

              {/* Tools list */}
              <Div style={{ maxHeight: "40dvh", overflowY: "auto" }}>
                {filteredTools.length === 0 ? (
                  <Div className="text-center py-6 text-muted-foreground text-sm">
                    {searchQuery.length > 0
                      ? "No tools found"
                      : "No tools available"}
                  </Div>
                ) : (
                  <Div className="flex flex-col gap-2">
                    {Object.entries(toolsByCategory).map(
                      ([category, { tools, subcategories }]) => {
                        const isCatExpanded = expandedCategories.has(category);
                        const categoryIds = tools.map((t) => t.id);
                        const enabledCount = categoryIds.filter((id) =>
                          effectiveEnabledTools.some((t) => t.id === id),
                        ).length;
                        const activeCount = categoryIds.filter((id) =>
                          effectiveEnabledTools.some(
                            (t) => t.id === id && t.pinned,
                          ),
                        ).length;
                        const allCategoryEnabled =
                          enabledCount === tools.length;
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
                            {/* Category header */}
                            <Div
                              onClick={() => toggleCategory(category)}
                              className="w-full px-3 py-2 flex items-center gap-2 hover:bg-accent/50 transition-colors cursor-pointer"
                            >
                              {isCatExpanded ? (
                                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              )}
                              <Span className="text-xs font-medium capitalize flex-1 text-left">
                                {category}
                              </Span>
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1 py-0 gap-1"
                              >
                                <Eye className="h-2 w-2" />
                                {activeCount}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1 py-0"
                              >
                                {enabledCount}/{tools.length}
                              </Badge>
                              <Div
                                onClick={(e) => e.stopPropagation()}
                                className="shrink-0"
                              >
                                <Switch
                                  checked={allCategoryEnabled}
                                  onCheckedChange={() =>
                                    toggleCategoryTools(tools)
                                  }
                                  className="h-4 w-7"
                                />
                              </Div>
                            </Div>

                            {/* Tools in category */}
                            {isCatExpanded && (
                              <Div className="border-t">
                                {hasSubcategories ? (
                                  sortedSubcategories.map(
                                    ([subName, subTools]) => (
                                      <Div key={subName}>
                                        <Div className="px-3 py-1 bg-muted/30 border-b">
                                          <Span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                                            {subName} ({subTools.length})
                                          </Span>
                                        </Div>
                                        <Div className="divide-y">
                                          {subTools.map((tool) => (
                                            <ToolConfigRow
                                              key={tool.id}
                                              tool={tool}
                                              effectiveEnabledTools={
                                                effectiveEnabledTools
                                              }
                                              onToggleEnabled={
                                                handleToggleEnabled
                                              }
                                              onTogglePinned={
                                                handleTogglePinned
                                              }
                                              onToggleConfirmation={
                                                handleToggleConfirmation
                                              }
                                            />
                                          ))}
                                        </Div>
                                      </Div>
                                    ),
                                  )
                                ) : (
                                  <Div className="divide-y">
                                    {tools.map((tool) => (
                                      <ToolConfigRow
                                        key={tool.id}
                                        tool={tool}
                                        effectiveEnabledTools={
                                          effectiveEnabledTools
                                        }
                                        onToggleEnabled={handleToggleEnabled}
                                        onTogglePinned={handleTogglePinned}
                                        onToggleConfirmation={
                                          handleToggleConfirmation
                                        }
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

              {/* Footer legend */}
              <Div className="pt-1 border-t flex items-center justify-between text-[10px] text-muted-foreground">
                <Div className="flex items-center gap-3">
                  <Div className="flex items-center gap-1">
                    <Eye className="h-2.5 w-2.5" />
                    <Span>pinned to context</Span>
                  </Div>
                  <Div className="flex items-center gap-1">
                    <Shield className="h-2.5 w-2.5" />
                    <Span>requires confirmation</Span>
                  </Div>
                </Div>
              </Div>
            </>
          )}

          {!isInherited && availableTools.length === 0 && (
            <Div className="text-center py-4 text-muted-foreground text-sm">
              Loading tools...
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}

// ─── Tool Row ────────────────────────────────────────────────────────────────

function ToolConfigRow({
  tool,
  effectiveEnabledTools,
  onToggleEnabled,
  onTogglePinned,
  onToggleConfirmation,
}: {
  tool: HelpToolMetadataSerialized;
  effectiveEnabledTools: EnabledTool[];
  onToggleEnabled: (toolName: string) => void;
  onTogglePinned: (toolName: string) => void;
  onToggleConfirmation: (toolName: string) => void;
}): JSX.Element {
  const enabledTool = effectiveEnabledTools.find((et) => et.id === tool.id);
  const isEnabled = !!enabledTool;
  const isPinned = enabledTool?.pinned ?? false;
  const requiresConfirmation = enabledTool?.requiresConfirmation ?? false;

  return (
    <Div
      className={cn(
        "px-3 py-2 transition-colors",
        isEnabled && isPinned && "bg-primary/5",
        isEnabled && !isPinned && "bg-muted/30",
      )}
    >
      <Div className="flex items-center gap-2">
        <Switch
          checked={isEnabled}
          onCheckedChange={() => onToggleEnabled(tool.id)}
          className="h-4 w-7 shrink-0"
        />
        <Div className="flex-1 min-w-0">
          <Div className="flex items-center gap-1.5">
            <P className="text-xs font-medium truncate">{getToolLabel(tool)}</P>
            {tool.aliases?.[0] && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1 py-0 font-mono shrink-0"
              >
                {tool.aliases[0]}
              </Badge>
            )}
          </Div>
          <P className="text-[10px] text-muted-foreground/70 truncate">
            {tool.description}
          </P>
        </Div>
        {isEnabled && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={isPinned ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-6 w-6 p-0 shrink-0",
                    isPinned
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePinned(tool.id);
                  }}
                >
                  {isPinned ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <P className="text-xs">
                  {isPinned ? "Pinned to context" : "Not pinned"}
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
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 w-6 p-0 shrink-0",
                    requiresConfirmation
                      ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20"
                      : "text-muted-foreground/40 hover:text-muted-foreground",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleConfirmation(tool.id);
                  }}
                >
                  <Shield className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <P className="text-xs">
                  {requiresConfirmation
                    ? "Requires confirmation"
                    : "No confirmation needed"}
                </P>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Div>
    </Div>
  );
}
