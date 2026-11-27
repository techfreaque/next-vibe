"use client";

import { formatTimestamp } from "next-vibe/core/i18n/core/localization-utils";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Download } from "next-vibe/ui/components/icons/Download";
import { Users } from "next-vibe/ui/components/icons/Users";
import { ListItem } from "next-vibe/ui/components/list-item";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { downloadFile } from "next-vibe/ui/lib/download";
import {
  useWidgetLocale,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { LeadMagnetCaptureStatus } from "../enum";
import type endpoints from "./definition";
import type { CapturesListResponseOutput } from "./definition";

type CaptureItem = CapturesListResponseOutput["items"][number];

function wasCaptured(item: CaptureItem): boolean {
  return (
    item.status === LeadMagnetCaptureStatus.SUCCESS || item.status === "SUCCESS"
  );
}

function escapeSpreadsheetCell(value: string): string {
  const safeValue = /^[\s]*[=+\-@]|^[\t\r\n]/u.test(value)
    ? `'${value}`
    : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

function downloadCsv(items: CaptureItem[]): void {
  const header = ["Date", "Name", "Email", "Status", "Error"];
  const rows = items.map((r) => [
    r.createdAt,
    r.firstName,
    r.email,
    wasCaptured(r) ? "SUCCESS" : "FAILED",
    r.errorMessage ?? "",
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map(escapeSpreadsheetCell).join(","))
    .join("\n");

  downloadFile(
    `leads-${new Date().toISOString().slice(0, 10)}.csv`,
    csv,
    "text/csv;charset=utf-8;",
  );
}

export function LeadMagnetCapturesWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const locale = useWidgetLocale();
  const embedded = useWidgetResponseOnly();
  const data = useWidgetValue<typeof endpoints.GET>();
  const items = data?.items ?? [];

  const renderStatus = (item: CaptureItem): JSX.Element => {
    const captured = wasCaptured(item);
    return (
      <StatusPill
        status={item.status}
        label={t(captured ? "widget.statusSuccess" : "widget.statusFailed")}
        variant={captured ? "success" : "danger"}
      />
    );
  };

  const exportButton = items.length > 0 && (
    <Button
      type="button"
      variant={embedded ? "outline" : "default"}
      size="sm"
      onClick={() => downloadCsv(items)}
      className="min-h-10 gap-2"
    >
      <Download className="size-4" />
      {t("widget.exportCsv")}
    </Button>
  );

  return (
    <WidgetShell
      layout={embedded ? "compact" : "page"}
      padding="none"
      scroll={!embedded}
    >
      {!embedded && (
        <WidgetHeader
          size="page"
          title={t("list.title")}
          actions={exportButton}
        />
      )}
      {items.length === 0 ? (
        <EmptyBlock icon={<Users />} title={t("widget.empty")} />
      ) : (
        <>
          <Div className="flex flex-wrap items-center justify-between gap-2">
            <Span className="text-sm font-medium text-muted-foreground">
              {t("list.response.total")}{" "}
              <Span className="tabular-nums">
                {(data?.total ?? items.length).toLocaleString(locale)}
              </Span>
            </Span>
            {embedded && exportButton}
          </Div>
          <Div className="grid gap-2 @lg:hidden">
            {items.map((item) => (
              <ListItem
                key={item.id}
                title={item.firstName}
                subtitle={item.email}
                badges={renderStatus(item)}
                meta={formatTimestamp(item.createdAt, locale)}
              />
            ))}
          </Div>
          <Div className="hidden overflow-hidden rounded-xl border bg-card @lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("widget.columns.name")}</TableHead>
                  <TableHead>{t("widget.columns.email")}</TableHead>
                  <TableHead>{t("widget.columns.date")}</TableHead>
                  <TableHead>{t("widget.columns.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.firstName}
                    </TableCell>
                    <TableCell className="break-all text-muted-foreground">
                      {item.email}
                    </TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">
                      {formatTimestamp(item.createdAt, locale)}
                    </TableCell>
                    <TableCell>{renderStatus(item)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Div>
        </>
      )}
    </WidgetShell>
  );
}
