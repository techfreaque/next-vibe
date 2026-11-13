"use client";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { JSX, ReactNode } from "react";

import { useNewsletterPromo } from "@/newsletter/hooks";
import type { StatusGetResponseOutput } from "@/newsletter/status/definition";

/**
 * Wraps a whole newsletter promo block (heading, copy, form) and drops it for
 * confirmed subscribers, so no orphan heading or text is left behind.
 * Pending and not-subscribed visitors see the block; the inner
 * NewsletterSubscribeInline then renders the matching state.
 * Pass `initialStatus` from the server loader so SSR already knows.
 */
export function NewsletterPromoGate({
  user,
  initialStatus,
  hideWhileLoading = false,
  children,
}: {
  user: JwtPayloadType;
  initialStatus?: StatusGetResponseOutput;
  /** For client-only spots without SSR status: render nothing until known. */
  hideWhileLoading?: boolean;
  children: ReactNode;
}): JSX.Element {
  const promo = useNewsletterPromo(user, initialStatus);
  if (promo.state === "confirmed") {
    return <></>;
  }
  if (promo.state === "loading" && hideWhileLoading) {
    return <></>;
  }
  return <>{children}</>;
}
