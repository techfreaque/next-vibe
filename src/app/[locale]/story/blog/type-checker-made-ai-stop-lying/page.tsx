import type { Metadata } from "next";
import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle2 } from "next-vibe-ui/ui/icons/CheckCircle2";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { Terminal } from "next-vibe-ui/ui/icons/Terminal";
import { XCircle } from "next-vibe-ui/ui/icons/XCircle";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Link } from "next-vibe-ui/ui/link";
import { Pre } from "next-vibe-ui/ui/pre";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { scopedTranslation } from "./i18n";

export const revalidate = 3600;

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  return metadataGenerator(locale, {
    path: "story/blog/type-checker-made-ai-stop-lying",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070",
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
  });
};

export interface TypeCheckerPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<TypeCheckerPageData> {
  const { locale } = await params;
  return { locale };
}

function TerminalBlock({
  title,
  lines,
  variant,
}: {
  title: string;
  lines: string[];
  variant: "error" | "pass" | "neutral";
}): JSX.Element {
  const borderColor =
    variant === "error"
      ? "border-red-500/50"
      : variant === "pass"
        ? "border-green-500/50"
        : "border-gray-600/50";
  const titleColor =
    variant === "error"
      ? "text-red-400"
      : variant === "pass"
        ? "text-green-400"
        : "text-gray-400";
  const dotColor =
    variant === "error"
      ? "bg-red-500"
      : variant === "pass"
        ? "bg-green-500"
        : "bg-gray-500";

  return (
    <Div
      className={`rounded-lg border ${borderColor} bg-gray-950 overflow-hidden font-mono text-sm`}
    >
      <Div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-700/50">
        <Div className="flex gap-1.5">
          <Div className="w-3 h-3 rounded-full bg-red-500/80" />
          <Div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <Div className="w-3 h-3 rounded-full bg-green-500/80" />
        </Div>
        <Span className={`text-xs font-medium ${titleColor} ml-1`}>
          {title}
        </Span>
        <Div className={`w-2 h-2 rounded-full ${dotColor} ml-auto`} />
      </Div>
      <Pre className="p-4 overflow-x-auto text-gray-300 leading-relaxed">
        {lines.map((line, i) => (
          <Div key={i} className="whitespace-pre">
            {line}
          </Div>
        ))}
      </Pre>
    </Div>
  );
}

function BannedPattern({
  badCode,
  badRule,
  goodCode,
  bannedLabel,
  correctLabel,
}: {
  badCode: string;
  badRule: string;
  goodCode: string;
  bannedLabel: string;
  correctLabel: string;
}): JSX.Element {
  return (
    <Div className="space-y-2">
      <Div className="rounded-lg border border-red-500/40 bg-red-950/20 overflow-hidden">
        <Div className="flex items-center gap-2 px-3 py-1.5 bg-red-900/30 border-b border-red-500/30">
          <XCircle className="h-3.5 w-3.5 text-red-400" />
          <Span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            {bannedLabel}
          </Span>
          <Span className="text-xs text-red-400/60 ml-auto">{badRule}</Span>
        </Div>
        <Pre className="p-3 text-sm font-mono text-red-300/90">{badCode}</Pre>
      </Div>
      <Div className="rounded-lg border border-green-500/40 bg-green-950/20 overflow-hidden">
        <Div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/30 border-b border-green-500/30">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
          <Span className="text-xs font-bold text-green-400 uppercase tracking-wider">
            {correctLabel}
          </Span>
        </Div>
        <Pre className="p-3 text-sm font-mono text-green-300/90">
          {goodCode}
        </Pre>
      </Div>
    </Div>
  );
}

