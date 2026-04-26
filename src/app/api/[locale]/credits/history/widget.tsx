/**
 * Custom Widget for Credit History
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";

import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetContext,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { PaginationWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/pagination/widget";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import NavigateButtonWidget from "../../system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import type definition from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

/**
 * Custom container widget for credit history
 */
export function CreditHistoryContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const context = useWidgetContext();
  const { locale } = context;
  const tField = useWidgetTranslation<typeof definition.GET>();
  const value = useWidgetValue<typeof definition.GET>();
  const children = field.children;

  const transactions = value?.transactions ?? [];
  const paginationInfo = value?.paginationInfo;

  return (
    <Div className="flex flex-col gap-0">
      <NavigateButtonWidget field={children.backButton} />
      {/* Transactions List */}
      <Div className="flex flex-col gap-3">
        {transactions.length > 0 ? (
          transactions.map((transaction) => {
            const isPositive = transaction.amount > 0;

            return (
              <Div
                key={transaction.id}
                className={cn(
                  "p-4 rounded-lg border flex items-center justify-between",
                  isPositive
                    ? "bg-success/10 border-success/30"
                    : "bg-destructive/10 border-destructive/30",
                )}
              >
                {/* Left side - type and date */}
                <Div className="flex flex-col gap-1">
                  {transaction.type && (
                    <Div className="text-sm">{transaction.type}</Div>
                  )}
                  <Div className="text-sm">
                    {formatSimpleDate(transaction.createdAt, locale)}
                  </Div>
                </Div>

                {/* Right side - amount and balance */}
                <Div className="text-right flex flex-col gap-1">
                  <Div
                    className={cn(
                      "text-lg font-bold",
                      isPositive ? "text-success" : "text-destructive",
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {transaction.amount}
                  </Div>
                  <Div className="text-xs text-muted-foreground">
                    {tField("history.get.balance", {
                      count: transaction.balanceAfter,
                    })}
                  </Div>
                </Div>
              </Div>
            );
          })
        ) : (
          <Div className="text-center text-muted-foreground py-8">
            {tField("history.get.emptyState")}
          </Div>
        )}
      </Div>

      {/* Pagination */}
      {paginationInfo && (
        <PaginationWidget
          field={withValue(children.paginationInfo, paginationInfo, value)}
          fieldName={"paginationInfo"}
        />
      )}
    </Div>
  );
}
