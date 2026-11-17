"use client";

import type { SkillGetResponseOutput } from "next-vibe/agent/skills/[id]/definition";
import skillDefs from "next-vibe/agent/skills/[id]/definition";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { Link } from "next-vibe/ui/components/link";
import { H1, P } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import { scopedTranslation } from "./i18n";

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
  /** The skill was removed on purpose: show the retired state. */
  removed: boolean;
}

/** Old messages still link removed skills: a calm dead end, not a 404. */
function RemovedSkillNotice({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="dark min-h-screen bg-[#0f0520] text-white flex items-center justify-center px-4">
      <Div className="max-w-md text-center flex flex-col items-center gap-4">
        <H1 className="text-3xl font-bold">{t("removed.title")}</H1>
        <P className="text-white/70">{t("removed.body")}</P>
        <Link
          href={`/${locale}/skills`}
          className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[#0f0520] hover:bg-white/90"
        >
          {t("removed.cta")}
        </Link>
      </Div>
    </Div>
  );
}

// ─── page (minimal shell - widget handles nav, hero, CTA, footer) ───────────

export function SkillLandingPage({
  locale,
  skillId,
  user,
  platform,
  skillData,
  removed,
}: SkillLandingPageProps): JSX.Element {
  const logger = useLogger();
  if (removed) {
    return <RemovedSkillNotice locale={locale} />;
  }
  return (
    <Div className="dark min-h-screen bg-[#0f0520] text-white">
      <EndpointsPage
        logger={logger}
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
