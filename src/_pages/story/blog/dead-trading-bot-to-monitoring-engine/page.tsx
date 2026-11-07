import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { BarChart3 } from "next-vibe/ui/components/icons/BarChart3";
import { Bell } from "next-vibe/ui/components/icons/Bell";
import { Bot } from "next-vibe/ui/components/icons/Bot";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Code } from "next-vibe/ui/components/icons/Code";
import { FileText } from "next-vibe/ui/components/icons/FileText";
import { Folder } from "next-vibe/ui/components/icons/Folder";
import { GitBranch } from "next-vibe/ui/components/icons/GitBranch";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Lightbulb } from "next-vibe/ui/components/icons/Lightbulb";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import { XCircle } from "next-vibe/ui/components/icons/XCircle";
import { Zap } from "next-vibe/ui/components/icons/Zap";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";

import { GITHUB_REPO_URL } from "@/env/constants";

import {
  ArticleBody,
  ArticleCode,
  ArticleEnd,
  ArticleH3,
  ArticleHeader,
  ArticleLead,
  ArticleP,
  ArticleQuote,
  ArticleSection,
} from "../../_shared/article";
import { Callout, Cta } from "../../_shared/marketing";
import { formatPostDate } from "../posts-meta";
import { scopedTranslation } from "./i18n";

// Revalidate every hour (ISR)
export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * Generate metadata for the trading bot blog post
 */
export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  return metadataGenerator(locale, {
    path: "story/blog/dead-trading-bot-to-monitoring-engine",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070",
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
    additionalMetadata: {
      openGraph: {
        title: t("meta.ogTitle"),
        description: t("meta.ogDescription"),
      },
      twitter: {
        title: t("meta.twitterTitle"),
        description: t("meta.twitterDescription"),
      },
    },
  });
};

export interface TradingBotPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<TradingBotPageData> {
  const { locale } = await params;
  return { locale };
}

/** One stage of the pipeline: data source → indicator → evaluator → action. */
function ArchNode({
  step,
  label,
  description,
  icon: Icon,
}: {
  step: number;
  label: string;
  description: string;
  icon: IconComponent;
}): JSX.Element {
  return (
    <Div className="flex gap-4 rounded-xl border border-border bg-card p-4 md:flex-col md:gap-3">
      <Div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </Div>
      <Div className="min-w-0">
        <Span className="font-mono text-xs text-muted-foreground">
          {String(step).padStart(2, "0")}
        </Span>
        <P className="font-mono text-sm font-semibold text-foreground">
          {label}
        </P>
        <P className="mt-1 text-sm leading-snug text-muted-foreground">
          {description}
        </P>
      </Div>
    </Div>
  );
}

interface TreeEntry {
  name: string;
  isDir: boolean;
  depth: 0 | 1 | 2;
}

/** Folder listing - monospace, indented by depth, no palette colors. */
function FileTree({
  title,
  entries,
  footer,
}: {
  title: string;
  entries: ReadonlyArray<TreeEntry>;
  footer: string;
}): JSX.Element {
  return (
    <Div className="min-w-0 rounded-xl border border-border bg-card p-4 md:p-5">
      <Div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
        <Folder className="h-4 w-4 text-primary" />
        <Span className="font-mono text-sm font-semibold text-foreground">
          {title}
        </Span>
      </Div>
      <Div className="overflow-x-auto">
        {entries.map((entry) => (
          <Div
            key={`${entry.depth}-${entry.name}`}
            className={cn(
              "flex items-center gap-2 py-0.5 font-mono text-[13px] whitespace-nowrap",
              entry.depth === 1 && "pl-4",
              entry.depth === 2 && "pl-8",
            )}
          >
            {entry.isDir ? (
              <Folder className="h-3.5 w-3.5 shrink-0 text-primary/70" />
            ) : (
              <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )}
            <Span
              className={
                entry.isDir ? "text-foreground" : "text-muted-foreground"
              }
            >
              {entry.name}
            </Span>
          </Div>
        ))}
      </Div>
      <P className="mt-2 pl-4 font-mono text-xs text-muted-foreground">
        {footer}
      </P>
    </Div>
  );
}

