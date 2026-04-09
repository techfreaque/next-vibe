"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { Server } from "next-vibe-ui/ui/icons/Server";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Star } from "next-vibe-ui/ui/icons/Star";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import { H2, P } from "next-vibe-ui/ui/typography";
import type { ComponentType, JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "./i18n";

export type ActiveSide =
  | "unbottled"
  | "personal"
  | "nextvibe"
  | "creators"
  | null;

interface SplitHeroProps {
  locale: CountryLanguage;
  totalModelCount: number;
  activeSide: ActiveSide;
  onSideChange: (side: ActiveSide) => void;
}

interface CardDef {
  id: Exclude<ActiveSide, null>;
  Icon: ComponentType<{ className?: string }>;
  badgeColor: string;
  iconColor: string;
  borderActive: string;
  glowActive: string;
  glowStyle: string;
  gridStyle: string;
}

const CARDS: CardDef[] = [
  {
    id: "unbottled",
    Icon: Sparkles,
    badgeColor: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    iconColor: "text-violet-400",
    borderActive: "border-violet-500/60",
    glowActive:
      "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(167,80,255,0.4) 0%, transparent 70%)",
    glowStyle:
      "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(167,80,255,0.18) 0%, transparent 70%)",
    gridStyle:
      "linear-gradient(rgba(167,80,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,80,255,1) 1px, transparent 1px)",
  },
  {
    id: "personal",
    Icon: Server,
    badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    iconColor: "text-emerald-400",
    borderActive: "border-emerald-500/60",
    glowActive:
      "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.4) 0%, transparent 70%)",
    glowStyle:
      "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.18) 0%, transparent 70%)",
    gridStyle:
      "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
  },
  {
    id: "nextvibe",
    Icon: Code,
    badgeColor: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    iconColor: "text-cyan-400",
    borderActive: "border-cyan-500/60",
    glowActive:
      "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.4) 0%, transparent 70%)",
    glowStyle:
      "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.18) 0%, transparent 70%)",
    gridStyle:
      "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)",
  },
  {
    id: "creators",
    Icon: Star,
    badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    iconColor: "text-amber-400",
    borderActive: "border-amber-500/60",
    glowActive:
      "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.4) 0%, transparent 70%)",
    glowStyle:
      "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.18) 0%, transparent 70%)",
    gridStyle:
      "linear-gradient(rgba(245,158,11,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,1) 1px, transparent 1px)",
  },
];

interface CardText {
  badge: string;
  title: string;
  subtitle: string;
}

export function SplitHero({
  locale,
  totalModelCount,
  activeSide,
  onSideChange,
}: SplitHeroProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const mc = String(totalModelCount);

  const cardTexts: Record<Exclude<ActiveSide, null>, CardText> = {
    unbottled: {
      badge: t("home.splitHero.unbottled.badge"),
      title: t("home.splitHero.unbottled.title"),
      subtitle: t("home.splitHero.unbottled.subtitle", { modelCount: mc }),
    },
    personal: {
      badge: t("home.splitHero.personal.badge"),
      title: t("home.splitHero.personal.title"),
      subtitle: t("home.splitHero.personal.subtitle"),
    },
    nextvibe: {
      badge: t("home.splitHero.nextvibe.badge"),
      title: t("home.splitHero.nextvibe.title"),
      subtitle: t("home.splitHero.nextvibe.subtitle"),
    },
    creators: {
      badge: t("home.splitHero.creators.badge"),
      title: t("home.splitHero.creators.title"),
      subtitle: t("home.splitHero.creators.subtitle", { commission: "5" }),
    },
  };

  function handleClick(id: Exclude<ActiveSide, null>): void {
    const next = activeSide === id ? null : id;
    onSideChange(next);
  }

  return (
    <Div className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <Div className="max-w-4xl mx-auto grid grid-cols-2 gap-4">
        {CARDS.map((card, i) => {
          const {
            id,
            Icon,
            badgeColor,
            iconColor,
            borderActive,
            glowActive,
            glowStyle,
            gridStyle,
          } = card;
          const active = activeSide === id;
          const { badge, title, subtitle } = cardTexts[id];

          return (
            <MotionDiv
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              onClick={() => handleClick(id)}
              className={`relative overflow-hidden rounded-xl border cursor-pointer transition-all duration-300 bg-[#0a0a12] ${
                active
                  ? `${borderActive} shadow-lg`
                  : "border-white/8 hover:border-white/20"
              }`}
            >
              {/* Background glow */}
              <Div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: active ? glowActive : glowStyle,
                  opacity: active ? 1 : 0.5,
                  pointerEvents: "none",
                  transition: "opacity 0.3s",
                }}
              />
              {/* Grid overlay */}
              <Div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.03,
                  backgroundImage: gridStyle,
                  backgroundSize: "40px 40px",
                  pointerEvents: "none",
                }}
              />

              <Div className="relative z-10 p-5 sm:p-6 flex flex-col gap-3">
                {/* Badge */}
                <Span
                  className={`inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full border text-xs font-medium uppercase tracking-wider ${badgeColor}`}
                >
                  <Icon className={`w-3 h-3 ${iconColor}`} />
                  {badge}
                </Span>

                {/* Title */}
                <H2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight border-0 m-0">
                  {title}
                </H2>

                {/* Subtitle */}
                <P className="text-sm text-white/50 leading-relaxed m-0">
                  {subtitle}
                </P>
              </Div>
            </MotionDiv>
          );
        })}
      </Div>
    </Div>
  );
}
