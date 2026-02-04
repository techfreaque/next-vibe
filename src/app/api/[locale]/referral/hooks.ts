/**
 * Referral API Hooks
 * Type-safe hooks for interacting with the Referral API
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import codesListDefinitions from "./codes/list/definition";
import definitions from "./definition";
import earningsListDefinitions from "./earnings/list/definition";
import linkToLeadDefinitions from "./link-to-lead/definition";
import statsDefinitions from "./stats/definition";

/**
 * Hook for creating referral codes
 * Provides mutation (POST) operations for creating new referral codes
 */
export function useReferralCreate(
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      create: {
        formOptions: {
          persistForm: false,
          defaultValues: {
            code: "",
            label: undefined,
          },
        },
      },
    },
    logger,
    user,
  );
}

/**
 * Hook for listing user's referral codes
 * Provides query (GET) operations for fetching referral codes with stats
 */
export function useReferralCodesList(
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof codesListDefinitions> {
  return useEndpoint(
    codesListDefinitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: true,
        staleTime: 30 * 1000, // 30 seconds
      },
    },
    logger,
    user,
  );
}

/**
 * Hook for linking referral code to lead
 * Provides mutation (POST) operations for linking referral codes to leads
 */
export function useReferralLinkToLead(
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<typeof linkToLeadDefinitions> {
  return useEndpoint(linkToLeadDefinitions, undefined, logger, user);
}

/**
 * Hook for fetching referral statistics
 * Provides query (GET) operations for fetching user's referral stats
 */
export function useReferralStats(
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<typeof statsDefinitions> {
  return useEndpoint(
    statsDefinitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000, // 60 seconds
      },
    },
    logger,
    user,
  );
}

/**
 * Hook for fetching referral earnings
 * Provides query (GET) operations for fetching user's referral earnings with pagination
 */
export function useReferralEarnings(
  user: JwtPayloadType,
  logger: EndpointLogger,
  params?: {
    limit?: number;
    offset?: number;
  },
): EndpointReturn<typeof earningsListDefinitions> {
  return useEndpoint(
    earningsListDefinitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000, // 30 seconds
        requestData: {
          limit: params?.limit ?? 10,
          offset: params?.offset ?? 0,
        },
      },
    },
    logger,
    user,
  );
}
