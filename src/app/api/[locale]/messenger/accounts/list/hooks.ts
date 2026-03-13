"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

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
