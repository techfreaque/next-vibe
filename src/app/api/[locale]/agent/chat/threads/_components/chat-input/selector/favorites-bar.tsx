"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Bot } from "next-vibe-ui/ui/icons/Bot";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useMemo } from "react";

import { getCharacterById } from "@/app/api/[locale]/agent/chat/characters/config";
import {
  ContentLevelFilter,
  type ContentLevelFilterValue,
  IntelligenceLevelFilter,
  type IntelligenceLevelFilterValue,
  ModelSelectionMode,
  type ModelSelectionModeValue,
  type PriceLevelFilterValue,
} from "@/app/api/[locale]/agent/chat/favorites/enum";
import { getIconComponent, type IconKey } from "@/app/api/[locale]/agent/chat/model-access/icons";
import {
  type ModelId,
  type ModelOption,
  modelOptions,
  modelProviders,
} from "@/app/api/[locale]/agent/chat/model-access/models";
import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import { useIsMobile } from "@/hooks/use-media-query";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { selectModelForCharacter } from "./types";

/**
 * Favorite/Setup item - unified character + model configuration
 */
export interface FavoriteItem {
  id: string;
  // Character ID - null means model-only setup
  characterId: string | null;
  // Display overrides
  customName?: string;
  customIcon?: IconKey;
  voice?: typeof TtsVoiceValue;
  // Model selection
  modelSettings: {
    mode: typeof ModelSelectionModeValue;
    filters: {
      intelligence: typeof IntelligenceLevelFilterValue;
      maxPrice: typeof PriceLevelFilterValue;
      content: typeof ContentLevelFilterValue;
    };
    manualModelId?: ModelId;
  };
  isActive: boolean;
}

interface FavoritesBarProps {
  favorites: FavoriteItem[];
  onFavoriteSelect: (favoriteId: string) => void;
  onSettingsClick: (favoriteId: string) => void;
  onAddClick: () => void;
  locale: CountryLanguage;
  className?: string;
}

/**
 * Get display info for a favorite
 */
interface FavoriteDisplay {
  character: ReturnType<typeof getCharacterById> | null;
  resolvedModel: ModelOption | null;
  displayName: string;
  displayIcon: React.ComponentType<{ className?: string }>;
}

function useFavoriteDisplay(favorite: FavoriteItem, locale: CountryLanguage): FavoriteDisplay {
  const { t } = simpleT(locale);
  const allModels = useMemo(() => Object.values(modelOptions), []);

  const character = useMemo(
    () => (favorite.characterId ? getCharacterById(favorite.characterId) : null),
    [favorite.characterId],
  );

  const resolvedModel = useMemo(() => {
    // Use new priority logic: manual > preferredModel > auto
    const selectedModelId = selectModelForCharacter(allModels, character ?? null, {
      mode: favorite.modelSettings.mode === ModelSelectionMode.MANUAL ? "manual" : "auto",
      manualModelId: favorite.modelSettings.manualModelId,
      filters: favorite.modelSettings.filters,
    });

    if (selectedModelId) {
      return allModels.find((m) => m.id === selectedModelId) ?? null;
    }

    // Model-only fallback: filter by settings
    return (
      allModels.find((m) => {
        const { filters } = favorite.modelSettings;
        if (
          filters.intelligence !== IntelligenceLevelFilter.ANY &&
          m.intelligence !== filters.intelligence
        ) {
          return false;
        }
        if (filters.content !== ContentLevelFilter.ANY && m.content !== filters.content) {
          return false;
        }
        return true;
      }) ?? allModels[0]
    );
  }, [character, favorite.modelSettings, allModels]);

  // Display name: custom > character name > model name
  const displayName = useMemo(() => {
    if (favorite.customName) {
      return favorite.customName;
    }
    if (character) {
      return t(character.name);
    }
    if (resolvedModel) {
      return resolvedModel.name;
    }
    return t("app.chat.selector.setup");
  }, [favorite.customName, character, resolvedModel, t]);

  // Display icon: custom > character icon > model icon
  const displayIcon = useMemo(() => {
    if (favorite.customIcon) {
      return getIconComponent(favorite.customIcon);
    }
    if (character) {
      return getIconComponent(character.icon);
    }
    if (resolvedModel) {
      return getIconComponent(resolvedModel.icon);
    }
    return Bot;
  }, [favorite.customIcon, character, resolvedModel]);

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
}: {
  favorite: FavoriteItem;
  onSelect: () => void;
  onEdit: () => void;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const isTouchDevice = useIsMobile();
  const {
    character,
    resolvedModel,
    displayName,
    displayIcon: Icon,
  } = useFavoriteDisplay(favorite, locale);

  const ModelIcon = resolvedModel ? getIconComponent(resolvedModel.icon) : null;
  const providerName = resolvedModel
    ? (modelProviders[resolvedModel.provider]?.name ?? resolvedModel.provider)
    : null;

  const isModelOnly = !character;

  return (
    <Div
      className={cn(
        "relative flex items-start gap-3 p-3 rounded-xl border transition-all",
        "hover:bg-muted/50 hover:border-primary/20 cursor-pointer group",
        favorite.isActive && "bg-primary/5 border-primary/20",
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
          <Pencil className="h-4 w-4" />
        </Button>
        {!favorite.isActive && (
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
            <Zap className="h-4 w-4" />
          </Button>
        )}
      </Div>

      {/* Icon */}
      <Div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
          favorite.isActive ? "bg-primary/15 text-primary" : "bg-muted group-hover:bg-primary/10",
        )}
      >
        <Icon className="h-5 w-5" />
      </Div>

      {/* Info - Full Width */}
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 pr-20">
          <Div className={cn("font-medium text-base", favorite.isActive && "text-primary")}>
            {displayName}
          </Div>
          {favorite.isActive && (
            <Badge variant="default" className="text-[9px] h-4 px-1.5 shrink-0">
              {t("app.chat.selector.active")}
            </Badge>
          )}
          {isModelOnly && !favorite.isActive && (
            <Badge variant="outline" className="text-[9px] h-4 px-1.5 shrink-0 opacity-60">
              {t("app.chat.selector.modelOnly")}
            </Badge>
          )}
        </Div>
        {resolvedModel && (
          <Div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
            {ModelIcon && <ModelIcon className="h-3 w-3" />}
            <Span className="truncate">{resolvedModel.name}</Span>
            {providerName && (
              <>
                <Span className="text-muted-foreground/40">•</Span>
                <Span className="shrink-0">{providerName}</Span>
              </>
            )}
            <Span className="text-muted-foreground/40">•</Span>
            <Span className="shrink-0">
              {resolvedModel.creditCost === 0
                ? t("app.chat.selector.free")
                : resolvedModel.creditCost === 1
                  ? t("app.chat.selector.creditsSingle")
                  : t("app.chat.selector.creditsExact", {
                      cost: resolvedModel.creditCost,
                    })}
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
          <Plus className="h-3 w-3" />
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
          />
        ))}
      </Div>
    </Div>
  );
}
