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

import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/packages/next-vibe-ui/web/ui";

import { useTouchDevice } from "../../hooks/use-touch-device";

export interface SelectorOption<T = string> {
  id: T;
  name: string;
  description?: string;
  tooltip?: string;
  icon: ReactNode;
  group?: string;
}

interface SelectorBaseProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectorOption<T>[];
  favorites: T[];
  onToggleFavorite: (id: T) => void;
  onAddNew?: () => void;
  placeholder?: string;
  addNewLabel?: string;
  groupByProvider?: boolean;
}

export function SelectorBase<T extends string = string>({
  value,
  onChange,
  options,
  favorites,
  onToggleFavorite,
  onAddNew,
  placeholder = "Select...",
  addNewLabel = "Add New",
  groupByProvider = false,
}: SelectorBaseProps<T>): JSX.Element {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const favoriteOptions = filteredOptions.filter((opt) =>
    favorites.includes(opt.id),
  );
  const nonFavoriteOptions = filteredOptions.filter(
    (opt) => !favorites.includes(opt.id),
  );

  // Group options by provider/group
  const groupedOptions = useMemo(() => {
    const grouped: Record<string, SelectorOption<T>[]> = {};

    if (!groupByProvider) {
      // When not grouping by provider, just create a single "All" group
      if (favoriteOptions.length > 0) {
        grouped["Favorites"] = favoriteOptions;
      }
      if (nonFavoriteOptions.length > 0) {
        grouped["All"] = nonFavoriteOptions;
      }
      return grouped;
    }

    // Group favorites
    favoriteOptions.forEach((option) => {
      const group = "Favorites";
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(option);
    });

    // Group others
    nonFavoriteOptions.forEach((option) => {
      const group = option.group || "Others";
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(option);
    });

    return grouped;
  }, [favoriteOptions, nonFavoriteOptions, groupByProvider]);

  const handleSelect = (id: T) => {
    onChange(id);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
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
          className="h-auto min-h-[44px] sm:min-h-9 gap-2 px-2 sm:px-3 py-1.5 sm:py-1 hover:bg-accent text-sm font-normal touch-manipulation"
          title={selectedOption?.name}
        >
          {selectedOption ? (
            <>
              <span className="flex items-center justify-center w-4 h-4 sm:w-3.5 sm:h-3.5 flex-shrink-0">
                {selectedOption.icon}
              </span>
              <span className="max-w-[120px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[220px] text-left break-words line-clamp-2">
                {selectedOption.name}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="h-3.5 w-3.5 sm:h-3 sm:w-3 opacity-50 flex-shrink-0" />
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
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                className="pl-9 h-10 sm:h-9 text-base sm:text-sm touch-manipulation"
                autoComplete="off"
              />
            </div>
          </div>

          {!showAll ? (
            /* Favorites List View - Single Row Each */
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
                        {option.icon}
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(option.id);
                          }}
                          className="p-1.5 sm:p-1 hover:bg-background rounded active:scale-95 transition-transform touch-manipulation"
                          title="Toggle favorite"
                          aria-label="Toggle favorite"
                        >
                          <Star className="h-4.5 w-4.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                        </button>
                        {value === option.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No favorites yet. Click "Show all" to add some.
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Grid View - All Options Grouped */
            <div className="overflow-y-auto max-h-[500px] overscroll-contain">
              <div className="p-3 sm:p-4 space-y-5 sm:space-y-6">
                {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                  <div key={group}>
                    <div className="text-xs font-semibold text-muted-foreground mb-2.5 sm:mb-3 px-1">
                      {group}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
                      {groupOptions.map((option) => (
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(option.id);
                            }}
                            title="Toggle favorite"
                            aria-label="Toggle favorite"
                            className={cn(
                              "absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 sm:p-1 hover:bg-background rounded transition-all active:scale-95 touch-manipulation",
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
                          </button>
                          <div className="flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8">
                            {option.icon}
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
                  Favorites
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show all
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