function AnyInfectionDiagram({
  title,
  subtitle,
  unsafeLabel,
}: {
  title: string;
  subtitle: string;
  unsafeLabel: string;
}): JSX.Element {
  return (
    <Div className="rounded-xl border border-red-900/50 bg-gray-950 p-6">
      <H3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-1">
        {title}
      </H3>
      <P className="text-xs text-gray-500 mb-6">{subtitle}</P>
      <Div className="flex flex-col items-center gap-4">
        <Div className="px-6 py-3 rounded-lg border-2 border-red-500 bg-red-950/50 font-mono text-lg font-bold text-red-400">
          any
        </Div>
        <Div className="grid grid-cols-3 gap-3 w-full max-w-md">
          {["result", "transformed", "output"].map((name) => (
            <Div key={name} className="flex flex-col items-center gap-1">
              <Div className="w-px h-4 bg-red-500/50" />
              <Div className="w-full px-2 py-1.5 rounded border border-red-700/50 bg-red-950/30 font-mono text-xs text-center text-red-400/80">
                {name}
              </Div>
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                {unsafeLabel}
              </Badge>
            </Div>
          ))}
        </Div>
        <Div className="grid grid-cols-3 gap-3 w-full max-w-md">
          {["Component", "hook", "schema"].map((name) => (
            <Div key={name} className="flex flex-col items-center gap-1">
              <Div className="w-px h-4 bg-red-500/30" />
              <Div className="w-full px-2 py-1.5 rounded border border-red-800/40 bg-red-950/20 font-mono text-xs text-center text-red-500/60">
                {name}
              </Div>
              <Badge
                variant="destructive"
                className="text-[10px] px-1.5 py-0 opacity-70"
              >
                {unsafeLabel}
              </Badge>
            </Div>
          ))}
        </Div>
      </Div>
    </Div>
  );
}

function CheckerArchitectureDiagram({
  parallelLabel,
  unifiedErrorsTitle,
  unifiedErrorsDesc,
}: {
  parallelLabel: string;
  unifiedErrorsTitle: string;
  unifiedErrorsDesc: string;
}): JSX.Element {
  const tools = [
    {
      name: "Oxlint",
      color: "border-orange-500/50 bg-orange-950/20 text-orange-400",
      dot: "bg-orange-400",
      desc: "Rust-based • milliseconds",
    },
    {
      name: "ESLint",
      color: "border-yellow-500/50 bg-yellow-950/20 text-yellow-400",
      dot: "bg-yellow-400",
      desc: "React rules • imports",
    },
    {
      name: "TypeScript",
      color: "border-blue-500/50 bg-blue-950/20 text-blue-400",
      dot: "bg-blue-400",
      desc: "Full graph • all files",
    },
  ];

  return (
    <Div className="rounded-xl border border-gray-700/50 bg-gray-950 p-6">
      <Div className="grid grid-cols-3 gap-3 mb-4">
        {tools.map((tool) => (
          <Div
            key={tool.name}
            className={`rounded-lg border p-3 text-center ${tool.color}`}
          >
            <Div className={`w-2 h-2 rounded-full ${tool.dot} mx-auto mb-2`} />
            <P className="font-mono font-bold text-sm">{tool.name}</P>
            <P className="text-[10px] opacity-60 mt-1">{tool.desc}</P>
          </Div>
        ))}
      </Div>
      <Div className="flex items-center justify-center gap-2 mb-3">
        <Div className="h-px flex-1 bg-gray-700/50" />
        <Span className="text-xs text-gray-500 px-2">{parallelLabel}</Span>
        <Div className="h-px flex-1 bg-gray-700/50" />
      </Div>
      <Div className="rounded-lg border border-green-500/40 bg-green-950/20 p-3 text-center">
        <CheckCircle2 className="h-5 w-5 text-green-400 mx-auto mb-1" />
        <P className="font-semibold text-green-400 text-sm">
          {unifiedErrorsTitle}
        </P>
        <P className="text-xs text-green-400/60 mt-0.5">{unifiedErrorsDesc}</P>
      </Div>
    </Div>
  );
}

