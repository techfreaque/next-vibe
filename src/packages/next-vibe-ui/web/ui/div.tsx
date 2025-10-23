import type { ComponentPropsWithoutRef, ForwardedRef } from "react";
import { forwardRef } from "react";

/**
 * Platform-agnostic Div component for web
 * On web, this is a div element
 * Alias for View to provide more traditional web naming
 */
export const Div = forwardRef(function Div(
  props: ComponentPropsWithoutRef<"div">,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return <div ref={ref} {...props} />;
});
