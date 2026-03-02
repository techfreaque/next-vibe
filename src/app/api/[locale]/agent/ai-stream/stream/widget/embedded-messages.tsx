"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { useMemo } from "react";

import type { UseEndpointOptions } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import messagesDefinition from "../../../chat/threads/[threadId]/messages/definition";

interface MessagesEndpoint {
  GET: typeof messagesDefinition.GET;
}

const messagesEndpoint: MessagesEndpoint = { GET: messagesDefinition.GET };

/**
 * Memoized embedded messages view.
 * Receives threadId as string (already narrowed by parent).
 */
export function EmbeddedMessagesView({
  threadId,
  locale,
  user,
  className,
  refetchInterval,
}: {
  threadId: string;
  locale: CountryLanguage;
  user: JwtPayloadType;
  className?: string;
  refetchInterval?: number | false;
}): JSX.Element {
  const endpointOptions = useMemo(
    (): UseEndpointOptions<MessagesEndpoint> => ({
      read: {
        urlPathParams: { threadId },
        ...(refetchInterval !== undefined && {
          queryOptions: { refetchInterval },
        }),
      },
    }),
    [threadId, refetchInterval],
  );

  return (
    <Div className={className}>
      <EndpointsPage
        endpoint={messagesEndpoint}
        endpointOptions={endpointOptions}
        locale={locale}
        user={user}
      />
    </Div>
  );
}
