"use client";

import type { JSX } from "react";

import adminPayoutsDefinition from "@/app/api/[locale]/referral/admin/payouts/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function AdminReferralPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={adminPayoutsDefinition}
      locale={locale}
      user={user}
    />
  );
}
