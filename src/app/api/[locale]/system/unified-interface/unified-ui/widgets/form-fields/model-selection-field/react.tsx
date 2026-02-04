/**
 * Model Selection Field Widget - React implementation
 * Comprehensive model selection with CHARACTER_BASED, FILTERS, and MANUAL modes
 *
 * Uses react-hook-form as single source of truth - no local state syncing
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ArrowDown } from "next-vibe-ui/ui/icons/ArrowDown";
import { ArrowUp } from "next-vibe-ui/ui/icons/ArrowUp";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { ChevronUp } from "next-vibe-ui/ui/icons/ChevronUp";
import { Filter } from "next-vibe-ui/ui/icons/Filter";
import { Label } from "next-vibe-ui/ui/label";
import { RangeSlider } from "next-vibe-ui/ui/range-slider";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useMemo, useState } from "react";

import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/characters/enum";
import {
  CONTENT_DISPLAY,
  INTELLIGENCE_DISPLAY,
  PRICE_DISPLAY,
  SPEED_DISPLAY,
} from "@/app/api/[locale]/agent/chat/characters/enum";
import { CharactersRepositoryClient } from "@/app/api/[locale]/agent/chat/characters/repository-client";
import { ModelUtility } from "@/app/api/[locale]/agent/models/enum";
import {
  type ModelId,
  type ModelOption,
  modelOptions,
  modelProviders,
} from "@/app/api/[locale]/agent/models/models";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { ReactWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import {
  useWidgetForm,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type {
  FiltersModelSelection,
  ManualModelSelection,
  ModelSelectionFieldWidgetConfig,
  ModelSelectionFieldWidgetConfigSimple,
  ModelSelectionSimple,
  ModelSelectionWithCharacter,
} from "./types";
import {
  ModelSortDirection,
  ModelSortField,
  ModelSortFieldOptions,
} from "./types";

type ModelSelectionValue = ModelSelectionWithCharacter | ModelSelectionSimple;

interface ModelCardProps {
  model: ModelOption;
  isBest: boolean;
  selected: boolean;
  onClick: () => void;
  dimmed?: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
}

function ModelCard({
  model,
  isBest,
  selected,
  onClick,
  dimmed = false,
  t,
}: ModelCardProps): JSX.Element {
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
              {t("app.chat.selector.bestForFilter")}
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

interface RangeIndices {
  min: number;
  max: number;
}

function getIndicesFromRange<T extends string>(
  range: { min?: T; max?: T } | undefined,
  options: readonly { value: T }[],
): RangeIndices {
  if (!range) {
    return { min: 0, max: options.length - 1 };
  }

  // Handle partial ranges - if only min or max is set, use that value
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
}

function getRangeFromIndices<T extends string>(
  indices: RangeIndices,
  options: readonly { value: T }[],
): { min?: T; max?: T } {
  return {
    min: options[indices.min]?.value,
    max: options[indices.max]?.value,
  };
}

interface ModelSelectionInnerProps {
  value: ModelSelectionValue | undefined;
  onUpdateValue: (value: ModelSelectionValue) => void;
  includeCharacterBased: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
}

function ModelSelectionInner({
  value,
  onUpdateValue,
  fullCharacter,
  isLoadingCharacter,
  includeCharacterBased,
  t,
}: ModelSelectionInnerProps): JSX.Element {
  // UI state only (not form state)
  const [showAllModels, setShowAllModels] = useState(false);
  const [showUnfilteredModels, setShowUnfilteredModels] = useState(false);
  const [showLegacyByGroup, setShowLegacyByGroup] = useState<
    Record<string, boolean>
  >({});

  // Extract current selection from form value
  const currentSelection = useMemo(() => {
    if (!value) {
      return includeCharacterBased
        ? { selectionType: ModelSelectionType.CHARACTER_BASED }
        : { selectionType: ModelSelectionType.FILTERS };
    }
    if ("currentSelection" in value) {
      return value.currentSelection;
    }
    return value;
  }, [value, includeCharacterBased]);

  // Get character model selection
  const characterModelSelection = useMemo(() => {
    if (value && "characterModelSelection" in value) {
      return value.characterModelSelection;
    }
    return fullCharacter?.modelSelection;
  }, [value, fullCharacter]);

  // Determine current mode
  const mode = currentSelection.selectionType;

  // Get filter ranges from current selection or character
  const activeSelection =
    mode === ModelSelectionType.CHARACTER_BASED
      ? characterModelSelection
      : currentSelection;

  const intelligenceIndices = useMemo(
    () =>
      activeSelection?.selectionType === ModelSelectionType.FILTERS ||
      activeSelection?.selectionType === ModelSelectionType.MANUAL
        ? getIndicesFromRange(
            activeSelection.intelligenceRange,
            INTELLIGENCE_DISPLAY,
          )
        : { min: 0, max: INTELLIGENCE_DISPLAY.length - 1 },
    [activeSelection],
  );

  const contentIndices = useMemo(
    () =>
      activeSelection?.selectionType === ModelSelectionType.FILTERS ||
      activeSelection?.selectionType === ModelSelectionType.MANUAL
        ? getIndicesFromRange(activeSelection.contentRange, CONTENT_DISPLAY)
        : { min: 0, max: CONTENT_DISPLAY.length - 1 },
    [activeSelection],
  );

  const speedIndices = useMemo(
    () =>
      activeSelection?.selectionType === ModelSelectionType.FILTERS ||
      activeSelection?.selectionType === ModelSelectionType.MANUAL
        ? getIndicesFromRange(activeSelection.speedRange, SPEED_DISPLAY)
        : { min: 0, max: SPEED_DISPLAY.length - 1 },
    [activeSelection],
  );

  const priceIndices = useMemo(
    () =>
      activeSelection?.selectionType === ModelSelectionType.FILTERS ||
      activeSelection?.selectionType === ModelSelectionType.MANUAL
        ? getIndicesFromRange(activeSelection.priceRange, PRICE_DISPLAY)
        : { min: 0, max: PRICE_DISPLAY.length - 1 },
    [activeSelection],
  );

  const manualModelId =
    currentSelection.selectionType === ModelSelectionType.MANUAL
      ? currentSelection.manualModelId
      : undefined;

  // Helper to create new value with updated selection
  const createUpdatedValue = (
    newSelection:
      | FiltersModelSelection
      | ManualModelSelection
      | { selectionType: typeof ModelSelectionType.CHARACTER_BASED },
  ): ModelSelectionValue => {
    if (includeCharacterBased) {
      return {
        currentSelection: newSelection,
        characterModelSelection,
      } as ModelSelectionWithCharacter;
    }
    return newSelection as ModelSelectionSimple;
  };

  // Mode change handlers
  const handleModeChange = (
    newMode:
      | typeof ModelSelectionType.CHARACTER_BASED
      | typeof ModelSelectionType.FILTERS
      | typeof ModelSelectionType.MANUAL,
  ): void => {
    if (newMode === ModelSelectionType.CHARACTER_BASED) {
      // When switching to CHARACTER_BASED, reset to character's defaults
      onUpdateValue(
        createUpdatedValue({
          selectionType: ModelSelectionType.CHARACTER_BASED,
        }),
      );
    } else if (newMode === ModelSelectionType.MANUAL) {
      // When switching to manual, preserve current filter/sort settings
      const baseProps = {
        intelligenceRange: getRangeFromIndices(
          intelligenceIndices,
          INTELLIGENCE_DISPLAY,
        ),
        priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
        contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
        speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
        sortBy,
        sortDirection,
      };

      // Try to keep current model if available, otherwise use best filtered model
      const currentModel =
        manualModelId ??
        bestFilteredModel?.id ??
        Object.values(modelOptions)[0]?.id;
      onUpdateValue(
        createUpdatedValue({
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: currentModel,
          ...baseProps,
        }),
      );
    } else {
      // Filters mode - preserve current filter/sort settings
      const baseProps = {
        intelligenceRange: getRangeFromIndices(
          intelligenceIndices,
          INTELLIGENCE_DISPLAY,
        ),
        priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
        contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
        speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
        sortBy,
        sortDirection,
      };

      onUpdateValue(
        createUpdatedValue({
          selectionType: ModelSelectionType.FILTERS,
          ...baseProps,
        }),
      );
    }
  };

  // Range change handlers - automatically switch to FILTERS mode when editing
  const handleIntelligenceChange = (min: number, max: number): void => {
    onUpdateValue(
      createUpdatedValue({
        selectionType: ModelSelectionType.FILTERS,
        intelligenceRange: getRangeFromIndices(
          { min, max },
          INTELLIGENCE_DISPLAY,
        ),
        priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
        contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
        speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
        sortBy,
        sortDirection,
      }),
    );
  };

  const handleContentChange = (min: number, max: number): void => {
    onUpdateValue(
      createUpdatedValue({
        selectionType: ModelSelectionType.FILTERS,
        intelligenceRange: getRangeFromIndices(
          intelligenceIndices,
          INTELLIGENCE_DISPLAY,
        ),
        priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
        contentRange: getRangeFromIndices({ min, max }, CONTENT_DISPLAY),
        speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
        sortBy,
        sortDirection,
      }),
    );
  };

  const handleSpeedChange = (min: number, max: number): void => {
    onUpdateValue(
      createUpdatedValue({
        selectionType: ModelSelectionType.FILTERS,
        intelligenceRange: getRangeFromIndices(
          intelligenceIndices,
          INTELLIGENCE_DISPLAY,
        ),
        priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
        contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
        speedRange: getRangeFromIndices({ min, max }, SPEED_DISPLAY),
        sortBy,
        sortDirection,
      }),
    );
  };

  const handlePriceChange = (min: number, max: number): void => {
    onUpdateValue(
      createUpdatedValue({
        selectionType: ModelSelectionType.FILTERS,
        intelligenceRange: getRangeFromIndices(
          intelligenceIndices,
          INTELLIGENCE_DISPLAY,
        ),
        priceRange: getRangeFromIndices({ min, max }, PRICE_DISPLAY),
        contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
        speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
        sortBy,
        sortDirection,
      }),
    );
  };

  const handleModelSelect = (modelId: ModelId): void => {
    // When selecting a model, preserve current filter/sort settings
    onUpdateValue(
      createUpdatedValue({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: modelId,
        intelligenceRange: getRangeFromIndices(
          intelligenceIndices,
          INTELLIGENCE_DISPLAY,
        ),
        priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
        contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
        speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
        sortBy,
        sortDirection,
      }),
    );
  };

  // Get current sort settings from activeSelection (respects CHARACTER_BASED mode)
  const sortBy =
    activeSelection?.selectionType === ModelSelectionType.FILTERS ||
    activeSelection?.selectionType === ModelSelectionType.MANUAL
      ? activeSelection.sortBy
      : undefined;
  const sortDirection =
    activeSelection?.selectionType === ModelSelectionType.FILTERS ||
    activeSelection?.selectionType === ModelSelectionType.MANUAL
      ? activeSelection.sortDirection
      : undefined;

  // Sort change handlers - automatically switch to FILTERS mode when editing
  const handleSortFieldChange = (
    field: (typeof ModelSortField)[keyof typeof ModelSortField],
  ): void => {
    // Determine sane default direction based on field - always reset when changing field
    // All fields default to DESC (highest/best first, including most expensive for price)
    const defaultDirection = ModelSortDirection.DESC;

    onUpdateValue(
      createUpdatedValue({
        selectionType: ModelSelectionType.FILTERS,
        intelligenceRange: getRangeFromIndices(
          intelligenceIndices,
          INTELLIGENCE_DISPLAY,
        ),
        priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
        contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
        speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
        sortBy: field,
        sortDirection: defaultDirection,
      }),
    );
  };

  const handleSortDirectionToggle = (): void => {
    const newDirection =
      sortDirection === ModelSortDirection.ASC
        ? ModelSortDirection.DESC
        : ModelSortDirection.ASC;
    onUpdateValue(
      createUpdatedValue({
        selectionType: ModelSelectionType.FILTERS,
        intelligenceRange: getRangeFromIndices(
          intelligenceIndices,
          INTELLIGENCE_DISPLAY,
        ),
        priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
        contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
        speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
        sortBy: sortBy ?? ModelSortField.INTELLIGENCE,
        sortDirection: newDirection,
      }),
    );
  };

  // Calculate filtered models and best model
  const intelligenceRange = getRangeFromIndices(
    intelligenceIndices,
    INTELLIGENCE_DISPLAY,
  );
  const contentRange = getRangeFromIndices(contentIndices, CONTENT_DISPLAY);
  const speedRange = getRangeFromIndices(speedIndices, SPEED_DISPLAY);
  const priceRange = getRangeFromIndices(priceIndices, PRICE_DISPLAY);

  const filteredModels = useMemo(() => {
    const modelSelection: FiltersModelSelection = {
      selectionType: ModelSelectionType.FILTERS,
      intelligenceRange,
      priceRange,
      contentRange,
      speedRange,
      sortBy,
      sortDirection,
    };
    return CharactersRepositoryClient.getFilteredModelsForCharacter(
      modelSelection,
    );
  }, [
    intelligenceRange,
    priceRange,
    contentRange,
    speedRange,
    sortBy,
    sortDirection,
  ]);

  const bestFilteredModel = useMemo(() => {
    return filteredModels.length > 0 ? filteredModels[0] : null;
  }, [filteredModels]);

  const bestModel = useMemo(() => {
    if (mode === ModelSelectionType.MANUAL && manualModelId) {
      return modelOptions[manualModelId] ?? null;
    } else if (mode === ModelSelectionType.CHARACTER_BASED) {
      if (characterModelSelection) {
        return CharactersRepositoryClient.getBestModelForCharacter(
          characterModelSelection,
        );
      }
      return null;
    } else {
      return bestFilteredModel;
    }
  }, [mode, manualModelId, bestFilteredModel, characterModelSelection]);

  // Get models to show (filtered or all)
  const modelsToShow = showUnfilteredModels
    ? Object.values(modelOptions)
    : filteredModels;

  // Sort and group models
  const sortedAndGroupedModels = useMemo(() => {
    if (!sortBy) {
      return { ungrouped: modelsToShow };
    }

    // Get sort value and label based on field
    const getSortInfo = (
      model: ModelOption,
    ): { value: number; label: string } => {
      switch (sortBy) {
        case ModelSortField.INTELLIGENCE: {
          const idx = INTELLIGENCE_DISPLAY.findIndex(
            (d) => d.value === model.intelligence,
          );
          return {
            value: idx === -1 ? 0 : idx,
            label: t(INTELLIGENCE_DISPLAY[idx]?.label ?? ""),
          };
        }
        case ModelSortField.SPEED: {
          const idx = SPEED_DISPLAY.findIndex((d) => d.value === model.speed);
          return {
            value: idx === -1 ? 0 : idx,
            label: t(SPEED_DISPLAY[idx]?.label ?? ""),
          };
        }
        case ModelSortField.PRICE:
          return {
            value: model.creditCost,
            label:
              model.creditCost === 0
                ? t("app.chat.selector.free")
                : model.creditCost === 1
                  ? t("app.chat.selector.creditsSingle")
                  : t("app.chat.selector.creditsExact", {
                      cost: model.creditCost,
                    }),
          };
        case ModelSortField.CONTENT: {
          const idx = CONTENT_DISPLAY.findIndex(
            (d) => d.value === model.content,
          );
          return {
            value: idx === -1 ? 0 : idx,
            label: t(CONTENT_DISPLAY[idx]?.label ?? ""),
          };
        }
        default:
          return { value: 0, label: "" };
      }
    };

    // Sort models
    const sorted = [...modelsToShow].toSorted((a, b) => {
      const aVal = getSortInfo(a).value;
      const bVal = getSortInfo(b).value;
      return sortDirection === ModelSortDirection.ASC
        ? aVal - bVal
        : bVal - aVal;
    });

    // Group by sort value label
    const grouped: Record<string, ModelOption[]> = {};
    for (const model of sorted) {
      const { label } = getSortInfo(model);
      if (!grouped[label]) {
        grouped[label] = [];
      }
      grouped[label].push(model);
    }

    return grouped;
  }, [modelsToShow, sortBy, sortDirection, t]);

  // Get display models (limited or all)
  const displayModels = useMemo(() => {
    if (
      Object.keys(sortedAndGroupedModels).length === 1 &&
      sortedAndGroupedModels.ungrouped
    ) {
      // No grouping - just slice for show more/less
      return showAllModels
        ? sortedAndGroupedModels.ungrouped
        : sortedAndGroupedModels.ungrouped.slice(0, 3);
    }
    // With grouping - return all groups (show more/less handled per group)
    return sortedAndGroupedModels;
  }, [sortedAndGroupedModels, showAllModels]);

  if (isLoadingCharacter && includeCharacterBased) {
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
    <Div className="flex flex-col gap-4 border rounded-lg p-4">
      {/* Model selection mode tabs */}
      <Div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-lg">
        {includeCharacterBased && (
          <Button
            type="button"
            variant={
              mode === ModelSelectionType.CHARACTER_BASED ? "default" : "ghost"
            }
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={() => handleModeChange(ModelSelectionType.CHARACTER_BASED)}
          >
            {t("app.chat.selector.characterMode")}
          </Button>
        )}
        <Button
          type="button"
          variant={mode === ModelSelectionType.FILTERS ? "default" : "ghost"}
          size="sm"
          className="flex-1 h-8 text-xs"
          onClick={() => handleModeChange(ModelSelectionType.FILTERS)}
        >
          {t("app.chat.selector.autoMode")}
        </Button>
        <Button
          type="button"
          variant={mode === ModelSelectionType.MANUAL ? "default" : "ghost"}
          size="sm"
          className="flex-1 h-8 text-xs"
          onClick={() => handleModeChange(ModelSelectionType.MANUAL)}
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

      {/* Model preview card */}
      {bestModel ? (
        <Div className="sticky top-0 z-15 flex items-start gap-3 p-3 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl shadow-lg backdrop-blur-sm">
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
        <Div className="flex items-center gap-2 p-3 bg-destructive/10 border-2 border-destructive/30 rounded-xl">
          <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
          <Span className="text-xs font-medium text-destructive">
            {mode === ModelSelectionType.MANUAL
              ? t("app.chat.selector.selectModelBelow")
              : t("app.chat.selector.noModelsWarning")}
          </Span>
        </Div>
      )}

      {/* Filter sliders */}
      <Div className="flex flex-col gap-3.5">
        <RangeSlider
          options={INTELLIGENCE_DISPLAY}
          minIndex={intelligenceIndices.min}
          maxIndex={intelligenceIndices.max}
          onChange={handleIntelligenceChange}
          minLabel={t(
            "app.api.agent.chat.characters.post.intelligenceRange.minLabel",
          )}
          maxLabel={t(
            "app.api.agent.chat.characters.post.intelligenceRange.maxLabel",
          )}
          t={t}
        />

        <RangeSlider
          options={CONTENT_DISPLAY}
          minIndex={contentIndices.min}
          maxIndex={contentIndices.max}
          onChange={handleContentChange}
          minLabel={t(
            "app.api.agent.chat.characters.post.contentRange.minLabel",
          )}
          maxLabel={t(
            "app.api.agent.chat.characters.post.contentRange.maxLabel",
          )}
          t={t}
        />

        <RangeSlider
          options={SPEED_DISPLAY}
          minIndex={speedIndices.min}
          maxIndex={speedIndices.max}
          onChange={handleSpeedChange}
          minLabel={t("app.api.agent.chat.characters.post.speedRange.minLabel")}
          maxLabel={t("app.api.agent.chat.characters.post.speedRange.maxLabel")}
          t={t}
        />

        <RangeSlider
          options={PRICE_DISPLAY}
          minIndex={priceIndices.min}
          maxIndex={priceIndices.max}
          onChange={handlePriceChange}
          minLabel={t("app.api.agent.chat.characters.post.priceRange.minLabel")}
          maxLabel={t("app.api.agent.chat.characters.post.priceRange.maxLabel")}
          t={t}
        />
      </Div>

      {/* Models list */}
      <Div className="flex flex-col gap-3">
        {/* Filter and Sort Controls */}
        <Div className="flex items-center justify-between gap-2 px-1">
          <Label className="text-xs font-medium text-muted-foreground">
            {showUnfilteredModels
              ? t("app.chat.selector.allModelsCount", {
                  count: Object.values(modelOptions).length,
                })
              : t("app.chat.selector.filteredModelsCount", {
                  count: filteredModels.length,
                })}
          </Label>
          <Div className="flex items-center gap-1">
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
                : t("app.chat.selector.showAllModels", {
                    count: Object.values(modelOptions).length,
                  })}
            </Button>
          </Div>
        </Div>

        {/* Sort Controls */}
        <Div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg border">
          <Label className="text-[11px] font-medium text-muted-foreground shrink-0">
            {t("app.chat.selector.sortBy")}:
          </Label>
          <Div className="flex items-center gap-1 flex-wrap flex-1">
            {ModelSortFieldOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={sortBy === option.value ? "default" : "ghost"}
                size="sm"
                className="h-6 text-[11px] px-2"
                onClick={() => handleSortFieldChange(option.value)}
              >
                {t(option.label)}
              </Button>
            ))}
          </Div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 shrink-0"
            onClick={handleSortDirectionToggle}
            disabled={!sortBy}
          >
            {sortDirection === ModelSortDirection.ASC ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5" />
            )}
          </Button>
        </Div>

        {/* Model list */}
        {Array.isArray(displayModels) ? (
          // Ungrouped list
          displayModels.length > 0 ? (
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
                    onClick={() => handleModelSelect(model.id)}
                    dimmed={isOutsideFilter}
                    t={t}
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
          )
        ) : (
          // Grouped list
          <Div className="flex flex-col gap-4">
            {Object.entries(displayModels).map(([groupLabel, groupModels]) => {
              const models = groupModels as ModelOption[];

              // Separate legacy and non-legacy models
              const nonLegacyModels = models.filter(
                (model) => !model.utilities.includes(ModelUtility.LEGACY),
              );
              const legacyModels = models.filter((model) =>
                model.utilities.includes(ModelUtility.LEGACY),
              );

              const showingLegacy = showLegacyByGroup[groupLabel] ?? false;
              const visibleModels = showingLegacy ? models : nonLegacyModels;

              return (
                <Div key={groupLabel} className="flex flex-col gap-2">
                  <Div className="flex items-center gap-2 px-1">
                    <Separator className="flex-1" />
                    <Label className="text-[11px] font-semibold text-primary uppercase tracking-wide">
                      {groupLabel}
                    </Label>
                    <Separator className="flex-1" />
                  </Div>
                  <Div className="flex flex-col gap-2">
                    {visibleModels.map((model) => {
                      const isOutsideFilter =
                        showUnfilteredModels &&
                        !filteredModels.some(
                          (m: ModelOption) => m.id === model.id,
                        );
                      return (
                        <ModelCard
                          key={model.id}
                          model={model}
                          isBest={model.id === bestFilteredModel?.id}
                          selected={
                            mode === ModelSelectionType.MANUAL &&
                            manualModelId === model.id
                          }
                          onClick={() => handleModelSelect(model.id)}
                          dimmed={isOutsideFilter}
                          t={t}
                        />
                      );
                    })}

                    {/* Show Legacy Models Button */}
                    {legacyModels.length > 0 && !showingLegacy && (
                      <Div
                        className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:bg-muted/50 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setShowLegacyByGroup((prev) => ({
                            ...prev,
                            [groupLabel]: true,
                          }));
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <Span className="text-sm font-medium">
                          {t("app.chat.selector.showLegacyModels", {
                            count: legacyModels.length,
                          })}
                        </Span>
                      </Div>
                    )}
                  </Div>
                </Div>
              );
            })}
          </Div>
        )}
      </Div>
    </Div>
  );
}

export function ModelSelectionFieldWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>({
  field,
  fieldName,
}: ReactWidgetProps<
  TEndpoint,
  | ModelSelectionFieldWidgetConfig<TKey, TUsage>
  | ModelSelectionFieldWidgetConfigSimple<TKey, TUsage>
>): JSX.Element {
  const t = useWidgetTranslation();
  const form = useWidgetForm();

  const includeCharacterBased = field.includeCharacterBased;

  if (!form || !fieldName) {
    return (
      <Div>
        {t(
          "app.api.system.unifiedInterface.react.widgets.formField.requiresContext",
        )}
      </Div>
    );
  }

  // Read from form state (single source of truth)
  const value = form.watch(fieldName) as ModelSelectionValue | undefined;

  // Update form state directly
  const handleUpdate = (newValue: ModelSelectionValue): void => {
    form.setValue(fieldName, newValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <ModelSelectionInner
      value={value}
      onUpdateValue={handleUpdate}
      includeCharacterBased={includeCharacterBased}
      t={t}
    />
  );
}

export default ModelSelectionFieldWidget;
