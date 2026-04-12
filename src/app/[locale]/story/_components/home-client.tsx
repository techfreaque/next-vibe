"use client";

import { Div } from "next-vibe-ui/ui/div";
import { useSearchParams } from "next-vibe-ui/hooks/use-navigation";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import type { ModelCountsByContentLevel } from "@/app/api/[locale]/agent/models/all-models";
import type { CountryLanguage } from "@/i18n/core/config";

import { SITE_FOOTER_ID } from "../constants";
import type { ActiveSide } from "./split-hero";
import { SplitHero } from "./split-hero";
import { UniverseContent } from "./universe-content";

interface HomeClientProps {
  locale: CountryLanguage;
  totalToolCount: number;
  totalModelCount: number;
  totalProviderCount: number;
  modelCountsByTier: ModelCountsByContentLevel;
  hasUser: boolean;
}

const VALID_TABS = ["unbottled", "personal", "nextvibe", "referral"] as const;
type TabId = (typeof VALID_TABS)[number];

function isValidTab(value: string | null): value is TabId {
  return VALID_TABS.includes(value as TabId);
}

export function HomeClient({
  locale,
  totalToolCount,
  totalModelCount,
  totalProviderCount,
  modelCountsByTier,
  hasUser,
}: HomeClientProps): JSX.Element {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeSide, setActiveSide] = useState<ActiveSide>(
    isValidTab(tabParam) ? tabParam : null,
  );

  useEffect(() => {
    const el = document.getElementById(SITE_FOOTER_ID);
    if (el) {
      el.style.display = activeSide === null ? "none" : "";
    }
    return (): void => {
      if (el) {
        el.style.display = "";
      }
    };
  }, [activeSide]);

  useEffect(() => {
    if (isValidTab(tabParam)) {
      setActiveSide(tabParam);
      setTimeout(() => {
        const el = document.getElementById("universe-content");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [tabParam]);

  function handleSideChange(side: ActiveSide): void {
    setActiveSide(side);
    if (side !== null) {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", side);
      url.hash = "universe-content";
      window.history.replaceState(null, "", url.toString());
      setTimeout(() => {
        const el = document.getElementById("universe-content");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete("tab");
      url.hash = "";
      window.history.replaceState(null, "", url.toString());
    }
  }

  return (
    <Div role="main" className="flex flex-col w-full">
      <SplitHero
        locale={locale}
        totalToolCount={totalToolCount}
        totalModelCount={totalModelCount}
        onSideChange={handleSideChange}
      />
      <UniverseContent
        locale={locale}
        totalToolCount={totalToolCount}
        totalModelCount={totalModelCount}
        totalProviderCount={totalProviderCount}
        modelCountsByTier={modelCountsByTier}
        activeSide={activeSide}
        onSideChange={handleSideChange}
        hasUser={hasUser}
      />
    </Div>
  );
}
