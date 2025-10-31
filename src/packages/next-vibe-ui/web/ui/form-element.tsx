import type { ComponentPropsWithoutRef, ForwardedRef } from "react";
import { forwardRef } from "react";

// Cross-platform props interface
export type FormElementProps = ComponentPropsWithoutRef<"form">;

/**
 * Platform-agnostic Form element component for web
 * On web, this is a form element
 * Provides semantic HTML5 form element with platform consistency
 */
export const FormElement = forwardRef(function FormElement(
  props: FormElementProps,
  ref: ForwardedRef<HTMLFormElement>,
) {
  return <form ref={ref} {...props} />;
});
