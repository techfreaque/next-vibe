/* eslint-disable oxlint-plugin-i18n/no-literal-string -- code examples are not user-facing text */
import type { Metadata } from "next";
import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle2 } from "next-vibe-ui/ui/icons/CheckCircle2";
import { XCircle } from "next-vibe-ui/ui/icons/XCircle";
import { Link } from "next-vibe-ui/ui/link";
import { CodeBlock } from "next-vibe-ui/ui/markdown";
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

function BadGood({
  bad,
  good,
  rule,
  bannedLabel,
  correctLabel,
}: {
  bad: string;
  good: string;
  rule: string;
  bannedLabel: string;
  correctLabel: string;
}): JSX.Element {
  return (
    <Div className="grid md:grid-cols-2 gap-3">
      <Div className="rounded-lg border border-red-300 dark:border-red-800/60 overflow-hidden">
        <Div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-800/40">
          <XCircle className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
          <Span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
            {bannedLabel}
          </Span>
          <Span className="text-xs text-red-400/60 ml-auto">{rule}</Span>
        </Div>
        <CodeBlock language="typescript" code={bad} />
      </Div>
      <Div className="rounded-lg border border-green-300 dark:border-green-800/60 overflow-hidden">
        <Div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950/40 border-b border-green-200 dark:border-green-800/40">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
          <Span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
            {correctLabel}
          </Span>
        </Div>
        <CodeBlock language="typescript" code={good} />
      </Div>
    </Div>
  );
}

