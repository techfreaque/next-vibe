"use client";

import { Div } from "next-vibe/ui/components/div";
import { History } from "next-vibe/ui/components/icons/History";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX, ReactNode } from "react";

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
  modelHref,
  priceFootnote,
} from "../_shared/model-format";
import { ModelPicker } from "../_shared/model-picker";
import { ModelIcon, SampleAnswersSlot, TierBadge } from "../_shared/model-ui";
import { scopedTranslation } from "../i18n";
import { MediaModelPageClient } from "./media-page-client";
import type { ChatModelPageData, MediaModelPageData } from "./page";

type ChatModelClientData = Omit<ChatModelPageData, "seo" | "structuredData">;
type MediaModelClientData = Omit<MediaModelPageData, "seo" | "structuredData">;

/**
 * `sections`: the server-rendered best for / price per plan / nearest models /
 * similar models / FAQ / blog sections (model-seo-sections), placed above the
 * closing CTA.
 */
export function ModelPageClient({
  sections,
  ...data
}: (ChatModelClientData | MediaModelClientData) & {
  sections: ReactNode;
}): JSX.Element {
  if (data.kind === "media") {
    return (
      <MediaModelPageClient
        locale={data.locale}
        facts={data.facts}
        description={data.description}
        sections={sections}
      />
    );
  }
  return <ChatModelPage {...data} sections={sections} />;
}

function ChatModelPage({
  locale,
  facts,
  pickerModels,
  description,
  refusal,
  sections,
}: ChatModelClientData & { sections: ReactNode }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const rows = buildFactRows(facts, locale).filter((row) => !row.missing);
  const statKeys = new Set(["price", "context", "inputs", "intelligence"]);
  const chatModel = facts.isLegacy ? facts.successor : facts;
  const tryInChat =
    chatModel === null ? null : (
      <Cta
        href={chatHref(locale, chatModel)}
        label={t("model.chatCta", { model: chatModel.name })}
      />
    );

  return (
    <Div>
      <PageHero
        back={{ href: `/${locale}/models`, label: t("model.back") }}
        eyebrow={facts.labName}
        title={<Span className="[overflow-wrap:anywhere]">{facts.name}</Span>}
        subtitle={description}
        actions={
          <>
            {tryInChat}
            <ModelPicker
              locale={locale}
              models={pickerModels}
              hrefFor={(model) => compareHref(locale, facts.id, model.id)}
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

      {sections}

      {chatModel !== null && (
        <CtaBand
          title={t("model.ctaTitle", { model: chatModel.name })}
          subtitle={t("model.ctaSubtitle", { model: chatModel.name })}
          actions={tryInChat}
        />
      )}
    </Div>
  );
}
