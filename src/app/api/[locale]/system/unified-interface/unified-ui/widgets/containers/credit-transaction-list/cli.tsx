/**
 * CreditTransactionList Widget - Ink implementation
 */

import { Box } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import { InkWidgetRenderer } from "../../../renderers/cli/CliWidgetRenderer";
import type { InkWidgetProps } from "../../_shared/cli-types";
import { arrayFieldPath, withValue } from "../../_shared/field-helpers";
import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
} from "../../_shared/types";
import type { CreditTransactionListWidgetConfig } from "./types";

export function CreditTransactionListWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>({
  field,
  fieldName,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  CreditTransactionListWidgetConfig<TKey, TUsage, TSchemaType, TChild>
>): JSX.Element {
  // value type is InferChildOutput<TChild>[]
  const items = field.value;

  return (
    <Box flexDirection="column" marginBottom={1}>
      {items.map((item, index) => (
        <Box key={index} marginBottom={1}>
          <InkWidgetRenderer
            fieldName={arrayFieldPath(fieldName, index)}
            field={withValue(field.child, item, field.value)}
          />
        </Box>
      ))}
    </Box>
  );
}
