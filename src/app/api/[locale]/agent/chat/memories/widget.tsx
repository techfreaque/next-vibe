/**
 * Custom Widget for Memories List
 * Displays and manages AI memories with search, filtering, and CRUD operations
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { X } from "next-vibe-ui/ui/icons/X";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import { useMemo, useState } from "react";

import {
  arrayFieldPath,
  withValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetEndpointMutations,
  useWidgetLocale,
  useWidgetNavigation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import BadgeWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/badge/react";
import TextWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { useTouchDevice } from "@/hooks/use-touch-device";
import { simpleT } from "@/i18n/core/shared";

import { cn } from "../../../shared/utils";
import type definition from "./definition";
import type { MemoriesListResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: MemoriesListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

/**
 * Edit Memory Button - navigates to edit memory
 * Isolated component for loading state
 */
function EditMemoryButton({
  memoryId,
  navigate,
}: {
  memoryId: number;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
}): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const memoryDef = await import("./[id]/definition");
      navigate(memoryDef.default.PATCH, {
        urlPathParams: { id: memoryId },
        prefillFromGet: false,
        popNavigationOnSuccess: 1,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Pencil className="h-4 w-4" />
      )}
    </Button>
  );
}

/**
 * Delete Memory Button - navigates to delete memory
 * Isolated component for loading state
 */
