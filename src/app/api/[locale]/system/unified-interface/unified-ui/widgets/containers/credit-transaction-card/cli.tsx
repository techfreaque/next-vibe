/**
 * CreditTransactionCard Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import type { z } from "zod";

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { CreditTransactionCardWidgetConfig } from "./types";

export function CreditTransactionCardWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends Record<
    string,
    UnifiedField<string, z.ZodTypeAny, FieldUsageConfig, any> // oxlint-disable-line typescript/no-explicit-any
  >,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  CreditTransactionCardWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  // value type is InferChildrenOutput<TChildren>
  // leftFields and rightFields are (keyof TChildren)[], which are valid keys for value
  const leftFields = field.leftFields || [];
  const rightFields = field.rightFields || [];

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
            <Box key={fieldKey}>
              <Text>{field.value[fieldKey] ?? "—"}</Text>
            </Box>
          ))}
        </Box>
        <Box flexDirection="column" alignItems="flex-end">
          {rightFields.map((fieldKey) => (
            <Box key={fieldKey}>
              <Text>{field.value[fieldKey] ?? "—"}</Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
