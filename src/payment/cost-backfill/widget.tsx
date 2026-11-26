"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";
import { historyHeader, type HistoryRow } from "./history";

export function CostHistoryWidget({
  field: { children },
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const data = useWidgetValue<typeof definition.POST>();
  const { push } = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const openBill = (companyId: string, row: HistoryRow): void => {
    void (async (): Promise<void> => {
      const { default: supplier } =
        await import("@/finance/supplier-evidence/definition");
      push(supplier.POST, {
        data: {
          companyId,
          operation: "bill",
          externalReference: row.invoice,
          invoiceReference: row.invoice,
          date: row.date,
          grossAmount: row.gross,
          currency: row.currency,
          taxAmount: row.tax,
          description: row.reference,
          dryRun: true,
        },
      });
    })();
  };
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("title")}
        subtitle={t("description")}
      />
      <EntityPickerFieldWidget
        fieldName="companyId"
        field={children.companyId}
      />
      <Div className="flex flex-wrap gap-1.5">
        {historyHeader.split("\t").map((header) => (
          <Span
            key={header}
            className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
          >
            {header}
          </Span>
        ))}
      </Div>
      <Div className="[&_textarea]:whitespace-pre [&_textarea]:overflow-x-auto [&_textarea]:font-mono [&_textarea]:text-xs [&_textarea]:leading-6 [&_textarea]:[tab-size:18]">
        <TextareaFieldWidget
          fieldName="history"
          field={{ ...children.history, rows: 5 }}
        />
      </Div>
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget field={{ text: "preview", className: "self-end" }} />
      {data && (
        <SectionGroup title={t("rows")}>
          <RecordTable
            label={t("rows")}
            columns={[
              { id: "reference", label: t("referenceColumn") },
              { id: "kind", label: t("kindColumn") },
              { id: "status", label: t("statusColumn") },
              { id: "amount", label: t("amountColumn"), numeric: true },
              { id: "action", label: t("actionColumn") },
            ]}
            rows={data.rows.map((row) => {
              const amount = row.gross ?? row.net;
              const status = <Badge variant="secondary">{t(row.status)}</Badge>;
              const action =
                interactive && !responseOnly && row.status === "ready" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => openBill(data.company, row)}
                  >
                    {t("openBill")}
                  </Button>
                ) : null;
              return {
                id: row.reference,
                cells: {
                  reference: row.reference,
                  kind: t(row.kind),
                  status,
                  amount:
                    amount && row.currency
                      ? `${!row.gross && row.net ? `${t("net")} ` : ""}${formatMoney(amount, row.currency, locale)}`
                      : null,
                  action,
                },
              };
            })}
            compact={
              <Div className="flex flex-col gap-3">
                {data.rows.map((row) => {
                  const amount = row.gross ?? row.net;
                  return (
                    <Div
                      key={row.reference}
                      className="flex flex-col gap-2 rounded-lg border bg-card p-3"
                    >
                      <Span className="break-all font-medium">
                        {row.reference}
                      </Span>
                      <Div className="flex flex-wrap items-center gap-2">
                        <Span className="text-sm text-muted-foreground">
                          {t(row.kind)}
                        </Span>
                        <Badge variant="secondary">{t(row.status)}</Badge>
                      </Div>
                      {amount && row.currency && (
                        <Span className="tabular-nums">
                          {!row.gross && row.net ? `${t("net")} ` : ""}
                          {formatMoney(amount, row.currency, locale)}
                        </Span>
                      )}
                      {interactive &&
                        !responseOnly &&
                        row.status === "ready" && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="self-start"
                            onClick={() => openBill(data.company, row)}
                          >
                            {t("openBill")}
                          </Button>
                        )}
                    </Div>
                  );
                })}
              </Div>
            }
          />
        </SectionGroup>
      )}
    </WidgetShell>
  );
}
