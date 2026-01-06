"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useMemo } from "react";

import type { CharacterListResponseOutput } from "@/app/api/[locale]/agent/chat/characters/definition";
import { CharactersRepositoryClient } from "@/app/api/[locale]/agent/chat/characters/repository-client";
import type { FavoritesListResponseOutput } from "@/app/api/[locale]/agent/chat/favorites/definition";
import {
  type ModelOption,
  modelOptions,
  modelProviders,
} from "@/app/api/[locale]/agent/models/models";
import { Icon, type IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";
import { useIsMobile } from "@/hooks/use-media-query";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

/**
 * Favorite item type inferred from API definition
 */
export type FavoriteItem = FavoritesListResponseOutput["favorites"][number];

interface FavoritesBarProps {
  favorites: FavoriteItem[];
  activeFavoriteId: string | null;
  onFavoriteSelect: (favoriteId: string) => void;
  onSettingsClick: (favoriteId: string) => void;
  onAddClick: () => void;
  locale: CountryLanguage;
  characters: Record<string, CharacterListResponseOutput["characters"][number]>;
  className?: string;
}

/**
 * Get display info for a favorite
 */
interface FavoriteDisplay {
  character: CharacterListResponseOutput["characters"][number] | null;
  resolvedModel: ModelOption | null;
  displayName: string;
  displayIcon: IconKey;
}

function useFavoriteDisplay(
  favorite: FavoriteItem,
  locale: CountryLanguage,
  characters: Record<string, CharacterListResponseOutput["characters"][number]>,
): FavoriteDisplay {
  const { t } = simpleT(locale);
  const allModels = useMemo(() => Object.values(modelOptions), []);

  const character = useMemo(
    () => CharactersRepositoryClient.getCharacterById(characters, favorite.characterId),
    [favorite.characterId, characters],
  );

  const resolvedModel = useMemo(() => {
    return CharactersRepositoryClient.resolveModelForSelection(
      favorite.modelSelection,
      character ?? null,
      allModels,
    );
  }, [character, favorite.modelSelection, allModels]);

  // Display name and icon - consolidated logic
  const displayName = useMemo(
    () => CharactersRepositoryClient.getDisplayName(favorite, character, resolvedModel, t),
    [favorite, character, resolvedModel, t],
  );

  const displayIcon = useMemo(
    () => CharactersRepositoryClient.getDisplayIcon(favorite, character, resolvedModel),
    [favorite, character, resolvedModel],
  );

  return { character, resolvedModel, displayName, displayIcon };
}

/**
 * Single favorite row in the list
 */
function FavoriteRow({
  favorite,
  onSelect,
  onEdit,
  locale,
  characters,
  isActive,
}: {
  favorite: FavoriteItem;
  onSelect: () => void;
  onEdit: () => void;
  locale: CountryLanguage;
  characters: Record<string, CharacterListResponseOutput["characters"][number]>;
  isActive: boolean;
}): JSX.Element {
  const { t } = simpleT(locale);
  const isTouchDevice = useIsMobile();
  const { character, resolvedModel, displayName, displayIcon } = useFavoriteDisplay(
    favorite,
    locale,
    characters,
  );
  const providerName = resolvedModel
    ? (modelProviders[resolvedModel.provider]?.name ?? resolvedModel.provider)
    : null;

  const isModelOnly = !character;

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
        <Icon icon={displayIcon} className="h-5 w-5" />
      </Div>

      {/* Info - Full Width */}
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 pr-20">
          <Div className={cn("font-medium text-base", isActive && "text-primary")}>
            {displayName}
          </Div>
          {isActive && (
            <Badge variant="default" className="text-[9px] h-4 px-1.5 shrink-0">
              {t("app.chat.selector.active")}
            </Badge>
          )}
          {isModelOnly && !isActive && (
            <Badge variant="outline" className="text-[9px] h-4 px-1.5 shrink-0 opacity-60">
              {t("app.chat.selector.modelOnly")}
            </Badge>
          )}
        </Div>
        {resolvedModel && (
          <Div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
            <Icon icon={resolvedModel.icon} className="h-3 w-3" />
            <Span className="truncate">{resolvedModel.name}</Span>
            {providerName && (
              <>
                <Span className="text-muted-foreground/40">•</Span>
                <Span className="shrink-0">{providerName}</Span>
              </>
            )}
            <Span className="text-muted-foreground/40">•</Span>
            <Span className="shrink-0">
              {CharactersRepositoryClient.formatCreditCost(resolvedModel.creditCost, t)}
            </Span>
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
  characters,
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
            characters={characters}
            isActive={favorite.id === activeFavoriteId}
          />
        ))}
      </Div>
    </Div>
  );
}
