// oxlint-disable prefer-tag-over-role
"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Popover } from "next-vibe-ui/ui/popover";
import { PopoverContent } from "next-vibe-ui/ui/popover";
import { PopoverTrigger } from "next-vibe-ui/ui/popover";
import { Span } from "next-vibe-ui/ui/span";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronUp } from "next-vibe-ui/ui/icons/ChevronUp";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Search } from "next-vibe-ui/ui/icons/Search";
import type { JSX, ReactNode } from "react";
import React, { useMemo, useState } from "react";

import {
  getIconComponent,
  type IconValue,
} from "@/app/api/[locale]/agent/chat/model-access/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useTouchDevice } from "@/hooks/use-touch-device";
import { OptionListItem } from "./option-list-item";
import { OptionGridItem } from "./option-grid-item";

export interface SelectorOption<T = string> {
  id: T;
  name: string;
  description?: string;
  tooltip?: string;
  icon: IconValue;
  group?: string;
  groupIcon?: IconValue;
  utilities?: string[]; // Utility names (translated keys)
  utilityIcons?: Record<string, IconValue>; // Map of utility name to icon
  utilityOrders?: Record<string, number>; // Map of utility name to order
}

type GroupMode = "provider" | "utility";
type SortOrder = "asc" | "desc";

interface SelectorBaseProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectorOption<T>[];
  favorites: T[];
  onToggleFavorite: (id: T) => void;
  onAddNew?: () => void;
  placeholder?: string;
  addNewLabel?: string;
  locale: CountryLanguage;
  groupModeLabels?: {
    provider: string;
    utility: string;
  };
  className?: string;
  buttonClassName?: string;
  triggerSize?: "default" | "sm" | "lg" | "icon";
  showTextAt?: "always" | "sm" | "md" | "lg" | "never";
}

/**
 * Render an icon from IconValue
 * Resolves the icon to a component and renders it with the given className
 */
function renderIcon(icon: IconValue, className = "h-4 w-4"): ReactNode {
  const Icon = getIconComponent(icon);
  return React.createElement(Icon, { className });
}

// Icon size constants
const ICON_SIZE_SMALL = "h-4 w-4 flex-shrink-0";
const ICON_SIZE_MEDIUM = "w-5 h-5 sm:w-4.5 sm:h-4.5 flex-shrink-0";
const ICON_SIZE_LARGE = "w-5 h-5 sm:w-4.5 sm:h-4.5 flex-shrink-0";

