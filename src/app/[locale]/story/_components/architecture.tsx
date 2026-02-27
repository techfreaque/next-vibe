"use client";

import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight, Check } from "next-vibe-ui/ui/icons";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { H2, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useInView } from "react-intersection-observer";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface ArchitectureProps {
  locale: CountryLanguage;
}

export function Architecture({ locale }: ArchitectureProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const outputs = [
    { label: t("home.architecture.labels.web"), delay: 0.3 },
    { label: t("home.architecture.labels.cli"), delay: 0.4 },
    { label: t("home.architecture.labels.ai"), delay: 0.5 },
    { label: t("home.architecture.labels.mcp"), delay: 0.6 },
    { label: t("home.architecture.labels.cron"), delay: 0.7 },
  ];

  const points = [
    t("home.architecture.point1"),
    t("home.architecture.point2"),
    t("home.architecture.point3"),
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
          {/* Title */}
          <Div className="text-center mb-16">
            <H2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              {t("home.architecture.title")}
            </H2>
            <P className="mx-auto max-w-[800px] text-muted-foreground md:text-xl">
              {t("home.architecture.subtitle")}
            </P>
          </Div>

          {/* Visual: definition.ts → 5 outputs */}
          <Div className="mx-auto max-w-4xl mb-16">
            <Div className="flex flex-col md:flex-row items-center gap-6 md:gap-4">
              {/* Source */}
              <MotionDiv
                className="shrink-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
                }
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Div className="px-6 py-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 border-2 border-cyan-500/50 font-mono text-sm md:text-base font-semibold text-cyan-700 dark:text-cyan-300">
                  {t("home.architecture.labels.definition")}
                </Div>
              </MotionDiv>

              {/* Arrow */}
              <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0 rotate-90 md:rotate-0" />

              {/* Outputs */}
              <Div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 flex-1">
                {outputs.map((output) => (
                  <MotionDiv
                    key={output.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={
                      inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                    }
                    transition={{ delay: output.delay, duration: 0.3 }}
                  >
                    <Div className="px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-500/30 text-center text-sm font-medium text-blue-700 dark:text-blue-300">
                      {output.label}
                    </Div>
                  </MotionDiv>
                ))}
              </Div>
            </Div>
          </Div>

          {/* Bullet points */}
          <Div className="mx-auto max-w-2xl space-y-4">
            {points.map((point, i) => (
              <MotionDiv
                key={point}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
              >
                <Check className="h-5 w-5 text-cyan-500 mt-0.5 shrink-0" />
                <P className="text-base md:text-lg text-muted-foreground">
                  {point}
                </P>
              </MotionDiv>
            ))}
          </Div>
        </MotionDiv>
      </Div>
    </Div>
  );
}
