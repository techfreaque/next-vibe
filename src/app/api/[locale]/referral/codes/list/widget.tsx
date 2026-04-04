/**
 * Custom Widget for Referral Codes List
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { AlertCircle } from "next-vibe-ui/ui/icons/AlertCircle";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Copy } from "next-vibe-ui/ui/icons/Copy";
import { DollarSign } from "next-vibe-ui/ui/icons/DollarSign";
import { Link2 } from "next-vibe-ui/ui/icons/Link2";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import { useCallback, useState } from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { CountriesArr, LanguagesArr } from "@/i18n/core/config";

import { REFERRAL_CONFIG } from "../../config";
import type definition from "./definition";
import type { CodesListGetResponseOutput } from "./definition";

/**
 * Matches all valid CountryLanguage locale path prefixes.
 * Built from LanguagesArr × CountriesArr so it stays in sync with config.
 * e.g. /en-US/, /de-DE/, /pl-GLOBAL/ etc. Also matches bare language /en/, /de/
 */
const ALL_LOCALES = LanguagesArr.flatMap((lang) =>
  CountriesArr.map((country) => `${lang}-${country}`),
);
const LOCALE_PREFIX_RE = new RegExp(
  `^/(${[...ALL_LOCALES, ...LanguagesArr].join("|")})(/|$)`,
);

function formatDollars(cents: number): string {
  const dollars = cents / 100;
  return dollars % 1 === 0
    ? `$${dollars.toFixed(0)}`
    : `$${dollars.toFixed(2)}`;
}

/**
 * Extract a locale-free path from a pasted URL.
 * Handles: full URLs (https://unbottled.ai/en-US/threads),
 * paths with locale (/de-DE/skill/123), bare paths (/threads),
 * and plain text (threads). Strips domain + locale prefix.
 */
function extractPath(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return "";
  }

  let pathname: string;
  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const url = new URL(trimmed);
      pathname = url.pathname + url.search + url.hash;
    } else {
      pathname = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    }
  } catch {
    pathname = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }

  // Strip locale prefix (e.g. /en-US/threads → /threads, /de/skill → /skill)
  const stripped = pathname.replace(LOCALE_PREFIX_RE, "/");
  // Normalise to always start with /
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

/**
 * Inline link generator for a single referral code
 */
function LinkGenerator({
  code,
  t,
}: {
  code: string;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
}): React.JSX.Element {
  const [urlInput, setUrlInput] = useState("");
  const [copiedLinkGen, setCopiedLinkGen] = useState(false);

  const generatedPath = extractPath(urlInput);
  const hasInput = generatedPath.length > 0;

  const handleCopyGenerated = useCallback(async () => {
    if (typeof window === "undefined" || !hasInput) {
      return;
    }
    const trackUrl = `${window.location.origin}/track?ref=${code}&url=${encodeURIComponent(generatedPath)}`;
    await navigator.clipboard.writeText(trackUrl);
    setCopiedLinkGen(true);
    setTimeout(() => {
      setCopiedLinkGen(false);
    }, 2000);
  }, [code, generatedPath, hasInput]);

  return (
    <Div className="flex items-center gap-2">
      <Div className="relative flex-1">
        <Input
          type="text"
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value);
          }}
          placeholder={t("codes.list.widget.linkGenPlaceholder")}
          className="h-8 text-xs pr-2 font-mono"
        />
      </Div>
      <Button
        variant="outline"
        size="sm"
        className="h-8 shrink-0 text-xs"
        disabled={!hasInput}
        onClick={handleCopyGenerated}
      >
        {copiedLinkGen ? (
          <>
            <Check className="h-3 w-3 mr-1.5 text-emerald-500" />
            {t("codes.list.widget.linkGenCopied")}
          </>
        ) : (
          <>
            <Copy className="h-3 w-3 mr-1.5" />
            {t("codes.list.widget.linkGenCopy")}
          </>
        )}
      </Button>
    </Div>
  );
}

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: CodesListGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

/**
 * Custom container widget for referral codes list
 */
