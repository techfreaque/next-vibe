"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronUp } from "next-vibe-ui/ui/icons/ChevronUp";
import { Filter } from "next-vibe-ui/ui/icons/Filter";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Label } from "next-vibe-ui/ui/label";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";

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
  CONTENT_DISPLAY,
  type ContentLevel,
  INTELLIGENCE_DISPLAY,
  type IntelligenceLevel,
  PRICE_DISPLAY,
  type PriceLevel,
} from "@/app/api/[locale]/agent/chat/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { FavoriteItem } from "./favorites-bar";
import { findBestModel, getCompatibleModels } from "./types";

interface QuickSettingsPanelProps {
  favorite: FavoriteItem;
  onSave: (settings: FavoriteItem["modelSettings"], saveMode: SaveMode) => void;
  onCancel: () => void;
  onDelete?: () => void;
  locale: CountryLanguage;
}

type SaveMode = "temporary" | "update" | "new";

/**
 * Compact filter option pill with better visual feedback
 */
function FilterPill<T extends string>({
  label,
  icon,
  selected,
  onClick,
  locale,
}: {
  value: T;
  label: string;
  icon: IconKey;
  selected: boolean;
  onClick: () => void;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const Icon = getIconComponent(icon);

  return (
    <Button
      type="button"
      variant={selected ? "default" : "outline"}
      onClick={onClick}
      size="sm"
      className={cn(
        "flex items-center gap-1.5 h-9 px-3 transition-all",
        !selected && "hover:border-primary/50 hover:bg-primary/5",
      )}
    >
      <Icon className={cn("h-4 w-4", selected && "text-primary-foreground")} />
      <Span className="text-xs font-medium">{t(label)}</Span>
    </Button>
  );
}

/**
 * Model card in the list - improved compact design
 */
function ModelCard({
  model,
  isBest,
  selected,
  onClick,
  locale,
  dimmed = false,
}: {
  model: ModelOption;
  isBest: boolean;
  selected: boolean;
  onClick: () => void;
  locale: CountryLanguage;
  dimmed?: boolean;
}): JSX.Element {
  const { t } = simpleT(locale);
  const Icon = getIconComponent(model.icon);

  return (
    <Div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all",
        "hover:bg-muted/50 hover:border-primary/30",
        selected && "bg-primary/10 border-primary/40 shadow-sm",
        dimmed && !selected && "opacity-40 hover:opacity-70",
      )}
    >
      <Div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
          selected ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <Icon className="h-4 w-4" />
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-1.5">
          <Span
            className={cn(
              "text-sm font-medium truncate",
              selected && "text-primary",
            )}
          >
            {model.name}
          </Span>
          {isBest && (
            <Badge variant="default" className="text-[9px] h-4 px-1.5 shrink-0">
              {t("app.chat.selector.best")}
            </Badge>
          )}
        </Div>
        <Span className="text-[11px] text-muted-foreground">
          {modelProviders[model.provider]?.name ?? model.provider}
        </Span>
      </Div>

      <Div className="flex items-center gap-1.5 shrink-0">
        <Badge
          variant={selected ? "outline" : "secondary"}
          className="text-[10px] h-5"
        >
          {model.creditCost === 0
            ? t("app.chat.selector.free")
            : model.creditCost === 1
              ? t("app.chat.selector.creditsSingle")
              : t("app.chat.selector.creditsExact", { cost: model.creditCost })}
        </Badge>
        {selected && <Check className="h-4 w-4 text-primary" />}
      </Div>
    </Div>
  );
}

/**
 * Quick settings panel for adjusting favorite settings
 */
