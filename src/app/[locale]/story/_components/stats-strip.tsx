"use client";

import { Div } from "next-vibe-ui/ui/div";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useInView } from "react-intersection-observer";

import {
  TOTAL_CHARACTER_COUNT,
  TOTAL_MODEL_COUNT,
} from "@/app/api/[locale]/agent/models/models";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface StatsStripProps {
  locale: CountryLanguage;
  totalEndpointCount: number;
}

export function StatsStrip({
  locale,
  totalEndpointCount,
}: StatsStripProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const stats = [
    { value: TOTAL_MODEL_COUNT.toString(), label: t("home.stats.models") },
    { value: `${TOTAL_CHARACTER_COUNT}+`, label: t("home.stats.skills") },
    { value: `${totalEndpointCount}+`, label: t("home.stats.endpoints") },
    {
      value: Object.keys(Platform).length + 1, // +1 for react-native which uses env
      label: t("home.stats.interfaces"),
    },
  ];

  return (
    <Div className="relative overflow-hidden bg-muted/30" ref={ref as never}>
      <Div className="container relative px-4 md:px-6 py-16 md:py-20">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <P className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider mb-10">
            {t("home.stats.title")}
          </P>
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <MotionDiv
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <P className="text-3xl md:text-4xl font-bold">{stat.value}</P>
                <P className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </P>
              </MotionDiv>
            ))}
          </Div>
        </MotionDiv>
      </Div>
    </Div>
  );
}
