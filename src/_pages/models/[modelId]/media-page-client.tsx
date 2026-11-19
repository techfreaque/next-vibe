"use client";

import { scopedTranslation as agentScopedTranslation } from "next-vibe/agent/i18n";
import { scopedTranslation as skillsScopedTranslation } from "next-vibe/agent/skills/i18n";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX, ReactNode } from "react";

import {
  Cta,
  CtaBand,
  PageHero,
  PageSection,
} from "../../story/_shared/marketing";
import {
  formatMoney,
  formatNumber,
  mediaUnitText,
  modalityList,
  tierLine,
  tierName,
} from "../_shared/model-format";
import {
  createPageHref,
  type MediaModelFacts,
} from "../_shared/model-media-facts";
import { ModelIcon, TierBadge } from "../_shared/model-ui";
import { scopedTranslation } from "../i18n";

interface MediaFactRow {
  key: string;
  label: string;
  value: string;
  hint: string | null;
}

export function MediaModelPageClient({
  locale,
  facts,
  sections,
}: {
  locale: CountryLanguage;
  facts: MediaModelFacts;
  /** Server-rendered similar models / FAQ / blog sections, above the CTA. */
  sections: ReactNode;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: agentT } = agentScopedTranslation.scopedT(locale);
  const { t: skillsT } = skillsScopedTranslation.scopedT(locale);
  const typeLabel = t(`catalog.types.${facts.type}`);
  const ctaLabel =
    facts.type === "tts" || facts.type === "stt"
      ? t("media.useCta", { model: facts.name })
      : t("media.generateCta", { model: facts.name });
  const href = createPageHref(locale, facts);

  const rows: MediaFactRow[] = [
    { key: "type", label: t("facts.type"), value: typeLabel, hint: null },
    { key: "lab", label: t("facts.lab"), value: facts.labName, hint: null },
    {
      key: "tier",
      label: t("facts.tier"),
      value: tierName(facts.content, locale),
      hint: tierLine(facts.content, locale),
    },
    {
      key: "intelligence",
      label: t("facts.intelligence"),
      value: skillsT(facts.intelligence),
      hint: null,
    },
    {
      key: "price",
      label: t("media.priceLabel"),
      value:
        facts.price === null
          ? t("facts.notListed")
          : t("media.priceValue", {
              credits: formatNumber(facts.price.credits, locale),
              unit: mediaUnitText(facts.price, t),
            }),
      hint:
        facts.price === null
          ? null
          : t("media.priceProvider", {
              price: formatMoney(facts.price.credits, locale),
              provider: facts.price.provider,
            }),
    },
    {
      key: "inputs",
      label: t("facts.inputs"),
      value: modalityList(facts.inputs, t),
      hint: null,
    },
    {
      key: "outputs",
      label: t("facts.outputs"),
      value: modalityList(facts.outputs, t),
      hint: null,
    },
    {
      key: "providers",
      label: t("facts.providers"),
      value: facts.providers.join(", "),
      hint: null,
    },
    {
      key: "status",
      label: t("facts.status"),
      value: facts.isLegacy
        ? t("facts.statusLegacy")
        : t("facts.statusCurrent"),
      hint: null,
    },
  ];

  return (
    <Div>
      <PageHero
        back={{ href: `/${locale}/models`, label: t("model.back") }}
        eyebrow={`${facts.labName} · ${typeLabel}`}
        title={<Span className="[overflow-wrap:anywhere]">{facts.name}</Span>}
        subtitle={agentT(facts.description)}
        actions={<Cta href={href} label={ctaLabel} />}
      >
        <Div className="mt-6 flex flex-wrap items-center gap-3">
          <ModelIcon facts={facts} size="sm" />
          <TierBadge content={facts.content} locale={locale} />
        </Div>
      </PageHero>

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
          {t("media.priceFootnote", { value: formatMoney(1, locale) })}
        </P>
      </PageSection>

      {sections}

      <CtaBand
        title={t("media.ctaTitle", { model: facts.name })}
        subtitle={t("media.ctaSubtitle", { model: facts.name })}
        actions={<Cta href={href} label={ctaLabel} />}
      />
    </Div>
  );
}
