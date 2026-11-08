"use client";

import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { History } from "next-vibe/ui/components/icons/History";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import {
  Callout,
  CardLink,
  Cta,
  CtaBand,
  PageHero,
  PageSection,
  StatGrid,
} from "../../story/_shared/marketing";
import {
  buildFactRows,
  chatHref,
  compareHref,
  modelDescription,
  modelHref,
  priceFootnote,
} from "../_shared/model-format";
import { ModelIcon, SampleAnswersSlot, TierBadge } from "../_shared/model-ui";
import { ModelPicker } from "../_shared/model-picker";
import { scopedTranslation } from "../i18n";
import { MediaModelPageClient } from "./media-page-client";
import type { ChatModelPageData, ModelPageData } from "./page";

export function ModelPageClient(data: ModelPageData): JSX.Element {
  if (data.kind === "media") {
    return <MediaModelPageClient locale={data.locale} facts={data.facts} />;
  }
  return <ChatModelPage {...data} />;
}

function ChatModelPage({
  locale,
  facts,
  comparisons,
  pickerModels,
  refusal,
}: ChatModelPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const rows = buildFactRows(facts, locale);
  const statKeys = new Set(["price", "context", "inputs", "intelligence"]);

  return (
    <Div>
      <PageHero
        back={{ href: `/${locale}/models`, label: t("model.back") }}
        eyebrow={facts.labName}
        title={<Span className="[overflow-wrap:anywhere]">{facts.name}</Span>}
        subtitle={modelDescription(facts, locale)}
        actions={
          <>
            <Cta
              href={chatHref(locale, facts)}
              label={t("model.chatCta", { model: facts.name })}
            />
            <ModelPicker
              locale={locale}
              models={pickerModels}
              hrefFor={(slug) => compareHref(locale, facts.slug, slug)}
              label={t("model.compareCta")}
              icon={Scale}
              testId="model-compare-picker"
            />
          </>
        }
      >
        <Div className="mt-6 flex flex-wrap items-center gap-3">
          <ModelIcon facts={facts} size="sm" />
          <TierBadge content={facts.content} locale={locale} />
          <Span className="text-sm text-muted-foreground">
            {rows.find((row) => row.key === "tier")?.hint}
          </Span>
        </Div>
        <StatGrid
          items={rows
            .filter((row) => statKeys.has(row.key))
            .map((row) => ({ value: row.value, label: row.label }))}
        />
      </PageHero>

      {facts.isLegacy && facts.successor !== null && (
        <Div className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
          <Callout icon={History} tone="warning">
            <P className="m-0">
              {t("model.legacyBanner", {
                model: facts.name,
                successor: facts.successor.name,
              })}
            </P>
            <CardLink
              href={modelHref(locale, facts.successor.slug)}
              label={t("model.legacyCta", { successor: facts.successor.name })}
            />
          </Callout>
        </Div>
      )}

      <PageSection title={t("facts.heading")} narrow>
        <Div
          className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card"
          data-testid="model-facts"
        >
          {rows.map((row) => (
            <Div
              key={row.key}
              data-fact={row.key}
              className="grid grid-cols-1 gap-1 px-4 py-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6 md:px-6"
            >
              <Span className="text-sm font-medium text-muted-foreground">
                {row.label}
              </Span>
              <Div className="min-w-0">
                <Span className="block font-semibold text-foreground [overflow-wrap:anywhere]">
                  {row.value}
                </Span>
                {row.hint !== null && (
                  <Span className="mt-0.5 block text-sm text-muted-foreground">
                    {row.hint}
                  </Span>
                )}
              </Div>
            </Div>
          ))}
        </Div>
        <P className="mt-4 text-xs text-muted-foreground">
          {priceFootnote(locale, t)}
        </P>
      </PageSection>

      <SampleAnswersSlot modelId={facts.id} locale={locale} stats={refusal} />

      {comparisons.length > 0 && (
        <PageSection
          tone="muted"
          title={t("model.compareHeading", { model: facts.name })}
          intro={t("model.compareIntro")}
        >
          <Div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {comparisons.map((other) => (
              <Link
                key={other.id}
                href={compareHref(locale, facts.slug, other.slug)}
                className="group flex min-h-11 items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 font-medium shadow-xs transition-colors hover:border-primary/40"
              >
                <Span className="min-w-0 [overflow-wrap:anywhere]">
                  {t("model.compareWith", {
                    model: facts.name,
                    other: other.name,
                  })}
                </Span>
                <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </Div>
        </PageSection>
      )}

      <CtaBand
        title={t("model.ctaTitle", { model: facts.name })}
        subtitle={t("model.ctaSubtitle", { model: facts.name })}
        actions={
          <Cta
            href={chatHref(locale, facts)}
            label={t("model.chatCta", { model: facts.name })}
          />
        }
      />
    </Div>
  );
}
