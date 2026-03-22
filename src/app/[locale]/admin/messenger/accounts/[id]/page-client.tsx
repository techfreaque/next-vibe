"use client";

import type { JSX } from "react";

import messengerAccountEditDefinition from "@/app/api/[locale]/messenger/accounts/edit/[id]/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function MessengerAccountEditPageClient({
  locale,
  user,
  id,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  id: string;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={messengerAccountEditDefinition}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          urlPathParams: { id },
        },
        create: {
          urlPathParams: { id },
        },
        delete: {
          urlPathParams: { id },
        },
      }}
    />
  );
}
