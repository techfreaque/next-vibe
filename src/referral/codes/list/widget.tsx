/**
 * Custom Widget for Referral Codes List
 */

"use client";

import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import { CountriesArr, LanguagesArr } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { DollarSign } from "next-vibe/ui/components/icons/DollarSign";
import { Link2 } from "next-vibe/ui/components/icons/Link2";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Input } from "next-vibe/ui/components/input";
import { Span } from "next-vibe/ui/components/span";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { getCurrentOrigin } from "next-vibe/ui/lib/location";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetLogger,
  useWidgetSelector,
  useWidgetTranslation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useCallback, useState } from "react";

import { REFERRAL_CONFIG } from "../../config";
import type definition from "./definition";

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
  const logger = useWidgetLogger();
  const [copiedLinkGen, setCopiedLinkGen] = useState(false);

  const generatedPath = extractPath(urlInput);
  const hasInput = generatedPath.length > 0;

  const handleCopyGenerated = useCallback(async () => {
    if (!hasInput) {
      return;
    }
    const trackUrl = `${getCurrentOrigin()}/track?ref=${code}&url=${encodeURIComponent(generatedPath)}`;
    await copyToClipboard(trackUrl, logger);
    setCopiedLinkGen(true);
    setTimeout(() => {
      setCopiedLinkGen(false);
    }, 2000);
  }, [code, generatedPath, hasInput, logger]);

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
          className="h-11 font-mono text-xs sm:h-10"
        />
      </Div>
      <Button
        variant="outline"
        className="h-11 shrink-0 gap-1.5 sm:h-10"
        disabled={!hasInput}
        onClick={handleCopyGenerated}
      >
        {copiedLinkGen ? (
          <>
            <Check className="h-4 w-4 text-success" />
            {t("codes.list.widget.linkGenCopied")}
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            {t("codes.list.widget.linkGenCopy")}
          </>
        )}
      </Button>
    </Div>
  );
}

/**
 * Custom container widget for referral codes list
 */
export function ReferralCodesListContainer(): React.JSX.Element {
  const codes = useWidgetSelector<typeof definition.GET>()(
    (data) => data?.codes ?? [],
  );
  const t = useWidgetTranslation<typeof definition.GET>();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const logger = useWidgetLogger();

  const handleCopy = async (code: string, index: number): Promise<void> => {
    await copyToClipboard(`${getCurrentOrigin()}/track?ref=${code}`, logger);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  if (codes.length === 0) {
    return (
      <Div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-card px-6 py-12 text-center">
        <Div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
          <Link2 className="h-5 w-5 text-muted-foreground" />
        </Div>
        <Div className="flex flex-col gap-1">
          <Div className="text-sm font-semibold text-foreground">
            {t("codes.list.widget.empty")}
          </Div>
          <Div className="text-sm text-muted-foreground">
            {t("codes.list.widget.emptyHint")}
          </Div>
        </Div>
      </Div>
    );
  }

  const stats = (code: (typeof codes)[number]): StatItem[] => [
    {
      key: "visitors",
      icon: <Users className="h-3.5 w-3.5" />,
      label: t("codes.list.widget.visitors"),
      value: code.currentVisitors.toLocaleString(),
    },
    {
      key: "signups",
      icon: <TrendingUp className="h-3.5 w-3.5" />,
      label: t("codes.list.widget.signups"),
      value: code.totalSignups.toLocaleString(),
    },
    {
      key: "revenue",
      icon: <DollarSign className="h-3.5 w-3.5" />,
      label: t("codes.list.widget.revenue"),
      value: formatDollars(code.totalRevenueCents),
    },
    {
      key: "earnings",
      icon: <DollarSign className="h-3.5 w-3.5" />,
      label: t("codes.list.widget.earnings"),
      value: formatDollars(code.totalEarningsCents),
      highlight: true,
    },
  ];

  return (
    <Div className="flex flex-col gap-4">
      {codes.map((code, index) => {
        const referralUrl = `${envClient.NEXT_PUBLIC_APP_URL}/track?ref=${code.code}`;
        return (
          <Div
            key={code.code}
            className="overflow-hidden rounded-xl border bg-card shadow-sm"
          >
            {/* Code + share link */}
            <Div className="flex flex-col gap-3 p-4 sm:p-5">
              <Div className="flex items-start justify-between gap-3">
                <Div className="min-w-0">
                  <Div className="font-mono text-base font-semibold tracking-wide">
                    {code.code}
                  </Div>
                  {code.label && (
                    <Div className="mt-0.5 text-sm text-muted-foreground">
                      {code.label}
                    </Div>
                  )}
                </Div>
                {!code.isActive && (
                  <Span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {t("codes.list.widget.inactive")}
                  </Span>
                )}
              </Div>
              <Div className="flex flex-col gap-2 sm:flex-row">
                <Div className="flex h-11 min-w-0 flex-1 items-center rounded-md border bg-muted/50 px-3 sm:h-10">
                  <Span className="truncate font-mono text-xs text-muted-foreground">
                    {referralUrl}
                  </Span>
                </Div>
                <Button
                  className="h-11 shrink-0 gap-2 sm:h-10"
                  onClick={() => handleCopy(code.code, index)}
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-4 w-4" />
                      {t("codes.list.widget.copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      {t("codes.list.widget.copy")}
                    </>
                  )}
                </Button>
              </Div>
            </Div>

            {/* Stats */}
            <Div className="grid grid-cols-2 border-t md:grid-cols-4">
              {stats(code).map((stat, statIndex) => (
                <Div
                  key={stat.key}
                  className={cn(
                    "flex flex-col gap-1 p-4",
                    statIndex % 2 === 1 && "border-l",
                    statIndex >= 2 && "border-t md:border-t-0",
                    statIndex === 2 && "md:border-l",
                  )}
                >
                  <Div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    {stat.icon}
                    {stat.label}
                  </Div>
                  <Div
                    className={cn(
                      "text-lg font-semibold tabular-nums",
                      stat.highlight ? "text-primary" : "text-foreground",
                    )}
                  >
                    {stat.value}
                  </Div>
                </Div>
              ))}
            </Div>

            {/* Deep-link generator */}
            <Div className="flex flex-col gap-2 border-t bg-muted/30 px-4 py-4 sm:px-5">
              <Div className="flex flex-col gap-0.5">
                <Span className="text-sm font-medium text-foreground">
                  {t("codes.list.widget.linkGen")}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {t("codes.list.widget.linkGenHint")}
                </Span>
              </Div>
              <LinkGenerator code={code.code} t={t} />
              <Span className="pt-1 text-xs text-muted-foreground">
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
              </Span>
            </Div>
          </Div>
        );
      })}
    </Div>
  );
}

interface StatItem {
  key: string;
  icon: React.JSX.Element;
  label: string;
  value: string;
  highlight?: boolean;
}
