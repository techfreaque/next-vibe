"use client";

import { cn } from "next-vibe/shared/utils";
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Div,
  Input,
  P,
  ScrollArea,
  Span,
} from "next-vibe-ui/ui";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Search,
  X,
} from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React, { useMemo, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import { useAIToolsList } from "@/app/api/[locale]/v1/core/system/unified-ui/ai/tools/hooks";
import type { AIToolMetadataSerialized } from "@/app/api/[locale]/v1/core/system/unified-ui/ai/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface AIToolsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enabledToolIds: string[];
  onToolsChange: (toolIds: string[]) => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

/**
 * AI Tools Modal
 * Displays all available AI tools and allows user to toggle them on/off
 */
export function AIToolsModal({
  open,
  onOpenChange,
  enabledToolIds,
  onToolsChange,
  locale,
  logger,
}: AIToolsModalProps): JSX.Element {
  const { t } = simpleT(locale);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  // Use the proper hooks pattern to fetch tools
  const toolsEndpoint = useAIToolsList(logger, {
    enabled: open, // Only fetch when modal is open
  });

  // Extract tools from response with proper type safety
  const availableTools = useMemo((): AIToolMetadataSerialized[] => {
    const readState = toolsEndpoint.read;
    if (!readState) {
      return [];
    }

    const response = readState.response;
    if (!response) {
      return [];
    }

    if (response.success && response.data && "tools" in response.data) {
      const tools = response.data.tools;
      if (Array.isArray(tools)) {
        return tools as AIToolMetadataSerialized[];
      }
    }
    return [];
  }, [toolsEndpoint.read]);

  const isLoading = toolsEndpoint.read?.isLoading ?? false;

  // Extract error message with proper type safety
  const error = useMemo((): string | null => {
    const readState = toolsEndpoint.read;
    if (!readState) {
      return null;
    }

    const response = readState.response;
    if (!response) {
      return null;
    }

    if (response.success === false) {
      return response.message;
    }

    return null;
  }, [toolsEndpoint.read]);

  // Filter tools by search query
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

  // Group tools by category
  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, AIToolMetadataSerialized[]> = {};

    filteredTools.forEach((tool) => {
      const category = tool.category || "other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(tool);
    });

    return grouped;
  }, [filteredTools]);

  // Toggle a single tool
  const handleToggleTool = (toolName: string): void => {
    const isEnabled = enabledToolIds.includes(toolName);

    if (isEnabled) {
      // Remove from enabled list
      onToolsChange(enabledToolIds.filter((id) => id !== toolName));
    } else {
      // Add to enabled list
      onToolsChange([...enabledToolIds, toolName]);
    }

    logger.debug("AIToolsModal", "Tool toggled", {
      toolName,
      enabled: !isEnabled,
    });
  };

  // Toggle all tools in current view
  const handleToggleAll = (): void => {
    const allToolNames = filteredTools.map((tool) => tool.name);
    const allEnabled = allToolNames.every((name) =>
      enabledToolIds.includes(name),
    );

    if (allEnabled) {
      // Disable all visible tools
      const remainingEnabled = enabledToolIds.filter(
        (id) => !allToolNames.includes(id),
      );
      onToolsChange(remainingEnabled);
      logger.debug("AIToolsModal", "All visible tools disabled");
    } else {
      // Enable all visible tools (merge with existing)
      const uniqueEnabled = Array.from(
        new Set([...enabledToolIds, ...allToolNames]),
      );
      onToolsChange(uniqueEnabled);
      logger.debug("AIToolsModal", "All visible tools enabled");
    }
  };

  // Check if all visible tools are enabled
  const allVisibleToolsEnabled = useMemo(() => {
    if (filteredTools.length === 0) {
      return false;
    }
    return filteredTools.every((tool) => enabledToolIds.includes(tool.name));
  }, [filteredTools, enabledToolIds]);

  // Toggle category expansion
  const toggleCategory = (category: string): void => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Toggle all tools in a category
  const toggleCategoryTools = (
    categoryTools: AIToolMetadataSerialized[],
  ): void => {
    const categoryToolIds = categoryTools.map((t) => t.name);
    const allEnabled = categoryToolIds.every((id) =>
      enabledToolIds.includes(id),
    );

    if (allEnabled) {
      // Disable all tools in category
      onToolsChange(
        enabledToolIds.filter((id) => !categoryToolIds.includes(id)),
      );
    } else {
      // Enable all tools in category
      const newIds = new Set([...enabledToolIds, ...categoryToolIds]);
      onToolsChange(Array.from(newIds));
    }
  };

  // Expand all categories
  const expandAll = (): void => {
    setExpandedCategories(new Set(Object.keys(toolsByCategory)));
  };

  // Collapse all categories
  const collapseAll = (): void => {
    setExpandedCategories(new Set());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90dvh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("app.chat.aiTools.modal.title")}</DialogTitle>
          <DialogDescription>
            {t("app.chat.aiTools.modal.description")}
          </DialogDescription>
        </DialogHeader>

        <Div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search and Controls */}
          <Div className="space-y-2 shrink-0">
            {/* Search Input */}
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

            {/* Control Buttons */}
            {filteredTools.length > 0 && (
              <Div className="flex gap-2">
                {/* Expand/Collapse All */}
                <Button
                  onClick={
                    expandedCategories.size === 0 ? expandAll : collapseAll
                  }
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  {expandedCategories.size === 0
                    ? t("app.chat.aiTools.modal.expandAll")
                    : t("app.chat.aiTools.modal.collapseAll")}
                </Button>

                {/* Select/Deselect All */}
                <Button
                  onClick={handleToggleAll}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  {allVisibleToolsEnabled ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      {t("app.chat.aiTools.modal.deselectAll")}
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {t("app.chat.aiTools.modal.selectAll")}
                    </>
                  )}
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
              <Div className="space-y-4">
                {Object.entries(toolsByCategory).map(([category, tools]) => {
                  const isExpanded = expandedCategories.has(category);
                  const categoryToolIds = tools.map((t) => t.name);
                  const allCategoryEnabled = categoryToolIds.every((id) =>
                    enabledToolIds.includes(id),
                  );

                  return (
                    <Div key={category} className="border rounded-lg">
                      {/* Category Header - Clickable to expand/collapse */}
                      <Div
                        onClick={() => toggleCategory(category)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent/50 transition-colors rounded-t-lg cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <Span className="text-sm font-medium capitalize flex-1 text-left">
                          {category}
                        </Span>
                        <Badge variant="secondary" className="text-xs">
                          {
                            categoryToolIds.filter((id) =>
                              enabledToolIds.includes(id),
                            ).length
                          }{" "}
                          / {tools.length}
                        </Badge>
                        <Checkbox
                          checked={allCategoryEnabled}
                          onCheckedChange={() => toggleCategoryTools(tools)}
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0"
                        />
                      </Div>

                      {/* Tools in Category - Collapsible */}
                      {isExpanded && (
                        <Div className="px-4 pb-3 space-y-2 border-t">
                          {tools.map((tool) => {
                            const isEnabled = enabledToolIds.includes(
                              tool.name,
                            );

                            return (
                              <Div
                                key={tool.name}
                                onClick={() => handleToggleTool(tool.name)}
                                className={cn(
                                  "w-full text-left px-3 py-2 rounded-md border transition-all cursor-pointer",
                                  "hover:border-primary/50 hover:bg-accent/50",
                                  "flex items-start gap-3",
                                  isEnabled && "border-primary bg-primary/5",
                                )}
                              >
                                <Checkbox
                                  checked={isEnabled}
                                  onCheckedChange={() =>
                                    handleToggleTool(tool.name)
                                  }
                                  className="mt-0.5 shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                />

                                <Div className="flex-1 min-w-0">
                                  <P className="text-sm font-medium truncate">
                                    {tool.name}
                                  </P>
                                  <P className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                    {tool.description}
                                  </P>

                                  {/* Tags */}
                                  {tool.tags.length > 0 && (
                                    <Div className="flex flex-wrap gap-1 mt-1.5">
                                      {tool.tags.slice(0, 3).map((tag) => (
                                        <Badge
                                          key={tag}
                                          variant="secondary"
                                          className="text-[10px] px-1.5 py-0"
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                    </Div>
                                  )}
                                </Div>
                              </Div>
                            );
                          })}
                        </Div>
                      )}
                    </Div>
                  );
                })}
              </Div>
            )}
          </ScrollArea>

          {/* Footer Info */}
          <Div className="shrink-0 pt-2 border-t">
            <P className="text-xs text-muted-foreground text-center">
              {t("app.chat.aiTools.modal.stats", {
                enabled: enabledToolIds.length,
                total: availableTools.length,
              })}
            </P>
          </Div>
        </Div>
      </DialogContent>
    </Dialog>
  );
}
