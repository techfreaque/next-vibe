import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Package } from "next-vibe/ui/components/icons/Package";
import { XCircle } from "next-vibe/ui/components/icons/XCircle";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
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

const NPM_PACKAGE_URL = "https://www.npmjs.com/package/@next-vibe/checker";

/** Status strip above a code sample: banned (destructive) or correct (success). */
function CodeVerdict({
  verdict,
  label,
  rule,
  code,
  language = "typescript",
}: {
  verdict: "bad" | "good";
  label: string;
  rule?: string;
  code: string;
  language?: string;
}): JSX.Element {
  const Icon = verdict === "bad" ? XCircle : CheckCircle2;
  return (
    <Div className="flex min-w-0 flex-col gap-2">
      <Div
        className={cn(
          "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider",
          verdict === "bad" ? "text-destructive" : "text-success",
        )}
      >
        <Icon className="h-4 w-4" />
        <Span>{label}</Span>
        {rule !== undefined && (
          <Span className="ml-auto font-mono text-[11px] font-normal normal-case tracking-normal text-muted-foreground">
            {rule}
          </Span>
        )}
      </Div>
      <ArticleCode code={code} language={language} />
    </Div>
  );
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
    <Div className="grid gap-4 rounded-xl border border-border bg-card p-4 md:p-5">
      <CodeVerdict verdict="bad" label={bannedLabel} rule={rule} code={bad} />
      <CodeVerdict verdict="good" label={correctLabel} code={good} />
    </Div>
  );
}

function StatTile({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: "primary" | "success" | "destructive";
}): JSX.Element {
  return (
    <Div className="rounded-xl border border-border bg-card p-4 text-center md:p-5">
      <P
        className={cn(
          "text-3xl font-semibold tracking-tight tabular-nums md:text-4xl",
          tone === "primary" && "text-primary",
          tone === "success" && "text-success",
          tone === "destructive" && "text-destructive",
        )}
      >
        {value}
      </P>
      <P className="mt-1 text-xs leading-snug text-muted-foreground md:text-sm">
        {label}
      </P>
    </Div>
  );
}

