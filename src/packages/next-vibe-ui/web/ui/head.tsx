/* eslint-disable @next/next/no-head-element -- platform-agnostic HTML wrapper, not a Next.js page */
import type { JSX, ReactNode } from "react";

export interface HeadProps {
  children: ReactNode;
}

/**
 * Platform-agnostic Head wrapper component (Web implementation)
 * Wraps HTML <head> tag with platform-agnostic interface
 */
export function Head({ children }: HeadProps): JSX.Element {
  return <head>{children}</head>;
}