export function QuickSettingsPanel({
  favorite,
  onSave,
  onCancel,
  onDelete,
  locale,
}: QuickSettingsPanelProps): JSX.Element {
  const { t } = simpleT(locale);

  const character = useMemo(
    () => (favorite.personaId ? getPersonaById(favorite.personaId) : null),
    [favorite.personaId],
  );

  const isModelOnly = !character;

  // Local state for editing
  const [intelligence, setIntelligence] = useState<IntelligenceLevel | "any">(
    favorite.modelSettings.filters.intelligence,
  );
  const [maxPrice, setMaxPrice] = useState<PriceLevel | "any">(
    favorite.modelSettings.filters.maxPrice,
  );
  const [content, setContent] = useState<ContentLevel | "any">(
    favorite.modelSettings.filters.content,
  );
  const [mode, setMode] = useState<"auto" | "manual">(
    favorite.modelSettings.mode,
  );
  const [manualModelId, setManualModelId] = useState<ModelId | undefined>(
    favorite.modelSettings.manualModelId as ModelId | undefined,
  );
  const [showAllModels, setShowAllModels] = useState(false);
  const [showUnfilteredModels, setShowUnfilteredModels] = useState(false);

  // Get all models and filter/sort them
  const allModels = useMemo(() => Object.values(modelOptions), []);

  const compatibleModels = useMemo(() => {
    if (!character) {
      return [];
    }
    return getCompatibleModels(allModels, character);
  }, [allModels, character]);

  const bestModel = useMemo(() => {
    if (!character) {
      return null;
    }
    return findBestModel(allModels, character, {
      intelligence,
      maxPrice,
      minContent: content,
    });
  }, [allModels, character, intelligence, maxPrice, content]);

  const filteredModels = useMemo(() => {
    return compatibleModels.filter((m) => {
      // Filter by intelligence (skip if "any")
      if (intelligence !== "any") {
        const intelligenceOrder: IntelligenceLevel[] = [
          "quick",
          "smart",
          "brilliant",
        ];
        const modelIndex = intelligenceOrder.indexOf(m.intelligence);
        const targetIndex = intelligenceOrder.indexOf(intelligence);
        if (modelIndex < targetIndex) {
          return false;
        }
      }

      // Filter by content (skip if "any")
      if (content !== "any") {
        const contentOrder: ContentLevel[] = [
          "mainstream",
          "open",
          "uncensored",
        ];
        const modelContentIndex = contentOrder.indexOf(m.content);
        const targetContentIndex = contentOrder.indexOf(content);
        if (modelContentIndex < targetContentIndex) {
          return false;
        }
      }

      // Filter by price (skip if "any")
      if (maxPrice !== "any") {
        const priceOrder: PriceLevel[] = ["cheap", "standard", "premium"];
        const modelPrice =
          m.creditCost <= 3
            ? "cheap"
            : m.creditCost <= 9
              ? "standard"
              : "premium";
        const modelPriceIndex = priceOrder.indexOf(modelPrice);
        const maxPriceIndex = priceOrder.indexOf(maxPrice);
        if (modelPriceIndex > maxPriceIndex) {
          return false;
        }
      }

      return true;
    });
  }, [compatibleModels, intelligence, maxPrice, content]);

  // Models to display in manual mode - either filtered or all compatible
  const modelsToShow = showUnfilteredModels ? compatibleModels : filteredModels;
  const displayModels = showAllModels ? modelsToShow : modelsToShow.slice(0, 3);

  // Check if current selection is valid for saving
  const canSave = useMemo(() => {
    if (mode === "auto") {
      // In auto mode, need at least one matching model
      return filteredModels.length > 0;
    }
    // In manual mode, need a selected model
    return !!manualModelId;
  }, [mode, filteredModels.length, manualModelId]);

  const handleSave = useCallback(() => {
    onSave(
      {
        mode,
        filters: { intelligence, maxPrice, content },
        manualModelId: mode === "manual" ? manualModelId : undefined,
      },
      "update",
    );
  }, [onSave, mode, intelligence, maxPrice, content, manualModelId]);

  const handleApplyOnce = useCallback(() => {
    onSave(
      {
        mode,
        filters: { intelligence, maxPrice, content },
        manualModelId: mode === "manual" ? manualModelId : undefined,
      },
      "temporary",
    );
  }, [onSave, mode, intelligence, maxPrice, content, manualModelId]);

  const resolvedModel =
    mode === "manual" && manualModelId
      ? (allModels.find((m) => m.id === manualModelId) ?? bestModel)
      : bestModel;

  // Get display info - works for both persona and model-only favorites
  const DisplayIcon = character
    ? getIconComponent(character.icon)
    : resolvedModel
      ? getIconComponent(resolvedModel.icon)
      : getIconComponent("bot");
  const displayName = favorite.customName
    ? favorite.customName
    : character
      ? t(character.name)
      : resolvedModel?.name ?? t("app.chat.selector.modelOnly");

  return (
    <Div className="flex flex-col max-h-[70vh] overflow-hidden">
      {/* Header - sticky */}
      <Div className="flex items-center gap-3 p-4 border-b bg-card shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onCancel}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Div className="flex items-center gap-2 flex-1 min-w-0">
          <Div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <DisplayIcon className="h-5 w-5" />
          </Div>
          <Div className="flex flex-col min-w-0">
            <Span className="font-medium truncate">{displayName}</Span>
            <Span className="text-xs text-muted-foreground">
              {isModelOnly
                ? t("app.chat.selector.editModelSettings")
                : t("app.chat.selector.editSettings")}
            </Span>
          </Div>
        </Div>

        {onDelete && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
            onClick={onDelete}
            title={t("app.chat.selector.delete")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </Div>

      {/* Scrollable content */}
      <Div className="flex-1 overflow-y-auto p-4">
        <Div className="flex flex-col gap-5">
          {/* Current selection preview - improved visual design */}
          {resolvedModel && (
            <Div className="flex items-center gap-3 p-3 bg-linear-to-r from-primary/10 to-primary/5 border border-primary/25 rounded-xl">
              <Div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                {(() => {
                  const ResolvedIcon = getIconComponent(resolvedModel.icon);
                  return <ResolvedIcon className="h-5 w-5 text-primary" />;
                })()}
              </Div>
              <Div className="flex-1 min-w-0">
                <Span className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
                  {mode === "auto"
                    ? t("app.chat.selector.autoSelectedModel")
                    : t("app.chat.selector.manualSelectedModel")}
                </Span>
                <Div className="flex items-center gap-2">
                  <Span className="text-sm font-semibold text-primary">
                    {resolvedModel.name}
                  </Span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-5 shrink-0"
                  >
                    {resolvedModel.creditCost === 0
                      ? t("app.chat.selector.free")
                      : resolvedModel.creditCost === 1
                        ? t("app.chat.selector.creditsSingle")
                        : t("app.chat.selector.creditsExact", {
                            cost: resolvedModel.creditCost,
                          })}
                  </Badge>
                </Div>
              </Div>
            </Div>
          )}

          {/* Intelligence filter */}
          <Div className="flex flex-col gap-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("app.chat.selector.intelligence")}
            </Label>
            <Div className="flex flex-wrap gap-1.5">
              {INTELLIGENCE_DISPLAY.map((tier) => (
                <FilterPill
                  key={tier.value}
                  value={tier.value}
                  label={tier.label}
                  icon={tier.icon}
                  selected={intelligence === tier.value}
                  onClick={() => setIntelligence(tier.value)}
                  locale={locale}
                />
              ))}
            </Div>
          </Div>

          {/* Content filter */}
          <Div className="flex flex-col gap-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("app.chat.selector.contentFilter")}
            </Label>
            <Div className="flex flex-wrap gap-1.5">
              {CONTENT_DISPLAY.map((tier) => (
                <FilterPill
                  key={tier.value}
                  value={tier.value}
                  label={tier.label}
                  icon={tier.icon}
                  selected={content === tier.value}
                  onClick={() => setContent(tier.value)}
                  locale={locale}
                />
              ))}
            </Div>
          </Div>

          {/* Price filter */}
          <Div className="flex flex-col gap-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("app.chat.selector.maxPrice")}
            </Label>
            <Div className="flex flex-wrap gap-1.5">
              {PRICE_DISPLAY.map((tier) => (
                <FilterPill
                  key={tier.value}
                  value={tier.value}
                  label={tier.label}
                  icon={tier.icon}
                  selected={maxPrice === tier.value}
                  onClick={() => setMaxPrice(tier.value)}
                  locale={locale}
                />
              ))}
            </Div>
          </Div>

          <Separator />

          {/* Model selection toggle */}
          <Div className="flex flex-col gap-3">
            <Div className="flex flex-col gap-1">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("app.chat.selector.modelSelection")}
              </Label>
              <Span className="text-xs text-muted-foreground/70">
                {mode === "auto"
                  ? t("app.chat.selector.autoModeDescription")
                  : t("app.chat.selector.manualModeDescription")}
              </Span>
            </Div>
            <Div className="flex items-center gap-2">
              <Button
                type="button"
                variant={mode === "auto" ? "default" : "outline"}
                size="sm"
                className="flex-1 h-9"
                onClick={() => setMode("auto")}
              >
                {t("app.chat.selector.autoMode")}
              </Button>
              <Button
                type="button"
                variant={mode === "manual" ? "default" : "outline"}
                size="sm"
                className="flex-1 h-9"
                onClick={() => setMode("manual")}
              >
                {t("app.chat.selector.manualMode")}
              </Button>
            </Div>

            {/* Model list (visible in manual mode or when expanded) */}
            {mode === "manual" && (
              <Div className="flex flex-col gap-2">
                {/* Toggle to show all models vs filtered */}
                <Div className="flex items-center justify-between">
                  <Span className="text-xs text-muted-foreground">
                    {showUnfilteredModels
                      ? t("app.chat.selector.allModelsCount", {
                          count: compatibleModels.length,
                        })
                      : t("app.chat.selector.filteredModelsCount", {
                          count: filteredModels.length,
                        })}
                  </Span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => {
                      setShowUnfilteredModels(!showUnfilteredModels);
                      setShowAllModels(false);
                    }}
                  >
                    <Filter className="h-3 w-3" />
                    {showUnfilteredModels
                      ? t("app.chat.selector.showFiltered")
                      : t("app.chat.selector.showAllModels")}
                  </Button>
                </Div>

                {displayModels.length > 0 ? (
                  <>
                    {displayModels.map((model) => {
                      const isOutsideFilter =
                        showUnfilteredModels &&
                        !filteredModels.some((m) => m.id === model.id);
                      return (
                        <ModelCard
                          key={model.id}
                          model={model}
                          isBest={model.id === bestModel?.id}
                          selected={manualModelId === model.id}
                          onClick={() => setManualModelId(model.id)}
                          locale={locale}
                          dimmed={isOutsideFilter}
                        />
                      );
                    })}
                    {modelsToShow.length > 3 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full h-8 text-xs"
                        onClick={() => setShowAllModels(!showAllModels)}
                      >
                        {showAllModels ? (
                          <>
                            <ChevronUp className="h-3 w-3 mr-1" />
                            {t("app.chat.selector.showLess")}
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 mr-1" />
                            {t("app.chat.selector.showMore", {
                              count: modelsToShow.length - 3,
                            })}
                          </>
                        )}
                      </Button>
                    )}
                  </>
                ) : (
                  <Div className="p-4 text-center text-sm text-muted-foreground border rounded-lg">
                    {t("app.chat.selector.noMatchingModels")}
                  </Div>
                )}
              </Div>
            )}

            {/* Warning when no models match in auto mode */}
            {mode === "auto" && filteredModels.length === 0 && (
              <Div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <Span className="text-sm">
                  {t("app.chat.selector.noModelsWarning")}
                </Span>
              </Div>
            )}
          </Div>
        </Div>
      </Div>

      {/* Footer actions - sticky */}
      <Div className="flex items-center gap-2 p-4 border-t bg-card shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleApplyOnce}
          className="flex-1 h-10"
          disabled={!canSave}
        >
          {t("app.chat.selector.applyOnce")}
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={!canSave}
          className="flex-1 h-10"
        >
          {t("app.chat.selector.saveChanges")}
        </Button>
      </Div>
    </Div>
  );
}
