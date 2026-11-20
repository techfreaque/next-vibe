"use client";

import { formatDate } from "next-vibe/core/i18n/core/localization-utils";
import { UserRole } from "next-vibe/identity/roles/enum";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Receipt } from "next-vibe/ui/components/icons/Receipt";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  RelatedEntitiesPanel,
  useRelatedEntityNavigation,
} from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { PaginationWidget } from "next-vibe/unified-ui/widgets/containers/pagination/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";

import { CreditsTabHeader } from "../credits-tab-header";
import { CreditTransactionTypeDB } from "../enum";
import type definition from "./definition";

export function CreditHistoryContainer({
  field: { children },
}: {
  field: typeof definition.GET.fields;
}): React.JSX.Element {
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const value = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const form = useWidgetForm<typeof definition.GET>();
  const user = useWidgetUser();
  const navigate = useRelatedEntityNavigation();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const isAdmin = !user.isPublic && user.roles.includes(UserRole.ADMIN);
  const targetUserId = isAdmin ? form?.watch("targetUserId") : undefined;
  const targetLeadId = isAdmin ? form?.watch("targetLeadId") : undefined;
  const isTargeted = Boolean(targetUserId || targetLeadId);
  const transactions = value?.transactions ?? [];
  const pagination = value?.paginationInfo;
  const numbers = new Intl.NumberFormat(locale.split("-")[0], {
    maximumFractionDigits: 6,
  });
  const signedNumbers = new Intl.NumberFormat(locale.split("-")[0], {
    maximumFractionDigits: 6,
    signDisplay: "exceptZero",
  });

  const payoutAction = targetUserId ? (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() =>
        navigate(
          () =>
            import("@/referral/admin/payouts/definition").then(
              (module) => module.default.GET,
            ),
          { data: { userId: targetUserId } },
        )
      }
    >
      {t("history.get.openPayouts")}
    </Button>
  ) : undefined;

  return (
    <WidgetShell className="gap-4">
      {interactive &&
        !responseOnly &&
        (isTargeted ? (
          <RelatedEntitiesPanel
            title={t("history.get.relatedRecords")}
            emptyTitle={t("history.get.emptyState")}
            items={[
              ...(targetUserId
                ? [
                    {
                      id: targetUserId,
                      title: t("history.get.account"),
                      subtitle: targetUserId,
                      action: {
                        label: t("history.get.openAccount"),
                        onClick: () =>
                          navigate(
                            () =>
                              import("@/users/view/definition").then(
                                (module) => module.default.GET,
                              ),
                            { data: { userId: targetUserId } },
                          ),
                      },
                      meta: payoutAction,
                    },
                  ]
                : []),
              ...(targetLeadId
                ? [
                    {
                      id: targetLeadId,
                      title: t("history.get.lead"),
                      subtitle: targetLeadId,
                      action: {
                        label: t("history.get.openLead"),
                        onClick: () =>
                          navigate(
                            () =>
                              import("@/leads/[id]/definition").then(
                                (module) => module.default.GET,
                              ),
                            { urlPathParams: { id: targetLeadId } },
                          ),
                      },
                    },
                  ]
                : []),
            ]}
          />
        ) : (
          <CreditsTabHeader activeTab="history" />
        ))}
      <FormAlertWidget field={{}} />
      {!value && !response && (
        <LoadingBlock message={t("history.get.loading")} />
      )}
      {value && transactions.length === 0 && (
        <EmptyBlock
          icon={<Receipt className="size-6" />}
          title={t("history.get.emptyState")}
          message={t("history.get.emptyHint")}
        />
      )}
      {transactions.length > 0 && (
        <Div className="rounded-xl border bg-card divide-y divide-border">
          {transactions.map((transaction) => {
            const typeKey = CreditTransactionTypeDB.find(
              (key) => key === transaction.type,
            );
            const typeLabel =
              transaction.type === "history.get.bonusGrant"
                ? t("history.get.bonusGrant")
                : typeKey
                  ? t(typeKey)
                  : transaction.type;
            return (
              <Div
                key={transaction.id}
                className="grid min-w-0 gap-2 p-3 @sm:grid-cols-2 @sm:px-4"
              >
                <Div className="flex min-w-0 flex-col gap-1">
                  <Span className="break-words text-sm font-medium">
                    {typeLabel}
                  </Span>
                  <Span className="text-xs text-muted-foreground">
                    {formatDate(
                      new Date(transaction.createdAt),
                      locale,
                      "PP p",
                    )}
                  </Span>
                  {isTargeted && (
                    <Span className="break-all font-mono text-xs text-muted-foreground">
                      {transaction.id}
                    </Span>
                  )}
                </Div>
                <Div className="flex min-w-0 flex-col gap-1">
                  <Span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      transaction.amount > 0 && "text-success",
                    )}
                  >
                    {t("history.get.delta", {
                      amount: signedNumbers.format(transaction.amount),
                    })}
                  </Span>
                  <Span className="text-xs tabular-nums text-muted-foreground">
                    {t("history.get.entryBalance", {
                      count: numbers.format(transaction.balanceAfter),
                    })}
                  </Span>
                </Div>
              </Div>
            );
          })}
        </Div>
      )}
      {interactive &&
        !responseOnly &&
        pagination &&
        (pagination.totalCount > 0 ||
          form.watch("paginationInfo.page") > 1) && (
          <PaginationWidget
            field={withValue(
              { ...children.paginationInfo, className: "flex-wrap gap-3" },
              pagination,
              value,
            )}
            fieldName="paginationInfo"
          />
        )}
    </WidgetShell>
  );
}
