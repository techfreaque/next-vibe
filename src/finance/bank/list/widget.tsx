"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ListItem } from "next-vibe/ui/components/list-item";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { Span } from "next-vibe/ui/components/span";
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

import { BankAccountPicker } from "../account-picker";
import { BankPageHeader } from "../page-header";
import type definition from "./definition";

export function BankListWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const data = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const { push } = useWidgetNavigation();
  const companyId = form.watch("companyId");
  const accountId = form.watch("accountId");
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;

  const submitPage = (page: number): void => {
    form.setValue("page", page, { shouldDirty: true });
    onSubmit?.();
  };
  const openImport = (): void => {
    void (async (): Promise<void> => {
      const { default: create } = await import("../import/definition");
      push(create.POST, { data: { companyId, accountId } });
    })();
  };
  const openCandidates = (lineId: string): void => {
    if (!data?.selectedCompanyId) {
      return;
    }
    const appliedCompany = data.selectedCompanyId;
    void (async (): Promise<void> => {
      const { default: candidates } = await import("../candidates/definition");
      push(candidates.GET, {
        data: { companyId: appliedCompany },
        urlPathParams: { lineId },
      });
    })();
  };
  const rows = (data?.lines ?? []).map((line) => {
    const amount = formatMoney(line.amount, line.currency, locale);
    const amountCell = (
      <Span
        className={
          Number(line.amount) > 0 ? "text-success tabular-nums" : "tabular-nums"
        }
      >
        {amount}
      </Span>
    );
    const date = formatDocDate(line.bookedDate, locale);
    const onOpen = interactive
      ? (): void => openCandidates(line.id)
      : undefined;
    const matchButton = onOpen ? (
      <Button type="button" size="sm" variant="outline" onClick={onOpen}>
        {t("ui.matchRow")}
      </Button>
    ) : undefined;
    return {
      id: line.id,
      cells: {
        transactionId: line.transactionId,
        date,
        amount: amountCell,
        status: t("ui.unmatched"),
        action: matchButton,
      },
      amount,
      onOpen,
    };
  });

  return (
    <WidgetShell layout="page">
      <BankPageHeader
        title={t("list.title")}
        subtitle={data?.selectedAccountName ?? t("list.description")}
        actions={
          interactive ? (
            <Button type="button" size="sm" onClick={openImport}>
              {t("ui.importAction")}
            </Button>
          ) : undefined
        }
      />
      {interactive && (
        <Div className="flex min-w-0 flex-wrap items-start gap-2 rounded-lg border bg-card p-3">
          <DocumentScopePicker
            kind="company"
            required
            value={companyId}
            appliedLabel={
              data?.selectedCompanyId === companyId
                ? data?.selectedCompanyName
                : undefined
            }
            onSelect={(id) => {
              if (id !== companyId) {
                form.reset({ companyId: id, page: 1 });
                onSubmit?.();
              }
            }}
          />
          <BankAccountPicker
            companyId={companyId}
            accountId={accountId}
            accountName={
              data?.selectedAccountId === accountId
                ? data?.selectedAccountName
                : undefined
            }
            onSelect={(id) => {
              form.setValue("accountId", id, { shouldDirty: true });
              submitPage(1);
            }}
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {data?.selectedAccountId ? (
        rows.length > 0 ? (
          <RecordTable
            label={t("list.title")}
            columns={[
              { id: "date", label: t("fields.bookedDate") },
              { id: "transactionId", label: t("fields.transactionId") },
              { id: "amount", label: t("fields.amount"), numeric: true },
              { id: "status", label: t("fields.status") },
              { id: "action", label: "" },
            ]}
            rows={rows.map(({ id, cells }) => ({ id, cells }))}
            compact={
              <Div className="flex flex-col gap-2">
                {rows.map((row) => (
                  <ListItem
                    key={row.id}
                    title={row.cells.date}
                    subtitle={row.cells.transactionId}
                    meta={row.cells.amount}
                    onClick={row.onOpen}
                  />
                ))}
              </Div>
            }
          />
        ) : (
          <EmptyBlock title={t("ui.empty")} message={t("ui.emptyHint")} />
        )
      ) : (
        <EmptyBlock title={t("ui.chooseScope")} />
      )}
      {data && data.pageCount > 1 && (
        <Div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!interactive || data.currentPage <= 1}
            onClick={() => submitPage(data.currentPage - 1)}
          >
            {t("ui.previous")}
          </Button>
          <Span>
            {data.currentPage} / {data.pageCount}
          </Span>
          <Button
            type="button"
            variant="outline"
            disabled={!interactive || data.currentPage >= data.pageCount}
            onClick={() => submitPage(data.currentPage + 1)}
          >
            {t("ui.next")}
          </Button>
        </Div>
      )}
    </WidgetShell>
  );
}
