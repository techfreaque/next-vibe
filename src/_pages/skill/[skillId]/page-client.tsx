"use client";

import type { SkillGetResponseOutput } from "next-vibe/agent/skills/[id]/definition";
import skillDefs from "next-vibe/agent/skills/[id]/definition";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/ui/div";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

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
  platform: Platform;
  /** Pre-built sign-up URL with ref/skillId params, resolved server-side */
  signupUrl: string;
  appName: string;
  resolvedModels: ResolvedSkillModels;
  leadMagnetConfig: LeadMagnetConfigData | null;
  /** Full skill GET response pre-fetched server-side - seeds React Query cache */
  skillData: SkillGetResponseOutput | null;
}

// ─── page (minimal shell - widget handles nav, hero, CTA, footer) ───────────

export function SkillLandingPage({
  locale,
  skillId,
  user,
  platform,
  skillData,
}: SkillLandingPageProps): JSX.Element {
  return (
    <Div className="dark min-h-screen bg-[#0f0520] text-white">
      <EndpointsPage
        endpoint={skillDefs}
        endpointOptions={{
          read: {
            urlPathParams: { id: skillId },
            queryOptions: { staleTime: 60_000 },
            ...(skillData ? { initialData: skillData } : {}),
          },
          update: { urlPathParams: { id: skillId } },
          delete: { urlPathParams: { id: skillId } },
        }}
        locale={locale}
        user={user}
        platform={platform}
        forceMethod="GET"
      />
    </Div>
  );
}
