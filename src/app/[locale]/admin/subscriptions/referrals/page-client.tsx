"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import definitions from "@/app/api/[locale]/subscription/admin/referrals/definition";
import type { CountryLanguage } from "@/i18n/core/config";

interface ReferralsPageProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function ReferralsClientPage({
  locale,
  user,
}: ReferralsPageProps): JSX.Element {
  return (
    <Div className="w-full min-h-screen">
      <EndpointsPage endpoint={definitions} locale={locale} user={user} />
    </Div>
  );
}
