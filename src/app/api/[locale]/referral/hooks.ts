/**
 * Referral API Hooks
 * Type-safe hooks for interacting with the Referral API
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";

import codesListDefinitions from "./codes/list/definition";
import definitions from "./definition";
import earningsListDefinitions from "./earnings/list/definition";
import linkToLeadDefinitions from "./link-to-lead/definition";
import statsDefinitions from "./stats/definition";

/**
 * Hook for creating referral codes
 * Provides mutation (POST) operations for creating new referral codes
 */
export function useReferralCreate(): EndpointReturn<typeof definitions> {
  const { locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);

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
  );
}

/**
 * Hook for listing user's referral codes
 * Provides query (GET) operations for fetching referral codes with stats
 */
export function useReferralCodesList(): EndpointReturn<typeof codesListDefinitions> {
  const { locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);

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
  );
}

/**
 * Hook for linking referral code to lead
 * Provides mutation (POST) operations for linking referral codes to leads
 */
export function useReferralLinkToLead(): EndpointReturn<typeof linkToLeadDefinitions> {
  const { locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);

  return useEndpoint(linkToLeadDefinitions, {}, logger);
}

/**
 * Hook for fetching referral statistics
 * Provides query (GET) operations for fetching user's referral stats
 */
export function useReferralStats(): EndpointReturn<typeof statsDefinitions> {
  const { locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);

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
  );
}

/**
 * Hook for fetching referral earnings
 * Provides query (GET) operations for fetching user's referral earnings with pagination
 */
export function useReferralEarnings(params?: {
  limit?: number;
  offset?: number;
}): EndpointReturn<typeof earningsListDefinitions> {
  const { locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);

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
  );
}
