"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ListItem } from "next-vibe/ui/components/list-item";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import { DocumentScopePicker } from "@/finance/document-list-ui";

import type definition from "./definition";

export function RecurringListWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const data = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const { push } = useWidgetNavigation();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;

  const companyId =
    form.watch("companyId") ?? data?.selectedCompanyId ?? undefined;

  const openCreate = (): void => {
    void import("../create/definition").then((m) =>
      push(m.default.POST, {
        renderInModal: true,
        data: { companyId },
      }),
    );
  };
  const openRun = (): void => {
    void import("../run/definition").then((m) =>
      push(m.default.POST, {
        data: { companyId, dryRun: true },
      }),
    );
  };
  const openSettings = (): void => {
    void import("../../../company-settings/definition").then((m) =>
      push(m.default.POST, {
        data: { companyId },
      }),
    );
  };
  const openToggle = (scheduleId: string, currentlyEnabled: boolean): void => {
    void import("../[scheduleId]/toggle/definition").then((m) =>
      push(m.default.POST, {
        urlPathParams: { scheduleId },
        renderInModal: true,
        data: { isEnabled: !currentlyEnabled },
      }),
    );
  };

  const rows = (data?.schedules ?? []).map((item) => {
    const pill = (
      <StatusPill
        status={item.isEnabled ? "active" : "paused"}
        variant={item.isEnabled ? "success" : "muted"}
        label={item.isEnabled ? t("recurring.enabled") : t("recurring.paused")}
      />
    );
    const amountCell = (
      <Span className="tabular-nums">
        {formatMoney(item.totalEstimate, item.currency, locale)}
      </Span>
    );
    const toggleBtn = interactive ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => openToggle(item.id, item.isEnabled)}
      >
        {item.isEnabled
          ? t("recurring.pauseAction")
          : t("recurring.enableAction")}
      </Button>
    ) : undefined;
    return {
      id: item.id,
      cells: {
        title: item.title,
        customer: item.customerName,
        frequency: t(`recurring.frequency.${item.frequency}`),
        nextRunDate: formatDocDate(item.nextRunDate, locale),
        amount: amountCell,
        status: pill,
        action: toggleBtn,
      },
      item,
    };
  });

  const actions = interactive ? (
    <Div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" size="sm" onClick={openSettings}>
        {t("recurring.openSettings")}
      </Button>
      {companyId && (
        <Button type="button" variant="outline" size="sm" onClick={openRun}>
          {t("recurring.runDue")}
        </Button>
      )}
      <Button type="button" size="sm" onClick={openCreate}>
        {t("recurring.newSchedule")}
      </Button>
    </Div>
  ) : undefined;

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("recurring.listTitle")}
        subtitle={t("recurring.listDescription")}
        actions={actions}
      />
      {interactive && (
        <Div className="flex flex-wrap items-start gap-2 rounded-lg border bg-card p-3">
          <DocumentScopePicker
            kind="company"
            value={companyId}
            onSelect={(id) => {
              form.setValue("companyId", id, { shouldDirty: true });
              onSubmit?.();
            }}
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {data && !data.companyEnabled && data.selectedCompanyId && (
        <ResultBanner
          variant="warning"
          title={t("recurring.companyDisabledBanner")}
        />
      )}
      {rows.length > 0 ? (
        <RecordTable
          label={t("recurring.listTitle")}
          columns={[
            { id: "title", label: t("fields.title") },
            { id: "customer", label: t("fields.customerName") },
            { id: "frequency", label: t("fields.frequency") },
            { id: "nextRunDate", label: t("fields.nextRunDate") },
            { id: "amount", label: t("fields.lineUnitPrice"), numeric: true },
            { id: "status", label: t("fields.isEnabled") },
            { id: "action", label: "" },
          ]}
          rows={rows.map(({ id, cells }) => ({ id, cells }))}
          compact={
            <Div className="flex flex-col gap-2">
              {rows.map(({ id, item }) => (
                <ListItem
                  key={id}
                  title={item.title}
                  subtitle={`${item.customerName} · ${t(`recurring.frequency.${item.frequency}`)} · ${formatDocDate(item.nextRunDate, locale)}`}
                  meta={formatMoney(item.totalEstimate, item.currency, locale)}
                />
              ))}
            </Div>
          }
        />
      ) : (
        <EmptyBlock
          title={t("recurring.empty")}
          message={t("recurring.emptyHint")}
        />
      )}
    </WidgetShell>
  );
}
