"use client";

import { useSearchParams } from "next-vibe-ui/hooks/use-navigation";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { useMemo } from "react";

import emailsListDefinition from "@/app/api/[locale]/emails/imap-client/messages/list/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function ImapMessagesPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folderId") ?? undefined;

  const messagesOptions = useMemo(
    () =>
      folderId
        ? {
            read: {
              initialState: { folderId },
            },
          }
        : undefined,
    [folderId],
  );

  return (
    <Div className="flex h-full min-h-0">
      {/* Messages list — full width, sidebar handles folder navigation */}
      <Div className="flex-1 min-w-0 overflow-auto">
        <EndpointsPage
          endpoint={emailsListDefinition}
          locale={locale}
          user={user}
          endpointOptions={messagesOptions}
        />
      </Div>
    </Div>
  );
}
