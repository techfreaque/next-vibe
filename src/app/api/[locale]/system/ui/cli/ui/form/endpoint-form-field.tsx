import { Box } from "ink";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type {
  EndpointFormFieldProps,
  FormFieldError,
} from "next-vibe/ui/web/ui/form/endpoint-form-field";
import type { JSX } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";

export type {
  EndpointFormFieldProps,
  FormFieldError,
} from "next-vibe/ui/web/ui/form/endpoint-form-field";

export function EndpointFormField<
  TKey extends string,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TEndpoint extends CreateApiEndpointAny,
>(
  props: EndpointFormFieldProps<TKey, TFieldValues, TName, TEndpoint>,
): JSX.Element {
  void props;
  return <Box />;
}
