import type { ComponentPropsWithoutRef, ForwardedRef } from "react";
import { forwardRef } from "react";

/**
 * Platform-agnostic Section component for web
 * On web, this is a section element
 * Provides semantic HTML5 section element with platform consistency
 */
export const Section = forwardRef(function Section(
  props: ComponentPropsWithoutRef<"section">,
  ref: ForwardedRef<HTMLElement>,
) {
  return <section ref={ref} {...props} />;
});
