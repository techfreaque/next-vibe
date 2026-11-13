"use client";

/**
 * Newsletter credit bonus hooks: read the account's offer state and claim it.
 * Used by the chat's out-of-credits card. Accounts only: never enable for guests.
 */

import { isErrorResponseType } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { useApiMutation } from "next-vibe/unified-ui/hooks/use-api-mutation";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { useCallback } from "react";

import creditsDefinitions from "@/credits/definition";

import type { CreditBonusGetResponseOutput } from "./definition";
import creditBonusDefinitions from "./definition";
import { NewsletterCreditOffer } from "./enum";

export type NewsletterCreditClaimResult =
  | { kind: "ok"; data: CreditBonusGetResponseOutput }
  | { kind: "error"; message: string };

export function useNewsletterCreditBonus(
  user: JwtPayloadType,
  logger: EndpointLogger,
  enabled: boolean,
): {
  data: CreditBonusGetResponseOutput | undefined;
  isLoading: boolean;
  claim: () => Promise<NewsletterCreditClaimResult>;
  isClaiming: boolean;
} {
  const endpoint = useEndpoint(
    creditBonusDefinitions,
    {
      read: {
        queryOptions: {
          enabled: enabled && !user.isPublic,
        },
      },
    },
    logger,
    user,
  );
  const mutation = useApiMutation(creditBonusDefinitions.POST, logger, user);
  const { mutateAsync } = mutation;

  const claim = useCallback(async (): Promise<NewsletterCreditClaimResult> => {
    try {
      const result = await mutateAsync({});
      if (!result.success) {
        return { kind: "error", message: result.message };
      }
      await apiClient.refetchEndpoint(creditBonusDefinitions.GET, logger);
      if (result.data.offer === NewsletterCreditOffer.ACTIVE) {
        await apiClient.refetchEndpoint(creditsDefinitions.GET, logger);
      }
      return { kind: "ok", data: result.data };
    } catch (err) {
      // useApiMutation rejects with the ErrorResponseType on failure
      return {
        kind: "error",
        message: isErrorResponseType(err) ? err.message : String(err),
      };
    }
  }, [mutateAsync, logger]);

  const response = endpoint.read?.response;
  return {
    data: response?.success ? response.data : undefined,
    isLoading: endpoint.read?.isLoading ?? false,
    claim,
    isClaiming: mutation.isPending,
  };
}
