"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  PenTool,
} from "lucide-react";
import Image from "next/image";
import type React from "react";
import type { FC } from "react";
import { useInView } from "react-intersection-observer";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ProcessProps {
  locale: CountryLanguage;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

const Process: FC<ProcessProps> = ({ locale }) => {
  const { t } = simpleT(locale);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps: ProcessStep[] = [
    {
      number: "01",
      title: t("app.site.home.process.steps.strategyDevelopment.title"),
      description: t(
        "app.site.home.process.steps.strategyDevelopment.description",
      ),
      icon: <Lightbulb className="h-8 w-8 text-amber-500" />,
      image: "/images/process/strategy.png",
    },
    {
      number: "02",
      title: t("app.site.home.process.steps.contentCreation.title"),
      description: t("app.site.home.process.steps.contentCreation.description"),
      icon: <PenTool className="h-8 w-8 text-blue-500" />,
      image: "/images/process/content.png",
    },
    {
      number: "03",
      title: t("app.site.home.process.steps.publishingManagement.title"),
      description: t(
        "app.site.home.process.steps.publishingManagement.description",
      ),
      icon: <MessageSquare className="h-8 w-8 text-green-500" />,
      image: "/images/process/publishing.png",
    },
    {
      number: "04",
      title: t("app.site.home.process.steps.analysisOptimization.title"),
      description: t(
        "app.site.home.process.steps.analysisOptimization.description",
      ),
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
      image: "/images/process/analysis.png",
    },
  ];

  return (
    <section
      id="process"
      className="w-full py-24 bg-white bg-gradient-to-b from-white to-gray-50 dark:bg-gray-950 dark:from-gray-950 dark:to-gray-900"
      ref={ref}
    >
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mb-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-medium">
              {t("app.site.home.process.badge")}
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("app.site.home.process.title")}{" "}
          </motion.h2>

          <motion.p
            className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("app.site.home.process.subtitle")}
          </motion.p>
        </div>

        <div className="space-y-24 relative">
          {steps.map((step, index) => (
            <motion.div
              // eslint-disable-next-line i18next/no-literal-string
              key={`step_${index}_${step.title}`}
              className={`relative ${index % 2 === 0 ? "" : "md:flex-row-reverse"} md:flex items-center gap-8 lg:gap-16`}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
            >
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[39px] top-[160px] bottom-[-160px] w-0.5 bg-blue-500 bg-gradient-to-b from-blue-500 to-transparent md:hidden" />
              )}

              <div className="md:w-1/2 relative">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 relative z-10">
                  <div className="absolute -left-5 -top-5 bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold">
                    {step.number}
                  </div>

                  <div className="ml-8 mb-6">
                    <div className="inline-block p-3 rounded-xl bg-gray-100 dark:bg-gray-700 mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    {index === 0 && (
                      <>
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          {t(
                            "app.site.home.process.steps.strategyDevelopment.tags.audienceAnalysis",
                          )}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {t(
                            "app.site.home.process.steps.strategyDevelopment.tags.competitorResearch",
                          )}
                        </span>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {t(
                            "app.site.home.process.steps.contentCreation.tags.brandAlignedContent",
                          )}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                          {t(
                            "app.site.home.process.steps.contentCreation.tags.engagingVisuals",
                          )}
                        </span>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <span className="inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400">
                          {t(
                            "app.site.home.process.steps.publishingManagement.tags.optimalTiming",
                          )}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 dark:bg-pink-900/30 dark:text-pink-400">
                          {t(
                            "app.site.home.process.steps.publishingManagement.tags.communityBuilding",
                          )}
                        </span>
                      </>
                    )}
                    {index === 3 && (
                      <>
                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                          {t(
                            "app.site.home.process.steps.analysisOptimization.tags.performanceMetrics",
                          )}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                          {t(
                            "app.site.home.process.steps.analysisOptimization.tags.strategyRefinement",
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden md:block md:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 aspect-video">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/40 bg-gradient-to-tr from-black/40 via-black/10 to-transparent" />

                  {index === 0 && (
                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-[200px]">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-sm font-medium">
                          {t(
                            "app.site.home.process.steps.strategyDevelopment.insights.title",
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {t(
                          "app.site.home.process.steps.strategyDevelopment.insights.description",
                        )}
                      </p>
                    </div>
                  )}

                  {index === 1 && (
                    <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-[200px]">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium">
                          {t(
                            "app.site.home.process.steps.contentCreation.insights.title",
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {t(
                          "app.site.home.process.steps.contentCreation.insights.description",
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="inline-block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center mb-4">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">
              {t("app.site.home.process.readyTransform")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t("app.site.home.process.handleSocial")}
            </p>
            <a
              href={`/${locale}/#pricing`}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              {t("app.site.home.process.getStarted")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
