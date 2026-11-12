"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Check } from "next-vibe/ui/components/icons/Check";
import { DollarSign } from "next-vibe/ui/components/icons/DollarSign";
import { Gift } from "next-vibe/ui/components/icons/Gift";
import { Link2 } from "next-vibe/ui/components/icons/Link2";
import { LogIn } from "next-vibe/ui/components/icons/LogIn";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { UserPlus } from "next-vibe/ui/components/icons/UserPlus";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H1, H2, H3, Muted, P } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";
import referralCodesListDefinition from "@/referral/codes/list/definition";
import referralDefinition from "@/referral/definition";
import referralPayoutDefinition from "@/referral/payout/definition";
import referralStatsDefinition from "@/referral/stats/definition";

import type { ReferralPageT } from "./i18n";
import { scopedTranslation as pageT } from "./i18n";
import {
  buildCommissionRows,
  type CommissionRow,
  getReferralParams,
} from "./i18n/utils";

function ChainTable({
  t,
  rows,
  p,
}: {
  t: ReferralPageT;
  rows: CommissionRow[];
  p: Record<string, string>;
}): JSX.Element {
  return (
    <Div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Div className="grid grid-cols-[auto_1fr_auto] bg-muted/60 px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide gap-4">
        <Span>#</Span>
        <Span>{t("commissionTable.colLevel")}</Span>
        <Span>{t("commissionTable.colCut")}</Span>
      </Div>
      {rows.map((row, index) => (
        <Div
          key={index}
          className={`grid grid-cols-[auto_1fr_auto] px-4 py-3 border-t text-sm gap-4 items-center ${
            index === 0 ? "bg-primary/5" : "bg-card"
          }`}
        >
          <Div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              index === 0
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {index + 1}
          </Div>
          <Span
            className={index === 0 ? "font-semibold" : "text-muted-foreground"}
          >
            {row.who}
          </Span>
          <Div
            className={`flex items-center gap-2 font-mono font-semibold tabular-nums ${index === 0 ? "text-primary" : "text-foreground"}`}
          >
            {row.pct}
            {index === 0 && (
              <Badge className="hidden border-0 bg-primary/10 text-xs font-normal text-primary sm:inline-flex">
                {t("commissionTable.alwaysYours")}
              </Badge>
            )}
          </Div>
        </Div>
      ))}
      <Div className="px-4 py-2.5 border-t bg-muted/30 text-xs text-muted-foreground">
        {t("commissionTable.tableNote", p)}
      </Div>
    </Div>
  );
}

