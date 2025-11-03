"use client";

import { motion } from "framer-motion";
import { ArrowDown, Play } from "lucide-react";
import { Button } from "next-vibe-ui/ui/button";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

const Hero = ({ locale }: { locale: CountryLanguage }): JSX.Element => {
  const { t } = simpleT(locale);

  return (
    <section className="w-full relative">
      {/* Background elements */}
      <Div className="absolute inset-0 bg-blue-50 bg-gradient-to-b from-blue-50 to-white dark:bg-gray-900 dark:from-gray-900 dark:to-background -z-10" />
      <Div className="absolute top-0 right-0 -z-10 opacity-70 dark:opacity-30">
        <svg
          width="800"
          height="800"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="400" cy="400" r="400" fill="url(#paint0_radial)" />
          <defs>
            <radialGradient
              id="paint0_radial"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(400 400) rotate(90) scale(400)"
            >
              <stop stopColor="#0EA5E9" />
              <stop offset="1" stopColor="#0EA5E9" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </Div>

      <Div className="container px-4 md:px-6 py-20 md:py-32">
        <Div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div
            className="flex flex-col justify-center space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mb-2 w-fit">
              <Span className="font-medium">
                {t("app.story._components.home.hero.badge")}
              </Span>
            </Div>
            <H1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 leading-[1.15]">
              {t("app.story._components.home.hero.title")}
            </H1>
            <P className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-[600px] leading-relaxed">
              {t("app.story._components.home.hero.subtitle")}
            </P>
            <P className="text-gray-500 md:text-lg dark:text-gray-400 max-w-[600px] leading-relaxed">
              {t("app.story._components.home.hero.description")}
            </P>
            <Div className="flex flex-col sm:flex-row gap-3 pt-3">
              <Button
                size="lg"
                className="bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700 text-white font-medium px-8"
                asChild
              >
                <Link href={`/${locale}`}>
                  {t("app.story._components.home.hero.cta")}
                  <Play className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group" asChild>
                <Link href={`/${locale}/threads/public`}>
                  <ArrowDown className="mr-2 h-4 w-4 fill-blue-600 text-blue-600 group-hover:fill-blue-700 group-hover:text-blue-700" />
                  {t("app.story._components.home.hero.secondaryCta")}
                </Link>
              </Button>
            </Div>

          </motion.div>

        </Div>
      </Div>
    </section>
  );
};

export default Hero;
