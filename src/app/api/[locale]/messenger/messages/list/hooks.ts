/**
 * Email Messages List Hooks
 * React hooks for listing email messages
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

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