export function TanstackPage({ locale }: TypeCheckerPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="min-h-screen bg-background">
      {/* Hero */}
      <Div className="relative border-b bg-gradient-to-b from-red-50/50 dark:from-red-950/20 to-background">
        <Div className="container mx-auto px-4 py-20 max-w-4xl">
          <Link
            href={`/${locale}/story/blog`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("closing.backToBlog")}
          </Link>

          <Div className="flex items-center gap-3 mb-6">
            <Badge
              variant="destructive"
              className="text-xs font-semibold uppercase tracking-wider"
            >
              {t("hero.label")}
            </Badge>
            <Span className="text-xs text-muted-foreground">
              {t("hero.readTime")}
            </Span>
          </Div>

          <H1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
            {t("hero.title")}
          </H1>
          <P className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl">
            {t("hero.subtitle")}
          </P>

          <Div className="pl-6 border-l-4 border-red-500">
            <P className="text-lg text-red-600 dark:text-red-400 italic font-medium">
              {t("hero.quoteAiLies")}
            </P>
          </Div>
        </Div>
      </Div>

      <Div className="container mx-auto px-4 py-16 max-w-4xl space-y-20">
        {/* The broken feedback loop */}
        <Div className="space-y-6">
          <H2 className="text-3xl font-bold">{t("problem.title")}</H2>
          <P className="text-lg text-muted-foreground leading-relaxed">
            {t("problem.description")}
          </P>

          <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <P className="font-semibold text-red-700 dark:text-red-400 mb-1">
                {t("problem.fixLabel")}
              </P>
              <P className="text-muted-foreground">
                {t("problem.fixDescription")}
              </P>
            </CardContent>
          </Card>

          <P className="text-muted-foreground leading-relaxed">
            {t("problem.escapeHatch")}
          </P>

          <CodeBlock
            language="typescript"
            code="const result = data as unknown as MyExpectedType;"
          />

          <P className="text-muted-foreground italic">
            {t("problem.smokeDetector")}
          </P>

          <P className="text-center text-xl font-bold py-4">
            {t("problem.introducingChecker")}
          </P>
        </Div>

        <Separator />

        {/* The `any` problem */}
        <Div className="space-y-6">
          <Div>
            <H2 className="text-3xl font-bold mb-2">{t("anyProblem.title")}</H2>
            <P className="text-lg text-muted-foreground">
              {t("anyProblem.subtitle")}
            </P>
          </Div>

          <P className="text-muted-foreground leading-relaxed">
            {t("anyProblem.graphDescription")}
          </P>

          {/* any infection - compact visual */}
          <Div className="rounded-xl border border-red-200 dark:border-red-900/50 p-6 text-center">
            <Span className="inline-block px-6 py-3 rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/50 font-mono text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              any
            </Span>
            <Div className="flex justify-center gap-2 mb-2">
              {["result", "transformed", "output"].map((n) => (
                <Div key={n} className="flex flex-col items-center gap-1">
                  <Div className="w-px h-4 bg-red-300 dark:bg-red-700" />
                  <Span className="px-3 py-1 rounded border border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/30 font-mono text-xs text-red-500 dark:text-red-400/80">
                    {n}
                  </Span>
                </Div>
              ))}
            </Div>
            <Div className="flex justify-center gap-2">
              {["Component", "hook", "schema"].map((n) => (
                <Div key={n} className="flex flex-col items-center gap-1">
                  <Div className="w-px h-4 bg-red-200 dark:bg-red-800/50" />
                  <Span className="px-3 py-1 rounded border border-red-100 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/20 font-mono text-xs text-red-400/70">
                    {n}
                  </Span>
                </Div>
              ))}
            </Div>
            <P className="text-xs text-red-500/60 mt-3">
              {t("anyProblem.infectionDiagramSubtitle")}
            </P>
          </Div>

          <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <P className="text-2xl font-black text-red-600 dark:text-red-400 mb-2">
                {t("anyProblem.holeInGraph")}
              </P>
              <P className="text-muted-foreground leading-relaxed">
                {t("anyProblem.holeDescription")}
              </P>
            </CardContent>
          </Card>

          {/* Counters */}
          <Div className="grid grid-cols-2 gap-4">
            <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/40">
              <CardContent className="pt-6 text-center">
                <P className="text-4xl font-black text-green-600 dark:text-green-400">
                  0
                </P>
                <P className="text-sm text-muted-foreground">
                  {t("anyProblem.counterZeroErrors")}
                </P>
              </CardContent>
            </Card>
            <Card className="bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40">
              <CardContent className="pt-6 text-center">
                <P className="text-4xl font-black text-red-600 dark:text-red-400">
                  47
                </P>
                <P className="text-sm text-muted-foreground">
                  {t("anyProblem.counterAnyUsages")}
                </P>
              </CardContent>
            </Card>
          </Div>

          <P className="text-muted-foreground leading-relaxed">
            {t("anyProblem.zeroErrors")}
          </P>
          <P className="text-muted-foreground">
            {t("anyProblem.doubleAssertion")}
          </P>

          {/* Banned patterns - compact list */}
          <Div>
            <P className="font-semibold mb-3">{t("anyProblem.bannedTitle")}</P>
            <Div className="grid sm:grid-cols-2 gap-2">
              {[
                { pattern: "any", rule: "no-explicit-any" },
                { pattern: "as unknown as", rule: "no-unsafe-assignment" },
                { pattern: "@ts-expect-error", rule: "ban-ts-comment" },
                { pattern: "throw", rule: "restricted-syntax" },
                { pattern: "unknown", rule: "restricted-syntax" },
                { pattern: "object", rule: "restricted-syntax" },
              ].map(({ pattern, rule }) => (
                <Div
                  key={pattern}
                  className="flex items-center justify-between rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10 px-3 py-2"
                >
                  <Span className="font-mono text-sm text-red-600 dark:text-red-400">
                    {pattern}
                  </Span>
                  <Span className="text-xs text-muted-foreground">{rule}</Span>
                </Div>
              ))}
            </Div>
          </Div>

          <Div className="pl-4 border-l-2 border-muted-foreground/30">
            <P className="font-semibold mb-1">
              {t("anyProblem.bannedNotWarnings")}
            </P>
            <P className="text-sm text-muted-foreground">
              {t("anyProblem.psychologyNote")}
            </P>
          </Div>
        </Div>

        <Separator />

        {/* @next-vibe/checker */}
        <Div className="space-y-6">
          <Div>
            <H2 className="text-3xl font-bold mb-2">{t("checker.title")}</H2>
            <P className="text-lg text-muted-foreground">
              {t("checker.subtitle")}
            </P>
          </Div>

          <CodeBlock language="bash" code="$ vibe check" />

          <P className="text-muted-foreground leading-relaxed">
            {t("checker.commandDescription")}
          </P>

          {/* Three tools - compact row */}
          <Div className="grid grid-cols-3 gap-3">
            {[
              {
                name: "Oxlint",
                desc: t("checker.oxlintDescription"),
                color:
                  "border-orange-200 dark:border-orange-800/50 bg-orange-50/50 dark:bg-orange-950/20",
                text: "text-orange-600 dark:text-orange-400",
              },
              {
                name: "ESLint",
                desc: t("checker.eslintDescription"),
                color:
                  "border-yellow-200 dark:border-yellow-800/50 bg-yellow-50/50 dark:bg-yellow-950/20",
                text: "text-yellow-600 dark:text-yellow-400",
              },
              {
                name: "TypeScript",
                desc: t("checker.tsDescription"),
                color:
                  "border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/20",
                text: "text-blue-600 dark:text-blue-400",
              },
            ].map(({ name, desc, color, text }) => (
              <Card key={name} className={color}>
                <CardContent className="pt-4 pb-4">
                  <P className={`font-mono font-bold text-sm ${text} mb-1`}>
                    {name}
                  </P>
                  <P className="text-xs text-muted-foreground leading-snug">
                    {desc}
                  </P>
                </CardContent>
              </Card>
            ))}
          </Div>

          <Div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Div className="h-px flex-1 bg-border" />
            <Span>{t("checker.parallel")}</Span>
            <Div className="h-px flex-1 bg-border" />
          </Div>

          <Card className="border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-950/20 text-center">
            <CardContent className="pt-4 pb-4">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
              <P className="font-semibold text-green-700 dark:text-green-400 text-sm">
                {t("checker.unifiedErrors")}
              </P>
              <P className="text-xs text-muted-foreground">
                {t("checker.unifiedErrorsDescription")}
              </P>
            </CardContent>
          </Card>

          <P className="text-sm text-muted-foreground">
            {t("checker.timingNote")}
          </P>

          <Div className="pl-4 border-l-2 border-muted-foreground/30">
            <P className="text-sm text-muted-foreground">
              {t("checker.mcpNote")}
            </P>
          </Div>
        </Div>

        <Separator />

        {/* Custom plugins */}
        <Div className="space-y-6">
          <Div>
            <H2 className="text-3xl font-bold mb-2">{t("plugins.title")}</H2>
            <P className="text-lg font-medium text-muted-foreground">
              {t("plugins.linterIsDocumentation")}
            </P>
          </Div>

          {/* JSX capitalization */}
          <Div>
            <H3 className="font-mono font-bold mb-3">
              {t("plugins.jsxPluginTitle")}
            </H3>
            <P className="text-muted-foreground mb-4">
              {t("plugins.jsxPluginDescription")}
            </P>
            <Div className="space-y-1.5 mb-4">
              {[
                {
                  from: "<button>",
                  to: '<Button> from "next-vibe-ui/ui/button"',
                },
                { from: "<a>", to: '<Link> from "next-vibe-ui/ui/link"' },
                { from: "<p>", to: '<P> from "next-vibe-ui/ui/typography"' },
              ].map(({ from, to }) => (
                <Div
                  key={from}
                  className="flex items-center gap-3 text-sm font-mono"
                >
                  <Span className="text-red-500 dark:text-red-400 line-through">
                    {from}
                  </Span>
                  <Span className="text-muted-foreground">→</Span>
                  <Span className="text-green-600 dark:text-green-400">
                    {to}
                  </Span>
                </Div>
              ))}
            </Div>
            <P className="text-sm text-muted-foreground italic">
              {t("plugins.jsxPluginInsight")}
            </P>
          </Div>

          {/* Restricted syntax */}
          <Div>
            <H3 className="font-mono font-bold mb-3">
              {t("plugins.restrictedSyntaxTitle")}
            </H3>
            <P className="text-sm text-muted-foreground mb-4">
              {t("plugins.restrictedSyntaxDescription")}
            </P>
            <Div className="space-y-3">
              {[
                {
                  title: t("plugins.throwBanTitle"),
                  desc: t("plugins.throwBanDescription"),
                },
                {
                  title: t("plugins.unknownBanTitle"),
                  desc: t("plugins.unknownBanDescription"),
                },
                {
                  title: t("plugins.objectBanTitle"),
                  desc: t("plugins.objectBanDescription"),
                },
              ].map(({ title, desc }) => (
                <Div key={title} className="flex gap-3">
                  <XCircle className="h-4 w-4 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
                  <Div>
                    <P className="font-mono font-semibold text-sm">{title}</P>
                    <P className="text-sm text-muted-foreground">{desc}</P>
                  </Div>
                </Div>
              ))}
            </Div>
          </Div>

          {/* Banned vs correct */}
          <Div className="space-y-4">
            <H3 className="font-bold">{t("plugins.bannedPatternsTitle")}</H3>
            <BadGood
              bannedLabel={t("plugins.bannedLabel")}
              correctLabel={t("plugins.correctLabel")}
              bad="const result = response as unknown as MyType;"
              rule="restricted-syntax"
              good="const result: MyType = parseResponse(response);"
            />
            <BadGood
              bannedLabel={t("plugins.bannedLabel")}
              correctLabel={t("plugins.correctLabel")}
              bad="function foo(x: any): any { return x.data; }"
              rule="no-explicit-any"
              good={`function foo<T>(response: ResponseType<T>): T | null {\n  if (!response.success) return null;\n  return response.data;\n}`}
            />
            <BadGood
              bannedLabel={t("plugins.bannedLabel")}
              correctLabel={t("plugins.correctLabel")}
              bad='throw new Error("Something failed");'
              rule="restricted-syntax"
              good={`return fail({\n  message: t("errors.server.title"),\n  errorType: ErrorResponseTypes.INTERNAL_ERROR,\n});`}
            />
          </Div>
        </Div>

        <Separator />

        {/* Live demo */}
        <Div className="space-y-6">
          <Div>
            <H2 className="text-3xl font-bold mb-2">{t("demo.title")}</H2>
            <P className="text-muted-foreground">{t("demo.subtitle")}</P>
          </Div>

          {[
            {
              n: 1,
              title: t("demo.round1Title"),
              desc: t("demo.round1Description"),
              result: t("demo.round1Result"),
              code: "export function parseApiResponse(response: any): any {\n  return response.data;\n}",
              error:
                "  1:37  error  Unexpected any.  typescript/no-explicit-any\n  1:44  error  Unexpected any.  typescript/no-explicit-any\n\n2 errors found.",
              color: "border-red-200 dark:border-red-800/50",
              numColor:
                "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800",
            },
            {
              n: 2,
              title: t("demo.round2Title"),
              desc: t("demo.round2Description"),
              result: t("demo.round2Result"),
              code: "export function parseApiResponse(response: unknown): unknown {\n  return (response as Record<string, unknown>).data;\n}",
              error:
                "  1:37  error  Replace 'unknown' with typed interface.  restricted-syntax\n  1:44  error  Replace 'unknown' with typed interface.  restricted-syntax\n  1:56  error  Replace 'unknown' with typed interface.  restricted-syntax\n\n3 errors found.",
              color: "border-yellow-200 dark:border-yellow-800/50",
              numColor:
                "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800",
            },
            {
              n: 3,
              title: t("demo.round3Title"),
              desc: t("demo.round3Description"),
              result: t("demo.round3Result"),
              code: 'import type { ResponseType } from "@/response-type";\n\nexport function parseApiResponse<T>(\n  response: ResponseType<T>\n): T | null {\n  if (!response.success) return null;\n  return response.data;\n}',
              pass: "  Oxlint: 0 errors\n  ESLint: 0 errors\n  TypeScript: 0 errors\n\n0 errors found.",
              color: "border-green-200 dark:border-green-800/50",
              numColor:
                "bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-300 dark:border-green-800",
            },
          ].map((round) => (
            <Card key={round.n} className={`${round.color} overflow-hidden`}>
              <CardContent className="pt-5 space-y-3">
                <Div className="flex items-center gap-3">
                  <Span
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-xs ${round.numColor}`}
                  >
                    {round.n}
                  </Span>
                  <H3 className="font-bold">{round.title}</H3>
                </Div>
                <P className="text-sm text-muted-foreground">{round.desc}</P>
                <P className="text-sm text-muted-foreground italic">
                  {round.result}
                </P>
                <CodeBlock language="typescript" code={round.code} />
                {"error" in round && round.error !== undefined ? (
                  <Div className="ring-2 ring-red-400/50 rounded-xl overflow-hidden">
                    <CodeBlock language="bash" code={round.error} />
                  </Div>
                ) : null}
                {"pass" in round && round.pass !== undefined ? (
                  <Div className="ring-2 ring-green-400/50 rounded-xl overflow-hidden">
                    <CodeBlock language="bash" code={round.pass} />
                  </Div>
                ) : null}
              </CardContent>
            </Card>
          ))}

          <Div className="pl-4 border-l-2 border-muted-foreground/30">
            <P className="text-sm text-muted-foreground italic">
              {t("demo.round3Insight")}
            </P>
          </Div>
        </Div>

        <Separator />

        {/* The endpoint connection */}
        <Div className="space-y-6">
          <Div>
            <H2 className="text-3xl font-bold mb-2">{t("endpoint.title")}</H2>
            <P className="text-lg text-muted-foreground">
              {t("endpoint.subtitle")}
            </P>
          </Div>

          <P className="text-muted-foreground leading-relaxed">
            {t("endpoint.description")}
          </P>

          <P className="text-muted-foreground">{t("endpoint.schemaBecomes")}</P>

          <CodeBlock
            language="typescript"
            code={`name: requestField(st, {\n  schema: z.string().min(1).max(255),\n  label: "name",\n  description: "description",\n  placeholder: "placeholder",\n}),`}
          />

          <Div className="grid grid-cols-2 gap-2">
            {[
              t("endpoint.webApiValidation"),
              t("endpoint.reactHookTypes"),
              t("endpoint.cliFlagsDescription"),
              t("endpoint.aiToolSchema"),
            ].map((item) => (
              <Div
                key={item}
                className="flex items-start gap-2 rounded-lg border p-3"
              >
                <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400 mt-0.5 shrink-0" />
                <P className="text-sm text-muted-foreground">{item}</P>
              </Div>
            ))}
          </Div>

          <Card className="border-yellow-200 dark:border-yellow-900/50 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardContent className="pt-5 pb-5">
              <P className="text-yellow-700 dark:text-yellow-400 font-semibold">
                {t("endpoint.driftProblem")}
              </P>
            </CardContent>
          </Card>

          <P className="text-center text-2xl font-black py-2">
            {t("endpoint.oneSchemaSolution")}
          </P>

          <P className="text-sm text-muted-foreground">
            {t("endpoint.typecheckedNote")}
          </P>

          {/* Stats */}
          <Div className="grid grid-cols-4 gap-3">
            {[
              {
                value: "245",
                label: t("endpoint.stat245"),
                color: "text-blue-600 dark:text-blue-400",
              },
              {
                value: "0",
                label: t("endpoint.stat0any"),
                color: "text-green-600 dark:text-green-400",
              },
              {
                value: "0",
                label: t("endpoint.stat0unknown"),
                color: "text-green-600 dark:text-green-400",
              },
              {
                value: "0",
                label: t("endpoint.stat0tsExpect"),
                color: "text-green-600 dark:text-green-400",
              },
            ].map(({ value, label, color }) => (
              <Card key={label}>
                <CardContent className="pt-4 pb-4 text-center">
                  <P className={`text-2xl font-black ${color}`}>{value}</P>
                  <P className="text-xs text-muted-foreground mt-0.5">
                    {label}
                  </P>
                </CardContent>
              </Card>
            ))}
          </Div>
          <P className="text-center text-xs text-muted-foreground">
            {t("endpoint.statNote")}
          </P>
        </Div>

        <Separator />

        {/* Install */}
        <Div className="space-y-6">
          <Div>
            <H2 className="text-3xl font-bold mb-2">{t("install.title")}</H2>
            <P className="text-lg text-muted-foreground">
              {t("install.subtitle")}
            </P>
          </Div>

          <P className="text-muted-foreground">
            {t("install.installDescription")}
          </P>

          <CodeBlock
            language="bash"
            code="bun add -D @next-vibe/checker\n# or\nnpm install -D @next-vibe/checker"
          />

          <P className="text-muted-foreground">{t("install.thenRun")}</P>

          <CodeBlock
            language="bash"
            code="vibe-check config    # scaffold check.config.ts\nvibe-check           # run all checks\nvibe-check --fix     # auto-fix linting issues"
          />

          <Card>
            <CardContent className="pt-5 space-y-3">
              <P className="font-semibold">{t("install.mcpTitle")}</P>
              <P className="text-sm text-muted-foreground">
                {t("install.mcpDescription")}
              </P>
              <CodeBlock
                language="json"
                code={`{\n  "mcpServers": {\n    "vibe-check": {\n      "command": "vibe-check",\n      "args": ["mcp"],\n      "env": { "PROJECT_ROOT": "/path/to/project" }\n    }\n  }\n}`}
              />
            </CardContent>
          </Card>

          <P className="text-sm text-muted-foreground">
            {t("install.migrationNote")}
          </P>
          <P className="text-sm text-muted-foreground">
            {t("install.openSourceNote")}
          </P>
        </Div>

        <Separator />

        {/* Closing */}
        <Div className="space-y-6">
          <H2 className="text-3xl font-bold">{t("closing.title")}</H2>

          <Div className="grid sm:grid-cols-2 gap-4">
            <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/10">
              <CardContent className="pt-5">
                <P className="font-bold text-red-600 dark:text-red-400 mb-2">
                  {t("closing.beforeTitle")}
                </P>
                <P className="text-sm text-muted-foreground leading-relaxed">
                  {t("closing.beforeDescription")}
                </P>
              </CardContent>
            </Card>
            <Card className="border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/10">
              <CardContent className="pt-5">
                <P className="font-bold text-green-600 dark:text-green-400 mb-2">
                  {t("closing.afterTitle")}
                </P>
                <P className="text-sm text-muted-foreground leading-relaxed">
                  {t("closing.afterDescription")}
                </P>
              </CardContent>
            </Card>
          </Div>

          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <P className="text-2xl font-black leading-tight">
                {t("closing.finalQuote")}
              </P>
            </CardContent>
          </Card>

          <Div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              href="https://github.com/techfreaque/next-vibe"
              className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
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
