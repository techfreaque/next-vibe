/**
 * Unified Model Credit Display Component
 * Handles ALL model types: chat, image, video, music, TTS, STT
 *
 * This component:
 * - Takes any AnyModelId as input (chat, image, video, music, TTS, STT)
 * - Calculates credit costs on the frontend using billing shape narrowing
 * - Shows detailed popover with per-type cost breakdown
 * - Supports both Badge and inline text display modes
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { Span } from "next-vibe-ui/ui/span";
import { Strong } from "next-vibe-ui/ui/strong";
import type { JSX } from "react";
import { useRef, useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";

import {
  chatModelOptions,
  type ChatModelOption,
} from "@/app/api/[locale]/agent/ai-stream/models";
import { imageGenModelOptions } from "@/app/api/[locale]/agent/image-generation/models";
import { musicGenModelOptions } from "@/app/api/[locale]/agent/music-generation/models";
import { sttModelOptions } from "@/app/api/[locale]/agent/speech-to-text/models";
import { ttsModelOptions } from "@/app/api/[locale]/agent/text-to-speech/models";
import { videoGenModelOptions } from "@/app/api/[locale]/agent/video-generation/models";
import { STANDARD_MARKUP_PERCENTAGE } from "../../../products/constants";
import {
  COMPACT_TRIGGER,
  COMPACT_TRIGGER_PERCENTAGE,
} from "../../ai-stream/repository/core/constants";
import { getCreditCostFromModel, getModelPrice } from "../all-models";
import { scopedTranslation } from "../i18n";
import {
  type AnyModelId,
  type AnyModelOption,
  PRICE_REFERENCE_STT_SECONDS,
  PRICE_REFERENCE_TTS_CHARS,
} from "../models";

/**
 * Props for ModelCreditDisplay component
 */
export interface ModelCreditDisplayProps {
  /** Any model ID — chat, image, video, music, TTS, STT */
  modelId: AnyModelId;

  /** Display variant - badge (default) or text */
  variant?: "badge" | "text";

  /** Badge style variant (only used when variant="badge") */
  badgeVariant?: "outline" | "secondary" | "default";

  /** Additional CSS classes */
  className?: string;

  /** User's locale for currency formatting */
  locale: CountryLanguage;
}

/**
 * Find a model option by ID, checking all role-specific registries in order.
 */