function DeleteMemoryButton({
  memoryId,
  navigate,
}: {
  memoryId: number;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
}): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const memoryDef = await import("./[id]/definition");
      navigate(memoryDef.default.DELETE, {
        urlPathParams: { id: memoryId },
        popNavigationOnSuccess: 1,
        renderInModal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}

/**
 * Custom container widget for memories list
 */
export function MemoriesListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { push: navigate } = useWidgetNavigation();
  const locale = useWidgetLocale();
  const { t } = simpleT(locale);
  const isTouch = useTouchDevice();
  const endpointMutations = useWidgetEndpointMutations();
  const isLoading = endpointMutations?.read?.isLoading ?? false;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const memories = useMemo(
    () => field.value?.memories ?? [],
    [field.value?.memories],
  );

  // Sort memories by priority (descending) and then by memoryNumber (ascending)
  const sortedMemories = useMemo(() => {
    return [...memories].toSorted((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.memoryNumber - b.memoryNumber;
    });
  }, [memories]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    memories.forEach((memory) => {
      memory.tags?.forEach((tag) => tagsSet.add(tag));
    });
    return [...tagsSet].toSorted();
  }, [memories]);

  // Filter memories based on search and selected tag
  const filteredMemories = useMemo(() => {
    return sortedMemories.filter((memory) => {
      const matchesSearch =
        !searchQuery ||
        memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesTag = !selectedTag || memory.tags?.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [sortedMemories, searchQuery, selectedTag]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalChars = memories.reduce((sum, m) => sum + m.content.length, 0);
    const highPriority = memories.filter((m) => m.priority >= 50).length;
    return {
      total: memories.length,
      totalChars,
      highPriority,
      avgPriority:
        memories.length > 0
          ? Math.round(
              memories.reduce((sum, m) => sum + m.priority, 0) /
                memories.length,
            )
          : 0,
    };
  }, [memories]);

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back + Title + Create */}
      <Div className="flex flex-row items-center gap-2 p-4">
        <NavigateButtonWidget field={children.backButton} />
        <TextWidget field={children.title} fieldName="title" />
        <NavigateButtonWidget field={children.createButton} />
      </Div>

      {/* Stats and search */}
      <Div className="flex flex-col gap-3 px-4 pb-4 border-b border-border">
        <Div className="flex flex-row items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <Span className="text-sm font-semibold flex-1">
            {t("app.api.agent.chat.memories.get.stats.title")}
          </Span>
        </Div>

        {/* Stats bar */}
        {stats.total > 0 && (
          <Div className="grid grid-cols-4 gap-2">
            <Div className="flex flex-col p-2 rounded-md bg-primary/10">
              <Span className="text-xs text-muted-foreground">
                {t("app.api.agent.chat.memories.stats.total")}
              </Span>
              <Span className="text-lg font-semibold">{stats.total}</Span>
            </Div>
            <Div className="flex flex-col p-2 rounded-md bg-green-50 dark:bg-green-950/20">
              <Span className="text-xs text-muted-foreground">
                {t("app.api.agent.chat.memories.stats.highPriority")}
              </Span>
              <Span className="text-lg font-semibold text-green-600 dark:text-green-400">
                {stats.highPriority}
              </Span>
            </Div>
            <Div className="flex flex-col p-2 rounded-md bg-blue-50 dark:bg-blue-950/20">
              <Span className="text-xs text-muted-foreground">
                {t("app.api.agent.chat.memories.stats.avgPriority")}
              </Span>
              <Span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {stats.avgPriority}
              </Span>
            </Div>
            <Div className="flex flex-col p-2 rounded-md bg-orange-50 dark:bg-orange-950/20">
              <Span className="text-xs text-muted-foreground">
                {t("app.api.agent.chat.memories.stats.size")}
              </Span>
              <Span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                {stats.totalChars}
              </Span>
            </Div>
          </Div>
        )}

        {/* Search and filter */}
        <Div className="flex flex-col sm:flex-row gap-2">
          <Div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("app.api.agent.chat.memories.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </Div>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <Div className="flex flex-wrap gap-1">
              {allTags.slice(0, 5).map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setSelectedTag(selectedTag === tag ? null : tag)
                  }
                  className="h-8"
                >
                  {tag}
                </Button>
              ))}
              {selectedTag && !allTags.slice(0, 5).includes(selectedTag) && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setSelectedTag(null)}
                  className="h-8"
                >
                  {selectedTag}
                </Button>
              )}
            </Div>
          )}
        </Div>

        {/* Filter results count */}
        {(searchQuery || selectedTag) && (
          <Span className="text-sm text-muted-foreground">
            {t("app.api.agent.chat.memories.showing", {
              count: filteredMemories.length,
              total: memories.length,
            })}
          </Span>
        )}
      </Div>

      {/* Memories list */}
      <Div className="px-4 pb-4 overflow-y-auto max-h-[min(800px,calc(100dvh-180px))]">
        {isLoading ? (
          <Div className="space-y-3 pt-4">
            <Div className="p-4 rounded-lg border border-border bg-card animate-pulse">
              <Div className="flex items-center gap-2 mb-3">
                <Div className="h-5 w-12 bg-muted rounded" />
                <Div className="h-5 w-16 bg-muted rounded" />
              </Div>
              <Div className="h-4 bg-muted rounded mb-2" />
              <Div className="h-4 bg-muted rounded w-3/4 mb-3" />
              <Div className="flex gap-1.5">
                <Div className="h-5 w-16 bg-muted rounded" />
                <Div className="h-5 w-20 bg-muted rounded" />
              </Div>
            </Div>
            <Div className="p-4 rounded-lg border border-border bg-card animate-pulse">
              <Div className="flex items-center gap-2 mb-3">
                <Div className="h-5 w-12 bg-muted rounded" />
                <Div className="h-5 w-16 bg-muted rounded" />
              </Div>
              <Div className="h-4 bg-muted rounded mb-2" />
              <Div className="h-4 bg-muted rounded w-3/4 mb-3" />
              <Div className="flex gap-1.5">
                <Div className="h-5 w-16 bg-muted rounded" />
                <Div className="h-5 w-20 bg-muted rounded" />
              </Div>
            </Div>
            <Div className="p-4 rounded-lg border border-border bg-card animate-pulse">
              <Div className="flex items-center gap-2 mb-3">
                <Div className="h-5 w-12 bg-muted rounded" />
                <Div className="h-5 w-16 bg-muted rounded" />
              </Div>
              <Div className="h-4 bg-muted rounded mb-2" />
              <Div className="h-4 bg-muted rounded w-3/4 mb-3" />
              <Div className="flex gap-1.5">
                <Div className="h-5 w-16 bg-muted rounded" />
                <Div className="h-5 w-20 bg-muted rounded" />
              </Div>
            </Div>
          </Div>
        ) : filteredMemories.length === 0 ? (
          <Div className="text-center text-muted-foreground py-8">
            {searchQuery || selectedTag
              ? t("app.api.agent.chat.memories.get.emptySearch")
              : t("app.api.agent.chat.memories.get.emptyState")}
          </Div>
        ) : (
          <Div className="space-y-3 pt-4">
            {filteredMemories.map((memory) => {
              const originalIndex = sortedMemories.indexOf(memory);
              return (
                <Div
                  key={memory.memoryNumber}
                  className={cn(
                    "group p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm",
                    isTouch && "hover:border-border hover:shadow-none",
                    memory.priority >= 50 && "border-l-4 border-l-green-500",
                  )}
                >
                  <Div className="flex flex-col gap-3">
                    {/* Header row */}
                    <Div className="flex items-center gap-2">
                      <BadgeWidget
                        field={withValue(
                          children.memories.child.children.memoryNumber,
                          memory.memoryNumber,
                          memory,
                        )}
                        fieldName={arrayFieldPath(
                          "memories",
                          originalIndex,
                          "memoryNumber",
                        )}
                      />
                      <BadgeWidget
                        field={withValue(
                          children.memories.child.children.priority,
                          memory.priority,
                          memory,
                        )}
                        fieldName={arrayFieldPath(
                          "memories",
                          originalIndex,
                          "priority",
                        )}
                      />
                      <Div className="ml-auto flex items-center gap-1">
                        {!isTouch && (
                          <>
                            <EditMemoryButton
                              memoryId={memory.memoryNumber}
                              navigate={navigate}
                            />
                            <DeleteMemoryButton
                              memoryId={memory.memoryNumber}
                              navigate={navigate}
                            />
                          </>
                        )}
                      </Div>
                    </Div>

                    {/* Memory content */}
                    <Div className="text-sm leading-relaxed">
                      <Span>{memory.content}</Span>
                    </Div>

                    {/* Tags */}
                    {memory.tags && memory.tags.length > 0 && (
                      <Div className="flex flex-wrap gap-1.5">
                        {memory.tags.map((tag, tagIndex) => (
                          <BadgeWidget
                            key={tagIndex}
                            field={withValue(
                              children.memories.child.children.tags.child,
                              tag,
                              memory,
                            )}
                            fieldName={arrayFieldPath(
                              `memories.${originalIndex}.tags`,
                              tagIndex,
                              "",
                            )}
                          />
                        ))}
                      </Div>
                    )}

                    {/* Footer */}
                    <Div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <Span className="text-xs text-muted-foreground">
                        {new Date(memory.createdAt).toLocaleDateString()} •{" "}
                        {memory.content.length} chars
                      </Span>
                      {isTouch && (
                        <Div className="flex items-center gap-1">
                          <EditMemoryButton
                            memoryId={memory.memoryNumber}
                            navigate={navigate}
                          />
                          <DeleteMemoryButton
                            memoryId={memory.memoryNumber}
                            navigate={navigate}
                          />
                        </Div>
                      )}
                    </Div>
                  </Div>
                </Div>
              );
            })}
          </Div>
        )}
      </Div>
    </Div>
  );
}
