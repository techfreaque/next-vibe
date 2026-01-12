"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { formatSimpleDate } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

import type { UnifiedField } from "../../../shared/types/endpoint";
import type { WidgetType } from "../../../shared/types/enums";
import type {
  ReactWidgetProps,
  WidgetData,
} from "../../../shared/widgets/types";

/**
 * Displays a credit transaction as a card with conditional red/green styling
 * Fully data-driven - field definitions control what fields are shown and how
 */
export function CreditTransactionCardWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<
  typeof WidgetType.CREDIT_TRANSACTION_CARD,
  TKey
>): JSX.Element {
  const { t } = simpleT(context.locale);

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return <Div className={className}>—</Div>;
  }

  const transaction = value as Record<string, WidgetData>;

  // Extract child field definitions
  let fieldDefinitions: Record<string, UnifiedField<string>> = {};
  if (
    "type" in field &&
    (field.type === "object" || field.type === "object-optional")
  ) {
    if ("children" in field && field.children) {
      fieldDefinitions = field.children as Record<string, UnifiedField<string>>;
    }
  }

  // Determine if positive/negative based on amount field
  const amount = transaction.amount;
  const isPositive = typeof amount === "number" && amount > 0;

  // Get field lists from config or use defaults
  const leftFields = field.ui.leftFields || ["type", "modelId", "createdAt"];
  const rightFields = field.ui.rightFields || ["amount", "balanceAfter"];

  return (
    <Div
      className={cn(
        "p-4 rounded-lg border flex items-center justify-between",
        isPositive
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
        className,
      )}
    >
      <Div className="flex flex-col gap-1">
        {leftFields.map((key) => {
          const fieldDef = fieldDefinitions[key];
          let val = transaction[key];
          if (!fieldDef || val === undefined || val === null) {
            return null;
          }

          // Special formatting for known fields
          if (key === "type" && typeof val === "string") {
            // Transaction type is already a translation key
            val = t(val);
          } else if (key === "createdAt") {
            // Format date - handle both string and Date object
            const date = val instanceof Date ? val : new Date(String(val));
            val = formatSimpleDate(date, context.locale);
          }

          return (
            <Div key={key} className="text-sm">
              {String(val)}
            </Div>
          );
        })}
      </Div>
      <Div className="text-right flex flex-col gap-1">
        {rightFields.map((key) => {
          const fieldDef = fieldDefinitions[key];
          let val = transaction[key];
          if (!fieldDef || val === undefined || val === null) {
            return null;
          }

          // Special formatting for known fields
          let displayValue: string;
          if (key === "amount" && typeof val === "number") {
            // Format amount with +/- sign
            displayValue = (val > 0 ? "+" : "") + val;
          } else if (key === "balanceAfter" && typeof val === "number") {
            // Format balance with label
            displayValue = t("app.subscription.subscription.history.balance", {
              count: val,
            });
          } else {
            displayValue = String(val);
          }

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
