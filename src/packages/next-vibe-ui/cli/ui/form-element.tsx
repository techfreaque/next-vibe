import { Box } from "ink";
import type { JSX } from "react";
import { forwardRef } from "react";

import type {
  FormElementProps,
  FormElementRefObject,
} from "../../web/ui/form-element";

export type {
  FormElementProps,
  FormElementRefObject,
} from "../../web/ui/form-element";

export const FormElement = forwardRef(function FormElement(
  { children, onSubmit }: FormElementProps,
  ref: React.ForwardedRef<FormElementRefObject>,
): JSX.Element {
  void ref;
  void onSubmit;
  return <Box flexDirection="column">{children}</Box>;
});
