"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { NO_CHARACTER_ID } from "@/app/api/[locale]/agent/chat/characters/config";
import type { FavoriteCard } from "@/app/api/[locale]/agent/chat/favorites/definition";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { useIsMobile } from "@/hooks/use-media-query";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction } from "@/i18n/core/static-types";

import { modelProviders } from "../../../models/models";

interface FavoritesViewProps {
  activeFavoriteId: string | null;
  onSettingsClick: (favoriteId: string) => void;
  onAddClick: () => void;
  locale: CountryLanguage;
  favorites: FavoriteCard[];
  favoritesLoading: boolean;
  onFavoriteSelect: (favoriteId: string) => void;
}

export function FavoritesList({
  activeFavoriteId,
  onSettingsClick,
  onAddClick,
  locale,
  favorites,
  favoritesLoading,
  onFavoriteSelect,
}: FavoritesViewProps): JSX.Element {
  if (favoritesLoading) {
    return (
      <Div className="flex items-center justify-center p-8">
        <Div className="flex flex-col items-center gap-3">
          <Div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </Div>
      </Div>
    );
  }
  const { t } = simpleT(locale);

  return (
    <Div className="p-4 overflow-y-auto">
      <Div className={cn("flex flex-col gap-3")}>
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
          {!favorites && favoritesLoading ? (
            <Div className="flex items-center justify-center p-8">
              <Div className="flex flex-col items-center gap-3">
                <Div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <Span className="text-sm text-muted-foreground">
                  {t("app.chat.selector.loading")}
                </Span>
              </Div>
            </Div>
          ) : (
            favorites.map((favorite) => (
              <FavoriteRow
                key={favorite.id}
                favorite={favorite}
                onSelect={() => onFavoriteSelect(favorite.id)}
                onEdit={() => onSettingsClick(favorite.id)}
                t={t}
                isActive={favorite.id === activeFavoriteId}
              />
            ))
          )}
        </Div>
      </Div>
    </Div>
  );
}

/**
 * Single favorite row in the list
 * Display fields are pre-computed in the definition response
 */
function FavoriteRow({
  favorite,
  onSelect,
  onEdit,
  t,
  isActive,
}: {
  favorite: FavoriteCard;
  onSelect: () => void;
  onEdit: () => void;
  t: TFunction;
  isActive: boolean;
}): JSX.Element {
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
          isActive
            ? "bg-primary/15 text-primary"
            : "bg-muted group-hover:bg-primary/10",
        )}
      >
        <Icon icon={favorite.icon} className="h-5 w-5" />
      </Div>

      {/* Info - Full Width */}
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 pr-20">
          <Div className="flex items-baseline gap-1.5 min-w-0">
            <Span
              className={cn(
                "font-medium text-base shrink-0",
                isActive && "text-primary",
              )}
            >
              {favorite.characterId !== NO_CHARACTER_ID
                ? t(favorite.content.titleRow.name)
                : favorite.content.titleRow.name}
            </Span>
            {favorite.characterId !== NO_CHARACTER_ID &&
              favorite.content.titleRow.tagline && (
                <Span className="text-xs text-muted-foreground truncate">
                  {t(favorite.content.titleRow.tagline)}
                </Span>
              )}
          </Div>
          {isActive && (
            <Badge variant="default" className="text-[9px] h-4 px-1.5 shrink-0">
              {t("app.chat.selector.active")}
            </Badge>
          )}
        </Div>
        {/* Description - shown for character-based favorites */}
        {favorite.content.description && (
          <Span className="text-xs text-muted-foreground block mt-1 truncate">
            {t(favorite.content.description)}
          </Span>
        )}
        <Div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
          {favorite.content.modelRow.modelInfo && (
            <>
              <Icon
                icon={favorite.content.modelRow.modelIcon}
                className="h-4 w-4"
              />
              <Span className="truncate">
                {favorite.content.modelRow.modelInfo}
              </Span>
              <Span className="text-muted-foreground/40">•</Span>
            </>
          )}
          {favorite.content.modelRow.modelProvider && (
            <>
              <Span className="shrink-0">
                {modelProviders[favorite.content.modelRow.modelProvider]?.name}
              </Span>
              <Span className="text-muted-foreground/40">•</Span>
            </>
          )}
          <Span className="shrink-0">
            {favorite.content.modelRow.creditCost}
          </Span>
        </Div>
      </Div>
    </Div>
  );
}
