"use client";

import { isAgentPlatform, isCliPlatform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { DollarSign } from "next-vibe/ui/components/icons/DollarSign";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetPlatform,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import {
  ReferralEarningStatus,
  type ReferralEarningStatusValue,
} from "../../enum";
import type definitions from "./definition";
import type { EarningsListGetResponseOutput } from "./definition";

type Earning = EarningsListGetResponseOutput["earnings"][number];

const PAGE_SIZE = 50;

const statusVariants: Record<
  typeof ReferralEarningStatusValue,
  StatusPillVariant
> = {
  [ReferralEarningStatus.PENDING]: "warning",
  [ReferralEarningStatus.CONFIRMED]: "success",
  [ReferralEarningStatus.CANCELED]: "muted",
};

/**
 * Earnings are stored in credits (1 credit = 1 USD cent), so credits rows
 * show their USD value like the payout views. Legacy rows keep their ISO code.
 */
function displayCurrency(currency: string): string {
  return /^[A-Z]{3}$/u.test(currency) ? currency : "USD";
}

/** Sums per currency; never adds different currencies together. */
function pageTotals(
  earnings: readonly Earning[],
): { currency: string; cents: number }[] {
  const totals = new Map<string, number>();
  for (const earning of earnings) {
    if (earning.status !== ReferralEarningStatus.CANCELED) {
      const currency = displayCurrency(earning.currency);
      totals.set(currency, (totals.get(currency) ?? 0) + earning.amountCents);
    }
  }
  return [...totals.entries()].map(([currency, cents]) => ({
    currency,
    cents,
  }));
}

export function EarningsListContainer(): JSX.Element {
  const data = useWidgetValue<typeof definitions.GET>();
  const form = useWidgetForm<typeof definitions.GET>();
  const t = useWidgetTranslation<typeof definitions.GET>();
  const locale = useWidgetLocale();
  const response = useWidgetResponse();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const read = useWidgetEndpointMutations()?.read;
  const isFetching = read?.isFetching ?? false;
  const canAct = interactive && !responseOnly;
  const platform = useWidgetPlatform();
  const isText = isCliPlatform(platform) || isAgentPlatform(platform);
  const embedded = Boolean(form?.watch("targetUserId"));
  const limit = form?.watch("limit") ?? PAGE_SIZE;
  const offset = form?.watch("offset") ?? 0;
  const hasError = response?.success === false;
  const earnings = data?.earnings ?? [];
  const total = data?.totalCount ?? 0;
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(total, offset + earnings.length);

  function setOffset(next: number): void {
    form.setValue("limit", limit);
    form.setValue("offset", Math.max(0, next));
  }

  function sourceLabel(earning: Earning): string {
    return earning.level <= 1
      ? t("earnings.list.get.widget.direct")
      : t("earnings.list.get.widget.level", { level: earning.level });
  }

  function amountText(earning: Earning): JSX.Element {
    return (
      <Span
        className={
          earning.status === ReferralEarningStatus.CANCELED
            ? "text-muted-foreground line-through"
            : "font-semibold"
        }
      >
        {formatMoney(
          earning.amountCents / 100,
          displayCurrency(earning.currency),
          locale,
        )}
      </Span>
    );
  }

  function statusPill(earning: Earning): JSX.Element {
    return (
      <StatusPill
        status={t(earning.status)}
        variant={statusVariants[earning.status]}
      />
    );
  }

  function dateText(earning: Earning): JSX.Element {
    return (
      <Span className="whitespace-nowrap text-muted-foreground">
        {formatDocDate(earning.createdAt, locale)}
      </Span>
    );
  }

  function sourceText(earning: Earning): JSX.Element {
    return <Span>{sourceLabel(earning)}</Span>;
  }

  function totalLabel(currency: string): JSX.Element {
    return (
      <Span className="font-semibold">
        {t("earnings.list.get.widget.pageTotal", { currency })}
      </Span>
    );
  }

  function totalAmount(currency: string, cents: number): JSX.Element {
    return (
      <Span className="font-semibold">
        {formatMoney(cents / 100, currency, locale)}
      </Span>
    );
  }

  const totals = pageTotals(earnings);
  const rows = earnings.map((earning) => ({
    id: earning.id,
    cells: {
      date: dateText(earning),
      source: sourceText(earning),
      status: statusPill(earning),
      amount: amountText(earning),
    },
  }));
  const footerRows = totals.map(({ currency, cents }) => ({
    id: currency,
    cells: {
      date: totalLabel(currency),
      amount: totalAmount(currency, cents),
    },
  }));

  const compact = isText ? (
    <Div className="flex flex-col">
      {earnings.map((earning) => (
        <Span key={earning.id}>
          {`${formatDocDate(earning.createdAt, locale)}  ${sourceLabel(earning)}  ${formatMoney(earning.amountCents / 100, displayCurrency(earning.currency), locale)}  [${t(earning.status)}]`}
        </Span>
      ))}
      {totals.map(({ currency, cents }) => (
        <Span key={currency}>
          {`${t("earnings.list.get.widget.pageTotal", { currency })}: ${formatMoney(cents / 100, currency, locale)}`}
        </Span>
      ))}
    </Div>
  ) : (
    <Div className="flex min-w-0 flex-col gap-2">
      {earnings.map((earning) => (
        <Div
          key={earning.id}
          className="flex min-w-0 items-start justify-between gap-3 rounded-lg border bg-card p-3"
        >
          <Div className="flex min-w-0 flex-col">
            <Span className="truncate text-sm font-medium">
              {sourceLabel(earning)}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {formatDocDate(earning.createdAt, locale)}
            </Span>
          </Div>
          <Div className="flex shrink-0 flex-col items-end gap-1 text-sm tabular-nums">
            {amountText(earning)}
            {statusPill(earning)}
          </Div>
        </Div>
      ))}
      {totals.map(({ currency, cents }) => (
        <Div
          key={currency}
          className="flex items-center justify-between gap-3 px-3 pt-1 text-sm tabular-nums"
        >
          {totalLabel(currency)}
          {totalAmount(currency, cents)}
        </Div>
      ))}
    </Div>
  );

  return (
    <WidgetShell layout={embedded ? "compact" : "page"} className="min-w-0">
      <WidgetHeader
        size={embedded ? "section" : "page"}
        title={t("earnings.list.get.titleShort")}
        subtitle={embedded ? undefined : t("earnings.list.get.widget.subtitle")}
      />
      {hasError && (
        <EmptyBlock
          icon={<AlertTriangle className="size-6" />}
          title={t("earnings.list.get.widget.loadFailed")}
          message={response?.message}
          action={
            canAct
              ? {
                  label: t("earnings.list.get.widget.retry"),
                  onClick: () => {
                    void read?.refetch();
                  },
                }
              : undefined
          }
        />
      )}
      {!data && !hasError && (
        <LoadingBlock
          message={t("earnings.list.get.widget.loading")}
          size="sm"
        />
      )}
      {data && !hasError && earnings.length === 0 && (
        <EmptyBlock
          icon={<DollarSign className="size-6" />}
          title={t("earnings.list.get.widget.empty")}
          message={t("earnings.list.get.widget.emptyHint")}
        />
      )}
      {data && !hasError && earnings.length > 0 && (
        <Div
          className={
            isFetching
              ? "min-w-0 opacity-60 transition-opacity"
              : "min-w-0 transition-opacity"
          }
        >
          <RecordTable
            label={t("earnings.list.get.titleShort")}
            columns={[
              { id: "date", label: t("earnings.list.get.widget.col.date") },
              {
                id: "source",
                label: t("earnings.list.get.widget.col.source"),
              },
              {
                id: "status",
                label: t("earnings.list.get.widget.col.status"),
              },
              {
                id: "amount",
                label: t("earnings.list.get.widget.col.amount"),
                numeric: true,
              },
            ]}
            rows={rows}
            footerRows={footerRows}
            compact={compact}
          />
        </Div>
      )}
      {data && !hasError && total > 0 && (
        <Div className="flex flex-wrap items-center justify-between gap-2">
          <Span className="text-sm tabular-nums text-muted-foreground">
            {t("earnings.list.get.widget.showing", {
              from: from.toLocaleString(locale),
              to: to.toLocaleString(locale),
              total: total.toLocaleString(locale),
            })}
          </Span>
          {canAct && total > earnings.length && (
            <Div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={offset <= 0 || isFetching}
                onClick={() => setOffset(offset - limit)}
              >
                {t("earnings.list.get.widget.previous")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={offset + earnings.length >= total || isFetching}
                onClick={() => setOffset(offset + limit)}
              >
                {t("earnings.list.get.widget.next")}
              </Button>
            </Div>
          )}
        </Div>
      )}
    </WidgetShell>
  );
}
