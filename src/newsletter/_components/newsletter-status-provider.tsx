"use client";

import {
  type Context,
  createContext,
  type JSX,
  type ReactNode,
  useContext,
} from "react";

import type { StatusGetResponseOutput } from "@/newsletter/status/definition";

declare global {
  var __vibeNewsletterStatusContext:
    | Context<StatusGetResponseOutput | undefined>
    | undefined;
}

// HMR-stable context (see logger-provider.tsx): a re-evaluated module must not
// mint a new context while the mounted provider still holds the old one.
const NewsletterStatusContext: Context<StatusGetResponseOutput | undefined> =
  (globalThis.__vibeNewsletterStatusContext ??= createContext<
    StatusGetResponseOutput | undefined
  >(undefined));

/**
 * Hands the visitor's own newsletter status (loaded by the page layout on the
 * server) to every newsletter prompt below it, so widgets that render before
 * the footer (profile hub) start in the right state instead of a skeleton.
 */
export function NewsletterStatusProvider({
  status,
  children,
}: {
  status: StatusGetResponseOutput | undefined;
  children: ReactNode;
}): JSX.Element {
  return (
    <NewsletterStatusContext.Provider value={status}>
      {children}
    </NewsletterStatusContext.Provider>
  );
}

/** Server-loaded own status from the nearest layout, if any. */
export function useLayoutNewsletterStatus():
  | StatusGetResponseOutput
  | undefined {
  return useContext(NewsletterStatusContext);
}
