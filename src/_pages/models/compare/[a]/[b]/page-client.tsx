"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { Repeat } from "next-vibe/ui/components/icons/Repeat";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import {
  CardLink,
  CONTAINER,
  Cta,
  PageHero,
} from "../../../../story/_shared/marketing";
import type { ModelFacts, PickerModel } from "../../../_shared/model-facts";
import {
  buildFactRows,
  chatHref,
  compareHref,
  formatNumber,
  modelHref,
  priceFootnote,
} from "../../../_shared/model-format";
import { ModelPicker } from "../../../_shared/model-picker";
import { ModelIcon, TierBadge } from "../../../_shared/model-ui";
import { scopedTranslation } from "../../../i18n";
import type { ComparePageData } from "./page";

/** Ratios under this read as "about the same". */
const SAME_RATIO = 1.1;

type ModelsT = ReturnType<typeof scopedTranslation.scopedT>["t"];

function ratio(a: number, b: number): number {
  const low = Math.min(a, b);
  const high = Math.max(a, b);
  return low <= 0 ? Number.POSITIVE_INFINITY : high / low;
}

function verdicts(
  left: ModelFacts,
  right: ModelFacts,
  locale: CountryLanguage,
  t: ModelsT,
): string[] {
  const lines: string[] = [];

  const priceRatio = ratio(left.creditsPerMessage, right.creditsPerMessage);
  if (priceRatio < SAME_RATIO || !Number.isFinite(priceRatio)) {
    lines.push(t("compare.samePrice"));
  } else {
    const cheaper =
      left.creditsPerMessage < right.creditsPerMessage ? left : right;
    lines.push(
      t("compare.cheaper", {
        model: cheaper.name,
        times: formatNumber(Math.round(priceRatio * 10) / 10, locale),
      }),
    );
  }

  const contextRatio = ratio(left.contextWindow, right.contextWindow);
  if (contextRatio < SAME_RATIO) {
    lines.push(t("compare.sameContext"));
  } else {
    const bigger = left.contextWindow > right.contextWindow ? left : right;
    lines.push(
      t("compare.biggerContext", {
        model: bigger.name,
        times: formatNumber(Math.round(contextRatio * 10) / 10, locale),
      }),
    );
  }
  return lines;
}

function ModelHeader({
  facts,
  locale,
  t,
  pickerModels,
  hrefFor,
}: {
  facts: ModelFacts;
  pickerModels: PickerModel[];
  hrefFor: (slug: string) => string;
  locale: CountryLanguage;
  t: ModelsT;
}): JSX.Element {
  return (
    <Div className="flex min-w-0 flex-col gap-3">
      <Div className="flex min-w-0 items-center gap-3">
        <ModelIcon facts={facts} size="sm" />
        <Div className="min-w-0">
          <Link
            href={modelHref(locale, facts.slug)}
            className="block font-semibold text-foreground [overflow-wrap:anywhere] hover:text-primary"
          >
            {facts.name}
          </Link>
          <Span className="block text-xs text-muted-foreground">
            {facts.labName}
          </Span>
        </Div>
      </Div>
      <TierBadge
        content={facts.content}
        locale={locale}
        className="self-start"
      />
      <CardLink
        href={chatHref(locale, facts)}
        label={t("compare.chatWith", { model: facts.name })}
      />
      <ModelPicker
        locale={locale}
        models={pickerModels}
        hrefFor={hrefFor}
        label={t("picker.change")}
        icon={Repeat}
        className="h-11 px-3 text-sm sm:px-4"
      />
    </Div>
  );
}

export function ComparePageClient({
  locale,
  left,
  right,
  leftPicker,
  rightPicker,
}: ComparePageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const leftRows = buildFactRows(left, locale);
  const rightRows = buildFactRows(right, locale);
  const isSameModel = left.id === right.id;

  return (
    <Div>
      <PageHero
        back={{ href: `/${locale}/models`, label: t("compare.back") }}
        eyebrow={t("compare.eyebrow")}
        title={t("compare.title", { a: left.name, b: right.name })}
        subtitle={t("compare.subtitle")}
        actions={
          <Cta
            href={compareHref(locale, right.slug, left.slug)}
            label={t("compare.swap")}
            icon={Repeat}
            variant="secondary"
            arrow={false}
          />
        }
      >
        <Div className="mt-8 flex flex-col gap-2">
          {isSameModel ? (
            <P className="m-0 font-medium">{t("compare.sameModel")}</P>
          ) : (
            verdicts(left, right, locale, t).map((line) => (
              <P key={line} className="m-0 text-base font-medium md:text-lg">
                {line}
              </P>
            ))
          )}
        </Div>
      </PageHero>

      <Div className={`${CONTAINER} py-12 md:py-16`}>
        <Div
          className="overflow-hidden rounded-xl border border-border bg-card"
          data-testid="compare-table"
        >
          <Div className="grid grid-cols-2 gap-4 border-b border-border bg-muted/40 p-4 sm:grid-cols-[12rem_minmax(0,1fr)_minmax(0,1fr)] md:p-6">
            <Span className="hidden text-sm font-medium text-muted-foreground sm:block">
              {t("compare.fact")}
            </Span>
            <ModelHeader
              facts={left}
              locale={locale}
              t={t}
              pickerModels={leftPicker}
              hrefFor={(slug) => compareHref(locale, slug, right.slug)}
            />
            <ModelHeader
              facts={right}
              locale={locale}
              t={t}
              pickerModels={rightPicker}
              hrefFor={(slug) => compareHref(locale, left.slug, slug)}
            />
          </Div>
          <Div className="divide-y divide-border">
            {leftRows.map((row, index) => {
              const other = rightRows[index];
              return (
                <Div
                  key={row.key}
                  data-fact={row.key}
                  className="grid grid-cols-2 gap-x-4 gap-y-1 px-4 py-4 sm:grid-cols-[12rem_minmax(0,1fr)_minmax(0,1fr)] md:px-6"
                >
                  <Span className="col-span-2 text-sm font-medium text-muted-foreground sm:col-span-1">
                    {row.label}
                  </Span>
                  {[row, other].map((cell, side) =>
                    cell === undefined ? null : (
                      <Div key={side} className="min-w-0">
                        <Span className="block font-semibold text-foreground [overflow-wrap:anywhere]">
                          {cell.value}
                        </Span>
                        {cell.hint !== null && cell.key !== "tier" && (
                          <Span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">
                            {cell.hint}
                          </Span>
                        )}
                      </Div>
                    ),
                  )}
                </Div>
              );
            })}
          </Div>
        </Div>
        <P className="mt-4 text-xs text-muted-foreground">
          {priceFootnote(locale, t)}
        </P>
        <Div className="mt-8 flex flex-col gap-2 sm:flex-row sm:gap-6">
          <CardLink
            href={modelHref(locale, left.slug)}
            label={t("compare.modelPage", { model: left.name })}
          />
          <CardLink
            href={modelHref(locale, right.slug)}
            label={t("compare.modelPage", { model: right.name })}
          />
        </Div>
      </Div>
    </Div>
  );
}
