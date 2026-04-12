"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AnimatePresence } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useState } from "react";

import type { ModelCountsByContentLevel } from "@/app/api/[locale]/agent/models/all-models";
import type { CountryLanguage } from "@/i18n/core/config";
import { configScopedTranslation } from "@/config/i18n";

import { scopedTranslation } from "./i18n";
import type { ActiveSide } from "./split-hero";
import { TabNextVibe } from "./tab-nextvibe";
import { TabPersonal } from "./tab-personal";
import { TabReferral } from "./tab-referral";
import { TabUnbottled } from "./tab-unbottled";

type TabId = "unbottled" | "personal" | "nextvibe" | "referral";

interface UniverseContentProps {
  locale: CountryLanguage;
  totalToolCount: number;
  totalModelCount: number;
  totalProviderCount: number;
  modelCountsByTier: ModelCountsByContentLevel;
  activeSide: ActiveSide;
  onSideChange: (side: ActiveSide) => void;
  hasUser: boolean;
}

interface TabConfig {
  id: TabId;
  label: string;
  sublabel: string;
  dot: string;
  inactiveDot: string;
  inactiveLabel: string;
  inactiveBar: string;
  activeBar: string;
  activeBg: string;
  activeLabel: string;
  activeBadgeBg: string;
  activeBadgeBorder: string;
  activeBadgeText: string;
  inactiveBadgeBg: string;
  inactiveBadgeBorder: string;
  inactiveBadgeText: string;
}

function TabPill({
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
        "relative flex-none sm:flex-1 min-w-[100px] h-auto rounded-none px-4 py-2.5 border-0 transition-all duration-200 cursor-pointer flex-row items-center justify-center gap-2 whitespace-nowrap",
        active
          ? cn(tab.activeBg, "font-semibold")
          : "bg-transparent hover:bg-muted/40 dark:hover:bg-muted/10",
      )}
    >
      <Div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200",
          active ? tab.activeBar : "opacity-0",
        )}
      />
      <Span
        className={cn(
          "w-2 h-2 rounded-full shrink-0 transition-colors duration-200",
          active ? tab.dot : tab.inactiveDot,
        )}
      />
      <Span
        className={cn(
          "text-sm font-medium tracking-tight transition-colors duration-200",
          active ? tab.activeLabel : tab.inactiveLabel,
        )}
      >
        {tab.label}
      </Span>
      <Span
        className={cn(
          "text-xs font-medium px-1.5 py-0.5 rounded-full border transition-all duration-200 hidden sm:inline-flex",
          active
            ? cn(tab.activeBadgeBg, tab.activeBadgeBorder, tab.activeBadgeText)
            : cn(
                tab.inactiveBadgeBg,
                tab.inactiveBadgeBorder,
                tab.inactiveBadgeText,
              ),
        )}
      >
        {tab.sublabel}
      </Span>
    </Button>
  );
}

