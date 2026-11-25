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

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe/ui/components/popover";
import { Span } from "next-vibe/ui/components/span";
import { Strong } from "next-vibe/ui/components/strong";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";
import { useRef, useState } from "react";

import { STANDARD_MARKUP_PERCENTAGE } from "@/products/constants";
import {
  formatCreditsAsMoney,
  formatCreditUnitPrice,
  FREE_PLAN_MONTHLY_CREDITS,
  freePlanMessageCount,
} from "@/products/credit-money";

import { chatModelOptions } from "../../ai-stream/models";
import {
  COMPACT_TRIGGER,
  COMPACT_TRIGGER_PERCENTAGE,
} from "../../ai-stream/repository/core/constants";
import { imageGenModelOptions } from "../../image-generation/models";
import { musicGenModelOptions } from "../../music-generation/models";
import { sttModelOptions } from "../../speech-to-text/models";
import { ttsModelOptions } from "../../text-to-speech/models";
import { videoGenModelOptions } from "../../video-generation/models";
import type { AnyModelOptionWithVision } from "../all-models";
import { scopedTranslation } from "../i18n";
import {
  type AnyModelId,
  type AnyModelOption,
  CHAT_MESSAGE_PRICE_REFERENCE,
  estimateTurnCredits,
  getEstimatedImageOutputTokens,
  getModelPrice,
  type ModelOptionTokenBased,
  PRICE_REFERENCE_STT_SECONDS,
  PRICE_REFERENCE_TTS_CHARS,
} from "../models";

/**
 * Props for ModelCreditDisplay component
 */
export interface ModelCreditDisplayProps {
  /** Any model ID - chat, image, video, music, TTS, STT */
  modelId: AnyModelId;

  /** Resolved provider option when the caller has already picked a route. */
  modelOption?: AnyModelOptionWithVision;

  /** Display variant - badge (default) or text */
  variant?: "badge" | "text";

  /** Badge style variant (only used when variant="badge") */
  badgeVariant?: "outline" | "secondary" | "default";

  /** Additional CSS classes */
  className?: string;

  /**
   * false = plain text, no breakdown popover. Use inside other buttons/rows
   * (a popover trigger can't nest inside a button). Defaults to true.
   */
  interactive?: boolean;

  /** User's locale for currency formatting */
  locale: CountryLanguage;

  /** Append the money equivalent ("≈ $0.04"). Defaults to true. */
  showMoney?: boolean;

