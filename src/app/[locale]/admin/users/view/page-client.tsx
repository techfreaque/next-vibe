/**
 * User View Page Client Component
 * Uses EndpointsPage to render user view endpoint
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import userViewDefinition from "@/app/api/[locale]/users/view/definition";
import type { CountryLanguage } from "@/i18n/core/config";

export function UserViewPageClient({
  locale,
  user,
  userId,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  userId?: string;
}): JSX.Element {
  return (
    <Div className="w-full">
      <EndpointsPage
        endpoint={userViewDefinition}
        user={user}
        locale={locale}
        endpointOptions={{
          read: {
            initialState: userId ? { userId } : undefined,
          },
        }}
      />
    </Div>
  );
}
