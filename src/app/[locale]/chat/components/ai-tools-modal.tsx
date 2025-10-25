"use client";

import { cn } from "next-vibe/shared/utils";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Div,
  Input,
  P,
  ScrollArea,
  Separator,
  Switch,
} from "next-vibe-ui/ui";
import { Check, Search, X } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React, { useMemo, useState } from "react";

import { useAIToolsList } from "@/app/api/[locale]/v1/core/system/unified-ui/ai-tool/tools/hooks";
import type { AIToolMetadataSerialized } from "@/app/api/[locale]/v1/core/system/unified-ui/ai-tool/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
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

  // Use the proper hooks pattern to fetch tools
  const toolsEndpoint = useAIToolsList(logger, {
    enabled: open, // Only fetch when modal is open
  });

  // Extract tools from response
  const availableTools = useMemo((): AIToolMetadataSerialized[] => {
    const response = toolsEndpoint.read?.response;
    if (response?.success && response.data?.tools) {
      return response.data.tools;
    }
    return [];
  }, [toolsEndpoint.read?.response]);

  const isLoading = toolsEndpoint.read?.isLoading ?? false;
  const error =
    toolsEndpoint.read?.response?.success === false
      ? toolsEndpoint.read.response.message
      : null;

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
    const grouped: Record<string, AIToolMetadata[]> = {};

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
          {/* Search and Toggle All */}
          <Div className="space-y-2 flex-shrink-0">
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

            {/* Toggle All Button */}
            {filteredTools.length > 0 && (
              <Button
                onClick={handleToggleAll}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {allVisibleToolsEnabled ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    {t("app.chat.aiTools.modal.disableAll")}
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {t("app.chat.aiTools.modal.enableAll")}
                  </>
                )}
              </Button>
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
              <Div className="space-y-6">
                {Object.entries(toolsByCategory).map(([category, tools]) => (
                  <Div key={category}>
                    {/* Category Header */}
                    <Div className="mb-3">
                      <P className="text-sm font-medium capitalize">
                        {category}
                      </P>
                      <Separator className="mt-2" />
                    </Div>

                    {/* Tools in Category */}
                    <Div className="space-y-2">
                      {tools.map((tool) => {
                        const isEnabled = enabledToolIds.includes(tool.name);

                        return (
                          <button
                            key={tool.name}
                            onClick={() => handleToggleTool(tool.name)}
                            className={cn(
                              "w-full text-left px-4 py-3 rounded-lg border transition-all",
                              "hover:border-primary/50 hover:bg-accent/50",
                              "min-h-[60px] flex items-start gap-3",
                              isEnabled && "border-primary bg-primary/5",
                            )}
                          >
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={() =>
                                handleToggleTool(tool.name)
                              }
                              className="mt-0.5 flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            />

                            <Div className="flex-1 min-w-0">
                              <Div className="flex items-start gap-2 mb-1">
                                <P className="text-sm font-medium truncate flex-1">
                                  {tool.name}
                                </P>
                                {isEnabled && (
                                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                )}
                              </Div>

                              <P className="text-xs text-muted-foreground line-clamp-2">
                                {tool.description}
                              </P>

                              {/* Tags */}
                              {tool.tags.length > 0 && (
                                <Div className="flex flex-wrap gap-1 mt-2">
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
                          </button>
                        );
                      })}
                    </Div>
                  </Div>
                ))}
              </Div>
            )}
          </ScrollArea>

          {/* Footer Info */}
          <Div className="flex-shrink-0 pt-2 border-t">
            <P className="text-xs text-muted-foreground text-center">
              {t("app.chat.aiTools.modal.footerInfo", {
                count: enabledToolIds.length,
                total: availableTools.length,
              })}
            </P>
          </Div>
        </Div>
      </DialogContent>
    </Dialog>
  );
}