function dataSourceTree(
  root: string,
  first: string,
  rest: ReadonlyArray<string>,
): TreeEntry[] {
  return [
    { name: root, isDir: true, depth: 0 },
    { name: first, isDir: true, depth: 1 },
    { name: "constants.ts", isDir: false, depth: 2 },
    { name: "definition.ts", isDir: false, depth: 2 },
    { name: "i18n/", isDir: true, depth: 2 },
    { name: "repository.ts", isDir: false, depth: 2 },
    { name: "route.ts", isDir: false, depth: 2 },
    ...rest.map((name): TreeEntry => ({ name, isDir: true, depth: 1 })),
  ];
}

/** One column of the lead-funnel graph. */
function FunnelColumn({
  label,
  description,
  nodes,
}: {
  label: string;
  description: string;
  nodes: ReadonlyArray<{ name: string; description: string }>;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <Span className="w-fit rounded-md border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
        {label}
      </Span>
      <P className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </P>
      <Div className="flex flex-col gap-2">
        {nodes.map((node) => (
          <Div
            key={node.name}
            className="rounded-lg border border-border bg-muted/50 p-3"
          >
            <P className="font-mono text-xs font-semibold text-foreground">
              {node.name}
            </P>
            <P className="mt-0.5 text-xs leading-snug text-muted-foreground">
              {node.description}
            </P>
          </Div>
        ))}
      </Div>
    </Div>
  );
}

const CLI_DEMO = `$ vibe vibe-sense-ema --period=7

  ┌─────────────────────────────────────────┐
  │  analytics/indicators/ema               │
  │  EMA (Exponential Moving Average)       │
  ├─────────────────────────────────────────┤
  │  period   7                             │
  │  points   365 input → 365 output        │
  │  result   [ { timestamp, value }, ... ] │
  └─────────────────────────────────────────┘`;

const EMA_DEFINITION = `const { POST } = createEndpoint({
  scopedTranslation,
  aliases: [EMA_ALIAS],
  method: Methods.POST,
  path: ["system", "unified-interface", "vibe-sense", "indicators", "ema"],
  title: "post.title",
  description: "post.description",
  icon: "activity",
  category: "endpointCategories.analyticsIndicators",
  tags: ["tags.vibeSense"],
  allowedRoles: [UserRole.ADMIN],
  fields: objectField(scopedTranslation, {
    usage: { request: "data", response: true },
    children: {
      source: timeSeriesRequestField(scopedTranslation, { ... }),
      resolution: resolutionRequestField(scopedTranslation, { ... }),
      range: rangeRequestField(scopedTranslation, { ... }),
      lookback: lookbackRequestField(scopedTranslation, { ... }),
      period: requestField(scopedTranslation, {
        fieldType: FieldDataType.NUMBER,
        schema: z.number().int().min(1).max(500),
        label: "post.fields.period.label",
        description: "post.fields.period.description",
      }),
      result: timeSeriesResponseField(scopedTranslation, { ... }),
      meta: nodeMetaResponseField(scopedTranslation, { ... }),
    },
  }),
  errorTypes: { /* all 9 required */ },
  successTypes: { title: "post.success.title", ... },
  examples: { requests: { default: { source: [...], period: 3 } }, ... },
});`;

const EMA_REPOSITORY = `// Pure computation. No DB access.
export class EmaIndicatorRepository {
  static computeEma(points: TimeSeries, period: number): TimeSeries {
    if (points.length === 0) return [];
    const k = 2 / (period + 1);
    const result: TimeSeries = [];
    let ema: number | undefined;
    for (const p of points) {
      ema = ema === undefined ? p.value : p.value * k + ema * (1 - k);
      result.push({ timestamp: p.timestamp, value: ema });
    }
    return result;
  }
}

// route.ts wires it:
// handler: ({ data }) => {
//   const result = EmaIndicatorRepository.computeEma(data.source, data.period);
//   return success({ result, meta: { ... } });
// }`;

const QUICKSTART = `git clone https://github.com/techfreaque/next-vibe
cd next-vibe
cp .env.example .env
bun install
vibe dev`;

