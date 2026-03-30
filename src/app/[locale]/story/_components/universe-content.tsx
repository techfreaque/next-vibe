"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AnimatePresence, MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { Architecture } from "./architecture";
import CallToAction from "./call-to-action";
import { CapabilityShowcase } from "./capability-showcase";
import { scopedTranslation } from "./i18n";
import { NextVibeShowcase } from "./nextvibe-showcase";
import { OpenClawComparison } from "./openclaw-comparison";
import { PersonalShowcase } from "./personal-showcase";
import { ProblemStatement } from "./problem-statement";
import { SelfHostSection } from "./self-host-section";
import type { ActiveSide } from "./split-hero";
import { StatsStrip } from "./stats-strip";

type TabId = "unbottled" | "personal" | "nextvibe";

interface UniverseContentProps {
  locale: CountryLanguage;
  totalToolCount: number;
  subPrice: number;
  subCurrency: string;
  totalEndpointCount: number;
  totalModelCount: number;
  totalProviderCount: number;
  totalSkillCount: number;
  activeSide: ActiveSide;
  onSideChange: (side: ActiveSide) => void;
}

interface TabConfig {
  id: TabId;
  label: string;
  sublabel: string;
  desc: string;
  color: "violet" | "sky" | "cyan";
  dot: string;
  inactiveDot: string;
  inactiveLabel: string;
  inactiveBadgeBg: string;
  inactiveBadgeBorder: string;
  inactiveBadgeText: string;
  inactiveDesc: string;
  inactiveTopBar: string;
  activeBg: string;
  activeBorder: string;
  activeShadow: string;
  activeGlow: string;
  activeLabel: string;
  activeBadgeBg: string;
  activeBadgeBorder: string;
  activeBadgeText: string;
  activeDesc: string;
  activeTopBar: string;
}

function TabCard({
  tab,
  active,
  onClick,
}: {
  tab: TabConfig;
  active: boolean;
  onClick: () => void;
}): JSX.Element {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "relative w-full h-auto rounded-none px-3 py-3 border-0 border-r last:border-r-0 border-border/30 transition-all duration-300 cursor-pointer flex-col items-center text-center whitespace-normal",
        active
          ? cn(tab.activeBg, tab.activeShadow)
          : "bg-muted/30 dark:bg-muted/5 hover:bg-muted/50 dark:hover:bg-muted/20",
      )}
    >
      {/* Colored top bar */}
      <Div
        className={cn(
          "absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300",
          active ? tab.activeTopBar : tab.inactiveTopBar,
          active ? "opacity-100" : "opacity-30",
        )}
      />
      {/* Glow overlay */}
      {active && (
        <Div
          className={cn(
            "absolute inset-0 rounded-xl pointer-events-none",
            tab.activeGlow,
          )}
        />
      )}
      <Div className="relative flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mb-1">
        <Span
          className={cn(
            "w-2 h-2 rounded-full shrink-0 transition-colors duration-300",
            active ? tab.dot : tab.inactiveDot,
          )}
        />
        <Span
          className={cn(
            "font-bold text-sm md:text-base tracking-tight transition-colors duration-300",
            active ? tab.activeLabel : tab.inactiveLabel,
          )}
        >
          {tab.label}
        </Span>
        <Span
          className={cn(
            "text-xs font-medium px-1.5 py-0.5 rounded-full border transition-all duration-300",
            active
              ? cn(
                  tab.activeBadgeBg,
                  tab.activeBadgeBorder,
                  tab.activeBadgeText,
                )
              : cn(
                  tab.inactiveBadgeBg,
                  tab.inactiveBadgeBorder,
                  tab.inactiveBadgeText,
                ),
          )}
        >
          {tab.sublabel}
        </Span>
      </Div>
      <P
        className={cn(
          "text-xs leading-relaxed m-0 transition-colors duration-300 break-words",
          active ? tab.activeDesc : tab.inactiveDesc,
        )}
      >
        {tab.desc}
      </P>
    </Button>
  );
}

