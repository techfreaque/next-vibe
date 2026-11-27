"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ListItem } from "next-vibe/ui/components/list-item";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { SectionGroup } from "next-vibe/ui/components/section-group";
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
  const accountId =
    form.watch("accountId") ?? data?.selectedAccountId ?? undefined;
  const activeStatus = form.watch("status") ?? "open";
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;

  const submitPage = (page: number): void => {
    form.setValue("page", page, { shouldDirty: true });
    onSubmit?.();
  };
  const submitStatus = (status: "open" | "matched" | "all"): void => {
    form.setValue("status", status, { shouldDirty: true });
    form.setValue("page", 1, { shouldDirty: true });
    onSubmit?.();
  };
  const openImport = (): void => {
    void (async (): Promise<void> => {
      const { default: create } = await import("../import/definition");
      push(create.POST, { data: { companyId, accountId } });
    })();
  };
  const openAutoMatch = (): void => {
    void import("../auto-match/definition").then(({ default: routes }) =>
      push(routes.POST, {
        data: { companyId, accountId, dryRun: true },
      }),
    );
  };
  const openSettings = (): void => {
    void import("../settings/definition").then(({ default: routes }) =>
      push(routes.POST, {
        data: {
          companyId,
          accountId,
          bookedCurrency:
            data?.settings?.bookedCurrency ?? data?.selectedCurrency,
          foreignCurrency: data?.settings?.foreignCurrency ?? undefined,
          maxFxDifference: data?.settings?.maxFxDifference ?? undefined,
          maxFxBps: data?.settings?.maxFxBps ?? undefined,
          maxDateDistanceDays: data?.settings?.maxDateDistanceDays ?? 7,
          gainAccountId: data?.settings?.gainAccountId ?? undefined,
          lossAccountId: data?.settings?.lossAccountId ?? undefined,
          feeAccountId: data?.settings?.feeAccountId ?? undefined,
        },
      }),
    );
  };
  const openCandidates = (lineId: string): void => {
    if (!data?.selectedCompanyId) {
      return;
    }
    const appliedCompany = data.selectedCompanyId;
    void (async (): Promise<void> => {
      const { default: candidates } = await import("../candidates/definition");
      push(candidates.GET, {
        data: { companyId: appliedCompany, lineId },
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
    const isMatched = Boolean(line.matchedAt || line.matchKind);
    const statusPill = (
      <StatusPill
        status={isMatched ? (line.matchKind ?? "matched") : "unmatched"}
        variant={isMatched ? "success" : "warning"}
        label={
          isMatched
            ? line.matchKind === "split"
              ? t("ui.splitMatched")
              : t("ui.matched")
            : t("ui.unmatched")
        }
      />
    );
    const matchButton = onOpen ? (
      <Button type="button" size="sm" variant="outline" onClick={onOpen}>
        {isMatched ? t("ui.review") : t("ui.matchRow")}
      </Button>
    ) : undefined;
    return {
      id: line.id,
      cells: {
        transactionId:
          line.counterparty ||
          line.description ||
          (/^[a-f0-9]{64}$/u.test(line.transactionId)
            ? t("fields.line")
            : line.transactionId),
        date,
        amount: amountCell,
        status: statusPill,
        action: matchButton,
      },
      amount,
      onOpen,
    };
  });

  const recon = data?.reconciliationStatus;
  const accountRows = (data?.accountStatuses ?? []).map((acct) => {
    const statementNetCell = (
      <Span className="tabular-nums">
        {formatMoney(acct.statementNetAmount, acct.currency, locale)}
      </Span>
    );
    const ledgerBalanceCell = (
      <Span className="tabular-nums">
        {formatMoney(acct.ledgerBalance, acct.currency, locale)}
      </Span>
    );
    const differenceCell = (
      <Span
        className={
          Number(acct.difference) === 0
            ? "tabular-nums text-success"
            : "tabular-nums text-warning"
        }
      >
        {formatMoney(acct.difference, acct.currency, locale)}
      </Span>
    );
    const selectButton = interactive ? (
      <Button
        type="button"
        size="sm"
        variant={acct.accountId === accountId ? "default" : "outline"}
        onClick={() => {
          form.setValue("accountId", acct.accountId, { shouldDirty: true });
          submitPage(1);
        }}
      >
        {t("ui.selectAccount")}
      </Button>
    ) : undefined;
    return {
      id: acct.accountId,
      cells: {
        account: `${acct.accountCode} ${acct.accountName}`,
        matched: `${acct.matchedLines} / ${acct.totalLines}`,
        unmatched: acct.unmatchedLines,
        statementNet: statementNetCell,
        ledgerBalance: ledgerBalanceCell,
        difference: differenceCell,
        action: selectButton,
      },
      acct,
    };
  });

  return (
    <WidgetShell layout="page">
      <BankPageHeader
        title={t("list.title")}
        subtitle={data?.selectedAccountName ?? t("list.description")}
        actions={
          interactive ? (
            <Div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={openImport}>
                {t("ui.importAction")}
              </Button>
              {data?.canManage && accountId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openAutoMatch}
                >
                  {t("autoMatch.action")}
                </Button>
              )}
              {data?.canManage && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openSettings}
                >
                  {t("adjustment.settings")}
                </Button>
              )}
            </Div>
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
      {recon && (
        <Div className="grid gap-3 @sm:grid-cols-2 @lg:grid-cols-4">
          <MetricCard
            label={t("reconciliation.unmatchedLines")}
            value={recon.unmatchedLines}
          />
          <MetricCard
            label={t("reconciliation.matchedLines")}
            value={`${recon.matchedLines} / ${recon.totalLines}`}
          />
          <MetricCard
            label={t("reconciliation.statementNet")}
            value={formatMoney(
              recon.statementNetAmount,
              recon.currency,
              locale,
            )}
          />
          <MetricCard
            label={t("reconciliation.ledgerBalance")}
            value={formatMoney(recon.ledgerBalance, recon.currency, locale)}
          />
        </Div>
      )}
      {accountRows.length > 1 && (
        <SectionGroup title={t("reconciliation.accountsTitle")}>
          <RecordTable
            label={t("reconciliation.accountsTitle")}
            columns={[
              { id: "account", label: t("fields.account") },
              { id: "matched", label: t("reconciliation.matchedLines") },
              {
                id: "unmatched",
                label: t("reconciliation.unmatchedLines"),
                numeric: true,
              },
              {
                id: "statementNet",
                label: t("reconciliation.statementNet"),
                numeric: true,
              },
              {
                id: "ledgerBalance",
                label: t("reconciliation.ledgerBalance"),
                numeric: true,
              },
              {
                id: "difference",
                label: t("reconciliation.difference"),
                numeric: true,
              },
              { id: "action", label: "" },
            ]}
            rows={accountRows.map(({ id, cells }) => ({ id, cells }))}
            compact={
              <Div className="flex flex-col gap-2">
                {accountRows.map(({ id, acct }) => (
                  <ListItem
                    key={id}
                    title={`${acct.accountCode} ${acct.accountName}`}
                    subtitle={`${acct.matchedLines}/${acct.totalLines} · ${t("reconciliation.difference")} ${formatMoney(acct.difference, acct.currency, locale)}`}
                    meta={formatMoney(
                      acct.ledgerBalance,
                      acct.currency,
                      locale,
                    )}
                  />
                ))}
              </Div>
            }
          />
        </SectionGroup>
      )}
      {data?.selectedAccountId && interactive && (
        <Div className="flex flex-wrap gap-2">
          {(["open", "matched", "all"] as const).map((statusVal) => (
            <Button
              key={statusVal}
              type="button"
              size="sm"
              variant={activeStatus === statusVal ? "default" : "outline"}
              onClick={() => submitStatus(statusVal)}
            >
              {statusVal === "open"
                ? t("ui.unmatched")
                : statusVal === "matched"
                  ? t("ui.matched")
                  : t("ui.allLines")}
            </Button>
          ))}
        </Div>
      )}
      {data?.selectedAccountId ? (
        rows.length > 0 ? (
          <RecordTable
            label={t("list.title")}
            columns={[
              { id: "date", label: t("fields.bookedDate") },
              { id: "transactionId", label: t("fields.description") },
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
                    title={row.cells.transactionId}
                    subtitle={row.cells.date}
                    badges={row.cells.status}
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
