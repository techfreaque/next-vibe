import type { ReactNode } from "react";
import { forwardRef } from "react";

// Cross-platform props interface - narrowed to what both platforms support
export interface SectionProps {
  children?: ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
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
