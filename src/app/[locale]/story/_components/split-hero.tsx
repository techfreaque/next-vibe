"use client";

import { Br } from "next-vibe-ui/ui/br";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Bot } from "next-vibe-ui/ui/icons/Bot";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { Key } from "next-vibe-ui/ui/icons/Key";
import { Layers } from "next-vibe-ui/ui/icons/Layers";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import type { ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Link } from "next-vibe-ui/ui/link";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H1, H2, P } from "next-vibe-ui/ui/typography";
import type { ComponentType, CSSProperties, JSX } from "react";
import { useState } from "react";

import { PLATFORM_COUNT } from "@/config/constants";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

export type ActiveSide = "unbottled" | "personal" | "nextvibe" | null;

interface SplitHeroProps {
  locale: CountryLanguage;
  totalToolCount: number;
  totalModelCount: number;
  totalSkillCount: number;
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

/** Shared panel wrapper — centers content vertically & horizontally */
function Panel({
  bg,
  glow,
  grid,
  onClick,
  children,
  mobileOnly,
  desktopOnly,
}: {
  bg: string;
  glow: CSSProperties;
  grid: CSSProperties;
  onClick?: () => void;
  children: React.ReactNode;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}): JSX.Element {
  const visibility = mobileOnly
    ? "md:hidden"
    : desktopOnly
      ? "hidden md:flex"
      : "flex";

  return (
    <Div
      className={`relative ${visibility} flex-col items-center justify-start md:w-1/3 overflow-hidden cursor-pointer self-stretch ${bg}`}
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

/** Vertical "OR" divider rendered absolutely between desktop panels */
function VerticalDivider({ label }: { label: string }): JSX.Element {
  return (
    <Div className="absolute inset-y-0 flex flex-col items-center justify-center pointer-events-none z-20">
      <Div className="w-px flex-1 bg-border/40" />
      <Div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center my-3 shrink-0">
        <Span className="text-xs font-bold text-muted-foreground">{label}</Span>
      </Div>
      <Div className="w-px flex-1 bg-border/40" />
    </Div>
  );
}

export function SplitHero({
  locale,
  totalToolCount,
  totalModelCount,
  totalSkillCount,
  onSideChange,
}: SplitHeroProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [locked, setLocked] = useState<ActiveSide>(null);
  const orLabel = t("home.splitHero.or");

  function handleClick(side: ActiveSide): void {
    const next = locked === side ? null : side;
    setLocked(next);
    onSideChange?.(next);
  }

  const unbottledPills: PillItem[] = [
    {
      Icon: Bot,
      label: t("home.splitHero.unbottled.pill1", {
        modelCount: String(totalModelCount),
      }),
    },
    { Icon: Shield, label: t("home.splitHero.unbottled.pill2") },
    {
      Icon: Zap,
      label: t("home.splitHero.unbottled.pill3", {
        skillCount: String(totalSkillCount),
      }),
    },
  ];

  const personalPills: PillItem[] = [
    { Icon: Server, label: t("home.splitHero.personal.pill1") },
    { Icon: Key, label: t("home.splitHero.personal.pill2") },
    { Icon: RefreshCw, label: t("home.splitHero.personal.pill3") },
  ];

  const nextvibePills: PillItem[] = [
    { Icon: Layers, label: t("home.splitHero.nextvibe.pill1") },
    { Icon: Code, label: t("home.splitHero.nextvibe.pill2") },
    {
      Icon: GitBranch,
      label: t("home.splitHero.nextvibe.pill3", {
        platformCount: String(PLATFORM_COUNT),
      }),
    },
  ];

  return (
    <Div className="relative flex flex-col md:flex-row">
      {/* Desktop vertical dividers — positioned at 1/3 and 2/3 */}
      <Div className="absolute inset-y-0 left-1/3 hidden md:flex -translate-x-1/2">
        <VerticalDivider label={orLabel} />
      </Div>
      <Div className="absolute inset-y-0 left-2/3 hidden md:flex -translate-x-1/2">
        <VerticalDivider label={orLabel} />
      </Div>

      {/* unbottled.ai */}
      <Panel
        bg="bg-[#0d0014]"
        glow={UNBOTTLED_GLOW}
        grid={UNBOTTLED_GRID}
        onClick={() => handleClick("unbottled")}
      >
        <UnbottledContent
          locale={locale}
          pills={unbottledPills}
          t={t}
          onSideChange={onSideChange}
          totalModelCount={totalModelCount}
        />
      </Panel>

      <HorizontalDivider label={orLabel} />

      {/* personal self-host */}
      <Panel
        bg="bg-[#000d1b]"
        glow={PERSONAL_GLOW}
        grid={PERSONAL_GRID}
        onClick={() => handleClick("personal")}
      >
        <PersonalContent locale={locale} pills={personalPills} t={t} />
      </Panel>

      <HorizontalDivider label={orLabel} />

      {/* next-vibe framework */}
      <Panel
        bg="bg-[#020c1b]"
        glow={NEXTVIBE_GLOW}
        grid={NEXTVIBE_GRID}
        onClick={() => handleClick("nextvibe")}
      >
        <NextVibeContent
          locale={locale}
          totalToolCount={totalToolCount}
          pills={nextvibePills}
          t={t}
        />
      </Panel>
    </Div>
  );
}

type ScopedT = ReturnType<(typeof scopedTranslation)["scopedT"]>["t"];

interface PillItem {
  Icon: ComponentType<{ className?: string }>;
  label: ReturnType<ScopedT>;
}

interface PanelContentProps {
  locale: CountryLanguage;
  pills: PillItem[];
  t: ScopedT;
  onSideChange?: (side: ActiveSide) => void;
  totalModelCount?: number;
}

/** Shared inner content layout — always centered within its panel */
function PanelInner({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Div className="relative z-10 w-full px-8 md:px-10 lg:px-14 py-14 md:py-20 flex flex-col items-center text-center">
      {children}
    </Div>
  );
}

function UnbottledContent({
  locale,
  pills,
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
        <Sparkles className="w-3 h-3" />
        {t("home.splitHero.unbottled.badge")}
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <P className="text-violet-400/80 text-xs font-mono mb-2 tracking-widest uppercase">
          unbottled.ai
        </P>
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2 mb-8"
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

function PersonalContent({ locale, pills, t }: PanelContentProps): JSX.Element {
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
        <P className="text-emerald-400/80 text-xs font-mono mb-2 tracking-widest uppercase">
          self-host
        </P>
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
          {t("home.splitHero.personal.subtitle")}
        </P>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="flex flex-wrap justify-center gap-2 mb-8"
      >
        {pills.map(({ Icon, label }) => (
          <Span
            key={String(label)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs font-medium"
          >
            <Icon className="w-3 h-3 text-emerald-400" />
            {label}
          </Span>
        ))}
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
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <Link href="https://github.com/techfreaque/next-vibe">
            <GitBranch className="mr-2 h-4 w-4" />
            {t("home.splitHero.personal.ctaGithub")}
          </Link>
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
  totalToolCount,
  pills,
  t,
}: NextVibeContentProps): JSX.Element {
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
        <P className="text-cyan-400/80 text-xs font-mono mb-2 tracking-widest uppercase">
          next-vibe
        </P>
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
          {t("home.splitHero.nextvibe.subtitle", {
            toolCount: String(totalToolCount),
          })}
        </P>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center gap-2 mb-8"
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
        transition={{ delay: 0.6 }}
        className="flex flex-wrap justify-center gap-3 w-full"
      >
        <Button
          size="lg"
          variant="outline"
          className="bg-transparent border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/15 hover:text-cyan-200 hover:border-cyan-400 font-semibold flex-1 min-w-[140px]"
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
          className="bg-cyan-600 hover:bg-cyan-500 text-white border-0 font-semibold shadow-lg shadow-cyan-900/40 flex-1 min-w-[140px]"
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/${locale}/story/framework`}>
            {t("home.splitHero.nextvibe.ctaDocs")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </MotionDiv>
    </PanelInner>
  );
}
