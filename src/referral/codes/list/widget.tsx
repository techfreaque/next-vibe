/**
 * Custom Widget for Referral Codes List
 */

"use client";

import { coreClientEnv as envClient } from "next-vibe/core/env-client";
import {
  CountriesArr,
  type CountryLanguage,
  LanguagesArr,
} from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { Link2 } from "next-vibe/ui/components/icons/Link2";
import { Input } from "next-vibe/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { usePathname } from "next-vibe/ui/hooks/use-pathname";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { getCurrentOrigin } from "next-vibe/ui/lib/location";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetSelector,
  useWidgetTranslation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useCallback, useState } from "react";

import { REFERRAL_CONFIG } from "../../config";
import type definition from "./definition";
import type { ReferralCode } from "./definition";

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
  const [manualLink, setManualLink] = useState<string | null>(null);

  const generatedPath = extractPath(urlInput);
  const hasInput = generatedPath.length > 0;

  const handleCopyGenerated = useCallback(async () => {
    if (!hasInput) {
      return;
    }
    const trackUrl = `${getCurrentOrigin()}/track?ref=${code}&url=${encodeURIComponent(generatedPath)}`;
    const copied = await copyToClipboard(trackUrl, logger);
    setManualLink(copied ? null : trackUrl);
    setCopiedLinkGen(copied);
    if (copied) {
      setTimeout(() => {
        setCopiedLinkGen(false);
      }, 2000);
    }
  }, [code, generatedPath, hasInput, logger]);

  return (
    <Div className="flex min-w-0 flex-1 flex-col gap-2">
      <Div className="flex items-center gap-2">
        <Input
          type="text"
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value);
            setManualLink(null);
          }}
          placeholder={t("codes.list.widget.linkGenPlaceholder")}
          className="h-11 font-mono text-xs sm:h-10"
        />
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
      {manualLink && (
        <Input
          readOnly
          value={manualLink}
          aria-label={t("codes.list.widget.linkGenCopy")}
          className="h-10 font-mono text-xs"
        />
      )}
    </Div>
  );
}

/** The admin tool page gets a page header; the account referral page has its own. */
function useIsToolsPage(): boolean {
  const [, firstSegment, secondSegment] = usePathname().split("/");
  return firstSegment === "tools" || secondSegment === "tools";
}

const STAT_GRID =
  "grid grid-cols-2 gap-x-4 gap-y-2 @2xl:grid-cols-[minmax(0,2.4fr)_repeat(4,minmax(0,1fr))_10rem] @2xl:items-center @2xl:gap-y-0";

function money(cents: number, locale: CountryLanguage): string {
  return formatMoney(cents / 100, "USD", locale);
}

/**
 * Custom container widget for referral codes list
 */
