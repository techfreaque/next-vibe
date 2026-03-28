"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { SplitHero } from "./split-hero";
import { StatsStrip } from "./stats-strip";
import { UniverseContent } from "./universe-content";

type ActiveSide = "unbottled" | "nextvibe" | null;

interface HomeClientProps {
  locale: CountryLanguage;
  totalToolCount: number;
  totalEndpointCount: number;
  subPrice: number;
  subCurrency: string;
}

export function HomeClient({
  locale,
  totalToolCount,
  totalEndpointCount,
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
        onSideChange={handleSideChange}
      />
      <UniverseContent
        locale={locale}
        totalToolCount={totalToolCount}
        subPrice={subPrice}
        subCurrency={subCurrency}
        totalEndpointCount={totalEndpointCount}
        activeSide={activeSide}
        onSideChange={setActiveSide}
      />
      <StatsStrip locale={locale} totalEndpointCount={totalEndpointCount} />
    </Div>
  );
}
