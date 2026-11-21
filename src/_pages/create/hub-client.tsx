"use client";

import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H2, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import {
  formatCreditAmount,
  formatCreditsAsMoney,
} from "@/products/credit-money";

import { createHref } from "./_shared/create-kinds";
import { HUB_HISTORY_PAGE_SIZE } from "./_shared/studio-constants";
import { StudioHistory } from "./_shared/studio-history";
import {
  STUDIO_ICONS,
  STUDIO_PALETTES,
  StudioShell,
} from "./_shared/studio-shell";
import { scopedTranslation } from "./i18n";
import type { StudioHubData } from "./page";

function StudioCard({
  summary,
  locale,
  wide,
}: {
  summary: StudioHubData["summaries"][number];
  locale: StudioHubData["locale"];
  wide: boolean;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { kind, cheapest, count } = summary;
  const Icon = STUDIO_ICONS[kind];
  const money = cheapest ? formatCreditsAsMoney(cheapest.rate, locale) : null;
  return (
    <Link
      href={createHref(locale, kind)}
      className={`group flex min-w-0 flex-col rounded-2xl border bg-card shadow-sm transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${wide ? "sm:col-span-3" : "sm:col-span-2"}`}
    >
      <Div className="flex flex-1 flex-row items-center gap-3 p-4 sm:flex-col sm:items-stretch sm:p-6">
        <Div className="flex shrink-0 items-center justify-between">
          <Span
            className={`inline-flex size-10 items-center justify-center rounded-xl sm:size-11 ${STUDIO_PALETTES[kind]}`}
          >
            <Icon className="size-5" />
          </Span>
          <Span className="hidden text-xs font-medium text-muted-foreground sm:inline">
            {t(kind === "speech" ? "hub.voices" : "hub.models", { count })}
          </Span>
        </Div>
        <Div className="flex min-w-0 flex-col gap-1">
          <Div className="flex items-baseline justify-between gap-2">
            <H2 className="m-0 border-0 pb-0 text-lg font-semibold tracking-tight">
              {t(`kinds.${kind}.title`)}
            </H2>
            <Span className="shrink-0 text-xs font-medium text-muted-foreground sm:hidden">
              {t(kind === "speech" ? "hub.voices" : "hub.models", { count })}
            </Span>
          </Div>
          <P className="m-0 text-sm leading-relaxed text-muted-foreground">
            {t(`kinds.${kind}.pitch`)}
          </P>
        </Div>
      </Div>
      <Div className="flex items-center justify-between gap-3 border-t px-4 py-2.5 sm:px-6 sm:py-3">
        <Div className="flex min-w-0 flex-col">
          {cheapest ? (
            <>
              <Span className="text-sm font-semibold tabular-nums">
                {cheapest.rate > 0
                  ? t("hub.from", {
                      price: t(
                        `units.${cheapest.isTokenPriced ? "tokenImage" : kind}`,
                        { amount: formatCreditAmount(cheapest.rate, locale) },
                      ),
                    })
                  : t("hub.free")}
              </Span>
              {money && (
                <Span className="text-xs tabular-nums text-muted-foreground">
                  {money}
                </Span>
              )}
            </>
          ) : (
            <Span className="text-sm text-muted-foreground">
              {t("unavailable")}
            </Span>
          )}
        </Div>
        <Span
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background"
          aria-label={t("hub.open")}
        >
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Span>
      </Div>
    </Link>
  );
}

export function StudioHub(data: StudioHubData): JSX.Element {
  const { locale } = data;
  return (
    <StudioShell locale={locale}>
      <Div className="grid gap-8 sm:gap-10">
        <Div className="grid gap-3 sm:grid-cols-6 sm:gap-4">
          {data.summaries.map((summary, index) => (
            <StudioCard
              key={summary.kind}
              summary={summary}
              locale={locale}
              wide={index < 2}
            />
          ))}
        </Div>
        <Div className="rounded-2xl border bg-card p-4 sm:p-6">
          <StudioHistory
            locale={locale}
            user={data.user}
            platform={data.platform}
            initialData={data.history}
            pageSize={HUB_HISTORY_PAGE_SIZE}
          />
        </Div>
      </Div>
    </StudioShell>
  );
}
