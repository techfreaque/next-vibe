import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { forwardRef } from "react";

// Cross-platform props interface
// Includes all standard HTML section props for web (style, etc.)
export interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  children?: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Platform-agnostic Section component for web
 * On web, this is a section element
 * Provides semantic HTML5 section element with platform consistency
 */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  props,
  ref,
) {
  return <section ref={ref} {...props} />;
});