export function SelectorBase<T extends string = string>({
  value,
  onChange,
  options,
  favorites,
  onToggleFavorite,
  onAddNew,
  placeholder = "Select...",
  addNewLabel = "Add New",
  locale,
  groupModeLabels,
  className,
  buttonClassName,
  triggerSize = "sm",
  showTextAt = "sm",
}: SelectorBaseProps<T>): JSX.Element {
  const { t } = simpleT(locale);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupMode, setGroupMode] = useState<GroupMode>("utility");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Use custom labels or default translation keys
  const providerLabel =
    groupModeLabels?.provider || t("app.chat.selectorBase.groupByProvider");
  const utilityLabel =
    groupModeLabels?.utility || t("app.chat.selectorBase.groupByUtility");

  // Detect touch device for proper favorite star visibility
  const isTouch = useTouchDevice();

  const selectedOption = options.find((opt) => opt.id === value);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return options;
    }
    const query = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.name.toLowerCase().includes(query) ||
        opt.description?.toLowerCase().includes(query) ||
        opt.group?.toLowerCase().includes(query),
    );
  }, [options, searchQuery]);

  // Separate options into categories
  const favoriteOptions = filteredOptions.filter((opt) =>
    favorites.includes(opt.id),
  );

  // Group options by provider or utility (include ALL options, not just regularOptions)
  const groupedOptions = useMemo(() => {
    const grouped: Record<
      string,
      { options: SelectorOption<T>[]; icon?: IconValue }
    > = {};

    // Use filteredOptions instead of regularOptions to include favorites in groups
    const optionsToGroup = filteredOptions;

    if (groupMode === "provider") {
      // Group by provider
      optionsToGroup.forEach((option) => {
        const group = option.group || t("app.chat.selectorBase.others");
        if (!grouped[group]) {
          grouped[group] = { options: [], icon: option.groupIcon };
        }
        grouped[group].options.push(option);
      });

      // Sort groups by name
      const sortedGroups: Record<
        string,
        { options: SelectorOption<T>[]; icon?: IconValue }
      > = {};
      const groupNames = Object.keys(grouped).toSorted((a, b) => {
        if (sortOrder === "asc") {
          return a.localeCompare(b);
        }
        return b.localeCompare(a);
      });

      groupNames.forEach((name) => {
        sortedGroups[name] = grouped[name];
      });

      return sortedGroups;
    } else {
      // Group by utility - convert utility keys to translated names
      // Get utility icons from the first option's utilityIcons map
      const utilityIconsMap: Record<string, IconValue> = {};

      // Collect utility icons from the first option that has them
      for (const option of optionsToGroup) {
        if (option.utilityIcons) {
          Object.entries(option.utilityIcons).forEach(([key, icon]) => {
            if (!utilityIconsMap[key]) {
              utilityIconsMap[key] = icon;
            }
          });
        }
      }

      // Track utility order for each group
      const utilityOrderMap = new Map<string, number>();

      optionsToGroup.forEach((option) => {
        if (option.utilities && option.utilities.length > 0) {
          option.utilities.forEach((utilityName) => {
            if (!grouped[utilityName]) {
              grouped[utilityName] = {
                options: [],
                icon: utilityIconsMap[utilityName],
              };
              // Store the order for this utility from utilityOrders map
              if (
                option.utilityOrders &&
                option.utilityOrders[utilityName] !== undefined
              ) {
                utilityOrderMap.set(
                  utilityName,
                  option.utilityOrders[utilityName],
                );
              }
            }
            grouped[utilityName].options.push(option);
          });
        } else {
          // Options without utilities go to "Others"
          const othersKey = t("app.chat.selectorBase.others");
          if (!grouped[othersKey]) {
            grouped[othersKey] = { options: [] };
          }
          grouped[othersKey].options.push(option);
        }
      });

      // Sort groups by utility order
      const sortedGroups: Record<
        string,
        { options: SelectorOption<T>[]; icon?: IconValue }
      > = {};

      // Sort group names by their utility order, "Others" goes last
      const groupNames =
        Object.keys(grouped).toSorted?.((a, b) => {
          const othersKey = t("app.chat.selectorBase.others");
          // "Others" always goes last
          if (a === othersKey) {
            return 1;
          }
          if (b === othersKey) {
            return -1;
          }

          // Sort by utility order from utilityOrders map
          const orderA = utilityOrderMap.get(a) ?? Number.MAX_SAFE_INTEGER;
          const orderB = utilityOrderMap.get(b) ?? Number.MAX_SAFE_INTEGER;
          return orderA - orderB;
        }) || [];

      groupNames.forEach((name) => {
        sortedGroups[name] = grouped[name];
      });

      return sortedGroups;
    }
  }, [filteredOptions, groupMode, sortOrder, t]);

  const handleSelect = (id: T): void => {
    onChange(id);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean): void => {
    setOpen(newOpen);
    if (!newOpen) {
      setShowAll(false);
      setSearchQuery("");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={triggerSize}
          className={cn(
            "h-auto min-h-9 gap-2 px-3 py-1 hover:bg-accent text-sm font-normal touch-manipulation",
            buttonClassName,
          )}
          title={selectedOption?.name}
        >
          {selectedOption ? (
            <>
              <Span className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                {renderIcon(selectedOption.icon)}
              </Span>
              {/* Text visibility based on showTextAt prop */}
              {showTextAt === "always" && (
                <Span className="max-w-[120px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[220px] text-left break-words line-clamp-2">
                  {selectedOption.name}
                </Span>
              )}
              {showTextAt === "sm" && (
                <Span className="hidden min-[480px]:inline max-w-[100px] min-[480px]:max-w-[120px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[220px] text-left break-words line-clamp-2">
                  {selectedOption.name}
                </Span>
              )}
              {showTextAt === "md" && (
                <Span className="hidden min-[580px]:inline max-w-[100px] min-[580px]:max-w-[120px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[220px] text-left break-words line-clamp-2">
                  {selectedOption.name}
                </Span>
              )}
              {showTextAt === "lg" && (
                <Span className="hidden min-[680px]:inline max-w-[100px] min-[680px]:max-w-[120px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[220px] text-left break-words line-clamp-2">
                  {selectedOption.name}
                </Span>
              )}
            </>
          ) : (
            <Span className="text-muted-foreground">{placeholder}</Span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "p-0",
          showAll
            ? "w-[100vw] sm:w-[90vw] max-w-[700px]"
            : "w-[100vw] sm:w-[400px] max-w-[450px]",
          className,
        )}
        align="start"
        sideOffset={4}
      >
        <Div className="flex flex-col max-h-[75dvh] sm:max-h-[600px]">
          {/* Search Bar - Only show when in showAll mode */}
          {showAll && (
            <Div className="p-2.5 sm:p-3 border-b flex-shrink-0">
              <Div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("app.chat.selectorBase.searchPlaceholder", {
                    item: placeholder.toLowerCase(),
                  })}
                  className="pl-9 h-10 sm:h-9 text-base sm:text-sm touch-manipulation"
                  autoComplete="off"
                />
              </Div>
            </Div>
          )}

          {/* Group Mode & Sort Controls - Only visible when showAll */}
          {showAll && (
            <Div className="px-2.5 sm:px-3 py-2 border-b flex-shrink-0 flex gap-2 items-center">
              {/* Group Mode Toggle */}
              <Div className="flex gap-1 bg-muted rounded-md p-0.5">
                <Button
                  type="button"
                  variant={groupMode === "provider" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGroupMode("provider")}
                  className="h-7 text-xs px-3 cursor-pointer"
                >
                  {providerLabel}
                </Button>
                <Button
                  type="button"
                  variant={groupMode === "utility" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGroupMode("utility")}
                  className="h-7 text-xs px-3 cursor-pointer"
                >
                  {utilityLabel}
                </Button>
              </Div>

              {/* Sort Order Toggle - Only for provider mode */}
              {groupMode === "provider" && (
                <Div className="flex gap-1 bg-muted rounded-md p-0.5">
                  <Button
                    type="button"
                    variant={sortOrder === "asc" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSortOrder("asc")}
                    className="h-7 text-xs px-3 cursor-pointer"
                  >
                    {t("app.chat.selectorBase.sortAZ")}
                  </Button>
                  <Button
                    type="button"
                    variant={sortOrder === "desc" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSortOrder("desc")}
                    className="h-7 text-xs px-3 cursor-pointer"
                  >
                    {t("app.chat.selectorBase.sortZA")}
                  </Button>
                </Div>
              )}
            </Div>
          )}

          {!showAll ? (
            /* Default List View - Favorites Always Visible */
            <Div className="overflow-y-auto max-h-[400px] overscroll-contain">
              <Div className="p-1.5 sm:p-2">
                {favoriteOptions.length > 0 ? (
                  favoriteOptions.map((option) => (
                    <OptionListItem
                      key={option.id}
                      id={option.id}
                      name={option.name}
                      description={option.description}
                      tooltip={option.tooltip}
                      icon={renderIcon(option.icon, ICON_SIZE_MEDIUM)}
                      isSelected={value === option.id}
                      isTouch={isTouch}
                      onSelect={handleSelect}
                      onToggleFavorite={onToggleFavorite}
                      locale={locale}
                    />
                  ))
                ) : (
                  <Div className="text-center py-8 text-muted-foreground text-sm">
                    {t("app.chat.selectorBase.noFavorites")}
                  </Div>
                )}
              </Div>
            </Div>
          ) : (
            /* Grid View - Favorites, Featured, then Grouped */
            <Div className="overflow-y-auto max-h-[500px] overscroll-contain">
              <Div className="p-3 sm:p-4 flex flex-col gap-5 sm:gap-6">
                {/* Favorites Section - Always First */}
                {favoriteOptions.length > 0 && (
                  <Div>
                    <Div className="text-xs font-semibold text-muted-foreground mb-2.5 sm:mb-3 px-1">
                      {t("app.chat.selectorBase.favorites")}
                    </Div>
                    <Div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
                      {favoriteOptions.map((option) => (
                        <OptionGridItem
                          key={option.id}
                          id={option.id}
                          name={option.name}
                          description={option.description}
                          tooltip={option.tooltip}
                          icon={renderIcon(option.icon, ICON_SIZE_LARGE)}
                          isSelected={value === option.id}
                          isFavorite={favorites.includes(option.id)}
                          isTouch={isTouch}
                          onSelect={handleSelect}
                          onToggleFavorite={onToggleFavorite}
                          locale={locale}
                        />
                      ))}
                    </Div>
                  </Div>
                )}

                {/* Grouped Options - Provider or Utility */}
                {Object.entries(groupedOptions).map(([group, groupData]) => (
                  <Div key={group}>
                    <Div className="text-xs font-semibold text-muted-foreground mb-2.5 sm:mb-3 px-1 flex items-center gap-2">
                      {groupData.icon && (
                        <Span className="flex items-center justify-center w-4 h-4">
                          {renderIcon(groupData.icon, ICON_SIZE_SMALL)}
                        </Span>
                      )}
                      {groupMode === "utility"
                        ? t(group as Parameters<typeof t>[0])
                        : group}
                    </Div>
                    <Div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
                      {groupData.options.map((option) => (
                        <OptionGridItem
                          key={option.id}
                          id={option.id}
                          name={option.name}
                          description={option.description}
                          tooltip={option.tooltip}
                          icon={renderIcon(option.icon, ICON_SIZE_LARGE)}
                          isSelected={value === option.id}
                          isFavorite={favorites.includes(option.id)}
                          isTouch={isTouch}
                          onSelect={handleSelect}
                          onToggleFavorite={onToggleFavorite}
                          locale={locale}
                        />
                      ))}
                    </Div>
                  </Div>
                ))}
              </Div>
            </Div>
          )}

          {/* Footer - Show All / Favorites Toggle + Add New */}
          <Div className="border-t p-2 flex gap-2 flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="flex-1 justify-start gap-2 h-10 sm:h-9 text-sm touch-manipulation"
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  {t("app.chat.selectorBase.favorites")}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  {t("app.chat.selectorBase.showAll")}
                </>
              )}
            </Button>
            {onAddNew && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onAddNew();
                  handleOpenChange(false);
                }}
                className="gap-2 h-10 sm:h-9 text-sm touch-manipulation whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                {addNewLabel}
              </Button>
            )}
          </Div>
        </Div>
      </PopoverContent>
    </Popover>
  );
}
