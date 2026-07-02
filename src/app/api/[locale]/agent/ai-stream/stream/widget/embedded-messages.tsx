"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { UseEndpointOptions } from "next-vibe/platforms/react/hooks/endpoint-types";
import { Div } from "next-vibe/ui/web/ui/div";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/react/EndpointsPage";
import type { JSX } from "react";
import { useMemo } from "react";

import type { DefaultFolderId } from "../../../chat/config";
import messagesDefinition from "../../../chat/threads/[threadId]/messages/definition";

interface MessagesEndpoint {
  GET: typeof messagesDefinition.GET;
}

const messagesEndpoint: MessagesEndpoint = { GET: messagesDefinition.GET };

/**
 * Memoized embedded messages view.
 * Receives threadId as string (already narrowed by parent).
 * WS subscription is handled by MessagesWidget → ReadOnlyMessages internally.
 */
export function EmbeddedMessagesView({
  threadId,
  rootFolderId,
  locale,
  user,
  className,
  refetchInterval,
  initialData,
}: {
  threadId: string;
  rootFolderId: DefaultFolderId;
  locale: CountryLanguage;
  user: JwtPayloadType;
  className?: string;
  refetchInterval?: number | false;
  initialData?: typeof messagesDefinition.GET.types.ResponseOutput;
}): JSX.Element {
  const endpointOptions = useMemo(
    (): UseEndpointOptions<MessagesEndpoint> => ({
      read: {
        urlPathParams: { threadId },
        initialState: { rootFolderId },
        ...(initialData !== undefined
          ? { queryOptions: { enabled: false }, initialData }
          : refetchInterval !== undefined && {
              queryOptions: { refetchInterval },
            }),
      },
    }),
    [threadId, rootFolderId, refetchInterval, initialData],
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
