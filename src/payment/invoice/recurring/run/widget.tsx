"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ListItem } from "next-vibe/ui/components/list-item";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
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

import type definition from "./definition";

export function RecurringRunWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const isSubmitting = useWidgetIsSubmitting();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;

  const trigger = (dryRun: boolean): void => {
    form.setValue("dryRun", dryRun, { shouldDirty: true });
    onSubmit?.();
  };

  const rows = (data?.items ?? []).map((item) => {
    const statusPill = (
      <StatusPill
        status={item.status}
        variant={
          item.status === "issued" || item.status === "created"
            ? "success"
            : item.status === "failed"
              ? "danger"
              : "info"
        }
        label={t(`recurring.status.${item.status}`)}
      />
    );
    return {
      id: item.scheduleId,
      cells: {
        title: item.title,
        runDate: formatDocDate(item.runDate, locale),
        nextRunDate: formatDocDate(item.nextRunDate, locale),
        invoiceNumber: item.invoiceNumber ?? "-",
        status: statusPill,
      },
      item,
    };
  });

  const actions = interactive ? (
    <Div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isSubmitting}
        onClick={() => trigger(true)}
      >
        {t("recurring.previewRun")}
      </Button>
      <Button
        type="button"
        size="sm"
        disabled={isSubmitting}
        onClick={() => trigger(false)}
      >
        {t("recurring.applyRun")}
      </Button>
    </Div>
  ) : undefined;

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("recurring.runTitle")}
        subtitle={t("recurring.runDescription")}
        actions={actions}
      />
      <FormAlertWidget field={{}} />
      {data && (
        <>
          <ResultBanner
            variant={data.preview ? "info" : "success"}
            title={t("recurring.runSuccess")}
          />
          <Div className="grid gap-3 @sm:grid-cols-3">
            <MetricCard
              label={t("fields.processedCount")}
              value={data.processedCount}
            />
            <MetricCard
              label={t("fields.issuedCount")}
              value={data.issuedCount}
            />
            <MetricCard
              label={t("fields.failedCount")}
              value={data.failedCount}
            />
          </Div>
          {rows.length > 0 && (
            <RecordTable
              label={t("fields.items")}
              columns={[
                { id: "title", label: t("fields.title") },
                { id: "runDate", label: t("fields.nextRunDate") },
                { id: "nextRunDate", label: t("fields.nextRunDate") },
                { id: "invoiceNumber", label: t("fields.invoiceId") },
                { id: "status", label: t("fields.isEnabled") },
              ]}
              rows={rows.map(({ id, cells }) => ({ id, cells }))}
              compact={
                <Div className="flex flex-col gap-2">
                  {rows.map(({ id, item }) => (
                    <ListItem
                      key={id}
                      title={item.title}
                      subtitle={`${formatDocDate(item.runDate, locale)} -> ${formatDocDate(item.nextRunDate, locale)}`}
                      meta={t(`recurring.status.${item.status}`)}
                    />
                  ))}
                </Div>
              }
            />
          )}
        </>
      )}
    </WidgetShell>
  );
}
