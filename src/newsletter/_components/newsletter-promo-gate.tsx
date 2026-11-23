"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { JSX, ReactNode } from "react";

import type { StatusGetResponseOutput } from "@/newsletter/status/definition";

import { useInlineNewsletterPromo } from "./use-inline-newsletter";

/**
 * Wraps a whole newsletter promo block (heading, copy, form) and drops it for
 * confirmed subscribers, so no orphan heading or text is left behind.
 * Pending and not-subscribed visitors see the block; the inner
 * NewsletterSubscribeInline then renders the matching state.
 * Pass `initialStatus` from the server loader so SSR already knows.
 */
export function NewsletterPromoGate({
  locale,
  user,
  initialStatus,
  hideWhileLoading = false,
  children,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  initialStatus?: StatusGetResponseOutput;
  /** For client-only spots without SSR status: render nothing until known. */
  hideWhileLoading?: boolean;
  children: ReactNode;
}): JSX.Element {
  const promo = useInlineNewsletterPromo(locale, user, initialStatus);
  if (promo.state === "confirmed") {
    return <></>;
  }
  if (promo.state === "loading" && hideWhileLoading) {
    return <></>;
  }
  return <>{children}</>;
}