export function UniverseContent({
  locale,
  totalToolCount,
  totalModelCount,
  totalProviderCount,
  modelCountsByTier,
  activeSide,
  onSideChange,
  hasUser,
}: UniverseContentProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const [localActive, setLocalActive] = useState<TabId | null>(null);

  const current: TabId | null =
    activeSide === "nextvibe"
      ? "nextvibe"
      : activeSide === "personal"
        ? "personal"
        : activeSide === "referral"
          ? "referral"
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
      label: t("home.splitHero.tab.unbottled", { appName }),
      sublabel: t("home.splitHero.tab.unbottledSub"),
      dot: "bg-violet-500 dark:bg-violet-400",
      inactiveDot: "bg-muted-foreground/30",
      inactiveLabel: "text-muted-foreground",
      inactiveBar: "",
      activeBar: "bg-linear-to-r from-violet-500 to-fuchsia-500",
      activeBg: "bg-violet-50/60 dark:bg-violet-950/30",
      activeLabel: "text-violet-800 dark:text-violet-200",
      activeBadgeBg: "bg-violet-100 dark:bg-violet-500/20",
      activeBadgeBorder: "border-violet-400 dark:border-violet-500/40",
      activeBadgeText: "text-violet-700 dark:text-violet-300",
      inactiveBadgeBg: "bg-muted/50",
      inactiveBadgeBorder: "border-border/50",
      inactiveBadgeText: "text-muted-foreground",
    },
    {
      id: "personal",
      label: t("home.splitHero.tab.personal"),
      sublabel: t("home.splitHero.tab.personalSub"),
      dot: "bg-emerald-500 dark:bg-emerald-400",
      inactiveDot: "bg-muted-foreground/30",
      inactiveLabel: "text-muted-foreground",
      inactiveBar: "",
      activeBar: "bg-linear-to-r from-emerald-500 to-teal-500",
      activeBg: "bg-emerald-50/60 dark:bg-emerald-950/30",
      activeLabel: "text-emerald-800 dark:text-emerald-200",
      activeBadgeBg: "bg-emerald-100 dark:bg-emerald-500/20",
      activeBadgeBorder: "border-emerald-400 dark:border-emerald-500/40",
      activeBadgeText: "text-emerald-700 dark:text-emerald-300",
      inactiveBadgeBg: "bg-muted/50",
      inactiveBadgeBorder: "border-border/50",
      inactiveBadgeText: "text-muted-foreground",
    },
    {
      id: "nextvibe",
      label: t("home.splitHero.tab.nextvibe"),
      sublabel: t("home.splitHero.tab.nextvibeSub"),
      dot: "bg-cyan-500 dark:bg-cyan-400",
      inactiveDot: "bg-muted-foreground/30",
      inactiveLabel: "text-muted-foreground",
      inactiveBar: "",
      activeBar: "bg-linear-to-r from-cyan-500 to-blue-500",
      activeBg: "bg-cyan-50/60 dark:bg-cyan-950/30",
      activeLabel: "text-cyan-800 dark:text-cyan-200",
      activeBadgeBg: "bg-cyan-100 dark:bg-cyan-500/20",
      activeBadgeBorder: "border-cyan-400 dark:border-cyan-500/40",
      activeBadgeText: "text-cyan-700 dark:text-cyan-300",
      inactiveBadgeBg: "bg-muted/50",
      inactiveBadgeBorder: "border-border/50",
      inactiveBadgeText: "text-muted-foreground",
    },
    {
      id: "referral",
      label: t("home.splitHero.tab.referral"),
      sublabel: t("home.splitHero.tab.referralSub"),
      dot: "bg-rose-500 dark:bg-rose-400",
      inactiveDot: "bg-muted-foreground/30",
      inactiveLabel: "text-muted-foreground",
      inactiveBar: "",
      activeBar: "bg-linear-to-r from-rose-500 to-pink-500",
      activeBg: "bg-rose-50/60 dark:bg-rose-950/30",
      activeLabel: "text-rose-800 dark:text-rose-200",
      activeBadgeBg: "bg-rose-100 dark:bg-rose-500/20",
      activeBadgeBorder: "border-rose-400 dark:border-rose-500/40",
      activeBadgeText: "text-rose-700 dark:text-rose-300",
      inactiveBadgeBg: "bg-muted/50",
      inactiveBadgeBorder: "border-border/50",
      inactiveBadgeText: "text-muted-foreground",
    },
  ];

  return (
    <Div id="universe-content" className="relative">
      {current !== null && (
        <Div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-lg border-b border-border/40">
          <Div className="flex overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <TabPill
                key={tab.id}
                tab={tab}
                active={current === tab.id}
                onClick={() => handleSwitch(tab.id)}
              />
            ))}
          </Div>
        </Div>
      )}

      <AnimatePresence mode="wait">
        {current === "unbottled" && (
          <TabUnbottled
            locale={locale}
            totalToolCount={totalToolCount}
            totalModelCount={totalModelCount}
            totalProviderCount={totalProviderCount}
            modelCountsByTier={modelCountsByTier}
            hasUser={hasUser}
          />
        )}
        {current === "personal" && (
          <TabPersonal
            locale={locale}
            totalToolCount={totalToolCount}
            hasUser={hasUser}
          />
        )}
        {current === "nextvibe" && (
          <TabNextVibe locale={locale} hasUser={hasUser} />
        )}
        {current === "referral" && (
          <TabReferral locale={locale} hasUser={hasUser} />
        )}
      </AnimatePresence>
    </Div>
  );
}
