"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Bot } from "next-vibe-ui/ui/icons/Bot";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { ShieldOff } from "next-vibe-ui/ui/icons/ShieldOff";
import { Tag } from "next-vibe-ui/ui/icons/Tag";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import type React from "react";
import type { JSX } from "react";
import { useInView } from "react-intersection-observer";

import {
  FEATURED_MODELS,
  TOTAL_MODEL_COUNT,
} from "@/app/api/[locale]/agent/models/models";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesProps {
  locale: CountryLanguage;
  subPrice: number;
  subCurrency: string;
}

export default function Features({
  locale,
  subPrice,
  subCurrency,
}: FeaturesProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features: FeatureItem[] = [
    {
      icon: <Zap className="h-10 w-10 text-cyan-500" />,
      title: t("home.features.models.title", {
        modelCount: TOTAL_MODEL_COUNT,
      }),
      description: t("home.features.models.description", {
        featuredModels: [
          ...FEATURED_MODELS.mainstream,
          ...FEATURED_MODELS.uncensored.slice(0, 1),
        ].join(", "),
      }),
    },
    {
      icon: <Shield className="h-10 w-10 text-blue-500" />,
      title: t("home.features.privacy.title"),
      description: t("home.features.privacy.description"),
    },
    {
      icon: <Bot className="h-10 w-10 text-cyan-500" />,
      title: t("home.features.characters.title"),
      description: t("home.features.characters.description"),
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-blue-500" />,
      title: t("home.features.forums.title"),
      description: t("home.features.forums.description"),
    },
    {
      icon: <ShieldOff className="h-10 w-10 text-cyan-500" />,
      title: t("home.features.uncensored.title"),
      description: t("home.features.uncensored.description"),
    },
    {
      icon: <Tag className="h-10 w-10 text-blue-500" />,
      title: t("home.features.pricing.title"),
      description: t("home.features.pricing.description", {
        subCurrency,
        subPrice,
      }),
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Div
      id="features"
      className="container px-4 md:px-6 py-24 md:py-32"
      ref={ref as never}
    >
      <Div className="text-center mb-16">
        <MotionDiv
          className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("home.features.subtitle")}
        </MotionDiv>
        <MotionDiv
          className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t("home.features.title")}
        </MotionDiv>
        <MotionDiv
          className="mx-auto max-w-[800px] text-gray-500 dark:text-gray-400 md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("home.features.description")}
        </MotionDiv>
      </Div>

      <MotionDiv
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        {features.map((feature, index) => (
          <MotionDiv key={index} variants={item}>
            <Card className="h-full border-2 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg group">
              <CardHeader>
                <Div className="mb-2 p-2 w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors duration-300">
                  {feature.icon}
                </Div>
                <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </MotionDiv>
        ))}
      </MotionDiv>
    </Div>
  );
}
