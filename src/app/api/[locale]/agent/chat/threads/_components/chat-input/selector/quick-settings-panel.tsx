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
import { Edit2 } from "next-vibe-ui/ui/icons/Edit2";
import { Filter } from "next-vibe-ui/ui/icons/Filter";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Label } from "next-vibe-ui/ui/label";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";

import type { Character } from "@/app/api/[locale]/agent/chat/characters/definition";
import { CharactersRepositoryClient } from "@/app/api/[locale]/agent/chat/characters/repository-client";
import type { FavoriteItem } from "@/app/api/[locale]/agent/chat/favorites/components/favorites-bar";
import {
  CONTENT_DISPLAY,
  INTELLIGENCE_DISPLAY,
  PRICE_DISPLAY,
} from "@/app/api/[locale]/agent/chat/favorites/display-configs";
import {
  IntelligenceLevelFilter,
  ModelSelectionType,
} from "@/app/api/[locale]/agent/chat/favorites/enum";
import {
  type ModelId,
  type ModelOption,
  modelOptions,
  modelProviders,
} from "@/app/api/[locale]/agent/models/models";
import { Icon, type IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

interface QuickSettingsPanelProps {
  favorite: FavoriteItem;
  onSave: (settings: FavoriteItem["modelSelection"], saveMode: SaveMode) => void;
  onCancel: () => void;
  onDelete?: () => void;
  onEditCharacter?: (characterData: Character) => void;
  onSwitchCharacterView?: () => void;
  onCharacterSwitch?: (characterId: string, keepSettings: boolean) => void;
  /** Characters fetched from API - used for editing custom characters */
  characters?: Record<string, Character>;
  isAuthenticated?: boolean;
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
  label: TranslationKey;
  icon: IconKey;
  selected: boolean;
  onClick: () => void;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);

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
      <Icon icon={icon} className={cn("h-4 w-4", selected && "text-primary-foreground")} />
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
        <Icon icon={model.icon} className="h-4 w-4" />
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-1.5">
          <Span className={cn("text-sm font-medium truncate", selected && "text-primary")}>
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
        <Badge variant={selected ? "outline" : "secondary"} className="text-[10px] h-5">
          {CharactersRepositoryClient.formatCreditCost(model.creditCost, t)}
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
  onEditCharacter,
  onSwitchCharacterView,
  characters,
  isAuthenticated,
  locale,
}: QuickSettingsPanelProps): JSX.Element {
  const { t } = simpleT(locale);

  const character = useMemo(() => {
    if (!favorite.characterId || !characters) {
      return null;
    }
    // Get character from API data
    return CharactersRepositoryClient.getCharacterById(characters, favorite.characterId);
  }, [favorite.characterId, characters]);

  const isModelOnly = !character;

  // Extract filters from modelSelection
  const initialFilters = CharactersRepositoryClient.extractFiltersFromModelSelection(
    favorite.modelSelection,
  );

  // Local state for editing
  const [intelligenceRange, setIntelligenceRange] = useState(initialFilters.intelligenceRange);
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange);
  const [contentRange, setContentRange] = useState(initialFilters.contentRange);
  const [mode, setMode] = useState(favorite.modelSelection.selectionType);
  const [manualModelId, setManualModelId] = useState<ModelId | undefined>(
    CharactersRepositoryClient.getManualModelId(favorite.modelSelection),
  );
  const [showAllModels, setShowAllModels] = useState(false);
  const [showUnfilteredModels, setShowUnfilteredModels] = useState(false);

  // Get all models and filter/sort them
  const allModels = useMemo(() => Object.values(modelOptions), []);

  const compatibleModels = useMemo(() => {
    if (!character) {
      return [];
    }
    return CharactersRepositoryClient.getCompatibleModels(allModels, character);
  }, [allModels, character]);

  const bestModel = useMemo(() => {
    if (!character) {
      return null;
    }
    // Use priority logic: manual > preferredModel > auto
    const selectedModelId = CharactersRepositoryClient.selectModelForCharacter(
      allModels,
      character,
      {
        mode: mode === ModelSelectionType.MANUAL ? "manual" : "auto",
        manualModelId,
        filters: {
          intelligenceRange,
          priceRange,
          contentRange,
        },
      },
    );
    return CharactersRepositoryClient.findModelById(allModels, selectedModelId);
  }, [allModels, character, mode, manualModelId, intelligenceRange, priceRange, contentRange]);

  const filteredModels = useMemo(() => {
    return CharactersRepositoryClient.applyModelFilters(compatibleModels, {
      intelligenceRange,
      priceRange,
      contentRange,
    });
  }, [compatibleModels, intelligenceRange, priceRange, contentRange]);

  // Models to display in manual mode - either filtered or all compatible
  const modelsToShow = showUnfilteredModels ? compatibleModels : filteredModels;
  const displayModels = showAllModels ? modelsToShow : modelsToShow.slice(0, 3);

  // Check if current selection is valid for saving
  const canSave = useMemo(() => {
    if (mode === ModelSelectionType.FILTERS) {
      // In filters mode, need at least one matching model
      return filteredModels.length > 0;
    }
    // In manual mode, need a selected model
    return !!manualModelId;
  }, [mode, filteredModels.length, manualModelId]);

  const handleSaveWithMode = useCallback(
    (saveMode: SaveMode) => {
      const modelSelection: FavoriteItem["modelSelection"] =
        mode === ModelSelectionType.MANUAL && manualModelId
          ? {
              selectionType: ModelSelectionType.MANUAL,
              manualModelId,
            }
          : {
              selectionType: ModelSelectionType.FILTERS,
              intelligenceRange,
              priceRange,
              contentRange,
              preferredStrengths: null,
              ignoredWeaknesses: null,
            };
      onSave(modelSelection, saveMode);
    },
    [onSave, mode, manualModelId, intelligenceRange, priceRange, contentRange],
  );

  const handleSave = useCallback(() => {
    handleSaveWithMode("update");
  }, [handleSaveWithMode]);

  const handleApplyOnce = useCallback(() => {
    handleSaveWithMode("temporary");
  }, [handleSaveWithMode]);

  const resolvedModel =
    mode === ModelSelectionType.MANUAL && manualModelId
      ? (allModels.find((m) => m.id === manualModelId) ?? bestModel)
      : bestModel;

  // Get display info - consolidated logic
  const displayIcon = CharactersRepositoryClient.getDisplayIcon(favorite, character, resolvedModel);
  const displayName = CharactersRepositoryClient.getDisplayName(
    favorite,
    character,
    resolvedModel,
    t,
  );

  return (
    <Div className="flex flex-col max-h-[70vh] overflow-hidden">
      {/* Header with back and delete */}
      <Div className="flex items-center justify-between p-3 border-b shrink-0">
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {onDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-destructive hover:bg-destructive/10"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            {t("app.chat.selector.deleteSetup")}
          </Button>
        )}
      </Div>

      {/* Scrollable content */}
      <Div className="flex-1 overflow-y-auto p-4">
        <Div className="flex flex-col gap-5">
          {/* Character info card - first thing in content */}
          <Div className="flex flex-col gap-3 p-4 border-2 rounded-xl bg-card">
            <Div className="flex items-center gap-3">
              <Div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon icon={displayIcon} className="h-6 w-6 text-primary" />
              </Div>
              <Div className="flex-1 min-w-0">
                <Span className="font-semibold text-lg block">{displayName}</Span>
                <Span className="text-xs text-muted-foreground">
                  {isModelOnly
                    ? t("app.chat.selector.modelOnly")
                    : t("app.chat.selector.characterSetup")}
                </Span>
              </Div>
            </Div>

            {/* Character actions - only switch and edit */}
            {!isModelOnly && (onSwitchCharacterView || onEditCharacter) && (
              <Div className="flex gap-2 pt-3 border-t">
                {onSwitchCharacterView && characters && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 h-9"
                    onClick={onSwitchCharacterView}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    {t("app.chat.selector.switchCharacter")}
                  </Button>
                )}

                {isAuthenticated && onEditCharacter && character && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 h-9"
                    onClick={() => onEditCharacter(character)}
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                    {t("app.chat.selector.editCharacter")}
                  </Button>
                )}
              </Div>
            )}
          </Div>
          {/* Current selection preview - improved visual design */}
          {resolvedModel && (
            <Div className="flex items-center gap-3 p-3 bg-linear-to-r from-primary/10 to-primary/5 border border-primary/25 rounded-xl">
              <Div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Icon icon={resolvedModel.icon} className="h-5 w-5 text-primary" />
              </Div>
              <Div className="flex-1 min-w-0">
                <Span className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
                  {mode === ModelSelectionType.FILTERS
                    ? t("app.chat.selector.autoSelectedModel")
                    : t("app.chat.selector.manualSelectedModel")}
                </Span>
                <Div className="flex items-center gap-2">
                  <Span className="text-sm font-semibold text-primary">{resolvedModel.name}</Span>
                  <Badge variant="secondary" className="text-[10px] h-5 shrink-0">
                    {CharactersRepositoryClient.formatCreditCost(resolvedModel.creditCost, t)}
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
                  selected={intelligenceRange?.min === tier.value}
                  onClick={() => setIntelligenceRange({ min: tier.value })}
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
                  selected={contentRange?.min === tier.value}
                  onClick={() => setContentRange({ min: tier.value })}
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
                  selected={priceRange?.max === tier.value}
                  onClick={() => setPriceRange({ max: tier.value })}
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
                {mode === ModelSelectionType.FILTERS
                  ? t("app.chat.selector.autoModeDescription")
                  : t("app.chat.selector.manualModeDescription")}
              </Span>
            </Div>
            <Div className="flex items-center gap-2">
              <Button
                type="button"
                variant={mode === ModelSelectionType.FILTERS ? "default" : "outline"}
                size="sm"
                className="flex-1 h-9"
                onClick={() => setMode(ModelSelectionType.FILTERS)}
              >
                {t("app.chat.selector.autoMode")}
              </Button>
              <Button
                type="button"
                variant={mode === ModelSelectionType.MANUAL ? "default" : "outline"}
                size="sm"
                className="flex-1 h-9"
                onClick={() => setMode(ModelSelectionType.MANUAL)}
              >
                {t("app.chat.selector.manualMode")}
              </Button>
            </Div>

            {/* Model list (visible in manual mode or when expanded) */}
            {mode === ModelSelectionType.MANUAL && (
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
                        showUnfilteredModels && !filteredModels.some((m) => m.id === model.id);
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

            {/* Warning when no models match in filters mode */}
            {mode === ModelSelectionType.FILTERS && filteredModels.length === 0 && (
              <Div className="flex flex-col gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                <Div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <Span className="text-sm font-medium">
                    {t("app.chat.selector.noModelsWarning")}
                  </Span>
                </Div>
                {!isModelOnly && character?.requirements && (
                  <Div className="flex flex-col gap-1 text-xs pl-6">
                    {(() => {
                      if (!character) {
                        return null;
                      }
                      const violations: string[] = [];
                      const intelligenceOrder = [
                        IntelligenceLevelFilter.ANY,
                        IntelligenceLevelFilter.QUICK,
                        IntelligenceLevelFilter.SMART,
                        IntelligenceLevelFilter.BRILLIANT,
                      ];
                      const contentOrder = [
                        ContentLevelFilter.ANY,
                        ContentLevelFilter.MAINSTREAM,
                        ContentLevelFilter.OPEN,
                        ContentLevelFilter.UNCENSORED,
                      ];

                      // Check intelligence requirements
                      if (
                        character.requirements?.minIntelligence &&
                        intelligenceOrder.indexOf(intelligence) <
                          intelligenceOrder.indexOf(character.requirements.minIntelligence)
                      ) {
                        violations.push(
                          `${t("app.chat.selector.intelligence")}: ${t("app.chat.selector.requirements.tooLow")} (${t("app.chat.selector.requirements.min")}: ${t(character.requirements.minIntelligence)})`,
                        );
                      }

                      if (
                        character.requirements?.maxIntelligence &&
                        intelligenceOrder.indexOf(intelligence) >
                          intelligenceOrder.indexOf(character.requirements.maxIntelligence)
                      ) {
                        violations.push(
                          `${t("app.chat.selector.intelligence")}: ${t("app.chat.selector.requirements.tooHigh")} (${t("app.chat.selector.requirements.max")}: ${t(character.requirements.maxIntelligence)})`,
                        );
                      }

                      // Check content requirements
                      if (
                        character.requirements?.minContent &&
                        contentOrder.indexOf(content) <
                          contentOrder.indexOf(character.requirements.minContent)
                      ) {
                        violations.push(
                          `${t("app.chat.selector.content")}: ${t("app.chat.selector.requirements.tooLow")} (${t("app.chat.selector.requirements.min")}: ${t(character.requirements.minContent)})`,
                        );
                      }

                      if (
                        character.requirements?.maxContent &&
                        contentOrder.indexOf(content) >
                          contentOrder.indexOf(character.requirements.maxContent)
                      ) {
                        violations.push(
                          `${t("app.chat.selector.content")}: ${t("app.chat.selector.requirements.tooHigh")} (${t("app.chat.selector.requirements.max")}: ${t(character.requirements.maxContent)})`,
                        );
                      }

                      return violations.length > 0 ? (
                        <>
                          <Span className="font-medium">
                            {t("app.chat.selector.requirements.characterConflict")}:
                          </Span>
                          {violations.map((v, i) => (
                            <Span key={i}>• {v}</Span>
                          ))}
                        </>
                      ) : null;
                    })()}
                  </Div>
                )}
              </Div>
            )}
          </Div>
        </Div>
      </Div>

      {/* Footer actions - sticky */}
      <Div className="flex gap-3 p-4 border-t bg-card shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={handleApplyOnce}
          className="flex-1 h-10"
          disabled={!canSave}
        >
          {t("app.chat.selector.useOnce")}
        </Button>
        <Button type="button" onClick={handleSave} disabled={!canSave} className="flex-1 h-10">
          {t("app.chat.selector.saveAsDefault")}
        </Button>
      </Div>
    </Div>
  );
}
