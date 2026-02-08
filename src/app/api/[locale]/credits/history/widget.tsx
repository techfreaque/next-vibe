/**
 * Custom Widget for Credit History
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";

import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import { useWidgetContext } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { PaginationWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/pagination/react";
import { formatSimpleDate } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

import type definition from "./definition";
import type { CreditsHistoryGetResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: CreditsHistoryGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

/**
 * Custom container widget for credit history
 */
export function CreditHistoryContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const context = useWidgetContext();
  const { locale } = context;
  const { t } = simpleT(locale as Parameters<typeof simpleT>[0]);
  const children = field.children;

  const transactions = field.value?.transactions ?? [];
  const paginationInfo = field.value?.paginationInfo;

  return (
    <Div className="flex flex-col gap-0">
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
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
                )}
              >
                {/* Left side - type and date */}
                <Div className="flex flex-col gap-1">
                  {transaction.type && (
                    <Div className="text-sm">{t(transaction.type)}</Div>
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
                      isPositive
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300",
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {transaction.amount}
                  </Div>
                  <Div className="text-xs text-muted-foreground">
                    {t("app.subscription.subscription.history.balance", {
                      count: transaction.balanceAfter,
                    })}
                  </Div>
                </Div>
              </Div>
            );
          })
        ) : (
          <Div className="text-center text-muted-foreground py-8">
            {t("app.api.agent.chat.credits.history.get.emptyState")}
          </Div>
        )}
      </Div>

      {/* Pagination */}
      {paginationInfo && (
        <PaginationWidget
          field={withValue(
            children.paginationInfo,
            paginationInfo,
            field.value,
          )}
          fieldName={"paginationInfo"}
        />
      )}
    </Div>
  );
}
