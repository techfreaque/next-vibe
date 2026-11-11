/**
 * Custom Widget for Credit History
 */

"use client";
import { formatSimpleDate } from "next-vibe/core/i18n/core/localization-utils";
import { Div } from "next-vibe/ui/components/div";
import { Minus } from "next-vibe/ui/components/icons/Minus";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Receipt } from "next-vibe/ui/components/icons/Receipt";
import { Span } from "next-vibe/ui/components/span";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { PaginationWidget } from "next-vibe/unified-ui/widgets/containers/pagination/widget";

import { CreditsTabHeader } from "../credits-tab-header";
import { CreditTransactionTypeDB } from "../enum";
import { scopedTranslation as creditsScopedTranslation } from "../i18n";
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
  const form = useWidgetForm<typeof definition.GET>();
  const children = field.children;
  const creditsT = creditsScopedTranslation.scopedT(locale).t;

  const transactions = value?.transactions ?? [];
  const paginationInfo = value?.paginationInfo;

  // When an admin views ANOTHER entity's history (targetUserId/targetLeadId
  // set by the user-view embed), the balance/subscription header reads the
  // logged-in admin's OWN wallet - wrong owner. Suppress it; the target's
  // balance is shown target-scoped by the embedding user-view overview.
  const targetUserId = form?.watch("targetUserId");
  const targetLeadId = form?.watch("targetLeadId");
  const isAdminTargetView = Boolean(targetUserId ?? targetLeadId);

  return (
    <WidgetShell className="gap-6">
      {!isAdminTargetView && <CreditsTabHeader activeTab="history" />}

      {transactions.length > 0 ? (
        <Div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border bg-card shadow-sm">
          {transactions.map((transaction) => {
            const isPositive = transaction.amount > 0;
            const typeKey = CreditTransactionTypeDB.find(
              (key) => key === transaction.type,
            );
            const typeLabel = typeKey ? creditsT(typeKey) : transaction.type;

            return (
              <Div
                key={transaction.id}
                className="flex items-center gap-3 px-4 py-3.5 sm:px-5"
              >
                <Span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    isPositive
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {isPositive ? (
                    <Plus className="h-4 w-4" />
                  ) : (
                    <Minus className="h-4 w-4" />
                  )}
                </Span>
                <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Span className="truncate text-sm font-medium">
                    {typeLabel}
                  </Span>
                  <Span className="text-xs text-muted-foreground">
                    {formatSimpleDate(transaction.createdAt, locale)}
                  </Span>
                </Div>
                <Div className="flex shrink-0 flex-col items-end gap-0.5">
                  <Span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      isPositive ? "text-success" : "text-foreground",
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {transaction.amount}
                  </Span>
                  <Span className="text-xs tabular-nums text-muted-foreground">
                    {tField("history.get.balance", {
                      count: transaction.balanceAfter,
                    })}
                  </Span>
                </Div>
              </Div>
            );
          })}
        </Div>
      ) : (
        <Div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card px-6 py-12 text-center">
          <Span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Receipt className="h-5 w-5" />
          </Span>
          <Div className="flex flex-col gap-1">
            <Span className="text-sm font-semibold">
              {tField("history.get.emptyState")}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {tField("history.get.emptyHint")}
            </Span>
          </Div>
        </Div>
      )}

      {/* Pagination */}
      {paginationInfo && transactions.length > 0 && (
        <PaginationWidget
          field={withValue(children.paginationInfo, paginationInfo, value)}
          fieldName={"paginationInfo"}
        />
      )}
    </WidgetShell>
  );
}
