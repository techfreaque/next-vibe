"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Br } from "next-vibe-ui/ui/br";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Bot } from "next-vibe-ui/ui/icons/Bot";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { Layers } from "next-vibe-ui/ui/icons/Layers";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Link } from "next-vibe-ui/ui/link";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, P } from "next-vibe-ui/ui/typography";
import { cn } from "next-vibe/shared/utils";
import type { ComponentType, CSSProperties, JSX } from "react";
import { useState } from "react";

import {
  TOTAL_CHARACTER_COUNT,
  TOTAL_MODEL_COUNT,
} from "@/app/api/[locale]/agent/models/models";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

type ActiveSide = "unbottled" | "nextvibe" | null;

interface SplitHeroProps {
  locale: CountryLanguage;
  totalToolCount: number;
  onSideChange?: (side: ActiveSide) => void;
}

const BASE_OVERLAY: CSSProperties = {
  position: "absolute",
  inset: 0,
};

const UNBOTTLED_GLOW_STYLE: CSSProperties = {
  ...BASE_OVERLAY,
  background:
    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(167,80,255,0.35) 0%, transparent 70%)",
};

const UNBOTTLED_GRID_STYLE: CSSProperties = {
  ...BASE_OVERLAY,
  opacity: 0.04,
  backgroundImage:
    "linear-gradient(rgba(167,80,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,80,255,1) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
};

const NEXTVIBE_GLOW_STYLE: CSSProperties = {
  ...BASE_OVERLAY,
  background:
    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.25) 0%, transparent 70%)",
};

const NEXTVIBE_GRID_STYLE: CSSProperties = {
  ...BASE_OVERLAY,
  opacity: 0.04,
  backgroundImage:
    "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
};

