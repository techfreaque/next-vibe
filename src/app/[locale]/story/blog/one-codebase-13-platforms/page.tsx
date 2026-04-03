import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Bot } from "next-vibe-ui/ui/icons/Bot";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { Layers } from "next-vibe-ui/ui/icons/Layers";
import { Terminal } from "next-vibe-ui/ui/icons/Terminal";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Link } from "next-vibe-ui/ui/link";
import { CodeBlock } from "next-vibe-ui/ui/markdown";
import { Separator } from "next-vibe-ui/ui/separator";
import {
  BlockQuote,
  H1,
  H2,
  H3,
  Lead,
  Muted,
  P,
} from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { configScopedTranslation } from "@/config/i18n";
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

function PlatformCard({
  label,
  description,
  index,
}: {
  label: string;
  description: string;
  index: number;
}): JSX.Element {
  const colors = [
    "border-l-blue-500 bg-blue-50 dark:bg-blue-950/30",
    "border-l-purple-500 bg-purple-50 dark:bg-purple-950/30",
    "border-l-green-500 bg-green-50 dark:bg-green-950/30",
    "border-l-orange-500 bg-orange-50 dark:bg-orange-950/30",
    "border-l-pink-500 bg-pink-50 dark:bg-pink-950/30",
    "border-l-cyan-500 bg-cyan-50 dark:bg-cyan-950/30",
    "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/30",
    "border-l-red-500 bg-red-50 dark:bg-red-950/30",
    "border-l-indigo-500 bg-indigo-50 dark:bg-indigo-950/30",
    "border-l-teal-500 bg-teal-50 dark:bg-teal-950/30",
    "border-l-violet-500 bg-violet-50 dark:bg-violet-950/30",
    "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
    "border-l-rose-500 bg-rose-50 dark:bg-rose-950/30",
  ];
  const colorClass = colors[index % colors.length];
  return (
    <Div
      className={`border-l-4 rounded-r-lg p-4 ${colorClass} transition-all hover:shadow-md`}
    >
      <P className="font-semibold text-sm mb-1">{label}</P>
      <Muted className="text-xs leading-relaxed">{description}</Muted>
    </Div>
  );
}

