"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Clock, Shield, Wrench } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { H2, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useInView } from "react-intersection-observer";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface AgentSectionProps {
  locale: CountryLanguage;
  totalToolCount: number;
}

export function AgentSection({
  locale,
  totalToolCount,
}: AgentSectionProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Div className="relative overflow-hidden" ref={ref as never}>
      {/* Subtle gradient background */}
      <Div className="absolute inset-0 bg-linear-to-b from-background via-muted/10 to-background" />

      <Div className="container relative px-4 md:px-6 py-24 md:py-32">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <Div className="text-center mb-12">
            <P className="text-sm font-medium text-cyan-600 dark:text-cyan-400 mb-2">
              {t("home.agent.subtitle")}
            </P>
            <H2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              {t("home.agent.title")}
            </H2>
            <P className="mx-auto max-w-[800px] text-gray-500 dark:text-gray-400 md:text-xl">
              {t("home.agent.description", { toolCount: totalToolCount })}
            </P>
          </Div>

          <MotionDiv
            className="grid gap-6 md:grid-cols-3 mb-10"
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            <MotionDiv variants={item}>
              <Card className="h-full border-2 hover:border-cyan-500/50 transition-all duration-300 group">
                <CardHeader>
                  <Div className="mb-2 p-2 w-14 h-14 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/50 transition-colors duration-300">
                    <Clock className="h-8 w-8 text-cyan-500" />
                  </Div>
                  <CardTitle className="group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                    {t("home.agent.cron.title")}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {t("home.agent.cron.description")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </MotionDiv>

            <MotionDiv variants={item}>
              <Card className="h-full border-2 hover:border-blue-500/50 transition-all duration-300 group">
                <CardHeader>
                  <Div className="mb-2 p-2 w-14 h-14 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                    <Wrench className="h-8 w-8 text-blue-500" />
                  </Div>
                  <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {t("home.agent.tools.title", {
                      toolCount: totalToolCount,
                    })}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {t("home.agent.tools.description")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </MotionDiv>

            <MotionDiv variants={item}>
              <Card className="h-full border-2 hover:border-cyan-500/50 transition-all duration-300 group">
                <CardHeader>
                  <Div className="mb-2 p-2 w-14 h-14 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/50 transition-colors duration-300">
                    <Shield className="h-8 w-8 text-cyan-500" />
                  </Div>
                  <CardTitle className="group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                    {t("home.agent.secure.title")}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {t("home.agent.secure.description")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </MotionDiv>
          </MotionDiv>

          <Div className="text-center">
            <Button size="lg" variant="outline" className="text-base" asChild>
              <Link href={`/${locale}/story/framework`}>
                <Wrench className="mr-2 h-5 w-5" />
                {t("home.agent.cta")}
              </Link>
            </Button>
          </Div>
        </MotionDiv>
      </Div>
    </Div>
  );
}
