"use client";

import type { JSX } from "react";

import messengerAccountCreateDefinition from "@/app/api/[locale]/messenger/accounts/create/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function MessengerAccountCreatePageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={messengerAccountCreateDefinition}
      locale={locale}
      user={user}
    />
  );
}
