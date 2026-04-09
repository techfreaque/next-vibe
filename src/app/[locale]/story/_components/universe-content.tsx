"use client";

import { Div } from "next-vibe-ui/ui/div";
import { AnimatePresence, MotionDiv } from "next-vibe-ui/ui/motion";
import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";

import type { ModelCountsByContentLevel } from "@/app/api/[locale]/agent/models/all-models";
import type { CountryLanguage } from "@/i18n/core/config";

import { Architecture } from "./architecture";
import CallToAction from "./call-to-action";
import { CapabilityShowcase } from "./capability-showcase";
import { NextVibeShowcase } from "./nextvibe-showcase";
import { OpenClawComparison } from "./openclaw-comparison";
import { PersonalShowcase } from "./personal-showcase";
import { ProblemStatement } from "./problem-statement";
import { SelfHostSection } from "./self-host-section";
import type { ActiveSide } from "./split-hero";
import { StatsStrip } from "./stats-strip";

type TabId = "unbottled" | "personal" | "nextvibe" | "creators";

interface UniverseContentProps {
  locale: CountryLanguage;
  totalToolCount: number;
  subPrice: number;
  subCurrency: string;
  totalEndpointCount: number;
  totalModelCount: number;
  totalProviderCount: number;
  totalSkillCount: number;
  modelCountsByTier: ModelCountsByContentLevel;
  activeSide: ActiveSide;
  onSideChange: (side: ActiveSide) => void;
}

export function UniverseContent({
  locale,
  totalToolCount,
  totalEndpointCount,
  totalModelCount,
  totalProviderCount,
  totalSkillCount,
  modelCountsByTier,
  activeSide,
}: UniverseContentProps): JSX.Element {
  const [localActive, setLocalActive] = useState<TabId>("unbottled");
  const lastActiveSide = useRef(activeSide);

  useEffect(() => {
    if (activeSide !== null && activeSide !== lastActiveSide.current) {
      setLocalActive(activeSide);
    }
    lastActiveSide.current = activeSide;
  }, [activeSide]);

  const current: TabId = activeSide ?? localActive;

  return (
    <Div id="universe-content" className="relative">
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
              modelCountsByTier={modelCountsByTier}
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
        {current === "creators" && (
          <MotionDiv
            key="creators"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
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
