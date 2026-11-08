"use client";

/**
 * Home v2 sections - the home page sells the chat product end to end:
 * how it works → (capabilities) → pricing → more ways in → FAQ.
 * Every number comes from the product / model registries, never hard-coded.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Details } from "next-vibe/ui/components/details";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Check } from "next-vibe/ui/components/icons/Check";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { Code2 } from "next-vibe/ui/components/icons/Code2";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Server } from "next-vibe/ui/components/icons/Server";
import { Filter } from "next-vibe/ui/components/icons/Filter";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Link } from "next-vibe/ui/components/link";
import { Section } from "next-vibe/ui/components/section";
import { Span } from "next-vibe/ui/components/span";
import { Summary } from "next-vibe/ui/components/summary";
import { H2, H3, P } from "next-vibe/ui/components/typography";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";

import { getPricingParams } from "@/products/repository-client";

import { scopedTranslation } from "./i18n";

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}): JSX.Element {
  return (
    <Div className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center md:mb-14">
      {eyebrow ? (
        <Span className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </Span>
      ) : null}
      <H2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </H2>
      {subtitle ? (
        <P className="mt-3 text-balance text-muted-foreground md:text-lg">
          {subtitle}
        </P>
      ) : null}
    </Div>
  );
}

// ─── How it works ────────────────────────────────────────────────────────────

export function HowItWorks({
  locale,
  totalModelCount,
}: {
  locale: CountryLanguage;
  totalModelCount: number;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const steps = [
    {
      icon: <Users className="h-5 w-5" />,
      title: t("home.v2.how.steps.who.title"),
      body: t("home.v2.how.steps.who.body"),
    },
    {
      icon: <Filter className="h-5 w-5" />,
      title: t("home.v2.how.steps.filter.title"),
      body: t("home.v2.how.steps.filter.body", {
        modelCount: String(totalModelCount),
      }),
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: t("home.v2.how.steps.ask.title"),
      body: t("home.v2.how.steps.ask.body"),
    },
  ];

  return (
    <Section
      id="how-it-works"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 md:py-24"
    >
      <SectionHeader
        eyebrow={t("home.v2.how.eyebrow")}
        title={t("home.v2.how.title")}
        subtitle={t("home.v2.how.subtitle")}
      />
      <Div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <Div
            key={step.title}
            className="relative flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <Div className="mb-5 flex items-center gap-3">
              <Span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {step.icon}
              </Span>
              <Span className="text-sm font-semibold tabular-nums text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </Span>
            </Div>
            <H3 className="text-lg font-semibold">{step.title}</H3>
            <P className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </P>
          </Div>
        ))}
      </Div>
    </Section>
  );
}

// ─── Pricing teaser ──────────────────────────────────────────────────────────

export function PricingTeaser({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const pricing = getPricingParams(locale);

  const plans = [
    {
      id: "free",
      name: t("home.v2.pricing.free.name"),
      // Same currency as the subscription, amount zero ("$8" -> "$0", "8 zł" -> "0 zł")
      price: (pricing.subscriptionPrice ?? "0").replace(/[\d.,]+/, "0"),
      note: t("home.v2.pricing.free.note", pricing),
      points: [
        t("home.v2.pricing.free.p1", pricing),
        t("home.v2.pricing.free.p2", pricing),
        t("home.v2.pricing.free.p3"),
      ],
      highlight: false,
    },
    {
      id: "sub",
      name: t("home.v2.pricing.sub.name"),
      price: pricing.subscriptionPrice ?? "",
      note: t("home.v2.pricing.sub.note"),
      points: [
        t("home.v2.pricing.sub.p1", pricing),
        t("home.v2.pricing.sub.p2", pricing),
        t("home.v2.pricing.sub.p3"),
      ],
      highlight: true,
    },
  ];

  return (
    <Section className="border-y border-border bg-muted/40">
      <Div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <SectionHeader
          eyebrow={t("home.v2.pricing.eyebrow")}
          title={t("home.v2.pricing.title")}
          subtitle={t("home.v2.pricing.subtitle")}
        />
        <Div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <Div
              key={plan.id}
              className={cn(
                "flex flex-col rounded-2xl border bg-card p-6 shadow-sm",
                plan.highlight
                  ? "border-primary/50 ring-1 ring-primary/30"
                  : "border-border",
              )}
            >
              <Span className="text-sm font-semibold text-muted-foreground">
                {plan.name}
              </Span>
              <Div className="mt-2 flex items-baseline gap-1.5">
                <Span className="text-4xl font-semibold tracking-tight">
                  {plan.price}
                </Span>
                <Span className="text-sm text-muted-foreground">
                  {plan.note}
                </Span>
              </Div>
              <Div className="mt-6 flex flex-col gap-2.5">
                {plan.points.map((point) => (
                  <Span key={point} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {point}
                  </Span>
                ))}
              </Div>
            </Div>
          ))}
        </Div>
        <Div className="mt-8 flex flex-col items-center gap-2 text-center">
          <Button variant="outline" className="h-11 gap-2" asChild>
            <Link href={`/${locale}/subscription`}>
              {t("home.v2.pricing.cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <P className="text-xs text-muted-foreground">
            {t("home.v2.pricing.footnote", pricing)}
          </P>
        </Div>
      </Div>
    </Section>
  );
}

// ─── More ways in ────────────────────────────────────────────────────────────

export function MoreWaysIn({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const paths = [
    {
      id: "selfhost",
      icon: <Server className="h-5 w-5" />,
      accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      label: t("home.splitHero.card.personal.label"),
      desc: t("home.splitHero.card.personal.desc"),
      href: `/${locale}/story/self-host`,
      cta: t("home.splitHero.personal.cta"),
    },
    {
      id: "build",
      icon: <Code2 className="h-5 w-5" />,
      accent: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      label: t("home.splitHero.card.nextvibe.label"),
      desc: t("home.splitHero.card.nextvibe.desc"),
      href: `/${locale}/story/framework`,
      cta: t("home.splitHero.nextvibe.ctaDocs"),
    },
    {
      id: "earn",
      icon: <TrendingUp className="h-5 w-5" />,
      accent: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      label: t("home.splitHero.card.referral.label"),
      desc: t("home.splitHero.card.referral.desc"),
      href: `/${locale}/story/earn`,
      cta: t("home.splitHero.referral.cta"),
    },
  ];

  return (
    <Section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <SectionHeader
        eyebrow={t("home.v2.more.eyebrow")}
        title={t("home.v2.more.title")}
        subtitle={t("home.v2.more.subtitle")}
      />
      <Div className="grid gap-4 md:grid-cols-3">
        {paths.map((path) => (
          <Link
            key={path.id}
            href={path.href}
            className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40"
          >
            <Span
              className={cn(
                "mb-4 flex h-10 w-10 items-center justify-center rounded-lg",
                path.accent,
              )}
            >
              {path.icon}
            </Span>
            <Span className="text-base font-semibold text-foreground">
              {path.label}
            </Span>
            <Span className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
              {path.desc}
            </Span>
            <Span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              {path.cta}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Span>
          </Link>
        ))}
      </Div>
    </Section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQ_IDS = [
  "uncensored",
  "privacy",
  "account",
  "cost",
  "models",
  "selfhost",
] as const;

export function HomeFaq({
  locale,
  totalModelCount,
  totalProviderCount,
}: {
  locale: CountryLanguage;
  totalModelCount: number;
  totalProviderCount: number;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const params = {
    ...getPricingParams(locale),
    modelCount: String(totalModelCount),
    providerCount: String(totalProviderCount),
  };

  return (
    <Section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <Div className="mx-auto w-full max-w-3xl">
        <SectionHeader
          eyebrow={t("home.v2.faq.eyebrow")}
          title={t("home.v2.faq.title")}
        />
        <Div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQ_IDS.map((id) => (
            <Details
              key={id}
              className="group px-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <Summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-medium">
                {t(`home.v2.faq.items.${id}.q`)}
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </Summary>
              <P className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {t(`home.v2.faq.items.${id}.a`, params)}
              </P>
            </Details>
          ))}
        </Div>
      </Div>
    </Section>
  );
}
