/**
 * CompactTrigger Widget
 * Standalone reusable component for editing/viewing the auto-compact token threshold.
 * Used in: character edit, favorite edit, settings edit.
 *
 * "Context Memory Budget" — how many tokens of conversation history the AI
 * keeps before summarising older messages to save cost.
 */

/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import { DollarSign } from "next-vibe-ui/ui/icons/DollarSign";
import { Info } from "next-vibe-ui/ui/icons/Info";
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
import type { JSX, ReactNode } from "react";
import { useMemo } from "react";

import { COMPACT_TRIGGER } from "@/app/api/[locale]/agent/ai-stream/repository/core/constants";
import { CharactersRepositoryClient } from "@/app/api/[locale]/agent/chat/characters/repository-client";
import type {
  FiltersModelSelection,
  ManualModelSelection,
  ModelSelectionSimple,
} from "@/app/api/[locale]/agent/models/components/types";
import {
  getModelById,
  type ModelId,
} from "@/app/api/[locale]/agent/models/models";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
  modelSelection:
    | FiltersModelSelection
    | ManualModelSelection
    | ModelSelectionSimple
    | ModelId
    | null
    | undefined,
  characterModelSelection?: FiltersModelSelection | ManualModelSelection | null,
): number {
  if (typeof modelSelection === "string") {
    const model = getModelById(modelSelection);
    return model.contextWindow;
  }

  // Use the same resolution logic as getBestModelForFavorite:
  // favorite override → character default → MAX_ABSOLUTE
  const best = CharactersRepositoryClient.getBestModelForFavorite(
    (modelSelection as FiltersModelSelection | ManualModelSelection | null) ??
      null,
    characterModelSelection ?? undefined,
    user,
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
                  fewer tokens — reducing cost.
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
   * Favorite's own model selection override — used to cap the slider.
   * When null/undefined, falls back to characterModelSelection.
   */
  modelSelection?:
    | FiltersModelSelection
    | ManualModelSelection
    | ModelSelectionSimple
    | ModelId
    | null;
  /**
   * Character's model selection — fallback when favoriteModelSelection is null.
   * Ensures the slider cap reflects the actual resolved model.
   */
  characterModelSelection?: FiltersModelSelection | ManualModelSelection | null;
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
  const modelCap = useMemo(
    () =>
      Math.min(
        getModelContextWindow(user, modelSelection, characterModelSelection),
        MAX_ABSOLUTE,
      ),
    [modelSelection, characterModelSelection, user],
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
          " (to a point) — you trade a little memory for lower per-message cost."
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

// Color values for the progress bar (inline style — cannot mix className + style on Div)
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
        {/* Inner bar: use style-only (StyleType constraint — no mixing style+className on Div) */}
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
