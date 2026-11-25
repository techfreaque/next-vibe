"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Label } from "next-vibe/ui/components/label";
import { ListItem } from "next-vibe/ui/components/list-item";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { RecordTable } from "next-vibe/ui/components/record-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import { useWorkspaceCompany } from "@/companies/_shared/workspace-company-context";
import { DocumentScopePicker } from "@/finance/document-list-ui";

import type definition from "./definition";
import type { PostingReviewResponse } from "./definition";
import { ReviewIssue, ReviewIssueOptions } from "./enum";

type ReviewRow = PostingReviewResponse["rows"][number];

const recordLabels = {
  [ReviewIssue.MISSING_LINES]: {
    name: "records.journal",
    date: "records.journalDate",
    action: "records.openJournal",
  },
  [ReviewIssue.INVALID_LEGS]: {
    name: "records.journal",
    date: "records.journalDate",
    action: "records.openJournal",
  },
  [ReviewIssue.INVOICE_LINK]: {
    name: "records.invoice",
    date: "records.invoiceDate",
    action: "records.openInvoice",
  },
  [ReviewIssue.BILL_LINK]: {
    name: "records.bill",
    date: "records.billDate",
    action: "records.openBill",
  },
} as const;

export function PostingReviewWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const form = useWidgetForm<typeof definition.GET>();
  const locale = useWidgetLocale();
  const workspace = useWorkspaceCompany();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const { push, pop, canGoBack } = useWidgetNavigation();
  const showInputs = interactive && !responseOnly;
  const companyId = form.watch("companyId");
  const reportCompanyId = companyId || data?.reportCompanyId || undefined;
  const isActiveCompany = Boolean(
    reportCompanyId && workspace?.active?.id === reportCompanyId,
  );
  const kind = form.watch("kind");
  const page = Number(form.watch("page") ?? 1);
  const ready =
    data &&
    (!showInputs ||
      ((!companyId || data.reportCompanyId === companyId) &&
        (kind ?? null) === data.filterKind &&
        page === data.currentPage));

  const goToPage = (target: number): void => {
    form.setValue("page", target, { shouldDirty: true });
  };
  const openRecord = (row: ReviewRow): void => {
    void (async (): Promise<void> => {
      switch (row.kind) {
        case ReviewIssue.INVOICE_LINK: {
          const { default: invoice } =
            await import("@/payment/invoice/[invoiceId]/get/definition");
          push(invoice.GET, { urlPathParams: { invoiceId: row.entityId } });
          return;
        }
        case ReviewIssue.BILL_LINK: {
          const { default: bill } =
            await import("@/payment/bill/[billId]/get/definition");
          push(bill.GET, { urlPathParams: { billId: row.entityId } });
          return;
        }
        default: {
          const { default: journal } =
            await import("../../journal/[entryId]/get/definition");
          push(journal.GET, { urlPathParams: { entryId: row.entityId } });
        }
      }
    })();
  };

  const viewRows = (data?.rows ?? []).map((row) => {
    const labels = recordLabels[row.kind];
    return {
      ...row,
      title: row.reference || t(labels.name),
      recordName: t(labels.name),
      date: t("records.dateInfo", {
        label: t(labels.date),
        date: formatDocDate(row.recordDate, locale),
      }),
      explanation: t(row.reason),
      action: t(labels.action),
    };
  });

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("title")}
        subtitle={t("description")}
        backButton={
          canGoBack && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => pop()}
            >
              <ChevronLeft className="size-4" />
              {t("widget.back")}
            </Button>
          )
        }
      />
      {showInputs && (
        <Div className="flex flex-wrap items-end gap-3">
          {!isActiveCompany && (
            <DocumentScopePicker
              kind="company"
              required
              value={reportCompanyId}
              appliedLabel={
                data?.reportCompanyId === reportCompanyId
                  ? data?.reportCompanyName
                  : undefined
              }
              onSelect={(id) => {
                goToPage(1);
                form.setValue("companyId", id, { shouldDirty: true });
              }}
            />
          )}
          <Div className="flex min-w-52 flex-col gap-1.5">
            <Label htmlFor="posting-review-issue">{t("filters.issue")}</Label>
            <Select<string>
              value={kind ?? "all"}
              onValueChange={(value) => {
                goToPage(1);
                form.setValue(
                  "kind",
                  ReviewIssueOptions.find((option) => option.value === value)
                    ?.value,
                  { shouldDirty: true },
                );
              }}
            >
              <SelectTrigger id="posting-review-issue">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.all")}</SelectItem>
                {ReviewIssueOptions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {t(label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Div>
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {response?.success === false ? null : !ready ? (
        <LoadingBlock message={t("widget.loading")} />
      ) : !data.reportCompanyId ? (
        <EmptyBlock title={t("company.choose")} message={t("company.empty")} />
      ) : (
        <>
          <MetricGrid columns={4}>
            <MetricCard
              label={t("issues.missingLines")}
              value={data.counts.missingLines}
            />
            <MetricCard
              label={t("issues.invalidLegs")}
              value={data.counts.invalidLegs}
            />
            <MetricCard
              label={t("issues.invoiceLink")}
              value={data.counts.invoiceLinks}
            />
            <MetricCard
              label={t("issues.billLink")}
              value={data.counts.billLinks}
            />
          </MetricGrid>
          {viewRows.length === 0 ? (
            <EmptyBlock
              title={t(
                data.matchedCount ? "pagination.emptyPage" : "widget.empty",
              )}
              action={
                data.matchedCount && showInputs
                  ? {
                      label: t("pagination.firstPage"),
                      onClick: () => goToPage(1),
                    }
                  : undefined
              }
            />
          ) : (
            <RecordTable
              label={t("title")}
              columns={[
                { id: "record", label: t("columns.record") },
                { id: "date", label: t("columns.date") },
                { id: "reason", label: t("columns.reason") },
                ...(showInputs
                  ? [{ id: "open", label: t("columns.open") }]
                  : []),
              ]}
              rows={viewRows.map((row) => {
                const title = (
                  <Div className="flex min-w-32 flex-col gap-0.5">
                    <Span className="font-medium">{row.title}</Span>
                    <Span className="text-xs text-muted-foreground">
                      {row.counterparty || row.recordName}
                    </Span>
                  </Div>
                );
                const finding = (
                  <Div className="flex min-w-56 max-w-xl flex-col gap-1 whitespace-normal">
                    <Span className="font-medium">{t(row.kind)}</Span>
                    <P className="text-sm text-muted-foreground">
                      {row.explanation}
                    </P>
                  </Div>
                );
                const openButton = showInputs ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openRecord(row)}
                  >
                    {row.action}
                    <ArrowRight className="size-4 shrink-0" />
                  </Button>
                ) : null;
                return {
                  id: `${row.kind}:${row.entityId}`,
                  cells: {
                    record: title,
                    date: row.date,
                    reason: finding,
                    open: openButton,
                  },
                };
              })}
              compact={
                <Div className="flex flex-col gap-2">
                  {viewRows.map((row) => (
                    <ListItem
                      key={`${row.kind}:${row.entityId}`}
                      title={row.title}
                      subtitle={row.date}
                      meta={
                        <Div className="flex min-w-0 flex-col gap-1">
                          <Span className="font-medium text-foreground">
                            {t(row.kind)}
                          </Span>
                          <P className="text-sm text-muted-foreground">
                            {row.explanation}
                          </P>
                        </Div>
                      }
                      onClick={showInputs ? () => openRecord(row) : undefined}
                      actions={
                        showInputs ? (
                          <ArrowRight className="size-4 text-muted-foreground" />
                        ) : undefined
                      }
                    />
                  ))}
                </Div>
              }
            />
          )}
          {showInputs && data.totalPages > 1 && (
            <Div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={data.currentPage <= 1}
                onClick={() => goToPage(data.currentPage - 1)}
              >
                {t("pagination.previous")}
              </Button>
              <Span className="text-sm tabular-nums text-muted-foreground">
                {t("pagination.pageInfo", {
                  page: data.currentPage,
                  total: data.totalPages,
                })}
              </Span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={data.currentPage >= data.totalPages}
                onClick={() => goToPage(data.currentPage + 1)}
              >
                {t("pagination.next")}
              </Button>
            </Div>
          )}
          <P className="text-sm text-muted-foreground">
            {t("widget.coverage")}
          </P>
        </>
      )}
    </WidgetShell>
  );
}
