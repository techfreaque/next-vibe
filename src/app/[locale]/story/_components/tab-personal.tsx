"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Link } from "next-vibe-ui/ui/link";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Section } from "next-vibe-ui/ui/section";
import { H2, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useInView } from "react-intersection-observer";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";
import { PersonalShowcase } from "./personal-showcase";
import { SelfHostSection } from "./self-host-section";

interface TabPersonalProps {
  locale: CountryLanguage;
  totalToolCount: number;
  hasUser: boolean;
}

export function TabPersonal({
  locale,
  totalToolCount,
}: TabPersonalProps): JSX.Element {
  return (
    <>
      <PersonalShowcase locale={locale} />
      <SelfHostSection locale={locale} totalToolCount={totalToolCount} />
      <PersonalCta locale={locale} />
    </>
  );
}

function PersonalCta({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Section className="relative overflow-hidden bg-[#000d0a]">
      <Div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(16,185,129,0.15)_0%,transparent_70%)]" />
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
            {t("home.ctaPersonal.title")}
          </H2>
          <P className="text-base md:text-lg text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
            {t("home.ctaPersonal.subtitle")}
          </P>
          <Div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 font-semibold shadow-lg shadow-emerald-900/40 px-8"
              asChild
            >
              <Link href={`/${locale}/story/self-host`}>
                {t("home.ctaPersonal.primary")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white/20 text-white/80 hover:bg-white/8 hover:text-white hover:border-white/40 font-semibold px-8"
              asChild
            >
              <Link href="https://github.com/unbottled-ai/next-vibe">
                {t("home.ctaPersonal.secondary")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Div>
        </MotionDiv>
      </Div>
    </Section>
  );
}
