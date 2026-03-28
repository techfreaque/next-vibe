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
import { CloudVsSelfHost } from "./cloud-vs-selfhost";
import { scopedTranslation } from "./i18n";
import { OpenClawComparison } from "./openclaw-comparison";
import { ProblemStatement } from "./problem-statement";

type ActiveSide = "unbottled" | "nextvibe" | null;

interface UniverseContentProps {
  locale: CountryLanguage;
  totalToolCount: number;
  subPrice: number;
  subCurrency: string;
  totalEndpointCount: number;
  activeSide: ActiveSide;
  onSideChange: (side: ActiveSide) => void;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  sublabel: string;
  variant: "violet" | "cyan";
}

const VIOLET_ACTIVE =
  "bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/30 shadow-md border-0";
const VIOLET_INACTIVE =
  "text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted";
const CYAN_ACTIVE =
  "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/30 shadow-md border-0";

function TabButton({
  active,
  onClick,
  label,
  sublabel,
  variant,
}: TabButtonProps): JSX.Element {
  const dotClass = variant === "violet" ? "bg-violet-400" : "bg-cyan-400";
  const activeClass = variant === "violet" ? VIOLET_ACTIVE : CYAN_ACTIVE;

  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      className={cn(
        "rounded-full flex items-center gap-2 px-5",
        active ? activeClass : VIOLET_INACTIVE,
      )}
    >
      <Span className={cn("w-2 h-2 rounded-full shrink-0", dotClass)} />
      <Span className="font-semibold">{label}</Span>
      <Span
        className={cn(
          "text-xs opacity-70 hidden sm:inline",
          active ? "text-white/80" : "text-muted-foreground",
        )}
      >
        {sublabel}
      </Span>
    </Button>
  );
}

export function UniverseContent({
  locale,
  totalToolCount,
  subPrice,
  subCurrency,
  activeSide,
  onSideChange,
}: UniverseContentProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [localActive, setLocalActive] = useState<ActiveSide>(
    activeSide ?? "unbottled",
  );

  const current = activeSide ?? localActive;

  function handleSwitch(side: ActiveSide): void {
    setLocalActive(side);
    onSideChange(side);
  }

  return (
    <Div id="universe-content" className="relative">
      {/* Tab switcher bar */}
      <Div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm">
        <Div className="container px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <Div className="flex items-center gap-2">
            <TabButton
              active={current === "unbottled"}
              onClick={() => handleSwitch("unbottled")}
              label={t("home.splitHero.tab.unbottled")}
              sublabel={t("home.splitHero.tab.unbottledSub")}
              variant="violet"
            />
            <TabButton
              active={current === "nextvibe"}
              onClick={() => handleSwitch("nextvibe")}
              label={t("home.splitHero.tab.nextvibe")}
              sublabel={t("home.splitHero.tab.nextvibeSub")}
              variant="cyan"
            />
          </Div>
          <P className="text-xs text-muted-foreground hidden md:block">
            {current === "unbottled"
              ? t("home.splitHero.tab.unbottledDesc")
              : t("home.splitHero.tab.nextvibeDesc")}
          </P>
        </Div>
      </Div>

      {/* Content stacks */}
      <AnimatePresence mode="wait">
        {current === "unbottled" ? (
          <MotionDiv
            key="unbottled"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <ProblemStatement locale={locale} />
            <CapabilityShowcase
              locale={locale}
              totalToolCount={totalToolCount}
            />
            <OpenClawComparison
              locale={locale}
              totalToolCount={totalToolCount}
            />
            <CloudVsSelfHost
              locale={locale}
              subPrice={subPrice}
              subCurrency={subCurrency}
            />
            <CallToAction locale={locale} />
          </MotionDiv>
        ) : (
          <MotionDiv
            key="nextvibe"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <Architecture locale={locale} />
            <CloudVsSelfHost
              locale={locale}
              subPrice={subPrice}
              subCurrency={subCurrency}
            />
            <CallToAction locale={locale} />
          </MotionDiv>
        )}
      </AnimatePresence>
    </Div>
  );
}
