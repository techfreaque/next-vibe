"use client";

import { motion } from "framer-motion";
import { ArrowDown, Play } from "lucide-react";
import Image from "next/image";
import { Button } from "next-vibe-ui/ui/button";
import { Div, Span } from "next-vibe-ui/ui";
import { Link } from "next-vibe-ui/ui/link";
import { H1, P } from "next-vibe-ui/ui";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { clientCount } from "./tmp-contants";

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
                <Link href={`/${locale}/user/signup`}>
                  {t("app.story._components.home.hero.cta")}
                  <Play className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group" asChild>
                <Link href={`/${locale}#brands`}>
                  <ArrowDown className="mr-2 h-4 w-4 fill-blue-600 text-blue-600 group-hover:fill-blue-700 group-hover:text-blue-700" />
                  {t("app.story._components.home.hero.learnMore")}
                </Link>
              </Button>
            </Div>
            <Div className="flex items-center gap-4 pt-4">
              <Div className="flex -space-x-2">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&auto=format&fit=crop&crop=face"
                  width={40}
                  height={40}
                  alt={t("app.story._components.home.hero.userAvatarAlt")}
                  className="rounded-full border-2 border-white dark:border-gray-800"
                />
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&auto=format&fit=crop&crop=face"
                  width={40}
                  height={40}
                  alt={t("app.story._components.home.hero.userAvatarAlt")}
                  className="rounded-full border-2 border-white dark:border-gray-800"
                />
                <Image
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=40&h=40&auto=format&fit=crop&crop=face"
                  width={40}
                  height={40}
                  alt={t("app.story._components.home.hero.userAvatarAlt")}
                  className="rounded-full border-2 border-white dark:border-gray-800"
                />
              </Div>
              <Div className="text-sm text-gray-500 dark:text-gray-400">
                <Span className="font-semibold text-gray-900 dark:text-white">
                  {clientCount}+
                </Span>{" "}
                {t("app.story._components.home.hero.satisfiedClients")}
              </Div>
            </Div>
          </motion.div>
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Div className="relative w-full max-w-[600px] aspect-video md:aspect-square">
              <Div className="absolute inset-0 rounded-2xl bg-cyan-500/20 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl -z-10" />
              <Div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=600&auto=format&fit=crop"
                  alt={t("app.story._components.home.hero.imageAlt")}
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                  priority
                />
                <Div className="absolute inset-0 bg-black/40 bg-gradient-to-tr from-black/40 via-black/0 to-black/0 rounded-2xl" />
                <Div className="absolute bottom-0 left-0 p-6">
                  <Div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
                    <Div className="flex items-center gap-3 mb-3">
                      <Div className="h-3 w-3 rounded-full bg-blue-500" />
                      <Span className="text-sm font-medium">
                        {t(
                          "app.story._components.home.hero.imageOverlay.title",
                        )}
                      </Span>
                    </Div>

                    <Div className="grid grid-cols-2 gap-4">
                      {/* Yearly Growth with Chart */}
                      <Div className="col-span-2 flex items-center justify-between gap-3 bg-blue-50/50 dark:bg-blue-900/20 p-2 rounded-md">
                        <Div>
                          <P className="text-xs text-gray-500 dark:text-gray-400">
                            {t(
                              "app.story._components.home.hero.imageOverlay.metrics.yearlyGrowth.label",
                            )}
                          </P>
                          <P className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {t(
                              "app.story._components.home.hero.imageOverlay.metrics.yearlyGrowth.value",
                              { growth: 187 },
                            )}
                          </P>
                        </Div>
                        <Div className="h-10 w-20 bg-blue-500/20 rounded-md flex items-end">
                          <Div className="w-2 h-3 bg-blue-500 rounded-t-sm mx-0.5" />
                          <Div className="w-2 h-5 bg-blue-500 rounded-t-sm mx-0.5" />
                          <Div className="w-2 h-7 bg-blue-500 rounded-t-sm mx-0.5" />
                          <Div className="w-2 h-6 bg-blue-500 rounded-t-sm mx-0.5" />
                          <Div className="w-2 h-8 bg-blue-500 rounded-t-sm mx-0.5" />
                          <Div className="w-2 h-10 bg-blue-500 rounded-t-sm mx-0.5" />
                        </Div>
                      </Div>

                      {/* Engagement Rate */}
                      <Div className="p-2 bg-green-50/50 dark:bg-green-900/20 rounded-md">
                        <P className="text-xs text-gray-500 dark:text-gray-400">
                          {t(
                            "app.story._components.home.hero.imageOverlay.metrics.engagement.label",
                          )}
                        </P>
                        <P className="text-md font-bold text-green-600 dark:text-green-400">
                          {t(
                            "app.story._components.home.hero.imageOverlay.metrics.engagement.value",
                            { engagement: 42 },
                          )}
                        </P>
                      </Div>

                      {/* Reach Increase */}
                      <Div className="p-2 bg-purple-50/50 dark:bg-purple-900/20 rounded-md">
                        <P className="text-xs text-gray-500 dark:text-gray-400">
                          {t(
                            "app.story._components.home.hero.imageOverlay.metrics.reach.label",
                          )}
                        </P>
                        <P className="text-md font-bold text-purple-600 dark:text-purple-400">
                          {t(
                            "app.story._components.home.hero.imageOverlay.metrics.reach.value",
                            { reach: 215 },
                          )}
                        </P>
                      </Div>
                    </Div>
                  </Div>
                </Div>
              </Div>
            </Div>
          </motion.div>
        </Div>
      </Div>
    </section>
  );
};

export default Hero;
