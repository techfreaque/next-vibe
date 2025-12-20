"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Bot } from "next-vibe-ui/ui/icons/Bot";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useMemo } from "react";

import {
  getIconComponent,
  type IconKey,
} from "@/app/api/[locale]/agent/chat/model-access/icons";
import {
  type ModelId,
  type ModelOption,
  modelOptions,
  modelProviders,
} from "@/app/api/[locale]/agent/chat/model-access/models";
import { getPersonaById } from "@/app/api/[locale]/agent/chat/personas/config";
import {
  type ContentLevel,
  type IntelligenceLevel,
  type PriceLevel,
} from "@/app/api/[locale]/agent/chat/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { findBestModel } from "./types";

/**
 * Favorite/Setup item - unified persona + model configuration
 */
export interface FavoriteItem {
  id: string;
  // Persona ID - null means model-only setup
  personaId: string | null;
  // Display overrides
  customName?: string;
  customIcon?: IconKey;
  // Model selection
  modelSettings: {
    mode: "auto" | "manual";
    filters: {
      intelligence: IntelligenceLevel | "any";
      maxPrice: PriceLevel | "any";
      content: ContentLevel | "any";
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
  persona: ReturnType<typeof getPersonaById> | null;
  resolvedModel: ModelOption | null;
  displayName: string;
  displayIcon: React.ComponentType<{ className?: string }>;
}

function useFavoriteDisplay(favorite: FavoriteItem, locale: CountryLanguage): FavoriteDisplay {
  const { t } = simpleT(locale);
  const allModels = useMemo(() => Object.values(modelOptions), []);

  const persona = useMemo(
    () => (favorite.personaId ? getPersonaById(favorite.personaId) : null),
    [favorite.personaId],
  );

  const resolvedModel = useMemo(() => {
    if (
      favorite.modelSettings.mode === "manual" &&
      favorite.modelSettings.manualModelId
    ) {
      return (
        allModels.find((m) => m.id === favorite.modelSettings.manualModelId) ??
        null
      );
    }
    // For auto mode, find best model (with or without persona)
    if (persona) {
      return findBestModel(allModels, persona, {
        intelligence: favorite.modelSettings.filters.intelligence,
        maxPrice: favorite.modelSettings.filters.maxPrice,
        minContent: favorite.modelSettings.filters.content,
      });
    }
    // Model-only: just filter by settings
    return (
      allModels.find((m) => {
        const { filters } = favorite.modelSettings;
        if (
          filters.intelligence !== "any" &&
          m.intelligence !== filters.intelligence
        ) {
          return false;
        }
        if (filters.content !== "any" && m.content !== filters.content) {
          return false;
        }
        return true;
      }) ?? allModels[0]
    );
  }, [persona, favorite.modelSettings, allModels]);

  // Display name: custom > persona name > model name
  const displayName = useMemo(() => {
    if (favorite.customName) {
      return favorite.customName;
    }
    if (persona) {
      return t(persona.name);
    }
    if (resolvedModel) {
      return resolvedModel.name;
    }
    return t("app.chat.selector.setup");
  }, [favorite.customName, persona, resolvedModel, t]);

  // Display icon: custom > persona icon > model icon
  const displayIcon = useMemo(() => {
    if (favorite.customIcon) {
      return getIconComponent(favorite.customIcon);
    }
    if (persona) {
      return getIconComponent(persona.icon);
    }
    if (resolvedModel) {
      return getIconComponent(resolvedModel.icon);
    }
    return Bot;
  }, [favorite.customIcon, persona, resolvedModel]);

  return { persona, resolvedModel, displayName, displayIcon };
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
  const { persona, resolvedModel, displayName, displayIcon: Icon } =
    useFavoriteDisplay(favorite, locale);

  const ModelIcon = resolvedModel ? getIconComponent(resolvedModel.icon) : null;
  const providerName = resolvedModel
    ? (modelProviders[resolvedModel.provider]?.name ?? resolvedModel.provider)
    : null;

  const isModelOnly = !persona;

  return (
    <Div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border transition-all",
        "hover:bg-muted/50 hover:border-primary/20 cursor-pointer group",
        favorite.isActive && "bg-primary/5 border-primary/20",
      )}
      onClick={onSelect}
    >
      {/* Icon */}
      <Div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
          favorite.isActive
            ? "bg-primary/15 text-primary"
            : "bg-muted group-hover:bg-primary/10",
        )}
      >
        <Icon className="h-5 w-5" />
      </Div>

      {/* Info */}
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2">
          <Span
            className={cn(
              "font-medium text-sm truncate",
              favorite.isActive && "text-primary",
            )}
          >
            {displayName}
          </Span>
          {favorite.isActive && (
            <Badge variant="default" className="text-[9px] h-4 px-1.5 shrink-0">
              {t("app.chat.selector.active")}
            </Badge>
          )}
          {isModelOnly && !favorite.isActive && (
            <Badge
              variant="outline"
              className="text-[9px] h-4 px-1.5 shrink-0 opacity-60"
            >
              {t("app.chat.selector.modelOnly")}
            </Badge>
          )}
        </Div>
        {resolvedModel && (
          <Div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
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

      {/* Actions */}
      <Div className="flex items-center gap-1 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
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
            className="h-8 w-8 text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            title={t("app.chat.selector.switchTo")}
          >
            <Zap className="h-4 w-4" />
          </Button>
        )}
        {favorite.isActive && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title={t("app.chat.selector.settings")}
          >
            <Settings className="h-4 w-4" />
          </Button>
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

  // Empty state
  if (favorites.length === 0) {
    return (
      <Div className={cn("flex flex-col gap-2", className)}>
        <Div className="flex flex-col items-center justify-center py-10 text-center">
          <Div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Zap className="h-7 w-7 text-primary" />
          </Div>
          <Span className="text-base font-medium mb-1">
            {t("app.chat.selector.noSetupsTitle")}
          </Span>
          <Span className="text-sm text-muted-foreground mb-5 max-w-[280px]">
            {t("app.chat.selector.noSetupsDescription")}
          </Span>
          <Button
            type="button"
            variant="default"
            size="default"
            onClick={onAddClick}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("app.chat.selector.getStarted")}
          </Button>
        </Div>
      </Div>
    );
  }

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
      <Div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
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
