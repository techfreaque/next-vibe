/**
 * CompactTrigger Widget
 * Standalone reusable component for editing/viewing the auto-compact token threshold.
 * Used in: character edit, favorite edit, settings edit.
 *
 * "Context Memory Budget" - how many tokens of conversation history the AI
 * keeps before summarising older messages to save cost.
 */

/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import { DollarSign } from "next-vibe-ui/ui/icons/DollarSign";
import { Eye } from "next-vibe-ui/ui/icons/Eye";
import { Film } from "next-vibe-ui/ui/icons/Film";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { Mic } from "next-vibe-ui/ui/icons/Mic";
import { RotateCcw } from "next-vibe-ui/ui/icons/RotateCcw";
import {
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "next-vibe-ui/ui/slider";
import { Span } from "next-vibe-ui/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import { cn } from "next-vibe/shared/utils";
import type { JSX, ReactNode } from "react";
import { useMemo, useState } from "react";

import {
  DEFAULT_AUDIO_VISION_MODEL_SELECTION,
  DEFAULT_IMAGE_VISION_MODEL_SELECTION,
  DEFAULT_VIDEO_VISION_MODEL_SELECTION,
} from "@/app/api/[locale]/agent/ai-stream/constants";
import {
  getChatModelById,
  type ChatManualModelSelection,
  type ChatModelId,
  type ChatModelSelection,
} from "@/app/api/[locale]/agent/ai-stream/models";
import { COMPACT_TRIGGER } from "@/app/api/[locale]/agent/ai-stream/repository/core/constants";
import {
  audioVisionModelSelectionSchema,
  getBestAudioVisionModel,
  getBestImageVisionModel,
  getBestVideoVisionModel,
  imageVisionModelSelectionSchema,
  videoVisionModelSelectionSchema,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import { getBestChatModelForFavorite } from "@/app/api/[locale]/agent/chat/favorites/[id]/definition";
import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/skills/enum";
import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/image-generation/constants";
import {
  getBestImageGenModel,
  imageGenModelSelectionSchema,
} from "@/app/api/[locale]/agent/image-generation/models";
import type { Modality, ModelRole } from "@/app/api/[locale]/agent/models/enum";
import type { AnyRoleModelSelection } from "@/app/api/[locale]/agent/models/selection";
import { DEFAULT_MUSIC_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/music-generation/constants";
import {
  getBestMusicGenModel,
  musicGenModelSelectionSchema,
} from "@/app/api/[locale]/agent/music-generation/models";
import { DEFAULT_STT_MODEL_SELECTION } from "@/app/api/[locale]/agent/speech-to-text/constants";
import {
  getBestSttModel,
  sttModelSelectionSchema,
} from "@/app/api/[locale]/agent/speech-to-text/models";
import { DEFAULT_TTS_MODEL_SELECTION } from "@/app/api/[locale]/agent/text-to-speech/constants";
import {
  getBestTtsModel,
  voiceModelSelectionSchema,
} from "@/app/api/[locale]/agent/text-to-speech/models";
import { DEFAULT_VIDEO_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/video-generation/constants";
import {
  getBestVideoGenModel,
  videoGenModelSelectionSchema,
} from "@/app/api/[locale]/agent/video-generation/models";

import {
  ModelSelector,
  ModelSelectorTrigger,
} from "@/app/api/[locale]/agent/models/widget/model-selector";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as skillIdTranslation } from "@/app/api/[locale]/agent/chat/skills/[id]/i18n";
import { ModelGroup } from "@/app/api/[locale]/agent/chat/skills/[id]/widget";
import type {
  ChatSettingsGetResponseOutput,
  ChatSettingsUpdateRequestOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

const MIN_VALUE = 1_000;
const MAX_ABSOLUTE = 200_000;
const STEP = 1_000;

/** Format token count as "32K", "128K", "2M" etc. */
function formatTokens(n: number): string {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  return `${Math.round(n / 1_000)}K`;
}

/**
 * Derive the context window from a model selection.
 * Falls back to characterModelSelection when favoriteModelSelection is null/undefined,
 * then falls back to MAX_ABSOLUTE when no model is resolvable.
 */
function getModelContextWindow(
  user: JwtPayloadType,
  env: ReturnType<typeof useEnvAvailability>,
  modelSelection: ChatModelSelection | ChatModelId | null | undefined,
  characterModelSelection?: ChatModelSelection | null,
): number {
  if (typeof modelSelection === "string") {
    const model = getChatModelById(modelSelection);
    return model.contextWindow;
  }

  // Use the same resolution logic as getBestModelForFavorite:
  // favorite override → character default → MAX_ABSOLUTE
  const best = getBestChatModelForFavorite(
    modelSelection ?? null,
    characterModelSelection ?? undefined,
    user,
    env,
  );
  return best?.contextWindow ?? MAX_ABSOLUTE;
}

// ---------------------------------------------------------------------------
// Shared internal card wrapper
// ---------------------------------------------------------------------------

function CardWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <Div
      className={cn(
        "rounded-xl border bg-card p-4 flex flex-col gap-3",
        className,
      )}
    >
      {children}
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Header row (shared between edit + view)
// ---------------------------------------------------------------------------

function CardHeader({
  modelCap,
  isDefault,
  label,
}: {
  modelCap: number;
  isDefault: boolean;
  label?: ReactNode;
}): JSX.Element {
  return (
    <Div className="flex items-start justify-between gap-2">
      <Div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-primary flex-shrink-0" />
        <Div className="flex flex-col">
          <Span className="text-sm font-semibold">Context Memory Budget</Span>
          {label !== undefined && label !== null && label !== "" && (
            <Span className="text-xs text-muted-foreground">{label}</Span>
          )}
        </Div>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
              >
                <Info className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[280px] text-sm" side="top">
              <Div className="flex flex-col gap-1.5">
                <Span className="font-medium">
                  How much conversation history the AI keeps
                </Span>
                <Span className="text-muted-foreground">
                  When the conversation grows past this limit, older messages
                  are automatically summarised. The AI stays coherent but uses
                  fewer tokens - reducing cost.
                </Span>
                <Span className="text-muted-foreground">
                  {"Current model supports up to "}
                  <Span className="font-medium text-foreground">
                    {formatTokens(modelCap)}
                  </Span>
                  {" tokens."}
                </Span>
              </Div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Div>

      {isDefault && (
        <Badge
          variant="secondary"
          className="text-xs shrink-0 bg-muted text-muted-foreground"
        >
          default
        </Badge>
      )}
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Props for the edit component
// ---------------------------------------------------------------------------

export interface CompactTriggerEditProps {
  /** Current stored value (null = use default) */
  value: number | null | undefined;
  /** Called when user changes the value. null = reset to default */
  onChange: (value: number | null) => void;
  /**
   * Favorite's own model selection override - used to cap the slider.
   * When null/undefined, falls back to characterModelSelection.
   */
  modelSelection?: ChatModelSelection | ChatModelId | null;
  /**
   * Skill's model selection - fallback when favoriteModelSelection is null.
   * Ensures the slider cap reflects the actual resolved model.
   */
  characterModelSelection?: ChatModelSelection | null;
  /** Optional sub-label shown in the header (e.g. "Override for this slot") */
  label?: ReactNode;
  className?: string;
  /** User payload for admin-only model filtering */
  user: JwtPayloadType;
}

// ---------------------------------------------------------------------------
// Edit component
// ---------------------------------------------------------------------------

export function CompactTriggerEdit({
  value,
  onChange,
  modelSelection,
  characterModelSelection,
  label,
  className,
  user,
}: CompactTriggerEditProps): JSX.Element {
  const env = useEnvAvailability();
  const modelCap = useMemo(
    () =>
      Math.min(
        getModelContextWindow(
          user,
          env,
          modelSelection,
          characterModelSelection,
        ),
        MAX_ABSOLUTE,
      ),
    [modelSelection, characterModelSelection, user, env],
  );

  const effectiveValue = value ?? COMPACT_TRIGGER;
  // Always keep the stored value within the model's actual cap
  const cappedValue = Math.min(effectiveValue, modelCap);
  const isDefault =
    value === null || value === undefined || value === COMPACT_TRIGGER;

  const handleChange = (values: number[]): void => {
    const v = values[0];
    if (v === undefined) {
      return;
    }
    // If user drags back to the default, store null (saves nothing, falls through)
    onChange(v === COMPACT_TRIGGER ? null : v);
  };

  const handleReset = (): void => {
    onChange(null);
  };

  return (
    <CardWrapper className={className}>
      <CardHeader modelCap={modelCap} isDefault={isDefault} label={label} />

      {/* Description for noobs */}
      <Div className="text-xs text-muted-foreground leading-relaxed">
        {
          "How far back the AI remembers your conversation before it starts summarising. "
        }
        <Span className="inline-flex items-center gap-0.5 font-medium text-foreground/80">
          <DollarSign className="h-3 w-3" />
          {"Lower = cheaper"}
        </Span>
        {
          " (to a point) - you trade a little memory for lower per-message cost."
        }
      </Div>

      {/* Slider */}
      <Div className="space-y-3 pt-1">
        <Slider
          value={[cappedValue]}
          onValueChange={handleChange}
          min={MIN_VALUE}
          max={modelCap}
          step={STEP}
        >
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb />
        </Slider>

        {/* Value readout + scale */}
        <Div className="flex items-center justify-between text-xs text-muted-foreground">
          <Span>{formatTokens(MIN_VALUE)}</Span>
          <Div className="flex flex-col items-center gap-0.5">
            <Span
              className={cn(
                "text-base font-bold tabular-nums",
                isDefault ? "text-muted-foreground" : "text-foreground",
              )}
            >
              {formatTokens(cappedValue)}
            </Span>
            <Span className="text-[10px]">tokens</Span>
          </Div>
          <Div className="flex flex-col items-end gap-0.5">
            <Span>{formatTokens(modelCap)}</Span>
            <Span className="text-[10px]">model max</Span>
          </Div>
        </Div>
      </Div>

      {/* Cost / memory trade-off visual indicator */}
      <CostMemoryBar value={cappedValue} modelCap={modelCap} />

      {/* Reset button */}
      {!isDefault && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="self-start gap-1.5 h-7 text-xs text-muted-foreground hover:text-foreground px-2"
        >
          <RotateCcw className="h-3 w-3" />
          {`Reset to default (${formatTokens(COMPACT_TRIGGER)})`}
        </Button>
      )}
    </CardWrapper>
  );
}

// ---------------------------------------------------------------------------
// Cost/Memory trade-off bar
// ---------------------------------------------------------------------------

// Color values for the progress bar (inline style - cannot mix className + style on Div)
const BAR_COLORS = {
  cheap: "#10b981", // emerald-500
  balanced: "#eab308", // yellow-500
  rich: "#f97316", // orange-500
  max: "#ef4444", // red-500
} as const;

function CostMemoryBar({
  value,
  modelCap,
}: {
  value: number;
  modelCap: number;
}): JSX.Element {
  const pct = Math.round(((value - MIN_VALUE) / (modelCap - MIN_VALUE)) * 100);

  // Color logic: green (low cost) → yellow → orange → red (high cost)
  const barBg =
    pct < 30
      ? BAR_COLORS.cheap
      : pct < 60
        ? BAR_COLORS.balanced
        : pct < 85
          ? BAR_COLORS.rich
          : BAR_COLORS.max;

  const barLabel =
    pct < 30
      ? "Lower cost · shorter memory"
      : pct < 60
        ? "Balanced cost & memory"
        : pct < 85
          ? "Richer memory · higher cost"
          : "Maximum memory · highest cost";

  return (
    <Div className="flex flex-col gap-1">
      <Div className="flex justify-between text-[10px] text-muted-foreground">
        <Span>{"💸 cheaper"}</Span>
        <Span className="text-center font-medium text-foreground/70">
          {barLabel}
        </Span>
        <Span>{"🧠 more memory"}</Span>
      </Div>
      <Div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        {/* Inner bar: use style-only (StyleType constraint - no mixing style+className on Div) */}
        <Div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: "9999px",
            backgroundColor: barBg,
            transition: "width 0.15s ease",
          }}
        />
      </Div>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// SettingsModelSelectorsSection
// ---------------------------------------------------------------------------

export type ActiveSelector =
  | "chat"
  | "voice"
  | "imageGen"
  | "musicGen"
  | "videoGen"
  | "stt"
  | "imageVision"
  | "videoVision"
  | "audioVision"
  | null;

export interface SettingsModelSelectorsSectionProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  settings: ChatSettingsGetResponseOutput | null;
  updateSettings: (
    updates: Partial<ChatSettingsUpdateRequestOutput>,
  ) => Promise<void>;
}

interface SelectorConfig {
  key: keyof Pick<
    ChatSettingsUpdateRequestOutput,
    | "voiceModelSelection"
    | "imageGenModelSelection"
    | "musicGenModelSelection"
    | "videoGenModelSelection"
    | "sttModelSelection"
    | "imageVisionModelSelection"
    | "videoVisionModelSelection"
    | "audioVisionModelSelection"
  >;
  selectorKey: Exclude<ActiveSelector, "chat" | null>;
  labelKey: Parameters<ReturnType<typeof scopedTranslation.scopedT>["t"]>[0];
  placeholderKey: Parameters<
    ReturnType<typeof scopedTranslation.scopedT>["t"]
  >[0];
  allowedRoles: ModelRole[];
  /** Which model group this selector belongs to */
  group: "eyes" | "ears" | "media";
  /** Which slot label key (inside get.models.slots.*) */
  slotKey:
    | "imageVision"
    | "videoVision"
    | "stt"
    | "tts"
    | "audioVision"
    | "imageGen"
    | "musicGen"
    | "videoGen";
  /** When set, only models with all these input modalities are shown (e.g. vision bridge: ["image"]) */
  requiredInputs?: Modality[];
  /** Platform-level default selection to display when no value is set */
  defaultModelSelection?: AnyRoleModelSelection;
}

function makeDefaultSelection(
  roles: ModelRole[],
  user: JwtPayloadType,
  env: ReturnType<typeof useEnvAvailability>,
): AnyRoleModelSelection | undefined {
  const role = roles[0];
  const manual = {
    selectionType: ModelSelectionType.MANUAL,
  };
  if (role === "tts") {
    const m = getBestTtsModel(DEFAULT_TTS_MODEL_SELECTION, user, env);
    if (!m) {
      return undefined;
    }
    const r = voiceModelSelectionSchema.safeParse({
      ...manual,
      manualModelId: m.id,
    });
    return r.success ? r.data : undefined;
  }
  if (role === "stt") {
    const m = getBestSttModel(DEFAULT_STT_MODEL_SELECTION, user, env);
    if (!m) {
      return undefined;
    }
    const r = sttModelSelectionSchema.safeParse({
      ...manual,
      manualModelId: m.id,
    });
    return r.success ? r.data : undefined;
  }
  if (role === "image-gen") {
    const m = getBestImageGenModel(
      DEFAULT_IMAGE_GEN_MODEL_SELECTION,
      user,
      env,
    );
    if (!m) {
      return undefined;
    }
    const r = imageGenModelSelectionSchema.safeParse({
      ...manual,
      manualModelId: m.id,
    });
    return r.success ? r.data : undefined;
  }
  if (role === "audio-gen") {
    const m = getBestMusicGenModel(
      DEFAULT_MUSIC_GEN_MODEL_SELECTION,
      user,
      env,
    );
    if (!m) {
      return undefined;
    }
    const r = musicGenModelSelectionSchema.safeParse({
      ...manual,
      manualModelId: m.id,
    });
    return r.success ? r.data : undefined;
  }
  if (role === "video-gen") {
    const m = getBestVideoGenModel(
      DEFAULT_VIDEO_GEN_MODEL_SELECTION,
      user,
      env,
    );
    if (!m) {
      return undefined;
    }
    const r = videoGenModelSelectionSchema.safeParse({
      ...manual,
      manualModelId: m.id,
    });
    return r.success ? r.data : undefined;
  }
  if (role === "image-vision") {
    const m = getBestImageVisionModel(
      DEFAULT_IMAGE_VISION_MODEL_SELECTION,
      user,
      env,
    );
    if (!m) {
      return undefined;
    }
    const r = imageVisionModelSelectionSchema.safeParse({
      ...manual,
      manualModelId: m.id,
    });
    return r.success ? r.data : undefined;
  }
  if (role === "video-vision") {
    const m = getBestVideoVisionModel(
      DEFAULT_VIDEO_VISION_MODEL_SELECTION,
      user,
      env,
    );
    if (!m) {
      return undefined;
    }
    const r = videoVisionModelSelectionSchema.safeParse({
      ...manual,
      manualModelId: m.id,
    });
    return r.success ? r.data : undefined;
  }
  if (role === "audio-vision") {
    const m = getBestAudioVisionModel(
      DEFAULT_AUDIO_VISION_MODEL_SELECTION,
      user,
      env,
    );
    if (!m) {
      return undefined;
    }
    const r = audioVisionModelSelectionSchema.safeParse({
      ...manual,
      manualModelId: m.id,
    });
    return r.success ? r.data : undefined;
  }
  return undefined;
}

// Static config (no defaults - computed inside component with env awareness)
const SELECTOR_CONFIGS: Omit<SelectorConfig, "defaultModelSelection">[] = [
  {
    key: "imageVisionModelSelection",
    selectorKey: "imageVision",
    labelKey: "post.imageVisionModel.label",
    placeholderKey: "post.imageVisionModel.placeholder",
    allowedRoles: ["image-vision"],
    group: "eyes",
    slotKey: "imageVision",
  },
  {
    key: "videoVisionModelSelection",
    selectorKey: "videoVision",
    labelKey: "post.videoVisionModel.label",
    placeholderKey: "post.videoVisionModel.placeholder",
    allowedRoles: ["video-vision"],
    group: "eyes",
    slotKey: "videoVision",
  },
  {
    key: "sttModelSelection",
    selectorKey: "stt",
    labelKey: "post.sttModel.label",
    placeholderKey: "post.sttModel.placeholder",
    allowedRoles: ["stt"],
    group: "ears",
    slotKey: "stt",
  },
  {
    key: "voiceModelSelection",
    selectorKey: "voice",
    labelKey: "post.voiceModelSelection.label",
    placeholderKey: "post.voiceModelSelection.placeholder",
    allowedRoles: ["tts"],
    group: "ears",
    slotKey: "tts",
  },
  {
    key: "audioVisionModelSelection",
    selectorKey: "audioVision",
    labelKey: "post.audioVisionModel.label",
    placeholderKey: "post.audioVisionModel.placeholder",
    allowedRoles: ["audio-vision"],
    group: "ears",
    slotKey: "audioVision",
  },
  {
    key: "imageGenModelSelection",
    selectorKey: "imageGen",
    labelKey: "post.imageGenModel.label",
    placeholderKey: "post.imageGenModel.placeholder",
    allowedRoles: ["image-gen"],
    group: "media",
    slotKey: "imageGen",
  },
  {
    key: "musicGenModelSelection",
    selectorKey: "musicGen",
    labelKey: "post.musicGenModel.label",
    placeholderKey: "post.musicGenModel.placeholder",
    allowedRoles: ["audio-gen"],
    group: "media",
    slotKey: "musicGen",
  },
  {
    key: "videoGenModelSelection",
    selectorKey: "videoGen",
    labelKey: "post.videoGenModel.label",
    placeholderKey: "post.videoGenModel.placeholder",
    allowedRoles: ["video-gen"],
    group: "media",
    slotKey: "videoGen",
  },
];

function getModelSelectionFromSettings(
  settings: ChatSettingsGetResponseOutput | null,
  key: SelectorConfig["key"],
): AnyRoleModelSelection | null {
  const raw = settings?.[key];
  if (raw === null || raw === undefined) {
    return null;
  }
  // All role-specific selection fields share the same discriminant structure
  // (selectionType: "manual" | "filters"). We verify the required discriminant
  // field exists before returning.
  if (
    typeof raw === "object" &&
    "selectionType" in raw &&
    typeof raw.selectionType === "string"
  ) {
    return raw as AnyRoleModelSelection;
  }
  return null;
}

function getChatModelSelection(
  settings: ChatSettingsGetResponseOutput | null,
): ChatModelSelection | null {
  const modelId = settings?.selectedModel;
  if (modelId === null || modelId === undefined) {
    return null;
  }
  const manualSelection: ChatManualModelSelection = {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: modelId,
  };
  return manualSelection;
}

export function SettingsModelSelectorsSection({
  locale,
  user,
  settings,
  updateSettings,
}: SettingsModelSelectorsSectionProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: tId } = skillIdTranslation.scopedT(locale);
  const envAvailability = useEnvAvailability();

  const [activeSelector, setActiveSelector] = useState<ActiveSelector>(null);

  // Env-aware defaults - recompute when env changes
  const selectorDefaults = useMemo(
    () =>
      Object.fromEntries(
        SELECTOR_CONFIGS.map((c) => [
          c.key,
          makeDefaultSelection(c.allowedRoles, user, envAvailability),
        ]),
      ),
    [user, envAvailability],
  );

  // ── Full-panel takeover: chat model ──────────────────────────────────────
  if (activeSelector === "chat") {
    const chatSelection = getChatModelSelection(settings);
    return (
      <Div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setActiveSelector(null)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <ModelSelector
          modelSelection={chatSelection ?? undefined}
          onChange={async (sel) => {
            if (
              sel !== null &&
              sel.selectionType === ModelSelectionType.MANUAL
            ) {
              await updateSettings({
                selectedModel: sel.manualModelId as ChatModelId,
              });
            }
          }}
          onSelect={() => setActiveSelector(null)}
          locale={locale}
          user={user}
          chatOnly
        />
      </Div>
    );
  }

  // ── Full-panel takeover: media model selectors ───────────────────────────
  if (activeSelector !== null) {
    const config = SELECTOR_CONFIGS.find(
      (c) => c.selectorKey === activeSelector,
    );
    if (config !== undefined) {
      const currentSelection = getModelSelectionFromSettings(
        settings,
        config.key,
      );
      return (
        <Div className="flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setActiveSelector(null)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <ModelSelector
            allowedRoles={config.allowedRoles}
            requiredInputs={config.requiredInputs}
            modelSelection={currentSelection ?? undefined}
            onChange={async (sel) => {
              await updateSettings({ [config.key]: sel });
            }}
            onSelect={async (confirmed) => {
              const defaultSel = selectorDefaults[config.key];
              const isDefault =
                confirmed !== null &&
                confirmed.selectionType === ModelSelectionType.MANUAL &&
                defaultSel?.selectionType === ModelSelectionType.MANUAL &&
                defaultSel.manualModelId === confirmed.manualModelId;
              await updateSettings({
                [config.key]: isDefault ? null : confirmed,
              });
              setActiveSelector(null);
            }}
            locale={locale}
            user={user}
          />
        </Div>
      );
    }
  }

  // ── Default view: trigger cards ──────────────────────────────────────────
  const chatSelection = getChatModelSelection(settings);

  const renderSelector = (
    config: Omit<SelectorConfig, "defaultModelSelection">,
  ): JSX.Element => {
    const currentSelection = getModelSelectionFromSettings(
      settings,
      config.key,
    );
    return (
      <Div key={config.key} className="flex flex-col gap-1">
        <Span className="text-xs opacity-40">
          {tId(`get.models.slots.${config.slotKey}`)}
        </Span>
        <ModelSelectorTrigger
          modelSelection={currentSelection}
          allowedRoles={config.allowedRoles}
          requiredInputs={config.requiredInputs}
          defaultModelSelection={selectorDefaults[config.key]}
          placeholder={t(config.placeholderKey)}
          onClick={() => setActiveSelector(config.selectorKey)}
          locale={locale}
          user={user}
        />
      </Div>
    );
  };

  return (
    <Div className="flex flex-col gap-3">
      {/* Brain - Chat */}
      <ModelGroup
        icon={<Brain className="h-4 w-4" />}
        label={tId("get.models.brain")}
      >
        <Div className="flex flex-col gap-1">
          <Span className="text-xs opacity-40">
            {tId("get.models.slots.chat")}
          </Span>
          <ModelSelectorTrigger
            modelSelection={chatSelection}
            placeholder={t("patch.chatModel.placeholder")}
            onClick={() => setActiveSelector("chat")}
            locale={locale}
            user={user}
          />
        </Div>
      </ModelGroup>

      {/* Eyes - Vision */}
      <ModelGroup
        icon={<Eye className="h-4 w-4" />}
        label={tId("get.models.eyes")}
      >
        {SELECTOR_CONFIGS.filter((c) => c.group === "eyes").map(renderSelector)}
      </ModelGroup>

      {/* Ears & Voice */}
      <ModelGroup
        icon={<Mic className="h-4 w-4" />}
        label={tId("get.models.ears")}
      >
        {SELECTOR_CONFIGS.filter((c) => c.group === "ears").map(renderSelector)}
      </ModelGroup>

      {/* Media - Generation */}
      <ModelGroup
        icon={<Film className="h-4 w-4" />}
        label={tId("get.models.media")}
      >
        {SELECTOR_CONFIGS.filter((c) => c.group === "media").map(
          renderSelector,
        )}
      </ModelGroup>
    </Div>
  );
}
