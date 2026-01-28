/**
 * CreditTransactionList Widget - Ink implementation
 */

import { Box } from "ink";
import type { JSX } from "react";
import type { z } from "zod";

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import { InkWidgetRenderer } from "../../../renderers/cli/CliWidgetRenderer";
import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { CreditTransactionListWidgetConfig } from "./types";

export function CreditTransactionListWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends UnifiedField<TKey, z.ZodTypeAny, FieldUsageConfig, any>, // oxlint-disable-line typescript/no-explicit-any
>({
  field,
  fieldName,
  context,
}: InkWidgetProps<
  TEndpoint,
  CreditTransactionListWidgetConfig<TKey, TUsage, TSchemaType, TChild>
>): JSX.Element {
  // value type is InferChildOutput<TChild>[]
  const items = field.value;

  return (
    <Box flexDirection="column" marginBottom={1}>
      {items.map((item, index) => (
        <Box key={index} marginBottom={1}>
          <InkWidgetRenderer
            fieldName={fieldName ? `${fieldName}[${index}]` : `[${index}]`}
            field={{ ...field.child, value: item }}
            context={context}
          />
        </Box>
      ))}
    </Box>
  );
}
