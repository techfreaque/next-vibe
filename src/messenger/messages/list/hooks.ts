/**
 * Email Messages List Hooks
 * React hooks for listing email messages
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/unified-ui/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";

import { MessengerChannelFilter } from "../../accounts/enum";
import {
  MessageSortField,
  MessageStatusFilter,
  MessageTypeFilter,
  SortOrder,
} from "../enum";
import definitions from "./definition";

/**
 * Hook for listing email messages
 */
export function useEmailMessagesList(
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        formOptions: {
          persistForm: false,
        },
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: false,
          staleTime: 1 * 60 * 1000, // 1 minute
        },
        initialState: {
          filters: {
            search: undefined,
            channel: MessengerChannelFilter.ANY,
            status: MessageStatusFilter.ANY,
            type: MessageTypeFilter.ANY,
          },
          displayOptions: {
            sortBy: MessageSortField.CREATED_AT,
            sortOrder: SortOrder.DESC,
            page: 1,
            limit: 20,
          },
        },
      },
    },
    logger,
    user,
  );
}

export type EmailMessagesListEndpointReturn = EndpointReturn<
  typeof definitions
>;