export function ReferralCodesListContainer(): React.JSX.Element {
  // undefined = not loaded yet. Showing "no codes yet" while loading told a
  // partner whose code was just moved to them that it was missing.
  const codes = useWidgetSelector<typeof definition.GET>()(
    (data) => data?.codes,
  );
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const isToolsPage = useIsToolsPage();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [manualCopy, setManualCopy] = useState<{
    code: string;
    url: string;
  } | null>(null);
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const logger = useWidgetLogger();

  const handleCopy = async (code: string): Promise<void> => {
    const url = `${getCurrentOrigin()}/track?ref=${code}`;
    const copied = await copyToClipboard(url, logger);
    setManualCopy(copied ? null : { code, url });
    setCopiedCode(copied ? code : null);
    if (copied) {
      setTimeout(() => {
        setCopiedCode((current) => (current === code ? null : current));
      }, 2000);
    }
  };

  const header = isToolsPage ? (
    <WidgetHeader
      size="page"
      title={t("codes.list.get.form.title")}
      subtitle={t("codes.list.get.form.description")}
    />
  ) : null;
  const shell = (children: React.ReactNode): React.JSX.Element =>
    isToolsPage ? (
      <WidgetShell layout="page">
        {header}
        {children}
      </WidgetShell>
    ) : (
      <Div className="@container flex min-w-0 flex-col gap-4">{children}</Div>
    );

  if (!codes) {
    return shell(
      <Div
        className="flex flex-col divide-y rounded-lg border bg-card"
        aria-label={t("codes.list.widget.loading")}
        aria-busy="true"
      >
        {[0, 1].map((row) => (
          <Div key={row} className="flex items-center gap-4 px-4 py-4">
            <Div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </Div>
            <Skeleton className="h-9 w-28" />
          </Div>
        ))}
      </Div>,
    );
  }

  if (codes.length === 0) {
    return shell(
      <EmptyBlock
        icon={<Link2 className="h-6 w-6" />}
        title={t("codes.list.widget.empty")}
        message={t("codes.list.widget.emptyHint")}
      />,
    );
  }

  const activeCodes = codes.filter((code) => code.isActive);
  const selectable = activeCodes.length > 0 ? activeCodes : codes;
  const selectedCode =
    selectable.find((code) => code.code === linkCode)?.code ??
    selectable[0]?.code ??
    "";

  const statCell = (
    label: string,
    value: string,
    tone?: "positive",
  ): React.JSX.Element => (
    <Div className="flex min-w-0 flex-col gap-0.5 @2xl:items-end">
      <Span className="text-xs text-muted-foreground @2xl:hidden">{label}</Span>
      <Span
        className={cn(
          "whitespace-nowrap text-sm tabular-nums",
          tone === "positive" ? "font-semibold text-success" : undefined,
          value === "0" || value === money(0, locale)
            ? "text-muted-foreground"
            : undefined,
        )}
      >
        {value}
      </Span>
    </Div>
  );

  const row = (code: ReferralCode): React.JSX.Element => {
    const referralUrl = `${envClient.NEXT_PUBLIC_APP_URL}/track?ref=${code.code}`;
    const copied = copiedCode === code.code;
    return (
      <Div
        key={code.code}
        className={cn(STAT_GRID, "px-4 py-3", !code.isActive && "opacity-70")}
      >
        <Div className="col-span-2 flex min-w-0 items-start justify-between gap-3 @2xl:col-span-1">
          <Div className="min-w-0">
            <Div
              className="truncate font-mono text-sm font-semibold"
              title={referralUrl}
            >
              {code.code}
            </Div>
            {code.label && (
              <Div className="truncate text-[13px] text-muted-foreground">
                {code.label}
              </Div>
            )}
            {!code.isActive && (
              <Div className="mt-0.5 flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {t("codes.list.widget.inactive")}
              </Div>
            )}
          </Div>
        </Div>
        {statCell(
          t("codes.list.widget.visitors"),
          code.currentVisitors.toLocaleString(locale),
        )}
        {statCell(
          t("codes.list.widget.signups"),
          code.totalSignups.toLocaleString(locale),
        )}
        {statCell(
          t("codes.list.widget.revenue"),
          money(code.totalRevenueCents, locale),
        )}
        {statCell(
          t("codes.list.widget.earnings"),
          money(code.totalEarningsCents, locale),
          code.totalEarningsCents > 0 ? "positive" : undefined,
        )}
        <Div className="col-span-2 flex justify-end @2xl:col-span-1">
          <Button
            type="button"
            variant={codes.length === 1 ? "default" : "outline"}
            size="sm"
            className="h-10 w-full gap-1.5 @2xl:h-9"
            onClick={() => handleCopy(code.code)}
          >
            {copied ? (
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
        {manualCopy?.code === code.code && (
          <Div className="col-span-full min-w-0">
            <Input
              readOnly
              value={manualCopy.url}
              aria-label={t("codes.list.widget.copy")}
              className="h-10 font-mono text-xs"
            />
          </Div>
        )}
      </Div>
    );
  };

  return shell(
    <>
      <Div className="@container flex min-w-0 flex-col divide-y rounded-lg border bg-card">
        <Div
          className={cn(
            STAT_GRID,
            "hidden bg-muted/30 px-4 py-2 text-xs font-medium text-muted-foreground @2xl:grid",
          )}
          aria-hidden="true"
        >
          <Span>{t("codes.list.get.response.codes.code")}</Span>
          <Span className="text-right">{t("codes.list.widget.visitors")}</Span>
          <Span className="text-right">{t("codes.list.widget.signups")}</Span>
          <Span className="text-right">{t("codes.list.widget.revenue")}</Span>
          <Span className="text-right">{t("codes.list.widget.earnings")}</Span>
          <Span />
        </Div>
        {codes.map(row)}
      </Div>

      {/* Deep-link generator: one for all codes, code picked when there are several */}
      <Div className="flex min-w-0 flex-col gap-3 rounded-lg border bg-card p-4">
        <Div className="flex flex-col gap-0.5">
          <Span className="text-sm font-semibold text-foreground">
            {t("codes.list.widget.linkGen")}
          </Span>
          <Span className="text-[13px] text-muted-foreground">
            {t("codes.list.widget.linkGenHint")}
          </Span>
        </Div>
        <Div className="flex min-w-0 flex-col gap-2 @lg:flex-row @lg:items-center">
          {selectable.length > 1 && (
            <Select value={selectedCode} onValueChange={setLinkCode}>
              <SelectTrigger
                className="h-10 w-full font-mono text-xs @lg:w-48"
                aria-label={t("codes.list.get.response.codes.code")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectable.map((code) => (
                  <SelectItem key={code.code} value={code.code}>
                    {code.label ?? code.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Div className="min-w-0 flex-1">
            <LinkGenerator code={selectedCode} t={t} />
          </Div>
        </Div>
        <Span className="text-xs text-muted-foreground">
          {t("codes.list.widget.conversionHint", {
            exampleEarning: money(
              Math.round(
                REFERRAL_CONFIG.EXAMPLE_PRICE_CENTS *
                  REFERRAL_CONFIG.DIRECT_PERCENTAGE,
              ),
              locale,
            ),
            examplePrice: money(REFERRAL_CONFIG.EXAMPLE_PRICE_CENTS, locale),
          })}
        </Span>
      </Div>
    </>,
  );
}
