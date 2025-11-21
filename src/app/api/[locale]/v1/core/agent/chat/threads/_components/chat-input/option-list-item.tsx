// oxlint-disable prefer-tag-over-role
"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Star } from "next-vibe-ui/ui/icons/Star";
import type { JSX, ReactNode } from "react";
import React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface OptionListItemProps<T = string> {
  id: T;
  name: string;
  description?: string;
  tooltip?: string;
  icon: ReactNode;
  isSelected: boolean;
  isTouch: boolean;
  onSelect: (id: T) => void;
  onToggleFavorite: (id: T) => void;
  locale: CountryLanguage;
}

const ICON_SIZE_MEDIUM = "w-5 h-5 sm:w-4.5 sm:h-4.5 flex-shrink-0";

export function OptionListItem<T extends string = string>({
  id,
  name,
  description,
  tooltip,
  icon,
  isSelected,
  isTouch,
  onSelect,
  onToggleFavorite,
  locale,
}: OptionListItemProps<T>): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Button
      variant="ghost"
      size="unset"
      onClick={() => onSelect(id)}
      title={tooltip || name}
      className={cn(
        "w-full flex items-center gap-3 px-3 sm:px-3.5 py-3 sm:py-2.5 rounded-lg hover:bg-accent active:bg-accent/80 transition-colors text-left group min-h-[52px] sm:min-h-[44px] touch-manipulation cursor-pointer",
        isSelected && "bg-accent",
      )}
    >
      <Span className="flex items-center justify-center w-5 h-5 sm:w-4.5 sm:h-4.5 flex-shrink-0">
        <Div className={ICON_SIZE_MEDIUM}>{icon}</Div>
      </Span>
      <Div className="flex-1 min-w-0">
        <Div className="text-sm sm:text-[13px] font-medium break-words line-clamp-2 leading-snug">
          {name}
        </Div>
        {description && (
          <Div className="text-xs text-muted-foreground break-words line-clamp-1 mt-0.5">
            {description}
          </Div>
        )}
      </Div>
      <Div
        className={cn(
          "flex items-center gap-2 transition-opacity",
          // Touch devices: always visible but slightly transparent
          // Pointer devices: hidden until hover
          isTouch ? "opacity-70" : "opacity-0 group-hover:opacity-100",
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
          className="p-1.5 sm:p-1 hover:bg-background rounded active:scale-95 transition-transform touch-manipulation cursor-pointer"
          title={t("app.chat.selectorBase.toggleFavorite")}
          aria-label={t("app.chat.selectorBase.toggleFavorite")}
        >
          <Star className="h-4.5 w-4.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
        </Div>
        {isSelected && <Check className="h-4 w-4 text-primary" />}
      </Div>
    </Button>
  );
}
