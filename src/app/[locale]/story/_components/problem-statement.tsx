"use client";

import { Div } from "next-vibe-ui/ui/div";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { H2, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useInView } from "react-intersection-observer";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface ProblemStatementProps {
  locale: CountryLanguage;
  totalModelCount: number;
}

export function ProblemStatement({
  locale,
  totalModelCount,
}: ProblemStatementProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Div
      className="container relative px-4 md:px-6 py-24 md:py-32"
      ref={ref as never}
    >
      <MotionDiv
        className="max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <H2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-8">
          {t("home.problem.title")}
        </H2>
        <Div className="space-y-4">
          <P className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t("home.problem.line1")}
          </P>
          <P className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t("home.problem.line2")}
          </P>
          <P className="text-lg md:text-xl font-semibold text-foreground leading-relaxed">
            {t("home.problem.line3", {
              modelCount: String(totalModelCount),
            })}
          </P>
        </Div>
      </MotionDiv>
    </Div>
  );
}
