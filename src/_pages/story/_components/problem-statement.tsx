"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { MotionDiv } from "next-vibe/ui/components/motion";
import { H2, P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { scopedTranslation } from "./i18n";

interface ProblemStatementProps {
  locale: CountryLanguage;
}

export function ProblemStatement({
  locale,
}: ProblemStatementProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  return (
    <Div className="container relative px-4 md:px-6 py-24 md:py-32">
      <MotionDiv
        className="mx-auto max-w-3xl"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <H2 className="mb-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          {t("home.problem.title")}
        </H2>
        <Div className="space-y-4">
          <P className="text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
            {t("home.problem.line1")}
          </P>
        </Div>
      </MotionDiv>
    </Div>
  );
}
