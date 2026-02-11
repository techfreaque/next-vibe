"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import definitions from "@/app/api/[locale]/users/stats/definition";
import type { CountryLanguage } from "@/i18n/core/config";

interface UsersStatsPageProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function UsersStatsClientPage({
  locale,
  user,
}: UsersStatsPageProps): JSX.Element {
  return (
    <Div className="w-full min-h-screen">
      <EndpointsPage endpoint={definitions} locale={locale} user={user} />
    </Div>
  );
}