export function ReferralCodesListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const codes = field.value?.codes ?? [];
  const t = useWidgetTranslation<typeof definition.GET>();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (code: string, index: number): Promise<void> => {
    if (typeof window !== "undefined") {
      await navigator.clipboard.writeText(
        `${window.location.origin}/track?ref=${code}`,
      );
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    }
  };

  if (codes.length === 0) {
    return (
      <Div className="flex flex-col items-center justify-center py-12 text-center gap-2">
        <Div className="rounded-full bg-muted p-3">
          <Link2 className="h-6 w-6 text-muted-foreground" />
        </Div>
        <Div className="text-sm font-medium text-muted-foreground">
          {t("codes.list.widget.empty")}
        </Div>
        <Div className="text-xs text-muted-foreground/70">
          {t("codes.list.widget.emptyHint")}
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-3">
      {codes.map((code, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            {/* Header with Code and Copy Button */}
            <Div className="flex items-center justify-between gap-3 p-4 border-b bg-muted/30">
              <Div className="flex items-center gap-3 min-w-0 flex-1">
                <Div className="rounded-lg bg-background p-2 border">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                </Div>
                <Div className="min-w-0 flex-1">
                  <Div className="font-mono font-semibold text-base">
                    {code.code}
                  </Div>
                  {code.label && (
                    <Div className="text-xs text-muted-foreground mt-0.5">
                      {code.label}
                    </Div>
                  )}
                </Div>
              </Div>
              <Div className="flex flex-col items-end gap-0.5 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(code.code, index)}
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-emerald-500" />
                      {t("codes.list.widget.copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      {t("codes.list.widget.copy")}
                    </>
                  )}
                </Button>
                <Div className="text-xs text-muted-foreground/60 font-mono truncate max-w-[140px]">
                  {`/track?ref=${code.code}`}
                </Div>
              </Div>
            </Div>

            {/* Link Generator */}
            <Div className="px-4 py-3 border-b bg-muted/10">
              <Div className="flex items-center gap-2 mb-2">
                <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                <Span className="text-xs font-medium text-muted-foreground">
                  {t("codes.list.widget.linkGen")}
                </Span>
                <Span className="text-xs text-muted-foreground/50">
                  — {t("codes.list.widget.linkGenHint")}
                </Span>
              </Div>
              <LinkGenerator code={code.code} t={t} />
            </Div>

            {/* Stats Grid */}
            <Div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0">
              {/* Visitors */}
              <Div className="p-4 flex flex-col gap-1">
                <Div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <Users className="h-3.5 w-3.5" />
                  {t("codes.list.widget.visitors")}
                </Div>
                <Div className="text-lg font-semibold tabular-nums">
                  {code.currentVisitors}
                </Div>
              </Div>

              {/* Signups */}
              <Div className="p-4 flex flex-col gap-1">
                <Div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {t("codes.list.widget.signups")}
                </Div>
                <Div className="text-lg font-semibold tabular-nums">
                  {code.totalSignups}
                </Div>
              </Div>

              {/* Revenue */}
              <Div className="p-4 flex flex-col gap-1">
                <Div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <DollarSign className="h-3.5 w-3.5" />
                  {t("codes.list.widget.revenue")}
                </Div>
                <Div className="text-lg font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {formatDollars(code.totalRevenueCents)}
                </Div>
              </Div>

              {/* Earnings */}
              <Div className="p-4 flex flex-col gap-1">
                <Div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <DollarSign className="h-3.5 w-3.5" />
                  {t("codes.list.widget.earnings")}
                </Div>
                <Div className="text-lg font-semibold tabular-nums text-blue-600 dark:text-blue-400">
                  {formatDollars(code.totalEarningsCents)}
                </Div>
              </Div>
            </Div>

            {/* Conversion rate hint */}
            <Div className="px-4 py-2 border-t bg-muted/20 text-xs text-muted-foreground/70">
              {t("codes.list.widget.conversionHint", {
                exampleEarning: formatDollars(
                  Math.round(
                    REFERRAL_CONFIG.EXAMPLE_PRICE_CENTS *
                      REFERRAL_CONFIG.DIRECT_PERCENTAGE,
                  ),
                ),
                examplePrice: formatDollars(
                  REFERRAL_CONFIG.EXAMPLE_PRICE_CENTS,
                ),
              })}
            </Div>

            {/* Inactive Warning */}
            {!code.isActive && (
              <Div className="px-4 py-3 border-t bg-red-50 dark:bg-red-950/20">
                <Div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <Span>{t("codes.list.widget.inactive")}</Span>
                </Div>
              </Div>
            )}
          </CardContent>
        </Card>
      ))}
    </Div>
  );
}
