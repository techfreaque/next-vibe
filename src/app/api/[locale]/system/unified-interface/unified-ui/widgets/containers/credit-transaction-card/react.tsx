"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { formatSimpleDate } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type {
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";
import type { CreditTransactionCardWidgetConfig } from "./types";

/**
 * Displays a credit transaction as a card with conditional red/green styling
 */
export function CreditTransactionCardWidget<
  TKey extends string,
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>({
  field,
  context,
}: ReactWidgetProps<
  TEndpoint,
  CreditTransactionCardWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const { t: globalT } = simpleT(context.locale);
  const leftFields = field.leftFields || [];
  const rightFields = field.rightFields || [];

  const amount = field.value["amount"];
  const isPositive = typeof amount === "number" && amount > 0;

  return (
    <Div
      className={cn(
        "p-4 rounded-lg border flex items-center justify-between",
        isPositive
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
        field.className,
      )}
    >
      <Div className="flex flex-col gap-1">
        {leftFields.map((key) => {
          const val = field.value[key];

          const displayValue =
            key === "type" && typeof val === "string"
              ? context.t(val)
              : key === "createdAt" && val instanceof Date
                ? formatSimpleDate(val, context.locale)
                : val;

          return (
            <Div key={key} className="text-sm">
              {displayValue}
            </Div>
          );
        })}
      </Div>
      <Div className="text-right flex flex-col gap-1">
        {rightFields.map((key) => {
          const val = field.value[key];

          const displayValue =
            key === "amount" && typeof val === "number"
              ? (val > 0 ? "+" : "") + val
              : key === "balanceAfter" && typeof val === "number"
                ? globalT("app.subscription.subscription.history.balance", {
                    count: val,
                  })
                : val;

          return (
            <Div
              key={key}
              className={cn(
                key === "amount" && "text-lg font-bold",
                key === "amount" &&
                  isPositive &&
                  "text-green-700 dark:text-green-300",
                key === "amount" &&
                  !isPositive &&
                  "text-red-700 dark:text-red-300",
                key !== "amount" && "text-xs text-muted-foreground",
              )}
            >
              {displayValue}
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}

CreditTransactionCardWidget.displayName = "CreditTransactionCardWidget";

export default CreditTransactionCardWidget;
