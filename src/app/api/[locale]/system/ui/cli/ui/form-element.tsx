import { Box } from "ink";
import type {
  FormElementProps,
  FormElementRefObject,
} from "next-vibe/ui/web/ui/form-element";
import type { JSX } from "react";
import { forwardRef } from "react";

export type {
  FormElementProps,
  FormElementRefObject,
} from "next-vibe/ui/web/ui/form-element";

export const FormElement = forwardRef(function FormElement(
  { children, onSubmit }: FormElementProps,
  ref: React.ForwardedRef<FormElementRefObject>,
): JSX.Element {
  void ref;
  void onSubmit;
  return <Box flexDirection="column">{children}</Box>;
});
