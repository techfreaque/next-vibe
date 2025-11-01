import type { ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";

// Cross-platform props interface - narrowed to work on both web and native
export interface FormElementProps {
  className?: string;
  onSubmit?: (e: React.FormEvent) => void | Promise<void>;
  children?: ReactNode;
}

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
