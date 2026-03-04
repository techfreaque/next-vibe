"use client";

import { Div } from "next-vibe-ui/ui/div";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useInView } from "react-intersection-observer";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

interface ArchitectureProps {
  locale: CountryLanguage;
}

type PlatformKey =
  | "web"
  | "cli"
  | "ai"
  | "mcp"
  | "cron"
  | "mobile"
  | "electron"
  | "trpc"
  | "skill"
  | "http";

interface PlatformCard {
  icon: string;
  key: PlatformKey;
  nameKey: `home.architecture.platforms.${PlatformKey}.name`;
  exampleKey: `home.architecture.platforms.${PlatformKey}.example`;
  benefitKey: `home.architecture.platforms.${PlatformKey}.benefit`;
  color: string;
  bgColor: string;
  borderColor: string;
  delay: number;
}

function makePlatform(
  icon: string,
  key: PlatformKey,
  color: string,
  bgColor: string,
  borderColor: string,
  delay: number,
): PlatformCard {
  return {
    icon,
    key,
    nameKey: `home.architecture.platforms.${key}.name`,
    exampleKey: `home.architecture.platforms.${key}.example`,
    benefitKey: `home.architecture.platforms.${key}.benefit`,
    color,
    bgColor,
    borderColor,
    delay,
  };
}

const PLATFORMS: PlatformCard[] = [
  makePlatform(
    "🌐",
    "web",
    "text-blue-700 dark:text-blue-300",
    "bg-blue-50 dark:bg-blue-900/20",
    "border-blue-200 dark:border-blue-700/50",
    0.1,
  ),
  makePlatform(
    "⌨️",
    "cli",
    "text-green-700 dark:text-green-300",
    "bg-green-50 dark:bg-green-900/20",
    "border-green-200 dark:border-green-700/50",
    0.15,
  ),
  makePlatform(
    "🤖",
    "ai",
    "text-purple-700 dark:text-purple-300",
    "bg-purple-50 dark:bg-purple-900/20",
    "border-purple-200 dark:border-purple-700/50",
    0.2,
  ),
  makePlatform(
    "🔌",
    "mcp",
    "text-orange-700 dark:text-orange-300",
    "bg-orange-50 dark:bg-orange-900/20",
    "border-orange-200 dark:border-orange-700/50",
    0.25,
  ),
  makePlatform(
    "⏰",
    "cron",
    "text-red-700 dark:text-red-300",
    "bg-red-50 dark:bg-red-900/20",
    "border-red-200 dark:border-red-700/50",
    0.3,
  ),
  makePlatform(
    "📱",
    "mobile",
    "text-cyan-700 dark:text-cyan-300",
    "bg-cyan-50 dark:bg-cyan-900/20",
    "border-cyan-200 dark:border-cyan-700/50",
    0.35,
  ),
  makePlatform(
    "🖥️",
    "electron",
    "text-slate-700 dark:text-slate-300",
    "bg-slate-50 dark:bg-slate-900/20",
    "border-slate-200 dark:border-slate-700/50",
    0.4,
  ),
  makePlatform(
    "🔗",
    "trpc",
    "text-pink-700 dark:text-pink-300",
    "bg-pink-50 dark:bg-pink-900/20",
    "border-pink-200 dark:border-pink-700/50",
    0.45,
  ),
  makePlatform(
    "📜",
    "skill",
    "text-yellow-700 dark:text-yellow-300",
    "bg-yellow-50 dark:bg-yellow-900/20",
    "border-yellow-200 dark:border-yellow-700/50",
    0.5,
  ),
  makePlatform(
    "🌍",
    "http",
    "text-teal-700 dark:text-teal-300",
    "bg-teal-50 dark:bg-teal-900/20",
    "border-teal-200 dark:border-teal-700/50",
    0.55,
  ),
];

const CODE_SNIPPET = `createEndpoint({
  path: ["agent", "chat", "threads"],
  method: Methods.GET,
  allowedRoles: [UserRole.CUSTOMER],
  fields: {
    limit: requestField({ schema: z.number() }),
    threads: responseArrayField({ ... }),
  },
  errorTypes: { ... },
  examples: { ... },
})`;

