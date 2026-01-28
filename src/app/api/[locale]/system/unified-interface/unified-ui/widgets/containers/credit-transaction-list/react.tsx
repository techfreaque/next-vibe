"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import type { z } from "zod";

import type { UnifiedField } from "../../../../shared/types/endpoint";
import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import { WidgetRenderer } from "../../../renderers/react/WidgetRenderer";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { CreditTransactionListWidgetConfig } from "./types";

/**
 * Renders a list of credit transactions using CREDIT_TRANSACTION_CARD for each item
 * Data-driven - child field definition controls how each transaction is rendered
 */
export function CreditTransactionListWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends UnifiedField<TKey, z.ZodTypeAny, FieldUsageConfig, any>, // oxlint-disable-line typescript/no-explicit-any
>({
  field,
  fieldName,
  context,
}: ReactWidgetProps<
  TEndpoint,
  CreditTransactionListWidgetConfig<TKey, TUsage, TSchemaType, TChild>
>): JSX.Element {
  return (
    <Div className={cn("flex flex-col gap-3", field.className)}>
      {field.value.map((transaction, index) => (
        <WidgetRenderer
          key={index}
          fieldName={fieldName ? `${fieldName}[${index}]` : `[${index}]`}
          field={{ ...field.child, value: transaction }}
          context={context}
        />
      ))}
    </Div>
  );
}

CreditTransactionListWidget.displayName = "CreditTransactionListWidget";

export default CreditTransactionListWidget;
