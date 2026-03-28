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

interface TabCardProps {
  active: boolean;
  onClick: () => void;
  label: string;
  sublabel: string;
  desc: string;
  variant: "violet" | "cyan";
}

function TabCard({
  active,
  onClick,
  label,
  sublabel,
  desc,
  variant,
}: TabCardProps): JSX.Element {
  const isViolet = variant === "violet";
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "relative flex-1 h-auto text-left rounded-2xl px-6 py-5 border transition-all duration-300 flex-col items-start",
        active
          ? isViolet
            ? "bg-violet-950/80 border-violet-500/60 shadow-lg shadow-violet-900/30 hover:bg-violet-950/80"
            : "bg-cyan-950/80 border-cyan-500/60 shadow-lg shadow-cyan-900/30 hover:bg-cyan-950/80"
          : "bg-muted/30 border-border/40 hover:border-border hover:bg-muted/50",
      )}
    >
      {active && (
        <Div
          className={cn(
            "absolute inset-0 rounded-2xl pointer-events-none",
            isViolet
              ? "bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(167,80,255,0.15)_0%,transparent_70%)]"
              : "bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(6,182,212,0.12)_0%,transparent_70%)]",
          )}
        />
      )}
      <Div className="flex items-center gap-2 mb-1.5">
        <Span
          className={cn(
            "w-2.5 h-2.5 rounded-full shrink-0",
            isViolet ? "bg-violet-400" : "bg-cyan-400",
          )}
        />
        <Span
          className={cn(
            "font-black text-lg tracking-tight",
            active
              ? isViolet
                ? "text-violet-100"
                : "text-cyan-100"
              : "text-muted-foreground",
          )}
        >
          {label}
        </Span>
        <Span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full border",
            active
              ? isViolet
                ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                : "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
              : "bg-muted border-border text-muted-foreground",
          )}
        >
          {sublabel}
        </Span>
      </Div>
      <P
        className={cn(
          "text-sm leading-relaxed m-0",
          active
            ? isViolet
              ? "text-violet-200/70"
              : "text-cyan-200/70"
            : "text-muted-foreground/60",
        )}
      >
        {desc}
      </P>
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
      {/* Tab switcher */}
      <Div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b border-border/50">
        <Div className="container px-4 md:px-6 py-4">
          <Div className="flex gap-3">
            <TabCard
              active={current === "unbottled"}
              onClick={() => handleSwitch("unbottled")}
              label={t("home.splitHero.tab.unbottled")}
              sublabel={t("home.splitHero.tab.unbottledSub")}
              desc={t("home.splitHero.tab.unbottledDesc")}
              variant="violet"
            />
            <TabCard
              active={current === "nextvibe"}
              onClick={() => handleSwitch("nextvibe")}
              label={t("home.splitHero.tab.nextvibe")}
              sublabel={t("home.splitHero.tab.nextvibeSub")}
              desc={t("home.splitHero.tab.nextvibeDesc")}
              variant="cyan"
            />
          </Div>
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
