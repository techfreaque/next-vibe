"use client";

import type { JSX } from "react";

import messageDetailDefinition from "@/app/api/[locale]/messenger/messages/[id]/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function MessengerMessageDetailPageClient({
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
      endpoint={messageDetailDefinition}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          urlPathParams: { id },
        },
      }}
    />
  );
}
