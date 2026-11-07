import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { Bot } from "next-vibe/ui/components/icons/Bot";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Github } from "next-vibe/ui/components/icons/Github";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { Zap } from "next-vibe/ui/components/icons/Zap";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { GITHUB_REPO_URL } from "@/env/constants";
import { configScopedTranslation } from "@/env/i18n";

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
    path: "story/blog/one-codebase-13-platforms",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070",
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
  });
};

export interface OneCodebasePageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<OneCodebasePageData> {
  const { locale } = await params;
  return { locale };
}

function PlatformTile({
  label,
  description,
}: {
  label: string;
  description: string;
}): JSX.Element {
  return (
    <Div className="rounded-xl border border-border bg-card p-4">
      <P className="text-sm font-semibold leading-snug">{label}</P>
      <P className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {description}
      </P>
    </Div>
  );
}

function FlowStep({
  actor,
  label,
  description,
  index,
  isLast,
}: {
  actor: string;
  label: string;
  description: string;
  index: number;
  isLast: boolean;
}): JSX.Element {
  return (
    <Div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4">
      <Div className="flex flex-col items-center">
        <Span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-semibold text-primary">
          {index + 1}
        </Span>
        {!isLast && <Div className="mt-2 w-px flex-1 bg-border" />}
      </Div>
      <Div className={isLast ? "min-w-0" : "min-w-0 pb-6"}>
        <Div className="flex flex-wrap items-center gap-2">
          <Span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
            {actor}
          </Span>
          <Span className="text-sm font-semibold">{label}</Span>
        </Div>
        <P className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </P>
      </Div>
    </Div>
  );
}

const DEFINITION_CODE = `const { POST } = createEndpoint({
  scopedTranslation,
  aliases: [EXPLAIN_TO_MY_BOSS_ALIAS],
  method: Methods.POST,
  path: ["explain", "to-my-boss"],
  title: "post.title",
  description: "post.description",
  icon: "sparkles",
  category: "endpointCategories.ai",
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    usage: { request: "data", response: true },
    children: {
      decision: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.fields.decision.label",
        description: "post.fields.decision.description",
        schema: z.string().min(1).max(2000),
        columns: 12,
      }),
      justification: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.justification.content",
        schema: z.string(),
      }),
    },
  }),
  errorTypes: { /* ... all 9 required error types ... */ },
  successTypes: { title: "post.success.title", description: "post.success.description" },
  examples: { requests: { default: { decision: "Migrate to Bun" } }, responses: { default: { justification: "..." } } },
});`;

const ROUTE_CODE = `import { endpointsHandler } from "next-vibe/core/route/multi";
import { Methods } from "next-vibe/core/definition/enums";
import definitions from "./definition";
import { explainToMyBoss } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: { handler: ({ data, logger }) => explainToMyBoss(data, logger) },
});`;

