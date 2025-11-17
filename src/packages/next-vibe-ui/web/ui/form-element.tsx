import type { ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import type { StyleType } from "../utils/style-type";

export type FormElementProps = {
  onSubmit?: () => void | Promise<void>;
  children?: ReactNode;
} & StyleType;

/**
 * Platform-agnostic Form element component for web
 * On web, this is a form element
 * Provides semantic HTML5 form element with platform consistency
 */
export const FormElement = forwardRef(function FormElement(
  { className, style, onSubmit, children }: FormElementProps,
  ref: ForwardedRef<HTMLFormElement>,
) {
  return (
    <form
      ref={ref}
      className={className}
      style={style}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      {children}
    </form>
  );
});
