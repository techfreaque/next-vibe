"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { Layers } from "next-vibe-ui/ui/icons/Layers";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Link } from "next-vibe-ui/ui/link";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { H2, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useInView } from "react-intersection-observer";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface SelfHostSectionProps {
  locale: CountryLanguage;
}

export function SelfHostSection({ locale }: SelfHostSectionProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Div className="bg-muted/30" ref={ref as never}>
      <Div className="container px-4 md:px-6 py-24 md:py-32">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <Div className="text-center mb-12">
            <P className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
              {t("home.selfHost.subtitle")}
            </P>
            <H2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              {t("home.selfHost.title")}
            </H2>
            <P className="mx-auto max-w-[800px] text-gray-500 dark:text-gray-400 md:text-xl">
              {t("home.selfHost.description")}
            </P>
          </Div>

          <Div className="grid gap-6 md:grid-cols-3 mb-10">
            <Card className="border-2 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader>
                <Div className="mb-2 p-2 w-14 h-14 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-500" />
                </Div>
                <CardTitle>{t("home.selfHost.typeSafe.title")}</CardTitle>
                <CardDescription className="text-base">
                  {t("home.selfHost.typeSafe.description")}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-cyan-500/50 transition-all duration-300">
              <CardHeader>
                <Div className="mb-2 p-2 w-14 h-14 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center">
                  <Layers className="h-8 w-8 text-cyan-500" />
                </Div>
                <CardTitle>{t("home.selfHost.tenPlatforms.title")}</CardTitle>
                <CardDescription className="text-base">
                  {t("home.selfHost.tenPlatforms.description")}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader>
                <Div className="mb-2 p-2 w-14 h-14 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <Code className="h-8 w-8 text-blue-500" />
                </Div>
                <CardTitle>{t("home.selfHost.production.title")}</CardTitle>
                <CardDescription className="text-base">
                  {t("home.selfHost.production.description")}
                </CardDescription>
              </CardHeader>
            </Card>
          </Div>

          <Div className="text-center">
            <Button size="lg" variant="outline" className="text-base" asChild>
              <Link href={`/${locale}/story/framework`}>
                <Code className="mr-2 h-5 w-5" />
                {t("home.selfHost.cta")}
              </Link>
            </Button>
          </Div>
        </MotionDiv>
      </Div>
    </Div>
  );
}