function findModel(id: AnyModelId): AnyModelOption | undefined {
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
 * Calculate cost range for different message sizes (chat token-based only)
 */
function calculateCostRanges(model: ChatModelOption): {
  ranges: Array<{
    name: string;
    input: number;
    output: number;
    cost: number;
    willCompact: boolean;
  }>;
  effectiveTrigger: number;
} {
  if (!("contextWindow" in model)) {
    return { ranges: [], effectiveTrigger: 0 };
  }
  const modelContextLimit = Math.floor(
    model.contextWindow * COMPACT_TRIGGER_PERCENTAGE,
  );
  const effectiveTrigger = Math.min(COMPACT_TRIGGER, modelContextLimit);

  const scenarios: Array<{ name: string; input: number; output: number }> = [
    { name: "Short reply", input: 5_000, output: 500 },
    { name: "Normal chat", input: 16_000, output: 1_500 },
    { name: "Long conversation", input: effectiveTrigger, output: 2_000 },
  ];

  return {
    ranges: scenarios.map((scenario) => ({
      ...scenario,
      cost: getCreditCostFromModel(model, scenario.input, scenario.output),
      willCompact: scenario.input >= effectiveTrigger,
    })),
    effectiveTrigger,
  };
}

/** Format numbers with commas for readability */
function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

/** Format token count for display (e.g., "32K" instead of "32,000") */
function formatTokenThreshold(tokens: number): string {
  if (tokens >= 1000) {
    return `${Math.floor(tokens / 1000)}K`;
  }
  return tokens.toString();
}

/**
 * Unified component for displaying model credit costs across all model types.
 *
 * Usage:
 * ```tsx
 * <ModelCreditDisplay
 *   modelId={ChatModelId.CLAUDE_HAIKU_4_5}
 *   variant="badge"
 *   locale={locale}
 * />
 * <ModelCreditDisplay
 *   modelId={ImageGenModelId.DALL_E_3}
 *   variant="badge"
 *   locale={locale}
 * />
 * ```
 */
export function ModelCreditDisplay({
  modelId,
  variant = "badge",
  badgeVariant = "secondary",
  className,
  locale,
}: ModelCreditDisplayProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const model = findModel(modelId);
  const [isOpen, setIsOpen] = useState(false);
  const openTimeoutRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  // Determine currency based on country
  const country = getCountryFromLocale(locale);
  const currency = country === "DE" ? "EUR" : "USD";
  const creditValue = currency === "EUR" ? "0.01 EUR" : "$0.01 USD";

  // ─── Billing shape narrowing & cost text ────────────────────────────────────

  let costText: string;
  let popoverContent: JSX.Element;

  if (!model) {
    // Unknown model — show free
    costText = t("selector.free");
    popoverContent = (
      <Div className="space-y-2">
        <Span className="text-xs text-muted-foreground block">
          {t("selector.free")}
        </Span>
      </Div>
    );
  } else if (model.creditCostPerImage) {
    // Image generation (fixed cost per image)
    const cost = getModelPrice(model);
    costText = t("creditDisplay.badge.perImg", { cost });

    popoverContent = (
      <Div className="space-y-4">
        <Div className="space-y-1.5">
          <Span className="font-semibold text-sm block">{model.name}</Span>
          <Span className="text-xs text-muted-foreground block leading-relaxed">
            {t("creditDisplay.media.imageHeader")}
          </Span>
        </Div>
        <Div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("creditDisplay.media.costPerImage")}
          </Span>
          <Span className="text-sm font-bold">{costText}</Span>
        </Div>
        <Div className="space-y-2">
          <Span className="text-xs text-muted-foreground block leading-relaxed">
            {t("creditDisplay.media.imageDescription")}
          </Span>
        </Div>
        <Div className="pt-3 border-t">
          <Span className="text-[10px] text-muted-foreground block">
            {t("creditDisplay.creditValue", { value: creditValue })}
          </Span>
        </Div>
      </Div>
    );
  } else if (model.creditCostPerClip !== undefined) {
    // Music/audio generation (fixed cost per clip)
    const cost = getModelPrice(model);
    costText = t("creditDisplay.badge.perClip", { cost });

    popoverContent = (
      <Div className="space-y-4">
        <Div className="space-y-1.5">
          <Span className="font-semibold text-sm block">{model.name}</Span>
          <Span className="text-xs text-muted-foreground block leading-relaxed">
            {t("creditDisplay.media.musicHeader")}
          </Span>
        </Div>
        <Div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("creditDisplay.media.costPerClipMusic")}
          </Span>
          <Span className="text-sm font-bold">{costText}</Span>
        </Div>
        <Div className="space-y-2">
          <Span className="text-xs text-muted-foreground block leading-relaxed">
            {t("creditDisplay.media.clipDescription")}
          </Span>
        </Div>
        <Div className="pt-3 border-t">
          <Span className="text-[10px] text-muted-foreground block">
            {t("creditDisplay.creditValue", { value: creditValue })}
          </Span>
        </Div>
      </Div>
    );
  } else if (
    model.creditCostPerSecond !== undefined &&
    model.defaultDurationSeconds !== undefined
  ) {
    // Video generation (cost per second × default duration)
    const duration = model.defaultDurationSeconds;
    const totalCost = getModelPrice(model);
    const displayCostPerSecond =
      Math.round(
        model.creditCostPerSecond * (1 + STANDARD_MARKUP_PERCENTAGE) * 10000,
      ) / 10000;
    costText = t("creditDisplay.badge.perClip", { cost: totalCost });

    popoverContent = (
      <Div className="space-y-4">
        <Div className="space-y-1.5">
          <Span className="font-semibold text-sm block">{model.name}</Span>
          <Span className="text-xs text-muted-foreground block leading-relaxed">
            {t("creditDisplay.media.videoHeader")}
          </Span>
        </Div>
        <Div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("creditDisplay.media.costPerClip")}
          </Span>
          <Span className="text-sm font-bold">{costText}</Span>
        </Div>
        <Div className="space-y-2">
          <Span className="text-xs text-muted-foreground block leading-relaxed">
            {t("creditDisplay.media.videoBreakdown", {
              costPerSecond: displayCostPerSecond,
              duration,
              total: totalCost,
            })}
          </Span>
          <Span className="text-xs text-muted-foreground block leading-relaxed">
            {t("creditDisplay.media.videoDescription", { duration })}
          </Span>
        </Div>
        <Div className="pt-3 border-t">
          <Span className="text-[10px] text-muted-foreground block">
            {t("creditDisplay.creditValue", { value: creditValue })}
          </Span>
        </Div>
      </Div>
    );
  } else if (model.creditCostPerCharacter !== undefined) {
    // TTS (cost per character) — badge shows average cost like LLMs
    const avgCost = getModelPrice(model); // average for ~600 chars
    const costPerCharWithMarkup =
      model.creditCostPerCharacter * (1 + STANDARD_MARKUP_PERCENTAGE);
    const ttsScenarios = [
      { name: "creditDisplay.media.ttsScenarios.short" as const, chars: 200 },
      {
        name: "creditDisplay.media.ttsScenarios.medium" as const,
        chars: PRICE_REFERENCE_TTS_CHARS,
      },
      { name: "creditDisplay.media.ttsScenarios.long" as const, chars: 2000 },
    ];
    costText = t("creditDisplay.badge.approxPerMsg", { cost: avgCost });

    popoverContent = (
      <Div className="space-y-4">
        <Div className="space-y-1.5">
          <Span className="font-semibold text-sm block">{model.name}</Span>
          <Span className="text-xs text-muted-foreground block leading-relaxed">
            {t("creditDisplay.media.ttsHeader")}
          </Span>
        </Div>
        <Div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("creditDisplay.media.ttsPricing")}
          </Span>
          <Span className="text-sm font-bold">
            {t("creditDisplay.badge.ratePerChar", {
              rate: Math.round(costPerCharWithMarkup * 10000) / 10000,
            })}
          </Span>
        </Div>
        <Div className="space-y-2.5">
          <Span className="text-xs font-medium text-muted-foreground block">
            {t("creditDisplay.tokenBased.examplesLabel")}
          </Span>
          <Div className="space-y-2">
            {ttsScenarios.map((scenario, idx) => {
              const cost =
                Math.round(scenario.chars * costPerCharWithMarkup * 10) / 10;
              return (
                <Div
                  key={idx}
                  className="flex items-start justify-between text-xs p-2 rounded-md hover:bg-muted/30 transition-colors"
                >
                  <Div className="flex-1 space-y-0.5">
                    <Span className="font-medium">{t(scenario.name)}</Span>
                    <Span className="text-muted-foreground block text-[10px] leading-tight">
                      {t("creditDisplay.badge.approxChars", {
                        count: formatNumber(scenario.chars),
                      })}
                    </Span>
                  </Div>
                  <Span className="font-mono font-semibold text-sm">
                    {cost === 0 ? t("creditDisplay.badge.lessThanMin") : cost}
                  </Span>
                </Div>
              );
            })}
          </Div>
        </Div>
        <Div className="pt-3 border-t space-y-2">
          <Span className="text-[10px] text-muted-foreground block leading-relaxed">
            {t("creditDisplay.media.ttsDescription")}
          </Span>
          <Span className="text-[10px] text-muted-foreground block">
            {t("creditDisplay.creditValue", { value: creditValue })}
          </Span>
        </Div>
      </Div>
    );
  } else if (
    model.creditCostPerSecond !== undefined &&
    model.defaultDurationSeconds === undefined
  ) {
    // STT (cost per second — no defaultDurationSeconds) — badge shows average cost
    const avgCost = getModelPrice(model); // average for ~30s
    const costPerSecWithMarkup =
      model.creditCostPerSecond * (1 + STANDARD_MARKUP_PERCENTAGE);
    const sttScenarios = [
      { name: "creditDisplay.media.sttScenarios.short" as const, seconds: 15 },
      {
        name: "creditDisplay.media.sttScenarios.medium" as const,
        seconds: PRICE_REFERENCE_STT_SECONDS,
      },
      { name: "creditDisplay.media.sttScenarios.long" as const, seconds: 60 },
    ];
    costText = t("creditDisplay.badge.approxPerMsg", { cost: avgCost });

    popoverContent = (
      <Div className="space-y-4">
        <Div className="space-y-1.5">
          <Span className="font-semibold text-sm block">{model.name}</Span>
          <Span className="text-xs text-muted-foreground block leading-relaxed">
            {t("creditDisplay.media.sttHeader")}
          </Span>
        </Div>
        <Div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("creditDisplay.media.sttPricing")}
          </Span>
          <Span className="text-sm font-bold">
            {t("creditDisplay.badge.ratePerSec", {
              rate: Math.round(costPerSecWithMarkup * 10000) / 10000,
            })}
          </Span>
        </Div>
        <Div className="space-y-2.5">
          <Span className="text-xs font-medium text-muted-foreground block">
            {t("creditDisplay.tokenBased.examplesLabel")}
          </Span>
          <Div className="space-y-2">
            {sttScenarios.map((scenario, idx) => {
              const cost =
                Math.round(scenario.seconds * costPerSecWithMarkup * 10) / 10;
              return (
                <Div
                  key={idx}
                  className="flex items-start justify-between text-xs p-2 rounded-md hover:bg-muted/30 transition-colors"
                >
                  <Div className="flex-1 space-y-0.5">
                    <Span className="font-medium">{t(scenario.name)}</Span>
                    <Span className="text-muted-foreground block text-[10px] leading-tight">
                      {t("creditDisplay.badge.seconds", {
                        count: scenario.seconds,
                      })}
                    </Span>
                  </Div>
                  <Span className="font-mono font-semibold text-sm">
                    {cost === 0 ? t("creditDisplay.badge.lessThanMin") : cost}
                  </Span>
                </Div>
              );
            })}
          </Div>
        </Div>
        <Div className="pt-3 border-t space-y-2">
          <Span className="text-[10px] text-muted-foreground block leading-relaxed">
            {t("creditDisplay.media.sttDescription")}
          </Span>
          <Span className="text-[10px] text-muted-foreground block">
            {t("creditDisplay.creditValue", { value: creditValue })}
          </Span>
        </Div>
      </Div>
    );
  } else if (typeof model.creditCost === "function") {
    // Token-based chat model
    const chatModel = model as ChatModelOption;
    const costData = calculateCostRanges(chatModel);
    const costRanges = costData.ranges;
    const effectiveTrigger = costData.effectiveTrigger;
    const minCost = costRanges.length > 0 ? costRanges[0].cost : 0;
    const maxCost =
      costRanges.length > 0 ? costRanges[costRanges.length - 1].cost : 0;
    const midCost =
      costRanges.length > 1 ? costRanges[1].cost : (minCost + maxCost) / 2;
    costText = t("creditDisplay.badge.approxPerMsg", { cost: midCost });

    popoverContent = (
      <Div className="space-y-4">
        {/* Header */}
        <Div className="space-y-1.5">
          <Span className="font-semibold text-sm block">{model.name}</Span>
          <Span className="text-xs text-muted-foreground block leading-relaxed">
            {t("creditDisplay.tokenBased.header")}
          </Span>
        </Div>

        {/* Cost range highlight */}
        <Div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("creditDisplay.tokenBased.costRangeLabel")}
          </Span>
          <Span className="text-sm font-bold">
            {t("creditDisplay.tokenBased.costRangeValue", {
              min: minCost,
              max: maxCost,
            })}
          </Span>
        </Div>

        {/* Example scenarios */}
        <Div className="space-y-2.5">
          <Span className="text-xs font-medium text-muted-foreground block">
            {t("creditDisplay.tokenBased.examplesLabel")}
          </Span>
          <Div className="space-y-2">
            {costRanges.map((scenario, idx) => {
              const exampleKey =
                idx === 0
                  ? "creditDisplay.tokenBased.examples.short"
                  : idx === 1
                    ? "creditDisplay.tokenBased.examples.medium"
                    : "creditDisplay.tokenBased.examples.long";

              return (
                <Div
                  key={idx}
                  className="flex items-start justify-between text-xs p-2 rounded-md hover:bg-muted/30 transition-colors"
                >
                  <Div className="flex-1 space-y-0.5">
                    <Div className="flex items-center gap-1.5">
                      <Span className="font-medium">{t(exampleKey)}</Span>
                      {scenario.willCompact && (
                        <Badge
                          variant="outline"
                          className="text-[9px] h-4 px-1 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
                        >
                          {t("creditDisplay.tokenBased.triggersCompacting")}
                        </Badge>
                      )}
                    </Div>
                    <Span className="text-muted-foreground block text-[10px] leading-tight">
                      {t("creditDisplay.tokenBased.tokensCount", {
                        count: formatNumber(scenario.input + scenario.output),
                      })}
                    </Span>
                  </Div>
                  <Span className="font-mono font-semibold text-sm">
                    {scenario.cost}
                  </Span>
                </Div>
              );
            })}
          </Div>
        </Div>

        {/* Footer explanation */}
        <Div className="pt-3 border-t space-y-2.5">
          <Span className="text-[10px] text-muted-foreground block leading-relaxed">
            {t("creditDisplay.tokenBased.explanation")}
          </Span>
          <Span className="text-[10px] text-muted-foreground block leading-relaxed">
            <Strong>{t("creditDisplay.tokenBased.compactingLabel")}</Strong>
            {t("creditDisplay.tokenBased.compactingExplanation", {
              threshold: formatTokenThreshold(effectiveTrigger),
            })}
          </Span>
          <Span className="text-[10px] text-muted-foreground block">
            {t("creditDisplay.creditValue", { value: creditValue })}
          </Span>
        </Div>
      </Div>
    );
  } else {
    // Fixed-cost or free chat model
    const creditCostRaw = getModelPrice(model);
    const isTrulyFree = creditCostRaw === 0;

    if (isTrulyFree) {
      costText = t("selector.free");
    } else {
      costText = t("creditDisplay.badge.exactPerMsg", { cost: creditCostRaw });
    }

    const modelName = model.name;

    popoverContent = (
      <Div className="space-y-4">
        {/* Header */}
        <Div className="space-y-1.5">
          <Span className="font-semibold text-sm block">
            {t("creditDisplay.fixed.title", { model: modelName })}
          </Span>
          <Span className="text-xs text-muted-foreground block leading-relaxed">
            {isTrulyFree
              ? t("creditDisplay.fixed.freeDescription")
              : t("creditDisplay.fixed.fixedDescription")}
          </Span>
        </Div>

        {/* Cost highlight */}
        {!isTrulyFree && (
          <Div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <Span className="text-xs font-medium text-muted-foreground">
              {t("creditDisplay.fixed.costPerMessage")}
            </Span>
            <Span className="text-sm font-bold">{costText}</Span>
          </Div>
        )}

        {/* Explanation */}
        <Div className="space-y-2">
          <Span className="text-xs text-muted-foreground block leading-relaxed">
            {isTrulyFree ? (
              <>
                {t("creditDisplay.fixed.freeExplanation")}{" "}
                <Strong>{t("creditDisplay.fixed.freeHighlight")}</Strong>
              </>
            ) : (
              <>
                <Strong>{t("creditDisplay.fixed.simpleLabel")}</Strong>
                {t("creditDisplay.fixed.simpleExplanation")}
              </>
            )}
          </Span>
        </Div>

        {/* Footer */}
        <Div className="pt-3 border-t">
          <Span className="text-[10px] text-muted-foreground block">
            {t("creditDisplay.creditValue", { value: creditValue })}
          </Span>
        </Div>
      </Div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  const baseContent =
    variant === "badge" ? (
      <Badge variant={badgeVariant} className={className}>
        {costText}
      </Badge>
    ) : (
      <Span className={className}>{costText}</Span>
    );

  const handleMouseEnter = (): void => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    openTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(true);
    }, 500);
  };

  const handleMouseLeave = (): void => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <Div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
      onClick={(e) => e.stopPropagation()}
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent cursor-help"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {baseContent}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 overflow-y-auto max-h-[var(--radix-popper-available-height)]"
          align="start"
          side="bottom"
          sideOffset={8}
          avoidCollisions
          collisionPadding={{ top: 8, right: 8, bottom: 8, left: 8 }}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
        >
          {popoverContent}
        </PopoverContent>
      </Popover>
    </Div>
  );
}
