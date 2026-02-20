"use client";

import type { JSX } from "react";

import messagingAccountCreateDefinition from "@/app/api/[locale]/emails/messaging/accounts/create/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function MessagingAccountCreatePageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={messagingAccountCreateDefinition}
      locale={locale}
      user={user}
    />
  );
}
