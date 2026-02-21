"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
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
  Zap,
} from "next-vibe-ui/ui/icons";
import { Input } from "next-vibe-ui/ui/input";
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
import type { AIToolMetadataSerialized } from "@/app/api/[locale]/system/unified-interface/ai/tools/definition";
import { useAIToolsList } from "@/app/api/[locale]/system/unified-interface/ai/tools/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { DEFAULT_TOOL_IDS } from "../chat/constants";
import type { EnabledTool } from "../chat/hooks/store";

/**
 * Clean up category name — detect raw translation keys and humanize them.
 * "app.api.ssh.category" → "SSH"
 * "app.api.credits.category" → "Credits"
 * "Chat" → "Chat" (already translated, keep as-is)
 */
function humanizeCategory(category: string): string {
  // Already translated (no dots or doesn't look like a key)
  if (!category.startsWith("app.")) {
    return category;
  }
  // Extract meaningful segment: app.api.<segment>.category or app.api.<a>.<b>.category
  const parts = category.split(".");
  // Find the segment(s) between "api" and "category"
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
  // Fallback: last meaningful segment
  return parts[parts.length - 1].replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Derive a short, readable label for a tool.
 * Priority: first alias > humanized toolName
 * "agent_chat_threads_GET" → "List Threads"
 * Alias "web-search" → "Web Search"
 */
function getToolLabel(tool: AIToolMetadataSerialized): string {
  // Use first alias if available — they're human-chosen
  if (tool.aliases && tool.aliases.length > 0) {
    return tool.aliases[0]
      .replace(/[-_:]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  // Derive from toolName: strip category prefix and method suffix
  const parts = tool.toolName.split("_");
  // Remove method (last part: GET, POST, etc.)
  const method = parts[parts.length - 1];
  const pathParts = parts.slice(0, -1);

  // Take last 2 meaningful segments (skip common prefixes)
  const meaningful = pathParts.slice(-2);

  // Map HTTP method to verb
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

/** Check if a toolName path segment is an ID placeholder */
const isIdSegment = (s: string): boolean =>
  s === "id" || s.endsWith("Id") || /^\d+$/.test(s);

/**
 * Derive subcategory from toolName for grouping within a category.
 * Groups tools by the resource they operate on (2nd-3rd path segments).
 * "agent_chat_threads_threadId_messages_GET" → "Threads / Messages"
 * "agent_chat_folders_GET" → "Folders"
 * Returns null for tools that don't need subcategorization.
 */
function getSubcategory(toolName: string): string {
  const parts = toolName.split("_");
  // Remove method suffix
  const pathParts = parts.slice(0, -1);

  if (pathParts.length <= 3) {
    return "General";
  }

  // Take segments starting from index 2 (after category prefix), skip IDs
  const resources = pathParts
    .slice(2)
    .filter((s) => !isIdSegment(s))
    .slice(0, 2); // max 2 levels deep

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

interface AIToolsModalContentProps {
  locale: CountryLanguage;
  logger: EndpointLogger;
}

/**
 * AI Tools Modal Content
 * Two-tier tool management:
 * - Active (eye icon): Tool is visible to the AI — it can use it directly
 * - Enabled (shield icon): Tool is allowed to run — permission guard
 * - Confirm (shield+check): Tool asks for your OK before running
 */
export function AIToolsModalContent({
  locale,
  logger,
}: AIToolsModalContentProps): JSX.Element {
  const { enabledTools, setEnabledTools, user } = useChatContext();
  const { t } = simpleT(locale);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const toolsEndpoint = useAIToolsList(user, logger, { enabled: true });

  const availableTools = useMemo((): AIToolMetadataSerialized[] => {
    const readState = toolsEndpoint.read;
    if (!readState?.response) {
      return [];
    }
    if (
      readState.response.success &&
      readState.response.data &&
      "tools" in readState.response.data
    ) {
      const tools = readState.response.data.tools;
      if (Array.isArray(tools)) {
        return tools as AIToolMetadataSerialized[];
      }
    }
    return [];
  }, [toolsEndpoint.read]);

  // When enabledTools is null (default = all tools allowed), derive the effective
  // enabled tools list from available tools. Core 8 tools (DEFAULT_TOOL_IDS) are active,
  // all others are enabled but not active.
  const effectiveEnabledTools = useMemo(() => {
    if (enabledTools !== null) {
      return enabledTools;
    }
    // null = all tools enabled, core 8 active
    return availableTools.map((tool) => ({
      id: tool.toolName,
      requiresConfirmation: tool.requiresConfirmation ?? false,
      active: DEFAULT_TOOL_IDS.some((id) => id === tool.toolName),
    }));
  }, [enabledTools, availableTools]);

  const isLoading = toolsEndpoint.read?.isLoading ?? false;

  const error = useMemo((): string | null => {
    const readState = toolsEndpoint.read;
    if (!readState?.response) {
      return null;
    }
    if (readState.response.success === false) {
      return readState.response.message;
    }
    return null;
  }, [toolsEndpoint.read]);

  // Filter by search
  const filteredTools = useMemo(() => {
    if (searchQuery.length === 0) {
      return availableTools;
    }
    const query = searchQuery.toLowerCase();
    return availableTools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category?.toLowerCase().includes(query) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [availableTools, searchQuery]);

  // Group by category (humanized), then by subcategory within each category
  const toolsByCategory = useMemo(() => {
    const grouped: Record<
      string,
      {
        tools: AIToolMetadataSerialized[];
        subcategories: Record<string, AIToolMetadataSerialized[]>;
      }
    > = {};
    for (const tool of filteredTools) {
      const category = humanizeCategory(tool.category || "Other");
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

  // Stats
  const stats = useMemo(() => {
    const active = effectiveEnabledTools.filter((t) => t.active).length;
    const enabled = effectiveEnabledTools.length;
    return { active, enabled, total: availableTools.length };
  }, [effectiveEnabledTools, availableTools]);

  // --- Handlers ---

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
    // null = default state (all tools enabled, core 8 active)
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

  const toggleCategoryTools = (tools: AIToolMetadataSerialized[]): void => {
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

  const allVisibleEnabled = useMemo(() => {
    if (filteredTools.length === 0) {
      return false;
    }
    return filteredTools.every((tool) =>
      effectiveEnabledTools.some((t) => t.id === tool.toolName),
    );
  }, [filteredTools, effectiveEnabledTools]);

  return (
    <DialogContent className="sm:max-w-[750px] max-h-[90dvh] flex flex-col overflow-x-hidden overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          {t("app.chat.aiTools.modal.title")}
        </DialogTitle>
        <DialogDescription>
          {t("app.chat.aiTools.modal.description")}
        </DialogDescription>
      </DialogHeader>

      {/* Stats Bar */}
      <Div className="flex gap-3 text-xs">
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
      </Div>

      <Div className="flex gap-4 flex-1 flex-col">
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
          {isLoading ? (
            <Div className="text-center py-8 text-muted-foreground text-sm">
              {t("app.chat.aiTools.modal.loading")}
            </Div>
          ) : error ? (
            <Div className="text-center py-8 text-destructive text-sm">
              {error}
            </Div>
          ) : filteredTools.length === 0 ? (
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

                      {/* Tools in Category — grouped by subcategory when many */}
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
    </DialogContent>
  );
}

/**
 * Individual tool row — extracted to avoid deep nesting
 */
function ToolRow({
  tool,
  effectiveEnabledTools,
  onToggleEnabled,
  onToggleActive,
  onToggleConfirmation,
  t,
}: {
  tool: AIToolMetadataSerialized;
  effectiveEnabledTools: EnabledTool[];
  onToggleEnabled: (toolName: string) => void;
  onToggleActive: (toolName: string) => void;
  onToggleConfirmation: (toolName: string) => void;
  t: (key: string) => string;
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
        "px-4 py-2.5 transition-colors",
        isEnabled && isActive && "bg-primary/5",
        isEnabled && !isActive && "bg-muted/30",
      )}
    >
      <Div className="flex items-center gap-3">
        <Switch
          checked={isEnabled}
          onCheckedChange={() => onToggleEnabled(tool.toolName)}
          className="h-4 w-7 shrink-0"
        />
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
                  onClick={() => onToggleActive(tool.toolName)}
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
                  onClick={() => onToggleConfirmation(tool.toolName)}
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
