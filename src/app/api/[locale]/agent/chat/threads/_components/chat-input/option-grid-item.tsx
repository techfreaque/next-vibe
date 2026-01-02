// oxlint-disable prefer-tag-over-role
"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Star } from "next-vibe-ui/ui/icons/Star";
import type { JSX, ReactNode } from "react";
import React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface OptionGridItemProps<T = string> {
  id: T;
  name: string;
  description?: string;
  tooltip?: string;
  icon: ReactNode;
  isSelected: boolean;
  isFavorite: boolean;
  isTouch: boolean;
  onSelect: (id: T) => void;
  onToggleFavorite: (id: T) => void;
  locale: CountryLanguage;
}

const ICON_SIZE_LARGE = "w-5 h-5 sm:w-4.5 sm:h-4.5 flex-shrink-0";

export function OptionGridItem<T extends string = string>({
  id,
  name,
  description,
  tooltip,
  icon,
  isSelected,
  isFavorite,
  isTouch,
  onSelect,
  onToggleFavorite,
  locale,
}: OptionGridItemProps<T>): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Button
      variant="ghost"
      size="unset"
      onClick={() => onSelect(id)}
      title={tooltip || name}
      className={cn(
        "relative flex flex-col items-center gap-2 p-3 sm:p-2.5 rounded-lg border-2 hover:border-primary active:scale-98 transition-all text-center group min-h-[80px] sm:min-h-[72px] touch-manipulation cursor-pointer",
        isSelected ? "border-primary bg-accent" : "border-transparent bg-accent/50",
      )}
    >
      <Div
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(id);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(id);
          }
        }}
        title={t("app.chat.selectorBase.toggleFavorite")}
        aria-label={t("app.chat.selectorBase.toggleFavorite")}
        className={cn(
          "absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 sm:p-1 hover:bg-background rounded transition-all active:scale-95 touch-manipulation cursor-pointer",
          // Touch devices: always visible but slightly transparent
          // Pointer devices: hidden until hover
          isTouch ? "opacity-70" : "opacity-0 group-hover:opacity-100",
        )}
      >
        <Star
          className={cn(
            "h-4 w-4 sm:h-3.5 sm:w-3.5",
            isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
          )}
        />
      </Div>
      <Div className="flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8">
        <Div className={ICON_SIZE_LARGE}>{icon}</Div>
      </Div>
      <Div className="text-xs sm:text-[11px] font-medium w-full px-1 break-words text-center line-clamp-3 leading-tight">
        {name}
      </Div>
      {description && (
        <Div className="text-[10px] text-muted-foreground w-full px-1 break-words text-center line-clamp-2 leading-tight">
          {description}
        </Div>
      )}
    </Button>
  );
}
