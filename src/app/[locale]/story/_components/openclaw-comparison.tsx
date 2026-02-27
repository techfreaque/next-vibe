"use client";

import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H2, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useInView } from "react-intersection-observer";

import { TOTAL_CHARACTER_COUNT } from "@/app/api/[locale]/agent/models/models";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface OpenClawComparisonProps {
  locale: CountryLanguage;
  totalToolCount: number;
}

interface ComparisonCardProps {
  label: string;
  themLabel: string;
  them: string;
  usLabel: string;
  us: string;
  whyItMatters: string;
  delay: number;
  inView: boolean;
}

function ComparisonCard({
  label,
  themLabel,
  them,
  usLabel,
  us,
  whyItMatters,
  delay,
  inView,
}: ComparisonCardProps): JSX.Element {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="h-full border-2 hover:border-primary/30 transition-colors duration-300">
        <CardContent className="p-6 space-y-4">
          <Span className="text-sm font-medium text-primary uppercase tracking-wider">
            {label}
          </Span>

          <Div className="space-y-3">
            <Div>
              <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {themLabel}
              </Span>
              <P className="text-sm text-muted-foreground mt-1">{them}</P>
            </Div>

            <Div>
              <Span className="text-xs font-medium text-primary uppercase tracking-wide">
                {usLabel}
              </Span>
              <P className="text-sm mt-1">{us}</P>
            </Div>
          </Div>

          <Div className="pt-3 border-t">
            <P className="text-sm italic text-muted-foreground">
              {whyItMatters}
            </P>
          </Div>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}

export function OpenClawComparison({
  locale,
  totalToolCount,
}: OpenClawComparisonProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const interpolation = {
    skillCount: TOTAL_CHARACTER_COUNT,
    toolCount: totalToolCount,
  };

  return (
    <Div className="relative overflow-hidden" ref={ref as never}>
      <Div className="container relative px-4 md:px-6 py-24 md:py-32">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <Div className="text-center mb-12">
            <H2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              {t("home.comparison.title")}
            </H2>
            <P className="mx-auto max-w-[600px] text-muted-foreground md:text-lg">
              {t("home.comparison.subtitle")}
            </P>
          </Div>

          <Div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
            <ComparisonCard
              label={t("home.comparison.cards.architecture.label")}
              themLabel={t("home.comparison.themLabel")}
              them={t("home.comparison.cards.architecture.them")}
              usLabel={t("home.comparison.usLabel")}
              us={t("home.comparison.cards.architecture.us", interpolation)}
              whyItMatters={t(
                "home.comparison.cards.architecture.whyItMatters",
              )}
              delay={0.1}
              inView={inView}
            />
            <ComparisonCard
              label={t("home.comparison.cards.costControl.label")}
              themLabel={t("home.comparison.themLabel")}
              them={t("home.comparison.cards.costControl.them")}
              usLabel={t("home.comparison.usLabel")}
              us={t("home.comparison.cards.costControl.us")}
              whyItMatters={t("home.comparison.cards.costControl.whyItMatters")}
              delay={0.2}
              inView={inView}
            />
            <ComparisonCard
              label={t("home.comparison.cards.ownership.label")}
              themLabel={t("home.comparison.themLabel")}
              them={t("home.comparison.cards.ownership.them")}
              usLabel={t("home.comparison.usLabel")}
              us={t("home.comparison.cards.ownership.us")}
              whyItMatters={t("home.comparison.cards.ownership.whyItMatters")}
              delay={0.3}
              inView={inView}
            />
          </Div>
        </MotionDiv>
      </Div>
    </Div>
  );
}
