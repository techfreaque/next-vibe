import type { Metadata } from "next";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { Layers } from "next-vibe-ui/ui/icons/Layers";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
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

import { embedCodeHtml, embedCodeTs, federatedCode } from "./code-examples";
import { VibeFrameDemo } from "./demo";

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
    path: "story/blog/i-got-fired",
    title: t("meta.title"),
    category: t("meta.category"),
    description: t("meta.description"),
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069",
    imageAlt: t("meta.imageAlt"),
    keywords: [t("meta.keywords")],
  });
};

export interface FiredPageData {
  locale: CountryLanguage;
}

export async function tanstackLoader({
  params,
}: Props): Promise<FiredPageData> {
  const { locale } = await params;
  return { locale };
}

function DisplayModeCard({
  name,
  description,
  icon,
}: {
  name: string;
  description: string;
  icon: JSX.Element;
}): JSX.Element {
  return (
    <Card className="h-full transition-all hover:shadow-md border-t-2 border-t-purple-500">
      <CardHeader className="pb-2">
        <Div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-2">
          {icon}
        </Div>
        <CardTitle className="text-base">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Muted className="text-sm leading-relaxed">{description}</Muted>
      </CardContent>
    </Card>
  );
}

export function TanstackPage({ locale }: FiredPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const displayModes = [
    {
      name: t("displayModes.inline.name"),
      description: t("displayModes.inline.description"),
      icon: <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
    },
    {
      name: t("displayModes.modal.name"),
      description: t("displayModes.modal.description"),
      icon: (
        <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
      ),
    },
    {
      name: t("displayModes.slideIn.name"),
      description: t("displayModes.slideIn.description"),
      icon: <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
    },
    {
      name: t("displayModes.bottomSheet.name"),
      description: t("displayModes.bottomSheet.description"),
      icon: <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
    },
  ];

  const triggers = [
    t("displayModes.triggers.immediate"),
    t("displayModes.triggers.scroll"),
    t("displayModes.triggers.time"),
    t("displayModes.triggers.exitIntent"),
    t("displayModes.triggers.click"),
    t("displayModes.triggers.hover"),
    t("displayModes.triggers.viewport"),
  ];

  return (
    <Div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero */}
      <Div className="relative bg-gray-950 border-b border-gray-800">
        <Div className="absolute inset-0 bg-linear-to-br from-purple-950/30 via-gray-950 to-gray-950" />
        <Div className="container mx-auto px-4 py-20 relative z-10 max-w-4xl">
          <Link
            href={`/${locale}/story/blog`}
            className="inline-flex items-center text-sm text-gray-400 hover:text-gray-200 mb-10 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("hero.backToBlog")}
          </Link>

          <Div className="flex items-center gap-3 mb-6">
            <Div className="px-3 py-1 bg-purple-900/50 border border-purple-700 rounded-full text-purple-300 text-xs font-semibold uppercase tracking-wider">
              {t("hero.category")}
            </Div>
            <Muted className="text-xs text-gray-500">
              {t("hero.readTime")}
            </Muted>
          </Div>

          <H1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
            {t("hero.title")}
          </H1>

          <Lead className="text-xl text-gray-300 mb-8 leading-relaxed">
            {t("hero.subtitle")}
          </Lead>

          <BlockQuote className="border-l-4 border-purple-500 pl-6 text-gray-300 text-lg italic">
            {t("hero.quote")}
          </BlockQuote>
        </Div>
      </Div>

      <Div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Origin Story */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-8 text-white">
            {t("origin.title")}
          </H2>
          <P className="text-gray-300 text-lg leading-relaxed mb-6">
            {t("origin.paragraph1")}
          </P>
          <P className="text-gray-300 text-lg leading-relaxed mb-6">
            {t("origin.paragraph2")}
          </P>
          <P className="text-gray-300 text-lg leading-relaxed">
            {t("origin.paragraph3")}
          </P>
        </Div>

        <Separator className="border-gray-800 my-16" />

        {/* The Problem */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-8 text-white">
            {t("problem.title")}
          </H2>
          <P className="text-gray-300 text-lg leading-relaxed mb-6">
            {t("problem.paragraph1")}
          </P>
          <P className="text-gray-300 text-lg leading-relaxed mb-8">
            {t("problem.paragraph2")}
          </P>

          <Div className="bg-amber-950/30 border border-amber-700/50 rounded-xl p-6 mb-8">
            <P className="text-amber-300 font-bold text-lg mb-3">
              {t("problem.bridgeTitle")}
            </P>
            <P className="text-amber-200/80 leading-relaxed">
              {t("problem.bridgeDescription")}
            </P>
          </Div>
        </Div>

        {/* Bridge Diagram */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-8 text-white">
            {t("bridge.title")}
          </H2>

          {/* Visual bridge diagram */}
          <Div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 mb-8">
            <Div className="flex items-center justify-between gap-4">
              <Div className="flex-1 bg-blue-950/50 border border-blue-700 rounded-xl p-5 text-center">
                <Div className="text-blue-300 font-bold mb-1 text-sm">
                  {t("bridge.diagramParent")}
                </Div>
                <Div className="text-xs text-gray-400 mt-3 text-left space-y-1">
                  <Div className="text-blue-400 font-mono text-xs">
                    {t("bridge.parentToIframe")}
                  </Div>
                  <Div className="text-gray-500 text-xs font-mono leading-relaxed">
                    {t("bridge.parentMessages")}
                  </Div>
                </Div>
              </Div>

              <Div className="flex flex-col items-center gap-2 flex-shrink-0">
                <Div className="w-16 h-0.5 bg-purple-500" />
                <Div className="px-3 py-2 bg-purple-900/50 border border-purple-600 rounded-lg text-purple-300 text-xs font-mono font-bold text-center">
                  {t("bridge.diagramBridge")}
                </Div>
                <Div className="w-16 h-0.5 bg-purple-500" />
              </Div>

              <Div className="flex-1 bg-green-950/50 border border-green-700 rounded-xl p-5 text-center">
                <Div className="text-green-300 font-bold mb-1 text-sm">
                  {t("bridge.diagramIframe")}
                </Div>
                <Div className="text-xs text-gray-400 mt-3 text-left space-y-1">
                  <Div className="text-green-400 font-mono text-xs">
                    {t("bridge.iframeToParent")}
                  </Div>
                  <Div className="text-gray-500 text-xs font-mono leading-relaxed">
                    {t("bridge.iframeMessages")}
                  </Div>
                </Div>
              </Div>
            </Div>
          </Div>

          <P className="text-gray-300 text-lg leading-relaxed">
            {t("bridge.description")}
          </P>
        </Div>

        <Separator className="border-gray-800 my-16" />

        {/* Display Modes */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-4 text-white">
            {t("displayModes.title")}
          </H2>

          <H3 className="text-xl font-semibold mb-6 text-gray-200">
            {t("displayModes.modesTitle")}
          </H3>
          <Div className="grid sm:grid-cols-2 gap-4 mb-10">
            {displayModes.map((mode, index) => (
              <DisplayModeCard
                key={index}
                name={mode.name}
                description={mode.description}
                icon={mode.icon}
              />
            ))}
          </Div>

          <H3 className="text-xl font-semibold mb-4 text-gray-200">
            {t("displayModes.triggersTitle")}
          </H3>
          <Div className="space-y-2 mb-8">
            {triggers.map((trigger, index) => (
              <Div
                key={index}
                className="flex items-start gap-3 py-2 px-4 bg-gray-900 border border-gray-800 rounded-lg"
              >
                <Div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                <Muted className="text-sm text-gray-300">{trigger}</Muted>
              </Div>
            ))}
          </Div>

          <Div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
            <P className="text-sm font-semibold text-gray-200 mb-2">
              {t("displayModes.frequencyTitle")}
            </P>
            <Muted className="text-sm text-gray-400">
              {t("displayModes.frequency")}
            </Muted>
          </Div>
        </Div>

        <Separator className="border-gray-800 my-16" />

        {/* Embed / Demo */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-4 text-white">
            {t("embed.title")}
          </H2>
          <P className="text-gray-300 text-lg leading-relaxed mb-6">
            {t("embed.description")}
          </P>

          <Muted className="text-sm text-gray-500 mb-3 block">
            {t("embed.codeCaption", { appName: "unbottled.ai" })}
          </Muted>
          <Div className="mb-4">
            <CodeBlock language="typescript" code={embedCodeTs} />
          </Div>
          <Muted className="text-sm text-gray-500 mb-3 block">
            {t("embed.orScriptTag")}
          </Muted>
          <Div className="mb-8">
            <CodeBlock language="html" code={embedCodeHtml} />
          </Div>

          <VibeFrameDemo locale={locale} />

          <Div className="mt-6 bg-purple-950/30 border border-purple-700/50 rounded-xl p-5">
            <P className="text-purple-200 text-sm leading-relaxed">
              {t("embed.adminDescription")}
            </P>
          </Div>
        </Div>

        <Separator className="border-gray-800 my-16" />

        {/* Vibe Sense Side Effect */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-8 text-white">
            {t("vibeSense.title")}
          </H2>
          <P className="text-gray-300 text-lg leading-relaxed mb-6">
            {t("vibeSense.paragraph1")}
          </P>
          <P className="text-gray-300 text-lg leading-relaxed mb-6">
            {t("vibeSense.paragraph2")}
          </P>
          <Div className="bg-emerald-950/30 border border-emerald-700/50 rounded-xl p-6 my-8">
            <P className="text-emerald-200 italic text-lg leading-relaxed">
              {t("vibeSense.paragraph3")}
            </P>
          </Div>
        </Div>

        <Separator className="border-gray-800 my-16" />

        {/* Federated Embedding */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-8 text-white">
            {t("federated.title")}
          </H2>
          <P className="text-gray-300 text-lg leading-relaxed mb-8">
            {t("federated.description")}
          </P>

          <Muted className="text-sm text-gray-500 mb-3 block">
            {t("federated.codeCaption")}
          </Muted>
          <Div className="mb-8">
            <CodeBlock language="typescript" code={federatedCode} />
          </Div>

          <Div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <P className="text-gray-200 font-semibold text-lg text-center">
              {t("federated.principle")}
            </P>
          </Div>
        </Div>

        <Separator className="border-gray-800 my-16" />

        {/* Tool Discovery & Invocation */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-4 text-white">
            {t("skills.title")}
          </H2>
          <P className="text-gray-300 text-lg leading-relaxed mb-6">
            {t("skills.intro")}
          </P>
          <P className="text-gray-300 text-lg leading-relaxed mb-6">
            {t("skills.discovery")}
          </P>
          <P className="text-gray-300 text-lg leading-relaxed mb-10">
            {t("skills.control")}
          </P>

          <Div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-10 text-center">
            <P className="text-2xl font-bold text-white">
              {t("skills.keyLine")}
            </P>
          </Div>

          {/* Skills as persona layer */}
          <H3 className="text-xl font-semibold mb-4 text-gray-200">
            {t("skills.skillsTitle")}
          </H3>
          <P className="text-gray-300 text-lg leading-relaxed mb-6">
            {t("skills.skillsDescription")}
          </P>

          <Div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="bg-blue-950/30 border-blue-700/50">
              <CardHeader>
                <Div className="flex items-center gap-2">
                  <Div className="w-8 h-8 rounded-full bg-blue-700/50 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-blue-300" />
                  </Div>
                  <CardTitle className="text-blue-300 text-base">
                    {t("skills.userPerspective")}
                  </CardTitle>
                </Div>
              </CardHeader>
              <CardContent>
                <P className="text-gray-300 text-sm leading-relaxed">
                  {t("skills.userDescription")}
                </P>
              </CardContent>
            </Card>

            <Card className="bg-purple-950/30 border-purple-700/50">
              <CardHeader>
                <Div className="flex items-center gap-2">
                  <Div className="w-8 h-8 rounded-full bg-purple-700/50 flex items-center justify-center">
                    <Code className="h-4 w-4 text-purple-300" />
                  </Div>
                  <CardTitle className="text-purple-300 text-base">
                    {t("skills.aiPerspective")}
                  </CardTitle>
                </Div>
              </CardHeader>
              <CardContent>
                <P className="text-gray-300 text-sm leading-relaxed">
                  {t("skills.aiDescription")}
                </P>
              </CardContent>
            </Card>
          </Div>
        </Div>

        <Separator className="border-gray-800 my-16" />

        {/* Remote Execution */}
        <Div className="mb-20">
          <H2 className="text-3xl font-bold mb-8 text-white">
            {t("remoteExecution.title")}
          </H2>
          <P className="text-gray-300 text-lg leading-relaxed mb-6">
            {t("remoteExecution.paragraph1")}
          </P>
          <P className="text-gray-300 text-lg leading-relaxed mb-6">
            {t("remoteExecution.paragraph2")}
          </P>
          <P className="text-gray-300 text-lg leading-relaxed mb-8">
            {t("remoteExecution.paragraph3")}
          </P>

          {/* Flow diagram */}
          <Div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 mb-8">
            <Div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Div className="flex-1 bg-blue-950/50 border border-blue-700 rounded-xl p-4 text-center">
                <Div className="text-blue-300 font-bold text-sm mb-1">
                  {t("remoteExecution.diagramAI")}
                </Div>
                <Div className="text-blue-500 font-mono text-xs">
                  {t("remoteExecution.diagramExecute")}
                </Div>
              </Div>
              <Div className="flex flex-col items-center gap-1 flex-shrink-0">
                <Div className="hidden md:block w-12 h-0.5 bg-purple-500" />
                <Muted className="text-xs text-gray-500 text-center">
                  {t("remoteExecution.diagramAILabel")}
                </Muted>
              </Div>
              <Div className="flex-1 bg-emerald-950/50 border border-emerald-700 rounded-xl p-4 text-center">
                <Div className="text-emerald-300 font-bold text-sm mb-1">
                  {t("remoteExecution.diagramRemote")}
                </Div>
                <Muted className="text-xs text-gray-500">
                  {t("remoteExecution.diagramRemoteLabel")}
                </Muted>
              </Div>
              <Div className="flex flex-col items-center gap-1 flex-shrink-0">
                <Div className="hidden md:block w-12 h-0.5 bg-purple-500" />
                <Muted className="text-xs text-gray-500 text-center">
                  {t("remoteExecution.diagramWidgetLabel")}
                </Muted>
              </Div>
              <Div className="flex-1 bg-purple-950/50 border border-purple-700 rounded-xl p-4 text-center">
                <Div className="text-purple-300 font-bold text-sm mb-1">
                  {t("remoteExecution.diagramVibeFrame")}
                </Div>
                <Div className="text-purple-500 font-mono text-xs">
                  {t("remoteExecution.diagramWidget")}
                </Div>
              </Div>
            </Div>
          </Div>

          <Div className="bg-amber-950/30 border border-amber-700/50 rounded-xl p-6">
            <P className="text-amber-200 leading-relaxed">
              {t("remoteExecution.callout")}
            </P>
          </Div>
        </Div>

        <Separator className="border-gray-800 my-16" />

        {/* Close */}
        <Div className="mb-16">
          <H2 className="text-3xl font-bold mb-8 text-white">
            {t("close.title")}
          </H2>

          <P className="text-gray-300 text-lg leading-relaxed mb-10">
            {t("close.paragraph")}
          </P>

          <Div className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-12 text-center">
            <P className="text-xl font-semibold text-white mb-0">
              {t("close.together")}
            </P>
          </Div>

          {/* GitHub */}
          <H3 className="text-xl font-semibold mb-4 text-gray-200">
            {t("close.github")}
          </H3>
          <Div className="mb-12">
            <CodeBlock
              language="bash"
              code={`${t("close.githubCode")}
cd next-vibe
cp .env.example .env
bun install
vibe dev`}
            />
          </Div>

          {/* Final line */}
          <Div className="bg-gray-900 border border-gray-700 rounded-2xl p-10 text-center">
            <P className="text-2xl font-bold text-white leading-relaxed">
              {t("close.finalLine")}
            </P>
          </Div>
        </Div>

        <Div className="flex justify-between items-center pt-8">
          <Button
            asChild
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <Link href={`/${locale}/story/blog`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("hero.backToBlog")}
            </Link>
          </Button>
          <Button asChild className="bg-purple-700 hover:bg-purple-600">
            <Link
              href="https://github.com/techfreaque/next-vibe"
              target="_blank"
            >
              {t("close.github")}
            </Link>
          </Button>
        </Div>
      </Div>
    </Div>
  );
}

export default async function FiredPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
