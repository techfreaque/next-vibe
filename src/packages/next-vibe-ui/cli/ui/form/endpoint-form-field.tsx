import { Box } from "ink";
import type { JSX } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";

import type {
  FormFieldError,
  EndpointFormFieldProps,
} from "../../../web/ui/form/endpoint-form-field";

export type {
  FormFieldError,
  EndpointFormFieldProps,
} from "../../../web/ui/form/endpoint-form-field";

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
