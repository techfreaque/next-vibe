"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import skillDefs from "@/app/api/[locale]/agent/chat/skills/[id]/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

// ─── types (exported for page.tsx) ───────────────────────────────────────────

/** Per-variant resolved model info - all computed server-side to avoid SSR circular deps */
export interface ResolvedVariantInfo {
  id: string;
  displayName: string | null;
  chatModelName: string | null;
  chatProviderName: string | null;
  chatProviderIcon: string | null;
  chatCreditCost: string | null;
  voiceModelName: string | null;
  imageGenModelName: string | null;
  imageGenCreditCost: string | null;
  musicGenModelName: string | null;
  videoGenModelName: string | null;
  hasStt: boolean;
  hasImageVision: boolean;
  hasVideoVision: boolean;
  hasAudioVision: boolean;
  toolCount: number;
}

export interface ResolvedSkillModels {
  variants: ResolvedVariantInfo[];
  voiceName: string | null;
  imageGenName: string | null;
  musicGenName: string | null;
  videoGenName: string | null;
  hasStt: boolean;
}

export interface LeadMagnetConfigData {
  headline: string | null;
  buttonText: string | null;
}

// ─── props ───────────────────────────────────────────────────────────────────

export interface SkillLandingPageProps {
  locale: CountryLanguage;
  skillId: string;
  user: JwtPayloadType;
  /** Pre-built sign-up URL with ref/skillId params, resolved server-side */
  signupUrl: string;
  appName: string;
  resolvedModels: ResolvedSkillModels;
  leadMagnetConfig: LeadMagnetConfigData | null;
}

// ─── page (minimal shell — widget handles nav, hero, CTA, footer) ───────────

export function SkillLandingPage({
  locale,
  skillId,
  user,
}: SkillLandingPageProps): JSX.Element {
  return (
    <Div
      style={{
        minHeight: "100vh",
        background: "#0f0520",
        color: "#fff",
      }}
    >
      <EndpointsPage
        endpoint={skillDefs}
        endpointOptions={{
          read: {
            urlPathParams: { id: skillId },
            queryOptions: { staleTime: 60_000 },
          },
          update: { urlPathParams: { id: skillId } },
          delete: { urlPathParams: { id: skillId } },
        }}
        locale={locale}
        user={user}
        forceMethod="GET"
      />
    </Div>
  );
}