function DemoFlowStep({
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
  const actorColors: Record<string, string> = {
    You: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Du: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Ty: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Thea: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "Local Hermes":
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "Lokaler Hermes":
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "Lokalny Hermes":
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "Claude Code":
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    Result:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    Ergebnis:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    Wynik:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  };

  const actorColor =
    actorColors[actor] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

  return (
    <Div className="flex gap-4">
      <Div className="flex flex-col items-center">
        <Div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">
          {index + 1}
        </Div>
        {!isLast && (
          <Div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2 min-h-8" />
        )}
      </Div>
      <Div className="pb-6 flex-1">
        <Div className="flex items-center gap-2 mb-1 flex-wrap">
          <Div
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${actorColor}`}
          >
            {actor}
          </Div>
          <P className="font-semibold text-sm">{label}</P>
        </Div>
        <Muted className="text-sm leading-relaxed">{description}</Muted>
      </Div>
    </Div>
  );
}

function CalloutBox({
  children,
  variant,
}: {
  children: JSX.Element | string;
  variant: "info" | "warning" | "tip";
}): JSX.Element {
  const styles = {
    info: "border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100",
    warning:
      "border-orange-400 bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-100",
    tip: "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100",
  };
  return (
    <Div className={`border-l-4 rounded-r-xl p-5 my-6 ${styles[variant]}`}>
      {children}
    </Div>
  );
}

export function TanstackPage({ locale }: OneCodebasePageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

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

  return (
    <Div className="min-h-screen bg-white dark:bg-gray-950">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Div className="relative bg-gray-950 text-white overflow-hidden">
        <Div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-gray-950 to-purple-900/30" />
        <Div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%221%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />

        <Div className="container mx-auto px-4 py-20 relative z-10 max-w-4xl">
          <Link
            href={`/${locale}/story/blog`}
            className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-10 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToBlog")}
          </Link>

          <Div className="flex items-center gap-3 mb-6">
            <Div className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wide">
              {t("category")}
            </Div>
            <Div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <Clock className="h-3.5 w-3.5" />
              {t("readingTime")}
            </Div>
          </Div>

          <H1 className="text-4xl md:text-6xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-linear-to-r from-white via-blue-100 to-purple-200">
            {t("hero.title")}
          </H1>

          <Lead className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
            {t("hero.subtitle")}
          </Lead>

          {/* Eyebrow file bar */}
          <Div className="mt-10 inline-block">
            <Div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 font-mono text-sm text-green-400 flex items-center gap-2">
              <Div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {t("hero.fileBarLabel")}
            </Div>
          </Div>
        </Div>
      </Div>

      {/* ── ARTICLE BODY ─────────────────────────────────────────────────── */}
      <Div className="container mx-auto px-4 max-w-4xl py-16">
        {/* Opening hook */}
        <Div className="mb-16">
          <P className="text-2xl font-semibold text-gray-900 dark:text-white leading-snug mb-6">
            {t("intro.hook")}
          </P>
          <P className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t("intro.para1", { appName })}
          </P>
          <P className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("intro.para2")}
          </P>
        </Div>

        <Separator className="my-12" />

        {/* ── FILE TREE ──────────────────────────────────────────────────── */}
        <Div className="mb-16">
          <H2 className="text-3xl font-bold mb-4">
            {t("fileTreeSection.title")}
          </H2>
          <P className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {t("fileTreeSection.intro")}
          </P>

          {/* Decorated terminal block */}
          <CodeBlock
            language="bash"
            code={[
              t("fileTreeSection.fileTree.line1"),
              t("fileTreeSection.fileTree.line2"),
              t("fileTreeSection.fileTree.line3"),
              t("fileTreeSection.fileTree.line4"),
              t("fileTreeSection.fileTree.line5"),
              t("fileTreeSection.fileTree.line6"),
            ].join("\n")}
          />

          <P className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("fileTreeSection.explanation")}
          </P>
        </Div>

        {/* ── PLATFORMS TABLE ────────────────────────────────────────────── */}
        <Div className="mb-16">
          <H2 className="text-3xl font-bold mb-3">
            {t("platformsSection.title")}
          </H2>
          <P className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            {t("platformsSection.subtitle")}
          </P>

          <Div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {platforms.map((label, i) => (
              <PlatformCard
                key={label}
                label={label}
                description={platformDescriptions[i] ?? ""}
                index={i}
              />
            ))}
          </Div>

          <CalloutBox variant="warning">
            <P className="font-semibold text-lg leading-snug">
              {t("deleteFolderQuote")}
            </P>
          </CalloutBox>
        </Div>

        {/* ── PLATFORM MARKERS ───────────────────────────────────────────── */}
        <Div className="mb-16">
          <H2 className="text-3xl font-bold mb-4">
            {t("platformMarkersSection.title")}
          </H2>
          <P className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {t("platformMarkersSection.para1")}
          </P>

          <CodeBlock
            language="typescript"
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

          <P className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("platformMarkersSection.para2")}
          </P>
        </Div>

        {/* Pull quote: no API split */}
        <BlockQuote className="my-12 text-2xl font-semibold border-l-4 border-blue-500 pl-6 text-gray-900 dark:text-white leading-snug">
          {t("noApiSplitQuote")}
        </BlockQuote>

        <Separator className="my-12" />

        {/* ── DEMO SECTION ───────────────────────────────────────────────── */}
        <Div className="mb-16">
          <Div className="flex items-center gap-3 mb-4">
            <Div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
              <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </Div>
            <H2 className="text-3xl font-bold">{t("demoSection.title")}</H2>
          </Div>

          <P className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {t("demoSection.subtitle")}
          </P>

          <Card className="mb-8 border-purple-200 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-950/20">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-purple-900 dark:text-purple-100">
                {t("hero.theaCardTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <P className="text-purple-800 dark:text-purple-200 text-sm leading-relaxed">
                {t("demoSection.theaIntro")}
              </P>
            </CardContent>
          </Card>

          <P className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            {t("demoSection.demoStory")}
          </P>

          {/* Demo flow diagram */}
          <Div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 mb-8">
            <H3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              {t("demoSection.title")}
            </H3>
            {demoSteps.map((step, i) => (
              <DemoFlowStep
                key={i}
                actor={step.actor}
                label={step.label}
                description={step.description}
                index={i}
                isLast={i === demoSteps.length - 1}
              />
            ))}
          </Div>

          {/* Proof section */}
          <H3 className="text-2xl font-bold mb-3">
            {t("demoSection.proofTitle")}
          </H3>
          <P className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {t("demoSection.proofPara")}
          </P>

          <Div className="space-y-3 mb-6">
            {(
              [
                "demoSection.proof1",
                "demoSection.proof2",
                "demoSection.proof3",
              ] as const
            ).map((key) => (
              <Div
                key={key}
                className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <P className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {t(key)}
                </P>
              </Div>
            ))}
          </Div>

          <P className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic">
            {t("demoSection.proofClosing")}
          </P>
        </Div>

        <Separator className="my-12" />

        {/* ── UNDER THE HOOD ─────────────────────────────────────────────── */}
        <Div className="mb-16">
          <Div className="flex items-center gap-3 mb-6">
            <Div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
              <Code className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </Div>
            <H2 className="text-3xl font-bold">
              {t("underTheHoodSection.title")}
            </H2>
          </Div>

          {/* definition.ts */}
          <H3 className="text-xl font-bold mb-2 font-mono text-blue-600 dark:text-blue-400">
            {t("underTheHoodSection.definitionTitle")}
          </H3>
          <P className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {t("underTheHoodSection.definitionPara")}
          </P>

          <CodeBlock
            language="typescript"
            code={`// definition.ts
const { POST } = createEndpoint({
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
});`}
          />

          {/* repository.ts */}
          <H3 className="text-xl font-bold mb-2 font-mono text-green-600 dark:text-green-400">
            {t("underTheHoodSection.repositoryTitle")}
          </H3>
          <P className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {t("underTheHoodSection.repositoryPara")}
          </P>

          <CodeBlock
            language="typescript"
            code={`// repository.ts
${t("underTheHoodSection.repositoryCodeComment")}
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

          {/* route.ts */}
          <H3 className="text-xl font-bold mb-2 font-mono text-yellow-600 dark:text-yellow-400">
            {t("underTheHoodSection.routeTitle")}
          </H3>
          <P className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {t("underTheHoodSection.routePara")}
          </P>

          <CodeBlock
            language="typescript"
            code={`// route.ts
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import definitions from "./definition";
import { explainToMyBoss } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: { handler: ({ data, logger }) => explainToMyBoss(data, logger) },
});`}
          />

          {/* Stats grid */}
          <H3 className="text-xl font-bold mb-4">
            {t("underTheHoodSection.statsTitle")}
          </H3>

          <Div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                stat: t("underTheHoodSection.statEndpoints"),
                detail: t("underTheHoodSection.statEndpointsDetail"),
                icon: <Layers className="h-5 w-5 text-blue-500" />,
              },
              {
                stat: t("underTheHoodSection.statAny"),
                detail: t("underTheHoodSection.statAnyDetail"),
                icon: <Terminal className="h-5 w-5 text-green-500" />,
              },
              {
                stat: t("underTheHoodSection.statLanguages"),
                detail: t("underTheHoodSection.statLanguagesDetail"),
                icon: <CheckCircle className="h-5 w-5 text-purple-500" />,
              },
            ].map(({ stat, detail, icon }) => (
              <Card
                key={stat}
                className="text-center p-4 border-2 border-gray-100 dark:border-gray-800"
              >
                <Div className="flex justify-center mb-2">{icon}</Div>
                <P className="font-bold text-lg mb-1">{stat}</P>
                <Muted className="text-xs leading-snug">{detail}</Muted>
              </Card>
            ))}
          </Div>

          <CalloutBox variant="tip">
            <P className="font-semibold">
              {t("underTheHoodSection.statsClosing")}
            </P>
          </CalloutBox>
        </Div>

        {/* Pull quote: one pattern */}
        <BlockQuote className="my-12 text-2xl font-black border-l-4 border-purple-500 pl-6 text-gray-900 dark:text-white leading-tight">
          {t("onePatternQuote")}
        </BlockQuote>

        <Separator className="my-12" />

        {/* ── VIBE SENSE TEASER ──────────────────────────────────────────── */}
        <Div className="mb-16">
          <Card className="overflow-hidden border-2 border-emerald-200 dark:border-emerald-800/60 bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40">
            <CardHeader className="pb-2">
              <Div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">
                {t("vibeSenseTeaser.eyebrow")}
              </Div>
              <CardTitle className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                {t("vibeSenseTeaser.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <P className="text-emerald-800 dark:text-emerald-200 mb-4 leading-relaxed">
                {t("vibeSenseTeaser.description")}
              </P>

              <Div className="bg-emerald-900 dark:bg-emerald-950 rounded-lg px-4 py-2.5 mb-4 inline-block">
                <P className="font-mono text-sm text-emerald-300">
                  {t("hero.vibeCliCommand")}
                </P>
              </Div>

              <P className="text-sm font-bold text-emerald-700 dark:text-emerald-300 italic mb-4 text-lg">
                {t("vibeSenseTeaser.calloutLine")}
              </P>

              <P className="text-emerald-800 dark:text-emerald-200 text-sm mb-5 leading-relaxed">
                {t("vibeSenseTeaser.teaser")}
              </P>

              <Button
                asChild
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Link href={`/${locale}/story/blog`}>
                  {t("vibeSenseTeaser.cta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </Div>

        {/* ── CLOSING ────────────────────────────────────────────────────── */}
        <Div className="text-center py-12 px-8 bg-gray-950 dark:bg-gray-900 rounded-2xl border border-gray-800">
          <Div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
            <Zap className="h-6 w-6 text-blue-400" />
          </Div>
          <H2 className="text-3xl font-black text-white mb-4">
            {t("closing.title")}
          </H2>
          <P className="text-gray-300 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            {t("closing.para")}
          </P>
          <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600">
            <Link
              href={t("closing.ctaLink")}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("closing.cta")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Div>
      </Div>
    </Div>
  );
}

export default async function OneCodebasePage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
