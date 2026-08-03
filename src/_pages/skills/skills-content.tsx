"use client";

import skillsDefinitions from "next-vibe/agent/skills/definition";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

interface SkillsContentProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
}

export default function SkillsContent({
  locale,
  user,
  platform,
}: SkillsContentProps): JSX.Element {
  return (
    <EndpointsPage
      endpoint={skillsDefinitions}
      locale={locale}
      user={user}
      platform={platform}
      endpointOptions={{
        read: {
          queryOptions: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }}
    />
  );
}
