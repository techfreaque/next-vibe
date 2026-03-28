/**
 * Model Selector Component
 * Standalone, reusable model selection with CHARACTER_BASED, FILTERS, and MANUAL modes
 *
 * Accepts state from outside - can be used with any state management
 */

"use client";

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
import { X } from "next-vibe-ui/ui/icons/X";
import { Label } from "next-vibe-ui/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { RangeSlider } from "next-vibe-ui/ui/range-slider";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import { P } from "next-vibe-ui/ui/typography";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";

import {
  CONTENT_DISPLAY,
  INTELLIGENCE_DISPLAY,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  ModelSortFieldOptions,
  PRICE_DISPLAY,
  SPEED_DISPLAY,
} from "@/app/api/[locale]/agent/chat/skills/enum";
import { SkillsRepositoryClient } from "@/app/api/[locale]/agent/chat/skills/repository-client";
import type { AgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import { ModelUtility } from "@/app/api/[locale]/agent/models/enum";
import {
  ApiProvider,
  apiProviderDisplayNames,
  getAllModelOptions,
  getCreditCostFromModel,
  getModelById,
  modelProviders,
  type ModelId,
  type ModelOption,
  type ModelType,
} from "@/app/api/[locale]/agent/models/models";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { DEFAULT_INPUT_TOKENS, DEFAULT_OUTPUT_TOKENS } from "../constants";
import { scopedTranslation } from "../i18n";
import type { FiltersModelSelection, ModelSelectionSimple } from "../types";
import { ModelCreditDisplay } from "./model-credit-display";

interface ModelCardProps {
  model: ModelOption;
  isBest: boolean;
  selected: boolean;
  onClick: () => void;
  dimmed?: boolean;
  disabled?: boolean;
  setupRequired?: string | null;
  /** Show API provider suffix when model name appears with multiple providers */
  providerSuffix?: string | null;
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
  locale: CountryLanguage;
}

function ModelCard({
  model,
  isBest,
  selected,
  onClick,
  dimmed = false,
  disabled = false,
  setupRequired = null,
  providerSuffix = null,
  t,
  locale,
}: ModelCardProps): JSX.Element {
  const isUnavailable = disabled || Boolean(setupRequired);

  const card = (
    <Div
      onClick={isUnavailable ? undefined : onClick}
      className={cn(
        "flex items-center gap-2.5 p-2.5 rounded-lg border transition-all",
        !isUnavailable &&
          "cursor-pointer hover:bg-muted/50 hover:border-primary/30",
        isUnavailable && "cursor-not-allowed opacity-50",
        selected &&
          !setupRequired &&
          "bg-primary/10 border-primary/40 shadow-sm",
        dimmed && !selected && "opacity-40 hover:opacity-70",
        setupRequired && "border-dashed border-muted-foreground/30 bg-muted/20",
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
            {providerSuffix ? (
              <Span className="text-muted-foreground font-normal">{` (${providerSuffix})`}</Span>
            ) : null}
          </Span>
          {isBest && (
            <Badge variant="default" className="text-[9px] h-4 px-1.5 shrink-0">
              {t("selector.bestForFilter")}
            </Badge>
          )}
        </Div>
        <Span className="text-[11px] text-muted-foreground">
          {modelProviders[model.provider]?.name ?? model.provider}
        </Span>
      </Div>

      <Div className="flex items-center gap-1.5 shrink-0">
        {setupRequired ? (
          <Badge
            variant="outline"
            className="text-[9px] h-4 px-1.5 shrink-0 border-amber-400 text-amber-600"
          >
            {t("selector.setupRequired")}
          </Badge>
        ) : (
          <ModelCreditDisplay
            modelId={model.id}
            variant="badge"
            badgeVariant={selected ? "outline" : "secondary"}
            className="text-[10px] h-5"
            locale={locale}
          />
        )}
        {selected && !setupRequired && (
          <Check className="h-4 w-4 text-primary" />
        )}
      </Div>
    </Div>
  );

  if (!setupRequired) {
    return card;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{card}</TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">
        <P className="font-semibold mb-1">
          {t("selector.providerUnconfigured")}
        </P>
        <P>{setupRequired}</P>
      </TooltipContent>
    </Tooltip>
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

function isFullRange(indices: RangeIndices, len: number): boolean {
  return indices.min === 0 && indices.max === len - 1;
}

interface FilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

function buildFilterChips({
  intelligenceIndices,
  contentIndices,
  speedIndices,
  priceIndices,
  sortBy,
  sortDirection,
  sortBy2,
  sortDirection2,
  t,
  mode,
  manualModelId,
  handleIntelligenceChange,
  handleContentChange,
  handleSpeedChange,
  handlePriceChange,
  setUseSkillBased,
  updateValue,
}: {
  intelligenceIndices: RangeIndices;
  contentIndices: RangeIndices;
  speedIndices: RangeIndices;
  priceIndices: RangeIndices;
  sortBy: ReturnType<typeof scopedTranslation.scopedT>["t"] extends never
    ? never
    : (typeof ModelSortField)[keyof typeof ModelSortField] | undefined;
  sortDirection:
    | (typeof ModelSortDirection)[keyof typeof ModelSortDirection]
    | undefined;
  sortBy2: (typeof ModelSortField)[keyof typeof ModelSortField] | undefined;
  sortDirection2:
    | (typeof ModelSortDirection)[keyof typeof ModelSortDirection]
    | undefined;
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
  mode: string;
  manualModelId: ModelId | undefined;
  handleIntelligenceChange: (min: number, max: number) => void;
  handleContentChange: (min: number, max: number) => void;
  handleSpeedChange: (min: number, max: number) => void;
  handlePriceChange: (min: number, max: number) => void;
  setUseSkillBased: (v: boolean) => void;
  updateValue: (s: ModelSelectionSimple | null) => void;
}): FilterChip[] {
  const chips: FilterChip[] = [];

  type ModelsT = ReturnType<typeof scopedTranslation.scopedT>["t"];
  type ModelsKey = Parameters<ModelsT>[0];
  const rangeLabel = (
    display: readonly { label: ModelsKey }[],
    indices: RangeIndices,
  ): string => {
    const minKey = display[indices.min]?.label;
    const maxKey = display[indices.max]?.label;
    const minL = minKey ? t(minKey) : "";
    const maxL = maxKey ? t(maxKey) : "";
    return indices.min === indices.max ? minL : `${minL}–${maxL}`;
  };

  if (!isFullRange(intelligenceIndices, INTELLIGENCE_DISPLAY.length)) {
    chips.push({
      key: "intelligence",
      label: rangeLabel(INTELLIGENCE_DISPLAY, intelligenceIndices),
      onRemove: () =>
        handleIntelligenceChange(0, INTELLIGENCE_DISPLAY.length - 1),
    });
  }
  if (!isFullRange(contentIndices, CONTENT_DISPLAY.length)) {
    chips.push({
      key: "content",
      label: rangeLabel(CONTENT_DISPLAY, contentIndices),
      onRemove: () => handleContentChange(0, CONTENT_DISPLAY.length - 1),
    });
  }
  if (!isFullRange(speedIndices, SPEED_DISPLAY.length)) {
    chips.push({
      key: "speed",
      label: rangeLabel(SPEED_DISPLAY, speedIndices),
      onRemove: () => handleSpeedChange(0, SPEED_DISPLAY.length - 1),
    });
  }
  if (!isFullRange(priceIndices, PRICE_DISPLAY.length)) {
    chips.push({
      key: "price",
      label: rangeLabel(PRICE_DISPLAY, priceIndices),
      onRemove: () => handlePriceChange(0, PRICE_DISPLAY.length - 1),
    });
  }
  if (sortBy) {
    const dir = sortDirection === ModelSortDirection.ASC ? "↑" : "↓";
    chips.push({
      key: "sort",
      label: `${dir} ${t(sortBy as Parameters<typeof t>[0])}`,
      onRemove: () => {
        setUseSkillBased(false);
        updateValue({
          selectionType:
            mode === ModelSelectionType.MANUAL
              ? ModelSelectionType.MANUAL
              : ModelSelectionType.FILTERS,
          ...(mode === ModelSelectionType.MANUAL && manualModelId
            ? { manualModelId }
            : {}),
          intelligenceRange: getRangeFromIndices(
            intelligenceIndices,
            INTELLIGENCE_DISPLAY,
          ),
          priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
          contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
          speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
          sortBy: undefined,
          sortDirection: undefined,
          sortBy2: undefined,
          sortDirection2: undefined,
        } as ModelSelectionSimple);
      },
    });
  }
  if (sortBy2) {
    const dir2 = sortDirection2 === ModelSortDirection.ASC ? "↑" : "↓";
    chips.push({
      key: "sort2",
      label: `then ${dir2} ${t(sortBy2 as Parameters<typeof t>[0])}`,
      onRemove: () => {
        setUseSkillBased(false);
        updateValue({
          selectionType:
            mode === ModelSelectionType.MANUAL
              ? ModelSelectionType.MANUAL
              : ModelSelectionType.FILTERS,
          ...(mode === ModelSelectionType.MANUAL && manualModelId
            ? { manualModelId }
            : {}),
          intelligenceRange: getRangeFromIndices(
            intelligenceIndices,
            INTELLIGENCE_DISPLAY,
          ),
          priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
          contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
          speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
          sortBy,
          sortDirection,
          sortBy2: undefined,
          sortDirection2: undefined,
        } as ModelSelectionSimple);
      },
    });
  }
  return chips;
}

/**
 * Standalone Model Selector Component
 */
export interface ModelSelectorProps {
  /**
   * Current model selection
   */
  modelSelection: ModelSelectionSimple | undefined;

  /**
   * Callback when selection changes (optional for read-only mode)
   */
  onChange?: (selection: ModelSelectionSimple | null) => void;

  /**
   * Skill's model selection (optional, for CHARACTER_BASED mode)
   */
  characterModelSelection?: ModelSelectionSimple | undefined;

  /**
   * Read-only mode - disables all interactions
   */
  readOnly?: boolean;

  /**
   * Which AI providers have API keys configured (optional - if not provided all are assumed available)
   */
  envAvailability?: AgentEnvAvailability;

  /**
   * User's locale for currency formatting
   */
  locale: CountryLanguage;

  /**
   * User payload for admin-only model filtering
   */
  user: JwtPayloadType;

  /**
   * Compact mode - removes outer border/padding and hides type tabs.
   * Use in onboarding or embedded contexts where double-border is undesirable.
   */
  compact?: boolean;
}

/** Returns true if the model's provider is available given current env */
export function isProviderAvailable(
  model: ModelOption,
  envAvailability: AgentEnvAvailability | undefined,
): boolean {
  if (!envAvailability) {
    return true;
  }
  switch (model.apiProvider) {
    case ApiProvider.OPENROUTER:
      return envAvailability.openRouter;
    case ApiProvider.CLAUDE_CODE:
      return envAvailability.claudeCode;
    case ApiProvider.UNCENSORED_AI:
      return envAvailability.uncensoredAI;
    case ApiProvider.FREEDOMGPT:
      return envAvailability.freedomGPT;
    case ApiProvider.GAB_AI:
      return envAvailability.gabAI;
    case ApiProvider.VENICE_AI:
      return envAvailability.veniceAI;
    case ApiProvider.OPENAI_IMAGES:
      return envAvailability.openAiImages;
    case ApiProvider.REPLICATE:
      return envAvailability.replicate;
    case ApiProvider.FAL_AI:
      return envAvailability.falAi;
    default:
      return true;
  }
}

/** Map ApiProvider to the availability key */
function getSetupRequiredMessage(
  model: ModelOption,
  envAvailability: AgentEnvAvailability | undefined,
  locale: CountryLanguage,
): string | null {
  if (!envAvailability) {
    return null;
  }
  const t = scopedTranslation.scopedT(locale).t;
  switch (model.apiProvider) {
    case ApiProvider.OPENROUTER:
      return envAvailability.openRouter
        ? null
        : `${t("selector.addEnvKey")}: OPENROUTER_API_KEY → openrouter.ai/keys`;
    case ApiProvider.UNCENSORED_AI:
      return envAvailability.uncensoredAI
        ? null
        : `${t("selector.addEnvKey")}: UNCENSORED_AI_API_KEY`;
    case ApiProvider.FREEDOMGPT:
      return envAvailability.freedomGPT
        ? null
        : `${t("selector.addEnvKey")}: FREEDOMGPT_API_KEY`;
    case ApiProvider.GAB_AI:
      return envAvailability.gabAI
        ? null
        : `${t("selector.addEnvKey")}: GAB_AI_API_KEY`;
    case ApiProvider.VENICE_AI:
      return envAvailability.veniceAI
        ? null
        : `${t("selector.addEnvKey")}: VENICE_AI_API_KEY → venice.ai`;
    case ApiProvider.CLAUDE_CODE:
      return envAvailability.claudeCode
        ? null
        : `${t("selector.addEnvKey")}: CLAUDE_CODE_ENABLED=true (install claude CLI)`;
    case ApiProvider.OPENAI_IMAGES:
      return envAvailability.openAiImages
        ? null
        : `${t("selector.addEnvKey")}: OPENAI_API_KEY → platform.openai.com/api-keys`;
    case ApiProvider.REPLICATE:
      return envAvailability.replicate
        ? null
        : `${t("selector.addEnvKey")}: REPLICATE_API_TOKEN → replicate.com/account/api-tokens`;
    case ApiProvider.FAL_AI:
      return envAvailability.falAi
        ? null
        : `${t("selector.addEnvKey")}: FAL_AI_API_KEY → fal.ai/dashboard/keys`;
    default:
      return null;
  }
}

export function ModelSelector({
  modelSelection,
  onChange,
  characterModelSelection,
  readOnly = false,
  envAvailability: envAvailabilityProp,
  locale,
  user,
  compact = false,
}: ModelSelectorProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  // Prefer prop (for non-chat contexts), fall back to context (chat pages)
  const envAvailabilityCtx = useEnvAvailability();
  const envAvailability = envAvailabilityProp ?? envAvailabilityCtx;
  // UI state - initialize to CHARACTER_BASED if modelSelection is null and we have character defaults
  const [useSkillBased, setUseSkillBased] = useState(
    !modelSelection && !!characterModelSelection,
  );

  // Reset to CHARACTER_BASED when characterModelSelection changes and we have no modelSelection
  useEffect(() => {
    if (!modelSelection && characterModelSelection) {
      setUseSkillBased(true);
    }
  }, [characterModelSelection, modelSelection]);

  const [showAllModels, setShowAllModels] = useState(false);
  const showUnfilteredModels = false;
  const [showLegacyByGroup, setShowLegacyByGroup] = useState<
    Record<string, boolean>
  >({});
  const [modelTypeTab, setModelTypeTab] = useState<ModelType>("text");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Current selection - use character's selection if in CHARACTER_BASED mode
  const currentSelection =
    useSkillBased && characterModelSelection
      ? characterModelSelection
      : (modelSelection ?? { selectionType: ModelSelectionType.FILTERS });

  // Determine current mode
  const mode = useSkillBased
    ? ModelSelectionType.CHARACTER_BASED
    : currentSelection.selectionType;

  // activeSelection is used for filtering models - use currentSelection
  const activeSelection = currentSelection;

  // For slider UI, show character filters when in CHARACTER_BASED, otherwise show modelSelection filters
  // Both FILTERS and MANUAL types store filter ranges
  const sliderSource =
    useSkillBased && characterModelSelection
      ? characterModelSelection
      : modelSelection;

  const intelligenceIndices = useMemo(
    () =>
      sliderSource && sliderSource.intelligenceRange
        ? getIndicesFromRange(
            sliderSource.intelligenceRange,
            INTELLIGENCE_DISPLAY,
          )
        : { min: 0, max: INTELLIGENCE_DISPLAY.length - 1 },
    [sliderSource],
  );

  const contentIndices = useMemo(
    () =>
      sliderSource && sliderSource.contentRange
        ? getIndicesFromRange(sliderSource.contentRange, CONTENT_DISPLAY)
        : { min: 0, max: CONTENT_DISPLAY.length - 1 },
    [sliderSource],
  );

  const speedIndices = useMemo(
    () =>
      sliderSource && sliderSource.speedRange
        ? getIndicesFromRange(sliderSource.speedRange, SPEED_DISPLAY)
        : { min: 0, max: SPEED_DISPLAY.length - 1 },
    [sliderSource],
  );

  const priceIndices = useMemo(
    () =>
      sliderSource && sliderSource.priceRange
        ? getIndicesFromRange(sliderSource.priceRange, PRICE_DISPLAY)
        : { min: 0, max: PRICE_DISPLAY.length - 1 },
    [sliderSource],
  );

  const manualModelId =
    currentSelection.selectionType === ModelSelectionType.MANUAL
      ? currentSelection.manualModelId
      : undefined;

  // Helper to update value
  const updateValue = (newSelection: ModelSelectionSimple | null): void => {
    if (readOnly || !onChange) {
      return;
    }
    onChange(newSelection);
  };

  // Mode change handlers
  const handleModeChange = (
    newMode:
      | typeof ModelSelectionType.CHARACTER_BASED
      | typeof ModelSelectionType.FILTERS
      | typeof ModelSelectionType.MANUAL,
  ): void => {
    if (newMode === ModelSelectionType.CHARACTER_BASED) {
      // Toggle UI state and set form value to null
      setUseSkillBased(true);
      updateValue(null);
    } else {
      setUseSkillBased(false);

      // Use current slider values (which reflect character filters if coming from CHARACTER_BASED)
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

      if (newMode === ModelSelectionType.MANUAL) {
        // Try to keep current model if available, otherwise use best filtered model
        const currentModel =
          manualModelId ?? bestFilteredModel?.id ?? getAllModelOptions()[0]?.id;
        updateValue({
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: currentModel,
          ...baseProps,
        });
      } else {
        updateValue({
          selectionType: ModelSelectionType.FILTERS,
          ...baseProps,
        });
      }
    }
  };

  // Range change handlers - switch to FILTERS mode when editing (unless already in MANUAL)
  const handleIntelligenceChange = (min: number, max: number): void => {
    setUseSkillBased(false);
    const newType =
      mode === ModelSelectionType.MANUAL
        ? ModelSelectionType.MANUAL
        : ModelSelectionType.FILTERS;

    if (newType === ModelSelectionType.MANUAL && manualModelId) {
      updateValue({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId,
        intelligenceRange: getRangeFromIndices(
          { min, max },
          INTELLIGENCE_DISPLAY,
        ),
        priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
        contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
        speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
        sortBy,
        sortDirection,
        sortBy2,
        sortDirection2,
      });
    } else {
      updateValue({
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
        sortBy2,
        sortDirection2,
      });
    }
  };

  const handleContentChange = (min: number, max: number): void => {
    setUseSkillBased(false);
    const newType =
      mode === ModelSelectionType.MANUAL
        ? ModelSelectionType.MANUAL
        : ModelSelectionType.FILTERS;

    if (newType === ModelSelectionType.MANUAL && manualModelId) {
      updateValue({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId,
        intelligenceRange: getRangeFromIndices(
          intelligenceIndices,
          INTELLIGENCE_DISPLAY,
        ),
        priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
        contentRange: getRangeFromIndices({ min, max }, CONTENT_DISPLAY),
        speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
        sortBy,
        sortDirection,
        sortBy2,
        sortDirection2,
      });
    } else {
      updateValue({
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
        sortBy2,
        sortDirection2,
      });
    }
  };

  const handleSpeedChange = (min: number, max: number): void => {
    setUseSkillBased(false);
    const newType =
      mode === ModelSelectionType.MANUAL
        ? ModelSelectionType.MANUAL
        : ModelSelectionType.FILTERS;

    if (newType === ModelSelectionType.MANUAL && manualModelId) {
      updateValue({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId,
        intelligenceRange: getRangeFromIndices(
          intelligenceIndices,
          INTELLIGENCE_DISPLAY,
        ),
        priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
        contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
        speedRange: getRangeFromIndices({ min, max }, SPEED_DISPLAY),
        sortBy,
        sortDirection,
        sortBy2,
        sortDirection2,
      });
    } else {
      updateValue({
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
        sortBy2,
        sortDirection2,
      });
    }
  };

  const handlePriceChange = (min: number, max: number): void => {
    setUseSkillBased(false);
    const newType =
      mode === ModelSelectionType.MANUAL
        ? ModelSelectionType.MANUAL
        : ModelSelectionType.FILTERS;

    if (newType === ModelSelectionType.MANUAL && manualModelId) {
      updateValue({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId,
        intelligenceRange: getRangeFromIndices(
          intelligenceIndices,
          INTELLIGENCE_DISPLAY,
        ),
        priceRange: getRangeFromIndices({ min, max }, PRICE_DISPLAY),
        contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
        speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
        sortBy,
        sortDirection,
        sortBy2,
        sortDirection2,
      });
    } else {
      updateValue({
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
        sortBy2,
        sortDirection2,
      });
    }
  };

  const handleModelSelect = (modelId: ModelId): void => {
    // When selecting a model, preserve current filter/sort settings
    setUseSkillBased(false);
    updateValue({
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
    });
  };

  // Type tab change handler
  const handleTypeTabChange = (newType: ModelType): void => {
    setModelTypeTab(newType);
    setShowAllModels(false);
    if (newType !== "text") {
      // Image/audio: force MANUAL, auto-select first available model of that type
      setUseSkillBased(false);
      const first = getAllModelOptions().find(
        (m) =>
          m.modelTypes.includes(newType) &&
          isProviderAvailable(m, envAvailability),
      );
      if (first) {
        updateValue({
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: first.id,
        });
      }
    }
  };

  // Get current sort settings from activeSelection (works for both FILTERS and MANUAL)
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

  const sortBy2 =
    activeSelection?.selectionType === ModelSelectionType.FILTERS ||
    activeSelection?.selectionType === ModelSelectionType.MANUAL
      ? activeSelection.sortBy2
      : undefined;

  const sortDirection2 =
    activeSelection?.selectionType === ModelSelectionType.FILTERS ||
    activeSelection?.selectionType === ModelSelectionType.MANUAL
      ? activeSelection.sortDirection2
      : undefined;

  // Sort change handlers - switch to FILTERS mode when editing (unless already in MANUAL)
  const handleSortFieldChange = (
    field: (typeof ModelSortField)[keyof typeof ModelSortField],
  ): void => {
    // Determine sane default direction based on field - always reset when changing field
    // All fields default to DESC (highest/best first, including most expensive for price)
    const defaultDirection = ModelSortDirection.DESC;

    setUseSkillBased(false);
    const newType =
      mode === ModelSelectionType.MANUAL
        ? ModelSelectionType.MANUAL
        : ModelSelectionType.FILTERS;

    if (newType === ModelSelectionType.MANUAL && manualModelId) {
      updateValue({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId,
        intelligenceRange: getRangeFromIndices(
          intelligenceIndices,
          INTELLIGENCE_DISPLAY,
        ),
        priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
        contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
        speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
        sortBy: field,
        sortDirection: defaultDirection,
        sortBy2,
        sortDirection2,
      });
    } else {
      updateValue({
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
        sortBy2,
        sortDirection2,
      });
    }
  };

  const handleSortDirectionToggle = (): void => {
    const newDirection =
      sortDirection === ModelSortDirection.ASC
        ? ModelSortDirection.DESC
        : ModelSortDirection.ASC;

    setUseSkillBased(false);
    const newType =
      mode === ModelSelectionType.MANUAL
        ? ModelSelectionType.MANUAL
        : ModelSelectionType.FILTERS;

    if (newType === ModelSelectionType.MANUAL && manualModelId) {
      updateValue({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId,
        intelligenceRange: getRangeFromIndices(
          intelligenceIndices,
          INTELLIGENCE_DISPLAY,
        ),
        priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
        contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
        speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
        sortBy: sortBy ?? ModelSortField.INTELLIGENCE,
        sortDirection: newDirection,
        sortBy2,
        sortDirection2,
      });
    } else {
      updateValue({
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
        sortBy2,
        sortDirection2,
      });
    }
  };

  const handleSortBy2Change = (
    field: (typeof ModelSortField)[keyof typeof ModelSortField],
  ): void => {
    setUseSkillBased(false);
    const newType =
      mode === ModelSelectionType.MANUAL
        ? ModelSelectionType.MANUAL
        : ModelSelectionType.FILTERS;

    const baseProps = {
      intelligenceRange: getRangeFromIndices(
        intelligenceIndices,
        INTELLIGENCE_DISPLAY,
      ),
      priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
      contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
      speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
    };

    if (newType === ModelSelectionType.MANUAL && manualModelId) {
      updateValue({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId,
        ...baseProps,
        sortBy,
        sortDirection,
        sortBy2: field,
        sortDirection2: ModelSortDirection.DESC,
      });
    } else {
      updateValue({
        selectionType: ModelSelectionType.FILTERS,
        ...baseProps,
        sortBy,
        sortDirection,
        sortBy2: field,
        sortDirection2: ModelSortDirection.DESC,
      });
    }
  };

  const handleSortDirection2Toggle = (): void => {
    const newDirection =
      sortDirection2 === ModelSortDirection.ASC
        ? ModelSortDirection.DESC
        : ModelSortDirection.ASC;

    setUseSkillBased(false);
    const newType =
      mode === ModelSelectionType.MANUAL
        ? ModelSelectionType.MANUAL
        : ModelSelectionType.FILTERS;

    const baseProps = {
      intelligenceRange: getRangeFromIndices(
        intelligenceIndices,
        INTELLIGENCE_DISPLAY,
      ),
      priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
      contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
      speedRange: getRangeFromIndices(speedIndices, SPEED_DISPLAY),
    };

    if (newType === ModelSelectionType.MANUAL && manualModelId) {
      updateValue({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId,
        ...baseProps,
        sortBy,
        sortDirection,
        sortBy2: sortBy2 ?? ModelSortField.PRICE,
        sortDirection2: newDirection,
      });
    } else {
      updateValue({
        selectionType: ModelSelectionType.FILTERS,
        ...baseProps,
        sortBy,
        sortDirection,
        sortBy2: sortBy2 ?? ModelSortField.PRICE,
        sortDirection2: newDirection,
      });
    }
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
    const filtersModelSelection: FiltersModelSelection = {
      selectionType: ModelSelectionType.FILTERS,
      intelligenceRange,
      priceRange,
      contentRange,
      speedRange,
      sortBy,
      sortDirection,
      sortBy2,
      sortDirection2,
    };
    const base = SkillsRepositoryClient.getFilteredModelsForSkill(
      filtersModelSelection,
      user,
    );
    return base.filter((m) => m.modelTypes.includes(modelTypeTab));
  }, [
    intelligenceRange,
    priceRange,
    contentRange,
    speedRange,
    sortBy,
    sortDirection,
    sortBy2,
    sortDirection2,
    user,
    modelTypeTab,
  ]);

  const bestFilteredModel = useMemo(() => {
    return filteredModels.length > 0 ? filteredModels[0] : null;
  }, [filteredModels]);

  const bestModel = useMemo(() => {
    if (mode === ModelSelectionType.MANUAL && manualModelId) {
      return getModelById(manualModelId) ?? null;
    } else if (mode === ModelSelectionType.CHARACTER_BASED) {
      if (characterModelSelection) {
        return SkillsRepositoryClient.getBestModelForSkill(
          characterModelSelection,
          user,
        );
      }
      return null;
    } else {
      return bestFilteredModel;
    }
  }, [mode, manualModelId, bestFilteredModel, characterModelSelection, user]);

  // For non-admins: hide models whose provider is unavailable (admins see them with setup-required styling)
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  const filterUnavailableProviders = (models: ModelOption[]): ModelOption[] => {
    if (isAdmin) {
      return models;
    }
    return models.filter((m) => isProviderAvailable(m, envAvailability));
  };

  // Get models to show (filtered or all), always constrained by type tab
  const modelsToShow = filterUnavailableProviders(
    showUnfilteredModels
      ? getAllModelOptions().filter((m) => m.modelTypes.includes(modelTypeTab))
      : filteredModels,
  );

  // Compute which model names appear with multiple providers (need provider suffix)
  const duplicateModelNames = useMemo(() => {
    const nameCount = new Map<string, number>();
    for (const model of modelsToShow) {
      nameCount.set(model.name, (nameCount.get(model.name) ?? 0) + 1);
    }
    return new Set(
      [...nameCount.entries()]
        .filter(([, count]) => count > 1)
        .map(([name]) => name),
    );
  }, [modelsToShow]);

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
        case ModelSortField.PRICE: {
          const cost = getCreditCostFromModel(
            model,
            DEFAULT_INPUT_TOKENS,
            DEFAULT_OUTPUT_TOKENS,
          );
          return {
            value: cost,
            label:
              cost === 0
                ? t("selector.free")
                : cost === 1
                  ? t("selector.creditsSingle")
                  : t("selector.creditsExact", { cost }),
          };
        }
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

    // modelsToShow is already sorted by filteredModels (primary + secondary sort)
    // Just group by primary sort label, preserving existing order within groups
    const grouped: Record<string, ModelOption[]> = {};
    for (const model of modelsToShow) {
      const { label } = getSortInfo(model);
      if (!grouped[label]) {
        grouped[label] = [];
      }
      grouped[label].push(model);
    }

    return grouped;
  }, [modelsToShow, sortBy, t]);

  // Get display models (limited or all)
  const displayModels = useMemo(() => {
    if (
      Object.keys(sortedAndGroupedModels).length === 1 &&
      sortedAndGroupedModels.ungrouped
    ) {
      const ungrouped = sortedAndGroupedModels.ungrouped;
      if (showAllModels) {
        return ungrouped;
      }
      const slice = ungrouped.slice(0, 3);
      // In MANUAL mode, pin the selected model to the top if it's not in the slice
      if (
        mode === ModelSelectionType.MANUAL &&
        manualModelId &&
        !slice.some((m) => m.id === manualModelId)
      ) {
        const selected = ungrouped.find((m) => m.id === manualModelId);
        if (selected) {
          return [selected, ...slice.slice(0, 2)];
        }
      }
      return slice;
    }
    // With grouping - return all groups (show more/less handled per group)
    return sortedAndGroupedModels;
  }, [sortedAndGroupedModels, showAllModels, mode, manualModelId]);

  // Available type tabs (only show tabs that have at least 1 accessible model)
  const allModels = useMemo(() => getAllModelOptions(), []);
  const availableTypes = useMemo((): ModelType[] => {
    const types: ModelType[] = ["text"];
    const hasImage = allModels.some(
      (m) =>
        m.modelTypes.includes("image") &&
        (isAdmin || isProviderAvailable(m, envAvailability)),
    );
    const hasAudio = allModels.some(
      (m) =>
        m.modelTypes.includes("audio") &&
        (isAdmin || isProviderAvailable(m, envAvailability)),
    );
    if (hasImage) {
      types.push("image");
    }
    if (hasAudio) {
      types.push("audio");
    }
    return types;
  }, [allModels, isAdmin, envAvailability]);

  const activeFilterChips = buildFilterChips({
    intelligenceIndices,
    contentIndices,
    speedIndices,
    priceIndices,
    sortBy,
    sortDirection,
    sortBy2,
    sortDirection2,
    t,
    mode,
    manualModelId,
    handleIntelligenceChange,
    handleContentChange,
    handleSpeedChange,
    handlePriceChange,
    setUseSkillBased,
    updateValue,
  });

  return (
    <TooltipProvider>
      <Div
        className={
          compact
            ? "flex flex-col gap-3"
            : "flex flex-col gap-4 border rounded-lg p-4"
        }
      >
        {/* Type tabs - Chat / Image / Audio */}
        {!compact && availableTypes.length > 1 && (
          <Div className="flex items-center gap-1 p-0.5 bg-muted/40 rounded-lg">
            {availableTypes.map((type) => (
              <Button
                key={type}
                type="button"
                variant={modelTypeTab === type ? "default" : "ghost"}
                size="sm"
                className="flex-1 h-7 text-xs"
                onClick={() => handleTypeTabChange(type)}
                disabled={readOnly}
              >
                {type === "text"
                  ? t("selector.typeChat")
                  : type === "image"
                    ? t("selector.typeImage")
                    : t("selector.typeAudio")}
              </Button>
            ))}
          </Div>
        )}

        {/* Model selection mode tabs */}
        <Div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-lg">
          {characterModelSelection && (
            <Button
              type="button"
              variant={
                mode === ModelSelectionType.CHARACTER_BASED
                  ? "default"
                  : "ghost"
              }
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() =>
                handleModeChange(ModelSelectionType.CHARACTER_BASED)
              }
              disabled={readOnly}
            >
              {t("selector.skillMode")}
            </Button>
          )}
          <Button
            type="button"
            variant={mode === ModelSelectionType.FILTERS ? "default" : "ghost"}
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={() => handleModeChange(ModelSelectionType.FILTERS)}
            disabled={readOnly}
          >
            {t("selector.autoMode")}
          </Button>
          <Button
            type="button"
            variant={mode === ModelSelectionType.MANUAL ? "default" : "ghost"}
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={() => handleModeChange(ModelSelectionType.MANUAL)}
            disabled={readOnly}
          >
            {t("selector.manualMode")}
          </Button>
        </Div>

        {/* Model preview card */}
        {bestModel ? (
          <Div className="flex items-start gap-3 p-3 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl shadow-lg backdrop-blur-sm">
            <Div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center shrink-0 shadow-inner">
              <Icon icon={bestModel.icon} className="h-5 w-5 text-primary" />
            </Div>
            <Div className="flex-1 min-w-0">
              <Span className="block text-[10px] text-primary/80 uppercase tracking-wider font-bold mb-1">
                {mode === ModelSelectionType.FILTERS
                  ? t("selector.autoSelectedModel")
                  : mode === ModelSelectionType.MANUAL
                    ? t("selector.manualSelectedModel")
                    : t("selector.skillSelectedModel")}
              </Span>
              <Span className="text-sm font-bold text-primary block truncate">
                {bestModel.name}
                {duplicateModelNames.has(bestModel.name) ? (
                  <Span className="text-muted-foreground font-normal text-xs">
                    {` (${apiProviderDisplayNames[bestModel.apiProvider]})`}
                  </Span>
                ) : null}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {bestModel.provider && modelProviders[bestModel.provider]
                  ? modelProviders[bestModel.provider].name
                  : "Unknown"}
              </Span>
            </Div>
            <ModelCreditDisplay
              modelId={bestModel.id}
              variant="badge"
              badgeVariant="secondary"
              className="text-[10px] h-5 shrink-0 bg-background/60"
              locale={locale}
            />
          </Div>
        ) : (
          <Div className="flex items-center gap-2 p-3 bg-destructive/10 border-2 border-destructive/30 rounded-xl">
            <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
            <Span className="text-xs font-medium text-destructive">
              {mode === ModelSelectionType.MANUAL
                ? t("selector.selectModelBelow")
                : t("selector.noModelsWarning")}
            </Span>
          </Div>
        )}

        {/* Filters + Sort rows - only for text/chat models */}
        {modelTypeTab === "text" && (
          <Div className="flex flex-col gap-2">
            {/* Row 1: Filters */}
            <Div className="flex items-center gap-2 flex-wrap">
              {/* Filters popover */}
              <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={
                      activeFilterChips.filter(
                        (c) => c.key !== "sort" && c.key !== "sort2",
                      ).length > 0
                        ? "secondary"
                        : "outline"
                    }
                    size="sm"
                    className={cn(
                      "h-7 gap-1.5 text-xs shrink-0",
                      activeFilterChips.filter(
                        (c) => c.key !== "sort" && c.key !== "sort2",
                      ).length > 0 &&
                        "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20",
                    )}
                    disabled={readOnly}
                  >
                    <Filter className="h-3 w-3" />
                    {activeFilterChips.filter(
                      (c) => c.key !== "sort" && c.key !== "sort2",
                    ).length > 0
                      ? t("selector.filtersActive", {
                          count: activeFilterChips.filter(
                            (c) => c.key !== "sort" && c.key !== "sort2",
                          ).length,
                        })
                      : t("selector.filters")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-96 p-3 flex flex-col gap-3 overflow-y-auto max-h-[min(420px,80svh)]"
                  align="start"
                  side="top"
                  sideOffset={8}
                >
                  <RangeSlider
                    options={INTELLIGENCE_DISPLAY.map((opt) => ({
                      ...opt,
                      label: t(opt.label),
                      description: opt.description
                        ? t(opt.description)
                        : undefined,
                    }))}
                    minIndex={intelligenceIndices.min}
                    maxIndex={intelligenceIndices.max}
                    onChange={handleIntelligenceChange}
                    minLabel={t("ranges.intelligenceRange.minLabel")}
                    maxLabel={t("ranges.intelligenceRange.maxLabel")}
                    disabled={readOnly}
                  />
                  <RangeSlider
                    options={CONTENT_DISPLAY.map((opt) => ({
                      ...opt,
                      label: t(opt.label),
                      description: opt.description
                        ? t(opt.description)
                        : undefined,
                    }))}
                    minIndex={contentIndices.min}
                    maxIndex={contentIndices.max}
                    onChange={handleContentChange}
                    minLabel={t("ranges.contentRange.minLabel")}
                    maxLabel={t("ranges.contentRange.maxLabel")}
                    disabled={readOnly}
                  />
                  <RangeSlider
                    options={SPEED_DISPLAY.map((opt) => ({
                      ...opt,
                      label: t(opt.label),
                      description: opt.description
                        ? t(opt.description)
                        : undefined,
                    }))}
                    minIndex={speedIndices.min}
                    maxIndex={speedIndices.max}
                    onChange={handleSpeedChange}
                    minLabel={t("ranges.speedRange.minLabel")}
                    maxLabel={t("ranges.speedRange.maxLabel")}
                    disabled={readOnly}
                  />
                  <RangeSlider
                    options={PRICE_DISPLAY.map((opt) => ({
                      ...opt,
                      label: t(opt.label),
                      description: opt.description
                        ? t(opt.description)
                        : undefined,
                    }))}
                    minIndex={priceIndices.min}
                    maxIndex={priceIndices.max}
                    onChange={handlePriceChange}
                    minLabel={t("ranges.priceRange.minLabel")}
                    maxLabel={t("ranges.priceRange.maxLabel")}
                    disabled={readOnly}
                  />
                </PopoverContent>
              </Popover>

              {/* Active filter chips (range filters only) */}
              {activeFilterChips
                .filter((c) => c.key !== "sort" && c.key !== "sort2")
                .map((chip) => (
                  <Div
                    key={chip.key}
                    className="flex items-center gap-1 h-7 px-2 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs font-medium"
                  >
                    <Span>{chip.label}</Span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-primary/20 rounded-sm ml-0.5"
                      onClick={chip.onRemove}
                      disabled={readOnly}
                    >
                      <X className="h-2.5 w-2.5" />
                    </Button>
                  </Div>
                ))}
            </Div>

            {/* Row 2: Sort */}
            <Div className="flex items-center gap-2 flex-wrap">
              {/* Sort popover - already rendered above, move trigger here */}
              <Popover open={sortOpen} onOpenChange={setSortOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={sortBy ? "secondary" : "outline"}
                    size="sm"
                    className={cn(
                      "h-7 gap-1.5 text-xs shrink-0",
                      sortBy &&
                        "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20",
                    )}
                    disabled={readOnly}
                  >
                    <ArrowDown className="h-3 w-3" />
                    {t("selector.sortBy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-72 p-3 flex flex-col gap-3"
                  align="start"
                  side="top"
                  sideOffset={8}
                >
                  <Div className="flex flex-col gap-1.5">
                    <Span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                      {t("selector.sortBy")}
                    </Span>
                    <Div className="flex flex-wrap gap-1">
                      {ModelSortFieldOptions.map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={
                            sortBy === option.value ? "default" : "outline"
                          }
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={() =>
                            sortBy === option.value
                              ? handleSortDirectionToggle()
                              : handleSortFieldChange(option.value)
                          }
                          disabled={readOnly}
                        >
                          {t(option.label)}
                          {sortBy === option.value &&
                            (sortDirection === ModelSortDirection.ASC ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            ))}
                        </Button>
                      ))}
                    </Div>
                  </Div>
                  {sortBy && (
                    <Div className="flex flex-col gap-1.5">
                      <Span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                        {t("selector.sortThen")}
                      </Span>
                      <Div className="flex flex-wrap gap-1">
                        {ModelSortFieldOptions.filter(
                          (o) => o.value !== sortBy,
                        ).map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            variant={
                              sortBy2 === option.value ? "default" : "outline"
                            }
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() =>
                              sortBy2 === option.value
                                ? handleSortDirection2Toggle()
                                : handleSortBy2Change(option.value)
                            }
                            disabled={readOnly}
                          >
                            {t(option.label)}
                            {sortBy2 === option.value &&
                              (sortDirection2 === ModelSortDirection.ASC ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              ))}
                          </Button>
                        ))}
                      </Div>
                    </Div>
                  )}
                </PopoverContent>
              </Popover>

              {/* Active sort chips */}
              {activeFilterChips
                .filter((c) => c.key === "sort" || c.key === "sort2")
                .map((chip) => (
                  <Div
                    key={chip.key}
                    className="flex items-center gap-1 h-7 px-2 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs font-medium"
                  >
                    <Span>{chip.label}</Span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-primary/20 rounded-sm ml-0.5"
                      onClick={chip.onRemove}
                      disabled={readOnly}
                    >
                      <X className="h-2.5 w-2.5" />
                    </Button>
                  </Div>
                ))}
            </Div>
          </Div>
        )}

        {/* Models list */}
        <Div className="flex flex-col gap-3">
          {/* Model list */}
          {Array.isArray(displayModels) ? (
            // Ungrouped list
            displayModels.length > 0 ? (
              <Div className="flex flex-col gap-2">
                {displayModels.map((model: ModelOption) => {
                  const isOutsideFilter =
                    showUnfilteredModels &&
                    !filteredModels.some((m: ModelOption) => m.id === model.id);
                  const setupRequired = getSetupRequiredMessage(
                    model,
                    envAvailability,
                    locale,
                  );
                  return (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isBest={
                        mode !== ModelSelectionType.MANUAL &&
                        model.id === bestFilteredModel?.id
                      }
                      selected={
                        mode === ModelSelectionType.MANUAL &&
                        manualModelId === model.id
                      }
                      onClick={() => handleModelSelect(model.id)}
                      dimmed={isOutsideFilter}
                      disabled={readOnly}
                      setupRequired={setupRequired}
                      providerSuffix={
                        duplicateModelNames.has(model.name)
                          ? apiProviderDisplayNames[model.apiProvider]
                          : null
                      }
                      t={t}
                      locale={locale}
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
                    disabled={readOnly}
                  >
                    {showAllModels ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        {t("selector.showLess")}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        {t("selector.showMore", {
                          count: modelsToShow.length - 3,
                        })}
                      </>
                    )}
                  </Button>
                )}
              </Div>
            ) : (
              <Div className="p-4 text-center text-sm text-muted-foreground border rounded-lg">
                {t("selector.noMatchingModels")}
              </Div>
            )
          ) : (
            // Grouped list
            <Div className="flex flex-col gap-4">
              {Object.entries(displayModels).map(
                ([groupLabel, groupModels]) => {
                  const models = groupModels as ModelOption[];

                  // Separate legacy and non-legacy models
                  const nonLegacyModels = models.filter(
                    (model) => !model.utilities.includes(ModelUtility.LEGACY),
                  );
                  const legacyModels = models.filter((model) =>
                    model.utilities.includes(ModelUtility.LEGACY),
                  );

                  const showingLegacy = showLegacyByGroup[groupLabel] ?? false;
                  const visibleModels = showingLegacy
                    ? models
                    : nonLegacyModels;

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
                          const setupRequired = getSetupRequiredMessage(
                            model,
                            envAvailability,
                            locale,
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
                              disabled={readOnly}
                              setupRequired={setupRequired}
                              providerSuffix={
                                duplicateModelNames.has(model.name)
                                  ? apiProviderDisplayNames[model.apiProvider]
                                  : null
                              }
                              t={t}
                              locale={locale}
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
                              {t("selector.showLegacyModels", {
                                count: legacyModels.length,
                              })}
                            </Span>
                          </Div>
                        )}
                      </Div>
                    </Div>
                  );
                },
              )}
            </Div>
          )}
        </Div>
      </Div>
    </TooltipProvider>
  );
}
