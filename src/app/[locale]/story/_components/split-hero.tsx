"use client";

import { Br } from "next-vibe-ui/ui/br";
import type { ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { Link } from "next-vibe-ui/ui/link";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, P } from "next-vibe-ui/ui/typography";
import type { CSSProperties, JSX } from "react";
import { useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { configScopedTranslation } from "@/config/i18n";

import { scopedTranslation } from "./i18n";

export type ActiveSide =
  | "unbottled"
  | "personal"
  | "nextvibe"
  | "referral"
  | null;

interface SplitHeroProps {
  locale: CountryLanguage;
  totalToolCount: number;
  totalModelCount: number;
  onSideChange?: (side: ActiveSide) => void;
}

const BASE_OVERLAY: CSSProperties = { position: "absolute", inset: 0 };

const UNBOTTLED_GLOW: CSSProperties = {
  ...BASE_OVERLAY,
  background:
    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(167,80,255,0.35) 0%, transparent 70%)",
  opacity: 0.4,
  pointerEvents: "none",
};
const UNBOTTLED_GRID: CSSProperties = {
  ...BASE_OVERLAY,
  opacity: 0.04,
  backgroundImage:
    "linear-gradient(rgba(167,80,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,80,255,1) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
  pointerEvents: "none",
};

const PERSONAL_GLOW: CSSProperties = {
  ...BASE_OVERLAY,
  background:
    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.30) 0%, transparent 70%)",
  opacity: 0.4,
  pointerEvents: "none",
};
const PERSONAL_GRID: CSSProperties = {
  ...BASE_OVERLAY,
  opacity: 0.04,
  backgroundImage:
    "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
  pointerEvents: "none",
};

const NEXTVIBE_GLOW: CSSProperties = {
  ...BASE_OVERLAY,
  background:
    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.25) 0%, transparent 70%)",
  opacity: 0.4,
  pointerEvents: "none",
};
const NEXTVIBE_GRID: CSSProperties = {
  ...BASE_OVERLAY,
  opacity: 0.04,
  backgroundImage:
    "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
  pointerEvents: "none",
};

const REFERRAL_GLOW: CSSProperties = {
  ...BASE_OVERLAY,
  background:
    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(244,63,94,0.30) 0%, transparent 70%)",
  opacity: 0.4,
  pointerEvents: "none",
};
const REFERRAL_GRID: CSSProperties = {
  ...BASE_OVERLAY,
  opacity: 0.04,
  backgroundImage:
    "linear-gradient(rgba(244,63,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,63,94,1) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
  pointerEvents: "none",
};

/** Shared panel wrapper */
function Panel({
  bg,
  glow,
  grid,
  onClick,
  children,
}: {
  bg: string;
  glow: CSSProperties;
  grid: CSSProperties;
  onClick?: () => void;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <Div
      className={`relative flex flex-col items-center justify-start overflow-hidden cursor-pointer self-stretch ${bg}`}
      onClick={onClick}
    >
      <Div style={glow} />
      <Div style={grid} />
      {children}
    </Div>
  );
}

/** Horizontal "OR" bar used between mobile stacked panels */
function HorizontalDivider({ label }: { label: string }): JSX.Element {
  return (
    <Div className="md:hidden w-full flex items-center gap-4 px-8 py-4 bg-background/50">
      <Div className="flex-1 h-px bg-border/40" />
      <Span className="text-xs font-bold text-muted-foreground">{label}</Span>
      <Div className="flex-1 h-px bg-border/40" />
    </Div>
  );
}

