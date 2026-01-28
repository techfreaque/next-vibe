"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronUp } from "next-vibe-ui/ui/icons/ChevronUp";
import { Edit2 } from "next-vibe-ui/ui/icons/Edit2";
import { Filter } from "next-vibe-ui/ui/icons/Filter";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Label } from "next-vibe-ui/ui/label";
import { RangeSlider } from "next-vibe-ui/ui/range-slider";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useCharacter } from "@/app/api/[locale]/agent/chat/characters/[id]/hooks";
import { NO_CHARACTER_ID } from "@/app/api/[locale]/agent/chat/characters/config";
import type { CharacterListItem } from "@/app/api/[locale]/agent/chat/characters/definition";
import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/characters/enum";
import {
  CONTENT_DISPLAY,
  INTELLIGENCE_DISPLAY,
  PRICE_DISPLAY,
  SPEED_DISPLAY,
} from "@/app/api/[locale]/agent/chat/characters/enum";
import { CharactersRepositoryClient } from "@/app/api/[locale]/agent/chat/characters/repository-client";
import type { FavoriteGetResponseOutput } from "@/app/api/[locale]/agent/chat/favorites/[id]/definition";
import {
  getModelById,
  type ModelId,
  type ModelOption,
  modelOptions,
  modelProviders,
} from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ModelCard } from "./model-card";

