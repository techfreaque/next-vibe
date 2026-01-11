"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { FavoriteCard } from "@/app/api/[locale]/agent/chat/favorites/definition";
import { Icon } from "@/app/api/[locale]/system/unified-interface/react/icons";
import { useIsMobile } from "@/hooks/use-media-query";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface FavoritesBarProps {
  favorites: FavoriteCard[];
  activeFavoriteId: string | null;
  onFavoriteSelect: (favoriteId: string) => void;
  onSettingsClick: (favoriteId: string) => void;
  onAddClick: () => void;
  locale: CountryLanguage;
  className?: string;
}

/**
 * Single favorite row in the list
 * Display fields are pre-computed in the definition response
 */
function FavoriteRow({
  favorite,
  onSelect,
  onEdit,
  locale,
  isActive,
}: {
  favorite: FavoriteCard;
  onSelect: () => void;
  onEdit: () => void;
  locale: CountryLanguage;
  isActive: boolean;
}): JSX.Element {
  const { t } = simpleT(locale);
  const isTouchDevice = useIsMobile();

  return (
    <Div
      className={cn(
        "relative flex items-start gap-3 p-3 rounded-xl border transition-all",
        "hover:bg-muted/50 hover:border-primary/20 cursor-pointer group",
        isActive && "bg-primary/5 border-primary/20",
      )}
      onClick={onSelect}
    >
      {/* Actions floating on top - always visible on touch devices, hover on desktop */}
      <Div
        className={cn(
          "absolute top-2 right-2 z-10 flex items-center gap-1 transition-opacity",
          isTouchDevice ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title={t("app.chat.selector.settings")}
        >
          <Icon icon="pencil" className="h-4 w-4" />
        </Button>
        {!isActive && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            title={t("app.chat.selector.switchTo")}
          >
            <Icon icon="zap" className="h-4 w-4" />
          </Button>
        )}
      </Div>

      {/* Icon */}
      <Div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
          isActive ? "bg-primary/15 text-primary" : "bg-muted group-hover:bg-primary/10",
        )}
      >
        <Icon icon={favorite.icon} className="h-5 w-5" />
      </Div>

      {/* Info - Full Width */}
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 pr-20">
          <Div className={cn("font-medium text-base", isActive && "text-primary")}>
            {t(favorite.content.titleRow.name)}
          </Div>
          {isActive && (
            <Badge variant="default" className="text-[9px] h-4 px-1.5 shrink-0">
              {t("app.chat.selector.active")}
            </Badge>
          )}
        </Div>
        {favorite.content.modelRow.modelInfo && (
          <Div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
            <Icon icon={favorite.content.modelRow.modelIcon} className="h-3 w-3" />
            <Span className="truncate">{favorite.content.modelRow.modelInfo}</Span>
            {favorite.content.modelRow.modelProvider && (
              <>
                <Span className="text-muted-foreground/40">•</Span>
                <Span className="shrink-0">{favorite.content.modelRow.modelProvider}</Span>
              </>
            )}
            <Span className="text-muted-foreground/40">•</Span>
            <Span className="shrink-0">{favorite.content.modelRow.creditCost}</Span>
          </Div>
        )}
      </Div>
    </Div>
  );
}

/**
 * Favorites list for the selector popover
 */
export function FavoritesBar({
  favorites,
  activeFavoriteId,
  onFavoriteSelect,
  onSettingsClick,
  onAddClick,
  locale,
  className,
}: FavoritesBarProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Div className={cn("flex flex-col gap-3", className)}>
      {/* Header */}
      <Div className="flex items-center justify-between">
        <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t("app.chat.selector.yourSetups")}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1 -mr-2"
          onClick={onAddClick}
        >
          <Icon icon="plus" className="h-3 w-3" />
          {t("app.chat.selector.addNew")}
        </Button>
      </Div>

      {/* Favorites list */}
      <Div className="flex flex-col gap-2 max-h-100 overflow-y-auto">
        {favorites.map((favorite) => (
          <FavoriteRow
            key={favorite.id}
            favorite={favorite}
            onSelect={() => onFavoriteSelect(favorite.id)}
            onEdit={() => onSettingsClick(favorite.id)}
            locale={locale}
            isActive={favorite.id === activeFavoriteId}
          />
        ))}
      </Div>
    </Div>
  );
}