  /** Extra classes for the money suffix, e.g. "hidden sm:inline" in tight rows */
  moneyClassName?: string;
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
function calculateCostRanges(model: ModelOptionTokenBased): {
  ranges: Array<{
    name: string;
    input: number;
    output: number;
    cost: number;
    willCompact: boolean;
  }>;
  effectiveTrigger: number;
} {
  const modelContextLimit = Math.floor(
    model.contextWindow * COMPACT_TRIGGER_PERCENTAGE,
  );
  const effectiveTrigger = Math.min(COMPACT_TRIGGER, modelContextLimit);

  const scenarios: Array<{ name: string; input: number; output: number }> = [
    { name: "Short reply", input: 5_000, output: 500 },
    {
      name: "Normal chat",
      input: CHAT_MESSAGE_PRICE_REFERENCE.inputTokens,
      output: CHAT_MESSAGE_PRICE_REFERENCE.outputTokens,
    },
    { name: "Long conversation", input: effectiveTrigger, output: 2_000 },
  ];

  // Image-output models: every scenario also generates one image.
  const imageTokens = getEstimatedImageOutputTokens(model);

  return {
    ranges: scenarios.map((scenario) => ({
      ...scenario,
      output: scenario.output + imageTokens,
      cost: estimateTurnCredits(model, scenario.input, scenario.output),
      willCompact: scenario.input >= effectiveTrigger,
    })),
    effectiveTrigger,
  };
}

// The catalog renders a price for every model, so share the formatter across rows.
const creditNumberFormats = new Map<CountryLanguage, Intl.NumberFormat>();

function creditNumberFormat(locale: CountryLanguage): Intl.NumberFormat {
  const existing = creditNumberFormats.get(locale);
  if (existing) {
    return existing;
  }
  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 20,
  });
  creditNumberFormats.set(locale, formatter);
  return formatter;
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
  modelOption,
  variant = "badge",
  badgeVariant = "secondary",
  className,
  locale,
  interactive = true,
  showMoney = true,
  moneyClassName,
}: ModelCreditDisplayProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const formatNumber = creditNumberFormat(locale).format;
  const model = modelOption ?? findModel(modelId);
  const [isOpen, setIsOpen] = useState(false);
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Credit value in the visitor's checkout currency (credit pack price)
  const creditValue = formatCreditUnitPrice(locale);
  const creditValueLine = t("creditDisplay.creditValue", {
    value: creditValue,
  });

  // ─── Billing shape narrowing & cost text ────────────────────────────────────

  let costText: string;
  let popoverContent: JSX.Element;
  /** Credits charged per unit shown in costText - drives the money hint */
  let costCredits = 0;
  /** Chat models: cost is per message, so the free-plan message count applies */
  let perMessage = false;

  if (!model) {
    // Unknown model - show free
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
    costText = t("creditDisplay.badge.perImg", { cost: formatNumber(cost) });
    costCredits = cost;

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
            {creditValueLine}
          </Span>
        </Div>
      </Div>
    );
  } else if (model.creditCostPerClip !== undefined) {
    // Music/audio generation (fixed cost per clip)
    const cost = getModelPrice(model);
    costText = t("creditDisplay.badge.perClip", { cost: formatNumber(cost) });
    costCredits = cost;

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
            {creditValueLine}
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
    costText = t("creditDisplay.badge.perClip", {
      cost: formatNumber(totalCost),
    });
    costCredits = totalCost;

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
              costPerSecond: formatNumber(displayCostPerSecond),
              duration: formatNumber(duration),
              total: formatNumber(totalCost),
            })}
          </Span>
          <Span className="text-xs text-muted-foreground block leading-relaxed">
            {t("creditDisplay.media.videoDescription", {
              duration: formatNumber(duration),
            })}
          </Span>
        </Div>
        <Div className="pt-3 border-t">
          <Span className="text-[10px] text-muted-foreground block">
            {creditValueLine}
          </Span>
        </Div>
      </Div>
    );
  } else if (model.creditCostPerCharacter !== undefined) {
    // TTS (cost per character) - badge shows average cost like LLMs
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
    costText = t("creditDisplay.badge.approxPerMsg", {
      cost: formatNumber(avgCost),
    });
    costCredits = avgCost;

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
              rate: formatNumber(
                Math.round(costPerCharWithMarkup * 10000) / 10000,
              ),
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
                    {cost === 0
                      ? t("creditDisplay.badge.lessThanMin")
                      : formatNumber(cost)}
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
            {creditValueLine}
          </Span>
        </Div>
      </Div>
    );
  } else if (
    model.creditCostPerSecond !== undefined &&
    model.defaultDurationSeconds === undefined
  ) {
    // STT (cost per second - no defaultDurationSeconds) - badge shows average cost
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
    costText = t("creditDisplay.badge.approxPerMsg", {
      cost: formatNumber(avgCost),
    });
    costCredits = avgCost;

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
              rate: formatNumber(
                Math.round(costPerSecWithMarkup * 10000) / 10000,
              ),
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
                        count: formatNumber(scenario.seconds),
                      })}
                    </Span>
                  </Div>
                  <Span className="font-mono font-semibold text-sm">
                    {cost === 0
                      ? t("creditDisplay.badge.lessThanMin")
                      : formatNumber(cost)}
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
            {creditValueLine}
          </Span>
        </Div>
      </Div>
    );
  } else if (typeof model.creditCost === "function") {
    // Token-based chat model
    const costData = calculateCostRanges(model);
    const costRanges = costData.ranges;
    const effectiveTrigger = costData.effectiveTrigger;
    const minCost = costRanges.length > 0 ? costRanges[0].cost : 0;
    const maxCost =
      costRanges.length > 0 ? costRanges[costRanges.length - 1].cost : 0;
    const midCost =
      costRanges.length > 1 ? costRanges[1].cost : (minCost + maxCost) / 2;
    costText = t("creditDisplay.badge.approxPerMsg", {
      cost: formatNumber(midCost),
    });
    costCredits = midCost;
    perMessage = true;

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
              min: formatNumber(minCost),
              max: formatNumber(maxCost),
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
                          className="text-[9px] h-4 px-1 bg-warning/10 text-warning border-warning/20"
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
                    {formatNumber(scenario.cost)}
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
            {creditValueLine}
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
      costText = t("creditDisplay.badge.exactPerMsg", {
        cost: formatNumber(creditCostRaw),
      });
      costCredits = creditCostRaw;
      perMessage = true;
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
            {creditValueLine}
          </Span>
        </Div>
      </Div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  // Human scale next to the credit price: "≈ $0.04" in the checkout currency
  const moneyText = showMoney
    ? formatCreditsAsMoney(costCredits, locale)
    : null;
  const moneySuffix = moneyText ? (
    <Span className={cn("ml-1 font-normal opacity-70", moneyClassName)}>
      {moneyText}
    </Span>
  ) : null;
  const freeMessages = perMessage ? freePlanMessageCount(costCredits) : null;

  const baseContent =
    variant === "badge" ? (
      <Badge variant={badgeVariant} className={className}>
        {costText}
        {moneySuffix}
      </Badge>
    ) : (
      <Span className={className}>
        {costText}
        {moneySuffix}
      </Span>
    );

  if (!interactive) {
    return baseContent;
  }

  const handleMouseEnter = (): void => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    openTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 500);
  };

  const handleMouseLeave = (): void => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <Div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-flex items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto min-h-0 p-0 hover:bg-transparent cursor-help leading-none"
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
          {freeMessages !== null && (
            <Span className="mt-1 block text-[10px] text-muted-foreground">
              {t("creditDisplay.freePlanMessages", {
                count: formatNumber(freeMessages),
                credits: formatNumber(FREE_PLAN_MONTHLY_CREDITS),
              })}
            </Span>
          )}
        </PopoverContent>
      </Popover>
    </Div>
  );
}
