"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import {
  Bot,
  Clock,
  Code,
  Layers,
  MessageSquare,
  Shield,
  Sparkles,
  Terminal,
} from "next-vibe-ui/ui/icons";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import type React from "react";
import type { JSX } from "react";
import { useInView } from "react-intersection-observer";

import {
  TOTAL_CHARACTER_COUNT,
  TOTAL_MODEL_COUNT,
} from "@/app/api/[locale]/agent/models/models";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface BentoGridProps {
  locale: CountryLanguage;
  totalToolCount: number;
}

export function BentoGrid({
  locale,
  totalToolCount,
}: BentoGridProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const interpolation = {
    modelCount: TOTAL_MODEL_COUNT,
    skillCount: TOTAL_CHARACTER_COUNT,
    toolCount: totalToolCount,
  };

  const tiles: {
    icon: React.ElementType;
    title: string;
    description: string;
    className: string;
    iconColor: string;
    bgColor: string;
  }[] = [
    {
      icon: Sparkles,
      title: t("home.bento.models.title", interpolation),
      description: t("home.bento.models.description"),
      className: "md:col-span-2 md:row-span-2",
      iconColor: "text-cyan-500",
      bgColor:
        "bg-cyan-50 dark:bg-cyan-900/30 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/50",
    },
    {
      icon: Bot,
      title: t("home.bento.skills.title", interpolation),
      description: t("home.bento.skills.description"),
      className: "md:col-span-1",
      iconColor: "text-blue-500",
      bgColor:
        "bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50",
    },
    {
      icon: Shield,
      title: t("home.bento.memory.title"),
      description: t("home.bento.memory.description"),
      className: "md:col-span-1",
      iconColor: "text-cyan-500",
      bgColor:
        "bg-cyan-50 dark:bg-cyan-900/30 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/50",
    },
    {
      icon: Clock,
      title: t("home.bento.cron.title"),
      description: t("home.bento.cron.description"),
      className: "md:col-span-1",
      iconColor: "text-blue-500",
      bgColor:
        "bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50",
    },
    {
      icon: Layers,
      title: t("home.bento.architecture.title", interpolation),
      description: t("home.bento.architecture.description"),
      className: "md:col-span-2",
      iconColor: "text-cyan-500",
      bgColor:
        "bg-cyan-50 dark:bg-cyan-900/30 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/50",
    },
    {
      icon: Terminal,
      title: t("home.bento.shell.title"),
      description: t("home.bento.shell.description"),
      className: "md:col-span-1",
      iconColor: "text-blue-500",
      bgColor:
        "bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50",
    },
    {
      icon: MessageSquare,
      title: t("home.bento.community.title"),
      description: t("home.bento.community.description"),
      className: "md:col-span-2",
      iconColor: "text-cyan-500",
      bgColor:
        "bg-cyan-50 dark:bg-cyan-900/30 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/50",
    },
    {
      icon: Code,
      title: t("home.bento.claudeCode.title"),
      description: t("home.bento.claudeCode.description"),
      className: "md:col-span-1",
      iconColor: "text-blue-500",
      bgColor:
        "bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50",
    },
  ];

  return (
    <Div className="relative overflow-hidden bg-muted/30" ref={ref as never}>
      <Div className="container relative px-4 md:px-6 py-24 md:py-32">
        <MotionDiv
          className="grid gap-4 md:grid-cols-3"
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.06 },
            },
          }}
        >
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <MotionDiv
                key={tile.title}
                className={tile.className}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
              >
                <Card className="h-full border-2 hover:border-cyan-500/30 transition-all duration-300 group">
                  <CardHeader>
                    <Div
                      className={`mb-2 p-2 w-12 h-12 rounded-lg ${tile.bgColor} flex items-center justify-center transition-colors duration-300`}
                    >
                      <Icon className={`h-6 w-6 ${tile.iconColor}`} />
                    </Div>
                    <CardTitle className="group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                      {tile.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {tile.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </MotionDiv>
            );
          })}
        </MotionDiv>
      </Div>
    </Div>
  );
}