function EndpointFlowDiagram({
  sourceLabel,
  webLabel,
  hookLabel,
  cliLabel,
  aiLabel,
  sameSchemaLabel,
  inferredLabel,
  generatedLabel,
}: {
  sourceLabel: string;
  webLabel: string;
  hookLabel: string;
  cliLabel: string;
  aiLabel: string;
  sameSchemaLabel: string;
  inferredLabel: string;
  generatedLabel: string;
}): JSX.Element {
  const consumers = [
    {
      label: webLabel,
      badge: sameSchemaLabel,
      color: "border-blue-500/40 bg-blue-950/20 text-blue-400",
    },
    {
      label: hookLabel,
      badge: inferredLabel,
      color: "border-purple-500/40 bg-purple-950/20 text-purple-400",
    },
    {
      label: cliLabel,
      badge: generatedLabel,
      color: "border-green-500/40 bg-green-950/20 text-green-400",
    },
    {
      label: aiLabel,
      badge: generatedLabel,
      color: "border-orange-500/40 bg-orange-950/20 text-orange-400",
    },
  ];

  return (
    <Div className="rounded-xl border border-gray-700/50 bg-gray-950 p-6">
      <Div className="text-center mb-6">
        <Div className="inline-block px-4 py-2 rounded-lg border border-yellow-500/50 bg-yellow-950/20 font-mono text-sm text-yellow-400 font-semibold">
          {sourceLabel}
        </Div>
      </Div>
      <Div className="flex justify-center mb-6">
        <Div className="flex gap-8 items-start justify-center">
          {consumers.map((c, i) => (
            <Div key={i} className="flex flex-col items-center gap-2">
              <Div className="w-px h-6 bg-gray-600/50" />
              <Div
                className={`rounded-lg border px-3 py-2 text-center min-w-28 ${c.color}`}
              >
                <P className="text-xs font-semibold">{c.label}</P>
                <Span className="text-[10px] opacity-60">{c.badge}</Span>
              </Div>
            </Div>
          ))}
        </Div>
      </Div>
    </Div>
  );
}