export function TanstackPage({ locale }: TradingBotPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = { href: `/${locale}/story/blog`, label: t("backToBlog") };

  const archNodes = [
    { key: "dataSource", icon: BarChart3 },
    { key: "indicator", icon: TrendingUp },
    { key: "evaluator", icon: GitBranch },
    { key: "action", icon: Zap },
  ] as const;

  const actionExamples = [
    { key: "alert", icon: Bell },
    { key: "campaign", icon: Zap },
    { key: "ai", icon: Bot },
  ] as const;

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.eyebrow")}
        readTime={t("hero.readTime")}
        date={formatPostDate("dead-trading-bot-to-monitoring-engine", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        {/* ── Origin story ─────────────────────────────────────────── */}
        <ArticleSection title={t("origin.title")}>
          <ArticleLead>{t("origin.paragraph1")}</ArticleLead>
          <ArticleP>{t("origin.paragraph2")}</ArticleP>
          <ArticleP>{t("origin.paragraph3")}</ArticleP>
          <ArticleQuote>{t("origin.quoteText")}</ArticleQuote>
          <Div className="relative flex flex-col gap-6 pl-8">
            <Div className="absolute top-2 bottom-2 left-[7px] w-px bg-border" />
            {(["octane", "insight", "rebuilt"] as const).map((step) => (
              <Div key={step} className="relative">
                <Div className="absolute top-1.5 -left-8 h-[15px] w-[15px] rounded-full border-2 border-background bg-primary" />
                <P className="font-semibold text-foreground">
                  {t(`origin.timeline.${step}.label`)}
                </P>
                <P className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {t(`origin.timeline.${step}.description`)}
                </P>
              </Div>
            ))}
          </Div>
        </ArticleSection>

        {/* ── The insight ──────────────────────────────────────────── */}
        <ArticleSection title={t("insight.title")}>
          <ArticleP>{t("insight.intro")}</ArticleP>
          <ArticleP>{t("insight.realization")}</ArticleP>
          <Div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                "userGrowth",
                "emailHealth",
                "creditEconomy",
                "revenueAnomaly",
              ] as const
            ).map((key) => (
              <Div
                key={key}
                className="rounded-xl border border-border bg-card p-5"
              >
                <P className="text-sm font-semibold text-primary">
                  {t(`insight.examples.${key}.label`)}
                </P>
                <P className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t(`insight.examples.${key}.description`)}
                </P>
              </Div>
            ))}
          </Div>
        </ArticleSection>

        {/* ── Architecture ─────────────────────────────────────────── */}
        <ArticleSection
          title={t("architecture.title")}
          intro={t("architecture.subtitle")}
        >
          <Div className="grid gap-3 md:grid-cols-4">
            {archNodes.map(({ key, icon }, index) => (
              <ArchNode
                key={key}
                step={index + 1}
                label={t(`architecture.${key}.label`)}
                description={t(`architecture.${key}.description`)}
                icon={icon}
              />
            ))}
          </Div>
        </ArticleSection>

        {/* ── Unified architecture ─────────────────────────────────── */}
        <ArticleSection title={t("unified.title")} intro={t("unified.intro")}>
          <Div className="grid gap-3 md:grid-cols-2">
            <Div className="rounded-xl border border-destructive/25 bg-destructive/5 p-5">
              <Span className="text-xs font-semibold uppercase tracking-wider text-destructive">
                {t("unified.oldApproach.label")}
              </Span>
              <P className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {t("unified.oldApproach.description")}
              </P>
            </Div>
            <Div className="rounded-xl border border-success/25 bg-success/5 p-5">
              <Span className="text-xs font-semibold uppercase tracking-wider text-success">
                {t("unified.newApproach.label")}
              </Span>
              <P className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {t("unified.newApproach.description")}
              </P>
            </Div>
          </Div>
          <Div>
            <ArticleCode code={CLI_DEMO} language="bash" filename="terminal" />
            <P className="mt-2 text-center text-xs text-muted-foreground">
              {t("unified.cliCaption")}
            </P>
          </Div>
          <Callout tone="primary">
            <P className="font-medium text-foreground">
              {t("unified.insight")}
            </P>
            <P className="mt-2 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              {t("unified.keyLine")}
            </P>
          </Callout>
        </ArticleSection>

        {/* ── Action callout ───────────────────────────────────────── */}
        <ArticleSection>
          <Div className="flex flex-col gap-6 rounded-2xl border border-warning/30 bg-warning/5 p-5 md:p-8">
            <Div className="flex items-start gap-3">
              <Div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
                <AlertCircle className="h-5 w-5" />
              </Div>
              <ArticleH3 className="mt-1.5 text-xl md:text-2xl">
                {t("actionCallout.title")}
              </ArticleH3>
            </Div>
            <ArticleP>{t("actionCallout.body")}</ArticleP>
            <Div className="flex flex-wrap gap-2">
              {(["noWebhook", "noAlerting", "noZapier"] as const).map((key) => (
                <Span
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-1.5 text-sm text-destructive"
                >
                  <XCircle className="h-4 w-4" />
                  {t(`actionCallout.${key}`)}
                </Span>
              ))}
            </Div>
            <P className="text-xl font-semibold tracking-tight text-foreground">
              {t("actionCallout.punchline")}
            </P>
            <Div className="grid gap-3 sm:grid-cols-3">
              {actionExamples.map(({ key, icon: Icon }) => (
                <Div
                  key={key}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <Div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <Span className="text-sm font-semibold text-foreground">
                      {t(`actionCallout.examples.${key}.label`)}
                    </Span>
                  </Div>
                  <P className="mt-1.5 text-sm leading-snug text-muted-foreground">
                    {t(`actionCallout.examples.${key}.description`)}
                  </P>
                </Div>
              ))}
            </Div>
          </Div>
        </ArticleSection>

        {/* ── Lead funnel walkthrough ──────────────────────────────── */}
        <ArticleSection title={t("funnel.title")} intro={t("funnel.subtitle")}>
          <Div className="grid gap-3 md:grid-cols-3">
            <FunnelColumn
              label={t("funnel.column1.label")}
              description={t("funnel.column1.description")}
              nodes={(
                ["created", "converted", "bounced", "active"] as const
              ).map((node) => ({
                name: t(`funnel.column1.nodes.${node}.name`),
                description: t(`funnel.column1.nodes.${node}.description`),
              }))}
            />
            <FunnelColumn
              label={t("funnel.column2.label")}
              description={t("funnel.column2.description")}
              nodes={(["ema7", "conversionRate"] as const).map((node) => ({
                name: t(`funnel.column2.nodes.${node}.name`),
                description: t(`funnel.column2.nodes.${node}.description`),
              }))}
            />
            <FunnelColumn
              label={t("funnel.column3.label")}
              description={t("funnel.column3.description")}
              nodes={(["leadDrop", "zeroLeads", "lowConversion"] as const).map(
                (node) => ({
                  name: t(`funnel.column3.nodes.${node}.name`),
                  description: t(`funnel.column3.nodes.${node}.description`),
                }),
              )}
            />
          </Div>
        </ArticleSection>

        {/* ── EMA = endpoint ───────────────────────────────────────── */}
        <ArticleSection
          label={t("ui.emaFunctionLabel")}
          title={t("unified.title")}
          intro={t("unified.cliCaption")}
        >
          <ArticleCode
            code={EMA_DEFINITION}
            language="typescript"
            filename="analytics/indicators/ema/definition.ts"
          />
          <ArticleP>{t("unified.insight")}</ArticleP>
          <ArticleCode
            code={EMA_REPOSITORY}
            language="typescript"
            filename="analytics/indicators/ema/repository.ts"
          />
        </ArticleSection>

        {/* ── Domain-owned data sources ────────────────────────────── */}
        <ArticleSection
          title={t("domainOwned.title")}
          intro={t("domainOwned.subtitle")}
        >
          <Div className="grid gap-3 md:grid-cols-2">
            <FileTree
              title={t("domainOwned.leadsLabel")}
              footer={t("domainOwned.leadsCount")}
              entries={dataSourceTree("leads/data-sources/", "leads-created/", [
                "leads-converted/",
                "leads-bounced/",
                "leads-active/",
                "leads-campaign-running/",
                "leads-email-opens/",
                "leads-email-clicks/",
                "leads-engagements/",
                "leads-form-submits/",
                "leads-website-visits/",
              ])}
            />
            <FileTree
              title={t("domainOwned.creditsLabel")}
              footer={t("domainOwned.creditsCount")}
              entries={dataSourceTree(
                "credits/data-sources/",
                "credits-spent-total/",
                [
                  "credits-purchased/",
                  "credits-earned/",
                  "credits-refunded/",
                  "credits-balance-total/",
                  "credits-subscription-revenue/",
                  "credits-transactions-count/",
                  "credits-wallets-total/",
                ],
              )}
            />
          </Div>
          <ArticleP>{t("domainOwned.explanation")}</ArticleP>
          <Div className="rounded-xl border border-border bg-card p-5">
            <P className="font-mono text-sm font-semibold text-primary">
              {t("domainOwned.indicators.label")}
            </P>
            <P className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
              {t("domainOwned.indicators.description")}
            </P>
          </Div>
          <ArticleP>{t("domainOwned.registration")}</ArticleP>
          <ArticleQuote>{t("domainOwned.keyLine")}</ArticleQuote>
        </ArticleSection>

        {/* ── Versioning / backtest / persist ──────────────────────── */}
        <ArticleSection title={t("safety.title")} intro={t("safety.subtitle")}>
          {(
            [
              { key: "versioning", icon: GitBranch },
              { key: "backtest", icon: Code },
            ] as const
          ).map(({ key, icon: Icon }) => (
            <Div
              key={key}
              className="flex gap-4 rounded-xl border border-border bg-card p-5"
            >
              <Div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </Div>
              <Div className="min-w-0">
                <P className="font-semibold text-foreground">
                  {t(`safety.${key}.label`)}
                </P>
                <P className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {t(`safety.${key}.description`)}
                </P>
              </Div>
            </Div>
          ))}
          <ArticleH3>{t("safety.persist.label")}</ArticleH3>
          <Div className="grid gap-3 sm:grid-cols-3">
            {(["always", "snapshot", "never"] as const).map((mode) => (
              <Div
                key={mode}
                className="rounded-xl border border-border bg-card p-4"
              >
                <P className="font-mono text-sm font-semibold text-primary">
                  {t(`safety.persist.${mode}.label`)}
                </P>
                <P className="mt-1 text-sm leading-snug text-muted-foreground">
                  {t(`safety.persist.${mode}.description`)}
                </P>
              </Div>
            ))}
          </Div>
        </ArticleSection>

        {/* ── What ships ───────────────────────────────────────────── */}
        <ArticleSection title={t("ships.title")}>
          <Div className="grid gap-3 md:grid-cols-2">
            <Div className="rounded-xl border border-success/25 bg-success/5 p-5 md:p-6">
              <Div className="mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <ArticleH3 className="mt-0 text-base md:text-lg">
                  {t("ships.prodReady.label")}
                </ArticleH3>
              </Div>
              <Div className="flex flex-col gap-3">
                {(
                  [
                    "engine",
                    "execution",
                    "versioning",
                    "cli",
                    "mcp",
                    "seeds",
                  ] as const
                ).map((key) => (
                  <Div key={key} className="flex gap-2.5">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <P className="text-sm leading-relaxed text-foreground/90">
                      {t(`ships.prodReady.items.${key}`)}
                    </P>
                  </Div>
                ))}
              </Div>
            </Div>
            <Div className="rounded-xl border border-primary/25 bg-primary/5 p-5 md:p-6">
              <Div className="mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <ArticleH3 className="mt-0 text-base md:text-lg">
                  {t("ships.coming.label")}
                </ArticleH3>
              </Div>
              <Div className="flex flex-col gap-3">
                {(["builder", "trading", "marketplace"] as const).map((key) => (
                  <Div key={key} className="flex gap-2.5">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <P className="text-sm leading-relaxed text-foreground/90">
                      {t(`ships.coming.items.${key}`)}
                    </P>
                  </Div>
                ))}
              </Div>
            </Div>
          </Div>
        </ArticleSection>

        {/* ── Vision ───────────────────────────────────────────────── */}
        <ArticleSection title={t("vision.title")}>
          <ArticleP>{t("vision.paragraph1")}</ArticleP>
          <ArticleP>{t("vision.paragraph2")}</ArticleP>
          <ArticleQuote>{t("vision.keyLine")}</ArticleQuote>
          <Div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <Span className="font-semibold text-foreground">
              {t("vision.quickstart.label")}
            </Span>
          </Div>
          <ArticleCode code={QUICKSTART} language="bash" />
          <P className="text-sm text-muted-foreground">
            {t("vision.quickstart.description")}
          </P>
        </ArticleSection>

        <ArticleEnd
          back={{ href: back.href, label: t("vision.cta.secondary") }}
          title={t("vision.closeTagline")}
          actions={
            <Cta
              href={GITHUB_REPO_URL}
              label={t("vision.cta.primary")}
              icon={Github}
              external
            />
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function TradingBotBlogPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
