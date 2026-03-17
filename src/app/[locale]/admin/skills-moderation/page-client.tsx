"use client";

import type { JSX } from "react";

import skillsModerationDefinition from "@/app/api/[locale]/agent/chat/skills/moderation/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function SkillsModerationPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={{
        GET: skillsModerationDefinition.GET,
        PATCH: skillsModerationDefinition.PATCH,
      }}
      locale={locale}
      user={user}
    />
  );
}