export function ReferralPageClient({
  locale,
  isAuthenticated,
  user,
  platform,
}: {
  locale: CountryLanguage;
  isAuthenticated: boolean;
  user: JwtPayloadType;
  platform: Platform;
}): JSX.Element {
  const logger = useLogger();
  const { t } = pageT.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const commissionRows = buildCommissionRows(locale, t);
  const p = getReferralParams(locale);

  const sectionTitle = "m-0 border-0 p-0 text-lg font-semibold tracking-tight";

  const hero = (
    <Div className="flex flex-col gap-5">
      <Div className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit gap-1.5 text-xs">
          <Gift className="h-3.5 w-3.5" />
          {t("tagline")}
        </Badge>
        <H1 className="m-0 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
          {t("title", { appName: configT("appName"), ...p })}
        </H1>
        <P className="m-0 max-w-2xl text-base text-muted-foreground">
          {t("description", { appName: configT("appName"), ...p })}
        </P>
      </Div>

      {/* Two big numbers */}
      <Div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:max-w-xl">
        <Div className="flex items-center gap-4 rounded-xl bg-primary px-5 py-4 text-primary-foreground shadow-sm">
          <Div className="text-4xl font-semibold tracking-tighter tabular-nums">
            {p.directPct}
          </Div>
          <Div>
            <Div className="text-sm font-medium leading-tight">
              {t("commissionTable.heroLabel")}
            </Div>
            <Div className="mt-0.5 text-xs text-primary-foreground/75">
              {t("commissionTable.heroSub")}
            </Div>
          </Div>
        </Div>
        <Div className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4 shadow-sm">
          <Div className="text-4xl font-semibold tracking-tighter tabular-nums">
            {p.skillBonusPct}
          </Div>
          <Div>
            <Div className="text-sm font-medium leading-tight">
              {t("hero.bonusEarning")}
            </Div>
            <Div className="mt-0.5 text-xs text-muted-foreground">
              {t("hero.bonusNote")}
            </Div>
          </Div>
        </Div>
      </Div>
    </Div>
  );

  const explainer = (
    <>
      {/* ── TWO EARNING PATHS ── */}
      <Div className="flex flex-col gap-4">
        <H2 className={sectionTitle}>{t("audienceCallout.title")}</H2>
        <Div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              key: "link",
              icon: Link2,
              title: t("audienceCallout.newTitle", p),
              body: t("audienceCallout.newBody", p),
            },
            {
              key: "skill",
              icon: Sparkles,
              title: t("audienceCallout.proTitle", p),
              body: t("audienceCallout.proBody", p),
            },
          ].map((path) => (
            <Div
              key={path.key}
              className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm"
            >
              <Div className="flex items-center gap-3">
                <Div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <path.icon className="h-4 w-4" />
                </Div>
                <Div className="text-sm font-semibold">{path.title}</Div>
              </Div>
              <P className="m-0 text-sm leading-relaxed text-muted-foreground">
                {path.body}
              </P>
            </Div>
          ))}
        </Div>
      </Div>

      {/* ── STORY SCENARIO ── */}
      <Div className="flex flex-col gap-4">
        <Div className="flex flex-col gap-1">
          <H2 className={sectionTitle}>{t("story.title")}</H2>
          <Muted className="block">{t("story.subtitle")}</Muted>
        </Div>
        <Div className="grid gap-3 sm:grid-cols-3">
          {(["noob", "mid", "pro"] as const).map((tier) => (
            <Div
              key={tier}
              className={`flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm ${
                tier === "mid" ? "border-primary/40 ring-1 ring-primary/20" : ""
              }`}
            >
              <Div className="text-sm font-medium text-muted-foreground">
                {t(`story.${tier}.label`)}
              </Div>
              <Div className="text-2xl font-semibold tracking-tight text-primary">
                {t(`story.${tier}.earning`, p)}
              </Div>
              <Muted className="block text-xs leading-relaxed">
                {t(`story.${tier}.desc`, p)}
              </Muted>
            </Div>
          ))}
        </Div>
        <H3 className="m-0 mt-2 text-base font-semibold">
          {t("commissionTable.chainTitle")}
        </H3>
        <ChainTable t={t} rows={commissionRows} p={p} />
      </Div>
    </>
  );

  const howItWorks = (
    <Div className="flex flex-col gap-4">
      <H2 className={sectionTitle}>{t("howItWorks.title")}</H2>
      <Div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            icon: Link2,
            title: t("howItWorks.step1Title"),
            body: t("howItWorks.step1Body"),
          },
          {
            icon: Users,
            title: t("howItWorks.step2Title"),
            body: t("howItWorks.step2Body", p),
          },
          {
            icon: DollarSign,
            title: t("howItWorks.step3Title"),
            body: t("howItWorks.step3Body", p),
          },
        ].map((step, i) => (
          <Div
            key={step.title}
            className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm"
          >
            <Div className="flex items-center gap-3">
              <Div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {i + 1}
              </Div>
              <Div className="text-sm font-semibold">{step.title}</Div>
            </Div>
            <Div className="text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </Div>
          </Div>
        ))}
      </Div>
    </Div>
  );

  const discord = (
    <Div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <Div className="flex items-center gap-4">
        <Div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MessageSquare className="h-5 w-5" />
        </Div>
        <Div>
          <Div className="text-base font-semibold">{t("discord.title")}</Div>
          <Div className="mt-0.5 text-sm text-muted-foreground">
            {t("discord.description")}
          </Div>
        </Div>
      </Div>
      <Button asChild variant="outline" className="h-11 shrink-0 gap-2">
        <Link
          href={configT("social.discordInvite")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageSquare className="h-4 w-4" />
          {t("discord.cta")}
        </Link>
      </Button>
    </Div>
  );

  return (
    <Div className="w-full bg-background">
      <Div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-8 sm:py-12 sm:px-6">
        {hero}

        {howItWorks}

        {isAuthenticated ? (
          <>
            {/* ── YOUR LINK: the one thing a signed-in earner needs ── */}
            <Div className="flex flex-col gap-4">
              <Div className="flex flex-col gap-1">
                <H2 className={sectionTitle}>{t("myCodes.title")}</H2>
                <Muted className="block">{t("manage.codesSubtitle")}</Muted>
              </Div>
              <EndpointsPage
                logger={logger}
                endpoint={referralCodesListDefinition}
                user={user}
                locale={locale}
                platform={platform}
              />
              <EndpointsPage
                logger={logger}
                endpoint={referralDefinition}
                user={user}
                locale={locale}
                platform={platform}
              />
            </Div>

            <Div className="flex flex-col gap-4">
              <Div className="flex flex-col gap-1">
                <H2 className={sectionTitle}>{t("overview.title")}</H2>
                <Muted className="block">{t("overview.subtitle")}</Muted>
              </Div>
              <EndpointsPage
                logger={logger}
                endpoint={referralStatsDefinition}
                user={user}
                locale={locale}
                platform={platform}
              />
              <EndpointsPage
                logger={logger}
                endpoint={referralPayoutDefinition}
                user={user}
                locale={locale}
                platform={platform}
              />
            </Div>

            {explainer}
          </>
        ) : (
          <>
            <Div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-xl border bg-card p-6 text-center shadow-sm sm:p-8">
              <Div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <DollarSign className="h-6 w-6" />
              </Div>
              <Div className="flex flex-col gap-2">
                <H3 className="m-0 text-xl font-semibold tracking-tight">
                  {t("cta.title")}
                </H3>
                <P className="m-0 text-sm text-muted-foreground">
                  {t("cta.description", p)}
                </P>
              </Div>
              <Div className="flex w-full flex-col gap-2.5 text-left">
                {[
                  t("cta.pitch1", p),
                  t("cta.pitch2", p),
                  t("cta.pitch3", p),
                ].map((pitch) => (
                  <Div key={pitch} className="flex items-start gap-3 text-sm">
                    <Div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15">
                      <Check className="h-3 w-3 text-success" />
                    </Div>
                    <Span className="text-foreground/80">{pitch}</Span>
                  </Div>
                ))}
              </Div>
              <Div className="flex w-full flex-col gap-2">
                <Button asChild className="h-11 w-full gap-2">
                  <Link href={`/${locale}/user/signup`}>
                    <UserPlus className="h-4 w-4" />
                    {t("cta.signUp")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 w-full gap-2">
                  <Link
                    href={`/${locale}/user/login?callbackUrl=${encodeURIComponent(`/${locale}/user/referral`)}`}
                  >
                    <LogIn className="h-4 w-4" />
                    {t("cta.logIn")}
                  </Link>
                </Button>
              </Div>
            </Div>

            {explainer}
          </>
        )}

        {discord}
      </Div>
    </Div>
  );
}
