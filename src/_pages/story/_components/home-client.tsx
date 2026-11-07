"use client";

import type { ModelCountsByContentLevel } from "next-vibe/agent/models/all-models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Main } from "next-vibe/ui/components/main";
import { useRouter, useSearchParams } from "next-vibe/ui/hooks/use-navigation";
import { getElementById } from "next-vibe/ui/lib/dom";
import type { JSX } from "react";
import { useEffect } from "react";

import { CapabilityShowcase } from "./capability-showcase";
import { HomeHero } from "./home-hero";
import {
  HomeFaq,
  HowItWorks,
  MoreWaysIn,
  PricingTeaser,
} from "./home-sections";
import { ProblemStatement } from "./problem-statement";
import { UnbottledCta } from "./tab-unbottled";

interface HomeClientProps {
  locale: CountryLanguage;
  totalToolCount: number;
  totalModelCount: number;
  totalProviderCount: number;
  modelCountsByTier: ModelCountsByContentLevel;
  hasUser: boolean;
}

/** Old home tabs (?tab=...) now live on their own pages */
const LEGACY_TAB_PATHS: Record<string, string> = {
  personal: "/story/self-host",
  nextvibe: "/story/framework",
  referral: "/story/earn",
};

function scrollToHow(): void {
  getElementById("how-it-works")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

/**
 * Home v2 - sells the chat product end to end:
 * hero → why → how it works → what it can do → pricing → beyond chat → FAQ → CTA.
 */
export function HomeClient({
  locale,
  totalToolCount,
  totalModelCount,
  totalProviderCount,
  modelCountsByTier,
  hasUser,
}: HomeClientProps): JSX.Element {
  const router = useRouter();
  const tabParam = useSearchParams().get("tab");

  useEffect(() => {
    const target = tabParam ? LEGACY_TAB_PATHS[tabParam] : undefined;
    if (target) {
      router.replace(`/${locale}${target}`);
    }
  }, [tabParam, locale, router]);

  return (
    <Main className="flex w-full flex-col">
      <HomeHero
        locale={locale}
        totalToolCount={totalToolCount}
        totalModelCount={totalModelCount}
        totalProviderCount={totalProviderCount}
        modelCountsByTier={modelCountsByTier}
        onSeeHow={scrollToHow}
      />
      <ProblemStatement locale={locale} />
      <HowItWorks locale={locale} totalModelCount={totalModelCount} />
      <CapabilityShowcase
        locale={locale}
        totalToolCount={totalToolCount}
        totalModelCount={totalModelCount}
        totalProviderCount={totalProviderCount}
        modelCountsByTier={modelCountsByTier}
      />
      <PricingTeaser locale={locale} />
      <MoreWaysIn locale={locale} />
      <HomeFaq
        locale={locale}
        totalModelCount={totalModelCount}
        totalProviderCount={totalProviderCount}
      />
      <UnbottledCta
        locale={locale}
        totalModelCount={totalModelCount}
        hasUser={hasUser}
      />
    </Main>
  );
}
