// Re-export web version of View (div element)
import type { ComponentPropsWithoutRef, ForwardedRef } from "react";
import { forwardRef } from "react";

/**
 * Platform-agnostic View component for web
 * On web, this is a div element
 */
export const View = forwardRef(function View(
  props: ComponentPropsWithoutRef<"div">,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return <div ref={ref} {...props} />;
});
