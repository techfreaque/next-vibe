"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Section } from "next-vibe-ui/ui/section";
import { H2, P } from "next-vibe-ui/ui/typography";
import type { FC } from "react";
import { useInView } from "react-intersection-observer";

import { TOTAL_MODEL_COUNT } from "@/app/api/[locale]/agent/models/models";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface CallToActionProps {
  locale: CountryLanguage;
}

const CallToAction: FC<CallToActionProps> = ({ locale }) => {
  const { t } = simpleT(locale);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Section id="contact" className="container px-4 md:px-6 py-24 md:py-32">
      <Div ref={ref as never}>
        <MotionDiv
          className="rounded-3xl overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background with overlay */}
          <Div className="absolute inset-0 bg-blue-600 bg-linear-to-br from-cyan-500 to-blue-600" />
          <Div className="absolute inset-0 bg-blue-500/20 bg-linear-to-br from-blue-500/20 to-cyan-500/20 mix-blend-overlay opacity-50" />

          {/* Content */}
          <Div className="relative p-8 md:p-16 text-white text-center">
            <Div className="max-w-3xl mx-auto">
              <H2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 leading-tight">
                {t("app.story._components.home.cta.title")}
              </H2>
              <P className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8 leading-relaxed">
                {t("app.story._components.home.cta.subtitle", {
                  modelCount: TOTAL_MODEL_COUNT,
                })}
              </P>

              <Div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 px-8"
                  asChild
                >
                  <Link href={`/${locale}/user/signup`}>
                    {t("app.story._components.home.cta.signUp")}
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link href={`/${locale}/subscription/buy`}>
                    {t("app.story._components.home.cta.viewPlans")}
                  </Link>
                </Button>
              </Div>
            </Div>
          </Div>
        </MotionDiv>
      </Div>
    </Section>
  );
};

export default CallToAction;
