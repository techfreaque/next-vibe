"use client";

/**
 * Guest email capture for the out-of-credits card.
 *
 * SWAP POINT: `GUEST_CREDIT_CAPTURE_ENDPOINT` is the only line to change when
 * the dedicated guest email-capture endpoint lands (subscribes the lead +
 * enrolls the journey). Until then the newsletter subscribe endpoint stands in
 * — it already reports the free-credit bonus state.
 */

import { isErrorResponseType } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { useApiMutation } from "next-vibe/unified-ui/hooks/use-api-mutation";
import { useCallback } from "react";

import creditsDefinitions from "@/credits/definition";
import { NewsletterCreditBonus } from "@/newsletter/enum";
import subscribeDefinitions from "@/newsletter/subscribe/definition";

const GUEST_CREDIT_CAPTURE_ENDPOINT = subscribeDefinitions.POST;

export type GuestCreditCaptureResult =
  /** Bonus is live now — balance refreshed. */
  | { kind: "added"; bonusCredits: number }
  /** Bonus unlocks once the confirm link in the welcome email is clicked. */
  | { kind: "confirm"; bonusCredits: number }
  /** That email already gave its bonus to another pool. */
  | { kind: "claimed" }
  | { kind: "error"; message: string };

export function useGuestCreditCapture(
  user: JwtPayloadType,
  logger: EndpointLogger,
): {
  capture: (email: string) => Promise<GuestCreditCaptureResult>;
  isSubmitting: boolean;
} {
  const mutation = useApiMutation(GUEST_CREDIT_CAPTURE_ENDPOINT, logger, user);
  const { mutateAsync } = mutation;

  const capture = useCallback(
    async (email: string): Promise<GuestCreditCaptureResult> => {
      try {
        const result = await mutateAsync({ requestData: { email } });
        if (!result.success) {
          return { kind: "error", message: result.message };
        }
        const { creditBonus, bonusCredits } = result.data;
        if (creditBonus === NewsletterCreditBonus.ACTIVE) {
          await apiClient.refetchEndpoint(creditsDefinitions.GET, logger);
          return { kind: "added", bonusCredits };
        }
        if (creditBonus === NewsletterCreditBonus.PENDING_CONFIRMATION) {
          return { kind: "confirm", bonusCredits };
        }
        return { kind: "claimed" };
      } catch (err) {
        // useApiMutation rejects with the ErrorResponseType on failure
        return {
          kind: "error",
          message: isErrorResponseType(err) ? err.message : String(err),
        };
      }
    },
    [mutateAsync, logger],
  );

  return { capture, isSubmitting: mutation.isPending };
}
