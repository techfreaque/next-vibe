"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { UnifiedField } from "../../../shared/types/endpoint";
import type { WidgetType } from "../../../shared/types/enums";
import type {
  ReactWidgetProps,
  WidgetData,
} from "../../../shared/widgets/types";
import { WidgetRenderer } from "../renderers/WidgetRenderer";

/**
 * Renders a list of credit transactions using CREDIT_TRANSACTION_CARD for each item
 * Data-driven - child field definition controls how each transaction is rendered
 */
export function CreditTransactionListWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
  endpoint,
}: ReactWidgetProps<
  typeof WidgetType.CREDIT_TRANSACTION_LIST,
  TKey
>): JSX.Element {
  const { t } = simpleT(context.locale);

  if (!Array.isArray(value) || value.length === 0) {
    return (
      <Div className={cn("text-muted-foreground italic", className)}>
        {t(
          "app.api.system.unifiedInterface.react.widgets.creditTransactionList.noTransactions",
        )}
      </Div>
    );
  }

  // Extract child field definition
  let childField: UnifiedField<string> | null = null;
  if (
    "type" in field &&
    (field.type === "array" || field.type === "array-optional")
  ) {
    if ("child" in field && field.child) {
      childField = field.child as UnifiedField<string>;
    }
  }

  if (!childField) {
    return (
      <Div className={cn("text-muted-foreground italic", className)}>
        {t(
          "app.api.system.unifiedInterface.react.widgets.creditTransactionList.invalidConfig",
        )}
      </Div>
    );
  }

  return (
    <Div className={cn("flex flex-col gap-3", className)}>
      {value.map((transaction: WidgetData, index: number) => (
        <WidgetRenderer
          key={index}
          widgetType={childField.ui.type}
          data={transaction}
          field={childField}
          context={context}
          endpoint={endpoint}
        />
      ))}
    </Div>
  );
}

CreditTransactionListWidget.displayName = "CreditTransactionListWidget";
