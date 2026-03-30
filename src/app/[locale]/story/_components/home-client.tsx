"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import type { ActiveSide } from "./split-hero";
import { SplitHero } from "./split-hero";
import { UniverseContent } from "./universe-content";

interface HomeClientProps {
  locale: CountryLanguage;
  totalToolCount: number;
  totalEndpointCount: number;
  totalModelCount: number;
  totalProviderCount: number;
  totalSkillCount: number;
  subPrice: number;
  subCurrency: string;
}

export function HomeClient({
  locale,
  totalToolCount,
  totalEndpointCount,
  totalModelCount,
  totalProviderCount,
  totalSkillCount,
  subPrice,
  subCurrency,
}: HomeClientProps): JSX.Element {
  const [activeSide, setActiveSide] = useState<ActiveSide>(null);

  function handleSideChange(side: ActiveSide): void {
    setActiveSide(side);
    if (side !== null) {
      setTimeout(() => {
        const el = document.getElementById("universe-content");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }

  return (
    <Div role="main" className="flex min-h-screen flex-col w-full">
      <SplitHero
        locale={locale}
        totalToolCount={totalToolCount}
        totalModelCount={totalModelCount}
        totalSkillCount={totalSkillCount}
        onSideChange={handleSideChange}
      />
      <UniverseContent
        locale={locale}
        totalToolCount={totalToolCount}
        subPrice={subPrice}
        subCurrency={subCurrency}
        totalEndpointCount={totalEndpointCount}
        totalModelCount={totalModelCount}
        totalProviderCount={totalProviderCount}
        totalSkillCount={totalSkillCount}
        activeSide={activeSide}
        onSideChange={setActiveSide}
      />
    </Div>
  );
}
