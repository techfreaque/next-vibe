/**
 * Unified Model Credit Display Component
 * Single source of truth for displaying model credit costs
 *
 * This component:
 * - Takes only modelId as input
 * - Calculates credit costs on the frontend
 * - Shows detailed popover with cost ranges and examples
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

import { STANDARD_MARKUP_PERCENTAGE } from "../../../products/constants";
import {
  COMPACT_TRIGGER,
  COMPACT_TRIGGER_PERCENTAGE,
} from "../../ai-stream/repository/core/constants";
import { scopedTranslation } from "../i18n";
import {
  calculateCreditCost,
  getCreditCostFromModel,
  getModelById,
  type ModelId,
} from "../models";

/**
 * Props for ModelCreditDisplay component
 */
export interface ModelCreditDisplayProps {
  /** Model ID to display cost for */
  modelId: ModelId;

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
 * Calculate cost range for different message sizes
 * All scenarios represent realistic usage patterns
 */
function calculateCostRanges(model: ReturnType<typeof getModelById>): {
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

  const scenarios: Array<{
    name: string;
    input: number;
    output: number;
  }> = [
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

/**
 * Format numbers with commas for readability
 */
function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

/**
 * Format token count for display (e.g., "32K" instead of "32,000")
 */
function formatTokenThreshold(tokens: number): string {
  if (tokens >= 1000) {
    return `${Math.floor(tokens / 1000)}K`;
  }
  return tokens.toString();
}

/**
 * Unified component for displaying model credit costs
 *
 * Usage:
 * ```tsx
 * <ModelCreditDisplay
 *   modelId={ModelId.CLAUDE_HAIKU_4_5}
 *   variant="badge"
 *   t={t}
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
  const model = getModelById(modelId);
  const [isOpen, setIsOpen] = useState(false);
  const openTimeoutRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  // Determine currency based on country
  const country = getCountryFromLocale(locale);
  const currency = country === "DE" ? "EUR" : "USD";
  const creditValue = currency === "EUR" ? "0.01 EUR" : "$0.01 USD";

  // Determine if token-based
  const isTokenBased = typeof model.creditCost === "function";

  // Media type detection
  const isImage = "creditCostPerImage" in model;
  const isClip = "creditCostPerClip" in model;
  const isVideo =
    "creditCostPerSecond" in model && "defaultDurationSeconds" in model;
  const isStt =
    "creditCostPerSecond" in model && !("defaultDurationSeconds" in model);

  // Per-image or per-clip fixed cost - stored raw, apply markup for display
  const rawMediaCost = isImage
    ? (model as { creditCostPerImage: number }).creditCostPerImage
    : isClip
      ? (model as { creditCostPerClip: number }).creditCostPerClip
      : null;
  const fixedMediaCost =
    rawMediaCost !== null
      ? Math.round(rawMediaCost * (1 + STANDARD_MARKUP_PERCENTAGE) * 10000) /
        10000
      : null;

  // Per-second cost (video or STT) - calculateCreditCost already applies markup
  const isPerSecond = isVideo || isStt;
  const computedPerSecondCost = isPerSecond
    ? calculateCreditCost(model, 0, 0)
    : null;
  const defaultDuration = isVideo
    ? (model as { defaultDurationSeconds: number }).defaultDurationSeconds
    : null;

  // Check if truly free (model.creditCost === 0, not rounded to 0)
  const isTrulyFree =
    !isTokenBased &&
    fixedMediaCost === null &&
    !isPerSecond &&
    typeof model.creditCost === "number" &&
    model.creditCost === 0;

  // Calculate cost ranges
  const costData = isTokenBased ? calculateCostRanges(model) : null;
  const costRanges = costData?.ranges ?? [];
  const effectiveTrigger = costData?.effectiveTrigger ?? 0;
  const minCost = costRanges.length > 0 ? costRanges[0].cost : 0;
  const maxCost =
    costRanges.length > 0 ? costRanges[costRanges.length - 1].cost : 0;
  const midCost =
    costRanges.length > 1 ? costRanges[1].cost : (minCost + maxCost) / 2;

  // Format cost text with proper unit per media type
  let costText: string;
  if (isTrulyFree) {
    costText = t("selector.free");
  } else if (isTokenBased) {
    costText = `~${midCost} credits`;
  } else if (fixedMediaCost !== null && isImage) {
    costText = `${fixedMediaCost} ${t("creditDisplay.media.perImage")}`;
  } else if (fixedMediaCost !== null && isClip) {
    costText = `${fixedMediaCost} ${t("creditDisplay.media.perClip")}`;
  } else if (computedPerSecondCost !== null && isVideo) {
    costText = `${computedPerSecondCost} ${t("creditDisplay.media.perClipDuration", { duration: defaultDuration ?? 0 })}`;
  } else if (computedPerSecondCost !== null && isStt) {
    costText = `${computedPerSecondCost} ${t("creditDisplay.media.perSecond")}`;
  } else {
    const cost = typeof model.creditCost === "number" ? model.creditCost : 0;
    if (cost === 1) {
      costText = t("credits.credit", { count: cost });
    } else {
      costText = t("credits.credits", { count: cost });
    }
  }

  // Base content without popover
  const baseContent =
    variant === "badge" ? (
      <Badge variant={badgeVariant} className={className}>
        {costText}
      </Badge>
    ) : (
      <Span className={className}>{costText}</Span>
    );

  const handleMouseEnter = (): void => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    // Open with a 500ms delay
    openTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(true);
    }, 500);
  };

  const handleMouseLeave = (): void => {
    // Clear any pending open timeout
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    // Close with a short delay
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // Render popover for both token-based and fixed-cost models
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
          {isTokenBased ? (
            // Token-based model popover
            <Div className="space-y-4">
              {/* Header */}
              <Div className="space-y-1.5">
                <Span className="font-semibold text-sm block">
                  {model.name}
                </Span>
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
                                {t(
                                  "creditDisplay.tokenBased.triggersCompacting",
                                )}
                              </Badge>
                            )}
                          </Div>
                          <Span className="text-muted-foreground block text-[10px] leading-tight">
                            {t("creditDisplay.tokenBased.tokensCount", {
                              count: formatNumber(
                                scenario.input + scenario.output,
                              ),
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
                  <Strong>
                    {t("creditDisplay.tokenBased.compactingLabel")}
                  </Strong>
                  {t("creditDisplay.tokenBased.compactingExplanation", {
                    threshold: formatTokenThreshold(effectiveTrigger),
                  })}
                </Span>
                <Span className="text-[10px] text-muted-foreground block">
                  {t("creditDisplay.creditValue", {
                    value: creditValue,
                  })}
                </Span>
              </Div>
            </Div>
          ) : (
            // Fixed-cost model popover
            <Div className="space-y-4">
              {/* Header */}
              <Div className="space-y-1.5">
                <Span className="font-semibold text-sm block">
                  {t("creditDisplay.fixed.title", {
                    model: model.name,
                  })}
                </Span>
                <Span className="text-xs text-muted-foreground block leading-relaxed">
                  {isTrulyFree
                    ? t("creditDisplay.fixed.freeDescription")
                    : isImage
                      ? t("creditDisplay.media.imageDescription")
                      : isClip
                        ? t("creditDisplay.media.clipDescription")
                        : isVideo
                          ? t("creditDisplay.media.videoDescription", {
                              duration: defaultDuration ?? 0,
                            })
                          : isStt
                            ? t("creditDisplay.media.sttDescription")
                            : t("creditDisplay.fixed.fixedDescription")}
                </Span>
              </Div>

              {/* Cost highlight */}
              {!isTrulyFree && (
                <Div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {isImage
                      ? t("creditDisplay.media.costPerImage")
                      : isClip
                        ? t("creditDisplay.media.costPerClip")
                        : isVideo || isStt
                          ? t("creditDisplay.media.costPerSecond")
                          : t("creditDisplay.fixed.costPerMessage")}
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
                  {t("creditDisplay.creditValue", {
                    value: creditValue,
                  })}
                </Span>
              </Div>
            </Div>
          )}
        </PopoverContent>
      </Popover>
    </Div>
  );
}
