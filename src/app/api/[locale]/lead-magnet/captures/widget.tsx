"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Download } from "next-vibe-ui/ui/icons/Download";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import React, { useCallback, useRef } from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { CapturesListResponseOutput } from "./definition";

interface WidgetProps {
  field: {
    value: CapturesListResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
}

type CaptureItem = CapturesListResponseOutput["items"][number];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function downloadCsv(items: CaptureItem[]): void {
  const header = ["Date", "Name", "Email", "Status", "Error"];
  const rows = items.map((r) => [
    r.createdAt,
    r.firstName,
    r.email,
    r.status,
    r.errorMessage ?? "",
  ]);
  const csv = [header, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function LeadMagnetCapturesWidget({ field }: WidgetProps): JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const data = field.value;
  const items = data?.items ?? [];
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const handleExport = useCallback((): void => {
    downloadCsv(itemsRef.current);
  }, []);

  if (items.length === 0) {
    return (
      <Div className="flex flex-col items-center gap-4 px-4 py-10 text-center">
        <Div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Users className="h-6 w-6 text-muted-foreground" />
        </Div>
        <Span className="text-sm text-muted-foreground max-w-xs">
          {t("widget.empty")}
        </Span>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      {/* Header row */}
      <Div className="flex items-center justify-between px-1">
        <Span className="text-sm font-medium text-muted-foreground">
          {data?.total ?? items.length} leads
        </Span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="gap-2"
        >
          <Download className="h-3 w-3" />
          {t("widget.exportCsv")}
        </Button>
      </Div>

      {/* Table */}
      <Div className="rounded-lg border overflow-hidden">
        {/* Column headers */}
        <Div className="grid grid-cols-[1fr_1fr_2fr_auto] gap-0 border-b bg-muted/50 px-4 py-2">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("widget.columns.date")}
          </Span>
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("widget.columns.name")}
          </Span>
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("widget.columns.email")}
          </Span>
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("widget.columns.status")}
          </Span>
        </Div>

        {/* Rows */}
        {items.map((item, i) => (
          <Div
            key={item.id}
            className={`grid grid-cols-[1fr_1fr_2fr_auto] gap-0 items-center px-4 py-3 ${
              i < items.length - 1 ? "border-b" : ""
            }`}
          >
            <Span className="text-xs text-muted-foreground">
              {formatDate(item.createdAt)}
            </Span>
            <Span className="text-sm font-medium truncate pr-2">
              {item.firstName}
            </Span>
            <Span className="text-sm text-muted-foreground truncate pr-2">
              {item.email}
            </Span>
            <Badge
              variant={item.status === "SUCCESS" ? "default" : "destructive"}
              className="text-xs"
            >
              {item.status === "SUCCESS"
                ? t("widget.statusSuccess")
                : t("widget.statusFailed")}
            </Badge>
          </Div>
        ))}
      </Div>
    </Div>
  );
}
