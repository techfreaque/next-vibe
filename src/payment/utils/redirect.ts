/**
 * Payment Redirect Utilities
 * Shared utilities for handling payment provider redirects
 */

import type { ResponseType } from "next-vibe/core/route/response.schema";
import { assignUrl } from "next-vibe/ui/lib/location";

/**
 * Handles redirect to payment provider checkout
 * Extracts checkout URL from response and redirects the browser
 *
 * @param response - The API response containing checkout URL
 * @param onError - Optional callback for error handling
 * @returns true if redirect was initiated, false otherwise
 */
export function handleCheckoutRedirect<T extends { checkoutUrl?: string }>(
  response: ResponseType<T>,
  onError?: (message: string) => void,
): boolean {
  if (!response.success) {
    onError?.(response.message ?? "Payment checkout failed");
    return false;
  }

  const checkoutUrl = response.data?.checkoutUrl;
  if (!checkoutUrl) {
    onError?.("No checkout URL received from payment provider");
    return false;
  }

  // Redirect to payment provider
  assignUrl(checkoutUrl);
  return true;
}
