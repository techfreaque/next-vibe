"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardHeader } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Cloud } from "next-vibe-ui/ui/icons/Cloud";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { Layers } from "next-vibe-ui/ui/icons/Layers";
import { Link } from "next-vibe-ui/ui/link";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useInView } from "react-intersection-observer";

import { FREE_CREDIT_POOL } from "@/app/api/[locale]/credits/constants";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface CloudVsSelfHostProps {
  locale: CountryLanguage;
  subPrice: number;
  subCurrency: string;
  totalToolCount: number;
  totalModelCount: number;
  totalSkillCount: number;
}

export function CloudVsSelfHost({
  locale,
  subPrice,
  subCurrency,
  totalToolCount,
  totalModelCount,
  totalSkillCount,
}: CloudVsSelfHostProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const interpolation = {
    modelCount: totalModelCount,
    skillCount: totalSkillCount,
    subPrice,
    subCurrency,
    freeCredits: FREE_CREDIT_POOL,
    endpointCount: totalToolCount,
  };

  const cloudFeatures = [
    t("home.paths.cloud.features.models", interpolation),
    t("home.paths.cloud.features.memory", interpolation),
    t("home.paths.cloud.features.search", interpolation),
    t("home.paths.cloud.features.credits", interpolation),
    t("home.paths.cloud.features.noSetup", interpolation),
  ];

  const personalFeatures = [
    t("home.paths.personal.features.everything", interpolation),
    t("home.paths.personal.features.admin", interpolation),
    t("home.paths.personal.features.heartbeat", interpolation),
    t("home.paths.personal.features.byoKeys", interpolation),
    t("home.paths.personal.features.privacy", interpolation),
    t("home.paths.personal.features.localSync", interpolation),
  ];

  const selfHostFeatures = [
    t("home.paths.selfHost.features.everything", interpolation),
    t("home.paths.selfHost.features.production", interpolation),
    t("home.paths.selfHost.features.extend", interpolation),
    t("home.paths.selfHost.features.launch", interpolation),
    t("home.paths.selfHost.features.agent", interpolation),
  ];

  return (
    <Div className="relative overflow-hidden" ref={ref as never}>
      <Div className="absolute inset-0 bg-linear-to-b from-background via-muted/10 to-background" />

      <Div className="container relative px-4 md:px-6 py-24 md:py-32">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <Div className="text-center mb-12">
            <H2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              {t("home.paths.title")}
            </H2>
            <P className="mx-auto max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
              {t("home.paths.subtitle")}
            </P>
          </Div>

          <Div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Cloud Card */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="h-full border-2 hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden">
                <Div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-cyan-500 to-blue-500" />
                <CardHeader className="space-y-4">
                  <Div className="flex items-center gap-3">
                    <Div className="p-2 w-12 h-12 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center">
                      <Cloud className="h-7 w-7 text-cyan-500" />
                    </Div>
                    <Div>
                      <P className="text-xs font-medium text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                        {t("home.paths.cloud.badge")}
                      </P>
                      <H3 className="text-xl font-bold">
                        {t("home.paths.cloud.title")}
                      </H3>
                    </Div>
                  </Div>
                  <P className="text-muted-foreground">
                    {t("home.paths.cloud.tagline", interpolation)}
                  </P>
                  <Div className="space-y-3">
                    {cloudFeatures.map((feature) => (
                      <Div key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-cyan-500 mt-1 shrink-0" />
                        <P className="text-sm">{feature}</P>
                      </Div>
                    ))}
                  </Div>
                  <Button size="lg" className="w-full text-base mt-4" asChild>
                    <Link href={`/${locale}/threads`}>
                      {t("home.paths.cloud.cta")}
                    </Link>
                  </Button>
                </CardHeader>
              </Card>
            </MotionDiv>

            {/* Personal Dashboard Card */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="h-full border-2 hover:border-violet-500/50 transition-all duration-300 relative overflow-hidden">
                <Div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-violet-500 to-purple-500" />
                <CardHeader className="space-y-4">
                  <Div className="flex items-center gap-3">
                    <Div className="p-2 w-12 h-12 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
                      <Layers className="h-7 w-7 text-violet-500" />
                    </Div>
                    <Div>
                      <P className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                        {t("home.paths.personal.badge")}
                      </P>
                      <H3 className="text-xl font-bold">
                        {t("home.paths.personal.title")}
                      </H3>
                    </Div>
                  </Div>
                  <P className="text-muted-foreground">
                    {t("home.paths.personal.tagline", interpolation)}
                  </P>
                  <Div className="space-y-3">
                    {personalFeatures.map((feature) => (
                      <Div key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-violet-500 mt-1 shrink-0" />
                        <P className="text-sm">{feature}</P>
                      </Div>
                    ))}
                  </Div>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full text-base mt-4 border-violet-500/40 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10"
                    asChild
                  >
                    <Link href={`/${locale}/story/self-host`}>
                      {t("home.paths.personal.cta")}
                    </Link>
                  </Button>
                </CardHeader>
              </Card>
            </MotionDiv>

            {/* Self-Host SaaS Card */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="h-full border-2 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden">
                <Div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-indigo-500" />
                <CardHeader className="space-y-4">
                  <Div className="flex items-center gap-3">
                    <Div className="p-2 w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                      <Code className="h-7 w-7 text-blue-500" />
                    </Div>
                    <Div>
                      <P className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                        {t("home.paths.selfHost.badge")}
                      </P>
                      <H3 className="text-xl font-bold">
                        {t("home.paths.selfHost.title")}
                      </H3>
                    </Div>
                  </Div>
                  <P className="text-muted-foreground">
                    {t("home.paths.selfHost.tagline", interpolation)}
                  </P>
                  <Div className="space-y-3">
                    {selfHostFeatures.map((feature) => (
                      <Div key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-blue-500 mt-1 shrink-0" />
                        <P className="text-sm">{feature}</P>
                      </Div>
                    ))}
                  </Div>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full text-base mt-4"
                    asChild
                  >
                    <Link href={`/${locale}/story/framework`}>
                      {t("home.paths.selfHost.cta")}
                    </Link>
                  </Button>
                </CardHeader>
              </Card>
            </MotionDiv>
          </Div>
        </MotionDiv>
      </Div>
    </Div>
  );
}
