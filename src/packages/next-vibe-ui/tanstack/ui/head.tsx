/* eslint-disable @next/next/no-head-element -- platform-agnostic HTML wrapper, not a Next.js page */
/* eslint-disable oxlint-plugin-jsx-capitalization/jsx-capitalization -- platform-agnostic HTML wrapper */
import type { JSX, ReactNode } from "react";

export interface HeadProps {
  children: ReactNode;
}

/**
 * Platform-agnostic Head wrapper component (TanStack Start implementation)
 */
export function Head({ children }: HeadProps): JSX.Element {
  return <head>{children}</head>;
}
