"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Repeat } from "next-vibe/ui/components/icons/Repeat";
import { Li } from "next-vibe/ui/components/li";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import { Ul } from "next-vibe/ui/components/ul";
import type { JSX, ReactNode } from "react";
import { useState } from "react";

import {
  CardLink,
  CONTAINER,
  Cta,
  PageHero,
  PageSection,
} from "../../../../story/_shared/marketing";
import type { CompareLink } from "../../../_shared/model-compare";
import type { ModelFacts, PickerModel } from "../../../_shared/model-facts";
import {
  buildFactRows,
  chatHref,
  compareHref,
  modelHref,
  priceFootnote,
} from "../../../_shared/model-format";
import { ModelPicker } from "../../../_shared/model-picker";
import { ModelIcon, TierBadge } from "../../../_shared/model-ui";
import { scopedTranslation } from "../../../i18n";
import type { ComparePageData } from "./page";

type ModelsT = ReturnType<typeof scopedTranslation.scopedT>["t"];

function ModelHeader({
  facts,
  locale,
  t,
  pickerModels,
  hrefFor,
}: {
  facts: ModelFacts;
  pickerModels: PickerModel[];
  hrefFor: (model: PickerModel) => string;
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

/** Try-in-chat button: legacy models open their successor, none without one. */
function TryCta({
  facts,
  locale,
  t,
}: {
  facts: ModelFacts;
  locale: CountryLanguage;
  t: ModelsT;
}): JSX.Element | null {
  const chatModel = facts.isLegacy ? facts.successor : facts;
  if (chatModel === null) {
    return null;
  }
  return (
    <Cta
      href={chatHref(locale, chatModel)}
      label={t("model.chatCta", { model: chatModel.name })}
    />
  );
}

function EdgeCard({
  facts,
  other,
  reasons,
  locale,
  t,
}: {
  facts: ModelFacts;
  other: ModelFacts;
  reasons: string[];
  locale: CountryLanguage;
  t: ModelsT;
}): JSX.Element {
  return (
    <Div
      data-testid="compare-edge"
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 shadow-xs md:p-6"
    >
      <Div className="flex min-w-0 items-center gap-3">
        <ModelIcon facts={facts} size="sm" />
        <H3 className="m-0 text-lg font-semibold text-foreground [overflow-wrap:anywhere]">
          {t("compare.edge", { model: facts.name })}
        </H3>
      </Div>
      {reasons.length > 0 ? (
        <Ul className="m-0 flex list-none flex-col gap-3 p-0">
          {reasons.map((reason) => (
            <Li key={reason} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <Span className="leading-relaxed">{reason}</Span>
            </Li>
          ))}
        </Ul>
      ) : (
        <P className="m-0 text-sm leading-relaxed text-muted-foreground">
          {t("compare.noEdge", { other: other.name })}
        </P>
      )}
      <Div className="mt-auto">
        <TryCta facts={facts} locale={locale} t={t} />
      </Div>
    </Div>
  );
}

function MoreList({
  title,
  links,
  locale,
  t,
}: {
  title: string;
  links: CompareLink[];
  locale: CountryLanguage;
  t: ModelsT;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-3">
      <H3 className="m-0 text-base font-semibold">{title}</H3>
      <Ul className="m-0 flex list-none flex-col gap-3 p-0" aria-label={title}>
        {links.map((link) => (
          <Li key={link.path} className="flex">
            <Link
              href={`/${locale}${link.path}`}
              className="group flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 font-medium shadow-xs transition-colors hover:border-primary/40"
            >
              <Span className="min-w-0 [overflow-wrap:anywhere]">
                {t("compare.title", { a: link.a, b: link.b })}
              </Span>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Li>
        ))}
      </Ul>
    </Div>
  );
}

/**
 * `sections`: the server-rendered FAQ (+ FAQPage JSON-LD) and read-more
 * cards (model-seo-sections), placed after the comparison links.
 */
export function ComparePageClient({
  locale,
  left: first,
  right: second,
  leftPicker: firstPicker,
  rightPicker: secondPicker,
  verdict,
  moreLeft: firstMore,
  moreRight: secondMore,
  sections,
}: ComparePageData & { sections: ReactNode }): JSX.Element {
  const [swapped, setSwapped] = useState(false);
  const [left, right] = swapped ? [second, first] : [first, second];
  const [leftPicker, rightPicker] = swapped
    ? [secondPicker, firstPicker]
    : [firstPicker, secondPicker];
  const [moreLeft, moreRight] = swapped
    ? [secondMore, firstMore]
    : [firstMore, secondMore];
  const { t } = scopedTranslation.scopedT(locale);
  const leftRows = buildFactRows(left, locale);
  const rightRows = buildFactRows(right, locale);

  return (
    <Div>
      <PageHero
        back={{ href: `/${locale}/models`, label: t("compare.back") }}
        eyebrow={t("compare.eyebrow")}
        title={t("compare.title", { a: left.name, b: right.name })}
        subtitle={t("compare.subtitle")}
        actions={
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="h-12 w-full gap-2 bg-card px-6 text-base font-medium sm:w-auto"
            onClick={() => setSwapped((value) => !value)}
          >
            <Repeat className="h-4 w-4" />
            {t("compare.swap")}
          </Button>
        }
      >
        <Div
          className="mt-8 flex flex-col gap-2"
          data-testid="compare-headline"
        >
          {verdict.headline.map((line) => (
            <P key={line} className="m-0 text-base font-medium md:text-lg">
              {line}
            </P>
          ))}
        </Div>
      </PageHero>

      <PageSection
        title={t("compare.verdictHeading")}
        intro={t("compare.verdictIntro")}
      >
        {verdict.similar ? (
          <Div
            data-testid="compare-similar"
            className="flex flex-col gap-6 rounded-xl border border-border bg-card p-5 shadow-xs md:p-6"
          >
            <P className="m-0 text-base leading-relaxed text-pretty">
              {t("compare.similar", { a: left.name, b: right.name })}
            </P>
            <Div className="flex flex-col gap-3 sm:flex-row">
              <TryCta facts={left} locale={locale} t={t} />
              <TryCta facts={right} locale={locale} t={t} />
            </Div>
          </Div>
        ) : (
          <Div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <EdgeCard
              facts={left}
              other={right}
              reasons={swapped ? verdict.right : verdict.left}
              locale={locale}
              t={t}
            />
            <EdgeCard
              facts={right}
              other={left}
              reasons={swapped ? verdict.left : verdict.right}
              locale={locale}
              t={t}
            />
          </Div>
        )}
      </PageSection>

      <Div className={`${CONTAINER} pb-16 md:pb-24`}>
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
              hrefFor={(model) => compareHref(locale, model.id, right.id)}
            />
            <ModelHeader
              facts={right}
              locale={locale}
              t={t}
              pickerModels={rightPicker}
              hrefFor={(model) => compareHref(locale, left.id, model.id)}
            />
          </Div>
          <Div className="divide-y divide-border">
            {leftRows.map((row, index) => {
              const other = rightRows[index];
              if (row.missing && (other === undefined || other.missing)) {
                return null;
              }
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

      {(moreLeft.length > 0 || moreRight.length > 0) && (
        <PageSection title={t("compare.moreHeading")} tone="muted">
          <Div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {moreLeft.length > 0 && (
              <MoreList
                title={t("compare.moreWith", { model: left.name })}
                links={moreLeft}
                locale={locale}
                t={t}
              />
            )}
            {moreRight.length > 0 && (
              <MoreList
                title={t("compare.moreWith", { model: right.name })}
                links={moreRight}
                locale={locale}
                t={t}
              />
            )}
          </Div>
        </PageSection>
      )}

      {sections}
    </Div>
  );
}
