/**
 * Subscription Provider Switch Hooks
 * The subscription status card reads the offer to put the move path before
 * the old processor's portal.
 */

"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";

import definitions from "./definition";
import { SwitchOfferState } from "./enum";

/**
 * True while this account has a card plan the live switch target can take
 * (or explain). Off (no request) unless `enabled`.
 */
export function useProviderSwitchOfferLive(
  logger: EndpointLogger,
  user: JwtPayloadType,
  enabled: boolean,
): boolean {
  const endpoint = useEndpoint(
    definitions,
    {
      read: {
        queryOptions: {
          enabled,
          staleTime: 60 * 1000,
        },
      },
    },
    logger,
    user,
  );
  const offer = endpoint.read?.data?.offer;
  return (
    enabled &&
    (offer === SwitchOfferState.AVAILABLE ||
      offer === SwitchOfferState.PLAN_NOT_SUPPORTED)
  );
}
