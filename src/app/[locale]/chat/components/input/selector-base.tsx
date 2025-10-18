"use client";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { JSX, ReactNode } from "react";
import React, { useMemo, useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/packages/next-vibe-ui/web/ui";

import { useTouchDevice } from "../../hooks/use-touch-device";
import { getIconComponent, type IconValue } from "../../lib/config/icons";

export interface SelectorOption<T = string> {
  id: T;
  name: string;
  description?: string;
  tooltip?: string;
  icon: IconValue;
  group?: string;
  groupIcon?: IconValue;
  utilities?: string[];
  utilityIcons?: Record<string, IconValue>;
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
}: SelectorBaseProps<T>): JSX.Element {
  const { t } = simpleT(locale);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupMode, setGroupMode] = useState<GroupMode>("provider");
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
      const groupNames = Object.keys(grouped).sort((a, b) => {
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

      optionsToGroup.forEach((option) => {
        if (option.utilities && option.utilities.length > 0) {
          option.utilities.forEach((utilityKey) => {
            // Convert utility key to translated name
            const utilityName = t(
              `app.chat.modelUtilities.${utilityKey}` as TranslationKey,
            );
            if (!grouped[utilityName]) {
              grouped[utilityName] = {
                options: [],
                icon: utilityIconsMap[utilityKey],
              };
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

      return grouped;
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
          variant="ghost"
          size="sm"
          className="h-auto min-h-9 gap-2 px-3 py-1 hover:bg-accent text-sm font-normal touch-manipulation"
          title={selectedOption?.name}
        >
          {selectedOption ? (
            <>
              <span className="flex items-center justify-center w-4 h-4 flex-shrink-0">
                {renderIcon(selectedOption.icon)}
              </span>
              <span className="hidden min-[550px]:inline max-w-[120px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[220px] text-left break-words line-clamp-2">
                {selectedOption.name}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "p-0",
          showAll
            ? "w-[95vw] sm:w-[90vw] max-w-[700px]"
            : "w-[95vw] sm:w-[400px] max-w-[450px]",
        )}
        align="start"
        sideOffset={4}
      >
        <div className="flex flex-col max-h-[75dvh] sm:max-h-[600px]">
          {/* Search Bar */}
          <div className="p-2.5 sm:p-3 border-b flex-shrink-0">
            <div className="relative">
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
            </div>
          </div>

          {/* Group Mode & Sort Controls - Only visible when showAll */}
          {showAll && (
            <div className="px-2.5 sm:px-3 py-2 border-b flex-shrink-0 flex gap-2 items-center">
              {/* Group Mode Toggle */}
              <div className="flex gap-1 bg-muted rounded-md p-0.5">
                <Button
                  variant={groupMode === "provider" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGroupMode("provider")}
                  className="h-7 text-xs px-3"
                >
                  {providerLabel}
                </Button>
                <Button
                  variant={groupMode === "utility" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGroupMode("utility")}
                  className="h-7 text-xs px-3"
                >
                  {utilityLabel}
                </Button>
              </div>

              {/* Sort Order Toggle - Only for provider mode */}
              {groupMode === "provider" && (
                <div className="flex gap-1 bg-muted rounded-md p-0.5">
                  <Button
                    variant={sortOrder === "asc" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSortOrder("asc")}
                    className="h-7 text-xs px-3"
                  >
                    {t("app.chat.selectorBase.sortAZ")}
                  </Button>
                  <Button
                    variant={sortOrder === "desc" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSortOrder("desc")}
                    className="h-7 text-xs px-3"
                  >
                    {t("app.chat.selectorBase.sortZA")}
                  </Button>
                </div>
              )}
            </div>
          )}

          {!showAll ? (
            /* Default List View - Favorites Always Visible */
            <div className="overflow-y-auto max-h-[400px] overscroll-contain">
              <div className="p-1.5 sm:p-2">
                {favoriteOptions.length > 0 ? (
                  favoriteOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      title={option.tooltip || option.name}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 sm:px-3.5 py-3 sm:py-2.5 rounded-lg hover:bg-accent active:bg-accent/80 transition-colors text-left group min-h-[52px] sm:min-h-[44px] touch-manipulation",
                        value === option.id && "bg-accent",
                      )}
                    >
                      <span className="flex items-center justify-center w-5 h-5 sm:w-4.5 sm:h-4.5 flex-shrink-0">
                        {renderIcon(option.icon, ICON_SIZE_MEDIUM)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm sm:text-[13px] font-medium break-words line-clamp-2 leading-snug">
                          {option.name}
                        </div>
                        {option.description && (
                          <div className="text-xs text-muted-foreground break-words line-clamp-1 mt-0.5">
                            {option.description}
                          </div>
                        )}
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-2 transition-opacity",
                          // Touch devices: always visible but slightly transparent
                          // Pointer devices: hidden until hover
                          isTouch
                            ? "opacity-70"
                            : "opacity-0 group-hover:opacity-100",
                        )}
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(option.id);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              onToggleFavorite(option.id);
                            }
                          }}
                          className="p-1.5 sm:p-1 hover:bg-background rounded active:scale-95 transition-transform touch-manipulation cursor-pointer"
                          title={t("app.chat.selectorBase.toggleFavorite")}
                          aria-label={t("app.chat.selectorBase.toggleFavorite")}
                        >
                          <Star className="h-4.5 w-4.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                        </div>
                        {value === option.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    {t("app.chat.selectorBase.noFavorites")}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Grid View - Favorites, Featured, then Grouped */
            <div className="overflow-y-auto max-h-[500px] overscroll-contain">
              <div className="p-3 sm:p-4 space-y-5 sm:space-y-6">
                {/* Favorites Section - Always First */}
                {favoriteOptions.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-2.5 sm:mb-3 px-1">
                      {t("app.chat.selectorBase.favorites")}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
                      {favoriteOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleSelect(option.id)}
                          title={option.tooltip || option.name}
                          className={cn(
                            "relative flex flex-col items-center gap-2 p-3 sm:p-2.5 rounded-lg border-2 hover:border-primary active:scale-98 transition-all text-center group min-h-[80px] sm:min-h-[72px] touch-manipulation",
                            value === option.id
                              ? "border-primary bg-accent"
                              : "border-transparent bg-accent/50",
                          )}
                        >
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(option.id);
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggleFavorite(option.id);
                              }
                            }}
                            title={t("app.chat.selectorBase.toggleFavorite")}
                            aria-label={t(
                              "app.chat.selectorBase.toggleFavorite",
                            )}
                            className={cn(
                              "absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 sm:p-1 hover:bg-background rounded transition-all active:scale-95 touch-manipulation cursor-pointer",
                              // Touch devices: always visible but slightly transparent
                              // Pointer devices: hidden until hover
                              isTouch
                                ? "opacity-70"
                                : "opacity-0 group-hover:opacity-100",
                            )}
                          >
                            <Star
                              className={cn(
                                "h-4 w-4 sm:h-3.5 sm:w-3.5",
                                favorites.includes(option.id)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground",
                              )}
                            />
                          </div>
                          <div className="flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8">
                            {renderIcon(option.icon, ICON_SIZE_LARGE)}
                          </div>
                          <div className="text-xs sm:text-[11px] font-medium w-full px-1 break-words text-center line-clamp-3 leading-tight">
                            {option.name}
                          </div>
                          {option.description && (
                            <div className="text-[10px] text-muted-foreground w-full px-1 break-words text-center line-clamp-2 leading-tight">
                              {option.description}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grouped Options - Provider or Utility */}
                {Object.entries(groupedOptions).map(([group, groupData]) => (
                  <div key={group}>
                    <div className="text-xs font-semibold text-muted-foreground mb-2.5 sm:mb-3 px-1 flex items-center gap-2">
                      {groupData.icon && (
                        <span className="flex items-center justify-center w-4 h-4">
                          {renderIcon(groupData.icon, ICON_SIZE_SMALL)}
                        </span>
                      )}
                      {group}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
                      {groupData.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleSelect(option.id)}
                          title={option.tooltip || option.name}
                          className={cn(
                            "relative flex flex-col items-center gap-2 p-3 sm:p-2.5 rounded-lg border-2 hover:border-primary active:scale-98 transition-all text-center group min-h-[80px] sm:min-h-[72px] touch-manipulation",
                            value === option.id
                              ? "border-primary bg-accent"
                              : "border-transparent bg-accent/50",
                          )}
                        >
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(option.id);
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggleFavorite(option.id);
                              }
                            }}
                            title={t("app.chat.selectorBase.toggleFavorite")}
                            aria-label={t(
                              "app.chat.selectorBase.toggleFavorite",
                            )}
                            className={cn(
                              "absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 sm:p-1 hover:bg-background rounded transition-all active:scale-95 touch-manipulation cursor-pointer",
                              isTouch
                                ? "opacity-70"
                                : "opacity-0 group-hover:opacity-100",
                            )}
                          >
                            <Star
                              className={cn(
                                "h-4 w-4 sm:h-3.5 sm:w-3.5",
                                favorites.includes(option.id)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground",
                              )}
                            />
                          </div>
                          <div className="flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8">
                            {renderIcon(option.icon, ICON_SIZE_LARGE)}
                          </div>
                          <div className="text-xs sm:text-[11px] font-medium w-full px-1 break-words text-center line-clamp-3 leading-tight">
                            {option.name}
                          </div>
                          {option.description && (
                            <div className="text-[10px] text-muted-foreground w-full px-1 break-words text-center line-clamp-2 leading-tight">
                              {option.description}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer - Show All / Favorites Toggle + Add New */}
          <div className="border-t p-2 flex gap-2 flex-shrink-0">
            <Button
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
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
