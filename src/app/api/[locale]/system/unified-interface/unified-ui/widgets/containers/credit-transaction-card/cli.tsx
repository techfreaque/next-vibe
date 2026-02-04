/**
 * CreditTransactionCard Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { InkWidgetProps } from "../../_shared/cli-types";
import type {
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";
import type { CreditTransactionCardWidgetConfig } from "./types";

export function CreditTransactionCardWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  CreditTransactionCardWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const leftFields = field.leftFields || [];
  const rightFields = field.rightFields || [];

  // Card displays object fields — value must be a non-array object
  if (!field.value) {
    return (
      <Box>
        <Text dimColor>—</Text>
      </Box>
    );
  }

  return (
    <Box
      flexDirection="column"
      marginBottom={1}
      paddingX={1}
      borderStyle="round"
    >
      <Box justifyContent="space-between">
        <Box flexDirection="column">
          {leftFields.map((fieldKey) => (
            <Box key={String(fieldKey)}>
              <Text>{field.value[fieldKey] ?? "—"}</Text>
            </Box>
          ))}
        </Box>
        <Box flexDirection="column" alignItems="flex-end">
          {rightFields.map((fieldKey) => (
            <Box key={String(fieldKey)}>
              <Text>{field.value[fieldKey] ?? "—"}</Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
