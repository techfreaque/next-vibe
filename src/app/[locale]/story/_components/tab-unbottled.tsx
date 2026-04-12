"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Link } from "next-vibe-ui/ui/link";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Section } from "next-vibe-ui/ui/section";
import { Span } from "next-vibe-ui/ui/span";
import { H2, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useInView } from "react-intersection-observer";

import type { ModelCountsByContentLevel } from "@/app/api/[locale]/agent/models/all-models";
import type { CountryLanguage } from "@/i18n/core/config";

import { CapabilityShowcase } from "./capability-showcase";
import { scopedTranslation } from "./i18n";
import { ProblemStatement } from "./problem-statement";

interface TabUnbottledProps {
  locale: CountryLanguage;
  totalToolCount: number;
  totalModelCount: number;
  totalProviderCount: number;
  modelCountsByTier: ModelCountsByContentLevel;
  hasUser: boolean;
}

export function TabUnbottled({
  locale,
  totalToolCount,
  totalModelCount,
  totalProviderCount,
  modelCountsByTier,
  hasUser,
}: TabUnbottledProps): JSX.Element {
  return (
    <>
      <ProblemStatement locale={locale} />
      <CapabilityShowcase
        locale={locale}
        totalToolCount={totalToolCount}
        totalModelCount={totalModelCount}
        totalProviderCount={totalProviderCount}
        modelCountsByTier={modelCountsByTier}
      />
      <UnbottledCta
        locale={locale}
        totalModelCount={totalModelCount}
        hasUser={hasUser}
      />
    </>
  );
}

function UnbottledCta({
  locale,
  totalModelCount,
  hasUser,
}: {
  locale: CountryLanguage;
  totalModelCount: number;
  hasUser: boolean;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Section className="relative overflow-hidden bg-[#07000f]">
      <Div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(139,92,246,0.18)_0%,transparent_70%)]" />
      <Div
        className="container relative px-4 md:px-6 py-24 md:py-32"
        ref={ref as never}
      >
        <MotionDiv
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6 }}
        >
          <H2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[0.95] mb-6">
            {t("home.ctaUnbottled.title")}
          </H2>
          <P className="text-base md:text-lg text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
            {t("home.ctaUnbottled.subtitle", {
              modelCount: String(totalModelCount),
            })}
          </P>
          <Div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-500 text-white border-0 font-semibold shadow-lg shadow-violet-900/40 px-8"
              asChild
            >
              <Link href={`/${locale}/threads`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                {t("home.ctaUnbottled.primary")}
              </Link>
            </Button>
            {!hasUser && (
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white/20 text-white/80 hover:bg-white/8 hover:text-white hover:border-white/40 font-semibold px-8"
                asChild
              >
                <Link href={`/${locale}/user/(auth)/signup`}>
                  {t("home.ctaUnbottled.secondary")}
                  <Span className="ml-1.5 text-white/40 text-xs font-normal">
                    {t("home.ctaUnbottled.secondarySub")}
                  </Span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </Div>
        </MotionDiv>
      </Div>
    </Section>
  );
}
