"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "next-vibe-ui/ui/button";
import type { FC } from "react";
import { useInView } from "react-intersection-observer";

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
    <section
      id="contact"
      className="container px-4 md:px-6 py-24 md:py-32"
      ref={ref}
    >
      <motion.div
        className="rounded-3xl overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600" />
        <div className="absolute inset-0 bg-blue-500/20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mix-blend-overlay opacity-50" />

        {/* Content */}
        <div className="relative p-8 md:p-16 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 leading-tight">
              {t("app.story._components.home.cta.title")}
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8 leading-relaxed">
              {t("app.story._components.home.cta.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 px-8"
                asChild
              >
                <Link href={`/${locale}/user/signup`}>
                  {t("app.story._components.home.cta.button")}
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href={`/${locale}#pricing`}>
                  {t("app.story._components.home.cta.viewPlans")}
                </Link>
              </Button>
            </div>

            <p className="text-sm mt-6 text-blue-100">
              {t("app.story._components.home.cta.noCredit")}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CallToAction;
