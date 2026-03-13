"use client";

import type { JSX } from "react";

import sendMessageDefinition from "@/app/api/[locale]/messenger/send/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function MessengerComposePageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={sendMessageDefinition}
      locale={locale}
      user={user}
    />
  );
}
