"use client";

import type { JSX } from "react";

import skillsDefinitions from "@/app/api/[locale]/agent/chat/skills/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

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