export function UniverseContent({
  locale,
  totalToolCount,
  totalEndpointCount,
  totalModelCount,
  totalProviderCount,
  totalSkillCount,
  activeSide,
  onSideChange,
}: UniverseContentProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [localActive, setLocalActive] = useState<TabId>("unbottled");

  const current: TabId =
    activeSide === "nextvibe"
      ? "nextvibe"
      : activeSide === "personal"
        ? "personal"
        : activeSide === "unbottled"
          ? "unbottled"
          : localActive;

  function handleSwitch(id: TabId): void {
    setLocalActive(id);
    onSideChange(id);
  }

  const tabs: TabConfig[] = [
    {
      id: "unbottled",
      label: t("home.splitHero.tab.unbottled"),
      sublabel: t("home.splitHero.tab.unbottledSub"),
      desc: t("home.splitHero.tab.unbottledDesc", {
        modelCount: String(totalModelCount),
        providerCount: String(totalProviderCount),
      }),
      color: "violet",
      dot: "bg-violet-500 dark:bg-violet-400",
      inactiveDot: "bg-violet-400 dark:bg-violet-700",
      inactiveLabel: "text-violet-700 dark:text-violet-400",
      inactiveBadgeBg: "bg-violet-100 dark:bg-violet-950",
      inactiveBadgeBorder: "border-violet-300 dark:border-violet-800",
      inactiveBadgeText: "text-violet-600 dark:text-violet-500",
      inactiveDesc: "text-violet-600 dark:text-violet-700",
      inactiveTopBar: "bg-linear-to-r from-violet-500 to-fuchsia-500",
      activeBg: "bg-violet-50 dark:bg-violet-950/60",
      activeBorder: "border-violet-400 dark:border-violet-500/50",
      activeShadow: "shadow-lg shadow-violet-200/60 dark:shadow-violet-900/20",
      activeGlow:
        "bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(167,80,255,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(167,80,255,0.12)_0%,transparent_70%)]",
      activeLabel: "text-violet-800 dark:text-violet-100",
      activeBadgeBg: "bg-violet-100 dark:bg-violet-500/20",
      activeBadgeBorder: "border-violet-400 dark:border-violet-500/40",
      activeBadgeText: "text-violet-700 dark:text-violet-300",
      activeDesc: "text-violet-600 dark:text-violet-200/60",
      activeTopBar: "bg-linear-to-r from-violet-500 to-fuchsia-500",
    },
    {
      id: "personal",
      label: t("home.splitHero.tab.personal"),
      sublabel: t("home.splitHero.tab.personalSub"),
      desc: t("home.splitHero.tab.personalDesc"),
      color: "sky",
      dot: "bg-emerald-500 dark:bg-emerald-400",
      inactiveDot: "bg-emerald-400 dark:bg-emerald-700",
      inactiveLabel: "text-emerald-700 dark:text-emerald-400",
      inactiveBadgeBg: "bg-emerald-100 dark:bg-emerald-950",
      inactiveBadgeBorder: "border-emerald-300 dark:border-emerald-800",
      inactiveBadgeText: "text-emerald-600 dark:text-emerald-500",
      inactiveDesc: "text-emerald-600 dark:text-emerald-700",
      inactiveTopBar: "bg-linear-to-r from-emerald-500 to-teal-500",
      activeBg: "bg-emerald-50 dark:bg-emerald-950/60",
      activeBorder: "border-emerald-400 dark:border-emerald-500/50",
      activeShadow:
        "shadow-lg shadow-emerald-200/60 dark:shadow-emerald-900/20",
      activeGlow:
        "bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(16,185,129,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(16,185,129,0.10)_0%,transparent_70%)]",
      activeLabel: "text-emerald-800 dark:text-emerald-100",
      activeBadgeBg: "bg-emerald-100 dark:bg-emerald-500/20",
      activeBadgeBorder: "border-emerald-400 dark:border-emerald-500/40",
      activeBadgeText: "text-emerald-700 dark:text-emerald-300",
      activeDesc: "text-emerald-600 dark:text-emerald-200/60",
      activeTopBar: "bg-linear-to-r from-emerald-500 to-teal-500",
    },
    {
      id: "nextvibe",
      label: t("home.splitHero.tab.nextvibe"),
      sublabel: t("home.splitHero.tab.nextvibeSub"),
      desc: t("home.splitHero.tab.nextvibeDesc"),
      color: "cyan",
      dot: "bg-cyan-500 dark:bg-cyan-400",
      inactiveDot: "bg-cyan-400 dark:bg-cyan-700",
      inactiveLabel: "text-cyan-700 dark:text-cyan-400",
      inactiveBadgeBg: "bg-cyan-100 dark:bg-cyan-950",
      inactiveBadgeBorder: "border-cyan-300 dark:border-cyan-800",
      inactiveBadgeText: "text-cyan-600 dark:text-cyan-500",
      inactiveDesc: "text-cyan-600 dark:text-cyan-700",
      inactiveTopBar: "bg-linear-to-r from-cyan-500 to-blue-500",
      activeBg: "bg-cyan-50 dark:bg-cyan-950/60",
      activeBorder: "border-cyan-400 dark:border-cyan-500/50",
      activeShadow: "shadow-lg shadow-cyan-200/60 dark:shadow-cyan-900/20",
      activeGlow:
        "bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(6,182,212,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(6,182,212,0.10)_0%,transparent_70%)]",
      activeLabel: "text-cyan-800 dark:text-cyan-100",
      activeBadgeBg: "bg-cyan-100 dark:bg-cyan-500/20",
      activeBadgeBorder: "border-cyan-400 dark:border-cyan-500/40",
      activeBadgeText: "text-cyan-700 dark:text-cyan-300",
      activeDesc: "text-cyan-600 dark:text-cyan-200/60",
      activeTopBar: "bg-linear-to-r from-cyan-500 to-blue-500",
    },
  ];

  return (
    <Div id="universe-content" className="relative">
      {/* Tab switcher — full-width grid matching the 3-panel hero exactly */}
      <Div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-lg border-b border-border/40">
        <Div className="grid grid-cols-3">
          {tabs.map((tab) => (
            <TabCard
              key={tab.id}
              tab={tab}
              active={current === tab.id}
              onClick={() => handleSwitch(tab.id)}
            />
          ))}
        </Div>
      </Div>

      {/* Content stacks */}
      <AnimatePresence mode="wait">
        {current === "unbottled" && (
          <MotionDiv
            key="unbottled"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <ProblemStatement
              locale={locale}
              totalModelCount={totalModelCount}
            />
            <CapabilityShowcase
              locale={locale}
              totalToolCount={totalToolCount}
              totalModelCount={totalModelCount}
              totalProviderCount={totalProviderCount}
            />
            <OpenClawComparison
              locale={locale}
              totalToolCount={totalToolCount}
            />
            <StatsStrip
              locale={locale}
              totalEndpointCount={totalEndpointCount}
              totalModelCount={totalModelCount}
              totalProviderCount={totalProviderCount}
              totalSkillCount={totalSkillCount}
              variant="unbottled"
            />
            <CallToAction locale={locale} totalModelCount={totalModelCount} />
          </MotionDiv>
        )}
        {current === "personal" && (
          <MotionDiv
            key="personal"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <PersonalShowcase locale={locale} />
            <SelfHostSection locale={locale} totalToolCount={totalToolCount} />
            <StatsStrip
              locale={locale}
              totalEndpointCount={totalEndpointCount}
              totalModelCount={totalModelCount}
              totalProviderCount={totalProviderCount}
              totalSkillCount={totalSkillCount}
              variant="personal"
            />
            <CallToAction locale={locale} totalModelCount={totalModelCount} />
          </MotionDiv>
        )}
        {current === "nextvibe" && (
          <MotionDiv
            key="nextvibe"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <NextVibeShowcase locale={locale} />
            <Architecture locale={locale} />
            <OpenClawComparison
              locale={locale}
              totalToolCount={totalToolCount}
              variant="nextvibe"
            />
            <StatsStrip
              locale={locale}
              totalEndpointCount={totalEndpointCount}
              totalModelCount={totalModelCount}
              totalProviderCount={totalProviderCount}
              totalSkillCount={totalSkillCount}
              variant="nextvibe"
            />
            <CallToAction locale={locale} totalModelCount={totalModelCount} />
          </MotionDiv>
        )}
      </AnimatePresence>
    </Div>
  );
}
