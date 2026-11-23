"use client";

import { create } from "zustand";

import type { StatusGetResponseOutput } from "./status/definition";

export const OWN_NEWSLETTER_STATUS_QUERY_KEY = "newsletter-status-own";
export const NEWSLETTER_STATUS_QUERY_PREFIX = "newsletter-status";

export const useNewsletterEmail = create<{
  email: string;
  setEmail: (email: string) => void;
}>((set) => ({ email: "", setEmail: (email): void => set({ email }) }));

export type NewsletterPromoState = "loading" | "confirmed" | "pending" | "none";

export function toNewsletterPromoState(
  status: StatusGetResponseOutput | undefined,
): NewsletterPromoState {
  if (!status) {
    return "loading";
  }
  if (!status.subscribed) {
    return "none";
  }
  return status.confirmed ? "confirmed" : "pending";
}