export function TanstackPage({ locale }: OneCodebasePageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const back = { href: `/${locale}/story/blog`, label: t("backToBlog") };

  const platforms = [
    t("platformsSection.platforms.webApi.label"),
    t("platformsSection.platforms.reactUi.label"),
    t("platformsSection.platforms.cli.label"),
    t("platformsSection.platforms.aiTool.label"),
    t("platformsSection.platforms.mcpServer.label"),
    t("platformsSection.platforms.reactNative.label"),
    t("platformsSection.platforms.cron.label"),
    t("platformsSection.platforms.websocket.label"),
    t("platformsSection.platforms.electron.label"),
    t("platformsSection.platforms.adminPanel.label"),
    t("platformsSection.platforms.vibeFrame.label"),
    t("platformsSection.platforms.remoteSkill.label"),
    t("platformsSection.platforms.vibeBoard.label"),
  ];

  const platformDescriptions = [
    t("platformsSection.platforms.webApi.description"),
    t("platformsSection.platforms.reactUi.description"),
    t("platformsSection.platforms.cli.description"),
    t("platformsSection.platforms.aiTool.description"),
    t("platformsSection.platforms.mcpServer.description"),
    t("platformsSection.platforms.reactNative.description"),
    t("platformsSection.platforms.cron.description"),
    t("platformsSection.platforms.websocket.description"),
    t("platformsSection.platforms.electron.description"),
    t("platformsSection.platforms.adminPanel.description"),
    t("platformsSection.platforms.vibeFrame.description"),
    t("platformsSection.platforms.remoteSkill.description"),
    t("platformsSection.platforms.vibeBoard.description"),
  ];

  const demoSteps = [
    {
      actor: t("demoSection.flow.step1.actor"),
      label: t("demoSection.flow.step1.label"),
      description: t("demoSection.flow.step1.description"),
    },
    {
      actor: t("demoSection.flow.step2.actor"),
      label: t("demoSection.flow.step2.label"),
      description: t("demoSection.flow.step2.description"),
    },
    {
      actor: t("demoSection.flow.step3.actor"),
      label: t("demoSection.flow.step3.label"),
      description: t("demoSection.flow.step3.description"),
    },
    {
      actor: t("demoSection.flow.step4.actor"),
      label: t("demoSection.flow.step4.label"),
      description: t("demoSection.flow.step4.description"),
    },
    {
      actor: t("demoSection.flow.step5.actor"),
      label: t("demoSection.flow.step5.label"),
      description: t("demoSection.flow.step5.description"),
    },
    {
      actor: t("demoSection.flow.step6.actor"),
      label: t("demoSection.flow.step6.label"),
      description: t("demoSection.flow.step6.description"),
    },
    {
      actor: t("demoSection.flow.step7.actor"),
      label: t("demoSection.flow.step7.label"),
      description: t("demoSection.flow.step7.description"),
    },
  ];

  const stats = [
    {
      stat: t("underTheHoodSection.statEndpoints"),
      detail: t("underTheHoodSection.statEndpointsDetail"),
      icon: Layers,
    },
    {
      stat: t("underTheHoodSection.statAny"),
      detail: t("underTheHoodSection.statAnyDetail"),
      icon: Terminal,
    },
    {
      stat: t("underTheHoodSection.statLanguages"),
      detail: t("underTheHoodSection.statLanguagesDetail"),
      icon: CheckCircle,
    },
  ];

  return (
    <Div className="min-h-screen bg-background">
      <ArticleHeader
        back={back}
        category={t("category")}
        readTime={t("readingTime")}
        date={formatPostDate("one-codebase-13-platforms", locale)}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <ArticleBody>
        <Div className="flex flex-col gap-5">
          <Span className="w-fit max-w-full rounded-lg border border-border bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground break-words">
            {t("hero.fileBarLabel")}
          </Span>
          <ArticleLead>{t("intro.hook")}</ArticleLead>
          <ArticleP>{t("intro.para1", { appName })}</ArticleP>
          <ArticleP>{t("intro.para2")}</ArticleP>
        </Div>

        <ArticleSection title={t("fileTreeSection.title")}>
          <ArticleP>{t("fileTreeSection.intro")}</ArticleP>
          <ArticleCode
            language="bash"
            filename={t("hero.fileTreePath")}
            code={[
              t("fileTreeSection.fileTree.line1"),
              t("fileTreeSection.fileTree.line2"),
              t("fileTreeSection.fileTree.line3"),
              t("fileTreeSection.fileTree.line4"),
              t("fileTreeSection.fileTree.line5"),
              t("fileTreeSection.fileTree.line6"),
            ].join("\n")}
          />
          <ArticleP>{t("fileTreeSection.explanation")}</ArticleP>
        </ArticleSection>

        <ArticleSection
          title={t("platformsSection.title")}
          intro={t("platformsSection.subtitle")}
        >
          <Div className="grid gap-3 sm:grid-cols-2">
            {platforms.map((label, i) => (
              <PlatformTile
                key={label}
                label={label}
                description={platformDescriptions[i] ?? ""}
              />
            ))}
          </Div>
          <Callout icon={AlertTriangle} tone="warning">
            <Span className="font-semibold">{t("deleteFolderQuote")}</Span>
          </Callout>
        </ArticleSection>

        <ArticleSection title={t("platformMarkersSection.title")}>
          <ArticleP>{t("platformMarkersSection.para1")}</ArticleP>
          <ArticleCode
            language="typescript"
            filename="definition.ts"
            code={[
              t("platformMarkersSection.codeComment"),
              t("hero.codeBlockLabel"),
              t("platformMarkersSection.cliOff"),
              t("platformMarkersSection.mcpVisible"),
              t("platformMarkersSection.remoteSkill"),
              t("platformMarkersSection.productionOff"),
              t("hero.closingBracket"),
            ].join("\n")}
          />
          <ArticleP>{t("platformMarkersSection.para2")}</ArticleP>
        </ArticleSection>

        <ArticleQuote>{t("noApiSplitQuote")}</ArticleQuote>

        <ArticleSection title={t("demoSection.title")}>
          <ArticleP>{t("demoSection.subtitle")}</ArticleP>
          <Callout icon={Bot}>
            <P className="font-semibold">{t("hero.theaCardTitle")}</P>
            <P className="mt-1 text-muted-foreground">
              {t("demoSection.theaIntro")}
            </P>
          </Callout>
          <ArticleP>{t("demoSection.demoStory")}</ArticleP>
          <Div className="rounded-xl border border-border bg-card p-5 md:p-6">
            {demoSteps.map((step, i) => (
              <FlowStep
                key={i}
                actor={step.actor}
                label={step.label}
                description={step.description}
                index={i}
                isLast={i === demoSteps.length - 1}
              />
            ))}
          </Div>
          <ArticleH3>{t("demoSection.proofTitle")}</ArticleH3>
          <ArticleP>{t("demoSection.proofPara")}</ArticleP>
          <Div className="flex flex-col gap-3">
            {[
              t("demoSection.proof1"),
              t("demoSection.proof2"),
              t("demoSection.proof3"),
            ].map((proof) => (
              <Callout key={proof} icon={CheckCircle} tone="success">
                {proof}
              </Callout>
            ))}
          </Div>
          <ArticleP className="italic">
            {t("demoSection.proofClosing")}
          </ArticleP>
        </ArticleSection>

        <ArticleSection title={t("underTheHoodSection.title")}>
          <ArticleH3 className="font-mono">
            {t("underTheHoodSection.definitionTitle")}
          </ArticleH3>
          <ArticleP>{t("underTheHoodSection.definitionPara")}</ArticleP>
          <ArticleCode
            language="typescript"
            filename="definition.ts"
            code={DEFINITION_CODE}
          />

          <ArticleH3 className="font-mono">
            {t("underTheHoodSection.repositoryTitle")}
          </ArticleH3>
          <ArticleP>{t("underTheHoodSection.repositoryPara")}</ArticleP>
          <ArticleCode
            language="typescript"
            filename="repository.ts"
            code={`${t("underTheHoodSection.repositoryCodeComment")}
export async function explainToMyBoss(
  data: { decision: string },
  logger: Logger,
): Promise<ResponseType<{ justification: string }>> {
  const result = await ai.generateText({
    prompt: buildPrompt(data.decision),
  });
  if (!result.text) {
    return fail({ message: "AI returned empty response", errorType: EndpointErrorTypes.SERVER_ERROR });
  }
  return success({ justification: result.text });
}`}
          />

          <ArticleH3 className="font-mono">
            {t("underTheHoodSection.routeTitle")}
          </ArticleH3>
          <ArticleP>{t("underTheHoodSection.routePara")}</ArticleP>
          <ArticleCode
            language="typescript"
            filename="route.ts"
            code={ROUTE_CODE}
          />

          <ArticleH3>{t("underTheHoodSection.statsTitle")}</ArticleH3>
          <Div className="grid gap-3 sm:grid-cols-3">
            {stats.map(({ stat, detail, icon: Icon }) => (
              <Div
                key={stat}
                className="rounded-xl border border-border bg-card p-5"
              >
                <Icon className="h-5 w-5 text-primary" />
                <P className="mt-3 text-lg font-semibold tracking-tight">
                  {stat}
                </P>
                <P className="mt-1 text-sm leading-snug text-muted-foreground">
                  {detail}
                </P>
              </Div>
            ))}
          </Div>
          <Callout icon={Zap} tone="success">
            <Span className="font-semibold">
              {t("underTheHoodSection.statsClosing")}
            </Span>
          </Callout>
        </ArticleSection>

        <ArticleQuote>{t("onePatternQuote")}</ArticleQuote>

        <Div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <Span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {t("vibeSenseTeaser.eyebrow")}
          </Span>
          <H3 className="mt-2 text-2xl font-semibold tracking-tight text-balance">
            {t("vibeSenseTeaser.title")}
          </H3>
          <P className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground md:text-base">
            {t("vibeSenseTeaser.description")}
          </P>
          <Div className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted px-4 py-2.5">
            <Span className="font-mono text-sm whitespace-nowrap text-foreground">
              {t("hero.vibeCliCommand")}
            </Span>
          </Div>
          <P className="mt-4 text-lg font-semibold">
            {t("vibeSenseTeaser.calloutLine")}
          </P>
          <P className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground md:text-base">
            {t("vibeSenseTeaser.teaser")}
          </P>
          <Div className="mt-6">
            <Cta
              href={`/${locale}/story/blog/dead-trading-bot-to-monitoring-engine`}
              label={t("vibeSenseTeaser.cta")}
              variant="secondary"
              arrow
            />
          </Div>
        </Div>

        <ArticleEnd
          back={back}
          title={t("closing.title")}
          subtitle={t("closing.para")}
          actions={
            <>
              <Cta
                href={GITHUB_REPO_URL}
                label={t("closing.cta")}
                icon={Github}
                external
              />
              <Cta
                href={`/${locale}/story/framework`}
                label={t("closing.frameworkCta")}
                variant="secondary"
              />
            </>
          }
        />
      </ArticleBody>
    </Div>
  );
}

export default async function OneCodebasePage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