export function SplitHero({
  locale,
  totalToolCount,
  onSideChange,
}: SplitHeroProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [hovered, setHovered] = useState<ActiveSide>(null);
  const [locked, setLocked] = useState<ActiveSide>(null);

  const active = locked ?? hovered;

  function handleHover(side: ActiveSide): void {
    setHovered(side);
  }

  function handleLeave(): void {
    setHovered(null);
  }

  function handleClick(side: ActiveSide): void {
    const next = locked === side ? null : side;
    setLocked(next);
    onSideChange?.(next);
  }

  const unbottledActive = active === "unbottled";
  const nextvibeActive = active === "nextvibe";
  const unbottledCompressed = active === "nextvibe";
  const nextvibeCompressed = active === "unbottled";

  const unbottledWidth = unbottledActive
    ? "65%"
    : unbottledCompressed
      ? "35%"
      : "50%";
  const nextvibeWidth = nextvibeActive
    ? "65%"
    : nextvibeCompressed
      ? "35%"
      : "50%";

  const unbottledPills = [
    {
      Icon: Bot,
      label: t("home.splitHero.unbottled.pill1", {
        modelCount: String(TOTAL_MODEL_COUNT),
      }),
    },
    { Icon: Shield, label: t("home.splitHero.unbottled.pill2") },
    {
      Icon: Zap,
      label: t("home.splitHero.unbottled.pill3", {
        skillCount: String(TOTAL_CHARACTER_COUNT),
      }),
    },
  ];

  const nextvibePills = [
    { Icon: Layers, label: t("home.splitHero.nextvibe.pill1") },
    { Icon: Code, label: t("home.splitHero.nextvibe.pill2") },
    { Icon: GitBranch, label: t("home.splitHero.nextvibe.pill3") },
  ];

  return (
    <Div className="relative flex flex-col md:flex-row min-h-screen">
      {/* ── Divider — positioned absolutely in the container, tracks left panel width ── */}
      <MotionDiv
        className="absolute inset-y-0 z-20 hidden md:flex flex-col items-center justify-center pointer-events-none -translate-x-1/2"
        initial={{ left: "50%" }}
        animate={{ left: unbottledWidth }}
        transition={{ type: "spring", stiffness: 180, damping: 28 }}
      >
        <Div className="w-px flex-1 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <Div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shadow-xl my-3 shrink-0">
          <Span className="text-[10px] font-bold text-muted-foreground tracking-wider">
            {t("home.splitHero.or")}
          </Span>
        </Div>
        <Div className="w-px flex-1 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </MotionDiv>

      {/* ── LEFT: unbottled.ai — desktop ── */}
      <MotionDiv
        className="relative min-h-screen flex-col justify-center overflow-hidden cursor-pointer bg-[#0d0014] hidden md:flex"
        initial={{ width: "50%" }}
        animate={{ width: unbottledWidth }}
        transition={{ type: "spring", stiffness: 180, damping: 28 }}
        onMouseEnter={() => handleHover("unbottled")}
        onMouseLeave={handleLeave}
        onClick={() => handleClick("unbottled")}
      >
        <Div
          style={{
            ...UNBOTTLED_GLOW_STYLE,
            opacity: unbottledActive ? 1 : 0.4,
            transition: "opacity 700ms",
            pointerEvents: "none",
          }}
        />
        <Div style={{ ...UNBOTTLED_GRID_STYLE, pointerEvents: "none" }} />
        <UnbottledContent
          locale={locale}
          compressed={unbottledCompressed}
          pills={unbottledPills}
          t={t}
        />
        {!unbottledActive && !unbottledCompressed && (
          <Div className="absolute bottom-8 left-0 right-0 flex justify-center opacity-40 pointer-events-none">
            <P className="text-violet-300 text-xs tracking-widest uppercase">
              {t("home.splitHero.clickToExplore")}
            </P>
          </Div>
        )}
      </MotionDiv>

      {/* ── LEFT: unbottled.ai — mobile ── */}
      <Div className="md:hidden relative min-h-[60vh] flex flex-col justify-center overflow-hidden bg-[#0d0014]">
        <Div
          style={{
            ...UNBOTTLED_GLOW_STYLE,
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />
        <Div style={{ ...UNBOTTLED_GRID_STYLE, pointerEvents: "none" }} />
        <UnbottledContent
          locale={locale}
          compressed={false}
          pills={unbottledPills}
          t={t}
        />
      </Div>

      {/* Mobile OR divider — between the two stacked panels */}
      <Div className="md:hidden w-full flex items-center gap-4 px-8 py-4 bg-background/50">
        <Div className="flex-1 h-px bg-border" />
        <Span className="text-[10px] font-bold text-muted-foreground tracking-wider">
          {t("home.splitHero.or")}
        </Span>
        <Div className="flex-1 h-px bg-border" />
      </Div>

      {/* ── RIGHT: next-vibe — desktop ── */}
      <MotionDiv
        className="relative min-h-screen flex-col justify-center overflow-hidden cursor-pointer bg-[#020c1b] hidden md:flex"
        initial={{ width: "50%" }}
        animate={{ width: nextvibeWidth }}
        transition={{ type: "spring", stiffness: 180, damping: 28 }}
        onMouseEnter={() => handleHover("nextvibe")}
        onMouseLeave={handleLeave}
        onClick={() => handleClick("nextvibe")}
      >
        <Div
          style={{
            ...NEXTVIBE_GLOW_STYLE,
            opacity: nextvibeActive ? 1 : 0.4,
            transition: "opacity 700ms",
            pointerEvents: "none",
          }}
        />
        <Div style={{ ...NEXTVIBE_GRID_STYLE, pointerEvents: "none" }} />
        <NextVibeContent
          locale={locale}
          totalToolCount={totalToolCount}
          compressed={nextvibeCompressed}
          pills={nextvibePills}
          t={t}
        />
        {!nextvibeActive && !nextvibeCompressed && (
          <Div className="absolute bottom-8 left-0 right-0 flex justify-center opacity-40 pointer-events-none">
            <P className="text-cyan-300 text-xs tracking-widest uppercase">
              {t("home.splitHero.clickToExplore")}
            </P>
          </Div>
        )}
      </MotionDiv>

      {/* ── RIGHT: next-vibe — mobile ── */}
      <Div className="md:hidden relative min-h-[60vh] flex flex-col justify-center overflow-hidden bg-[#020c1b]">
        <Div
          style={{
            ...NEXTVIBE_GLOW_STYLE,
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />
        <Div style={{ ...NEXTVIBE_GRID_STYLE, pointerEvents: "none" }} />
        <NextVibeContent
          locale={locale}
          totalToolCount={totalToolCount}
          compressed={false}
          pills={nextvibePills}
          t={t}
        />
      </Div>
    </Div>
  );
}

type ScopedT = ReturnType<(typeof scopedTranslation)["scopedT"]>["t"];

interface PillItem {
  Icon: ComponentType<{ className?: string }>;
  label: ReturnType<ScopedT>;
}

interface UnbottledContentProps {
  locale: CountryLanguage;
  compressed: boolean;
  pills: PillItem[];
  t: ScopedT;
}

function UnbottledContent({
  locale,
  compressed,
  pills,
  t,
}: UnbottledContentProps): JSX.Element {
  return (
    <Div
      className={cn(
        "relative z-10 px-8 md:px-14 lg:px-20 py-16 md:py-0 transition-all duration-500",
        compressed && "opacity-60 scale-95",
      )}
    >
      <MotionDiv
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium uppercase tracking-wider"
      >
        <Sparkles className="w-3 h-3" />
        {t("home.splitHero.unbottled.badge")}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <P className="text-violet-400/80 text-sm font-mono mb-2 tracking-widest uppercase">
          unbottled.ai
        </P>
        <H1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[0.9] mb-4">
          {t("home.splitHero.unbottled.titleLine1")}
          <Br />
          <Span className="text-transparent bg-clip-text bg-linear-to-br from-violet-400 to-fuchsia-400">
            {t("home.splitHero.unbottled.titleLine2")}
          </Span>
        </H1>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <P className="text-violet-200/60 text-lg max-w-sm leading-relaxed mb-8">
          {t("home.splitHero.unbottled.subtitle", {
            modelCount: String(TOTAL_MODEL_COUNT),
          })}
        </P>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-2 mb-10"
      >
        {pills.map(({ Icon, label }) => (
          <Span
            key={String(label)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-200 text-xs font-medium"
          >
            <Icon className="w-3 h-3 text-violet-400" />
            {label}
          </Span>
        ))}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Button
          size="lg"
          className="bg-violet-600 hover:bg-violet-500 text-white border-0 font-semibold shadow-lg shadow-violet-900/40"
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/${locale}/threads`}>
            {t("home.splitHero.unbottled.cta")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </MotionDiv>
    </Div>
  );
}

interface NextVibeContentProps {
  locale: CountryLanguage;
  totalToolCount: number;
  compressed: boolean;
  pills: PillItem[];
  t: ScopedT;
}

function NextVibeContent({
  locale,
  totalToolCount,
  compressed,
  pills,
  t,
}: NextVibeContentProps): JSX.Element {
  return (
    <Div
      className={cn(
        "relative z-10 px-8 md:px-14 lg:px-20 py-16 md:py-0 transition-all duration-500",
        compressed && "opacity-60 scale-95",
      )}
    >
      <MotionDiv
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-medium uppercase tracking-wider"
      >
        <Code className="w-3 h-3" />
        {t("home.splitHero.nextvibe.badge")}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <P className="text-cyan-400/80 text-sm font-mono mb-2 tracking-widest uppercase">
          next-vibe
        </P>
        <H2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[0.9] mb-4 border-0">
          {t("home.splitHero.nextvibe.titleLine1")}
          <Br />
          <Span className="text-transparent bg-clip-text bg-linear-to-br from-cyan-400 to-blue-400">
            {t("home.splitHero.nextvibe.titleLine2")}
          </Span>
        </H2>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <P className="text-cyan-200/60 text-lg max-w-sm leading-relaxed mb-8">
          {t("home.splitHero.nextvibe.subtitle", {
            toolCount: String(totalToolCount),
          })}
        </P>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="flex flex-wrap gap-2 mb-10"
      >
        {pills.map(({ Icon, label }) => (
          <Span
            key={String(label)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs font-medium"
          >
            <Icon className="w-3 h-3 text-cyan-400" />
            {label}
          </Span>
        ))}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Button
          size="lg"
          variant="outline"
          className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 font-semibold"
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <Link href="https://github.com/techfreaque/next-vibe">
            <GitBranch className="mr-2 h-4 w-4" />
            {t("home.splitHero.nextvibe.ctaGithub")}
          </Link>
        </Button>
        <Button
          size="lg"
          className="bg-cyan-600 hover:bg-cyan-500 text-white border-0 font-semibold shadow-lg shadow-cyan-900/40"
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/${locale}/story/framework`}>
            {t("home.splitHero.nextvibe.ctaDocs")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </MotionDiv>
    </Div>
  );
}
