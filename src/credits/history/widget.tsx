/**
 * Custom Widget for Credit History
 */

"use client";
import { formatSimpleDate } from "next-vibe/core/i18n/core/localization-utils";
import { cn } from "next-vibe/core/utils/utils";
import { Div } from "next-vibe/ui/ui/div";
import { WidgetShell } from "next-vibe/ui/ui/widget-shell";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetContext,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { PaginationWidget } from "next-vibe/unified-ui/containers/pagination/widget";

import { CreditsTabHeader } from "../credits-tab-header";
import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

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
    <WidgetShell>
      <CreditsTabHeader activeTab="history" />

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
                <Div className="flex flex-col gap-1">
                  {transaction.type && (
                    <Div className="text-sm">{transaction.type}</Div>
                  )}
                  <Div className="text-sm">
                    {formatSimpleDate(transaction.createdAt, locale)}
                  </Div>
                </Div>

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
    </WidgetShell>
  );
}
