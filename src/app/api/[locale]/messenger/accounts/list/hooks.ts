"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/platforms/react/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";

import {
  MessengerAccountSortField,
  MessengerAccountStatusFilter,
  MessengerChannelFilter,
  MessengerSortOrder,
} from "../enum";
import definitions from "./definition";

export function useMessengerAccountsList(
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        formOptions: { persistForm: false },
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: false,
          staleTime: 1 * 60 * 1000,
        },
        initialState: {
          page: 1,
          limit: 100,
          channel: MessengerChannelFilter.ANY,
          status: MessengerAccountStatusFilter.ANY,
          sortBy: MessengerAccountSortField.CREATED_AT,
          sortOrder: MessengerSortOrder.DESC,
        },
      },
    },
    logger,
    user,
  );
}

export type MessengerAccountsListEndpointReturn = EndpointReturn<
  typeof definitions
>;
