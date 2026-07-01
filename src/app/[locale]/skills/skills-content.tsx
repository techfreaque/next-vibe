"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { EndpointsPage } from "next-vibe/ui/renderers/react/EndpointsPage";
import type { JSX } from "react";

import skillsDefinitions from "@/app/api/[locale]/agent/skills/definition";

interface SkillsContentProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export default function SkillsContent({
  locale,
  user,
}: SkillsContentProps): JSX.Element {
  return (
    <EndpointsPage
      endpoint={skillsDefinitions}
      locale={locale}
      user={user}
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