function DemoRound({
  roundNumber,
  title,
  description,
  result,
  codeBlock,
  errorLines,
  passLines,
  errorTitle,
  passTitle,
  insight,
}: {
  roundNumber: number;
  title: string;
  description: string;
  result: string;
  codeBlock: string;
  errorLines?: string[];
  passLines?: string[];
  errorTitle: string;
  passTitle: string;
  insight?: string;
}): JSX.Element {
  const roundColors = [
    "border-red-500/50 bg-red-950/20 text-red-400",
    "border-yellow-500/50 bg-yellow-950/20 text-yellow-400",
    "border-green-500/50 bg-green-950/20 text-green-400",
  ];
  const colorClass = roundColors[roundNumber - 1] ?? roundColors[0];

  return (
    <Div className="space-y-4">
      <Div className="flex items-center gap-3">
        <Div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${colorClass}`}
        >
          {roundNumber}
        </Div>
        <H3 className="font-bold text-lg">{title}</H3>
      </Div>
      <P className="text-muted-foreground">{description}</P>
      <P className="text-sm text-gray-400">{result}</P>
      <TerminalBlock
        title="code"
        variant="neutral"
        lines={codeBlock.split("\n")}
      />
      {errorLines !== undefined ? (
        <TerminalBlock title={errorTitle} variant="error" lines={errorLines} />
      ) : null}
      {passLines !== undefined ? (
        <TerminalBlock title={passTitle} variant="pass" lines={passLines} />
      ) : null}
      {insight !== undefined && insight !== "" ? (
        <Div className="pl-4 border-l-2 border-gray-600">
          <P className="text-sm text-gray-400 italic">{insight}</P>
        </Div>
      ) : null}
    </Div>
  );
}

export function TanstackPage({ locale }: TypeCheckerPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero - dark/red danger theme */}
      <Div className="relative bg-linear-to-br from-gray-950 via-red-950/30 to-gray-950 border-b border-red-900/30">
        <Div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" />
        <Div className="container mx-auto px-4 py-20 relative z-10 max-w-4xl">
          <Link
            href={`/${locale}/story/blog`}
            className="inline-flex items-center text-sm text-gray-400 hover:text-gray-200 mb-10 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("closing.backToBlog")}
          </Link>

          <Div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge
              variant="destructive"
              className="text-xs font-semibold uppercase tracking-wider"
            >
              {t("hero.label")}
            </Badge>
            <Span className="text-xs text-gray-500">{t("hero.readTime")}</Span>
          </Div>

          <H1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-white leading-tight">
            {t("hero.title")}
          </H1>

          <P className="text-xl text-gray-300 leading-relaxed mb-8 max-w-3xl">
            {t("hero.subtitle")}
          </P>

          {/* Pull quote */}
          <Div className="relative pl-6 border-l-4 border-red-500">
            <P className="text-lg text-red-300 italic font-medium">
              {t("hero.quoteAiLies")}
            </P>
          </Div>
        </Div>
      </Div>

      <Div className="container mx-auto px-4 py-16 max-w-4xl space-y-24">
        {/* Section 1: The broken feedback loop */}
        <Div className="space-y-8">
          <H2 className="text-3xl font-bold text-white">
            {t("problem.title")}
          </H2>
          <P className="text-lg text-gray-300 leading-relaxed">
            {t("problem.description")}
          </P>

          <Div className="rounded-xl border border-red-900/40 bg-red-950/10 p-6">
            <P className="text-red-300 font-semibold mb-2">
              {t("problem.fixLabel")}
            </P>
            <P className="text-gray-400">{t("problem.fixDescription")}</P>
          </Div>

          <P className="text-gray-300 leading-relaxed">
            {t("problem.escapeHatch")}
          </P>

          <TerminalBlock
            title="escape-hatch.ts"
            variant="error"
            lines={["const result = data as unknown as MyExpectedType;"]}
          />

          <P className="text-gray-400 italic">{t("problem.smokeDetector")}</P>

          <Div className="text-center py-6">
            <P className="text-xl font-bold text-white">
              {t("problem.introducingChecker")}
            </P>
          </Div>
        </Div>

        <Separator className="border-gray-800" />

        {/* Section 2: The `any` problem */}
        <Div className="space-y-8">
          <Div>
            <H2 className="text-3xl font-bold text-white mb-2">
              {t("anyProblem.title")}
            </H2>
            <P className="text-gray-500 text-lg">{t("anyProblem.subtitle")}</P>
          </Div>

          <AnyInfectionDiagram
            title={t("anyProblem.infectionDiagramTitle")}
            subtitle={t("anyProblem.infectionDiagramSubtitle")}
            unsafeLabel={t("anyProblem.infectionUnsafe")}
          />

          <P className="text-gray-300 leading-relaxed">
            {t("anyProblem.graphDescription")}
          </P>

          <Div className="rounded-xl border border-red-800/50 bg-red-950/20 p-6">
            <P className="text-2xl font-black text-red-400 mb-3">
              {t("anyProblem.holeInGraph")}
            </P>
            <P className="text-gray-300 leading-relaxed">
              {t("anyProblem.holeDescription")}
            </P>
          </Div>

          {/* Two counters */}
          <Div className="grid grid-cols-2 gap-4">
            <Card className="bg-green-950/20 border-green-700/30">
              <CardContent className="pt-6 text-center">
                <P className="text-4xl font-black text-green-400 mb-1">0</P>
                <P className="text-sm text-gray-400">
                  {t("anyProblem.counterZeroErrors")}
                </P>
              </CardContent>
            </Card>
            <Card className="bg-red-950/20 border-red-700/30">
              <CardContent className="pt-6 text-center">
                <P className="text-4xl font-black text-red-400 mb-1">47</P>
                <P className="text-sm text-gray-400">
                  {t("anyProblem.counterAnyUsages")}
                </P>
              </CardContent>
            </Card>
          </Div>

          <Div className="rounded-xl border border-red-900/50 bg-gray-950 p-6">
            <P className="text-xl font-bold text-white mb-3">
              {t("anyProblem.zeroErrors")}
            </P>
            <P className="text-gray-400">
              {t("anyProblem.zeroErrorsDescription")}
            </P>
          </Div>

          <P className="text-gray-300 leading-relaxed">
            {t("anyProblem.doubleAssertion")}
          </P>

          {/* Banned patterns list */}
          <Div className="space-y-3">
            <P className="font-semibold text-gray-300">
              {t("anyProblem.bannedTitle")}
            </P>
            {[
              { pattern: "any", rule: "typescript/no-explicit-any" },
              {
                pattern: "as unknown as",
                rule: "typescript/no-unsafe-assignment",
              },
              {
                pattern: "@ts-expect-error",
                rule: "typescript/ban-ts-comment",
              },
              { pattern: "throw", rule: "restricted-syntax (custom)" },
              {
                pattern: "bare unknown type",
                rule: "restricted-syntax (custom)",
              },
              {
                pattern: "bare object type",
                rule: "restricted-syntax (custom)",
              },
            ].map(({ pattern, rule }) => (
              <Div
                key={pattern}
                className="flex items-center justify-between rounded-lg border border-red-900/30 bg-red-950/10 px-4 py-3"
              >
                <Span className="font-mono text-sm text-red-300">
                  {pattern}
                </Span>
                <Span className="text-xs text-gray-500">{rule}</Span>
                <Badge variant="destructive" className="text-[10px]">
                  error
                </Badge>
              </Div>
            ))}
          </Div>

          <Div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-6">
            <P className="font-bold text-white mb-2">
              {t("anyProblem.bannedNotWarnings")}
            </P>
            <P className="text-gray-400 text-sm">
              {t("anyProblem.psychologyNote")}
            </P>
          </Div>
        </Div>

        <Separator className="border-gray-800" />

        {/* Section 3: @next-vibe/checker */}
        <Div className="space-y-8">
          <Div>
            <H2 className="text-3xl font-bold text-white mb-2">
              {t("checker.title")}
            </H2>
            <P className="text-gray-500 text-lg">{t("checker.subtitle")}</P>
          </Div>

          <TerminalBlock
            title="terminal"
            variant="neutral"
            lines={["$ vibe check"]}
          />

          <P className="text-gray-300 leading-relaxed">
            {t("checker.commandDescription")}
          </P>

          <Div className="space-y-3">
            {[
              {
                name: "Oxlint",
                desc: t("checker.oxlintDescription"),
                color: "border-orange-500/40 bg-orange-950/10",
                textColor: "text-orange-400",
              },
              {
                name: "ESLint",
                desc: t("checker.eslintDescription"),
                color: "border-yellow-500/40 bg-yellow-950/10",
                textColor: "text-yellow-400",
              },
              {
                name: "TypeScript",
                desc: t("checker.tsDescription"),
                color: "border-blue-500/40 bg-blue-950/10",
                textColor: "text-blue-400",
              },
            ].map(({ name, desc, color, textColor }) => (
              <Div
                key={name}
                className={`flex items-start gap-3 rounded-lg border p-4 ${color}`}
              >
                <Zap className={`h-5 w-5 mt-0.5 flex-shrink-0 ${textColor}`} />
                <Div>
                  <P className={`font-bold font-mono ${textColor}`}>{name}</P>
                  <P className="text-sm text-gray-400 mt-0.5">{desc}</P>
                </Div>
              </Div>
            ))}
          </Div>

          <CheckerArchitectureDiagram
            parallelLabel={t("checker.parallel")}
            unifiedErrorsTitle={t("checker.unifiedErrors")}
            unifiedErrorsDesc={t("checker.unifiedErrorsDescription")}
          />

          <Div className="space-y-2">
            <P className="text-gray-300">{t("checker.parallelNote")}</P>
            <P className="text-gray-400 text-sm">{t("checker.timingNote")}</P>
          </Div>

          <Div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-5">
            <Div className="flex items-center gap-2 mb-2">
              <Terminal className="h-4 w-4 text-gray-400" />
              <P className="text-sm font-semibold text-gray-300">
                {t("checker.mcpIntegrationTitle")}
              </P>
            </Div>
            <P className="text-sm text-gray-400">{t("checker.mcpNote")}</P>
          </Div>
        </Div>

        <Separator className="border-gray-800" />

        {/* Section 4: Custom plugins */}
        <Div className="space-y-8">
          <Div>
            <H2 className="text-3xl font-bold text-white mb-2">
              {t("plugins.title")}
            </H2>
            <P className="text-xl text-gray-300 font-medium">
              {t("plugins.linterIsDocumentation")}
            </P>
          </Div>

          {/* jsx-capitalization plugin */}
          <Card className="border-gray-700/50 bg-gray-900/50">
            <CardHeader>
              <Div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-400" />
                <CardTitle className="font-mono text-blue-400">
                  {t("plugins.jsxPluginTitle")}
                </CardTitle>
              </Div>
            </CardHeader>
            <CardContent className="space-y-4">
              <P className="text-gray-400">
                {t("plugins.jsxPluginDescription")}
              </P>
              <Div className="space-y-2">
                {[
                  {
                    error:
                      "Use platform-independent <Button> component instead of <button>.",
                    fix: 'import { Button } from "next-vibe-ui/ui/button";',
                  },
                  {
                    error:
                      "Use platform-independent <Link> component instead of <a>.",
                    fix: 'import { Link } from "next-vibe-ui/ui/link";',
                  },
                  {
                    error: "Use typography component <P> instead of <p>.",
                    fix: 'import { P } from "next-vibe-ui/ui/typography";',
                  },
                ].map(({ error, fix }) => (
                  <Div
                    key={fix}
                    className="rounded-lg border border-blue-900/40 bg-blue-950/10 p-3 font-mono text-xs"
                  >
                    <P className="text-yellow-400 mb-1">{error}</P>
                    <P className="text-blue-300">{fix}</P>
                  </Div>
                ))}
              </Div>
              <Div className="pl-4 border-l-2 border-blue-500/50">
                <P className="text-sm text-gray-400">
                  {t("plugins.jsxPluginInsight")}
                </P>
              </Div>
            </CardContent>
          </Card>

          {/* restricted-syntax plugin */}
          <Card className="border-gray-700/50 bg-gray-900/50">
            <CardHeader>
              <Div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <CardTitle className="font-mono text-red-400">
                  {t("plugins.restrictedSyntaxTitle")}
                </CardTitle>
              </Div>
              <P className="text-sm text-gray-500">
                {t("plugins.restrictedSyntaxDescription")}
              </P>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  title: t("plugins.throwBanTitle"),
                  desc: t("plugins.throwBanDescription"),
                  errorMsg:
                    "restricted-syntax: Use proper `ResponseType<T>` patterns instead.",
                },
                {
                  title: t("plugins.unknownBanTitle"),
                  desc: t("plugins.unknownBanDescription"),
                  errorMsg:
                    "restricted-syntax: Replace 'unknown' with existing typed interface. Align with codebase types rather than converting or recreating.",
                },
                {
                  title: t("plugins.objectBanTitle"),
                  desc: t("plugins.objectBanDescription"),
                  errorMsg:
                    "restricted-syntax: Replace 'object' with a specific interface or Record<string, T>.",
                },
              ].map(({ title, desc, errorMsg }) => (
                <Div key={title} className="space-y-2">
                  <P className="font-semibold text-white font-mono">{title}</P>
                  <Div className="rounded border border-red-900/40 bg-red-950/10 px-3 py-2 font-mono text-xs text-red-300">
                    {errorMsg}
                  </Div>
                  <P className="text-sm text-gray-400">{desc}</P>
                </Div>
              ))}
            </CardContent>
          </Card>

          {/* Banned patterns showcase */}
          <Div className="space-y-4">
            <Div>
              <H3 className="text-lg font-bold text-white mb-1">
                {t("plugins.bannedPatternsTitle")}
              </H3>
              <P className="text-sm text-gray-500">
                {t("plugins.bannedPatternsSubtitle")}
              </P>
            </Div>

            <BannedPattern
              bannedLabel={t("plugins.bannedLabel")}
              correctLabel={t("plugins.correctLabel")}
              badCode={`const result = response as unknown as MyType; // caught: restricted-syntax`}
              badRule="restricted-syntax"
              goodCode={`const result: MyType = parseResponse(response); // typed properly`}
            />

            <BannedPattern
              bannedLabel={t("plugins.bannedLabel")}
              correctLabel={t("plugins.correctLabel")}
              badCode={`function foo(x: any): any { return x.data; } // caught: typescript/no-explicit-any`}
              badRule="typescript/no-explicit-any"
              goodCode={`function foo<T>(response: ResponseType<T>): T | null {\n  if (!response.success) return null;\n  return response.data;\n}`}
            />

            <BannedPattern
              bannedLabel={t("plugins.bannedLabel")}
              correctLabel={t("plugins.correctLabel")}
              badCode={`throw new Error("Something failed"); // caught: restricted-syntax`}
              badRule="restricted-syntax"
              goodCode={`return fail({\n  message: t("errors.server.title"),\n  errorType: ErrorResponseTypes.INTERNAL_ERROR,\n});`}
            />
          </Div>
        </Div>

        <Separator className="border-gray-800" />

        {/* Section 5: Live demo */}
        <Div className="space-y-8">
          <Div>
            <H2 className="text-3xl font-bold text-white mb-2">
              {t("demo.title")}
            </H2>
            <P className="text-gray-500">{t("demo.subtitle")}</P>
          </Div>

          <DemoRound
            roundNumber={1}
            title={t("demo.round1Title")}
            description={t("demo.round1Description")}
            result={t("demo.round1Result")}
            codeBlock={`export function parseApiResponse(response: any): any {\n  return response.data;\n}`}
            errorLines={[
              "src/lib/parse-api-response.ts",
              "  1:37  error  Unexpected any. Specify a different type.  typescript/no-explicit-any",
              "  1:44  error  Unexpected any. Specify a different type.  typescript/no-explicit-any",
              "",
              "2 errors found.",
            ]}
            errorTitle={t("demo.errorTitle")}
            passTitle={t("demo.passTitle")}
          />

          <Div className="h-px bg-gray-800" />

          <DemoRound
            roundNumber={2}
            title={t("demo.round2Title")}
            description={t("demo.round2Description")}
            result={t("demo.round2Result")}
            codeBlock={`export function parseApiResponse(response: unknown): unknown {\n  return (response as Record<string, unknown>).data;\n}`}
            errorLines={[
              "src/lib/parse-api-response.ts",
              "  1:37  error  Replace 'unknown' with existing typed interface.  restricted-syntax",
              "  1:44  error  Replace 'unknown' with existing typed interface.  restricted-syntax",
              "  1:56  error  Replace 'unknown' with existing typed interface.  restricted-syntax",
              "",
              "3 errors found.",
            ]}
            errorTitle={t("demo.errorTitle")}
            passTitle={t("demo.passTitle")}
          />

          <Div className="h-px bg-gray-800" />

          <DemoRound
            roundNumber={3}
            title={t("demo.round3Title")}
            description={t("demo.round3Description")}
            result={t("demo.round3Result")}
            codeBlock={`import type { ResponseType } from "@/app/api/[locale]/next-vibe/response-type";\n\nexport function parseApiResponse<T>(response: ResponseType<T>): T | null {\n  if (!response.success) {\n    return null;\n  }\n  return response.data;\n}`}
            passLines={[
              "  Oxlint: 0 errors",
              "  ESLint: 0 errors",
              "  TypeScript: 0 errors",
              "",
              "0 errors found.",
            ]}
            errorTitle={t("demo.errorTitle")}
            passTitle={t("demo.passTitle")}
            insight={t("demo.round3Insight")}
          />
        </Div>

        <Separator className="border-gray-800" />

        {/* Section 6: The endpoint connection */}
        <Div className="space-y-8">
          <Div>
            <H2 className="text-3xl font-bold text-white mb-2">
              {t("endpoint.title")}
            </H2>
            <P className="text-gray-500 text-lg">{t("endpoint.subtitle")}</P>
          </Div>

          <P className="text-gray-300 leading-relaxed">
            {t("endpoint.description")}
          </P>

          <EndpointFlowDiagram
            sourceLabel={t("endpoint.diagramSource")}
            webLabel={t("endpoint.diagramWebApi")}
            hookLabel={t("endpoint.diagramHookTypes")}
            cliLabel={t("endpoint.diagramCliFlags")}
            aiLabel={t("endpoint.diagramAiSchema")}
            sameSchemaLabel={t("endpoint.diagramSameSchema")}
            inferredLabel={t("endpoint.diagramInferred")}
            generatedLabel={t("endpoint.diagramGenerated")}
          />

          <Div className="space-y-2">
            <P className="text-gray-300">{t("endpoint.schemaBecomes")}</P>
            <TerminalBlock
              title="definition.ts"
              variant="neutral"
              lines={[
                `name: requestField(st, {`,
                `  schema: z.string().min(1).max(255),`,
                `  label: "name",`,
                `  description: "description",`,
                `  placeholder: "placeholder",`,
                `}),`,
              ]}
            />
          </Div>

          <Div className="grid sm:grid-cols-2 gap-3">
            {[
              t("endpoint.webApiValidation"),
              t("endpoint.reactHookTypes"),
              t("endpoint.cliFlagsDescription"),
              t("endpoint.aiToolSchema"),
            ].map((item) => (
              <Div
                key={item}
                className="flex items-start gap-2 rounded-lg border border-gray-700/50 bg-gray-900/50 p-3"
              >
                <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <P className="text-sm text-gray-300">{item}</P>
              </Div>
            ))}
          </Div>

          <Div className="rounded-xl border border-yellow-900/40 bg-yellow-950/10 p-6">
            <P className="text-yellow-300 font-semibold mb-2">
              {t("endpoint.driftProblem")}
            </P>
          </Div>

          <Div className="text-center py-4">
            <P className="text-2xl font-black text-white">
              {t("endpoint.oneSchemaSolution")}
            </P>
          </Div>

          <P className="text-gray-400 text-sm">
            {t("endpoint.typecheckedNote")}
          </P>

          {/* Stats */}
          <Div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-6">
            <H3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {t("endpoint.statsTitle")}
            </H3>
            <Div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  value: "245",
                  label: t("endpoint.stat245"),
                  color: "text-blue-400",
                },
                {
                  value: "0",
                  label: t("endpoint.stat0any"),
                  color: "text-green-400",
                },
                {
                  value: "0",
                  label: t("endpoint.stat0unknown"),
                  color: "text-green-400",
                },
                {
                  value: "0",
                  label: t("endpoint.stat0tsExpect"),
                  color: "text-green-400",
                },
              ].map(({ value, label, color }) => (
                <Div key={label} className="text-center">
                  <P className={`text-3xl font-black ${color}`}>{value}</P>
                  <P className="text-xs text-gray-500 mt-1">{label}</P>
                </Div>
              ))}
            </Div>
            <P className="text-center text-sm text-gray-500 mt-4">
              {t("endpoint.statNote")}
            </P>
          </Div>
        </Div>

        <Separator className="border-gray-800" />

        {/* Section 7: Install */}
        <Div className="space-y-8">
          <Div>
            <H2 className="text-3xl font-bold text-white mb-2">
              {t("install.title")}
            </H2>
            <P className="text-gray-500 text-lg">{t("install.subtitle")}</P>
          </Div>

          <P className="text-gray-300">{t("install.installDescription")}</P>

          <TerminalBlock
            title="install"
            variant="neutral"
            lines={[
              "bun add -D @next-vibe/checker",
              "# or",
              "npm install -D @next-vibe/checker",
            ]}
          />

          <P className="text-gray-400">{t("install.thenRun")}</P>

          <TerminalBlock
            title="commands"
            variant="neutral"
            lines={[
              "vibe-check config    # scaffold check.config.ts",
              "vibe-check           # run all checks",
              "vibe-check --fix     # auto-fix linting issues",
            ]}
          />

          <Card className="border-gray-700/50 bg-gray-900/50">
            <CardHeader>
              <Div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-green-400" />
                <CardTitle className="text-green-400">
                  {t("install.mcpTitle")}
                </CardTitle>
              </Div>
            </CardHeader>
            <CardContent className="space-y-3">
              <P className="text-sm text-gray-400">
                {t("install.mcpDescription")}
              </P>
              <TerminalBlock
                title="claude_desktop_config.json"
                variant="neutral"
                lines={[
                  `{`,
                  `  "mcpServers": {`,
                  `    "vibe-check": {`,
                  `      "command": "vibe-check",`,
                  `      "args": ["mcp"],`,
                  `      "env": {`,
                  `        "PROJECT_ROOT": "/path/to/your/project"`,
                  `      }`,
                  `    }`,
                  `  }`,
                  `}`,
                ]}
              />
            </CardContent>
          </Card>

          <P className="text-sm text-gray-500">{t("install.migrationNote")}</P>

          <P className="text-sm text-gray-500">{t("install.openSourceNote")}</P>
        </Div>

        <Separator className="border-gray-800" />

        {/* Closing */}
        <Div className="space-y-8">
          <H2 className="text-3xl font-bold text-white">
            {t("closing.title")}
          </H2>

          <Div className="grid sm:grid-cols-2 gap-6">
            <Div className="rounded-xl border border-red-900/40 bg-red-950/10 p-6">
              <P className="font-bold text-red-400 mb-3">
                {t("closing.beforeTitle")}
              </P>
              <P className="text-sm text-gray-400 leading-relaxed">
                {t("closing.beforeDescription")}
              </P>
            </Div>
            <Div className="rounded-xl border border-green-900/40 bg-green-950/10 p-6">
              <P className="font-bold text-green-400 mb-3">
                {t("closing.afterTitle")}
              </P>
              <P className="text-sm text-gray-400 leading-relaxed">
                {t("closing.afterDescription")}
              </P>
            </Div>
          </Div>

          {/* Final quote */}
          <Div className="rounded-xl border border-gray-600/50 bg-gray-900/50 p-8 text-center">
            <P className="text-2xl font-black text-white leading-tight">
              {t("closing.finalQuote")}
            </P>
          </Div>

          <Div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link
              href="https://github.com/techfreaque/next-vibe"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800 hover:bg-gray-700 px-6 py-3 text-sm font-medium text-white transition-colors"
            >
              {t("closing.ctaGitHub")}
            </Link>
            <Link
              href="https://www.npmjs.com/package/@next-vibe/checker"
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-500 px-6 py-3 text-sm font-bold text-white transition-colors"
            >
              {t("closing.ctaInstall")}
            </Link>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

export default async function TypeCheckerBlogPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
