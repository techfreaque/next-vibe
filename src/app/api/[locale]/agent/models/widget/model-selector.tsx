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
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Filter } from "next-vibe-ui/ui/icons/Filter";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { X } from "next-vibe-ui/ui/icons/X";
import { Input } from "next-vibe-ui/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { RangeSlider } from "next-vibe-ui/ui/range-slider";
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
  ChatModelId,
  chatModelOptions,
  filterChatModels,
  getBestChatModel,
} from "@/app/api/[locale]/agent/ai-stream/models";
import {
  AudioVisionModelId,
  filterAudioVisionModels,
  filterImageVisionModels,
  filterVideoVisionModels,
  getBestAudioVisionModel,
  getBestImageVisionModel,
  getBestVideoVisionModel,
  ImageVisionModelId,
  VideoVisionModelId,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import {
  CONTENT_DISPLAY,
  INTELLIGENCE_DISPLAY,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  ModelSortFieldOptions,
  PRICE_DISPLAY,
} from "@/app/api/[locale]/agent/chat/skills/enum";
import { agentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import {
  filterImageGenModels,
  getBestImageGenModel,
  ImageGenModelId,
  imageGenModelOptions,
} from "@/app/api/[locale]/agent/image-generation/models";
import {
  getModelPrice,
  type AnyModelOptionWithVision,
} from "@/app/api/[locale]/agent/models/all-models";
import type { Modality, ModelRole } from "@/app/api/[locale]/agent/models/enum";
import { ModelUtility } from "@/app/api/[locale]/agent/models/enum";
import {
  ApiProvider,
  apiProviderDisplayNames,
  isModelProviderAvailable,
  modelProviders,
  type AnyModelId,
  type AnyModelOption,
  type ModelType,
} from "@/app/api/[locale]/agent/models/models";
import {
  filterMusicGenModels,
  getBestMusicGenModel,
  MusicGenModelId,
  musicGenModelOptions,
} from "@/app/api/[locale]/agent/music-generation/models";
import {
  filterSttModels,
  getBestSttModel,
  SttModelId,
  sttModelOptions,
} from "@/app/api/[locale]/agent/speech-to-text/models";
import {
  filterTtsModels,
  getBestTtsModel,
  TtsModelId,
  ttsModelOptions,
} from "@/app/api/[locale]/agent/text-to-speech/models";
import {
  filterVideoGenModels,
  getBestVideoGenModel,
  VideoGenModelId,
  videoGenModelOptions,
} from "@/app/api/[locale]/agent/video-generation/models";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";
import type {
  AnyRoleModelSelection,
  FiltersModelSelection,
} from "../selection";
import { ModelCreditDisplay } from "./model-credit-display";

/** Combine all role-specific model options into a single flat array. */
function getAllModelOptions(): AnyModelOption[] {
  return [
    ...chatModelOptions,
    ...ttsModelOptions,
    ...sttModelOptions,
    ...imageGenModelOptions,
    ...musicGenModelOptions,
    ...videoGenModelOptions,
  ];
}

/**
 * Look up a model option by ID across all roles.
 * Local implementation - avoids importing cross-role utility from models.ts.
 */
function lookupModelById(id: AnyModelId): AnyModelOption | undefined {
  return (
    chatModelOptions.find((m) => m.id === id) ??
    imageGenModelOptions.find((m) => m.id === id) ??
    musicGenModelOptions.find((m) => m.id === id) ??
    videoGenModelOptions.find((m) => m.id === id) ??
    ttsModelOptions.find((m) => m.id === id) ??
    sttModelOptions.find((m) => m.id === id)
  );
}

/**
 * Returns true when a ModelOption belongs to the given ModelRole.
 * Local implementation - avoids importing cross-role utility from models.ts.
 * Uses enum membership for correctness (multimodal models share structural fields).
 */
function modelMatchesRoleLocal(
  m: AnyModelOptionWithVision,
  role: ModelRole,
): boolean {
  switch (role) {
    case "image-gen":
      return Object.values(ImageGenModelId).some((v) => v === m.id);
    case "video-gen":
      return Object.values(VideoGenModelId).some((v) => v === m.id);
    case "audio-gen":
      return Object.values(MusicGenModelId).some((v) => v === m.id);
    case "tts":
      return Object.values(TtsModelId).some((v) => v === m.id);
    case "stt":
      return Object.values(SttModelId).some((v) => v === m.id);
    case "llm":
      return Object.values(ChatModelId).some((v) => v === m.id);
    case "image-vision":
      return Object.values(ImageVisionModelId).some((v) => v === m.id);
    case "video-vision":
      return Object.values(VideoVisionModelId).some((v) => v === m.id);
    case "audio-vision":
      return Object.values(AudioVisionModelId).some((v) => v === m.id);
    default:
      return false;
  }
}

/**
 * Returns all UI tab types a model should appear in.
 * Local implementation - avoids importing cross-role utility from models.ts.
 * Image-gen models that also output text (multimodal, e.g. Gemini) appear in both text and image tabs.
 */
function modelOptionToTypes(m: AnyModelOptionWithVision): ModelType[] {
  if (Object.values(ImageGenModelId).some((v) => v === m.id)) {
    // Image-gen models that also output text appear in the text tab too
    if (m.outputs.includes("text")) {
      return ["text", "image"];
    }
    return ["image"];
  }
  if (
    Object.values(MusicGenModelId).some((v) => v === m.id) ||
    Object.values(TtsModelId).some((v) => v === m.id) ||
    Object.values(SttModelId).some((v) => v === m.id)
  ) {
    return ["audio"];
  }
  if (Object.values(VideoGenModelId).some((v) => v === m.id)) {
    return ["video"];
  }
  return ["text"]; // chat/llm
}

type AnyRoleSelection = AnyRoleModelSelection;

/** Dispatch to role-specific filtered model getter based on allowedRoles. */
function getFilteredModelsByRoleDispatch(
  selection: AnyRoleModelSelection | null,
  roles: ModelRole[],
  user: JwtPayloadType,
): AnyModelOptionWithVision[] {
  // Extract shared filter props - valid for all role getters regardless of manual ID
  const filters: FiltersModelSelection | null = selection
    ? {
        selectionType: ModelSelectionType.FILTERS,
        intelligenceRange: selection.intelligenceRange,
        priceRange: selection.priceRange,
        contentRange: selection.contentRange,
        sortBy: selection.sortBy,
        sortDirection: selection.sortDirection,
        sortBy2: selection.sortBy2,
        sortDirection2: selection.sortDirection2,
      }
    : null;

  const results: AnyModelOptionWithVision[] = [];
  for (const role of roles) {
    switch (role) {
      case "tts":
        results.push(...filterTtsModels(filters, user));
        break;
      case "stt":
        results.push(...filterSttModels(filters, user));
        break;
      case "image-gen":
        results.push(...filterImageGenModels(filters, user));
        break;
      case "audio-gen":
        results.push(...filterMusicGenModels(filters, user));
        break;
      case "video-gen":
        results.push(...filterVideoGenModels(filters, user));
        break;
      case "llm":
        results.push(
          ...filterChatModels(
            filters ?? { selectionType: ModelSelectionType.FILTERS },
            user,
          ),
        );
        break;
      case "image-vision":
        results.push(...filterImageVisionModels(filters, user));
        break;
      case "video-vision":
        results.push(...filterVideoVisionModels(filters, user));
        break;
      case "audio-vision":
        results.push(...filterAudioVisionModels(filters, user));
        break;
      default:
        break;
    }
  }
  return results;
}

/** Dispatch to role-specific best model getter based on allowedRoles (first role wins). */
function getBestModelByRoleDispatch(
  selection: AnyRoleModelSelection,
  roles: ModelRole[],
  user: JwtPayloadType,
): AnyModelOptionWithVision | null {
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);

  // MANUAL selections: resolve by model ID first, only fall through to filters
  // if the specific model can't be found or is unavailable
  if (
    selection.selectionType === ModelSelectionType.MANUAL &&
    "manualModelId" in selection &&
    selection.manualModelId
  ) {
    const model = lookupModelById(selection.manualModelId);
    if (
      model &&
      (!model.adminOnly || isAdmin) &&
      isModelProviderAvailable(model) &&
      roles.some((role) => modelMatchesRoleLocal(model, role))
    ) {
      return model;
    }
    // Manual model not resolvable - fall through to filter-based resolution below
  }

  // Extract filter props as a FiltersModelSelection for role-specific getters
  const filtersSelection: FiltersModelSelection = {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: selection.intelligenceRange,
    priceRange: selection.priceRange,
    contentRange: selection.contentRange,
    sortBy: selection.sortBy,
    sortDirection: selection.sortDirection,
    sortBy2: selection.sortBy2,
    sortDirection2: selection.sortDirection2,
  };
  for (const role of roles) {
    let result: AnyModelOptionWithVision | null = null;
    switch (role) {
      case "tts":
        result = getBestTtsModel(filtersSelection, user);
        break;
      case "stt":
        result = getBestSttModel(filtersSelection, user);
        break;
      case "image-gen":
        result = getBestImageGenModel(filtersSelection, user);
        break;
      case "audio-gen":
        result = getBestMusicGenModel(filtersSelection, user);
        break;
      case "video-gen":
        result = getBestVideoGenModel(filtersSelection, user);
        break;
      case "llm":
        result = getBestChatModel(filtersSelection, user);
        break;
      case "image-vision":
        result = getBestImageVisionModel(filtersSelection, user);
        break;
      case "video-vision":
        result = getBestVideoVisionModel(filtersSelection, user);
        break;
      case "audio-vision":
        result = getBestAudioVisionModel(filtersSelection, user);
        break;
      default:
        break;
    }
    if (result) {
      return result;
    }
  }
  return null;
}

interface ModelCardProps {
  model: AnyModelOptionWithVision;
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
  /** Optional className applied to the model name text */
  nameClassName?: string;
}

export function ModelCard({
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
  nameClassName,
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
              nameClassName,
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
  handlePriceChange,
  setUseSkillBased,
  updateValue,
  buildManualSelection,
}: {
  intelligenceIndices: RangeIndices;
  contentIndices: RangeIndices;
  priceIndices: RangeIndices;
  sortBy: ReturnType<typeof scopedTranslation.scopedT>["t"] extends never
    ? never
    : (typeof ModelSortField)[keyof typeof ModelSortField] | undefined;
  sortDirection:
    | (typeof ModelSortDirection)[keyof typeof ModelSortDirection]
    | undefined;
  sortBy2: ReturnType<typeof scopedTranslation.scopedT>["t"] extends never
    ? never
    : (typeof ModelSortField)[keyof typeof ModelSortField] | undefined;
  sortDirection2:
    | (typeof ModelSortDirection)[keyof typeof ModelSortDirection]
    | undefined;
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
  mode: string;
  manualModelId: AnyModelId | undefined;
  handleIntelligenceChange: (min: number, max: number) => void;
  handleContentChange: (min: number, max: number) => void;
  handlePriceChange: (min: number, max: number) => void;
  setUseSkillBased: (v: boolean) => void;
  updateValue: (s: AnyRoleModelSelection | null) => void;
  buildManualSelection: (
    modelId: AnyModelId,
    overrides?: Partial<Omit<FiltersModelSelection, "selectionType">>,
  ) => AnyRoleModelSelection;
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
      label: `${dir} ${t(sortBy)}`,
      onRemove: () => {
        setUseSkillBased(false);
        const rangeProps = {
          intelligenceRange: getRangeFromIndices(
            intelligenceIndices,
            INTELLIGENCE_DISPLAY,
          ),
          priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
          contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
          sortBy: undefined,
          sortDirection: undefined,
          sortBy2: undefined,
          sortDirection2: undefined,
        };
        if (mode === ModelSelectionType.MANUAL && manualModelId) {
          updateValue(
            buildManualSelection(manualModelId, {
              sortBy: undefined,
              sortDirection: undefined,
              sortBy2: undefined,
              sortDirection2: undefined,
            }),
          );
        } else {
          updateValue({
            selectionType: ModelSelectionType.FILTERS,
            ...rangeProps,
          });
        }
      },
    });
  }
  if (sortBy2) {
    const dir2 = sortDirection2 === ModelSortDirection.ASC ? "↑" : "↓";
    chips.push({
      key: "sort2",
      label: `then ${dir2} ${t(sortBy2)}`,
      onRemove: () => {
        setUseSkillBased(false);
        const filterProps = {
          intelligenceRange: getRangeFromIndices(
            intelligenceIndices,
            INTELLIGENCE_DISPLAY,
          ),
          priceRange: getRangeFromIndices(priceIndices, PRICE_DISPLAY),
          contentRange: getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
          sortBy,
          sortDirection,
          sortBy2: undefined,
          sortDirection2: undefined,
        } as const;
        if (mode === ModelSelectionType.MANUAL && manualModelId) {
          updateValue(
            buildManualSelection(manualModelId, {
              sortBy2: undefined,
              sortDirection2: undefined,
            }),
          );
        } else {
          const newSel: FiltersModelSelection = {
            selectionType: ModelSelectionType.FILTERS,
            ...filterProps,
          };
          updateValue(newSel);
        }
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
  modelSelection: AnyRoleModelSelection | undefined;

  /**
   * Callback when selection changes (optional for read-only mode)
   */
  onChange?: (selection: AnyRoleModelSelection | null) => void;

  /**
   * Callback fired only when the user explicitly clicks a model row to confirm selection.
   * Receives the confirmed value so callers can apply isDefault checks and close the panel.
   * Unlike onChange which fires on every tab/filter change.
   */
  onSelect?: (value: AnyRoleModelSelection | null) => void | Promise<void>;

  /**
   * Skill's model selection (optional, for CHARACTER_BASED mode)
   */
  characterModelSelection?:
    | AnyRoleSelection
    | AnyRoleModelSelection
    | undefined;

  /**
   * Read-only mode - disables all interactions
   */
  readOnly?: boolean;

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

  /**
   * Chat-only mode - restricts model selector to LLM (text) models only.
   * Hides Image/Audio type tabs. Use when selecting a chat LLM, not a media model.
   */
  chatOnly?: boolean;

  /**
   * When set, show only models whose modelRole is in this array (bypasses LLM hard-filter).
   * Use for TTS, STT, image-gen, music-gen, vision-bridge selectors.
   * When undefined, defaults to LLM-only behavior.
   */
  allowedRoles?: ModelRole[];

  /**
   * When set, only show models whose `inputs` array includes ALL of these modalities.
   * Use for vision-bridge (requiredInputs={["image"]}) to filter LLMs to vision-capable ones.
   */
  requiredInputs?: Modality[];
}

/** Returns true if the model's provider is available given current env */
function isProviderAvailable(model: AnyModelOptionWithVision): boolean {
  return isModelProviderAvailable(model);
}

/** Map ApiProvider to the availability key */
function getSetupRequiredMessage(
  model: AnyModelOptionWithVision,
  locale: CountryLanguage,
): string | null {
  const t = scopedTranslation.scopedT(locale).t;
  switch (model.apiProvider) {
    case ApiProvider.OPENROUTER:
      return agentEnvAvailability.openRouter
        ? null
        : `${t("selector.addEnvKey")}: OPENROUTER_API_KEY → openrouter.ai/keys`;
    case ApiProvider.UNCENSORED_AI:
      return agentEnvAvailability.uncensoredAI
        ? null
        : `${t("selector.addEnvKey")}: UNCENSORED_AI_API_KEY`;
    case ApiProvider.FREEDOMGPT:
      return agentEnvAvailability.freedomGPT
        ? null
        : `${t("selector.addEnvKey")}: FREEDOMGPT_API_KEY`;
    case ApiProvider.GAB_AI:
      return agentEnvAvailability.gabAI
        ? null
        : `${t("selector.addEnvKey")}: GAB_AI_API_KEY`;
    case ApiProvider.VENICE_AI:
      return agentEnvAvailability.veniceAI
        ? null
        : `${t("selector.addEnvKey")}: VENICE_AI_API_KEY → venice.ai`;
    case ApiProvider.CLAUDE_CODE:
      return agentEnvAvailability.claudeCode
        ? null
        : `${t("selector.addEnvKey")}: CLAUDE_CODE_ENABLED=true (install claude CLI)`;
    case ApiProvider.OPENAI_IMAGES:
      return agentEnvAvailability.openAiImages
        ? null
        : `${t("selector.addEnvKey")}: OPENAI_API_KEY → platform.openai.com/api-keys`;
    case ApiProvider.REPLICATE:
      return agentEnvAvailability.replicate
        ? null
        : `${t("selector.addEnvKey")}: REPLICATE_API_TOKEN → replicate.com/account/api-tokens`;
    case ApiProvider.FAL_AI:
      return agentEnvAvailability.falAi
        ? null
        : `${t("selector.addEnvKey")}: FAL_AI_API_KEY → fal.ai/dashboard/keys`;
    case ApiProvider.MODELSLAB:
      return agentEnvAvailability.modelsLab
        ? null
        : `${t("selector.addEnvKey")}: MODELSLAB_API_KEY → modelslab.com`;
    default:
      return null;
  }
}

export function ModelSelector({
  modelSelection,
  onChange,
  onSelect,
  characterModelSelection,
  readOnly = false,
  locale,
  user,
  compact = false,
  chatOnly = false,
  allowedRoles,
  requiredInputs,
}: ModelSelectorProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  // UI state - initialize to CHARACTER_BASED if modelSelection is null or matches the character selection
  const isMatchingCharacterSelection =
    !!modelSelection &&
    !!characterModelSelection &&
    modelSelection.selectionType === ModelSelectionType.MANUAL &&
    characterModelSelection.selectionType === ModelSelectionType.MANUAL &&
    modelSelection.manualModelId === characterModelSelection.manualModelId;
  const [useSkillBased, setUseSkillBased] = useState(
    (!modelSelection || isMatchingCharacterSelection) &&
      !!characterModelSelection,
  );

  // Reset to CHARACTER_BASED when characterModelSelection changes and we have no modelSelection (or matching)
  useEffect(() => {
    if (
      (!modelSelection ||
        (modelSelection.selectionType === ModelSelectionType.MANUAL &&
          characterModelSelection?.selectionType ===
            ModelSelectionType.MANUAL &&
          modelSelection.manualModelId ===
            characterModelSelection.manualModelId)) &&
      characterModelSelection
    ) {
      setUseSkillBased(true);
    }
  }, [characterModelSelection, modelSelection]);

  const [searchQuery, setSearchQuery] = useState("");
  const showUnfilteredModels = false;
  const [showLegacyByGroup, setShowLegacyByGroup] = useState<
    Record<string, boolean>
  >({});
  // When allowedRoles is set, default tab to the appropriate type
  const defaultModelTypeTab = useMemo((): ModelType => {
    if (!allowedRoles) {
      return "text";
    }
    if (allowedRoles.includes("image-gen")) {
      return "image";
    }
    if (allowedRoles.includes("video-gen")) {
      return "video";
    }
    if (
      allowedRoles.includes("tts") ||
      allowedRoles.includes("stt") ||
      allowedRoles.includes("audio-gen")
    ) {
      return "audio";
    }
    return "text";
  }, [allowedRoles]);
  const [modelTypeTab, setModelTypeTab] =
    useState<ModelType>(defaultModelTypeTab);
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

  const priceIndices = useMemo(
    () =>
      sliderSource && sliderSource.priceRange
        ? getIndicesFromRange(sliderSource.priceRange, PRICE_DISPLAY)
        : { min: 0, max: PRICE_DISPLAY.length - 1 },
    [sliderSource],
  );

  const manualModelId: AnyModelId | undefined = (() => {
    if (
      modelSelection &&
      "manualModelId" in modelSelection &&
      typeof modelSelection.manualModelId === "string"
    ) {
      return modelSelection.manualModelId;
    }
    if (
      useSkillBased &&
      characterModelSelection &&
      characterModelSelection.selectionType === ModelSelectionType.MANUAL
    ) {
      return characterModelSelection.manualModelId;
    }
    return undefined;
  })();

  // Helper to update value
  const updateValue = (newSelection: AnyRoleModelSelection | null): void => {
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
    setSearchQuery("");
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
        sortBy,
        sortDirection,
      };

      if (newMode === ModelSelectionType.MANUAL) {
        // Try to keep current model, otherwise pick first available filtered model
        const firstAvailable = filteredModels.find((m) =>
          isProviderAvailable(m),
        );
        const currentModel =
          manualModelId ??
          firstAvailable?.id ??
          filteredModels[0]?.id ??
          getAllModelOptions()[0]?.id;
        if (currentModel) {
          updateValue(buildManualSelection(currentModel, baseProps));
        }
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
    const override = {
      intelligenceRange: getRangeFromIndices(
        { min, max },
        INTELLIGENCE_DISPLAY,
      ),
    };
    if (manualModelId) {
      updateValue(buildManualSelection(manualModelId, override));
    } else {
      updateValue({
        selectionType: ModelSelectionType.FILTERS,
        priceRange,
        contentRange,
        sortBy,
        sortDirection,
        sortBy2,
        sortDirection2,
        ...override,
      });
    }
  };

  const handleContentChange = (min: number, max: number): void => {
    setUseSkillBased(false);
    const override = {
      contentRange: getRangeFromIndices({ min, max }, CONTENT_DISPLAY),
    };
    if (manualModelId) {
      updateValue(buildManualSelection(manualModelId, override));
    } else {
      updateValue({
        selectionType: ModelSelectionType.FILTERS,
        intelligenceRange,
        priceRange,
        sortBy,
        sortDirection,
        sortBy2,
        sortDirection2,
        ...override,
      });
    }
  };

  const handlePriceChange = (min: number, max: number): void => {
    setUseSkillBased(false);
    const override = {
      priceRange: getRangeFromIndices({ min, max }, PRICE_DISPLAY),
    };
    if (manualModelId) {
      updateValue(buildManualSelection(manualModelId, override));
    } else {
      updateValue({
        selectionType: ModelSelectionType.FILTERS,
        intelligenceRange,
        contentRange,
        sortBy,
        sortDirection,
        sortBy2,
        sortDirection2,
        ...override,
      });
    }
  };

  const buildManualSelection = (
    modelId: AnyModelId,
    overrides?: Partial<Omit<FiltersModelSelection, "selectionType">>,
  ): AnyRoleModelSelection => {
    const filterProps: Omit<FiltersModelSelection, "selectionType"> = {
      intelligenceRange:
        overrides?.intelligenceRange ??
        getRangeFromIndices(intelligenceIndices, INTELLIGENCE_DISPLAY),
      priceRange:
        overrides?.priceRange ??
        getRangeFromIndices(priceIndices, PRICE_DISPLAY),
      contentRange:
        overrides?.contentRange ??
        getRangeFromIndices(contentIndices, CONTENT_DISPLAY),
      sortBy: "sortBy" in (overrides ?? {}) ? overrides?.sortBy : sortBy,
      sortDirection:
        "sortDirection" in (overrides ?? {})
          ? overrides?.sortDirection
          : sortDirection,
      sortBy2: "sortBy2" in (overrides ?? {}) ? overrides?.sortBy2 : sortBy2,
      sortDirection2:
        "sortDirection2" in (overrides ?? {})
          ? overrides?.sortDirection2
          : sortDirection2,
    };
    const imgId = Object.values(ImageGenModelId).find((v) => v === modelId);
    if (imgId !== undefined) {
      return {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: imgId,
        ...filterProps,
      };
    }
    const musicId = Object.values(MusicGenModelId).find((v) => v === modelId);
    if (musicId !== undefined) {
      return {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: musicId,
        ...filterProps,
      };
    }
    const videoId = Object.values(VideoGenModelId).find((v) => v === modelId);
    if (videoId !== undefined) {
      return {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: videoId,
        ...filterProps,
      };
    }
    const ttsId = Object.values(TtsModelId).find((v) => v === modelId);
    if (ttsId !== undefined) {
      return {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ttsId,
        ...filterProps,
      };
    }
    const sttId = Object.values(SttModelId).find((v) => v === modelId);
    if (sttId !== undefined) {
      return {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: sttId,
        ...filterProps,
      };
    }
    const imgVisionId = Object.values(ImageVisionModelId).find(
      (v) => v === modelId,
    );
    if (imgVisionId !== undefined) {
      return {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: imgVisionId,
        ...filterProps,
      };
    }
    const videoVisionId = Object.values(VideoVisionModelId).find(
      (v) => v === modelId,
    );
    if (videoVisionId !== undefined) {
      return {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: videoVisionId,
        ...filterProps,
      };
    }
    const audioVisionId = Object.values(AudioVisionModelId).find(
      (v) => v === modelId,
    );
    if (audioVisionId !== undefined) {
      return {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: audioVisionId,
        ...filterProps,
      };
    }
    // Default: chat model
    const chatId = Object.values(ChatModelId).find((v) => v === modelId);
    if (chatId !== undefined) {
      return {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: chatId,
        ...filterProps,
      };
    }
    // Fallback to filters if model ID not found in any enum
    return { selectionType: ModelSelectionType.FILTERS, ...filterProps };
  };

  const handleModelSelect = (modelId: AnyModelId): void => {
    setUseSkillBased(false);
    const selected = buildManualSelection(modelId);
    updateValue(selected);
    onSelect?.(selected);
  };

  // Type tab change handler
  const handleTypeTabChange = (newType: ModelType): void => {
    setModelTypeTab(newType);
    setSearchQuery("");
    if (newType !== "text") {
      // Image/audio: force MANUAL, auto-select first available model of that type
      setUseSkillBased(false);
      const first = getAllModelOptions().find(
        (m) =>
          modelOptionToTypes(m).includes(newType) && isProviderAvailable(m),
      );
      if (first) {
        updateValue(buildManualSelection(first.id));
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
    const override = { sortBy: field, sortDirection: defaultDirection };
    if (manualModelId) {
      updateValue(buildManualSelection(manualModelId, override));
    } else {
      updateValue({
        selectionType: ModelSelectionType.FILTERS,
        intelligenceRange,
        priceRange,
        contentRange,
        sortBy2,
        sortDirection2,
        ...override,
      });
    }
  };

  const handleSortDirectionToggle = (): void => {
    const newDirection =
      sortDirection === ModelSortDirection.ASC
        ? ModelSortDirection.DESC
        : ModelSortDirection.ASC;

    setUseSkillBased(false);
    const override = {
      sortBy: sortBy ?? ModelSortField.INTELLIGENCE,
      sortDirection: newDirection,
    };
    if (manualModelId) {
      updateValue(buildManualSelection(manualModelId, override));
    } else {
      updateValue({
        selectionType: ModelSelectionType.FILTERS,
        intelligenceRange,
        priceRange,
        contentRange,
        sortBy2,
        sortDirection2,
        ...override,
      });
    }
  };

  const handleSortBy2Change = (
    field: (typeof ModelSortField)[keyof typeof ModelSortField],
  ): void => {
    setUseSkillBased(false);
    const override = {
      sortBy2: field,
      sortDirection2: ModelSortDirection.DESC,
    };
    if (manualModelId) {
      updateValue(buildManualSelection(manualModelId, override));
    } else {
      updateValue({
        selectionType: ModelSelectionType.FILTERS,
        intelligenceRange,
        priceRange,
        contentRange,
        sortBy,
        sortDirection,
        ...override,
      });
    }
  };

  const handleSortDirection2Toggle = (): void => {
    const newDirection =
      sortDirection2 === ModelSortDirection.ASC
        ? ModelSortDirection.DESC
        : ModelSortDirection.ASC;

    setUseSkillBased(false);
    const override = {
      sortBy2: sortBy2 ?? ModelSortField.PRICE,
      sortDirection2: newDirection,
    };
    if (manualModelId) {
      updateValue(buildManualSelection(manualModelId, override));
    } else {
      updateValue({
        selectionType: ModelSelectionType.FILTERS,
        intelligenceRange,
        priceRange,
        contentRange,
        sortBy,
        sortDirection,
        ...override,
      });
    }
  };

  // Calculate filtered models and best model
  const intelligenceRange = getRangeFromIndices(
    intelligenceIndices,
    INTELLIGENCE_DISPLAY,
  );
  const contentRange = getRangeFromIndices(contentIndices, CONTENT_DISPLAY);
  const priceRange = getRangeFromIndices(priceIndices, PRICE_DISPLAY);

  const filteredModels = useMemo(() => {
    if (allowedRoles) {
      // Media model selector: bypass LLM hard-filter, use role-based filtering
      // Extract only the shared filter props (not manualModelId) so the
      // AnyManualModelSelection union is narrowed to FiltersModelSelection.
      const selectionForRole: FiltersModelSelection | null =
        activeSelection.selectionType === ModelSelectionType.FILTERS ||
        activeSelection.selectionType === ModelSelectionType.MANUAL
          ? {
              selectionType: ModelSelectionType.FILTERS,
              intelligenceRange: activeSelection.intelligenceRange,
              priceRange: activeSelection.priceRange,
              contentRange: activeSelection.contentRange,
              sortBy: activeSelection.sortBy,
              sortDirection: activeSelection.sortDirection,
              sortBy2: activeSelection.sortBy2,
              sortDirection2: activeSelection.sortDirection2,
            }
          : null;
      const base = getFilteredModelsByRoleDispatch(
        selectionForRole,
        allowedRoles,
        user,
      );
      const withInputFilter = requiredInputs
        ? base.filter((m) =>
            requiredInputs.every((mod) => m.inputs.includes(mod)),
          )
        : base;
      return withInputFilter.filter((m) =>
        modelOptionToTypes(m).includes(modelTypeTab),
      );
    }
    const filtersModelSelection: FiltersModelSelection = {
      selectionType: ModelSelectionType.FILTERS,
      intelligenceRange,
      priceRange,
      contentRange,
      sortBy,
      sortDirection,
      sortBy2,
      sortDirection2,
    };
    const base = filterChatModels(filtersModelSelection, user);
    return base.filter((m) => modelOptionToTypes(m).includes(modelTypeTab));
  }, [
    allowedRoles,
    requiredInputs,
    activeSelection,
    intelligenceRange,
    priceRange,
    contentRange,
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
      return lookupModelById(manualModelId) ?? null;
    } else if (mode === ModelSelectionType.CHARACTER_BASED) {
      if (characterModelSelection) {
        return getBestModelByRoleDispatch(
          characterModelSelection,
          allowedRoles ?? ["llm"],
          user,
        );
      }
      return null;
    } else {
      return bestFilteredModel;
    }
  }, [
    mode,
    manualModelId,
    bestFilteredModel,
    characterModelSelection,
    user,
    allowedRoles,
  ]);

  // For non-admins: hide models whose provider is unavailable (admins see them with setup-required styling)
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  // Get models to show (filtered or all), always constrained by type tab.
  // For admins: append env-unavailable models (grayed out with setup info).
  const modelsToShow = useMemo(() => {
    const typeFilter = (m: AnyModelOptionWithVision): boolean =>
      modelOptionToTypes(m).includes(modelTypeTab) &&
      (modelTypeTab !== "text" ||
        (!modelMatchesRoleLocal(m, "image-gen") &&
          !modelMatchesRoleLocal(m, "video-gen") &&
          !modelMatchesRoleLocal(m, "audio-gen") &&
          !modelMatchesRoleLocal(m, "tts") &&
          !modelMatchesRoleLocal(m, "stt")));

    if (showUnfilteredModels) {
      const all = getAllModelOptions().filter(typeFilter);
      return isAdmin ? all : all.filter((m) => isProviderAvailable(m));
    }

    if (!isAdmin) {
      // Non-admins: filteredModels is already env-available only
      return filteredModels;
    }

    // Admin: filteredModels has env-available models; append env-unavailable ones
    const filteredIds = new Set(filteredModels.map((m) => m.id));
    const adminExtras = getAllModelOptions().filter(
      (m) => typeFilter(m) && !filteredIds.has(m.id) && !isProviderAvailable(m),
    );
    return [...filteredModels, ...adminExtras];
  }, [showUnfilteredModels, filteredModels, isAdmin, modelTypeTab]);

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

  // Search-filtered models (applied after all other filters)
  const searchFilteredModels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return modelsToShow;
    }
    return modelsToShow.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        modelProviders[m.provider]?.name.toLowerCase().includes(q),
    );
  }, [searchQuery, modelsToShow]);

  // Models that match the search but were excluded by the active filters
  const searchExtraModels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return [];
    }
    // Exclude models already shown in the main list (after search filtering)
    const shownIds = new Set(searchFilteredModels.map((m) => m.id));
    const typeFilter = (m: AnyModelOptionWithVision): boolean =>
      modelOptionToTypes(m).includes(modelTypeTab) &&
      (modelTypeTab !== "text" ||
        (!modelMatchesRoleLocal(m, "image-gen") &&
          !modelMatchesRoleLocal(m, "video-gen") &&
          !modelMatchesRoleLocal(m, "audio-gen") &&
          !modelMatchesRoleLocal(m, "tts") &&
          !modelMatchesRoleLocal(m, "stt")));
    return getAllModelOptions().filter(
      (m) =>
        !shownIds.has(m.id) &&
        typeFilter(m) &&
        (isAdmin || isProviderAvailable(m)) &&
        (m.name.toLowerCase().includes(q) ||
          modelProviders[m.provider]?.name.toLowerCase().includes(q)),
    );
  }, [searchQuery, searchFilteredModels, modelTypeTab, isAdmin]);

  // Sort and group models
  const sortedAndGroupedModels = useMemo(() => {
    if (!sortBy) {
      // Default: group by provider, available providers first, within each group available-first then price-asc
      const sorted = [...searchFilteredModels].toSorted((a, b) => {
        const aAvail = isProviderAvailable(a) ? 0 : 1;
        const bAvail = isProviderAvailable(b) ? 0 : 1;
        if (aAvail !== bAvail) {
          return aAvail - bAvail;
        }
        return getModelPrice(a) - getModelPrice(b);
      });
      const grouped: Record<string, AnyModelOptionWithVision[]> = {};
      for (const model of sorted) {
        const label = modelProviders[model.provider]?.name ?? model.provider;
        if (!grouped[label]) {
          grouped[label] = [];
        }
        grouped[label].push(model);
      }
      return grouped;
    }

    // Get sort value and label based on field
    const getSortInfo = (
      model: AnyModelOptionWithVision,
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
        case ModelSortField.PRICE: {
          const cost = getModelPrice(model);
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

    // searchFilteredModels is already sorted; just group by primary sort label
    const grouped: Record<string, AnyModelOptionWithVision[]> = {};
    for (const model of searchFilteredModels) {
      const { label } = getSortInfo(model);
      if (!grouped[label]) {
        grouped[label] = [];
      }
      grouped[label].push(model);
    }

    return grouped;
  }, [searchFilteredModels, sortBy, t]);

  // Get display models (limited or all)
  // Always grouped (by provider in default view, by tier when sort is active)
  const displayModels = sortedAndGroupedModels;

  // Available type tabs (only show tabs that have at least 1 accessible model)
  const allModels = useMemo(() => getAllModelOptions(), []);
  const availableTypes = useMemo((): ModelType[] => {
    if (chatOnly) {
      return ["text"];
    }
    // When allowedRoles is set, only show the tab matching that role's primary type.
    // Models like Gemini image-gen have modelTypes: ["text","image"] but in a media
    // selector we only want the media tab (image/audio/video), not the chat tab.
    if (allowedRoles) {
      const hasRoleType = allModels.some(
        (m) =>
          allowedRoles.some((r) => modelMatchesRoleLocal(m, r)) &&
          modelOptionToTypes(m).includes(defaultModelTypeTab) &&
          (isAdmin || isProviderAvailable(m)),
      );
      return hasRoleType ? [defaultModelTypeTab] : [];
    }
    const types: ModelType[] = ["text"];
    const hasImage = allModels.some(
      (m) =>
        modelOptionToTypes(m).includes("image") &&
        (isAdmin || isProviderAvailable(m)),
    );
    const hasAudio = allModels.some(
      (m) =>
        modelOptionToTypes(m).includes("audio") &&
        (isAdmin || isProviderAvailable(m)),
    );
    if (hasImage) {
      types.push("image");
    }
    if (hasAudio) {
      types.push("audio");
    }
    return types;
  }, [chatOnly, allowedRoles, defaultModelTypeTab, allModels, isAdmin]);

  const activeFilterChips = buildFilterChips({
    intelligenceIndices,
    contentIndices,
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
    handlePriceChange,
    setUseSkillBased,
    updateValue,
    buildManualSelection,
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
                    : type === "video"
                      ? t("selector.typeVideo")
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

        {/* Toolbar: search + filters + sort - single integrated row */}
        {(modelTypeTab === "text" || !!allowedRoles) && (
          <Div className="flex flex-col gap-1.5">
            {/* Row 1: search input + filter button + sort button */}
            <Div className="flex items-center gap-1.5">
              {/* Search input - always visible */}
              <Div className="relative flex-1 min-w-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("selector.searchPlaceholder")}
                  className="pl-8 pr-7 h-8 text-xs"
                  disabled={readOnly}
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted rounded-sm"
                    onClick={() => setSearchQuery("")}
                    disabled={readOnly}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </Div>

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
                      "h-8 gap-1.5 text-xs shrink-0",
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
                  className="w-80 p-3 flex flex-col gap-3 overflow-y-auto max-h-[min(480px,var(--radix-popper-available-height))]"
                  align="start"
                  side="bottom"
                  sideOffset={6}
                  avoidCollisions
                  collisionPadding={8}
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

              {/* Sort popover */}
              <Popover open={sortOpen} onOpenChange={setSortOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={sortBy ? "secondary" : "outline"}
                    size="sm"
                    className={cn(
                      "h-8 gap-1.5 text-xs shrink-0",
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
                  className="w-72 p-3 flex flex-col gap-3 overflow-y-auto max-h-[var(--radix-popper-available-height)]"
                  align="start"
                  side="bottom"
                  sideOffset={6}
                  avoidCollisions
                  collisionPadding={8}
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
            </Div>

            {/* Row 2: active filter + sort chips (only when any are active) */}
            {activeFilterChips.length > 0 && (
              <Div className="flex items-center gap-1.5 flex-wrap">
                {activeFilterChips.map((chip) => (
                  <Div
                    key={chip.key}
                    className="flex items-center gap-1 h-6 px-2 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs font-medium"
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
            )}
          </Div>
        )}

        {/* Models list */}
        <Div className="flex flex-col gap-3">
          {Object.keys(displayModels).length === 0 ? (
            <Div className="p-4 text-center text-sm text-muted-foreground border rounded-lg">
              {searchQuery.trim()
                ? t("selector.noSearchResults", { query: searchQuery.trim() })
                : t("selector.noMatchingModels")}
            </Div>
          ) : (
            <Div className="flex flex-col gap-4">
              {Object.entries(displayModels).map(
                ([groupLabel, groupModels]) => {
                  const models = groupModels;

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

                  // Find provider icon by matching group label against modelProviders
                  const providerEntry = Object.values(modelProviders).find(
                    (p) => p.name === groupLabel,
                  );

                  return (
                    <Div key={groupLabel} className="flex flex-col gap-2">
                      <Div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-muted/40">
                        {providerEntry && (
                          <Div className="w-6 h-6 rounded-md bg-background flex items-center justify-center shrink-0 shadow-sm border border-border/50">
                            <Icon
                              icon={providerEntry.icon}
                              className="h-3.5 w-3.5 text-foreground"
                            />
                          </Div>
                        )}
                        <Span className="text-xs font-semibold text-foreground">
                          {groupLabel}
                        </Span>
                      </Div>
                      <Div className="flex flex-col gap-2">
                        {visibleModels.map((model) => {
                          const isOutsideFilter =
                            showUnfilteredModels &&
                            !filteredModels.some(
                              (m: AnyModelOptionWithVision) =>
                                m.id === model.id,
                            );
                          const setupRequired = getSetupRequiredMessage(
                            model,
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

          {/* Search extras: models matching search but outside active filters */}
          {searchExtraModels.length > 0 && (
            <Div className="flex flex-col gap-2 mt-2">
              <Div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-muted/20 border border-dashed border-border/50">
                <Span className="text-xs font-semibold text-muted-foreground">
                  {t("selector.searchExtrasGroup")}
                </Span>
              </Div>
              <Div className="flex flex-col gap-2">
                {searchExtraModels.map((model) => {
                  const setupRequired = getSetupRequiredMessage(model, locale);
                  return (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isBest={false}
                      selected={
                        mode === ModelSelectionType.MANUAL &&
                        manualModelId === model.id
                      }
                      onClick={() => handleModelSelect(model.id)}
                      dimmed={true}
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
              </Div>
            </Div>
          )}
        </Div>
      </Div>
    </TooltipProvider>
  );
}

export interface ModelSelectorTriggerProps {
  /** Current model selection (the chosen value) */
  modelSelection: AnyRoleSelection | AnyRoleModelSelection | null | undefined;
  /** Character/skill's model selection (for CHARACTER_BASED fallback display) */
  characterModelSelection?: AnyRoleSelection | AnyRoleModelSelection;
  /** When set, resolve best model from this role set instead of LLM models */
  allowedRoles?: ModelRole[];
  /**
   * When set, only show models whose `inputs` array includes ALL of these modalities.
   * Use for vision-bridge (requiredInputs={["image"]}) to filter LLMs to vision-capable ones.
   */
  requiredInputs?: Modality[];
  /**
   * Platform-level default model selection (for roles that have a system default,
   * e.g. TTS → Nova, STT → Whisper, image-gen → DALL-E 3).
   * When `modelSelection` is null and this is provided, shows the default model
   * with a "Default" badge instead of showing `placeholder`.
   */
  defaultModelSelection?: AnyRoleSelection | AnyRoleModelSelection;
  /** Placeholder text shown when no model is selected (e.g. "Inherit from skill", "System default") */
  placeholder: string;
  /** Click handler - opens the inline panel. Omit for read-only. */
  onClick?: () => void;
  locale: CountryLanguage;
  user: JwtPayloadType;
  /** Optional className applied to the model name text */
  nameClassName?: string;
}

/**
 * Collapsed model selector trigger card.
 * Shows the currently-selected (or inherited) model with icon, name, provider, and price badge.
 * Clicking opens the full inline ModelSelector panel.
 */
export function ModelSelectorTrigger({
  modelSelection,
  characterModelSelection,
  allowedRoles,
  defaultModelSelection,
  placeholder,
  onClick,
  locale,
  user,
  nameClassName,
}: ModelSelectorTriggerProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  // Resolve the best model to display
  const resolvedModel = useMemo((): AnyModelOptionWithVision | null => {
    const effectiveSelection =
      modelSelection ??
      characterModelSelection ??
      defaultModelSelection ??
      null;
    if (!effectiveSelection) {
      return null;
    }
    const roles: ModelRole[] = allowedRoles ?? ["llm"];
    return getBestModelByRoleDispatch(effectiveSelection, roles, user);
  }, [
    modelSelection,
    characterModelSelection,
    defaultModelSelection,
    allowedRoles,
    user,
  ]);

  const isClickable = !!onClick;
  const isUnavailable =
    resolvedModel !== null && !isProviderAvailable(resolvedModel);

  return (
    <Div
      onClick={isClickable ? onClick : undefined}
      className={cn(
        "flex items-center gap-2.5 p-2.5 rounded-lg border transition-all",
        isClickable &&
          "cursor-pointer hover:bg-muted/50 hover:border-primary/30",
        !isClickable && "cursor-default",
      )}
    >
      {resolvedModel ? (
        <>
          <Div className="flex-1 min-w-0">
            <Div className="flex items-center gap-1.5">
              <Div
                className={cn(
                  "w-4 h-4 rounded flex items-center justify-center shrink-0",
                  isUnavailable ? "bg-muted/30" : "bg-muted",
                )}
              >
                <Icon
                  icon={resolvedModel.icon}
                  className={cn(
                    "h-3 w-3",
                    isUnavailable && "text-muted-foreground",
                  )}
                />
              </Div>
              <Span
                className={cn(
                  "text-sm font-medium truncate",
                  isUnavailable && "text-muted-foreground",
                  nameClassName,
                )}
              >
                {resolvedModel.name}
              </Span>
              {isUnavailable && (
                <Badge
                  variant="outline"
                  className="text-[9px] h-4 px-1.5 shrink-0 border-amber-400/50 text-warning"
                >
                  <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                  {t("selector.setupRequired")}
                </Badge>
              )}
            </Div>
            <Div className="flex items-center gap-1">
              <Span className="text-[11px] text-muted-foreground">
                {modelProviders[resolvedModel.provider]?.name ??
                  resolvedModel.provider}
              </Span>
              {!isUnavailable && (
                <>
                  <Span
                    aria-hidden
                    className="text-[11px] text-muted-foreground/50"
                  >
                    {
                      // oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string
                      "·"
                    }
                  </Span>
                  <ModelCreditDisplay
                    modelId={resolvedModel.id}
                    variant="text"
                    className="text-[11px] text-muted-foreground"
                    locale={locale}
                  />
                </>
              )}
            </Div>
          </Div>
          <Div className="flex items-center gap-1.5 shrink-0">
            {isClickable && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </Div>
        </>
      ) : (
        <>
          <Div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-muted/50">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </Div>
          <Div className="flex-1 min-w-0">
            <Span className="text-sm text-muted-foreground">{placeholder}</Span>
          </Div>
          {isClickable && (
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
        </>
      )}
    </Div>
  );
}
