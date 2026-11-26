"use client";

import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { ListItem } from "next-vibe/ui/components/list-item";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetEndpointMutations,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type definitions from "./definition";
import { PaymentStatus, type PaymentStatusValue } from "./enum";

const STATUS_VARIANT: Record<typeof PaymentStatusValue, StatusPillVariant> = {
  [PaymentStatus.PENDING]: "warning",
  [PaymentStatus.PROCESSING]: "info",
  [PaymentStatus.SUCCEEDED]: "success",
  [PaymentStatus.FAILED]: "danger",
  [PaymentStatus.CANCELED]: "muted",
  [PaymentStatus.REFUNDED]: "muted",
};

export function PaymentInfoWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.GET>();
  const locale = useWidgetLocale();
  const data = useWidgetValue<typeof definitions.GET>();
  const response = useWidgetResponse();
  const interactive = useWidgetIsInteractive();
  const read = useWidgetEndpointMutations()?.read;
  const date = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });

  return (
    <WidgetShell layout="page">
      <WidgetHeader title={t("get.title")} subtitle={t("get.description")} />
      {response?.success === false ? (
        <EmptyBlock
          icon={<AlertTriangle className="size-7" />}
          title={t("get.summary.error")}
          action={
            interactive && read
              ? {
                  label: t("get.summary.retry"),
                  onClick: () => void read.refetch(),
                }
              : undefined
          }
        />
      ) : !data ? (
        <LoadingBlock message={t("get.summary.loading")} />
      ) : data.transactions.length === 0 ? (
        <EmptyBlock
          icon={<CreditCard className="size-7" />}
          title={t("get.summary.empty")}
          message={t("get.summary.emptyDescription")}
        />
      ) : (
        <Div className="grid gap-2">
          {data.transactions.map((transaction) => (
            <ListItem
              key={transaction.id}
              title={
                transaction.amount === null
                  ? t("get.summary.amountUnavailable")
                  : formatMoney(
                      transaction.amount,
                      transaction.currency,
                      locale,
                    )
              }
              subtitle={date.format(new Date(transaction.createdAt))}
              badges={
                <StatusPill
                  status={transaction.status}
                  label={t(transaction.status)}
                  variant={STATUS_VARIANT[transaction.status]}
                />
              }
              meta={
                <>
                  <Span>{t(transaction.mode)}</Span>
                  <Span>{t(transaction.provider)}</Span>
                </>
              }
            />
          ))}
        </Div>
      )}
    </WidgetShell>
  );
}
