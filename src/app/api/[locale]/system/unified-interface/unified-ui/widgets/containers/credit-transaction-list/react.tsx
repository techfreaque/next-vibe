"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { WidgetData } from "../../../../shared/widgets/widget-data";
import { WidgetRenderer } from "../../../renderers/react/WidgetRenderer";
import { arrayFieldPath, withValue } from "../../_shared/field-helpers";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
} from "../../_shared/types";
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
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>({
  field,
  fieldName,
}: ReactWidgetProps<
  TEndpoint,
  CreditTransactionListWidgetConfig<TKey, TUsage, TSchemaType, TChild>
>): JSX.Element {
  return (
    <Div className={cn("flex flex-col gap-3", field.className)}>
      {field.value.map((transaction: WidgetData, index) => (
        <WidgetRenderer
          key={index}
          fieldName={arrayFieldPath(fieldName, index)}
          field={withValue(field.child, transaction, field.value)}
        />
      ))}
    </Div>
  );
}

CreditTransactionListWidget.displayName = "CreditTransactionListWidget";

export default CreditTransactionListWidget;
