import type { Metadata } from "next";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { AlertCircle } from "next-vibe-ui/ui/icons/AlertCircle";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { BarChart3 } from "next-vibe-ui/ui/icons/BarChart3";
import { Bell } from "next-vibe-ui/ui/icons/Bell";
import { Bot } from "next-vibe-ui/ui/icons/Bot";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { Folder } from "next-vibe-ui/ui/icons/Folder";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { Layers } from "next-vibe-ui/ui/icons/Layers";
import { Lightbulb } from "next-vibe-ui/ui/icons/Lightbulb";
import { Link } from "next-vibe-ui/ui/link";
import { Pre } from "next-vibe-ui/ui/pre";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { Terminal } from "next-vibe-ui/ui/icons/Terminal";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

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

const ARCH_NODE_COLORS: Record<string, string> = {
  blue: "bg-blue-500/20 border border-blue-500/40",
  purple: "bg-purple-500/20 border border-purple-500/40",
  yellow: "bg-yellow-500/20 border border-yellow-500/40",
  emerald: "bg-emerald-500/20 border border-emerald-500/40",
};

/**
 * Architecture flow node — label and description passed as translated strings
 */
function ArchNode({
  label,
  description,
  variant,
  icon,
}: {
  label: string;
  description: string;
  variant: string;
  icon: JSX.Element;
}): JSX.Element {
  const colorClass = ARCH_NODE_COLORS[variant] ?? "";
  return (
    <Div className="flex flex-col items-center text-center">
      <Div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-lg ${colorClass}`}
      >
        {icon}
      </Div>
      <Div className="font-mono text-sm font-bold mb-1">{label}</Div>
      <P className="text-xs text-muted-foreground leading-snug max-w-[140px]">
        {description}
      </P>
    </Div>
  );
}

/**
 * A styled code block for terminal/code snippets — uses Pre and Span from next-vibe-ui
 */
function CodeBlock({
  children,
  terminalLabel,
}: {
  children: string;
  terminalLabel?: string;
}): JSX.Element {
  return (
    <Div className="rounded-xl overflow-hidden border border-gray-700 bg-gray-950 shadow-2xl">
      {terminalLabel ? (
        <Div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-700">
          <Div className="w-3 h-3 rounded-full bg-red-500" />
          <Div className="w-3 h-3 rounded-full bg-yellow-500" />
          <Div className="w-3 h-3 rounded-full bg-green-500" />
          <Span className="ml-2 text-xs text-gray-400 font-mono">
            {terminalLabel}
          </Span>
        </Div>
      ) : null}
      <Div className="p-4 overflow-x-auto">
        <Pre className="text-sm text-green-400 font-mono whitespace-pre leading-relaxed">
          {children}
        </Pre>
      </Div>
    </Div>
  );
}

/**
 * A file tree node — indentation via className padding levels
 */
function FileTreeItem({
  name,
  isDir,
  paddingClass,
}: {
  name: string;
  isDir: boolean;
  paddingClass: string;
}): JSX.Element {
  return (
    <Div
      className={`flex items-center gap-2 py-0.5 font-mono text-sm ${paddingClass}`}
    >
      {isDir ? (
        <Folder className="h-4 w-4 text-yellow-400 shrink-0" />
      ) : (
        <FileText className="h-4 w-4 text-blue-400 shrink-0" />
      )}
      <Span className={isDir ? "text-yellow-300" : "text-gray-300"}>
        {name}
      </Span>
    </Div>
  );
}

const FUNNEL_NODE_COLORS: Record<string, string> = {
  blue: "border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40",
  purple: "border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40",
  yellow: "border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/40",
};

/**
 * A single funnel column step node
 */
function FunnelNode({
  name,
  description,
  variant,
}: {
  name: string;
  description: string;
  variant: string;
}): JSX.Element {
  const colorClass = FUNNEL_NODE_COLORS[variant] ?? "";
  return (
    <Div className={`rounded-lg border p-3 ${colorClass}`}>
      <Div className="font-mono text-xs font-semibold mb-1">{name}</Div>
      <P className="text-xs text-muted-foreground leading-snug">
        {description}
      </P>
    </Div>
  );
}

export function TanstackPage({ locale }: TradingBotPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="min-h-screen bg-gray-950 text-gray-100">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <Div className="relative overflow-hidden bg-gray-950 border-b border-gray-800">
        {/* Ambient grid — bg-image via className only, no style prop */}
        <Div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,255,128,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,128,0.15)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <Div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <Div className="container mx-auto px-4 py-24 relative z-10">
          <Link
            href={`/${locale}/story/blog`}
            className="inline-flex items-center text-sm text-emerald-400/80 hover:text-emerald-400 mb-10 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t(`backToBlog`)}
          </Link>

          <Div className="max-w-4xl">
            <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono text-xs tracking-wider uppercase">
              {t(`hero.eyebrow`)}
            </Badge>

            <H1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              {t(`hero.title`)}
            </H1>

            <P className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              {t(`hero.subtitle`)}
            </P>

            <Div className="flex items-center gap-6 text-sm text-gray-500">
              <Div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-500" />
                {t(`hero.readTime`)}
              </Div>
              <Div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-500" />
                {t(`hero.date`)}
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>

      <Div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* ── ORIGIN STORY ────────────────────────────────────────── */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-8 text-white">
            {t(`origin.title`)}
          </H2>

          <Div className="space-y-6 mb-10">
            <P className="text-lg text-gray-300 leading-relaxed">
              {t(`origin.paragraph1`)}
            </P>
            <P className="text-lg text-gray-300 leading-relaxed">
              {t(`origin.paragraph2`)}
            </P>
            <P className="text-lg text-gray-300 leading-relaxed">
              {t(`origin.paragraph3`)}
            </P>
          </Div>

          {/* Quote callout */}
          <Div className="border-l-4 border-emerald-500 pl-6 py-2 my-10 bg-emerald-500/5 rounded-r-xl">
            <P className="text-xl font-medium text-emerald-300 italic leading-relaxed">
              &ldquo;{t(`origin.quoteText`)}&rdquo;
            </P>
          </Div>

          {/* Timeline */}
          <Div className="relative">
            <Div className="absolute left-6 top-0 bottom-0 w-px bg-gray-700" />
            <Div className="space-y-8">
              {(["octane", "insight", "rebuilt"] as const).map((step) => (
                <Div key={step} className="flex gap-6 relative pl-16">
                  <Div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-gray-950 shadow-lg shadow-emerald-500/50" />
                  <Div>
                    <Div className="font-semibold text-white mb-1">
                      {t(`origin.timeline.${step}.label`)}
                    </Div>
                    <P className="text-gray-400 text-sm leading-relaxed">
                      {t(`origin.timeline.${step}.description`)}
                    </P>
                  </Div>
                </Div>
              ))}
            </Div>
          </Div>
        </Div>

        <Separator className="border-gray-800 mb-20" />

        {/* ── THE INSIGHT ─────────────────────────────────────────── */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-6 text-white">
            {t(`insight.title`)}
          </H2>
          <P className="text-lg text-gray-300 leading-relaxed mb-6">
            {t(`insight.intro`)}
          </P>
          <P className="text-lg text-gray-300 leading-relaxed mb-10">
            {t(`insight.realization`)}
          </P>

          <Div className="grid sm:grid-cols-2 gap-4">
            {(
              [
                "userGrowth",
                "emailHealth",
                "creditEconomy",
                "revenueAnomaly",
              ] as const
            ).map((key) => (
              <Card
                key={key}
                className="bg-gray-900 border-gray-800 hover:border-emerald-500/40 transition-colors"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-emerald-400">
                    {t(`insight.examples.${key}.label`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <P className="text-sm text-gray-400">
                    {t(`insight.examples.${key}.description`)}
                  </P>
                </CardContent>
              </Card>
            ))}
          </Div>
        </Div>

        <Separator className="border-gray-800 mb-20" />

        {/* ── ARCHITECTURE DIAGRAM ────────────────────────────────── */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-3 text-white">
            {t(`architecture.title`)}
          </H2>
          <P className="text-gray-400 mb-12">{t(`architecture.subtitle`)}</P>

          {/* Visual flow */}
          <Div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2 mb-12 overflow-x-auto pb-4">
            <ArchNode
              label={t(`architecture.dataSource.label`)}
              description={t(`architecture.dataSource.description`)}
              variant="blue"
              icon={<BarChart3 className="h-7 w-7 text-blue-400" />}
            />
            <ArrowRight className="h-5 w-5 text-gray-600 md:rotate-0 rotate-90 shrink-0" />
            <ArchNode
              label={t(`architecture.indicator.label`)}
              description={t(`architecture.indicator.description`)}
              variant="purple"
              icon={<TrendingUp className="h-7 w-7 text-purple-400" />}
            />
            <ArrowRight className="h-5 w-5 text-gray-600 md:rotate-0 rotate-90 shrink-0" />
            <ArchNode
              label={t(`architecture.evaluator.label`)}
              description={t(`architecture.evaluator.description`)}
              variant="yellow"
              icon={<GitBranch className="h-7 w-7 text-yellow-400" />}
            />
            <ArrowRight className="h-5 w-5 text-gray-600 md:rotate-0 rotate-90 shrink-0" />
            <ArchNode
              label={t(`architecture.action.label`)}
              description={t(`architecture.action.description`)}
              variant="emerald"
              icon={<Zap className="h-7 w-7 text-emerald-400" />}
            />
          </Div>

          {/* Node detail cards */}
          <Div className="grid sm:grid-cols-2 gap-4">
            {(
              [
                {
                  key: "dataSource",
                  borderClass: "border-l-blue-500",
                  badgeClass: "bg-blue-500/20 text-blue-400",
                },
                {
                  key: "indicator",
                  borderClass: "border-l-purple-500",
                  badgeClass: "bg-purple-500/20 text-purple-400",
                },
                {
                  key: "evaluator",
                  borderClass: "border-l-yellow-500",
                  badgeClass: "bg-yellow-500/20 text-yellow-400",
                },
                {
                  key: "action",
                  borderClass: "border-l-emerald-500",
                  badgeClass: "bg-emerald-500/20 text-emerald-400",
                },
              ] as const
            ).map(({ key, borderClass, badgeClass }) => (
              <Card
                key={key}
                className={`bg-gray-900 border-gray-800 border-l-4 ${borderClass}`}
              >
                <CardHeader className="pb-2">
                  <Badge className={`w-fit text-xs font-mono ${badgeClass}`}>
                    {t(`architecture.${key}.label`)}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <P className="text-sm text-gray-400 leading-relaxed">
                    {t(`architecture.${key}.description`)}
                  </P>
                </CardContent>
              </Card>
            ))}
          </Div>
        </Div>

        <Separator className="border-gray-800 mb-20" />

        {/* ── UNIFIED ARCHITECTURE ────────────────────────────────── */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-3 text-white">
            {t(`unified.title`)}
          </H2>
          <P className="text-gray-400 mb-10">{t(`unified.intro`)}</P>

          {/* Old vs new comparison */}
          <Div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="bg-gray-900 border-gray-700 border-l-4 border-l-red-500/60">
              <CardHeader className="pb-3">
                <Badge className="w-fit bg-red-500/20 text-red-400 text-xs">
                  {t(`unified.oldApproach.label`)}
                </Badge>
              </CardHeader>
              <CardContent>
                <P className="text-sm text-gray-400 leading-relaxed">
                  {t(`unified.oldApproach.description`)}
                </P>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 border-l-4 border-l-emerald-500">
              <CardHeader className="pb-3">
                <Badge className="w-fit bg-emerald-500/20 text-emerald-400 text-xs">
                  {t(`unified.newApproach.label`)}
                </Badge>
              </CardHeader>
              <CardContent>
                <P className="text-sm text-gray-400 leading-relaxed">
                  {t(`unified.newApproach.description`)}
                </P>
              </CardContent>
            </Card>
          </Div>

          {/* CLI demo */}
          <Div className="mb-6">
            <CodeBlock terminalLabel="terminal">
              {`$ vibe ema --period=7

  ┌─────────────────────────────────────────┐
  │  analytics/indicators/ema               │
  │  EMA (Exponential Moving Average)       │
  ├─────────────────────────────────────────┤
  │  period   7                             │
  │  points   365 input → 365 output        │
  │  result   [ { timestamp, value }, ... ] │
  └─────────────────────────────────────────┘`}
            </CodeBlock>
            <P className="text-xs text-gray-500 mt-2 text-center">
              {t(`unified.cliCaption`)}
            </P>
          </Div>

          {/* Insight highlight */}
          <Div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
            <P className="text-lg font-semibold text-emerald-300 mb-2">
              {t(`unified.insight`)}
            </P>
            <P className="text-2xl font-bold text-white">
              {t(`unified.keyLine`)}
            </P>
          </Div>
        </Div>

        <Separator className="border-gray-800 mb-20" />

        {/* ── ACTION CALLOUT ──────────────────────────────────────── */}
        <Div className="mb-20">
          <Div className="bg-orange-500/5 border border-orange-500/30 rounded-2xl p-8">
            <Div className="flex items-start gap-4 mb-6">
              <Div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0 mt-1">
                <AlertCircle className="h-5 w-5 text-orange-400" />
              </Div>
              <H2 className="text-2xl font-bold text-white">
                {t(`actionCallout.title`)}
              </H2>
            </Div>

            <P className="text-lg text-gray-300 leading-relaxed mb-8">
              {t(`actionCallout.body`)}
            </P>

            <Div className="flex flex-wrap gap-3 mb-8">
              {(["noWebhook", "noAlerting", "noZapier"] as const).map((key) => (
                <Div
                  key={key}
                  className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-1.5 text-sm text-red-300"
                >
                  <Span className="text-red-400 font-bold">
                    {t(`ui.crossMark`)}
                  </Span>
                  {t(`actionCallout.${key}`)}
                </Div>
              ))}
            </Div>

            <P className="text-xl font-bold text-emerald-400 mb-8">
              {t(`actionCallout.punchline`)}
            </P>

            <Div className="grid sm:grid-cols-3 gap-4">
              {(["alert", "campaign", "ai"] as const).map((key) => (
                <Div
                  key={key}
                  className="bg-gray-950/60 rounded-xl p-4 border border-gray-700"
                >
                  <Div className="flex items-center gap-2 mb-2">
                    {key === "alert" && (
                      <Bell className="h-4 w-4 text-yellow-400" />
                    )}
                    {key === "campaign" && (
                      <Zap className="h-4 w-4 text-blue-400" />
                    )}
                    {key === "ai" && (
                      <Bot className="h-4 w-4 text-purple-400" />
                    )}
                    <Span className="text-sm font-semibold text-white">
                      {t(`actionCallout.examples.${key}.label`)}
                    </Span>
                  </Div>
                  <P className="text-xs text-gray-400">
                    {t(`actionCallout.examples.${key}.description`)}
                  </P>
                </Div>
              ))}
            </Div>
          </Div>
        </Div>

        <Separator className="border-gray-800 mb-20" />

        {/* ── LEAD FUNNEL WALKTHROUGH ─────────────────────────────── */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-3 text-white">
            {t(`funnel.title`)}
          </H2>
          <P className="text-gray-400 mb-10">{t(`funnel.subtitle`)}</P>

          <Div className="grid md:grid-cols-3 gap-6">
            <Div className="rounded-xl border border-blue-500/40 bg-blue-500/5 p-4">
              <Badge className="mb-3 text-xs font-mono bg-blue-500/20 text-blue-400">
                {t(`funnel.column1.label`)}
              </Badge>
              <P className="text-xs text-gray-400 mb-4 leading-relaxed">
                {t(`funnel.column1.description`)}
              </P>
              <Div className="space-y-2">
                {(["created", "converted", "bounced", "active"] as const).map(
                  (node) => (
                    <FunnelNode
                      key={node}
                      name={t(`funnel.column1.nodes.${node}.name`)}
                      description={t(
                        `funnel.column1.nodes.${node}.description`,
                      )}
                      variant="blue"
                    />
                  ),
                )}
              </Div>
            </Div>

            <Div className="rounded-xl border border-purple-500/40 bg-purple-500/5 p-4">
              <Badge className="mb-3 text-xs font-mono bg-purple-500/20 text-purple-400">
                {t(`funnel.column2.label`)}
              </Badge>
              <P className="text-xs text-gray-400 mb-4 leading-relaxed">
                {t(`funnel.column2.description`)}
              </P>
              <Div className="space-y-2">
                {(["ema7", "conversionRate"] as const).map((node) => (
                  <FunnelNode
                    key={node}
                    name={t(`funnel.column2.nodes.${node}.name`)}
                    description={t(`funnel.column2.nodes.${node}.description`)}
                    variant="purple"
                  />
                ))}
              </Div>
            </Div>

            <Div className="rounded-xl border border-yellow-500/40 bg-yellow-500/5 p-4">
              <Badge className="mb-3 text-xs font-mono bg-yellow-500/20 text-yellow-400">
                {t(`funnel.column3.label`)}
              </Badge>
              <P className="text-xs text-gray-400 mb-4 leading-relaxed">
                {t(`funnel.column3.description`)}
              </P>
              <Div className="space-y-2">
                {(["leadDrop", "zeroLeads", "lowConversion"] as const).map(
                  (node) => (
                    <FunnelNode
                      key={node}
                      name={t(`funnel.column3.nodes.${node}.name`)}
                      description={t(
                        `funnel.column3.nodes.${node}.description`,
                      )}
                      variant="yellow"
                    />
                  ),
                )}
              </Div>
            </Div>
          </Div>
        </Div>

        <Separator className="border-gray-800 mb-20" />

        {/* ── EMA = ENDPOINT CODE REVEAL ──────────────────────────── */}
        <Div className="mb-20">
          <Div className="grid md:grid-cols-2 gap-8 items-start">
            <Div>
              <H2 className="text-2xl font-bold mb-4 text-white">
                {t(`unified.title`)}
              </H2>
              <P className="text-gray-400 leading-relaxed mb-6">
                {t(`unified.cliCaption`)}
              </P>
              <CodeBlock terminalLabel="analytics/indicators/ema/definition.ts">
                {`const { POST } = createEndpoint({
  path: ["analytics", "indicators", "ema"],
  tags: ["tags.vibeSense"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    children: {
      source: timeSeriesRequestField(...),
      period: requestField(..., {
        fieldType: FieldDataType.NUMBER,
        schema: z.number().int().min(1).max(500),
      }),
      result: timeSeriesResponseField(...),
    },
  }),
});`}
              </CodeBlock>
            </Div>

            <Div>
              <H3 className="text-lg font-semibold mb-4 text-emerald-400 font-mono">
                {t(`ui.emaFunctionLabel`)}
              </H3>
              <P className="text-gray-400 text-sm mb-4">
                {t(`unified.insight`)}
              </P>
              <CodeBlock terminalLabel="analytics/indicators/ema/repository.ts">
                {`export function computeEma(
  points: TimeSeries,
  period: number,
): TimeSeries {
  const k = 2 / (period + 1);
  let ema: number | undefined;

  return points.map((p) => {
    ema =
      ema === undefined
        ? p.value
        : p.value * k + ema * (1 - k);
    return { timestamp: p.timestamp, value: ema };
  });
}`}
              </CodeBlock>
            </Div>
          </Div>
        </Div>

        <Separator className="border-gray-800 mb-20" />

        {/* ── DOMAIN-OWNED DATA SOURCES ───────────────────────────── */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-3 text-white">
            {t(`domainOwned.title`)}
          </H2>
          <P className="text-gray-400 mb-10">{t(`domainOwned.subtitle`)}</P>

          {/* File trees side by side */}
          <Div className="grid md:grid-cols-2 gap-6 mb-10">
            <Div className="bg-gray-950 rounded-xl border border-gray-800 p-5">
              <Div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
                <Folder className="h-4 w-4 text-yellow-400" />
                <Span className="font-mono text-sm text-yellow-300 font-semibold">
                  {t(`domainOwned.leadsLabel`)}
                </Span>
              </Div>
              <FileTreeItem
                name="leads/data-sources/"
                isDir
                paddingClass="pl-0"
              />
              <FileTreeItem name="leads-created/" isDir paddingClass="pl-4" />
              <FileTreeItem
                name="definition.ts"
                isDir={false}
                paddingClass="pl-8"
              />
              <FileTreeItem
                name="repository.ts"
                isDir={false}
                paddingClass="pl-8"
              />
              <FileTreeItem name="query.ts" isDir={false} paddingClass="pl-8" />
              <FileTreeItem name="leads-converted/" isDir paddingClass="pl-4" />
              <FileTreeItem name="leads-bounced/" isDir paddingClass="pl-4" />
              <FileTreeItem name="leads-active/" isDir paddingClass="pl-4" />
              <FileTreeItem
                name="leads-email-opens/"
                isDir
                paddingClass="pl-4"
              />
              <FileTreeItem
                name="leads-email-clicks/"
                isDir
                paddingClass="pl-4"
              />
            </Div>

            <Div className="bg-gray-950 rounded-xl border border-gray-800 p-5">
              <Div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
                <Folder className="h-4 w-4 text-yellow-400" />
                <Span className="font-mono text-sm text-yellow-300 font-semibold">
                  {t(`domainOwned.creditsLabel`)}
                </Span>
              </Div>
              <FileTreeItem
                name="credits/data-sources/"
                isDir
                paddingClass="pl-0"
              />
              <FileTreeItem
                name="credits-spent-total/"
                isDir
                paddingClass="pl-4"
              />
              <FileTreeItem
                name="definition.ts"
                isDir={false}
                paddingClass="pl-8"
              />
              <FileTreeItem
                name="repository.ts"
                isDir={false}
                paddingClass="pl-8"
              />
              <FileTreeItem name="query.ts" isDir={false} paddingClass="pl-8" />
              <FileTreeItem
                name="credits-purchased/"
                isDir
                paddingClass="pl-4"
              />
              <FileTreeItem name="credits-earned/" isDir paddingClass="pl-4" />
              <FileTreeItem
                name="credits-refunded/"
                isDir
                paddingClass="pl-4"
              />
              <FileTreeItem
                name="credits-balance-total/"
                isDir
                paddingClass="pl-4"
              />
            </Div>
          </Div>

          <P className="text-gray-300 leading-relaxed mb-6">
            {t(`domainOwned.explanation`)}
          </P>

          <Card className="bg-gray-900 border-gray-800 border-l-4 border-l-purple-500 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-400 font-mono">
                {t(`domainOwned.indicators.label`)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <P className="text-sm text-gray-400">
                {t(`domainOwned.indicators.description`)}
              </P>
            </CardContent>
          </Card>

          <P className="text-gray-400 leading-relaxed mb-6">
            {t(`domainOwned.registration`)}
          </P>

          <Div className="border-l-4 border-emerald-500 pl-6 py-2 bg-emerald-500/5 rounded-r-xl">
            <P className="text-lg font-semibold text-emerald-300">
              {t(`domainOwned.keyLine`)}
            </P>
          </Div>
        </Div>

        <Separator className="border-gray-800 mb-20" />

        {/* ── VERSIONING / BACKTEST / PERSIST ─────────────────────── */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-3 text-white">
            {t(`safety.title`)}
          </H2>
          <P className="text-gray-400 mb-10">{t(`safety.subtitle`)}</P>

          <Div className="space-y-6 mb-10">
            <Card className="bg-gray-900 border-gray-800 border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <Div className="flex items-center gap-3">
                  <GitBranch className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-white">
                    {t(`safety.versioning.label`)}
                  </CardTitle>
                </Div>
              </CardHeader>
              <CardContent>
                <P className="text-gray-400">
                  {t(`safety.versioning.description`)}
                </P>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 border-l-4 border-l-yellow-500">
              <CardHeader className="pb-2">
                <Div className="flex items-center gap-3">
                  <Code className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-white">
                    {t(`safety.backtest.label`)}
                  </CardTitle>
                </Div>
              </CardHeader>
              <CardContent>
                <P className="text-gray-400">
                  {t(`safety.backtest.description`)}
                </P>
              </CardContent>
            </Card>
          </Div>

          {/* Persist modes */}
          <H3 className="text-lg font-semibold text-white mb-4">
            {t(`safety.persist.label`)}
          </H3>
          <Div className="grid sm:grid-cols-3 gap-4">
            {(["always", "snapshot", "never"] as const).map((mode) => (
              <Div
                key={mode}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4"
              >
                <Div className="font-mono text-sm font-bold text-emerald-400 mb-2">
                  {t(`safety.persist.${mode}.label`)}
                </Div>
                <P className="text-xs text-gray-400 leading-relaxed">
                  {t(`safety.persist.${mode}.description`)}
                </P>
              </Div>
            ))}
          </Div>
        </Div>

        <Separator className="border-gray-800 mb-20" />

        {/* ── WHAT SHIPS ──────────────────────────────────────────── */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-10 text-white">
            {t(`ships.title`)}
          </H2>

          <Div className="grid md:grid-cols-2 gap-8">
            <Div className="bg-emerald-500/5 border border-emerald-500/30 rounded-2xl p-6">
              <Div className="flex items-center gap-3 mb-6">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <H3 className="text-lg font-semibold text-emerald-300">
                  {t(`ships.prodReady.label`)}
                </H3>
              </Div>
              <Div className="space-y-3">
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
                  <Div key={key} className="flex gap-3">
                    <Span className="text-emerald-500 text-sm mt-0.5 shrink-0">
                      {t(`ui.checkMark`)}
                    </Span>
                    <P className="text-sm text-gray-300">
                      {t(`ships.prodReady.items.${key}`)}
                    </P>
                  </Div>
                ))}
              </Div>
            </Div>

            <Div className="bg-blue-500/5 border border-blue-500/30 rounded-2xl p-6">
              <Div className="flex items-center gap-3 mb-6">
                <Lightbulb className="h-5 w-5 text-blue-400" />
                <H3 className="text-lg font-semibold text-blue-300">
                  {t(`ships.coming.label`)}
                </H3>
              </Div>
              <Div className="space-y-3">
                {(["builder", "trading", "marketplace"] as const).map((key) => (
                  <Div key={key} className="flex gap-3">
                    <Span className="text-blue-500 text-sm mt-0.5 shrink-0">
                      {t(`ui.arrowMark`)}
                    </Span>
                    <P className="text-sm text-gray-300">
                      {t(`ships.coming.items.${key}`)}
                    </P>
                  </Div>
                ))}
              </Div>
            </Div>
          </Div>
        </Div>

        <Separator className="border-gray-800 mb-20" />

        {/* ── VISION + CLOSE ──────────────────────────────────────── */}
        <Div className="mb-16">
          <H2 className="text-3xl font-bold mb-8 text-white">
            {t(`vision.title`)}
          </H2>

          <Div className="space-y-6 mb-10">
            <P className="text-lg text-gray-300 leading-relaxed">
              {t(`vision.paragraph1`)}
            </P>
            <P className="text-lg text-gray-300 leading-relaxed">
              {t(`vision.paragraph2`)}
            </P>
          </Div>

          {/* Key line quote */}
          <Div className="border-l-4 border-emerald-500 pl-6 py-3 my-10 bg-emerald-500/5 rounded-r-xl">
            <P className="text-xl font-semibold text-emerald-300 leading-relaxed">
              {t(`vision.keyLine`)}
            </P>
          </Div>

          {/* Quick start */}
          <Div className="mb-10">
            <Div className="flex items-center gap-2 mb-4">
              <Terminal className="h-5 w-5 text-emerald-400" />
              <Span className="font-semibold text-white">
                {t(`vision.quickstart.label`)}
              </Span>
            </Div>
            <CodeBlock terminalLabel="terminal">
              {`git clone https://github.com/techfreaque/next-vibe
cd next-vibe
cp .env.example .env
bun install
vibe dev`}
            </CodeBlock>
            <P className="text-sm text-gray-500 mt-3">
              {t(`vision.quickstart.description`)}
            </P>
          </Div>

          {/* Final tagline */}
          <Div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 text-center mb-10">
            <P className="text-2xl font-bold text-white leading-relaxed">
              {t(`vision.closeTagline`)}
            </P>
          </Div>

          {/* CTAs */}
          <Div className="flex flex-wrap gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Link
                href="https://github.com/techfreaque/next-vibe"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(`vision.cta.primary`)}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white"
            >
              <Link href={`/${locale}/story/blog`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t(`vision.cta.secondary`)}
              </Link>
            </Button>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

export default async function TradingBotBlogPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