interface QuickSettingsPanelProps {
  favorite: FavoriteGetResponseOutput;
  onSave: (
    settings: FavoriteGetResponseOutput["modelSelection"],
    saveMode: SaveMode,
  ) => void;
  onCancel: () => void;
  onDelete: (() => void) | undefined;
  onEditCharacter: (characterId: string) => void;
  onCharacterSwitch: (characterId: string, keepSettings: boolean) => void;
  /** Characters fetched from API - compact cards for display */
  characters: Record<string, CharacterListItem>;
  isAuthenticated: boolean;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

type SaveMode = "temporary" | "update" | "new";

export function QuickSettingsPanel({
  favorite,
  onSave,
  onCancel,
  onDelete,
  onEditCharacter,
  characters,
  isAuthenticated,
  locale,
  logger,
}: QuickSettingsPanelProps): JSX.Element {
  const { t } = simpleT(locale);

  const character = useMemo(() => {
    if (!favorite.characterId || !characters) {
      return null;
    }
    return characters[favorite.characterId] ?? null;
  }, [favorite.characterId, characters]);

  // Fetch full character details for CHARACTER_BASED mode
  const characterEndpoint = useCharacter(favorite.characterId ?? "", logger);
  const fullCharacter = characterEndpoint.read?.data;
  const isLoadingCharacter = characterEndpoint.read?.isLoading;

  const isModelOnly = favorite.characterId === NO_CHARACTER_ID;

  type FiltersModelSelection = Extract<
    FavoriteGetResponseOutput["modelSelection"],
    { selectionType: typeof ModelSelectionType.FILTERS }
  >;
  type CharacterBasedSelection = Extract<
    FavoriteGetResponseOutput["modelSelection"],
    { selectionType: typeof ModelSelectionType.CHARACTER_BASED }
  >;

  // Extract initial state from favorite's model selection
  const initialState = ((): {
    intelligenceRange: FiltersModelSelection["intelligenceRange"];
    priceRange: FiltersModelSelection["priceRange"];
    contentRange: FiltersModelSelection["contentRange"];
    speedRange: FiltersModelSelection["speedRange"];
    preferredStrengths: FiltersModelSelection["preferredStrengths"];
    ignoredWeaknesses: FiltersModelSelection["ignoredWeaknesses"];
  } => {
    const sel = favorite.modelSelection;
    if (sel.selectionType === ModelSelectionType.FILTERS) {
      const filtersSel = sel as FiltersModelSelection;
      return {
        intelligenceRange: filtersSel.intelligenceRange,
        priceRange: filtersSel.priceRange,
        contentRange: filtersSel.contentRange,
        speedRange: filtersSel.speedRange,
        preferredStrengths: filtersSel.preferredStrengths,
        ignoredWeaknesses: filtersSel.ignoredWeaknesses,
      };
    }
    if (sel.selectionType === ModelSelectionType.CHARACTER_BASED) {
      // CHARACTER_BASED has soft preferences but no ranges
      const charSel = sel as CharacterBasedSelection;
      return {
        intelligenceRange: undefined,
        priceRange: undefined,
        contentRange: undefined,
        speedRange: undefined,
        preferredStrengths: charSel.preferredStrengths,
        ignoredWeaknesses: charSel.ignoredWeaknesses,
      };
    }
    return {
      intelligenceRange: undefined,
      priceRange: undefined,
      contentRange: undefined,
      speedRange: undefined,
      preferredStrengths: null,
      ignoredWeaknesses: null,
    };
  })();

  // Convert ranges to indices for range slider
  // Moved outside component to avoid ESLint warning
  const getInitialIndices = useCallback(
    <T extends string>(
      range: { min?: T; max?: T } | undefined,
      options: readonly { value: T }[],
    ): { min: number; max: number } => {
      if (!range) {
        return { min: 0, max: options.length - 1 };
      }
      const minIndex = range.min
        ? options.findIndex((o) => o.value === range.min)
        : 0;
      const maxIndex = range.max
        ? options.findIndex((o) => o.value === range.max)
        : options.length - 1;
      return {
        min: minIndex === -1 ? 0 : minIndex,
        max: maxIndex === -1 ? options.length - 1 : maxIndex,
      };
    },
    [],
  );

  const [intelligenceIndices, setIntelligenceIndices] = useState(
    getInitialIndices(initialState.intelligenceRange, INTELLIGENCE_DISPLAY),
  );
  const [contentIndices, setContentIndices] = useState(
    getInitialIndices(initialState.contentRange, CONTENT_DISPLAY),
  );
  const [speedIndices, setSpeedIndices] = useState(
    getInitialIndices(initialState.speedRange, SPEED_DISPLAY),
  );
  const [priceIndices, setPriceIndices] = useState(
    getInitialIndices(initialState.priceRange, PRICE_DISPLAY),
  );
  // For model-only favorites, never default to CHARACTER_BASED mode
  const initialMode = useMemo(() => {
    if (
      isModelOnly &&
      favorite.modelSelection.selectionType ===
        ModelSelectionType.CHARACTER_BASED
    ) {
      return ModelSelectionType.FILTERS;
    }
    return favorite.modelSelection.selectionType;
  }, [favorite.modelSelection.selectionType, isModelOnly]);

  const [mode, setMode] = useState(initialMode);
  const [manualModelId, setManualModelId] = useState<ModelId | undefined>(
    favorite.modelSelection.selectionType === ModelSelectionType.MANUAL
      ? favorite.modelSelection.manualModelId
      : undefined,
  );
  const [previousMode, setPreviousMode] = useState(initialMode);

  // Load character ranges when switching to CHARACTER_BASED mode
  // OR when switching FROM CHARACTER_BASED to FILTERS mode
  useEffect(() => {
    if (
      mode === ModelSelectionType.CHARACTER_BASED &&
      fullCharacter?.modelSelection
    ) {
      const charModelSel = fullCharacter.modelSelection;
      if (charModelSel.selectionType === ModelSelectionType.FILTERS) {
        setIntelligenceIndices(
          getInitialIndices(
            charModelSel.intelligenceRange,
            INTELLIGENCE_DISPLAY,
          ),
        );
        setContentIndices(
          getInitialIndices(charModelSel.contentRange, CONTENT_DISPLAY),
        );
        setSpeedIndices(
          getInitialIndices(charModelSel.speedRange, SPEED_DISPLAY),
        );
        setPriceIndices(
          getInitialIndices(charModelSel.priceRange, PRICE_DISPLAY),
        );
      }
    } else if (
      mode === ModelSelectionType.FILTERS &&
      previousMode === ModelSelectionType.CHARACTER_BASED &&
      fullCharacter?.modelSelection
    ) {
      // Switching from CHARACTER_BASED to FILTERS - keep character's values
      const charModelSel = fullCharacter.modelSelection;
      if (charModelSel.selectionType === ModelSelectionType.FILTERS) {
        setIntelligenceIndices(
          getInitialIndices(
            charModelSel.intelligenceRange,
            INTELLIGENCE_DISPLAY,
          ),
        );
        setContentIndices(
          getInitialIndices(charModelSel.contentRange, CONTENT_DISPLAY),
        );
        setSpeedIndices(
          getInitialIndices(charModelSel.speedRange, SPEED_DISPLAY),
        );
        setPriceIndices(
          getInitialIndices(charModelSel.priceRange, PRICE_DISPLAY),
        );
      }
    }

    // Update previous mode
    setPreviousMode(mode);
  }, [mode, fullCharacter, getInitialIndices, previousMode]);

  // Convert indices to range values
  const intelligenceRange = useMemo(
    () => ({
      min: INTELLIGENCE_DISPLAY[intelligenceIndices.min]?.value,
      max: INTELLIGENCE_DISPLAY[intelligenceIndices.max]?.value,
    }),
    [intelligenceIndices],
  );
  const contentRange = useMemo(
    () => ({
      min: CONTENT_DISPLAY[contentIndices.min]?.value,
      max: CONTENT_DISPLAY[contentIndices.max]?.value,
    }),
    [contentIndices],
  );
  const speedRange = useMemo(
    () => ({
      min: SPEED_DISPLAY[speedIndices.min]?.value,
      max: SPEED_DISPLAY[speedIndices.max]?.value,
    }),
    [speedIndices],
  );
  const priceRange = useMemo(
    () => ({
      min: PRICE_DISPLAY[priceIndices.min]?.value,
      max: PRICE_DISPLAY[priceIndices.max]?.value,
    }),
    [priceIndices],
  );
  const [showAllModels, setShowAllModels] = useState(false);
  const [showUnfilteredModels, setShowUnfilteredModels] = useState(false);

  // Best model based on filters - used for "best" badge in model list
  const bestFilteredModel = useMemo(() => {
    const modelSelection = {
      selectionType: ModelSelectionType.FILTERS,
      intelligenceRange,
      priceRange,
      contentRange,
      speedRange,
      preferredStrengths: initialState.preferredStrengths,
      ignoredWeaknesses: initialState.ignoredWeaknesses,
    };
    return CharactersRepositoryClient.getBestModelForCharacter(modelSelection);
  }, [
    intelligenceRange,
    priceRange,
    contentRange,
    speedRange,
    initialState.preferredStrengths,
    initialState.ignoredWeaknesses,
  ]);

  // Preview model - shown in top preview card
  const bestModel = useMemo(() => {
    if (mode === ModelSelectionType.MANUAL && manualModelId) {
      const modelSelection = {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId,
      };
      return CharactersRepositoryClient.getBestModelForCharacter(
        modelSelection,
      );
    } else if (mode === ModelSelectionType.CHARACTER_BASED) {
      // For CHARACTER_BASED mode, use the character's model directly from fullCharacter
      if (fullCharacter?.modelSelection) {
        return CharactersRepositoryClient.getBestModelForCharacter(
          fullCharacter.modelSelection,
        );
      }
      return null;
    } else {
      return bestFilteredModel;
    }
  }, [mode, manualModelId, fullCharacter, bestFilteredModel]);

  const filteredModels = useMemo(() => {
    const modelSelection: FavoriteGetResponseOutput["modelSelection"] = {
      selectionType: ModelSelectionType.FILTERS,
      intelligenceRange,
      priceRange,
      contentRange,
      speedRange,
      preferredStrengths: initialState.preferredStrengths,
      ignoredWeaknesses: initialState.ignoredWeaknesses,
    };

    return CharactersRepositoryClient.getFilteredModelsForCharacter(
      modelSelection,
    );
  }, [
    intelligenceRange,
    priceRange,
    contentRange,
    speedRange,
    initialState.preferredStrengths,
    initialState.ignoredWeaknesses,
  ]);

  const modelsToShow = showUnfilteredModels
    ? Object.values(modelOptions)
    : filteredModels;
  const displayModels = showAllModels ? modelsToShow : modelsToShow.slice(0, 3);

  const canSave = useMemo(() => {
    if (mode === ModelSelectionType.CHARACTER_BASED) {
      return !!character;
    }
    if (mode === ModelSelectionType.FILTERS) {
      return filteredModels.length > 0;
    }
    return !!manualModelId;
  }, [mode, character, filteredModels.length, manualModelId]);

  const handleSaveWithMode = useCallback(
    (saveMode: SaveMode) => {
      let modelSelection: FavoriteGetResponseOutput["modelSelection"];

      if (mode === ModelSelectionType.MANUAL && manualModelId) {
        modelSelection = {
          selectionType: ModelSelectionType.MANUAL,
          manualModelId,
        };
      } else if (mode === ModelSelectionType.CHARACTER_BASED) {
        modelSelection = {
          selectionType: ModelSelectionType.CHARACTER_BASED,
          preferredStrengths: initialState.preferredStrengths,
          ignoredWeaknesses: initialState.ignoredWeaknesses,
        };
      } else {
        modelSelection = {
          selectionType: ModelSelectionType.FILTERS,
          intelligenceRange,
          priceRange,
          contentRange,
          speedRange,
          preferredStrengths: initialState.preferredStrengths,
          ignoredWeaknesses: initialState.ignoredWeaknesses,
        };
      }

      onSave(modelSelection, saveMode);
    },
    [
      onSave,
      mode,
      manualModelId,
      intelligenceRange,
      priceRange,
      contentRange,
      speedRange,
      initialState.preferredStrengths,
      initialState.ignoredWeaknesses,
    ],
  );

  const handleSave = useCallback(() => {
    handleSaveWithMode("update");
  }, [handleSaveWithMode]);

  const handleApplyOnce = useCallback(() => {
    handleSaveWithMode("temporary");
  }, [handleSaveWithMode]);

  const resolvedModel =
    mode === ModelSelectionType.MANUAL && manualModelId
      ? (getModelById(manualModelId) ?? bestModel)
      : bestModel;

  // Get display icon with fallback logic
  const displayIcon = favorite.customIcon
    ? favorite.customIcon
    : character
      ? character.icon
      : resolvedModel
        ? resolvedModel.icon
        : "bot";

  // Get display name with fallback logic
  const displayName = favorite.customName
    ? favorite.customName
    : character
      ? t(character.content.name)
      : resolvedModel
        ? resolvedModel.name
        : t("app.chat.selector.modelOnly");

  // Show loading spinner while fetching character data
  if (isLoadingCharacter && !isModelOnly && favorite.characterId) {
    return (
      <Div className="flex items-center justify-center p-8">
        <Div className="flex flex-col items-center gap-3">
          <Div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <Span className="text-sm text-muted-foreground">
            {t("app.chat.selector.loading")}
          </Span>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col max-h-[70vh] overflow-hidden">
      {/* Header with back and delete */}
      <Div className="flex items-center justify-between p-3 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onCancel}
        >
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
        <Div className="flex flex-col gap-4">
          {/* Character info card - hidden for model-only favorites */}
          {!isModelOnly && (
            <Div className="flex items-center gap-3 p-3 border rounded-xl bg-card/50">
              <Div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon icon={displayIcon} className="h-5 w-5 text-primary" />
              </Div>
              <Div className="flex-1 min-w-0">
                <Span className="font-semibold text-sm block truncate">
                  {displayName}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {t("app.chat.selector.characterSetup")}
                </Span>
              </Div>
              {isAuthenticated && onEditCharacter && character && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => onEditCharacter(character.id)}
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </Div>
          )}

          {/* Model selection mode tabs */}
          <Div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-lg">
            {!isModelOnly && character && (
              <Button
                type="button"
                variant={
                  mode === ModelSelectionType.CHARACTER_BASED
                    ? "default"
                    : "ghost"
                }
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => setMode(ModelSelectionType.CHARACTER_BASED)}
              >
                {t("app.chat.selector.characterMode")}
              </Button>
            )}
            <Button
              type="button"
              variant={
                mode === ModelSelectionType.FILTERS ? "default" : "ghost"
              }
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={() => setMode(ModelSelectionType.FILTERS)}
            >
              {t("app.chat.selector.autoMode")}
            </Button>
            <Button
              type="button"
              variant={mode === ModelSelectionType.MANUAL ? "default" : "ghost"}
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={() => setMode(ModelSelectionType.MANUAL)}
            >
              {t("app.chat.selector.manualMode")}
            </Button>
          </Div>

          {/* Mode description */}
          <Span className="text-xs text-center text-muted-foreground/70 -mt-2">
            {mode === ModelSelectionType.CHARACTER_BASED
              ? t("app.chat.selector.characterBasedModeDescription")
              : mode === ModelSelectionType.FILTERS
                ? t("app.chat.selector.autoModeDescription")
                : t("app.chat.selector.manualModeDescription")}
          </Span>

          <Separator className="my-1" />

          {/* Model preview card - changes based on mode */}
          {bestModel ? (
            <Div className="sticky top-0 z-10 flex items-start gap-3 p-3 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl shadow-lg backdrop-blur-sm">
              <Div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center shrink-0 shadow-inner">
                <Icon icon={bestModel.icon} className="h-5 w-5 text-primary" />
              </Div>
              <Div className="flex-1 min-w-0">
                <Span className="block text-[10px] text-primary/80 uppercase tracking-wider font-bold mb-1">
                  {mode === ModelSelectionType.FILTERS
                    ? t("app.chat.selector.autoSelectedModel")
                    : mode === ModelSelectionType.MANUAL
                      ? t("app.chat.selector.manualSelectedModel")
                      : t("app.chat.selector.characterSelectedModel")}
                </Span>
                <Span className="text-sm font-bold text-primary block truncate">
                  {bestModel.name}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {bestModel.provider && modelProviders[bestModel.provider]
                    ? modelProviders[bestModel.provider].name
                    : "Unknown"}
                </Span>
              </Div>
              <Badge
                variant="secondary"
                className="text-[10px] h-5 shrink-0 bg-background/60"
              >
                {bestModel.creditCost === 0
                  ? t("app.chat.selector.free")
                  : bestModel.creditCost === 1
                    ? t("app.chat.selector.creditsSingle")
                    : t("app.chat.selector.creditsExact", {
                        cost: bestModel.creditCost,
                      })}
              </Badge>
            </Div>
          ) : (
            <Div className="sticky top-0 z-10 flex items-center gap-2 p-3 bg-destructive/10 border-2 border-destructive/30 rounded-xl">
              <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
              <Span className="text-xs font-medium text-destructive">
                {mode === ModelSelectionType.MANUAL
                  ? t("app.chat.selector.selectModelBelow")
                  : t("app.chat.selector.noModelsWarning")}
              </Span>
            </Div>
          )}

          {/* Filter sliders - shared across all modes */}
          <Div className="flex flex-col gap-3.5">
            <RangeSlider
              options={INTELLIGENCE_DISPLAY}
              minIndex={intelligenceIndices.min}
              maxIndex={intelligenceIndices.max}
              onChange={(min, max) => setIntelligenceIndices({ min, max })}
              minLabel={t(
                "app.api.agent.chat.characters.post.intelligenceRange.minLabel",
              )}
              maxLabel={t(
                "app.api.agent.chat.characters.post.intelligenceRange.maxLabel",
              )}
              disabled={mode === ModelSelectionType.CHARACTER_BASED}
              t={t}
            />

            <RangeSlider
              options={CONTENT_DISPLAY}
              minIndex={contentIndices.min}
              maxIndex={contentIndices.max}
              onChange={(min, max) => setContentIndices({ min, max })}
              minLabel={t(
                "app.api.agent.chat.characters.post.contentRange.minLabel",
              )}
              maxLabel={t(
                "app.api.agent.chat.characters.post.contentRange.maxLabel",
              )}
              disabled={mode === ModelSelectionType.CHARACTER_BASED}
              t={t}
            />

            <RangeSlider
              options={SPEED_DISPLAY}
              minIndex={speedIndices.min}
              maxIndex={speedIndices.max}
              onChange={(min, max) => setSpeedIndices({ min, max })}
              minLabel={t(
                "app.api.agent.chat.characters.post.speedRange.minLabel",
              )}
              maxLabel={t(
                "app.api.agent.chat.characters.post.speedRange.maxLabel",
              )}
              disabled={mode === ModelSelectionType.CHARACTER_BASED}
              t={t}
            />

            <RangeSlider
              options={PRICE_DISPLAY}
              minIndex={priceIndices.min}
              maxIndex={priceIndices.max}
              onChange={(min, max) => setPriceIndices({ min, max })}
              minLabel={t(
                "app.api.agent.chat.characters.post.priceRange.minLabel",
              )}
              maxLabel={t(
                "app.api.agent.chat.characters.post.priceRange.maxLabel",
              )}
              disabled={mode === ModelSelectionType.CHARACTER_BASED}
              t={t}
            />
          </Div>

          {/* Models list - visible in all modes */}
          <Div className="flex flex-col gap-3">
            {/* Filter toggle */}
            <Div className="flex items-center justify-between px-1">
              <Label className="text-xs font-medium text-muted-foreground">
                {showUnfilteredModels
                  ? t("app.chat.selector.allModelsCount", {
                      count: Object.values(modelOptions).length,
                    })
                  : t("app.chat.selector.filteredModelsCount", {
                      count: filteredModels.length,
                    })}
              </Label>
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

            {/* Model list */}
            {displayModels.length > 0 ? (
              <Div className="flex flex-col gap-2">
                {displayModels.map((model: ModelOption) => {
                  const isOutsideFilter =
                    showUnfilteredModels &&
                    !filteredModels.some((m: ModelOption) => m.id === model.id);
                  return (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isBest={model.id === bestFilteredModel?.id}
                      selected={
                        mode === ModelSelectionType.MANUAL &&
                        manualModelId === model.id
                      }
                      onClick={() => {
                        // Always switch to manual mode with this model
                        setManualModelId(model.id);
                        setMode(ModelSelectionType.MANUAL);
                      }}
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
              </Div>
            ) : (
              <Div className="p-4 text-center text-sm text-muted-foreground border rounded-lg">
                {t("app.chat.selector.noMatchingModels")}
              </Div>
            )}
          </Div>
        </Div>
      </Div>

      {/* Footer actions */}
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
        <Button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="flex-1 h-10"
        >
          {t("app.chat.selector.saveAsDefault")}
        </Button>
      </Div>
    </Div>
  );
}