export function TanstackPage({ locale }: TypeCheckerPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const back = {
    href: `/${locale}/story/blog`,
    label: t("closing.backToBlog"),
  };

  const rounds = [
    {
      n: 1,
      title: t("demo.round1Title"),
      desc: t("demo.round1Description"),
      result: t("demo.round1Result"),
      code: "export function parseApiResponse(response: any): any {\n  return response.data;\n}",
      output:
        "  1:37  error  Unexpected any.  typescript/no-explicit-any\n  1:44  error  Unexpected any.  typescript/no-explicit-any\n\n2 errors found.",
      passed: false,
    },
    {
      n: 2,
      title: t("demo.round2Title"),
      desc: t("demo.round2Description"),
      result: t("demo.round2Result"),
      code: "export function parseApiResponse(response: unknown): unknown {\n  return (response as Record<string, unknown>).data;\n}",
      output:
        "  1:37  error  Replace 'unknown' with typed interface.  restricted-syntax\n  1:44  error  Replace 'unknown' with typed interface.  restricted-syntax\n  1:56  error  Replace 'unknown' with typed interface.  restricted-syntax\n\n3 errors found.",
      passed: false,
    },
    {
      n: 3,
      title: t("demo.round3Title"),
      desc: t("demo.round3Description"),
      result: t("demo.round3Result"),
      code: 'import type { ResponseType } from "next-vibe/core/route/response.schema";\n\nexport function parseApiResponse<T>(\n  response: ResponseType<T>\n): T | null {\n  if (!response.success) return null;\n  return response.data;\n}',
      output:
        "  Oxlint: 0 errors\n  ESLint: 0 errors\n  TypeScript: 0 errors\n\n0 errors found.",
      passed: true,
    },
  ];

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("hero.label")}
        readTime={t("hero.readTime")}
        date={formatPostDate("type-checker-made-ai-stop-lying", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <ArticleQuote>{t("hero.quoteAiLies")}</ArticleQuote>

        {/* The broken feedback loop */}
        <ArticleSection title={t("problem.title")}>
          <ArticleLead>{t("problem.description")}</ArticleLead>
          <Callout tone="neutral">
            <P className="font-semibold text-foreground">
              {t("problem.fixLabel")}
            </P>
            <P className="mt-1 text-muted-foreground">
              {t("problem.fixDescription")}
            </P>
          </Callout>
          <ArticleP>{t("problem.escapeHatch")}</ArticleP>
          <ArticleCode
            language="typescript"
            // oxlint-disable-next-line i18n/no-literal-string
            code="const result = data as unknown as MyExpectedType;"
          />
          <ArticleP className="text-muted-foreground italic">
            {t("problem.smokeDetector")}
          </ArticleP>
          <P className="text-xl font-semibold tracking-tight text-balance text-foreground md:text-2xl">
            {t("problem.introducingChecker")}
          </P>
        </ArticleSection>

        {/* The `any` problem */}
        <ArticleSection
          title={t("anyProblem.title")}
          intro={t("anyProblem.subtitle")}
        >
          <ArticleP>{t("anyProblem.graphDescription")}</ArticleP>

          {/* any infection - how one any spreads through the graph */}
          <Div className="rounded-xl border border-border bg-card p-5 text-center md:p-6">
            <Span className="inline-block rounded-lg border border-destructive/40 bg-destructive/10 px-5 py-2 font-mono text-xl font-semibold text-destructive md:text-2xl">
              any
            </Span>
            {[
              ["result", "transformed", "output"],
              ["Component", "hook", "schema"],
            ].map((row, depth) => (
              <Div
                key={row.join("-")}
                className="mt-2 flex flex-wrap justify-center gap-2"
              >
                {row.map((n) => (
                  <Div key={n} className="flex flex-col items-center gap-1">
                    <Div className="h-4 w-px bg-destructive/40" />
                    <Span
                      className={cn(
                        "rounded-md border px-3 py-1 font-mono text-xs",
                        depth === 0
                          ? "border-destructive/30 bg-destructive/10 text-destructive"
                          : "border-destructive/20 bg-destructive/5 text-destructive/80",
                      )}
                    >
                      {n}
                    </Span>
                  </Div>
                ))}
              </Div>
            ))}
            <P className="mt-4 text-xs text-muted-foreground">
              {t("anyProblem.infectionDiagramSubtitle")}
            </P>
          </Div>

          <Callout tone="warning">
            <P className="text-lg font-semibold text-foreground">
              {t("anyProblem.holeInGraph")}
            </P>
            <P className="mt-1 text-muted-foreground">
              {t("anyProblem.holeDescription")}
            </P>
          </Callout>

          <Div className="grid grid-cols-2 gap-3">
            <StatTile
              value="0"
              label={t("anyProblem.counterZeroErrors")}
              tone="success"
            />
            <StatTile
              value="47"
              label={t("anyProblem.counterAnyUsages")}
              tone="destructive"
            />
          </Div>

          <ArticleP>{t("anyProblem.zeroErrors")}</ArticleP>
          <ArticleP>{t("anyProblem.doubleAssertion")}</ArticleP>

          <ArticleH3>{t("anyProblem.bannedTitle")}</ArticleH3>
          <Div className="grid gap-2 sm:grid-cols-2">
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
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
              >
                <Span className="font-mono text-sm font-semibold text-destructive">
                  {pattern}
                </Span>
                <Span className="font-mono text-xs text-muted-foreground">
                  {rule}
                </Span>
              </Div>
            ))}
          </Div>

          <Callout tone="primary">
            <P className="font-semibold text-foreground">
              {t("anyProblem.bannedNotWarnings")}
            </P>
            <P className="mt-1 text-muted-foreground">
              {t("anyProblem.psychologyNote")}
            </P>
          </Callout>
        </ArticleSection>

        {/* @next-vibe/checker */}
        <ArticleSection
          title={t("checker.title")}
          intro={t("checker.subtitle")}
        >
          <ArticleCode
            language="bash"
            // oxlint-disable-next-line i18n/no-literal-string
            code="$ vibe check"
          />
          <ArticleP>{t("checker.commandDescription")}</ArticleP>

          <Div className="grid gap-3 sm:grid-cols-3">
            {[
              { name: "Oxlint", desc: t("checker.oxlintDescription") },
              { name: "ESLint", desc: t("checker.eslintDescription") },
              { name: "TypeScript", desc: t("checker.tsDescription") },
            ].map(({ name, desc }) => (
              <Div
                key={name}
                className="rounded-xl border border-border bg-card p-4"
              >
                <P className="font-mono text-sm font-semibold text-primary">
                  {name}
                </P>
                <P className="mt-1 text-sm leading-snug text-muted-foreground">
                  {desc}
                </P>
              </Div>
            ))}
          </Div>

          <Div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Div className="h-px flex-1 bg-border" />
            <Span>{t("checker.parallel")}</Span>
            <Div className="h-px flex-1 bg-border" />
          </Div>

          <Callout tone="success" icon={CheckCircle2}>
            <P className="font-semibold text-foreground">
              {t("checker.unifiedErrors")}
            </P>
            <P className="mt-1 text-muted-foreground">
              {t("checker.unifiedErrorsDescription")}
            </P>
          </Callout>

          <ArticleP>{t("checker.timingNote")}</ArticleP>
          <ArticleP className="text-muted-foreground">
            {t("checker.mcpNote")}
          </ArticleP>
        </ArticleSection>

        {/* Custom plugins */}
        <ArticleSection
          title={t("plugins.title")}
          intro={t("plugins.linterIsDocumentation")}
        >
          <ArticleH3 className="font-mono">
            {t("plugins.jsxPluginTitle")}
          </ArticleH3>
          <ArticleP>{t("plugins.jsxPluginDescription")}</ArticleP>
          <Div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
            {[
              {
                from: "<button>",
                to: '<Button> from "next-vibe/ui/components/button"',
              },
              {
                from: "<a>",
                to: '<Link> from "next-vibe/ui/components/link"',
              },
              {
                from: "<p>",
                to: '<P> from "next-vibe/ui/components/typography"',
              },
            ].map(({ from, to }) => (
              <Div
                key={from}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 font-mono text-sm"
              >
                <Span className="text-destructive line-through">{from}</Span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <Span className="min-w-0 break-words text-success">{to}</Span>
              </Div>
            ))}
          </Div>
          <ArticleP className="text-muted-foreground italic">
            {t("plugins.jsxPluginInsight")}
          </ArticleP>

          <ArticleH3 className="font-mono">
            {t("plugins.restrictedSyntaxTitle")}
          </ArticleH3>
          <ArticleP>{t("plugins.restrictedSyntaxDescription")}</ArticleP>
          <Div className="flex flex-col gap-4">
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
                <XCircle className="mt-1 h-4 w-4 shrink-0 text-destructive" />
                <Div className="min-w-0">
                  <P className="font-mono text-sm font-semibold text-foreground">
                    {title}
                  </P>
                  <P className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {desc}
                  </P>
                </Div>
              </Div>
            ))}
          </Div>

          <ArticleH3>{t("plugins.bannedPatternsTitle")}</ArticleH3>
          <BadGood
            bannedLabel={t("plugins.bannedLabel")}
            correctLabel={t("plugins.correctLabel")}
            // oxlint-disable-next-line i18n/no-literal-string
            bad="const result = response as unknown as MyType;"
            rule="restricted-syntax"
            // oxlint-disable-next-line i18n/no-literal-string
            good="const result: MyType = parseResponse(response);"
          />
          <BadGood
            bannedLabel={t("plugins.bannedLabel")}
            correctLabel={t("plugins.correctLabel")}
            // oxlint-disable-next-line i18n/no-literal-string
            bad="function foo(x: any): any { return x.data; }"
            rule="no-explicit-any"
            good={`function foo<T>(response: ResponseType<T>): T | null {\n  if (!response.success) return null;\n  return response.data;\n}`}
          />
          <BadGood
            bannedLabel={t("plugins.bannedLabel")}
            correctLabel={t("plugins.correctLabel")}
            // oxlint-disable-next-line i18n/no-literal-string
            bad='throw new Error("Something failed");'
            rule="restricted-syntax"
            good={`return fail({\n  message: t("errors.server.title"),\n  errorType: ErrorResponseTypes.INTERNAL_ERROR,\n});`}
          />
        </ArticleSection>

        {/* Live demo */}
        <ArticleSection title={t("demo.title")} intro={t("demo.subtitle")}>
          {rounds.map((round) => (
            <Div
              key={round.n}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:p-6"
            >
              <Div className="flex items-center gap-3">
                <Span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                    round.passed
                      ? "border-success/30 bg-success/10 text-success"
                      : "border-destructive/30 bg-destructive/10 text-destructive",
                  )}
                >
                  {round.n}
                </Span>
                <ArticleH3 className="mt-0">{round.title}</ArticleH3>
              </Div>
              <P className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {round.desc}
              </P>
              <P className="text-sm leading-relaxed text-foreground italic md:text-base">
                {round.result}
              </P>
              <ArticleCode code={round.code} language="typescript" />
              <CodeVerdict
                verdict={round.passed ? "good" : "bad"}
                // oxlint-disable-next-line i18n/no-literal-string
                label="vibe check"
                code={round.output}
                language="bash"
              />
            </Div>
          ))}
          <ArticleQuote>{t("demo.round3Insight")}</ArticleQuote>
        </ArticleSection>

        {/* The endpoint connection */}
        <ArticleSection
          title={t("endpoint.title")}
          intro={t("endpoint.subtitle")}
        >
          <ArticleP>{t("endpoint.description")}</ArticleP>
          <ArticleP>{t("endpoint.schemaBecomes")}</ArticleP>
          <ArticleCode
            language="typescript"
            code={`name: requestField(st, {\n  schema: z.string().min(1).max(255),\n  label: "name",\n  description: "description",\n  placeholder: "placeholder",\n}),`}
          />
          <Div className="grid gap-2 sm:grid-cols-2">
            {[
              t("endpoint.webApiValidation"),
              t("endpoint.reactHookTypes"),
              t("endpoint.cliFlagsDescription"),
              t("endpoint.aiToolSchema"),
            ].map((item) => (
              <Div
                key={item}
                className="flex items-start gap-2 rounded-lg border border-border bg-card p-3"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <P className="text-sm leading-relaxed text-muted-foreground">
                  {item}
                </P>
              </Div>
            ))}
          </Div>
          <Callout tone="warning">
            <P className="font-semibold text-foreground">
              {t("endpoint.driftProblem")}
            </P>
          </Callout>
          <P className="text-xl font-semibold tracking-tight text-balance text-foreground md:text-2xl">
            {t("endpoint.oneSchemaSolution")}
          </P>
          <ArticleP className="text-muted-foreground">
            {t("endpoint.typecheckedNote")}
          </ArticleP>
          <Div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatTile
              value="245"
              label={t("endpoint.stat245")}
              tone="primary"
            />
            <StatTile value="0" label={t("endpoint.stat0any")} tone="success" />
            <StatTile
              value="0"
              label={t("endpoint.stat0unknown")}
              tone="success"
            />
            <StatTile
              value="0"
              label={t("endpoint.stat0tsExpect")}
              tone="success"
            />
          </Div>
          <P className="text-center text-xs text-muted-foreground">
            {t("endpoint.statNote")}
          </P>
        </ArticleSection>

        {/* Install */}
        <ArticleSection
          title={t("install.title")}
          intro={t("install.subtitle")}
        >
          <ArticleP>{t("install.installDescription")}</ArticleP>
          <ArticleCode
            language="bash"
            // oxlint-disable-next-line i18n/no-literal-string
            code="bun add -D @next-vibe/checker\n# or\nnpm install -D @next-vibe/checker"
          />
          <ArticleP>{t("install.thenRun")}</ArticleP>
          <ArticleCode
            language="bash"
            // oxlint-disable-next-line i18n/no-literal-string
            code="vibe-check config    # scaffold check.config.ts\nvibe-check           # run all checks\nvibe-check --fix     # auto-fix linting issues"
          />
          <ArticleH3>{t("install.mcpTitle")}</ArticleH3>
          <ArticleP>{t("install.mcpDescription")}</ArticleP>
          <ArticleCode
            language="json"
            code={`{\n  "mcpServers": {\n    "vibe-check": {\n      "command": "vibe-check",\n      "args": ["mcp"],\n      "env": { "PROJECT_ROOT": "/path/to/project" }\n    }\n  }\n}`}
          />
          <ArticleP className="text-muted-foreground">
            {t("install.migrationNote")}
          </ArticleP>
          <ArticleP className="text-muted-foreground">
            {t("install.openSourceNote")}
          </ArticleP>
        </ArticleSection>

        {/* Closing */}
        <ArticleSection title={t("closing.title")}>
          <Div className="grid gap-4 sm:grid-cols-2">
            <Div className="rounded-xl border border-destructive/25 bg-destructive/5 p-5">
              <P className="font-semibold text-destructive">
                {t("closing.beforeTitle")}
              </P>
              <P className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {t("closing.beforeDescription")}
              </P>
            </Div>
            <Div className="rounded-xl border border-success/25 bg-success/5 p-5">
              <P className="font-semibold text-success">
                {t("closing.afterTitle")}
              </P>
              <P className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {t("closing.afterDescription")}
              </P>
            </Div>
          </Div>
        </ArticleSection>

        <ArticleEnd
          back={back}
          title={t("closing.finalQuote")}
          actions={
            <>
              <Cta
                href={NPM_PACKAGE_URL}
                label={t("closing.ctaInstall")}
                icon={Package}
                external
              />
              <Cta
                href={GITHUB_REPO_URL}
                label={t("closing.ctaGitHub")}
                icon={Github}
                variant="secondary"
                external
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function TypeCheckerBlogPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
