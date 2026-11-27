"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ListItem } from "next-vibe/ui/components/list-item";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import { DocumentScopePicker } from "@/finance/document-list-ui";

import { BankAccountPicker } from "../account-picker";
import { BankPageHeader } from "../page-header";
import type definition from "./definition";

function TargetPill({
  status,
  applied,
  label,
}: {
  status: string;
  applied: boolean;
  label: string;
}): JSX.Element {
  return (
    <StatusPill
      status={status}
      variant={applied ? "success" : "info"}
      label={label}
    />
  );
}

function AmountCell({ value }: { value: string }): JSX.Element {
  return <Span className="tabular-nums">{value}</Span>;
}

export function BankAutoMatchWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const isSubmitting = useWidgetIsSubmitting();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;

  const companyId = form.watch("companyId");
  const accountId = form.watch("accountId");

  const runMode = (dryRun: boolean): void => {
    form.setValue("dryRun", dryRun, { shouldDirty: true });
    onSubmit?.();
  };

  const rows = (data?.items ?? []).map((item) => {
    const targetBadge = TargetPill({
      status: item.targetType,
      applied: item.applied,
      label: t(`autoMatch.targets.${item.targetType}`),
    });
    const amountDisplay = AmountCell({
      value: formatMoney(item.amount, item.currency, locale),
    });
    return {
      id: `${item.lineId}-${item.targetId}`,
      cells: {
        date: formatDocDate(item.bookedDate, locale),
        transactionId: item.transactionId,
        targetType: targetBadge,
        targetLabel: item.targetLabel,
        basis: t(`autoMatch.basis.${item.basis}`),
        amount: amountDisplay,
      },
      item,
    };
  });

  return (
    <WidgetShell layout="page">
      <BankPageHeader
        title={t("autoMatch.title")}
        subtitle={t("autoMatch.description")}
      />
      {interactive && (
        <Div className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-3">
          <Div className="flex min-w-0 flex-wrap items-start gap-2">
            <DocumentScopePicker
              kind="company"
              required
              value={companyId}
              onSelect={(id) => {
                if (id !== companyId) {
                  form.setValue("companyId", id, { shouldDirty: true });
                  form.setValue("accountId", "", { shouldDirty: true });
                }
              }}
            />
            <BankAccountPicker
              companyId={companyId}
              accountId={accountId}
              onSelect={(id) => {
                form.setValue("accountId", id, { shouldDirty: true });
              }}
            />
          </Div>
          <Div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting || !companyId || !accountId}
              onClick={() => runMode(true)}
            >
              {t("autoMatch.previewAction")}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isSubmitting || !companyId || !accountId}
              onClick={() => runMode(false)}
            >
              {t("autoMatch.applyAction")}
            </Button>
          </Div>
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {data && (
        <>
          <ResultBanner
            variant={data.preview ? "info" : "success"}
            title={
              data.preview
                ? t("autoMatch.previewBanner", { count: data.matchedCount })
                : t("autoMatch.appliedBanner", { count: data.matchedCount })
            }
            message={
              data.skippedAmbiguous > 0
                ? t("autoMatch.skippedHint", { count: data.skippedAmbiguous })
                : undefined
            }
          />
          <Div className="grid gap-3 @sm:grid-cols-2 @lg:grid-cols-4">
            <MetricCard
              label={t("autoMatch.matchedCount")}
              value={data.matchedCount}
            />
            <MetricCard
              label={t("autoMatch.invoiceMatches")}
              value={data.invoiceMatches}
            />
            <MetricCard
              label={t("autoMatch.billMatches")}
              value={data.billMatches}
            />
            <MetricCard
              label={t("autoMatch.journalMatches")}
              value={data.journalMatches}
            />
          </Div>
          {rows.length > 0 ? (
            <RecordTable
              label={t("autoMatch.items")}
              columns={[
                { id: "date", label: t("fields.bookedDate") },
                { id: "transactionId", label: t("fields.transactionId") },
                { id: "targetType", label: t("autoMatch.targetType") },
                { id: "targetLabel", label: t("autoMatch.targetLabel") },
                { id: "basis", label: t("autoMatch.basisLabel") },
                { id: "amount", label: t("fields.amount"), numeric: true },
              ]}
              rows={rows.map(({ id, cells }) => ({ id, cells }))}
              compact={
                <Div className="flex flex-col gap-2">
                  {rows.map(({ id, item }) => (
                    <ListItem
                      key={id}
                      title={item.targetLabel}
                      subtitle={`${formatDocDate(item.bookedDate, locale)} · ${t(`autoMatch.basis.${item.basis}`)}`}
                      meta={formatMoney(item.amount, item.currency, locale)}
                    />
                  ))}
                </Div>
              }
            />
          ) : (
            <EmptyBlock
              title={t("autoMatch.emptyTitle")}
              message={t("autoMatch.emptyHint")}
            />
          )}
        </>
      )}
    </WidgetShell>
  );
}
