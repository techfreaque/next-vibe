"use client";

import type { JSX } from "react";

import messagingAccountEditDefinition from "@/app/api/[locale]/emails/messaging/accounts/edit/[id]/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function MessagingAccountEditPageClient({
  locale,
  user,
  accountId,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  accountId: string;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={messagingAccountEditDefinition}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          urlPathParams: { id: accountId },
        },
        create: {
          urlPathParams: { id: accountId },
        },
      }}
    />
  );
}