export function Architecture({ locale }: ArchitectureProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <Div className="relative overflow-hidden bg-muted/20" ref={ref as never}>
      <Div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background pointer-events-none" />

      <Div className="container relative px-4 md:px-6 py-24 md:py-32">
        {/* Header */}
        <MotionDiv
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            {t("home.architecture.badge")}
          </Div>
          <H2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            {t("home.architecture.title")}
          </H2>
          <P className="mx-auto max-w-[680px] text-muted-foreground md:text-xl">
            {t("home.architecture.subtitle")}
          </P>
        </MotionDiv>

        {/* Definition source box */}
        <MotionDiv
          className="mx-auto max-w-2xl mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: 0.05, duration: 0.5 }}
        >
          <Div className="rounded-xl border-2 border-cyan-500/40 bg-cyan-950/80 dark:bg-cyan-950/60 shadow-lg shadow-cyan-500/10 overflow-hidden">
            {/* Title bar */}
            <Div className="flex items-center gap-2 px-4 py-2 border-b border-cyan-800/40 bg-cyan-900/30">
              <Div className="flex gap-1.5">
                <Div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <Div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <Div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </Div>
              <Span className="text-xs font-mono text-cyan-400/80 ml-2">
                definition.ts
              </Span>
            </Div>
            {/* Code */}
            <Div className="p-5 font-mono text-xs sm:text-sm leading-relaxed text-cyan-100/90 whitespace-pre">
              {CODE_SNIPPET}
            </Div>
            {/* Footer badge */}
            <Div className="px-5 pb-4">
              <Span className="inline-flex items-center gap-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-400">
                {t("home.architecture.sourceLabel")}
              </Span>
            </Div>
          </Div>
        </MotionDiv>

        {/* Arrow / divider */}
        <MotionDiv
          className="flex justify-center mb-10 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Div className="flex flex-col items-center gap-1">
            <Div className="w-px h-8 bg-border" />
            <Span className="text-sm font-medium text-muted-foreground px-4 py-1.5 border rounded-full bg-background">
              {t("home.architecture.compilesTo")}
            </Span>
            <Div className="w-px h-8 bg-border" />
          </Div>
        </MotionDiv>

        {/* Platform grid */}
        <Div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mx-auto max-w-7xl mb-14">
          {PLATFORMS.map((platform) => (
            <MotionDiv
              key={platform.key}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ delay: platform.delay, duration: 0.4 }}
            >
              <Div
                className={`h-full rounded-xl border p-4 ${platform.bgColor} ${platform.borderColor} flex flex-col gap-3`}
              >
                {/* Icon + name */}
                <Div className="flex items-center gap-2">
                  <Span className="text-xl leading-none">{platform.icon}</Span>
                  <H3
                    className={`text-sm font-semibold leading-tight ${platform.color}`}
                  >
                    {t(platform.nameKey)}
                  </H3>
                </Div>

                {/* Code example */}
                <Div className="font-mono text-[10px] sm:text-[11px] leading-relaxed text-muted-foreground bg-background/60 rounded-md px-3 py-2 border border-border/50 flex-1 whitespace-pre">
                  {t(platform.exampleKey)}
                </Div>

                {/* Benefit pill */}
                <Span
                  className={`text-[10px] font-medium ${platform.color} opacity-80`}
                >
                  {t(platform.benefitKey)}
                </Span>
              </Div>
            </MotionDiv>
          ))}
        </Div>

        {/* Bottom callout */}
        <MotionDiv
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Div className="rounded-xl border bg-card p-6 md:p-8 shadow-sm">
            <P className="text-lg font-semibold mb-2">
              {t("home.architecture.callout.title")}
            </P>
            <P className="text-muted-foreground mb-4">
              {t("home.architecture.callout.body")}
            </P>
            <Div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              {(
                [
                  "typeSafe",
                  "roleControlled",
                  "validated",
                  "autoGenerated",
                ] as const
              ).map((key) => (
                <Span
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 bg-muted/30"
                >
                  <Span className="text-green-500">✓</Span>
                  {t(`home.architecture.callout.pills.${key}`)}
                </Span>
              ))}
            </Div>
          </Div>
        </MotionDiv>
      </Div>
    </Div>
  );
}