export function SplitHero({
  locale,
  totalToolCount,
  totalModelCount,
  onSideChange,
}: SplitHeroProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const [locked, setLocked] = useState<ActiveSide>(null);
  const orLabel = t("home.splitHero.or");

  function handleClick(side: ActiveSide): void {
    const next = locked === side ? null : side;
    setLocked(next);
    onSideChange?.(next);
  }

  return (
    <Div className="relative flex flex-col">
      {/* Orientation strip */}
      <Div className="w-full bg-[#080010] px-6 py-12 md:py-20 text-center">
        <Div className="text-2xl md:text-4xl font-black text-white tracking-tighter mb-3">
          {t("home.splitHero.header")}
        </Div>
        <Div className="text-xs md:text-sm text-white/40 tracking-widest uppercase">
          {t("home.splitHero.subheader")}
        </Div>
      </Div>
      {/* Mobile: flex-col with dividers interleaved */}
      <Div className="flex flex-col md:hidden">
        <Panel
          bg="bg-[#0d0014]"
          glow={UNBOTTLED_GLOW}
          grid={UNBOTTLED_GRID}
          onClick={() => handleClick("unbottled")}
        >
          <UnbottledContent
            locale={locale}
            t={t}
            onSideChange={onSideChange}
            totalModelCount={totalModelCount}
          />
        </Panel>
        <HorizontalDivider label={orLabel} />
        <Panel
          bg="bg-[#000d1b]"
          glow={PERSONAL_GLOW}
          grid={PERSONAL_GRID}
          onClick={() => handleClick("personal")}
        >
          <PersonalContent
            locale={locale}
            t={t}
            onSideChange={onSideChange}
            appName={appName}
            totalModelCount={totalModelCount}
          />
        </Panel>
        <HorizontalDivider label={orLabel} />
        <Panel
          bg="bg-[#020c1b]"
          glow={NEXTVIBE_GLOW}
          grid={NEXTVIBE_GRID}
          onClick={() => handleClick("nextvibe")}
        >
          <NextVibeContent
            locale={locale}
            totalToolCount={totalToolCount}
            t={t}
            onSideChange={onSideChange}
          />
        </Panel>
        <HorizontalDivider label={orLabel} />
        <Panel
          bg="bg-[#1a000d]"
          glow={REFERRAL_GLOW}
          grid={REFERRAL_GRID}
          onClick={() => handleClick("referral")}
        >
          <ReferralContent locale={locale} t={t} onSideChange={onSideChange} />
        </Panel>
      </Div>

      {/* Desktop: pure 2×2 grid — no extra children that would skew row heights */}
      <Div className="relative hidden md:grid md:grid-cols-2">
        {/* Center badge */}
        <Div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex z-30">
          <Div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
            <Span className="text-xs font-bold text-muted-foreground">
              {orLabel}
            </Span>
          </Div>
        </Div>
        {/* Vertical line top half */}
        <Div className="absolute top-0 left-1/2 h-[calc(50%-20px)] w-px bg-white/20 -translate-x-1/2 z-20" />
        {/* Vertical line bottom half */}
        <Div className="absolute bottom-0 left-1/2 h-[calc(50%-20px)] w-px bg-white/20 -translate-x-1/2 z-20" />
        {/* Horizontal line left half */}
        <Div className="absolute top-1/2 left-0 w-[calc(50%-20px)] h-px bg-white/20 -translate-y-1/2 z-20" />
        {/* Horizontal line right half */}
        <Div className="absolute top-1/2 right-0 w-[calc(50%-20px)] h-px bg-white/20 -translate-y-1/2 z-20" />

        {/* unbottled.ai - top-left */}
        <Panel
          bg="bg-[#0d0014]"
          glow={UNBOTTLED_GLOW}
          grid={UNBOTTLED_GRID}
          onClick={() => handleClick("unbottled")}
        >
          <UnbottledContent
            locale={locale}
            t={t}
            onSideChange={onSideChange}
            totalModelCount={totalModelCount}
          />
        </Panel>

        {/* personal self-host - top-right */}
        <Panel
          bg="bg-[#000d1b]"
          glow={PERSONAL_GLOW}
          grid={PERSONAL_GRID}
          onClick={() => handleClick("personal")}
        >
          <PersonalContent
            locale={locale}
            t={t}
            onSideChange={onSideChange}
            appName={appName}
            totalModelCount={totalModelCount}
          />
        </Panel>

        {/* next-vibe framework - bottom-left */}
        <Panel
          bg="bg-[#020c1b]"
          glow={NEXTVIBE_GLOW}
          grid={NEXTVIBE_GRID}
          onClick={() => handleClick("nextvibe")}
        >
          <NextVibeContent
            locale={locale}
            totalToolCount={totalToolCount}
            t={t}
            onSideChange={onSideChange}
          />
        </Panel>

        {/* referral + skills - bottom-right */}
        <Panel
          bg="bg-[#1a000d]"
          glow={REFERRAL_GLOW}
          grid={REFERRAL_GRID}
          onClick={() => handleClick("referral")}
        >
          <ReferralContent locale={locale} t={t} onSideChange={onSideChange} />
        </Panel>
      </Div>
    </Div>
  );
}

type ScopedT = ReturnType<(typeof scopedTranslation)["scopedT"]>["t"];

interface PanelContentProps {
  locale: CountryLanguage;
  t: ScopedT;
  onSideChange?: (side: ActiveSide) => void;
  totalModelCount?: number;
}

interface PersonalContentProps extends PanelContentProps {
  appName: string;
  totalModelCount: number;
}

/** Shared inner content layout */
function PanelInner({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Div className="relative z-10 w-full px-8 md:px-10 lg:px-14 py-14 md:py-20 flex flex-col items-center text-center">
      {children}
    </Div>
  );
}

