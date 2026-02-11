/**
 * User Edit Page Client Component
 * Uses EndpointsPage to render user edit endpoint
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import definitions from "@/app/api/[locale]/users/user/[id]/definition";
import type { CountryLanguage } from "@/i18n/core/config";

interface UserEditPageProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  userId: string;
}

export function UserEditPageClient({
  locale,
  user,
  userId,
}: UserEditPageProps): JSX.Element {
  return (
    <Div className="w-full min-h-screen">
      <EndpointsPage
        endpoint={definitions}
        locale={locale}
        user={user}
        endpointOptions={{
          read: {
            urlPathParams: { id: userId },
          },
        }}
      />
    </Div>
  );
}