function UnbottledContent({
  locale,
  t,
  onSideChange,
  totalModelCount = 0,
}: PanelContentProps): JSX.Element {
  function handleLearnMore(e: ButtonMouseEvent): void {
    e.stopPropagation();
    onSideChange?.("unbottled");
    setTimeout(() => {
      document
        .getElementById("universe-content")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
  return (
    <PanelInner>
      <MotionDiv
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium uppercase tracking-wider"
      >
        <MessageSquare className="w-3 h-3" />
        {t("home.splitHero.unbottled.badge")}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <H1 className="text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter text-white leading-[0.9] mb-4">
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
        <P className="text-violet-200/60 text-sm md:text-sm lg:text-base leading-relaxed mb-6">
          {t("home.splitHero.unbottled.subtitle", {
            modelCount: String(totalModelCount),
          })}
        </P>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center gap-3 w-full"
      >
        <Button
          size="lg"
          className="bg-violet-600 hover:bg-violet-500 text-white border-0 font-semibold shadow-lg shadow-violet-900/40"
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/${locale}/threads`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            {t("home.splitHero.unbottled.cta")}
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="bg-transparent border-violet-500/40 text-violet-300 hover:bg-violet-500/15 hover:text-violet-200 hover:border-violet-400 font-semibold"
          onClick={handleLearnMore}
        >
          {t("home.splitHero.unbottled.ctaExplore")}
        </Button>
      </MotionDiv>
    </PanelInner>
  );
}

function PersonalContent({
  locale,
  t,
  onSideChange,
  appName,
}: PersonalContentProps): JSX.Element {
  function handleLearnMore(e: ButtonMouseEvent): void {
    e.stopPropagation();
    onSideChange?.("personal");
    setTimeout(() => {
      document
        .getElementById("universe-content")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
  return (
    <PanelInner>
      <MotionDiv
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-medium uppercase tracking-wider"
      >
        <Server className="w-3 h-3" />
        {t("home.splitHero.personal.badge")}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <H2 className="text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter text-white leading-[0.9] mb-4 border-0">
          {t("home.splitHero.personal.titleLine1")}
          <Br />
          <Span className="text-transparent bg-clip-text bg-linear-to-br from-emerald-400 to-teal-400">
            {t("home.splitHero.personal.titleLine2")}
          </Span>
        </H2>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <P className="text-emerald-200/60 text-sm md:text-sm lg:text-base leading-relaxed mb-6">
          {t("home.splitHero.personal.subtitle", { appName })}
        </P>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="flex flex-wrap justify-center gap-3 w-full"
      >
        <Button
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 font-semibold shadow-lg shadow-emerald-900/40"
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/${locale}/story/self-host`}>
            {t("home.splitHero.personal.cta")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="bg-transparent border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/15 hover:text-emerald-200 hover:border-emerald-400 font-semibold"
          onClick={handleLearnMore}
        >
          {t("home.splitHero.personal.ctaGithub")}
        </Button>
      </MotionDiv>
    </PanelInner>
  );
}

interface NextVibeContentProps extends PanelContentProps {
  totalToolCount: number;
}

function NextVibeContent({
  locale,
  t,
  onSideChange,
}: NextVibeContentProps): JSX.Element {
  function handleLearnMore(e: ButtonMouseEvent): void {
    e.stopPropagation();
    onSideChange?.("nextvibe");
    setTimeout(() => {
      document
        .getElementById("universe-content")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
  return (
    <PanelInner>
      <MotionDiv
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-medium uppercase tracking-wider"
      >
        <Code className="w-3 h-3" />
        {t("home.splitHero.nextvibe.badge")}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <H2 className="text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter text-white leading-[0.9] mb-4 border-0">
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
        transition={{ delay: 0.4 }}
      >
        <P className="text-cyan-200/60 text-sm md:text-sm lg:text-base leading-relaxed mb-6">
          {t("home.splitHero.nextvibe.subtitle")}
        </P>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap justify-center gap-3 w-full"
      >
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
        <Button
          size="lg"
          variant="outline"
          className="bg-transparent border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/15 hover:text-cyan-200 hover:border-cyan-400 font-semibold"
          onClick={handleLearnMore}
        >
          {t("home.splitHero.nextvibe.ctaExplore")}
        </Button>
      </MotionDiv>
    </PanelInner>
  );
}

function ReferralContent({
  locale,
  t,
  onSideChange,
}: PanelContentProps): JSX.Element {
  function handleLearnMore(e: ButtonMouseEvent): void {
    e.stopPropagation();
    onSideChange?.("referral");
    setTimeout(() => {
      document
        .getElementById("universe-content")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
  return (
    <PanelInner>
      <MotionDiv
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-medium uppercase tracking-wider"
      >
        <TrendingUp className="w-3 h-3" />
        {t("home.splitHero.referral.badge")}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <H2 className="text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter text-white leading-[0.9] mb-4 border-0">
          {t("home.splitHero.referral.titleLine1")}
          {t("home.splitHero.referral.titleLine2") ? (
            <>
              <Br />
              <Span className="text-transparent bg-clip-text bg-linear-to-br from-rose-400 to-pink-400">
                {t("home.splitHero.referral.titleLine2")}
              </Span>
            </>
          ) : null}
        </H2>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <P className="text-rose-200/60 text-sm md:text-sm lg:text-base leading-relaxed mb-6">
          {t("home.splitHero.referral.subtitle")}
        </P>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="flex flex-wrap justify-center gap-3 w-full"
      >
        <Button
          size="lg"
          className="bg-rose-600 hover:bg-rose-500 text-white border-0 font-semibold shadow-lg shadow-rose-900/40"
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/${locale}/story/referral`}>
            {t("home.splitHero.referral.cta")}
            <TrendingUp className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="bg-transparent border-rose-500/40 text-rose-300 hover:bg-rose-500/15 hover:text-rose-200 hover:border-rose-400 font-semibold"
          onClick={handleLearnMore}
        >
          {t("home.splitHero.referral.ctaExplore")}
        </Button>
      </MotionDiv>
    </PanelInner>
  );
}
